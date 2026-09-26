import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bubble?: boolean;
  glow?: 'pink' | 'cyan' | 'yellow' | 'none';
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  bubble = true,
  glow = 'none',
  className = '',
  id,
  ...props
}) => {
  const glowStyles = {
    pink: 'shadow-[0_10px_35px_rgba(255,112,166,0.25)] border-[#FF70A6]/40',
    cyan: 'shadow-[0_10px_35px_rgba(112,214,255,0.25)] border-[#70D6FF]/40',
    yellow: 'shadow-[0_10px_35px_rgba(255,214,112,0.25)] border-[#FFD670]/40',
    none: 'shadow-[0_8px_30px_rgba(0,0,0,0.35)] border-[#FF70A6]/20',
  };

  const bgStyle = bubble
    ? 'bg-gradient-to-br from-[#2A1B45] via-[#201439] to-[#1E1332]'
    : 'bg-[#1E1332]';

  return (
    <div
      id={id}
      className={`rounded-[24px] border backdrop-blur-sm transition-all duration-300 ${bgStyle} ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
