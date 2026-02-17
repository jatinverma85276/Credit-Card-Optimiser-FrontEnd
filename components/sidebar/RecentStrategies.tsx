'use client';

import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

export function RecentStrategies() {
  const { chats, currentChatId, loadChat } = useChat();

  // Convert chats object to array and sort by updatedAt (most recent first)
  const chatList = Object.values(chats).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (chatList.length === 0) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Strategies</h3>
        <p className="text-sm text-slate-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Strategies</h3>
      <div className="space-y-1" role="list" aria-label="Recent conversations">
        {chatList.map((chat) => (
          <button
            key={chat.id}
            onClick={() => loadChat(chat.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ease-out',
              'hover:bg-slate-800 hover:scale-[1.02] hover:shadow-sm',
              currentChatId === chat.id 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300'
            )}
            role="listitem"
            aria-label={`Load conversation: ${chat.title}`}
            aria-current={currentChatId === chat.id ? 'true' : 'false'}
          >
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              <span className="text-sm truncate">{chat.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
