interface RewardBadgeProps {
  rate: number;
}

export function RewardBadge({ rate }: RewardBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 hover:scale-105">
      <span className="text-emerald-400 text-lg">⚡</span>
      <span className="text-emerald-400 font-semibold text-sm">
        {rate}% Rewards
      </span>
    </div>
  );
}
