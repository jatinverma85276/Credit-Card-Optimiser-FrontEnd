'use client';

import { useChat } from '@/contexts/ChatContext';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { EmptyState } from './EmptyState';
import { MessageStream } from './MessageStream';
import { InputZone } from '@/components/input/InputZone';
import { MemoryToast } from '@/components/ui/MemoryToast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ApiErrorBanner } from '@/components/ui/ApiErrorBanner';
import { StorageWarningToast } from '@/components/ui/StorageWarningToast';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { 
    messages, 
    memoryLoaded, 
    apiError, 
    storageWarning,
    isIncognito,
    sendMessage, 
    retryLastMessage, 
    clearError 
  } = useChat();
  const isEmpty = messages.length === 0;

  const handlePromptClick = async (prompt: string) => {
    await sendMessage(prompt);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar navigation */}
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      
      {/* Main chat area */}
      <main 
        className={cn(
          "flex-1 flex flex-col min-w-0 relative",
          isIncognito && "bg-slate-900/50"
        )} 
        role="main" 
        aria-label="Chat interface"
      >
        {/* Incognito Mode Banner */}
        {isIncognito && (
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-purple-700/30 px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
            <span className="text-purple-200 font-medium">
              Incognito Mode Active
            </span>
            <span className="text-purple-300/70 text-xs">
              • Conversations won't be saved
            </span>
          </div>
        )}

        {/* Memory toast notification */}
        <MemoryToast show={memoryLoaded} />
        
        {/* Storage warning toast */}
        <StorageWarningToast message={storageWarning} />
        
        {/* API Error Banner */}
        <ApiErrorBanner 
          error={apiError} 
          onRetry={retryLastMessage} 
          onDismiss={clearError} 
        />
        
        {/* Conditionally render EmptyState or MessageStream */}
        <ErrorBoundary>
          {isEmpty ? (
            <EmptyState onPromptClick={handlePromptClick} />
          ) : (
            <MessageStream messages={messages} />
          )}
        </ErrorBoundary>
        
        {/* Input zone at bottom */}
        <ErrorBoundary>
          <InputZone />
        </ErrorBoundary>
      </main>
    </div>
  );
}
