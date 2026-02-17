'use client';

import { PresetPrompt } from './PresetPrompt';

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

const PRESET_PROMPTS = [
  'Buying an iPhone 15',
  'Trip to Goa',
  'Compare Amex vs SBI'
];

export function EmptyState({ onPromptClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Hero text */}
      <h1 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-8 sm:mb-12 text-center px-2"
        data-testid="empty-state-hero"
      >
        Where are you spending today?
      </h1>

      {/* Preset prompt cards */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-2">
        {PRESET_PROMPTS.map((prompt, index) => (
          <PresetPrompt
            key={index}
            prompt={prompt}
            onClick={onPromptClick}
          />
        ))}
      </div>
    </div>
  );
}
