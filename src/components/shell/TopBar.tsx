'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Clock,
  BrainCircuit,
  Activity,
  Layers,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatUtc } from '@/lib/utils';
import Link from 'next/link';

export function TopBar() {
  const router = useRouter();
  const [utcTime, setUtcTime] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-[var(--astra-border)] bg-[var(--astra-bg-surface)] px-4 z-20 gap-4 select-none">
      {/* Global Search Input */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entities, callsigns, MMSI, regions, or events..."
          className="w-full h-8 pl-8 pr-3 text-xs bg-[var(--astra-bg-base)] border border-[var(--astra-border)] rounded text-[var(--astra-text-primary)] placeholder:text-[var(--astra-text-muted)] focus:outline-none focus:border-[var(--astra-accent)] transition-colors font-mono"
        />
      </form>

      {/* Right status indicators & quick actions */}
      <div className="flex items-center gap-3">
        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)] font-mono text-xs text-[var(--astra-text-primary)]">
          <Clock className="h-3.5 w-3.5 text-[var(--astra-accent)] shrink-0" />
          <span className="tabular-nums font-semibold">{utcTime || 'SYNCHRONIZING UTC...'}</span>
        </div>

        {/* Global System Freshness */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)] text-xs text-[var(--astra-text-secondary)]">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[11px]">FEEDS OK</span>
        </div>

        {/* Demonstration Mode Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-[10px] font-mono font-semibold text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span>SIMULATED ADAPTERS</span>
        </div>

        {/* CORTEX Fast Access Button */}
        <Link href="/assistant">
          <Button
            size="sm"
            variant="cortex"
            className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs"
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>CORTEX AI</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
