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
        'relative w-full py-3.5 px-4 rounded-xl font-medium overflow-hidden group',
        'bg-gradient-to-r from-emerald-600 to-teal-600',
        'text-white shadow-lg',
        'hover:from-emerald-500 hover:to-teal-500',
        'hover:scale-[1.02] hover:shadow-xl glow',
        'active:scale-[0.98]',
        'transition-all duration-300 ease-out',
        'flex items-center justify-center gap-2'
      )}
      aria-label="Create new chat"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
      
      {/* Icon and text */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span className="relative z-10">New Chat</span>
    </button>
  );
}
