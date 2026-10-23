'use client';

import * as React from 'react';
import {
  Radio,
  Search,
  Filter,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { SourceTag } from '@/components/shared/SourceTag';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { CortexPanel } from '@/components/cortex/CortexPanel';
import { eventsService } from '@/services';
import type { GlobalEvent, EventCategory, EventSeverity, FactualStatus } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = React.useState<GlobalEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>('all');
  const [selectedEvent, setSelectedEvent] = React.useState<GlobalEvent | null>(null);
  const [cortexOpen, setCortexOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const res = await eventsService.getEvents({
          search: search || undefined,
          categories: selectedCategory !== 'all' ? [selectedCategory] : undefined,
          severities: selectedSeverity !== 'all' ? [selectedSeverity] : undefined,
        });
        if (res.data) {
          setEvents(res.data);
          if (!selectedEvent && res.data.length > 0) {
            setSelectedEvent(res.data[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [search, selectedCategory, selectedSeverity]);

  const categories: EventCategory[] = [
    'diplomatic',
    'security',
    'environmental',
    'economic',
    'humanitarian',
    'political',
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      {/* Top Banner */}
      <div className="p-2 border-b border-[var(--astra-border)] bg-[var(--astra-bg-base)]">
        <DemoBanner
          domain="Global Events & Intelligence"
          message="Displaying simulated event records. Inferred relationships and reported claims are explicitly separated from corroborated intelligence."
        />
      </div>

      {/* Main Two-Column Console Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left List & Filters Column */}
        <div className="w-full md:w-96 flex flex-col border-r border-[var(--astra-border)] bg-[var(--astra-bg-surface)]">
          {/* Header & Controls */}
          <div className="p-3 border-b border-[var(--astra-border)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-400" />
                <h1 className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono tracking-wider">
                  EVENT FEED ({events.length})
                </h1>
              </div>
              <Badge variant="default">CHRONOLOGICAL</Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event headlines, keywords, regions..."
                className="pl-8 text-xs font-mono"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-[10px] font-mono"
                onClick={() => setSelectedCategory('all')}
              >
                ALL
              </Button>
              {categories.map((c) => (
                <Button
                  key={c}
                  variant={selectedCategory === c ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-[10px] font-mono uppercase"
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          {/* Event Records Timeline List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--astra-border-subtle)]">
            {loading ? (
              <LoadingSpinner label="Compiling intelligence dispatches..." />
            ) : events.length === 0 ? (
              <EmptyState
                icon={Radio}
                title="No Events Found"
                description="No event records matched the specified filter criteria."
              />
            ) : (
              events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`w-full text-left p-3 transition-colors flex items-start justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--astra-bg-elevated)] border-l-2 border-l-red-500'
                        : 'hover:bg-[var(--astra-bg-hover)]'
                    }`}
                  >
                    <div className="space-y-1.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="destructive"
                          className={
                            evt.severity === 'critical'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40 text-[9px]'
                              : evt.severity === 'high'
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 text-[9px]'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/40 text-[9px]'
                          }
                        >
                          {evt.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[9px]">
                          {evt.category}
                        </Badge>
                      </div>
                      <div className="font-semibold text-xs text-[var(--astra-text-primary)] leading-snug line-clamp-2">
                        {evt.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--astra-text-muted)]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{evt.locationName || 'Region Not Specified'}</span>
                        <span>·</span>
                        <span>{timeAgo(evt.updatedAt)}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-red-400' : 'text-[var(--astra-text-muted)] group-hover:text-white'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Inspection Column */}
        <div className="hidden md:flex flex-1 flex-col bg-[var(--astra-bg-base)] overflow-y-auto p-4 space-y-4">
          {selectedEvent ? (
            <div className="space-y-4 max-w-4xl">
              {/* Header Card */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="uppercase font-mono">
                      {selectedEvent.category}
                    </Badge>
                    <Badge
                      variant="destructive"
                      className="uppercase font-mono font-bold"
                    >
                      {selectedEvent.severity} PRIORITY
                    </Badge>
                    <Badge
                      variant={selectedEvent.factualStatus === 'corroborated' ? 'live' : 'secondary'}
                      className="font-mono text-[10px]"
                    >
                      STATUS: {selectedEvent.factualStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <SourceTag source={selectedEvent.source} />
                </div>

                <h2 className="text-lg font-bold text-[var(--astra-text-primary)] leading-snug">
                  {selectedEvent.title}
                </h2>

                <div className="flex items-center gap-4 text-xs font-mono text-[var(--astra-text-secondary)]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                    <span>{selectedEvent.locationName || 'Geographic Fix Unstated'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
                    <span>Logged: {formatDateTime(selectedEvent.startedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Factual Integrity & Summary Card */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-3">
                <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)] font-semibold">
                  DISPATCH OVERVIEW & VERIFIED CLAIMS
                </span>
                <p className="text-xs text-[var(--astra-text-primary)] leading-relaxed">
                  {selectedEvent.summary}
                </p>

                {/* Analytical Inference Warning (if present) */}
                {selectedEvent.analysisNote && (
                  <div className="p-3 rounded bg-purple-950/30 border border-purple-500/40 text-purple-200 text-xs space-y-1">
                    <span className="font-mono font-semibold text-[10px] text-purple-300 uppercase tracking-wider block">
                      ANALYTICAL INFERENCE (NOT VERIFIED FACT):
                    </span>
                    <p className="leading-relaxed text-[11px] text-purple-200/90">
                      {selectedEvent.analysisNote}
                    </p>
                  </div>
                )}
              </div>

              {/* CORTEX Reasoning Action */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--cortex-accent)]/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-[var(--cortex-accent)]" />
                    <span className="font-mono font-semibold text-xs text-[var(--cortex-accent)]">
                      CORTEX AI SYNTHESIS
                    </span>
                  </div>
                  <p className="text-xs text-[var(--astra-text-secondary)]">
                    Cross-examine this event against maritime routes, airspace activity, and regional historical patterns.
                  </p>
                </div>
                <Button
                  variant="cortex"
                  size="sm"
                  onClick={() => setCortexOpen(true)}
                  className="font-mono text-xs whitespace-nowrap"
                >
                  Analyze Event
                </Button>
              </div>

              {/* Integrity Guidelines Callout */}
              <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] flex items-start gap-3 text-xs text-[var(--astra-text-secondary)]">
                <ShieldCheck className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-[var(--astra-text-primary)]">
                    ASTRA Intelligence Standards:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Single-source reports are indexed as &apos;reported&apos; claims until independent corroboration is recorded from distinct sensor feeds or accredited registries. Analytical inferences are strictly segregated from primary observation data.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={Radio}
                title="Select an Event"
                description="Pick a dispatch from the left feed to examine corroborated claims, timestamps, and analytical interpretations."
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating CORTEX Assistant */}
      <CortexPanel
        isOpen={cortexOpen}
        onClose={() => setCortexOpen(false)}
        contextEntityId={selectedEvent?.id}
        contextEntityType="event"
        contextTitle={selectedEvent?.title}
      />
    </div>
  );
}
