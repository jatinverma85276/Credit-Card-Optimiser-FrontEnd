'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Message, Chat, ChatContextValue } from '@/types/chat';
import { ChatStorage } from '@/types/memory';

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const STORAGE_KEY = 'swipesmart_chats';
const CACHE_SIZE = 5; // Cache the 5 most recent conversations

// In-memory cache for recent conversations
class ConversationCache {
  private cache: Map<string, Chat>;
  private accessOrder: string[];

  constructor(maxSize: number = CACHE_SIZE) {
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(chatId: string): Chat | undefined {
    const chat = this.cache.get(chatId);
    if (chat) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter(id => id !== chatId);
      this.accessOrder.push(chatId);
    }
    return chat;
  }

  set(chatId: string, chat: Chat): void {
    // Remove if already exists
    if (this.cache.has(chatId)) {
      this.accessOrder = this.accessOrder.filter(id => id !== chatId);
    }

    // Add to cache
    this.cache.set(chatId, chat);
    this.accessOrder.push(chatId);

    // Evict oldest if cache is full
    if (this.cache.size > CACHE_SIZE) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  has(chatId: string): boolean {
    return this.cache.has(chatId);
  }
}

// Global cache instance
const conversationCache = new ConversationCache();

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to get initial title from first message
const generateTitle = (messages: Message[]): string => {
  if (messages.length === 0) return 'New Chat';
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  return firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
};

// Helper to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Helper to load from localStorage
const loadFromStorage = (): ChatStorage | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Helper to save to localStorage with debouncing
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 500;

const saveToStorage = (data: ChatStorage): void => {
  if (!isLocalStorageAvailable()) return;
  
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Debounce the save operation
  saveTimeout = setTimeout(() => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Attempting to clear old data...');
        
        try {
          // Try to clear old conversations to make space
          const chatIds = Object.keys(data.chats);
          if (chatIds.length > 10) {
            // Sort by updatedAt and keep only the 10 most recent
            const sortedChats = chatIds
              .map(id => ({ id, updatedAt: data.chats[id].updatedAt }))
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 10);
            
            const trimmedChats: ChatStorage['chats'] = {};
            sortedChats.forEach(({ id }) => {
              trimmedChats[id] = data.chats[id];
            });
            
            const trimmedData: ChatStorage = {
              ...data,
              chats: trimmedChats
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
            console.log('Successfully trimmed old conversations');
          }
        } catch (retryError) {
          console.error('Failed to recover from quota exceeded:', retryError);
          // If we still can't save, we'll just continue without persistence
        }
      }
    }
  }, SAVE_DEBOUNCE_MS);
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isIncognito, setIsIncognito] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatStorage['chats']>({});
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Load saved conversations on mount
  useEffect(() => {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Enabling incognito mode.');
      setIsIncognito(true);
      setStorageWarning('Private browsing detected. Incognito mode enabled.');
      
      // Clear warning after 5 seconds
      setTimeout(() => setStorageWarning(null), 5000);
      return;
    }
    
    // Load threads from backend
    const loadThreads = async () => {
      try {
        const response = await fetch('/api/chat/threads');
        if (response && response.ok) {
          const data = await response.json();
          
          // Transform backend threads to frontend format
          const transformedChats: ChatStorage['chats'] = {};
          
          // Backend returns {threads: [...], count: number}
          const threads = data.threads || [];
          
          if (Array.isArray(threads)) {
            threads.forEach((thread: any) => {
              transformedChats[thread.thread_id] = {
                id: thread.thread_id,
                title: thread.thread_name || 'Chat',
                messages: [],
                createdAt: thread.created_at || new Date().toISOString(),
                updatedAt: thread.updated_at || new Date().toISOString()
              };
            });
            console.log(transformedChats, "Transformed Chat")
            setChats(transformedChats);
          }
        }
      } catch (error) {
        // Silently fail in test/development environments
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to load threads:', error);
        }
      }
    };
    
    const stored = loadFromStorage();
    if (stored) {
      setCurrentChatId(stored.currentChatId);
      setIsIncognito(stored.userPreferences.incognitoMode);
      
      // Load current chat messages if available
      if (stored.currentChatId && stored.chats[stored.currentChatId]) {
        const chat = stored.chats[stored.currentChatId];
        setMessages(chat.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        
        // Populate cache with current chat (convert to Chat type with Date objects)
        conversationCache.set(stored.currentChatId, {
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt)
        });
      }
    }
    
    // Load threads from backend
    loadThreads();
  }, []);

  // Save to localStorage whenever state changes (unless incognito)
  useEffect(() => {
    if (isIncognito) return;
    
    const storage: ChatStorage = {
      chats,
      currentChatId,
      userPreferences: {
        incognitoMode: isIncognito,
        spendingCategories: [],
        preferredCards: []
      }
    };
    
    saveToStorage(storage);
  }, [chats, currentChatId, isIncognito]);

  // Update chats when messages change (unless incognito)
  useEffect(() => {
    if (isIncognito || messages.length === 0) return;
    
    const chatId = currentChatId || generateId();
    
    const updatedChat = {
      id: chatId,
      title: generateTitle(messages),
      messages: messages,
      createdAt: chats[chatId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setChats(prev => ({
      ...prev,
      [chatId]: updatedChat
    }));
    
    // Update cache
    conversationCache.set(chatId, {
      ...updatedChat,
      createdAt: new Date(updatedChat.createdAt),
      updatedAt: new Date(updatedChat.updatedAt)
    });
    
    if (!currentChatId) {
      setCurrentChatId(chatId);
    }
  }, [messages, isIncognito]); // Don't include currentChatId or chats to avoid loops

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          chatId: currentChatId,
          includeMemory: !isIncognito
        })
      });
      
      if (!response.ok) {
        // Handle different HTTP error codes
        if (response.status === 408) {
          throw new Error('Request timed out. Please try again.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        } else if (response.status >= 500) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else {
          throw new Error('Failed to send message. Please try again.');
        }
      }
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setMemoryLoaded(data.memoryUsed);
      setLastFailedMessage(null);
      
      // Clear memory toast after 3 seconds
      if (data.memoryUsed) {
        setTimeout(() => setMemoryLoaded(false), 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Store the failed message for retry
      setLastFailedMessage(content);
      
      // Set user-friendly error message
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Connection failed. Please check your internet connection and try again.');
      }
      
      // Remove the user message from the UI since it failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, isIncognito, messages, chats]);

  const createNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    setMemoryLoaded(false);
  }, []);

  const loadChat = useCallback(async (chatId: string) => {
    // Try to load from cache first
    const cachedChat = conversationCache.get(chatId);
    if (cachedChat) {
      setCurrentChatId(chatId);
      setMessages(cachedChat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
      setMemoryLoaded(false);
      return;
    }

    // Try to load from backend
    try {
      const response = await fetch(`/api/chat/history/${chatId}`);
      if (response.ok) {
        const history = await response.json();
        
        // Transform backend history to frontend messages
        const messages: Message[] = history.messages?.map((msg: any) => ({
          id: msg.id || `msg_${Date.now()}_${Math.random()}`,
          role: msg.role || (msg.type === 'human' ? 'user' : 'assistant'),
          content: msg.content || msg.message || '',
          timestamp: new Date(msg.timestamp || Date.now())
        })) || [];
        
        setCurrentChatId(chatId);
        setMessages(messages);
        setMemoryLoaded(false);
        
        // Update cache
        const chat: Chat = {
          id: chatId,
          title: history.title || 'Chat',
          messages,
          createdAt: new Date(history.created_at || Date.now()),
          updatedAt: new Date(history.updated_at || Date.now())
        };
        conversationCache.set(chatId, chat);
        
        return;
      }
    } catch (error) {
      console.error('Failed to load chat history from backend:', error);
    }

    // Fall back to loading from chats state (which comes from localStorage)
    const chat = chats[chatId];
    if (!chat) return;
    
    // Convert to Chat type with Date objects and add to cache for future access
    const chatWithDates: Chat = {
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt)
    };
    conversationCache.set(chatId, chatWithDates);
    
    setCurrentChatId(chatId);
    setMessages(chat.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
    setMemoryLoaded(false);
  }, [chats]);

  const toggleIncognito = useCallback(() => {
    setIsIncognito(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const uploadAttachment = useCallback(async (file: File) => {
    // TODO: Implement file upload logic
    console.log('Upload attachment:', file.name);
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (lastFailedMessage) {
      await sendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, sendMessage]);

  const clearError = useCallback(() => {
    setApiError(null);
    setLastFailedMessage(null);
  }, []);

  const value: ChatContextValue = {
    messages,
    currentChatId,
    isIncognito,
    sidebarOpen,
    isLoading,
    memoryLoaded,
    apiError,
    storageWarning,
    chats,
    sendMessage,
    createNewChat,
    loadChat,
    toggleIncognito,
    toggleSidebar,
    uploadAttachment,
    retryLastMessage,
    clearError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
