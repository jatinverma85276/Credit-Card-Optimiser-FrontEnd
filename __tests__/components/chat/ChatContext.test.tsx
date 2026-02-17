import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ChatContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: ({ children }) => <ChatProvider>{children}</ChatProvider>
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentChatId).toBeNull();
    expect(result.current.isIncognito).toBe(false);
    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.memoryLoaded).toBe(false);
  });

  it('should create new chat', () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: ({ children }) => <ChatProvider>{children}</ChatProvider>
    });

    act(() => {
      result.current.createNewChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentChatId).toBeNull();
    expect(result.current.memoryLoaded).toBe(false);
  });

  it('should toggle incognito mode', () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: ({ children }) => <ChatProvider>{children}</ChatProvider>
    });

    expect(result.current.isIncognito).toBe(false);

    act(() => {
      result.current.toggleIncognito();
    });

    expect(result.current.isIncognito).toBe(true);

    act(() => {
      result.current.toggleIncognito();
    });

    expect(result.current.isIncognito).toBe(false);
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: ({ children }) => <ChatProvider>{children}</ChatProvider>
    });

    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);
  });

  it('should throw error when useChat is used outside provider', () => {
    expect(() => {
      renderHook(() => useChat());
    }).toThrow('useChat must be used within a ChatProvider');
  });
});
