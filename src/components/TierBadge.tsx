import type { Tier } from '../data/mockData';
import { TIER_CONFIG } from '../data/mockData';

interface TierBadgeProps {
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function TierBadge({ tier, size = 'md', showIcon = true }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border
        ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} ${sizeClasses}`}
    >
      {showIcon && (
        <span className="font-black">{cfg.icon}</span>
      )}
      {cfg.sublabel ? cfg.sublabel : cfg.label}
    </span>
  );
}

interface TierDotProps {
  tier: Tier;
  size?: 'sm' | 'md';
}

export function TierDot({ tier, size = 'md' }: TierDotProps) {
  const cfg = TIER_CONFIG[tier];
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  return <span className={`${sizeClass} rounded-full ${cfg.bgClass} inline-block flex-shrink-0`} />;
}

export function TierPill({ tier, lang }: { tier: Tier; lang?: 'FIL' | 'ENG' }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-[10px] font-bold px-2 py-0.5 border
        ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
    >
      {lang && <span className="opacity-60 font-black">{lang}</span>}
      <span className="font-black">{cfg.icon}</span>
      {cfg.sublabel ?? cfg.label.split(' ')[0]}
    </span>
  );
}
