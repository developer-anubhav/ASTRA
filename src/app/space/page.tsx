'use client';

import * as React from 'react';
import {
  Satellite as SatelliteIcon,
  Search,
  Orbit,
  Clock,
  Compass,
  AlertTriangle,
  ChevronRight,
  Database,
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
import { spaceService } from '@/services';
import type { Satellite, SatelliteType } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function SpacePage() {
  const [satellites, setSatellites] = React.useState<Satellite[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedSatellite, setSelectedSatellite] = React.useState<Satellite | null>(null);

  React.useEffect(() => {
    async function loadSatellites() {
      setLoading(true);
      try {
        const res = await spaceService.getSatellites({
          search: search || undefined,
          satTypes: selectedType !== 'all' ? [selectedType] : undefined,
        });
        if (res.data) {
          setSatellites(res.data);
          if (!selectedSatellite && res.data.length > 0) {
            setSelectedSatellite(res.data[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadSatellites();
  }, [search, selectedType]);

  const satTypes: SatelliteType[] = [
    'earth-observation',
    'communications',
    'navigation',
    'weather',
    'debris',
    'scientific',
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      {/* Top Banner */}
      <div className="p-2 border-b border-[var(--astra-border)] bg-[var(--astra-bg-base)]">
        <DemoBanner
          domain="Space / Orbital Domain"
          message="Displaying simulated orbital elements from catalog records. Positions calculated from Keplerian elements are mathematical propagations, not directly observed fixes."
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
                <SatelliteIcon className="h-4 w-4 text-[var(--astra-accent)]" />
                <h1 className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono tracking-wider">
                  SPACE CATALOG ({satellites.length})
                </h1>
              </div>
              <Badge variant="default">NORAD / TLE</Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--astra-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search satellite name, NORAD ID, COSPAR..."
                className="pl-8 text-xs font-mono"
              />
            </div>

            {/* Sat Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Button
                variant={selectedType === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-[10px] font-mono"
                onClick={() => setSelectedType('all')}
              >
                ALL
              </Button>
              {satTypes.map((t) => (
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

          {/* Satellite Records List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--astra-border-subtle)]">
            {loading ? (
              <LoadingSpinner label="Accessing orbital catalog records..." />
            ) : satellites.length === 0 ? (
              <EmptyState
                icon={SatelliteIcon}
                title="No Orbital Objects"
                description="No satellites or debris objects matched the active filters."
              />
            ) : (
              satellites.map((sat) => {
                const isSelected = selectedSatellite?.id === sat.id;
                return (
                  <button
                    key={sat.id}
                    onClick={() => setSelectedSatellite(sat)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--astra-bg-elevated)] border-l-2 border-l-[var(--astra-accent)]'
                        : 'hover:bg-[var(--astra-bg-hover)]'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[var(--astra-text-primary)] font-mono truncate">
                          {sat.name}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {sat.satType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--astra-text-secondary)]">
                        <span>NORAD: #{sat.noradId}</span>
                        <span>·</span>
                        <span>{sat.orbitalElements ? `${sat.orbitalElements.inclination}° inc` : 'LEO'}</span>
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
          {selectedSatellite ? (
            <div className="space-y-4 max-w-4xl">
              {/* Header Card */}
              <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-mono text-[var(--astra-text-primary)]">
                      {selectedSatellite.name}
                    </h2>
                    <Badge variant="default" className="uppercase font-mono">
                      {selectedSatellite.satType}
                    </Badge>
                    <ProvenanceBadge provenance="propagated" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--astra-text-secondary)] font-mono">
                    <span>NORAD ID: #{selectedSatellite.noradId}</span>
                    <span>·</span>
                    <span>COSPAR: {selectedSatellite.cosparId || 'N/A'}</span>
                    <span>·</span>
                    <span>Origin: {selectedSatellite.country || 'International'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SourceTag source={selectedSatellite.source} />
                </div>
              </div>

              {/* Orbital Propagation Disclaimer Callout */}
              <div className="p-3.5 rounded bg-blue-950/25 border border-blue-500/40 text-xs text-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 font-mono font-semibold text-blue-300">
                  <Orbit className="h-4 w-4 text-blue-400" />
                  <span>ORBITAL POSITIONING CLASSIFICATION: MATHEMATICAL PROPAGATION</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-200/90">
                  Orbital coordinates are computed from Keplerian element sets (SGP4/SDP4 propagation models). They reflect ephemeris extrapolation from the epoch timestamp, not an active sensor contact or radar lock.
                </p>
                {selectedSatellite.orbitalElements && (
                  <div className="font-mono text-[10px] text-blue-300/80 pt-1">
                    ELEMENT EPOCH: {formatDateTime(selectedSatellite.orbitalElements.epoch)}
                  </div>
                )}
              </div>

              {/* Keplerian Elements Table */}
              {selectedSatellite.orbitalElements && (
                <div className="p-4 rounded-lg bg-[var(--astra-bg-surface)] border border-[var(--astra-border)] space-y-3">
                  <h3 className="font-semibold text-xs text-[var(--astra-text-primary)] uppercase tracking-wider font-mono">
                    KEPLERIAN ORBITAL PARAMETERS
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">INCLINATION</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.inclination}°
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">ECCENTRICITY</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.eccentricity}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">PERIGEE</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.perigeeKm?.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">APOGEE</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.apogeeKm?.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">MEAN MOTION</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.meanMotion} rev/day
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">ORBIT PERIOD</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.periodMinutes} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">RAAN</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        {selectedSatellite.orbitalElements.raan}°
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--astra-text-muted)] block">STATUS</span>
                      <span className="text-[var(--astra-text-primary)] font-semibold">
                        Operational
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Source Integration Note */}
              <div className="p-3 rounded bg-[var(--astra-bg-elevated)] border border-[var(--astra-border)] flex items-start gap-3 text-xs text-[var(--astra-text-secondary)]">
                <Info className="h-4 w-4 text-[var(--astra-accent)] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-[var(--astra-text-primary)]">
                    CelesTrak / Space-Track Integration Path:
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Production space tracking leverages CelesTrak two-line element feeds, updated every 24–72 hours as atmospheric drag perturbates low-Earth orbit. Debris tracking requires integration with unified space surveillance networks.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={SatelliteIcon}
                title="Select a Satellite"
                description="Choose an orbital object from the catalog to review its Keplerian parameters and propagation epoch."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
