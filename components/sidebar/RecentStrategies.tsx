'use client';

import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

export function RecentStrategies() {
  const { chats, currentChatId, loadChat, deleteChat, isIncognito } = useChat();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);

  // Convert chats object to array and sort by updatedAt (most recent first)
  const chatList = Object.values(chats).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDeleteClick = (e: React.MouseEvent, chatId: string, title: string) => {
    e.stopPropagation(); // Prevent triggering loadChat
    setChatToDelete({ id: chatId, title });
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;
    
    setDeletingId(chatToDelete.id);
    setChatToDelete(null);
    
    await deleteChat(chatToDelete.id);
    setDeletingId(null);
  };

  const handleCancelDelete = () => {
    setChatToDelete(null);
  };

  // Show message when in incognito mode
  if (isIncognito) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Strategies</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-purple-400 mb-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
          <p className="text-sm text-slate-400">
            Incognito mode is active
          </p>
          <p className="text-xs text-slate-500 mt-1">
            History is hidden
          </p>
        </div>
      </div>
    );
  }

  if (chatList.length === 0) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Strategies</h3>
        <p className="text-sm text-slate-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Strategies</h3>
        <div className="space-y-1" role="list" aria-label="Recent conversations">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'group relative w-full rounded-lg transition-all duration-200 ease-out',
                currentChatId === chat.id && 'bg-slate-800'
              )}
            >
              <button
                onClick={() => loadChat(chat.id)}
                disabled={deletingId === chat.id}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ease-out',
                  'hover:bg-slate-800 hover:scale-[1.02] hover:shadow-sm',
                  currentChatId === chat.id 
                    ? 'text-white' 
                    : 'text-slate-300',
                  deletingId === chat.id && 'opacity-50 cursor-not-allowed'
                )}
                role="listitem"
                aria-label={`Load conversation: ${chat.title}`}
                aria-current={currentChatId === chat.id ? 'true' : 'false'}
              >
                <div className="flex items-start gap-2 pr-8">
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
              
              {/* Delete button - shows on hover */}
              <button
                onClick={(e) => handleDeleteClick(e, chat.id, chat.title)}
                disabled={deletingId === chat.id}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md',
                  'text-slate-400 hover:text-red-400 hover:bg-slate-700',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                  deletingId === chat.id && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`Delete conversation: ${chat.title}`}
              >
                {deletingId === chat.id ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={chatToDelete !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title={chatToDelete?.title || ''}
      />
    </>
  );
}
