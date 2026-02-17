import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Chat Flow Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockFetch.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render ChatInterface with all components wired together', () => {
    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Verify empty state is shown initially
    expect(screen.getByText('Where are you spending today?')).toBeInTheDocument();
    
    // Verify preset prompts are present
    expect(screen.getByText('Buying an iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Trip to Goa')).toBeInTheDocument();
    expect(screen.getByText('Compare Amex vs SBI')).toBeInTheDocument();
    
    // Verify input zone is present
    expect(screen.getByPlaceholderText('Ask about credit cards...')).toBeInTheDocument();
    
    // Verify sidebar components are present
    expect(screen.getByText('New Chat')).toBeInTheDocument();
  });

  it('should complete end-to-end conversation flow', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_123',
            role: 'assistant',
            content: 'This is a test response',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Type a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'What is the best credit card?');
    
    // Submit the message
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for the user message to appear
    await waitFor(() => {
      expect(screen.getByText('What is the best credit card?')).toBeInTheDocument();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('This is a test response')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verify API was called correctly
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('What is the best credit card?'),
      })
    );

    // Verify empty state is no longer shown
    expect(screen.queryByText('Where are you spending today?')).not.toBeInTheDocument();
  });

  it('should handle preset prompt click', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_456',
            role: 'assistant',
            content: 'Here are the best cards for buying an iPhone',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Click preset prompt
    const presetPrompt = screen.getByText('Buying an iPhone 15');
    await user.click(presetPrompt);

    // Wait for the user message to be sent
    await waitFor(() => {
      expect(screen.getByText('Buying an iPhone 15')).toBeInTheDocument();
    });

    // Wait for AI response to appear
    await waitFor(() => {
      expect(screen.getByText('Here are the best cards for buying an iPhone')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle API errors with retry functionality', async () => {
    const user = userEvent.setup();
    
    // Mock failed API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Service temporarily unavailable' }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Type and send a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'Test message');
    
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for error banner to appear
    await waitFor(() => {
      expect(screen.getByText(/Service temporarily unavailable/i)).toBeInTheDocument();
    });

    // Verify retry button is present
    expect(screen.getByText('Retry')).toBeInTheDocument();

    // Mock successful retry
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_789',
            role: 'assistant',
            content: 'Retry successful',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    // Click retry button
    const retryButton = screen.getByText('Retry');
    await user.click(retryButton);

    // Wait for successful response
    await waitFor(() => {
      expect(screen.getByText('Retry successful')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle file upload integration', async () => {
    const user = userEvent.setup();

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Find the attachment button
    const attachButton = screen.getByLabelText('Attach file');
    expect(attachButton).toBeInTheDocument();

    // Create a mock file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

    // Find the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Upload the file
    await user.upload(fileInput, file);

    // Verify file was selected (uploadAttachment is called but currently just logs)
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('should persist conversation to localStorage when not in incognito mode', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_persist',
            role: 'assistant',
            content: 'Persisted response',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Send a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'Test persistence');
    
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for user message to appear
    await waitFor(() => {
      expect(screen.getByText('Test persistence')).toBeInTheDocument();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Persisted response')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Wait for localStorage to be updated (debounced)
    await waitFor(() => {
      const stored = localStorageMock.getItem('swipesmart_chats');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.chats).toBeDefined();
        expect(Object.keys(parsed.chats).length).toBeGreaterThan(0);
      }
    }, { timeout: 1500 });
  });

  it('should not persist conversation in incognito mode', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_incognito',
            role: 'assistant',
            content: 'Incognito response',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Enable incognito mode
    const incognitoToggle = screen.getByRole('switch', { name: /incognito mode/i });
    await user.click(incognitoToggle);

    // Send a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'Test incognito');
    
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for user message
    await waitFor(() => {
      expect(screen.getByText('Test incognito')).toBeInTheDocument();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Incognito response')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Wait a bit for any potential storage operations
    await new Promise(resolve => setTimeout(resolve, 600));

    // Verify localStorage is empty or doesn't contain the incognito chat
    const stored = localStorageMock.getItem('swipesmart_chats');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Should not have any chats or should be empty
      expect(Object.keys(parsed.chats || {}).length).toBe(0);
    }
  });

  it('should display memory toast when memory is used', async () => {
    const user = userEvent.setup();
    
    // Mock API response with memory used
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_memory',
            role: 'assistant',
            content: 'Response with memory',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: true,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Send a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'Test memory');
    
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for memory toast to appear
    await waitFor(() => {
      expect(screen.getByText('Context loaded from previous conversations')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle keyboard navigation (Enter to submit)', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_keyboard',
            role: 'assistant',
            content: 'Keyboard response',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Type a message and press Enter
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'Test keyboard{Enter}');

    // Wait for user message to be sent
    await waitFor(() => {
      expect(screen.getByText('Test keyboard')).toBeInTheDocument();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Keyboard response')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should create new chat and clear messages', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          message: {
            id: 'msg_new',
            role: 'assistant',
            content: 'First chat response',
            timestamp: new Date().toISOString(),
          },
          memoryUsed: false,
        }),
      } as Response)
    );

    render(
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    );

    // Send a message
    const input = screen.getByPlaceholderText('Ask about credit cards...');
    await user.type(input, 'First message');
    
    const sendButton = screen.getByLabelText('Send message');
    await user.click(sendButton);

    // Wait for user message
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('First chat response')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Click New Chat button
    const newChatButton = screen.getByText('New Chat');
    await user.click(newChatButton);

    // Verify empty state is shown again
    await waitFor(() => {
      expect(screen.getByText('Where are you spending today?')).toBeInTheDocument();
    });

    // Verify previous messages are cleared
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
    expect(screen.queryByText('First chat response')).not.toBeInTheDocument();
  });
});
