'use client';

import * as React from 'react';
import {
  Settings,
  ShieldCheck,
  Eye,
  Lock,
  Layers,
  BrainCircuit,
  Info,
  Check,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoBanner } from '@/components/shared/DemoBanner';

export default function SettingsPage() {
  const [showDemoBanner, setShowDemoBanner] = React.useState(true);
  const [compactLabels, setCompactLabels] = React.useState(false);
  const [cortexContext, setCortexContext] = React.useState(true);

  // Load preferences from localStorage on mount
  React.useEffect(() => {
    try {
      const savedDemo = localStorage.getItem('astra_pref_demo_banner');
      const savedCompact = localStorage.getItem('astra_pref_compact');
      const savedCortex = localStorage.getItem('astra_pref_cortex_ctx');

      queueMicrotask(() => {
        if (savedDemo !== null) setShowDemoBanner(savedDemo === 'true');
        if (savedCompact !== null) setCompactLabels(savedCompact === 'true');
        if (savedCortex !== null) setCortexContext(savedCortex === 'true');
      });
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleToggleDemo = () => {
    const next = !showDemoBanner;
    setShowDemoBanner(next);
    localStorage.setItem('astra_pref_demo_banner', String(next));
  };

  const handleToggleCompact = () => {
    const next = !compactLabels;
    setCompactLabels(next);
    localStorage.setItem('astra_pref_compact', String(next));
  };

  const handleToggleCortexContext = () => {
    const next = !cortexContext;
    setCortexContext(next);
    localStorage.setItem('astra_pref_cortex_ctx', String(next));
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto select-none p-4 space-y-4 bg-[var(--astra-bg-base)]">
      {/* Top Banner */}
      {showDemoBanner && (
        <DemoBanner
          domain="Application Settings & Privacy"
          message="ASTRA is architected as an anonymous-by-design intelligence console. No accounts, cookies, or user tracking profiles are retained."
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--astra-border)]">
        <div>
          <h1 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
            APPLICATION & PRIVACY SETTINGS
          </h1>
          <p className="text-xs text-[var(--astra-text-secondary)]">
            Local workstation configuration, cryptographic provenance, and zero-telemetry enforcement.
          </p>
        </div>
        <Badge variant="default" className="font-mono">
          PRIVACY BY DESIGN
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {/* Privacy & Zero-Retention Architecture */}
        <Card className="bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <h2 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
              PRIVACY & ZERO-RETENTION SPECIFICATION
            </h2>
          </div>
          <p className="text-xs text-[var(--astra-text-secondary)] leading-relaxed">
            ASTRA operates under strict anonymous-by-design requirements:
          </p>
          <ul className="space-y-2 text-xs text-[var(--astra-text-secondary)] font-mono">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
              <span>No user authentication, account credentials, or logins required.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
              <span>No persistent query history saved to remote servers or local databases.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
              <span>Zero third-party advertising SDKs, behavioral analytics, or tracking pixels.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
              <span>All frontend API communications use server-side credential proxies.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-[var(--astra-border-subtle)] text-[11px] text-[var(--astra-text-muted)] leading-relaxed">
            <span className="font-semibold text-[var(--astra-text-secondary)]">Infrastructure Note:</span> Web servers, edge CDNs, and network infrastructure may process ephemeral connection metadata (e.g. IP addresses, TLS handshakes) in compliance with standard network protocols.
          </div>
        </Card>

        {/* Display & Workstation Preferences */}
        <Card className="bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-4 p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--astra-accent)]" />
            <h2 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
              LOCAL WORKSTATION PREFERENCES
            </h2>
          </div>

          <div className="space-y-3">
            {/* Demo Banner Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)]">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-[var(--astra-text-primary)] font-mono">
                  DEMONSTRATION WATERMARK BANNER
                </span>
                <p className="text-[11px] text-[var(--astra-text-secondary)]">
                  Display persistent purple demonstration alerts at top of console.
                </p>
              </div>
              <Button
                variant={showDemoBanner ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggleDemo}
                className="font-mono text-xs h-7"
              >
                {showDemoBanner ? 'ENABLED' : 'MUTED'}
              </Button>
            </div>

            {/* Compact Labels Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)]">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-[var(--astra-text-primary)] font-mono">
                  COMPACT TELEMETRY LABELS
                </span>
                <p className="text-[11px] text-[var(--astra-text-secondary)]">
                  Compress coordinate readouts and navigation cards for high-density monitors.
                </p>
              </div>
              <Button
                variant={compactLabels ? 'default' : 'outline'}
                size="sm"
                onClick={handleToggleCompact}
                className="font-mono text-xs h-7"
              >
                {compactLabels ? 'COMPACT' : 'STANDARD'}
              </Button>
            </div>

            {/* CORTEX Context Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)]">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-[var(--cortex-accent)] font-mono">
                  CORTEX CONTEXTUAL TELEMETRY
                </span>
                <p className="text-[11px] text-[var(--astra-text-secondary)]">
                  Include active map selection in query context (ephemeral).
                </p>
              </div>
              <Button
                variant={cortexContext ? 'cortex' : 'outline'}
                size="sm"
                onClick={handleToggleCortexContext}
                className="font-mono text-xs h-7"
              >
                {cortexContext ? 'LINKED' : 'ISOLATED'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform & Canonical Metadata */}
      <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] max-w-5xl space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--astra-accent)]" />
          <h2 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
            SYSTEM SPECIFICATIONS & BUILD IDENTITY
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[var(--astra-text-muted)] block">PLATFORM</span>
            <span className="text-[var(--astra-text-primary)] font-bold">ASTRA</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--astra-text-muted)] block">INTEGRATED AI</span>
            <span className="text-[var(--cortex-accent)] font-bold">CORTEX</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--astra-text-muted)] block">BUILD VERSION</span>
            <span className="text-[var(--astra-text-primary)]">v0.1.0-DEMO</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--astra-text-muted)] block">TARGET ARCHITECTURE</span>
            <span className="text-[var(--astra-text-primary)]">FastAPI + PostGIS</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--astra-border-subtle)] text-[11px] text-[var(--astra-text-secondary)] leading-relaxed">
          Canonical names are <span className="font-bold text-white">ASTRA</span> (Situational Awareness) and <span className="font-bold text-[var(--cortex-accent)]">CORTEX</span> (Reasoning Assistant). All obsolete legacy naming conventions (JARVIS, OMNIS) have been expunged from the application codebase.
        </div>
      </Card>
    </div>
  );
}
