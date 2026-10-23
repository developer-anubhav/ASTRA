// ASTRA Demonstration Service Adapters
// These adapters return demonstration data from the demo-data module.
// They implement the same service interfaces as live adapters.
// Replace with live API adapters by swapping the implementation in services/index.ts.

import {
  DEMO_VESSELS,
  DEMO_AIRCRAFT,
  DEMO_SATELLITES,
  DEMO_EVENTS,
  DEMO_SOURCES,
  DEMO_ANALYTICS,
  DEMO_CORTEX_RESPONSES,
} from '@/lib/demo-data';
import type {
  MaritimeService, MaritimeFilters,
  AviationService, AviationFilters,
  SpaceService, SpaceFilters,
  EventsService, EventsFilters,
  SourcesService,
  AnalyticsService,
  AssistantService,
  ServiceResult,
} from './interfaces';
import type {
  Vessel, Aircraft, Satellite, GlobalEvent, DataSource,
  AnalyticsSummary, CortexQueryResponse,
} from '@/types';

// Simulate async network latency for realistic UX during development
const simulateDelay = (ms = 400) => new Promise(r => setTimeout(r, ms));

function ok<T>(data: T): ServiceResult<T> {
  return { data, error: null, isDemo: true, timestamp: new Date().toISOString() };
}

function notFound<T>(id: string): ServiceResult<T> {
  return { data: null, error: `Record not found: ${id}`, isDemo: true, timestamp: new Date().toISOString() };
}

// ─── Maritime Adapter ─────────────────────────────────────────────────────────

export class DemoMaritimeAdapter implements MaritimeService {
  async getVessels(filters?: MaritimeFilters): Promise<ServiceResult<Vessel[]>> {
    await simulateDelay();
    let vessels = [...DEMO_VESSELS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      vessels = vessels.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.mmsi?.includes(q) ||
        v.imo?.includes(q)
      );
    }
    if (filters?.vesselTypes?.length) {
      vessels = vessels.filter(v => filters.vesselTypes!.includes(v.vesselType));
    }
    return ok(vessels);
  }

  async getVesselById(id: string): Promise<ServiceResult<Vessel>> {
    await simulateDelay(200);
    const vessel = DEMO_VESSELS.find(v => v.id === id);
    return vessel ? ok(vessel) : notFound<Vessel>(id);
  }
}

// ─── Aviation Adapter ─────────────────────────────────────────────────────────

export class DemoAviationAdapter implements AviationService {
  async getAircraft(filters?: AviationFilters): Promise<ServiceResult<Aircraft[]>> {
    await simulateDelay();
    let aircraft = [...DEMO_AIRCRAFT];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      aircraft = aircraft.filter(a =>
        a.callsign?.toLowerCase().includes(q) ||
        a.icao24?.includes(q) ||
        a.registration?.toLowerCase().includes(q)
      );
    }
    if (filters?.categories?.length) {
      aircraft = aircraft.filter(a => filters.categories!.includes(a.category));
    }
    return ok(aircraft);
  }

  async getAircraftById(id: string): Promise<ServiceResult<Aircraft>> {
    await simulateDelay(200);
    const aircraft = DEMO_AIRCRAFT.find(a => a.id === id);
    return aircraft ? ok(aircraft) : notFound<Aircraft>(id);
  }
}

// ─── Space Adapter ────────────────────────────────────────────────────────────

export class DemoSpaceAdapter implements SpaceService {
  async getSatellites(filters?: SpaceFilters): Promise<ServiceResult<Satellite[]>> {
    await simulateDelay();
    let sats = [...DEMO_SATELLITES];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      sats = sats.filter(s =>
        s.name.toLowerCase().includes(q) ||
        String(s.noradId).includes(q) ||
        s.cosparId?.toLowerCase().includes(q)
      );
    }
    if (filters?.satTypes?.length) {
      sats = sats.filter(s => filters.satTypes!.includes(s.satType));
    }
    return ok(sats);
  }

  async getSatelliteById(id: string): Promise<ServiceResult<Satellite>> {
    await simulateDelay(200);
    const sat = DEMO_SATELLITES.find(s => s.id === id);
    return sat ? ok(sat) : notFound<Satellite>(id);
  }
}

// ─── Events Adapter ───────────────────────────────────────────────────────────

export class DemoEventsAdapter implements EventsService {
  async getEvents(filters?: EventsFilters): Promise<ServiceResult<GlobalEvent[]>> {
    await simulateDelay();
    let events = [...DEMO_EVENTS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.locationName?.toLowerCase().includes(q)
      );
    }
    if (filters?.categories?.length) {
      events = events.filter(e => filters.categories!.includes(e.category));
    }
    if (filters?.severities?.length) {
      events = events.filter(e => filters.severities!.includes(e.severity));
    }
    // Default chronological order (newest first)
    events.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return ok(events);
  }

  async getEventById(id: string): Promise<ServiceResult<GlobalEvent>> {
    await simulateDelay(200);
    const event = DEMO_EVENTS.find(e => e.id === id);
    return event ? ok(event) : notFound<GlobalEvent>(id);
  }
}

// ─── Sources Adapter ──────────────────────────────────────────────────────────

export class DemoSourcesAdapter implements SourcesService {
  async getSources(): Promise<ServiceResult<DataSource[]>> {
    await simulateDelay(200);
    return ok(DEMO_SOURCES);
  }

  async getSourceById(id: string): Promise<ServiceResult<DataSource>> {
    await simulateDelay(100);
    const source = DEMO_SOURCES.find(s => s.id === id);
    return source ? ok(source) : notFound<DataSource>(id);
  }
}

// ─── Analytics Adapter ────────────────────────────────────────────────────────

export class DemoAnalyticsAdapter implements AnalyticsService {
  async getOverview(): Promise<ServiceResult<AnalyticsSummary>> {
    await simulateDelay(300);
    return ok(DEMO_ANALYTICS);
  }
}

// ─── CORTEX Assistant Adapter ─────────────────────────────────────────────────

export class DemoCortexAdapter implements AssistantService {
  async query(request: { query: string }): Promise<ServiceResult<CortexQueryResponse>> {
    await simulateDelay(1200); // Simulate LLM latency
    const response: CortexQueryResponse = {
      ...DEMO_CORTEX_RESPONSES['default'],
      queryId: `demo-${Date.now()}`,
      query: request.query,
      generatedAt: new Date().toISOString(),
      summary: `DEMONSTRATION RESPONSE: CORTEX received your query — "${request.query}" — but is operating in demonstration mode. No real AI reasoning, data retrieval, or intelligence analysis has been performed. The response below is a simulated example.`,
    };
    return { data: response, error: null, isDemo: true, timestamp: new Date().toISOString() };
  }
}
