import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[var(--astra-border)] bg-[var(--astra-bg-surface)]/50 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--astra-bg-elevated)] border border-[var(--astra-border-bright)] mb-3">
        <Icon className="h-6 w-6 text-[var(--astra-text-secondary)]" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--astra-text-primary)] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[var(--astra-text-secondary)] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
