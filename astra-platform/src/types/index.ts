// ASTRA — Core TypeScript Data Models
// All entities carry explicit provenance, timestamps, and data-quality metadata.
// Missing or unknown fields are represented as undefined, never fabricated.

// ─── Data Provenance ─────────────────────────────────────────────────────────

export type DataProvenance = 'live' | 'cached' | 'demonstration' | 'propagated' | 'inferred';
export type DataQuality = 'verified' | 'unverified' | 'estimated' | 'historical';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface SourceReference {
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  observedAt: string; // ISO 8601
  ingestedAt: string; // ISO 8601
  provenance: DataProvenance;
  attribution?: string;
  licenseNote?: string;
}

export interface DataFreshness {
  lastUpdated: string | null; // ISO 8601
  staleSince?: string | null;
  isStale: boolean;
  updateIntervalSeconds?: number;
  coverageNote?: string;
}

// ─── Geospatial ──────────────────────────────────────────────────────────────

export interface GeoCoordinate {
  lat: number;
  lon: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export type GeospatialEntityType = 'vessel' | 'aircraft' | 'satellite' | 'event' | 'poi';

export interface GeospatialEntity {
  id: string;
  entityType: GeospatialEntityType;
  displayName: string;
  position: GeoCoordinate;
  heading?: number; // degrees, 0–360
  speedKnots?: number;
  altitudeFeet?: number;
  source: SourceReference;
  quality: DataQuality;
  provenance: DataProvenance;
}

// ─── Vessels (Maritime) ───────────────────────────────────────────────────────

export type VesselType =
  | 'cargo'
  | 'tanker'
  | 'fishing'
  | 'passenger'
  | 'military'
  | 'research'
  | 'tug'
  | 'sailing'
  | 'pleasure'
  | 'other'
  | 'unknown';

export interface VesselPosition {
  position: GeoCoordinate;
  heading?: number;
  speedKnots?: number;
  courseOverGround?: number;
  navStatus?: string;
  observedAt: string;
}

export interface VesselTrackPoint {
  position: GeoCoordinate;
  heading?: number;
  speedKnots?: number;
  observedAt: string;
}

export interface Vessel {
  id: string; // Internal ASTRA ID
  mmsi?: string; // Maritime Mobile Service Identity
  imo?: string; // IMO number
  callSign?: string;
  name?: string;
  flag?: string; // ISO 3166-1 alpha-2
  vesselType: VesselType;
  typeCode?: number; // AIS type code
  grossTonnage?: number;
  lengthMeters?: number;
  beamMeters?: number;
  draft?: number;
  destination?: string;
  eta?: string; // ISO 8601
  latestPosition?: VesselPosition;
  trackHistory?: VesselTrackPoint[]; // when available from source
  source: SourceReference;
  quality: DataQuality;
  provenance: DataProvenance;
  coverageNote?: string;
}

// ─── Aircraft (Aviation) ──────────────────────────────────────────────────────

export type AircraftCategory =
  | 'commercial'
  | 'private'
  | 'military'
  | 'cargo'
  | 'helicopter'
  | 'drone'
  | 'glider'
  | 'unknown';

export interface AircraftPosition {
  position: GeoCoordinate;
  heading?: number;
  speedKnots?: number;
  verticalRateMs?: number;
  squawk?: string;
  onGround: boolean;
  observedAt: string;
}

export interface Aircraft {
  id: string;
  icao24?: string; // ICAO 24-bit address (hex)
  callsign?: string;
  registration?: string;
  aircraftType?: string; // ICAO type designator e.g. B738
  operator?: string;
  origin?: string; // IATA/ICAO airport
  destination?: string;
  category: AircraftCategory;
  latestPosition?: AircraftPosition;
  source: SourceReference;
  quality: DataQuality;
  provenance: DataProvenance;
  coverageNote?: string;
}

// ─── Satellites (Space) ───────────────────────────────────────────────────────

export type SatelliteType =
  | 'communications'
  | 'earth-observation'
  | 'navigation'
  | 'scientific'
  | 'weather'
  | 'military'
  | 'debris'
  | 'unknown';

export interface OrbitalElements {
  epoch: string; // ISO 8601 — when TLE/orbital data was valid
  inclination: number; // degrees
  raan: number; // Right Ascension of the Ascending Node, degrees
  eccentricity: number;
  argumentOfPerigee: number; // degrees
  meanAnomaly: number; // degrees
  meanMotion: number; // revolutions per day
  bStarDragTerm?: number;
  revAtEpoch?: number;
  semimajorAxisKm?: number;
  perigeeKm?: number;
  apogeeKm?: number;
  periodMinutes?: number;
}

export interface PropagatedPosition {
  position: GeoCoordinate;
  propagatedAt: string; // when the propagation was calculated
  dataEpoch: string; // epoch of the orbital elements used
  propagationNote: string; // always: 'Position is a propagated estimate from orbital elements, not a directly observed position'
}

export interface Satellite {
  id: string;
  noradId?: number;
  cosparId?: string;
  name: string;
  country?: string;
  launchDate?: string;
  satType: SatelliteType;
  operationalStatus?: string;
  orbitalElements?: OrbitalElements;
  propagatedPosition?: PropagatedPosition; // calculated, NOT independently observed
  source: SourceReference;
  quality: DataQuality;
  provenance: DataProvenance;
}

// ─── Global Events (Intel) ────────────────────────────────────────────────────

export type EventCategory =
  | 'conflict'
  | 'disaster'
  | 'political'
  | 'economic'
  | 'environmental'
  | 'humanitarian'
  | 'security'
  | 'diplomatic'
  | 'technology'
  | 'other';

export type EventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type FactualStatus =
  | 'reported' // claim from a single source, not independently confirmed
  | 'corroborated' // confirmed by multiple independent sources
  | 'official' // stated by an official authority
  | 'disputed' // contradicted by other sources
  | 'retracted'; // source has retracted the claim

export interface GlobalEvent {
  id: string;
  title: string;
  summary: string;
  category: EventCategory;
  severity: EventSeverity;
  factualStatus: FactualStatus;
  location?: GeoCoordinate;
  locationName?: string;
  country?: string;
  startedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  sourceUrl?: string;
  sourceName?: string;
  tags?: string[];
  source: SourceReference;
  provenance: DataProvenance;
  analysisNote?: string; // clearly labeled as analytical inference
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

export type SourceStatus = 'active' | 'degraded' | 'unavailable' | 'unconfigured' | 'limited';
export type SourceDomain = 'maritime' | 'aviation' | 'space' | 'events' | 'analytics' | 'environment';

export interface DataSource {
  id: string;
  name: string;
  domain: SourceDomain;
  description: string;
  status: SourceStatus;
  baseUrl?: string;
  lastChecked?: string; // ISO 8601
  lastSuccessful?: string; // ISO 8601
  rateLimitNote?: string;
  licenseNote?: string;
  coverageNote?: string;
  attributionRequired: boolean;
  requiresApiKey: boolean;
  isDemo: boolean;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DomainCount {
  domain: SourceDomain;
  count: number;
  label: string;
}

export interface TimeSeriesPoint {
  timestamp: string; // ISO 8601
  value: number;
  label?: string;
}

export interface AnalyticsSummary {
  generatedAt: string; // ISO 8601
  period: string;
  vesselCount: number;
  aircraftCount: number;
  satelliteCount: number;
  eventCount: number;
  sourceCount: number;
  activeSources: number;
  eventsByCategory: Record<EventCategory, number>;
  eventsBySeverity: Record<EventSeverity, number>;
  vesselsByType: Partial<Record<VesselType, number>>;
  aircraftByCategory: Partial<Record<AircraftCategory, number>>;
  eventTimeSeries: TimeSeriesPoint[];
  coverageNote: string;
  provenance: DataProvenance;
}

// ─── CORTEX Assistant ─────────────────────────────────────────────────────────

export type CortexQueryContext =
  | { type: 'vessel'; entityId: string }
  | { type: 'aircraft'; entityId: string }
  | { type: 'satellite'; entityId: string }
  | { type: 'event'; entityId: string }
  | { type: 'region'; boundingBox: BoundingBox }
  | { type: 'general' };

export interface CortexQueryRequest {
  query: string;
  context?: CortexQueryContext;
  sessionId?: string; // ephemeral, not persisted to user profile
}

export type CortexResponseStatus = 'success' | 'partial' | 'no-data' | 'error';
export type CortexFindingType = 'fact' | 'inference' | 'uncertainty' | 'missing-data' | 'suggestion';

export interface CortexFinding {
  type: CortexFindingType;
  content: string;
  sourceRef?: SourceReference;
  confidence?: ConfidenceLevel;
  entityId?: string;
  entityType?: GeospatialEntityType;
  mapLink?: { lat: number; lon: number; zoom?: number };
  routeLink?: string;
}

export interface CortexQueryResponse {
  queryId: string;
  query: string;
  status: CortexResponseStatus;
  summary: string;
  findings: CortexFinding[];
  generatedAt: string; // ISO 8601
  isDemo: boolean; // MUST be true if response is from demonstration adapter
  demoLabel?: string; // displayed prominently when isDemo=true
  dataProvenance: DataProvenance[];
  sourcesConsulted: SourceReference[];
  errorMessage?: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type MapLayer = 'maritime' | 'aviation' | 'satellites' | 'events';

export interface MapState {
  center: { lat: number; lon: number };
  zoom: number;
  activeLayers: MapLayer[];
  selectedEntityId?: string;
  selectedEntityType?: GeospatialEntityType;
}

export interface FilterState {
  search: string;
  timeRange?: { from: string; to: string };
  categories?: string[];
  regions?: BoundingBox[];
  showDemoData: boolean;
}
