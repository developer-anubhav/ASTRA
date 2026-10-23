import * as React from 'react';
import type { DataFreshness } from '@/types';
import { timeAgo, formatDateTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface DataFreshnessIndicatorProps {
  freshness: DataFreshness;
  compact?: boolean;
  className?: string;
}

export function DataFreshnessIndicator({
  freshness,
  compact = false,
  className = '',
}: DataFreshnessIndicatorProps) {
  if (!freshness.lastUpdated) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-[var(--astra-text-muted)] ${className}`}>
        <span className="h-2 w-2 rounded-full bg-gray-500" />
        <span>No observation data</span>
      </div>
    );
  }

  const isStale = freshness.isStale;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 text-[11px] font-mono ${className}`}
        title={`Updated: ${formatDateTime(freshness.lastUpdated)}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isStale ? 'bg-amber-400' : 'bg-green-400 animate-pulse'
          }`}
        />
        <span className={isStale ? 'text-amber-400' : 'text-[var(--astra-text-secondary)]'}>
          {timeAgo(freshness.lastUpdated)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <Clock className="h-3.5 w-3.5 text-[var(--astra-text-secondary)] shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              isStale ? 'bg-amber-400' : 'bg-green-400 animate-pulse'
            }`}
          />
          <span className="font-medium text-[var(--astra-text-primary)]">
            {isStale ? 'Stale observation' : 'Fresh observation'}
          </span>
          <span className="font-mono text-[var(--astra-text-secondary)]">
            ({timeAgo(freshness.lastUpdated)})
          </span>
        </div>
        {freshness.coverageNote && (
          <span className="text-[10px] text-[var(--astra-text-muted)] mt-0.5">
            {freshness.coverageNote}
          </span>
        )}
      </div>
    </div>
  );
}
