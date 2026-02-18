import { useState, useCallback } from 'react';
import axios from 'axios';

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
      const response = await axios.get('/api/chat/threads');
      const data: ThreadsResponse = response.data;
      return data.threads || [];
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : 'Unknown error';
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
      const response = await axios.get(`/api/chat/history/${threadId}`);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Thread not found');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch chat history');
        }
      } else {
        setError('Unknown error');
      }
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
      const response = await axios.post('/api/chat', {
        message,
        chatId: threadId,
        includeMemory: true
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Unknown error';
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
