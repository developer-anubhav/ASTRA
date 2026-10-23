'use client';

import * as React from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Lock,
  ExternalLink,
  Code,
  Info,
  Server,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { sourcesService } from '@/services';
import type { DataSource, SourceDomain, SourceStatus } from '@/types';

export default function SourcesPage() {
  const [sources, setSources] = React.useState<DataSource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');

  React.useEffect(() => {
    async function loadSources() {
      setLoading(true);
      try {
        const res = await sourcesService.getSources();
        if (res.data) setSources(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, []);

  const domains: SourceDomain[] = [
    'maritime',
    'aviation',
    'space',
    'events',
    'environment',
  ];

  const filteredSources = sources.filter((s) =>
    selectedDomain === 'all' ? true : s.domain === selectedDomain
  );

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto select-none p-4 space-y-4 bg-[var(--astra-bg-base)]">
      {/* Top Banner */}
      <DemoBanner
        domain="Source Provenance & Adapter Registry"
        message="Reviewing candidate data provider configurations and live ingestion status. Unconfigured sources require verified API credentials."
      />

      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--astra-border)]">
        <div>
          <h1 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
            DATA SOURCES & COVERAGE DIRECTORY
          </h1>
          <p className="text-xs text-[var(--astra-text-secondary)]">
            Verified provenance, provider rate quotas, licensing boundaries, and architectural endpoints.
          </p>
        </div>
        <Badge variant="default" className="font-mono">
          PROVENANCE MODEL
        </Badge>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Button
          variant={selectedDomain === 'all' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3 text-xs font-mono"
          onClick={() => setSelectedDomain('all')}
        >
          ALL DOMAINS ({sources.length})
        </Button>
        {domains.map((d) => (
          <Button
            key={d}
            variant={selectedDomain === d ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs font-mono uppercase"
            onClick={() => setSelectedDomain(d)}
          >
            {d}
          </Button>
        ))}
      </div>

      {/* Source Cards Grid */}
      {loading ? (
        <LoadingSpinner label="Auditing provider status..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSources.map((src) => {
            const isActive = src.status === 'active';
            const isUnconfigured = src.status === 'unconfigured';

            return (
              <Card
                key={src.id}
                className="bg-[var(--astra-bg-surface)] border-[var(--astra-border)] flex flex-col justify-between p-4 space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-xs font-mono text-[var(--astra-text-primary)]">
                        {src.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase text-[var(--astra-accent)] block">
                        {src.domain}
                      </span>
                    </div>
                    <Badge
                      variant={isActive ? 'live' : 'secondary'}
                      className="text-[9px] font-mono"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1 ${
                          isActive ? 'bg-green-400' : 'bg-gray-400'
                        }`}
                      />
                      {src.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--astra-text-secondary)] leading-relaxed">
                    {src.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--astra-border-subtle)] text-[11px] font-mono">
                  {src.coverageNote && (
                    <div className="text-[10px] text-[var(--astra-text-muted)] leading-tight">
                      <span className="text-[var(--astra-text-secondary)] font-semibold">COVERAGE:</span> {src.coverageNote}
                    </div>
                  )}

                  {src.rateLimitNote && (
                    <div className="text-[10px] text-[var(--astra-text-muted)] leading-tight">
                      <span className="text-[var(--astra-text-secondary)] font-semibold">QUOTA:</span> {src.rateLimitNote}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {src.isDemo && <Badge variant="demo">DEMO ADAPTER</Badge>}
                    {src.requiresApiKey && (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-300">
                        <Lock className="h-2.5 w-2.5 mr-1" />
                        API KEY REQ
                      </Badge>
                    )}
                    {src.attributionRequired && (
                      <Badge variant="outline">ATTRIBUTION REQ</Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Planned API REST Contracts Section */}
      <Card className="p-4 bg-[var(--astra-bg-surface)] border-[var(--astra-border)] space-y-3">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-[var(--astra-accent)]" />
          <h2 className="font-mono text-xs font-semibold text-[var(--astra-text-primary)] uppercase">
            FUTURE FASTAPI BACKEND CONTRACT (PLANNED ENDPOINTS)
          </h2>
        </div>
        <p className="text-xs text-[var(--astra-text-secondary)]">
          The frontend service interface maps directly to the following proposed REST specifications for ingestion microservices:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
          {[
            { method: 'GET', path: '/api/v1/maritime', desc: 'Vessel positions, MMSI registry, and nav status' },
            { method: 'GET', path: '/api/v1/aircraft', desc: 'ADS-B / Mode S airframe surveillance fixes' },
            { method: 'GET', path: '/api/v1/satellites', desc: 'Two-line element (TLE) orbital catalog data' },
            { method: 'GET', path: '/api/v1/events', desc: 'Global verified events and reported claims' },
            { method: 'GET', path: '/api/v1/sources', desc: 'Provider health, latency, and quota exhaustion' },
            { method: 'POST', path: '/api/v1/assistant/query', desc: 'CORTEX multi-domain reasoning payload' },
          ].map((ep) => (
            <div
              key={ep.path}
              className="p-2 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                }`}>
                  {ep.method}
                </span>
                <span className="text-[var(--astra-text-primary)] font-semibold">{ep.path}</span>
              </div>
              <span className="text-[10px] text-[var(--astra-text-muted)] truncate max-w-[180px]">
                {ep.desc}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Provenance Architecture Guidelines */}
      <div className="p-3.5 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] space-y-2 text-xs text-[var(--astra-text-secondary)]">
        <div className="flex items-center gap-2 text-[var(--astra-text-primary)] font-semibold font-mono">
          <ShieldCheck className="h-4 w-4 text-[var(--astra-accent)]" />
          <span>DATA PROVENANCE GUARANTEE</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          ASTRA strictly distinguishes between directly observed sensor telemetry (<span className="text-green-400 font-mono">live</span>), cached historical observations (<span className="text-amber-400 font-mono">cached</span>), orbital position calculations (<span className="text-blue-400 font-mono">propagated</span>), and synthetic test fixtures (<span className="text-purple-400 font-mono">demonstration</span>). No simulated activity is ever presented as authentic reality.
        </p>
      </div>
    </div>
  );
}
