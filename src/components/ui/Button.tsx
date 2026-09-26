import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'cyan' | 'bubble' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  sparkle?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'pink',
  size = 'md',
  sparkle = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-heading font-medium tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer rounded-full select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    pink: 'bg-gradient-to-r from-[#FF70A6] to-[#FF4D8B] text-white hover:brightness-110 shadow-[0_8px_20px_rgba(255,112,166,0.35)] hover:shadow-[0_10px_25px_rgba(255,112,166,0.5)] border border-[#FF70A6]/60',
    cyan: 'bg-gradient-to-r from-[#70D6FF] to-[#38B6FF] text-[#120B1C] font-semibold hover:brightness-110 shadow-[0_8px_20px_rgba(112,214,255,0.35)] hover:shadow-[0_10px_25px_rgba(112,214,255,0.5)] border border-[#70D6FF]/60',
    bubble: 'bg-[#2A1B45] text-[#C8B6E2] hover:text-white border border-[#FF70A6]/30 hover:border-[#FF70A6] hover:bg-[#342257] shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
    ghost: 'bg-transparent text-[#C8B6E2] hover:text-white hover:bg-white/5 border border-transparent',
    danger: 'bg-gradient-to-r from-[#FF4B4B] to-[#D92D20] text-white hover:brightness-110 shadow-[0_8px_20px_rgba(255,75,75,0.35)] border border-[#FF4B4B]/60',
    outline: 'bg-transparent text-[#FF70A6] border border-[#FF70A6] hover:bg-[#FF70A6]/10 shadow-[0_0_15px_rgba(255,112,166,0.2)]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {sparkle && <span className="text-[#FFD670] animate-twinkle">✦</span>}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
