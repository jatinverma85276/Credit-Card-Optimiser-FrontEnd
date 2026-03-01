'use client';

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { AutoExpandingTextarea } from './AutoExpandingTextarea';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export function InputZone() {
  const { sendMessage, isLoading, uploadAttachment } = useChat();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return;
    
    const messageToSend = value;
    setValue(''); // Clear input immediately for better UX
    
    try {
      await sendMessage(messageToSend);
    } catch {
      // If sending fails, restore the message
      setValue(messageToSend);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter allows newline (default behavior)
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Please upload a valid image (JPEG, PNG) or PDF file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size must be under 10MB. Please choose a smaller file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    try {
      await uploadAttachment(file);
      
      // Clear the file input on success
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      setErrorMessage('Failed to upload file. Please try again.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />
      <div className="sticky bottom-0 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto p-2 sm:p-4">
          <div className="relative group">
            {/* Glow effect on focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-500"></div>
            
            <div className="relative flex items-center gap-1 sm:gap-2 glass rounded-xl p-2 sm:p-3 shadow-2xl">
              {/* Attachment button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className={cn(
                  'p-2 sm:p-2.5 text-slate-400 hover:text-emerald-400 hover:scale-110 hover:rotate-12 transition-all duration-300 flex-shrink-0 rounded-lg hover:bg-emerald-500/10',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0',
                  'touch-manipulation'
                )}
                aria-label="Attach file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
              </button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf"
              />
              
              {/* Auto-expanding textarea */}
              <div className="flex-1 min-w-0">
                <AutoExpandingTextarea
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about cards..."
                  disabled={isLoading}
                  className="px-2 py-2"
                />
              </div>
              
              {/* Voice microphone button (UI only) */}
              <button
                disabled={isLoading}
                className={cn(
                  'p-2 sm:p-2.5 text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300 flex-shrink-0 rounded-lg hover:bg-indigo-500/10',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                  'touch-manipulation'
                )}
                aria-label="Voice input"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
              </button>
              
              {/* Send button with premium gradient */}
              <button
                onClick={handleSubmit}
                disabled={!value.trim() || isLoading}
                className={cn(
                  'relative p-2 sm:p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl transition-all duration-300 flex-shrink-0 overflow-hidden group/btn',
                  'hover:from-emerald-500 hover:to-teal-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 glow',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'disabled:hover:from-emerald-600 disabled:hover:to-teal-600 disabled:hover:scale-100 disabled:hover:shadow-none',
                  'touch-manipulation'
                )}
                aria-label="Send message"
              >
                {/* Shimmer effect on button */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover/btn:opacity-100"></div>
                
                {isLoading ? (
                  <svg
                    className="w-5 h-5 animate-spin relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
