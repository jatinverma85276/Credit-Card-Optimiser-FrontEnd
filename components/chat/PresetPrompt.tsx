'use client';

import { motion } from 'framer-motion';

interface PresetPromptProps {
  prompt: string;
  onClick: (prompt: string) => void;
}

export function PresetPrompt({ prompt, onClick }: PresetPromptProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => onClick(prompt)}
      className="w-full p-3 sm:p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors duration-200 border border-slate-700 hover:border-slate-600"
      data-testid="preset-prompt"
      aria-label={`Use preset prompt: ${prompt}`}
    >
      <p className="text-slate-100 text-sm sm:text-base">{prompt}</p>
    </motion.button>
  );
}
