'use client';

import React, { useRef, useEffect, forwardRef, KeyboardEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface AutoExpandingTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AutoExpandingTextarea = forwardRef<HTMLTextAreaElement, AutoExpandingTextareaProps>(
  ({ value, onChange, onKeyDown, placeholder, className, disabled }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Auto-expand textarea based on content
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value, textareaRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Call parent handler if provided
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          'w-full resize-none bg-transparent text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:ring-0',
          'min-h-[40px] max-h-[50px] sm:max-h-[120px] overflow-y-auto',
          'text-base leading-normal', // Prevent iOS zoom on focus (minimum 16px) and consistent line height
          'transition-all duration-200',
          'flex items-center', // Ensure vertical centering
          className
        )}
      />
    );
  }
);

AutoExpandingTextarea.displayName = 'AutoExpandingTextarea';
