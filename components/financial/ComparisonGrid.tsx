'use client';

import { ComparisonData } from '@/types/card';
import { cn } from '@/lib/utils';

interface ComparisonGridProps {
  data: ComparisonData;
}

export function ComparisonGrid({ data }: ComparisonGridProps) {
  const { cards, winner } = data;

  if (!cards || cards.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">
        No cards to compare
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 scroll-smooth">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-700 transition-colors duration-200">
            <th className="p-2 sm:p-3 text-left text-slate-400 font-medium text-sm">Feature</th>
            {cards.map((card) => (
              <th key={card.name} className="p-2 sm:p-3 text-left transition-all duration-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <img 
                    src={card.logo} 
                    alt={card.name} 
                    className="h-5 sm:h-6 object-contain" 
                  />
                  <span className="text-white font-semibold text-sm sm:text-base">{card.name}</span>
                  {winner === card.name && (
                    <span className="text-emerald-400 text-base sm:text-lg" title="Winner">
                      👑
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors duration-200">
            <td className="p-2 sm:p-3 text-slate-400 text-sm">Reward Rate</td>
            {cards.map((card) => (
              <td 
                key={card.name} 
                className={cn(
                  "p-2 sm:p-3 text-sm sm:text-base transition-all duration-200",
                  winner === card.name && "text-emerald-400 font-bold"
                )}
              >
                {card.rewardRate}%
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors duration-200">
            <td className="p-2 sm:p-3 text-slate-400 text-sm">Annual Fee</td>
            {cards.map((card) => (
              <td key={card.name} className="p-2 sm:p-3 text-white text-sm sm:text-base transition-all duration-200">
                ₹{card.annualFee.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Additional attributes - features */}
          {cards.some(card => card.features && card.features.length > 0) && (
            <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors duration-200">
              <td className="p-2 sm:p-3 text-slate-400 text-sm">Key Features</td>
              {cards.map((card) => (
                <td key={card.name} className="p-2 sm:p-3 text-white text-xs sm:text-sm transition-all duration-200">
                  {card.features && card.features.length > 0 ? (
                    <ul className="space-y-1">
                      {card.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
