import * as React from 'react';
import type { SourceReference } from '@/types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { formatDateTime } from '@/lib/utils';
import { Database } from 'lucide-react';

interface SourceTagProps {
  source: SourceReference;
  className?: string;
  showTime?: boolean;
}

export function SourceTag({ source, className = '', showTime = true }: SourceTagProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] text-[var(--astra-text-secondary)] ${className}`}>
      <Database className="h-3 w-3 text-[var(--astra-accent)] shrink-0" />
      <span className="font-medium text-[var(--astra-text-primary)]">{source.sourceName}</span>
      <ProvenanceBadge provenance={source.provenance} />
      {showTime && (
        <span className="font-mono text-[10px] text-[var(--astra-text-muted)]">
          {formatDateTime(source.observedAt)}
        </span>
      )}
    </div>
  );
}
