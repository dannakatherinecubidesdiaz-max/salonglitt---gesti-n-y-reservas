import React from 'react';
import { Card } from '@/components/ui/Card';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: React.ReactNode;
  colorScheme?: 'pink' | 'cyan' | 'yellow' | 'green';
  id?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon,
  colorScheme = 'pink',
  id,
}) => {
  const schemeStyles = {
    pink: {
      border: 'border-[#FF70A6]/30 hover:border-[#FF70A6]',
      glow: 'shadow-[0_8px_25px_rgba(255,112,166,0.15)]',
      iconBg: 'bg-[#FF70A6]/15 text-[#FF70A6] border-[#FF70A6]/40',
      valueColor: 'text-white',
      accent: 'text-[#FF70A6]',
    },
    cyan: {
      border: 'border-[#70D6FF]/30 hover:border-[#70D6FF]',
      glow: 'shadow-[0_8px_25px_rgba(112,214,255,0.15)]',
      iconBg: 'bg-[#70D6FF]/15 text-[#70D6FF] border-[#70D6FF]/40',
      valueColor: 'text-white',
      accent: 'text-[#70D6FF]',
    },
    yellow: {
      border: 'border-[#FFD670]/30 hover:border-[#FFD670]',
      glow: 'shadow-[0_8px_25px_rgba(255,214,112,0.15)]',
      iconBg: 'bg-[#FFD670]/15 text-[#FFD670] border-[#FFD670]/40',
      valueColor: 'text-white',
      accent: 'text-[#FFD670]',
    },
    green: {
      border: 'border-[#38E54D]/30 hover:border-[#38E54D]',
      glow: 'shadow-[0_8px_25px_rgba(56,229,77,0.15)]',
      iconBg: 'bg-[#38E54D]/15 text-[#38E54D] border-[#38E54D]/40',
      valueColor: 'text-white',
      accent: 'text-[#38E54D]',
    },
  }[colorScheme];

  return (
    <div
      id={id}
      className={`p-5 rounded-[24px] bg-gradient-to-br from-[#2A1B45] to-[#1E1332] border ${schemeStyles.border} ${schemeStyles.glow} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-heading font-medium uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5">
            <span className={schemeStyles.accent}>✦</span> {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-3 rounded-[16px] border ${schemeStyles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/5">
        {trend && (
          <span className={`font-semibold flex items-center gap-1 ${trendPositive ? 'text-[#38E54D]' : 'text-[#FF4B4B]'}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[#C8B6E2]/80 text-[11px] truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
