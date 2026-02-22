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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`mb-3 md:mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.id}`}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
            : 'glass text-slate-100'
        }`}
      >
        {/* Subtle glow effect for AI messages */}
        {!isUser && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-50"></div>
        )}
        
        {/* Message content with markdown support */}
        <div className="relative prose prose-invert prose-sm sm:prose-base max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>

        {/* Render special components if present */}
        {message.components?.map((component, idx) => (
          <motion.div 
            key={idx} 
            className="relative mt-3 sm:mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <ComponentRenderer component={component} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
