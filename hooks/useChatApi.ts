import { useState, useCallback } from 'react';

interface Thread {
  thread_id: string;
  thread_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface ThreadsResponse {
  threads: Thread[];
  count: number;
}

interface ChatHistoryMessage {
  id?: string;
  role?: string;
  type?: string;
  content?: string;
  message?: string;
  timestamp?: string;
}

interface ChatHistory {
  thread_id: string;
  title?: string;
  messages?: ChatHistoryMessage[];
  created_at?: string;
  updated_at?: string;
}

export function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async (): Promise<Thread[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat/threads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      
      const data: ThreadsResponse = await response.json();
      return data.threads || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChatHistory = useCallback(async (threadId: string): Promise<ChatHistory | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/chat/history/${threadId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Thread not found');
        }
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    message: string,
    threadId: string | null
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          chatId: threadId,
          includeMemory: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchThreads,
    fetchChatHistory,
    sendMessage
  };
}
