import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'pink' | 'cyan' | 'mixed';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'h-6 w-full',
  variant = 'mixed',
  count = 1,
}) => {
  const getBg = (index: number) => {
    if (variant === 'pink') return 'bg-[#FF70A6]/20 border-[#FF70A6]/30';
    if (variant === 'cyan') return 'bg-[#70D6FF]/20 border-[#70D6FF]/30';
    // Mixed alternated
    return index % 2 === 0
      ? 'bg-[#FF70A6]/20 border-[#FF70A6]/20'
      : 'bg-[#70D6FF]/20 border-[#70D6FF]/20';
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-[16px] border ${getBg(i)} ${className}`}
        />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex gap-4">
        <Skeleton variant="pink" className="h-10 w-48 rounded-full" />
        <Skeleton variant="cyan" className="h-10 w-32 rounded-full" />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 rounded-[16px] bg-[#1E1332]/60 border border-[#FF70A6]/20">
          <Skeleton variant="pink" className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="cyan" className="h-4 w-1/3" />
            <Skeleton variant="pink" className="h-3 w-1/4" />
          </div>
          <Skeleton variant="cyan" className="h-6 w-24 rounded-full" />
          <Skeleton variant="pink" className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
