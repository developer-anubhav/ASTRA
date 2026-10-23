'use client';

import * as React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DemoBannerProps {
  message?: string;
  className?: string;
  domain?: string;
}

export function DemoBanner({
  message,
  className,
  domain,
}: DemoBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-between gap-3 px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs rounded select-none shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="flex h-2 w-2 shrink-0 rounded-full bg-purple-400 animate-pulse" />
        <span className="font-semibold text-purple-300 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-purple-900/50 border border-purple-400/30">
          DEMO MODE
        </span>
        <span className="truncate">
          {message ||
            (domain
              ? `Displaying simulated demonstration records for ${domain}. Not real-world observations.`
              : 'ASTRA is operating in demonstration mode with simulated records. No live intelligence feeds or authentic observations are implied.')}
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-purple-300 hover:text-purple-100 p-0.5 rounded transition-colors"
        title="Dismiss notice"
        aria-label="Dismiss notice"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
