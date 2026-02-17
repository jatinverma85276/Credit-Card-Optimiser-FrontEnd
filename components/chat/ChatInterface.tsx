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

export function ChatInterface() {
  const { 
    messages, 
    memoryLoaded, 
    apiError, 
    storageWarning,
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
      <main className="flex-1 flex flex-col min-w-0" role="main" aria-label="Chat interface">
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
