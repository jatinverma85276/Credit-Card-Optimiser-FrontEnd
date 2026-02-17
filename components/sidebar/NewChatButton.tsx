'use client';

import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

export function NewChatButton() {
  const { createNewChat } = useChat();

  return (
    <button
      onClick={createNewChat}
      className={cn(
        'w-full py-3 px-4 rounded-lg font-medium',
        'bg-gradient-to-r from-emerald-600 to-emerald-500',
        'text-white shadow-lg shadow-emerald-500/20',
        'hover:from-emerald-700 hover:to-emerald-600',
        'hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30',
        'active:scale-[0.98]',
        'transition-all duration-200 ease-out',
        'flex items-center justify-center gap-2'
      )}
      aria-label="Create new chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      New Chat
    </button>
  );
}
