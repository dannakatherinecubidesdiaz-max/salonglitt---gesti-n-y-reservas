import React from 'react';
import { AppointmentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pink' | 'cyan' | 'yellow' | 'success' | 'danger' | 'warning' | 'purple' | 'neutral';
  status?: AppointmentStatus;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  id?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  icon,
  id,
  className = '',
}) => {
  let resolvedVariant = variant || 'neutral';

  if (status) {
    switch (status) {
      case 'CONFIRMED':
        resolvedVariant = 'success';
        break;
      case 'CANCELLED':
        resolvedVariant = 'danger';
        break;
      case 'COMPLETED':
        resolvedVariant = 'yellow';
        break;
      case 'PENDING':
        resolvedVariant = 'cyan';
        break;
    }
  }

  const variantStyles = {
    pink: 'bg-[#FF70A6]/15 text-[#FF70A6] border-[#FF70A6]/40 shadow-[0_0_12px_rgba(255,112,166,0.25)]',
    cyan: 'bg-[#70D6FF]/15 text-[#70D6FF] border-[#70D6FF]/40 shadow-[0_0_12px_rgba(112,214,255,0.25)]',
    yellow: 'bg-[#FFD670]/15 text-[#FFD670] border-[#FFD670]/40 shadow-[0_0_12px_rgba(255,214,112,0.25)]',
    success: 'bg-[#38E54D]/15 text-[#38E54D] border-[#38E54D]/40 shadow-[0_0_12px_rgba(56,229,77,0.25)]',
    danger: 'bg-[#FF4B4B]/15 text-[#FF4B4B] border-[#FF4B4B]/40 shadow-[0_0_12px_rgba(255,75,75,0.25)]',
    warning: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40 shadow-[0_0_12px_rgba(255,184,0,0.25)]',
    purple: 'bg-[#C8B6E2]/15 text-[#C8B6E2] border-[#C8B6E2]/30',
    neutral: 'bg-white/5 text-gray-300 border-white/10',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-xs font-semibold',
    lg: 'px-4 py-1.5 text-sm font-bold',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide whitespace-nowrap transition-all duration-200 ${variantStyles[resolvedVariant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
