'use client';

import * as React from 'react';
import {
  Anchor,
  Search,
  Filter,
  Navigation,
  Clock,
  Compass,
  Ship,
  Info,
  ShieldAlert,
  ChevronRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { SourceTag } from '@/components/shared/SourceTag';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { maritimeService } from '@/services';
import type { Vessel, VesselType } from '@/types';
import { formatCoord, formatKnots, formatDateTime, timeAgo } from '@/lib/utils';

export default function MaritimePage() {
  const [vessels, setVessels] = React.useState<Vessel[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedVessel, setSelectedVessel] = React.useState<Vessel | null>(null);

  React.useEffect(() => {
    async function loadVessels() {
      setLoading(true);
      try {
        const res = await maritimeService.getVessels({
          search: search || undefined,
          vesselTypes: selectedType !== 'all' ? [selectedType] : undefined,
        });
        if (res.data) {
          setVessels(res.data);
          if (!selectedVessel && res.data.length > 0) {
            setSelectedVessel(res.data[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadVessels();
  }, [search, selectedType]);

  const vesselTypes: VesselType[] = [
    'cargo',
    'tanker',
    'fishing',
    'passenger',
    'tug',
    'military',
    'research',
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      {/* Top Banner */}
      <div className="p-2 border-b border-[var(--astra-border)] bg-[var(--astra-bg-base)]">
        <DemoBanner
          domain="Maritime Intelligence"
          message="Displaying simulated vessel telemetry for system evaluation. No authentic AIS positions or vessel movement histories are represented."
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
                <Anchor className="h-4 w-4 text-[var(--astra-accent)]" />
                <h1 className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono tracking-wider">
                  MARITIME DOMAIN ({vessels.length})
                </h1>
              </div>
              <Badge variant="default">AIS TELEMETRY</Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by vessel name, MMSI, or IMO..."
                className="pl-8 text-xs font-mono"
              />
            </div>

            {/* Vessel Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Button
                variant={selectedType === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-[10px] font-mono"
                onClick={() => setSelectedType('all')}
              >
                ALL
              </Button>
              {vesselTypes.map((t) => (
                <Button
                  key={t}
                  variant={selectedType === t ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-[10px] font-mono uppercase"
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Vessel Records List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--astra-border-subtle)]">
            {loading ? (
              <LoadingSpinner label="Querying maritime records..." />
            ) : vessels.length === 0 ? (
              <EmptyState
                icon={Anchor}
                title="No Vessels Located"
                description="No maritime telemetry records matched the current search criteria or domain filter."
              />
            ) : (
              vessels.map((v) => {
                const isSelected = selectedVessel?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVessel(v)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--astra-bg-elevated)] border-l-2 border-l-[var(--astra-accent)]'
                        : 'hover:bg-[var(--astra-bg-hover)]'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono truncate">
                          {v.name || 'UNNAMED VESSEL'}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {v.vesselType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--astra-text-secondary)]">
                        <span>MMSI: {v.mmsi || 'N/A'}</span>
                        {v.latestPosition && (
                          <>
                            <span>·</span>
                            <span>{formatKnots(v.latestPosition.speedKnots || 0)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[var(--astra-accent)]' : 'text-[var(--astra-text-muted)] group-hover:text-white'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Inspection Column */}
        <div className="hidden md:flex flex-1 flex-col bg-[var(--astra-bg-base)] overflow-y-auto p-4 space-y-4">
          {selectedVessel ? (
            <div className="space-y-4 max-w-4xl">
              {/* Header Card */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
                      {selectedVessel.name || 'UNIDENTIFIED VESSEL'}
                    </h2>
                    <Badge variant="default" className="uppercase font-mono">
                      {selectedVessel.vesselType}
                    </Badge>
                    <ProvenanceBadge provenance={selectedVessel.provenance} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--astra-text-secondary)] font-mono">
                    <span>MMSI: {selectedVessel.mmsi || 'N/A'}</span>
                    <span>·</span>
                    <span>IMO: {selectedVessel.imo || 'N/A'}</span>
                    <span>·</span>
                    <span>Callsign: {selectedVessel.callSign || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SourceTag source={selectedVessel.source} />
                </div>
              </div>

              {/* Navigation & Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    CURRENT POSITION
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)]">
                    {selectedVessel.latestPosition
                      ? formatCoord(
                          selectedVessel.latestPosition.position.lat,
                          selectedVessel.latestPosition.position.lon
                        )
                      : 'N/A'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    Observed: {selectedVessel.latestPosition ? timeAgo(selectedVessel.latestPosition.observedAt) : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    SPEED & HEADING
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)]">
                    {selectedVessel.latestPosition?.speedKnots !== undefined
                      ? `${selectedVessel.latestPosition.speedKnots} kn @ ${selectedVessel.latestPosition.heading || 0}°`
                      : 'Stationary / N/A'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    Status: {selectedVessel.latestPosition?.navStatus || 'Under Way'}
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    DESTINATION & ETA
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)] truncate">
                    {selectedVessel.destination || 'NOT DECLARED'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    ETA: {selectedVessel.eta ? formatDateTime(selectedVessel.eta) : 'Unspecified'}
                  </span>
                </div>
              </div>

              {/* Vessel Dimensions & Technical Profile */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-3">
                <h3 className="font-semibold text-xs text-[var(--astra-text-primary)] uppercase tracking-wider font-mono">
                  PHYSICAL SPECIFICATIONS & REGISTRATION
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--astra-text-muted)] block">LENGTH</span>
                    <span className="text-[var(--astra-text-primary)] font-semibold">
                      {selectedVessel.lengthMeters ? `${selectedVessel.lengthMeters} m` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--astra-text-muted)] block">BEAM (WIDTH)</span>
                    <span className="text-[var(--astra-text-primary)] font-semibold">
                      {selectedVessel.beamMeters ? `${selectedVessel.beamMeters} m` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--astra-text-muted)] block">GROSS TONNAGE</span>
                    <span className="text-[var(--astra-text-primary)] font-semibold">
                      {selectedVessel.grossTonnage ? `${selectedVessel.grossTonnage.toLocaleString()} GT` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--astra-text-muted)] block">FLAG STATE</span>
                    <span className="text-[var(--astra-text-primary)] font-semibold">
                      {selectedVessel.flag || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coverage Limitations Notice */}
              <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] flex items-start gap-3 text-xs text-[var(--astra-text-secondary)]">
                <Info className="h-4 w-4 text-[var(--astra-accent)] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-[var(--astra-text-primary)]">
                    Maritime Ingestion & Coverage Boundary:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Terrestrial AIS range is typically bounded to 20–40 nautical miles from coastal receiver stations. Satellite AIS is prone to latency and message collision in high-density choke points (e.g., Strait of Malacca, English Channel). ASTRA does not invent routes or positions when data is absent.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={Anchor}
                title="Select a Vessel"
                description="Choose a vessel from the left telemetry list to inspect comprehensive navigational and technical records."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
