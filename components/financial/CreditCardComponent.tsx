'use client';

import { motion } from 'framer-motion';
import { CreditCardData } from '@/types/card';
import { RewardBadge } from './RewardBadge';

interface CreditCardComponentProps {
  card: CreditCardData;
}

export function CreditCardComponent({ card }: CreditCardComponentProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative rounded-xl p-4 sm:p-6 overflow-hidden min-h-[240px] sm:min-h-[280px]"
      style={{
        background: card.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Card chip */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
        <svg 
          className="w-10 h-7 sm:w-12 sm:h-8 text-yellow-400" 
          viewBox="0 0 48 32" 
          fill="currentColor"
        >
          <rect width="48" height="32" rx="4" />
          <rect x="4" y="4" width="40" height="24" rx="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      
      {/* Card logo */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
        <img src={card.logo} alt={card.name} className="h-6 sm:h-8 object-contain" />
      </div>
      
      {/* Card name */}
      <div className="mt-14 sm:mt-16 mb-3 sm:mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">{card.name}</h3>
      </div>
      
      {/* Reward badge */}
      <div className="mb-3 sm:mb-4">
        <RewardBadge rate={card.rewardRate} />
      </div>
      
      {/* Features */}
      <ul className="mt-3 sm:mt-4 space-y-1 text-xs sm:text-sm text-white/80">
        {card.features.slice(0, 3).map((feature, idx) => (
          <li key={idx}>• {feature}</li>
        ))}
      </ul>
      
      {/* Action button */}
      <button 
        className="mt-4 sm:mt-6 w-full py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 hover:scale-[1.02] transition-all duration-200 font-medium text-sm sm:text-base"
        onClick={() => {
          if (card.applyUrl) {
            window.open(card.applyUrl, '_blank');
          }
        }}
      >
        {card.applyUrl ? 'Apply Now' : 'View Details'}
      </button>
    </motion.div>
  );
}
