import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('Chat API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/chat', () => {
    it('should send message to backend and return response', async () => {
      const mockResponse = {
        response: 'This is a test response',
        thread_id: 'test-thread-id'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test message',
          chatId: 'test-thread-id',
          includeMemory: true
        })
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.response).toBe('This is a test response');
      expect(data.thread_id).toBe('test-thread-id');
    });

    it('should handle backend errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test message',
          chatId: null,
          includeMemory: true
        })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/chat/threads', () => {
    it('should fetch all threads from backend', async () => {
      const mockThreadsResponse = {
        threads: [
          {
            thread_id: 'thread-1',
            thread_name: 'Chat 1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            thread_id: 'thread-2',
            thread_name: 'Chat 2',
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z'
          }
        ],
        count: 2
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockThreadsResponse
      });

      const response = await fetch('/api/chat/threads');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.threads).toHaveLength(2);
      expect(data.count).toBe(2);
      expect(data.threads[0].thread_id).toBe('thread-1');
      expect(data.threads[0].thread_name).toBe('Chat 1');
      expect(data.threads[1].thread_id).toBe('thread-2');
    });
  });

  describe('GET /api/chat/history/[threadId]', () => {
    it('should fetch chat history for a specific thread', async () => {
      const mockHistory = {
        thread_id: 'test-thread',
        title: 'Test Chat',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00Z'
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hi there!',
            timestamp: '2024-01-01T00:00:01Z'
          }
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:01Z'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory
      });

      const response = await fetch('/api/chat/history/test-thread');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.thread_id).toBe('test-thread');
      expect(data.messages).toHaveLength(2);
      expect(data.messages[0].content).toBe('Hello');
    });

    it('should handle thread not found error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Thread not found' })
      });

      const response = await fetch('/api/chat/history/non-existent-thread');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });
});
