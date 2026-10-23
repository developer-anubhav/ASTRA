// ASTRA Service Registry
// Wires together service interfaces and their current adapter implementations.
// To switch from demo to live data: replace adapter class instantiation below.
//
// Future live adapter pattern:
//   import { LiveMaritimeAdapter } from './live-adapters';
//   export const maritimeService: MaritimeService = new LiveMaritimeAdapter({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

import {
  DemoMaritimeAdapter,
  DemoAviationAdapter,
  DemoSpaceAdapter,
  DemoEventsAdapter,
  DemoSourcesAdapter,
  DemoAnalyticsAdapter,
  DemoCortexAdapter,
} from './demo-adapters';

import type {
  MaritimeService,
  AviationService,
  SpaceService,
  EventsService,
  SourcesService,
  AnalyticsService,
  AssistantService,
} from './interfaces';

// Current adapters — all demonstration implementations
export const maritimeService: MaritimeService = new DemoMaritimeAdapter();
export const aviationService: AviationService = new DemoAviationAdapter();
export const spaceService: SpaceService = new DemoSpaceAdapter();
export const eventsService: EventsService = new DemoEventsAdapter();
export const sourcesService: SourcesService = new DemoSourcesAdapter();
export const analyticsService: AnalyticsService = new DemoAnalyticsAdapter();
export const assistantService: AssistantService = new DemoCortexAdapter();

// API contract for future FastAPI backend integration:
// All endpoints listed below are proposed contracts, not currently implemented.
//
// GET  /api/v1/maritime                 → Vessel[]
// GET  /api/v1/maritime/:id             → Vessel
// GET  /api/v1/aircraft                 → Aircraft[]
// GET  /api/v1/aircraft/:id             → Aircraft
// GET  /api/v1/satellites               → Satellite[]
// GET  /api/v1/satellites/:id           → Satellite
// GET  /api/v1/events                   → GlobalEvent[]
// GET  /api/v1/events/:id               → GlobalEvent
// GET  /api/v1/sources                  → DataSource[]
// GET  /api/v1/analytics/overview       → AnalyticsSummary
// POST /api/v1/assistant/query          → CortexQueryResponse  (body: CortexQueryRequest)
