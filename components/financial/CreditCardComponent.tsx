'use client';

import { motion } from 'framer-motion';
import { CreditCardData } from '@/types/card';
import { RewardBadge } from './RewardBadge';
import { useState } from 'react';

interface CreditCardComponentProps {
  card: CreditCardData;
}

export function CreditCardComponent({ card }: CreditCardComponentProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="perspective-1000"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative rounded-2xl p-5 sm:p-7 overflow-hidden min-h-[260px] sm:min-h-[300px] shadow-2xl cursor-pointer"
        style={{
          background: card.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 shimmer opacity-30"></div>
        
        {/* Card chip with 3D effect */}
        <div className="absolute top-5 sm:top-7 left-5 sm:left-7" style={{ transform: 'translateZ(20px)' }}>
          <svg 
            className="w-11 h-8 sm:w-14 sm:h-10 text-yellow-400 drop-shadow-lg" 
            viewBox="0 0 48 32" 
            fill="currentColor"
          >
            <rect width="48" height="32" rx="4" />
            <rect x="4" y="4" width="40" height="24" rx="2" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        
        {/* Card logo */}
        <div className="absolute top-5 sm:top-7 right-5 sm:right-7" style={{ transform: 'translateZ(20px)' }}>
          <img src={card.logo} alt={card.name} className="h-7 sm:h-10 object-contain drop-shadow-lg" />
        </div>
        
        {/* Card name */}
        <div className="mt-16 sm:mt-20 mb-3 sm:mb-4 relative" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{card.name}</h3>
        </div>
        
        {/* Reward badge */}
        <div className="mb-3 sm:mb-4 relative" style={{ transform: 'translateZ(25px)' }}>
          <RewardBadge rate={card.rewardRate} />
        </div>
        
        {/* Features */}
        <ul className="mt-3 sm:mt-4 space-y-1.5 text-xs sm:text-sm text-white/90 relative" style={{ transform: 'translateZ(20px)' }}>
          {card.features.slice(0, 3).map((feature, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-emerald-300 mt-0.5">✓</span>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
        
        {/* Action button with premium effect */}
        <button 
          className="relative mt-5 sm:mt-6 w-full py-2.5 sm:py-3 glass rounded-xl text-white font-medium text-sm sm:text-base overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg"
          onClick={() => {
            if (card.applyUrl) {
              window.open(card.applyUrl, '_blank');
            }
          }}
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Button shimmer */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {card.applyUrl ? 'Apply Now' : 'View Details'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
