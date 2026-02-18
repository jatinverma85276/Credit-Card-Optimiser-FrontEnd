'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Message as MessageType } from '@/types/chat';
import { Message } from './Message';
import { motion } from 'framer-motion';

interface MessageStreamProps {
  messages: MessageType[];
}

export function MessageStream({ messages }: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useChat();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={streamRef}
      className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 scroll-smooth"
      data-testid="message-stream"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
        />
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mb-3 md:mb-4 flex justify-start"
          data-testid="loading-indicator"
          role="status"
          aria-label="Processing message"
        >
          <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-slate-800 text-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="text-sm text-slate-400">Processing...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
