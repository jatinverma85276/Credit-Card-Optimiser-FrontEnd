'use client';

import { useRef, useEffect } from 'react';
import { Message as MessageType } from '@/types/chat';
import { Message } from './Message';

interface MessageStreamProps {
  messages: MessageType[];
}

export function MessageStream({ messages }: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

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
    </div>
  );
}
