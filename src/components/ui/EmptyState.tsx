import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  iconText?: string;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  iconText = '✦',
  id,
}) => {
  return (
    <div
      id={id}
      className="w-full p-8 md:p-12 rounded-[24px] border border-[#FF70A6]/30 bg-gradient-to-b from-[#2A1B45]/70 via-[#1E1332]/90 to-[#120B1C]/90 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-[0_10px_30px_rgba(255,112,166,0.15)]"
    >
      {/* Background Decorative Y2K Glow Orbs */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FF70A6]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#70D6FF]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-16 h-16 rounded-full bg-[#FF70A6]/20 border border-[#FF70A6] flex items-center justify-center text-3xl text-[#FFD670] shadow-[0_0_20px_rgba(255,112,166,0.5)] mb-4 animate-bounce duration-1000">
        <span>{iconText}</span>
      </div>

      <h3 className="font-heading font-semibold text-lg md:text-xl text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#C8B6E2] max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button
          variant="pink"
          size="md"
          sparkle
          onClick={onAction}
          className="shadow-[0_8px_25px_rgba(255,112,166,0.4)]"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
