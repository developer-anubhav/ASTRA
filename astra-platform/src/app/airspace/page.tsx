'use client';

import * as React from 'react';
import {
  Plane,
  Search,
  Gauge,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Info,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { SourceTag } from '@/components/shared/SourceTag';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { aviationService } from '@/services';
import type { Aircraft, AircraftCategory } from '@/types';
import { formatCoord, formatKnots, formatDateTime, timeAgo } from '@/lib/utils';

export default function AirspacePage() {
  const [aircraft, setAircraft] = React.useState<Aircraft[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedAircraft, setSelectedAircraft] = React.useState<Aircraft | null>(null);

  React.useEffect(() => {
    async function loadAircraft() {
      setLoading(true);
      try {
        const res = await aviationService.getAircraft({
          search: search || undefined,
          categories: selectedCategory !== 'all' ? [selectedCategory] : undefined,
        });
        if (res.data) {
          setAircraft(res.data);
          if (!selectedAircraft && res.data.length > 0) {
            setSelectedAircraft(res.data[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadAircraft();
  }, [search, selectedCategory]);

  const categories: AircraftCategory[] = [
    'commercial',
    'private',
    'cargo',
    'military',
    'helicopter',
    'drone',
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      {/* Top Banner */}
      <div className="p-2 border-b border-[var(--astra-border)] bg-[var(--astra-bg-base)]">
        <DemoBanner
          domain="Airspace Intelligence"
          message="Displaying simulated ADS-B flight telemetry. Real-time airspace integration with OpenSky Network requires active API authentication."
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
                <Plane className="h-4 w-4 text-amber-400" />
                <h1 className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono tracking-wider">
                  AIRSPACE DOMAIN ({aircraft.length})
                </h1>
              </div>
              <Badge variant="default">ADS-B INGESTION</Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by callsign, ICAO 24-bit, or type..."
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

          {/* Aircraft Records List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--astra-border-subtle)]">
            {loading ? (
              <LoadingSpinner label="Querying ADS-B airspace records..." />
            ) : aircraft.length === 0 ? (
              <EmptyState
                icon={Plane}
                title="No Airframes Located"
                description="No active aircraft telemetry matched the search parameters."
              />
            ) : (
              aircraft.map((ac) => {
                const isSelected = selectedAircraft?.id === ac.id;
                const alt = ac.latestPosition?.position.altitudeMeters;
                return (
                  <button
                    key={ac.id}
                    onClick={() => setSelectedAircraft(ac)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--astra-bg-elevated)] border-l-2 border-l-amber-400'
                        : 'hover:bg-[var(--astra-bg-hover)]'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono truncate">
                          {ac.callsign || ac.icao24?.toUpperCase() || 'UNIDENTIFIED'}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {ac.aircraftType || ac.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--astra-text-secondary)]">
                        <span>ICAO: {ac.icao24?.toUpperCase()}</span>
                        <span>·</span>
                        <span>{alt ? `${Math.round(alt * 3.28084)} ft` : 'Ground'}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? 'text-amber-400' : 'text-[var(--astra-text-muted)] group-hover:text-white'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Inspection Column */}
        <div className="hidden md:flex flex-1 flex-col bg-[var(--astra-bg-base)] overflow-y-auto p-4 space-y-4">
          {selectedAircraft ? (
            <div className="space-y-4 max-w-4xl">
              {/* Header Card */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
                      {selectedAircraft.callsign || selectedAircraft.icao24?.toUpperCase()}
                    </h2>
                    <Badge variant="default" className="uppercase font-mono">
                      {selectedAircraft.category}
                    </Badge>
                    <ProvenanceBadge provenance={selectedAircraft.provenance} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--astra-text-secondary)] font-mono">
                    <span>ICAO 24-bit: {selectedAircraft.icao24?.toUpperCase()}</span>
                    <span>·</span>
                    <span>Type: {selectedAircraft.aircraftType || 'Standard airframe'}</span>
                    <span>·</span>
                    <span>Operator: {selectedAircraft.operator || 'Not disclosed'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SourceTag source={selectedAircraft.source} />
                </div>
              </div>

              {/* Flight Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    ALTITUDE (BAROMETRIC)
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)]">
                    {selectedAircraft.latestPosition?.position.altitudeMeters
                      ? `${Math.round(selectedAircraft.latestPosition.position.altitudeMeters * 3.28084).toLocaleString()} ft (${selectedAircraft.latestPosition.position.altitudeMeters} m)`
                      : 'On Ground / Surface'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    Mode S Squawk: {selectedAircraft.latestPosition?.squawk || 'Standard'}
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    SPEED & VECTOR
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)]">
                    {selectedAircraft.latestPosition?.speedKnots !== undefined
                      ? `${selectedAircraft.latestPosition.speedKnots} kn @ ${selectedAircraft.latestPosition.heading || 0}°`
                      : 'N/A'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    Vertical Rate: {selectedAircraft.latestPosition?.verticalRateMs ? `${selectedAircraft.latestPosition.verticalRateMs} m/s` : 'Level flight'}
                  </span>
                </div>

                <div className="p-3.5 rounded bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--astra-text-muted)]">
                    GEOSPATIAL FIX
                  </span>
                  <div className="font-mono text-sm font-semibold text-[var(--astra-text-primary)]">
                    {selectedAircraft.latestPosition
                      ? formatCoord(
                          selectedAircraft.latestPosition.position.lat,
                          selectedAircraft.latestPosition.position.lon
                        )
                      : 'N/A'}
                  </div>
                  <span className="text-[10px] text-[var(--astra-text-secondary)] block">
                    Last Contact: {selectedAircraft.latestPosition ? timeAgo(selectedAircraft.latestPosition.observedAt) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Provider Integration & Coverage Notice */}
              <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] flex items-start gap-3 text-xs text-[var(--astra-text-secondary)]">
                <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-[var(--astra-text-primary)]">
                    Aviation Surveillance Constraints (OpenSky Network):
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    OpenSky Network relies on a volunteer network of ground-based ADS-B / Mode S receivers. Low-altitude coverage in oceanic or remote land masses may be intermittent. Commercial operations require explicit licensing verification before enterprise ingestion.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={Plane}
                title="Select an Airframe"
                description="Pick a flight or aircraft from the left list to review altitude, velocity, and transponder metadata."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
