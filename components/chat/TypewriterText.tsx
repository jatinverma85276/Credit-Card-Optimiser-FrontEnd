'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  content: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

export function TypewriterText({ 
  content, 
  speed = 30, 
  onComplete 
}: TypewriterTextProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === content.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, content, speed, onComplete]);

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent('');
    setCurrentIndex(0);
  }, [content]);

  return (
    <span className="inline">
      {displayedContent}
      {currentIndex < content.length && (
        <span className="animate-pulse">▋</span>
      )}
    </span>
  );
}
