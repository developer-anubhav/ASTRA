'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  Anchor,
  Plane,
  Satellite,
  Radio,
  Layers,
  Filter,
  Eye,
  BrainCircuit,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  Ship,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { SourceTag } from '@/components/shared/SourceTag';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { CortexPanel } from '@/components/cortex/CortexPanel';
import {
  maritimeService,
  aviationService,
  spaceService,
  eventsService,
} from '@/services';
import type {
  Vessel,
  Aircraft,
  Satellite as SatelliteType,
  GlobalEvent,
  MapLayer,
  GeospatialEntityType,
} from '@/types';
import { formatCoord, formatKnots, formatDateTime } from '@/lib/utils';

// Dynamically import GlobalMap without SSR to avoid maplibre-gl window errors
const GlobalMap = dynamic(
  () => import('@/components/map/GlobalMap').then((m) => m.GlobalMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0a0c0f] text-xs font-mono text-[var(--astra-text-secondary)]">
        INITIALIZING MAPLIBRE GEOSPATIAL PROJECTION...
      </div>
    ),
  }
);

export default function GlobalOverviewPage() {
  const [activeLayers, setActiveLayers] = React.useState<MapLayer[]>([
    'maritime',
    'aviation',
    'events',
  ]);
  const [vessels, setVessels] = React.useState<Vessel[]>([]);
  const [aircraft, setAircraft] = React.useState<Aircraft[]>([]);
  const [satellites, setSatellites] = React.useState<SatelliteType[]>([]);
  const [events, setEvents] = React.useState<GlobalEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Selected Entity
  const [selectedEntityId, setSelectedEntityId] = React.useState<string | undefined>();
  const [selectedEntityType, setSelectedEntityType] = React.useState<GeospatialEntityType | undefined>();

  // CORTEX Drawer state
  const [cortexOpen, setCortexOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [vRes, aRes, sRes, eRes] = await Promise.all([
          maritimeService.getVessels(),
          aviationService.getAircraft(),
          spaceService.getSatellites(),
          eventsService.getEvents(),
        ]);
        if (vRes.data) setVessels(vRes.data);
        if (aRes.data) setAircraft(aRes.data);
        if (sRes.data) setSatellites(sRes.data);
        if (eRes.data) setEvents(eRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleLayer = (layer: MapLayer) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleSelectEntity = (id: string, type: GeospatialEntityType) => {
    setSelectedEntityId(id);
    setSelectedEntityType(type);
  };

  const selectedVessel = selectedEntityType === 'vessel'
    ? vessels.find((v) => v.id === selectedEntityId)
    : undefined;

  const selectedAircraft = selectedEntityType === 'aircraft'
    ? aircraft.find((a) => a.id === selectedEntityId)
    : undefined;

  const selectedEvent = selectedEntityType === 'event'
    ? events.find((e) => e.id === selectedEntityId)
    : undefined;

  const selectedTitle =
    selectedVessel?.name ||
    selectedAircraft?.callsign ||
    selectedEvent?.title ||
    'Selected Entity';

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden select-none">
      {/* Demo Mode Notice */}
      <div className="p-2 bg-[var(--astra-bg-base)] border-b border-[var(--astra-border)]">
        <DemoBanner message="ASTRA Global Situational Awareness Console · Demonstration records active. Live AIS, ADS-B, and orbital feeds require authorized provider configuration." />
      </div>

      {/* Main Map Workspace */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <GlobalMap
          vessels={vessels}
          aircraft={aircraft}
          satellites={satellites}
          events={events}
          activeLayers={activeLayers}
          selectedEntityId={selectedEntityId}
          onSelectEntity={handleSelectEntity}
        />

        {/* Top Floating Controls Bar */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center gap-1 bg-[var(--astra-bg-surface)]/90 backdrop-blur p-1 rounded border border-[var(--astra-border)] shadow-lg">
            <Button
              variant={activeLayers.includes('maritime') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('maritime')}
              className={activeLayers.includes('maritime') ? 'bg-[#00c8d7] text-black' : ''}
            >
              <Anchor className="h-3 w-3 mr-1" />
              <span>Maritime ({vessels.length})</span>
            </Button>
            <Button
              variant={activeLayers.includes('aviation') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('aviation')}
              className={activeLayers.includes('aviation') ? 'bg-amber-400 text-black' : ''}
            >
              <Plane className="h-3 w-3 mr-1" />
              <span>Airspace ({aircraft.length})</span>
            </Button>
            <Button
              variant={activeLayers.includes('events') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('events')}
              className={activeLayers.includes('events') ? 'bg-red-500 text-white' : ''}
            >
              <Radio className="h-3 w-3 mr-1" />
              <span>Events ({events.length})</span>
            </Button>
          </div>
        </div>

        {/* Contextual Entity Detail Floating Drawer */}
        {(selectedVessel || selectedAircraft || selectedEvent) && (
          <div className="absolute left-3 top-16 bottom-10 w-80 z-20 flex flex-col rounded-lg bg-[var(--astra-bg-surface)]/95 backdrop-blur border border-[var(--astra-border-bright)] shadow-2xl overflow-hidden animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[var(--astra-border)] bg-[var(--astra-bg-elevated)]">
              <div className="flex items-center gap-2 truncate">
                {selectedVessel && <Anchor className="h-4 w-4 text-[var(--astra-accent)] shrink-0" />}
                {selectedAircraft && <Plane className="h-4 w-4 text-amber-400 shrink-0" />}
                {selectedEvent && <Radio className="h-4 w-4 text-red-400 shrink-0" />}
                <span className="font-semibold text-xs text-[var(--astra-text-primary)] truncate font-mono">
                  {selectedTitle}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setSelectedEntityId(undefined);
                  setSelectedEntityType(undefined);
                }}
                aria-label="Close detail panel"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Entity Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              {/* Vessel Content */}
              {selectedVessel && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--astra-text-secondary)]">Vessel Type</span>
                    <Badge variant="default">{selectedVessel.vesselType}</Badge>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[var(--astra-text-secondary)]">MMSI</span>
                    <span className="text-[var(--astra-text-primary)]">{selectedVessel.mmsi || 'N/A'}</span>
                  </div>
                  {selectedVessel.latestPosition && (
                    <>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--astra-text-secondary)]">Coordinates</span>
                        <span className="text-[var(--astra-text-primary)]">
                          {formatCoord(
                            selectedVessel.latestPosition.position.lat,
                            selectedVessel.latestPosition.position.lon
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--astra-text-secondary)]">Speed</span>
                        <span className="text-[var(--astra-text-primary)]">
                          {selectedVessel.latestPosition.speedKnots
                            ? formatKnots(selectedVessel.latestPosition.speedKnots)
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--astra-text-secondary)]">Nav Status</span>
                        <span className="text-[var(--astra-text-primary)] truncate max-w-[140px]">
                          {selectedVessel.latestPosition.navStatus || 'Under Way'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-[var(--astra-border)]">
                    <SourceTag source={selectedVessel.source} />
                  </div>
                </div>
              )}

              {/* Aircraft Content */}
              {selectedAircraft && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--astra-text-secondary)]">Category</span>
                    <Badge variant="default">{selectedAircraft.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[var(--astra-text-secondary)]">ICAO 24-bit</span>
                    <span className="text-[var(--astra-text-primary)] uppercase">{selectedAircraft.icao24}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[var(--astra-text-secondary)]">Type</span>
                    <span className="text-[var(--astra-text-primary)]">{selectedAircraft.aircraftType || 'Standard'}</span>
                  </div>
                  {selectedAircraft.latestPosition && (
                    <>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--astra-text-secondary)]">Altitude</span>
                        <span className="text-[var(--astra-text-primary)]">
                          {selectedAircraft.latestPosition.position.altitudeMeters
                            ? `${selectedAircraft.latestPosition.position.altitudeMeters} m (${Math.round(selectedAircraft.latestPosition.position.altitudeMeters * 3.28084)} ft)`
                            : 'Surface'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--astra-text-secondary)]">Speed</span>
                        <span className="text-[var(--astra-text-primary)]">
                          {selectedAircraft.latestPosition.speedKnots
                            ? formatKnots(selectedAircraft.latestPosition.speedKnots)
                            : 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-[var(--astra-border)]">
                    <SourceTag source={selectedAircraft.source} />
                  </div>
                </div>
              )}

              {/* Event Content */}
              {selectedEvent && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--astra-text-secondary)]">Category</span>
                    <Badge variant="default">{selectedEvent.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--astra-text-secondary)]">Severity</span>
                    <Badge
                      variant="destructive"
                      className={
                        selectedEvent.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : selectedEvent.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }
                    >
                      {selectedEvent.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-2 rounded bg-[var(--astra-bg-base)] border border-[var(--astra-border)] leading-relaxed text-[11px] text-[var(--astra-text-secondary)]">
                    {selectedEvent.summary}
                  </div>
                  {selectedEvent.analysisNote && (
                    <div className="p-2 rounded bg-purple-950/20 border border-purple-500/30 text-[10px] text-purple-300">
                      <span className="font-semibold block mb-0.5">ANALYTICAL INFERENCE:</span>
                      {selectedEvent.analysisNote}
                    </div>
                  )}
                  <div className="pt-2 border-t border-[var(--astra-border)]">
                    <SourceTag source={selectedEvent.source} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action: Cross-Domain Investigation with CORTEX */}
            <div className="p-3 border-t border-[var(--astra-border)] bg-[var(--astra-bg-elevated)]">
              <Button
                variant="cortex"
                size="sm"
                className="w-full flex items-center justify-center gap-2 font-mono text-xs"
                onClick={() => setCortexOpen(true)}
              >
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Investigate with CORTEX</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating CORTEX Reasoning Panel */}
      <CortexPanel
        isOpen={cortexOpen}
        onClose={() => setCortexOpen(false)}
        contextEntityId={selectedEntityId}
        contextEntityType={selectedEntityType}
        contextTitle={selectedTitle}
      />
    </div>
  );
}
