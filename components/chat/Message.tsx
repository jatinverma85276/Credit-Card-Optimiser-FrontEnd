'use client';

import { motion } from 'framer-motion';
import { Message as MessageType } from '@/types/chat';
import { MarkdownRenderer } from '@/lib/markdown';
import { ComponentRenderer } from '@/lib/componentRenderer';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`mb-3 md:mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.id}`}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-800 text-slate-100'
        }`}
      >
        {/* Message content with markdown support */}
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>

        {/* Render special components if present */}
        {message.components?.map((component, idx) => (
          <div key={idx} className="mt-3 sm:mt-4">
            <ComponentRenderer component={component} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
