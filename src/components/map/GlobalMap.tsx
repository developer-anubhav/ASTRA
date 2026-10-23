'use client';

import * as React from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type {
  Vessel,
  Aircraft,
  Satellite,
  GlobalEvent,
  MapLayer,
  GeospatialEntityType,
} from '@/types';
import { Layers, ZoomIn, ZoomOut, RefreshCw, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalMapProps {
  vessels?: Vessel[];
  aircraft?: Aircraft[];
  satellites?: Satellite[];
  events?: GlobalEvent[];
  activeLayers: MapLayer[];
  selectedEntityId?: string;
  onSelectEntity?: (id: string, type: GeospatialEntityType) => void;
  className?: string;
}

export function GlobalMap({
  vessels = [],
  aircraft = [],
  satellites = [],
  events = [],
  activeLayers,
  selectedEntityId,
  onSelectEntity,
  className = '',
}: GlobalMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = React.useState(false);

  // Initialize MapLibre
  React.useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Use a clean dark vector style (free OpenStreetMap / Demotiles or standard schema)
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors | ASTRA Geospatial Engine',
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-brightness-max': 0.5,
              'raster-brightness-min': 0.1,
              'raster-contrast': 0.4,
              'raster-saturation': -0.85,
            },
          },
        ],
      },
      center: [20, 20],
      zoom: 1.8,
      minZoom: 1,
      maxZoom: 12,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update entity markers when entities or active layers change
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add Maritime Markers (Cyan)
    if (activeLayers.includes('maritime')) {
      vessels.forEach((vessel) => {
        const pos = vessel.latestPosition?.position;
        if (!pos) return;

        const isSelected = selectedEntityId === vessel.id;
        const el = document.createElement('div');
        el.className = 'astra-map-marker maritime-marker cursor-pointer group relative';
        el.innerHTML = `
          <div class="flex items-center justify-center w-5 h-5 rounded-full ${
            isSelected
              ? 'bg-[var(--astra-accent)] ring-4 ring-[var(--astra-accent)]/30 scale-125'
              : 'bg-[#00c8d7] hover:scale-110'
          } border border-black shadow-[0_0_8px_rgba(0,200,215,0.6)] transition-all">
            <svg class="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="5" r="3"/>
              <line x1="12" y1="22" x2="12" y2="8"/>
              <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
            </svg>
          </div>
          <div class="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#141820] border border-[#2a3548] text-[10px] font-mono text-white whitespace-nowrap z-50 pointer-events-none shadow-md">
            ${vessel.name || 'VESSEL'} (${vessel.vesselType})
          </div>
        `;

        el.addEventListener('click', () => {
          onSelectEntity?.(vessel.id, 'vessel');
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([pos.lon, pos.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Add Aviation Markers (Yellow/Amber)
    if (activeLayers.includes('aviation')) {
      aircraft.forEach((ac) => {
        const pos = ac.latestPosition?.position;
        if (!pos) return;

        const isSelected = selectedEntityId === ac.id;
        const heading = ac.latestPosition?.heading || 0;
        const el = document.createElement('div');
        el.className = 'astra-map-marker aviation-marker cursor-pointer group relative';
        el.innerHTML = `
          <div class="flex items-center justify-center w-5 h-5 rounded-full ${
            isSelected
              ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125'
              : 'bg-amber-400 hover:scale-110'
          } border border-black shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all" style="transform: rotate(${heading}deg);">
            <svg class="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div class="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#141820] border border-[#2a3548] text-[10px] font-mono text-white whitespace-nowrap z-50 pointer-events-none shadow-md">
            ${ac.callsign || 'FLIGHT'} (${ac.aircraftType || ac.category})
          </div>
        `;

        el.addEventListener('click', () => {
          onSelectEntity?.(ac.id, 'aircraft');
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([pos.lon, pos.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Add Events Markers (Red)
    if (activeLayers.includes('events')) {
      events.forEach((evt) => {
        const pos = evt.location;
        if (!pos) return;

        const isSelected = selectedEntityId === evt.id;
        const el = document.createElement('div');
        el.className = 'astra-map-marker event-marker cursor-pointer group relative';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
            <div class="relative flex items-center justify-center w-5 h-5 rounded-full ${
              isSelected
                ? 'bg-red-500 ring-4 ring-red-500/30 scale-125'
                : 'bg-red-500 hover:scale-110'
            } border border-black shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all">
              <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>
          <div class="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#141820] border border-[#2a3548] text-[10px] font-mono text-white whitespace-nowrap z-50 pointer-events-none shadow-md">
            ${evt.title} [${evt.severity.toUpperCase()}]
          </div>
        `;

        el.addEventListener('click', () => {
          onSelectEntity?.(evt.id, 'event');
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([pos.lon, pos.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [vessels, aircraft, events, activeLayers, selectedEntityId, mapLoaded, onSelectEntity]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapRef.current?.flyTo({ center: [20, 20], zoom: 1.8 });
  };

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#0a0c0f] ${className}`}>
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full select-none" />

      {/* Map Control Tools (Floating Overlay) */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-10 bg-[var(--astra-bg-surface)]/90 backdrop-blur p-1 rounded border border-[var(--astra-border)] shadow-lg">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleResetView}
          title="Reset Global View"
          aria-label="Reset Global View"
        >
          <Compass className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Geospatial Watermark & Provenance Note */}
      <div className="absolute left-3 bottom-3 z-10 pointer-events-none flex flex-col gap-1 font-mono text-[10px] text-[var(--astra-text-muted)] bg-[var(--astra-bg-surface)]/85 backdrop-blur px-2.5 py-1.5 rounded border border-[var(--astra-border)]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span className="font-semibold text-purple-300">DEMO GEOSPATIAL PROJECTION</span>
        </div>
        <span>MapLibre GL JS · EPSG:3857 Web Mercator · Fictitious Positions</span>
      </div>
    </div>
  );
}
