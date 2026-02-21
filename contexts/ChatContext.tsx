'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Message, Chat, ChatContextValue } from '@/types/chat';
import { ChatStorage } from '@/types/memory';
import { useAuth } from '@/contexts/AuthContext';

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

// Helper to generate unique IDs (UUID v4 format)
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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
  const { user } = useAuth();
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

  // Load saved conversations on mount and when user changes
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
    
    // Load threads from backend based on user
    const loadThreads = async () => {
      if (!user) {
        // Clear chats if no user is logged in
        setChats({});
        return;
      }

      try {
        const response = await axios.get(`/api/chat/threads?userId=${user.id}`);
        const data = response.data;
        
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
      } catch (error) {
        // Silently fail in test/development environments
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to load threads:', error);
        }
      }
    };
    
    const stored = loadFromStorage();
    if (stored) {
      // Only restore incognito preference, not the current chat
      setIsIncognito(stored.userPreferences.incognitoMode);
      
      // Don't restore currentChatId or messages - always start fresh
      // This ensures page refresh gives a new chat window
    }
    
    // Load threads from backend when user is available
    loadThreads();
  }, [user]); // Re-run when user changes (login/logout)

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
    
    // Generate a new chat ID if this is the first message in a new chat
    const chatId = currentChatId || generateId();
    
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    
    // Set the chat ID immediately if it's a new chat
    if (!currentChatId) {
      setCurrentChatId(chatId);
    }
    
    try {
      // Call chat API with incognito flag
      const response = await axios.post('/api/chat', {
        message: content,
        chatId: chatId, // Always pass thread_id, even in incognito mode
        includeMemory: !isIncognito,
        incognito: isIncognito,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email
        } : null
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = response.data;
      
      // Update chat ID if backend returns a different one (only for non-incognito)
      if (!isIncognito && data.threadId && data.threadId !== chatId) {
        setCurrentChatId(data.threadId);
      }
      
      // Add AI response
      const aiMessage: Message = {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setMemoryLoaded(!isIncognito && data.memoryUsed);
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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 408) {
          setApiError('Request timed out. Please try again.');
        } else if (error.response?.status === 429) {
          setApiError('Too many requests. Please wait a moment.');
        } else if (error.response?.status && error.response.status >= 500) {
          setApiError('Service temporarily unavailable. Please try again later.');
        } else {
          setApiError(error.response?.data?.error || 'Failed to send message. Please try again.');
        }
      } else if (error instanceof Error) {
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
    
    try {
      const response = await axios.get(`/api/chat/history/${chatId}`);
      const history = response.data;
      
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
    setIsIncognito(prev => {
      const newValue = !prev;
      
      // Clear current chat when toggling incognito mode (both ON and OFF)
      setMessages([]);
      setCurrentChatId(null);
      setMemoryLoaded(false);
      
      return newValue;
    });
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

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      // Call backend delete API
      await axios.delete(`/api/chat/threads/${chatId}`);
      
      // Remove from local state
      setChats(prev => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
      
      // Remove from cache
      conversationCache.clear();
      
      // If the deleted chat is currently active, clear it
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      setApiError('Failed to delete conversation. Please try again.');
      return false;
    }
  }, [currentChatId]);

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
    clearError,
    deleteChat
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
