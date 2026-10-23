import * as React from 'react';
import type { DataProvenance, DataQuality } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProvenanceBadgeProps {
  provenance: DataProvenance;
  quality?: DataQuality;
  className?: string;
}

export function ProvenanceBadge({
  provenance,
  quality,
  className,
}: ProvenanceBadgeProps) {
  switch (provenance) {
    case 'live':
      return (
        <Badge variant="live" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1 animate-pulse" />
          LIVE {quality ? `· ${quality}` : ''}
        </Badge>
      );
    case 'cached':
      return (
        <Badge variant="cached" className={className}>
          CACHED
        </Badge>
      );
    case 'propagated':
      return (
        <Badge variant="propagated" className={className}>
          PROPAGATED
        </Badge>
      );
    case 'inferred':
      return (
        <Badge variant="secondary" className={className}>
          ANALYTICAL INFERENCE
        </Badge>
      );
    case 'demonstration':
    default:
      return (
        <Badge variant="demo" className={className}>
          DEMO RECORD
        </Badge>
      );
  }
}
