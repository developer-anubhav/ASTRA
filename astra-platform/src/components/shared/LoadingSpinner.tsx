import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  label = 'Loading intelligence data...',
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6 text-[var(--astra-text-secondary)]',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-[var(--astra-accent)]', sizeMap[size])}
      />
      {label && <span className="text-xs font-mono">{label}</span>}
    </div>
  );
}
