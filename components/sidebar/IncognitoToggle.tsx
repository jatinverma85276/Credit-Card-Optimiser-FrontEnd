'use client';

import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

export function IncognitoToggle() {
  const { isIncognito, toggleIncognito } = useChat();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
        <span className="text-sm text-slate-300">Incognito Mode</span>
      </div>
      
      <button
        onClick={toggleIncognito}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-out',
          'hover:scale-110 hover:shadow-md',
          isIncognito ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-700 hover:bg-slate-600'
        )}
        role="switch"
        aria-checked={isIncognito}
        aria-label="Toggle incognito mode"
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out',
            isIncognito ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}
