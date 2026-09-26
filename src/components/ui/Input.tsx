import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  rightAction,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#C8B6E2] flex items-center gap-1.5">
          <span className="text-[#FF70A6]">✦</span>
          <span>{label}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-[#C8B6E2] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#120B1C]/80 text-white placeholder-[#C8B6E2]/40 rounded-[16px] border ${
            error
              ? 'border-[#FF4B4B] focus:border-[#FF4B4B] focus:ring-2 focus:ring-[#FF4B4B]/30'
              : 'border-[#FF70A6]/30 focus:border-[#FF70A6] focus:ring-2 focus:ring-[#FF70A6]/20'
          } ${icon ? 'pl-11' : 'pl-4'} ${rightAction ? 'pr-12' : 'pr-4'} py-3 text-sm transition-all duration-200 outline-none hover:border-[#FF70A6]/50 ${className}`}
          {...props}
        />
        {rightAction && (
          <div className="absolute right-3 flex items-center">
            {rightAction}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[#FF4B4B] font-medium flex items-center gap-1 mt-0.5">
          <span>⚠</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#C8B6E2]/70 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
