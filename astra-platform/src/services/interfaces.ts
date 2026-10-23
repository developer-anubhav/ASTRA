// ASTRA Service Interfaces
// These interfaces define the service contract between UI components and data adapters.
// Switching from demo to live data requires only replacing the adapter implementation.

import type {
  Vessel,
  Aircraft,
  Satellite,
  GlobalEvent,
  DataSource,
  AnalyticsSummary,
  FilterState,
  CortexQueryRequest,
  CortexQueryResponse,
} from '@/types';

// ─── Generic Service Response ─────────────────────────────────────────────────

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  isDemo: boolean;
  timestamp: string; // ISO 8601 when the response was generated
}

// ─── Maritime Service ─────────────────────────────────────────────────────────

export interface MaritimeFilters extends Partial<FilterState> {
  vesselTypes?: string[];
  mmsi?: string;
  flag?: string;
}

export interface MaritimeService {
  getVessels(filters?: MaritimeFilters): Promise<ServiceResult<Vessel[]>>;
  getVesselById(id: string): Promise<ServiceResult<Vessel>>;
}

// ─── Aviation Service ─────────────────────────────────────────────────────────

export interface AviationFilters extends Partial<FilterState> {
  categories?: string[];
  icao24?: string;
  callsign?: string;
}

export interface AviationService {
  getAircraft(filters?: AviationFilters): Promise<ServiceResult<Aircraft[]>>;
  getAircraftById(id: string): Promise<ServiceResult<Aircraft>>;
}

// ─── Space Service ────────────────────────────────────────────────────────────

export interface SpaceFilters extends Partial<FilterState> {
  satTypes?: string[];
  noradId?: number;
  country?: string;
}

export interface SpaceService {
  getSatellites(filters?: SpaceFilters): Promise<ServiceResult<Satellite[]>>;
  getSatelliteById(id: string): Promise<ServiceResult<Satellite>>;
}

// ─── Events Service ───────────────────────────────────────────────────────────

export interface EventsFilters extends Partial<FilterState> {
  categories?: string[];
  severities?: string[];
  factualStatuses?: string[];
  country?: string;
}

export interface EventsService {
  getEvents(filters?: EventsFilters): Promise<ServiceResult<GlobalEvent[]>>;
  getEventById(id: string): Promise<ServiceResult<GlobalEvent>>;
}

// ─── Sources Service ──────────────────────────────────────────────────────────

export interface SourcesService {
  getSources(): Promise<ServiceResult<DataSource[]>>;
  getSourceById(id: string): Promise<ServiceResult<DataSource>>;
}

// ─── Analytics Service ────────────────────────────────────────────────────────

export interface AnalyticsService {
  getOverview(): Promise<ServiceResult<AnalyticsSummary>>;
}

// ─── CORTEX Assistant Service ─────────────────────────────────────────────────

export interface AssistantService {
  query(request: CortexQueryRequest): Promise<ServiceResult<CortexQueryResponse>>;
}
