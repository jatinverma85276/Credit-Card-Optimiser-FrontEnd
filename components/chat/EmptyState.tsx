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
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero text with gradient */}
      <div className="relative z-10 mb-8 sm:mb-12">
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center px-2 gradient-text"
          data-testid="empty-state-hero"
        >
          Where are you spending today?
        </h1>
        <p className="text-slate-400 text-center text-sm sm:text-base max-w-md mx-auto">
          Get personalized credit card recommendations powered by AI
        </p>
      </div>

      {/* Preset prompt cards with 3D effect */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-2 relative z-10">
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
