# ASTRA — Global Intelligence and Situational Awareness Platform

> **ASTRA**: *See the world. Understand the signals.*  
> **CORTEX**: *Intelligence beyond information.*

ASTRA is a web-first Global Intelligence and Situational Awareness Platform with **CORTEX** as its integrated AI reasoning assistant. It unifies geospatial telemetry and intelligence records across maritime, aviation, space, and global events into a single high-contrast tactical console.

---

## Key Features & Intelligence Domains

1. **ASTRA Global (`/`)**
   - High-performance MapLibre GL JS global map projection.
   - Dynamic layer controls for maritime hulls, aviation airframes, satellites, and global events.
   - Interactive entity selection with contextual inspection drawer.
   - One-click handoff to CORTEX for cross-domain investigation.

2. **ASTRA Maritime (`/maritime`)**
   - AIS vessel positions, callsigns, IMO, MMSI, gross tonnage, and navigation vectors.
   - Filtering by hull category (cargo, tanker, fishing, passenger, tug, research, military).
   - Speed, heading, destination, ETA, and explicit coastal vs satellite coverage boundaries.

3. **ASTRA Airspace (`/airspace`)**
   - ADS-B / Mode S airframe surveillance data (ICAO 24-bit identifiers, callsigns, squawk codes).
   - Barometric altitude readouts, ground speed vectors, and climbing/descending status.
   - Provider attribution and rate-limit accounting for OpenSky Network.

4. **ASTRA Space (`/space`)**
   - Satellite catalog with NORAD catalog numbers and international COSPAR identifiers.
   - Keplerian orbital elements: inclination, eccentricity, perigee, apogee, RAAN, period, and mean motion.
   - Explicit labeling: satellite coordinates are mathematically propagated estimates from element epochs, not real-time radar sensor locks.

5. **ASTRA Events & Intelligence (`/events`)**
   - Chronological intelligence dispatch stream categorized by domain (security, diplomatic, environmental, economic, humanitarian, political).
   - Strict factual integrity: clearly distinguishes `reported`, `corroborated`, `official`, and `disputed` claims.
   - Dedicated analytical inference containers segregated from primary factual claims.

6. **ASTRA Analytics (`/analytics`)**
   - Derived multi-domain metric dashboards rendered with Recharts.
   - Event category distributions, urgency severity breakdowns, hull classifications, and airframe distributions.
   - Transparent reporting: charts reflect solely available records without synthetic extrapolation.

7. **CORTEX AI Assistant (`/assistant` & Embedded Panel)**
   - Integrated AI reasoning interface connected to ASTRA's service contracts.
   - Structured findings output categorized into `fact`, `inference`, `uncertainty`, and `suggestion`.
   - Traceable source citations with observation timestamps and confidence indicators.
   - Prominently labeled demonstration adapter for evaluation without active LLM credentials.

8. **Data Sources & Coverage (`/sources`)**
   - Provider registry reporting health, rate limits, API key prerequisites, and attribution rules.
   - Documentation of the ASTRA data provenance taxonomy.
   - Full REST API interface contracts (`/api/v1/...`) for planned microservices.

9. **Application & Privacy Settings (`/settings`)**
   - Anonymous-by-design policy: zero user accounts, zero trackers, zero server-side query retention.
   - Local display preferences saved only in client browser storage.

---

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS 4, Lucide React icons
- **Geospatial Rendering**: MapLibre GL JS
- **Data Visualization**: Recharts
- **Planned Backend**: Python 3.12+ with FastAPI & Pydantic v2
- **Planned Database**: PostgreSQL 16 with PostGIS 3.4 & Redis

---

## Project Structure

```
c:\Code\ASTRA\
├── src/
│   ├── app/                    # Next.js App Router routes & API endpoints
│   │   ├── page.tsx            # / (Global Overview Map)
│   │   ├── maritime/page.tsx   # /maritime (Vessel Intelligence)
│   │   ├── airspace/page.tsx   # /airspace (Aviation Intelligence)
│   │   ├── space/page.tsx      # /space (Satellite & Orbital Elements)
│   │   ├── events/page.tsx     # /events (Global Events Dispatches)
│   │   ├── analytics/page.tsx  # /analytics (Multi-Domain Metrics)
│   │   ├── assistant/page.tsx  # /assistant (CORTEX AI Console)
│   │   ├── sources/page.tsx    # /sources (Data Sources & Ingestion)
│   │   ├── settings/page.tsx   # /settings (Workstation & Privacy Settings)
│   │   ├── api/v1/             # REST endpoints (/maritime, /aircraft, /assistant...)
│   │   ├── layout.tsx          # Root shell layout with dark theme
│   │   └── globals.css         # ASTRA design tokens & MapLibre dark styling
│   ├── components/
│   │   ├── map/                # MapLibre GL JS interactive geospatial component
│   │   ├── cortex/             # Embedded CORTEX reasoning panel
│   │   ├── shell/              # Sidebar navigation, TopBar, and AppShell
│   │   ├── shared/             # DemoBanner, SourceTag, ProvenanceBadge, EmptyState...
│   │   └── ui/                 # Reusable atomic UI primitives (Badge, Button, Card...)
│   ├── lib/
│   │   ├── demo-data.ts        # Typed deterministic demonstration fixtures
│   │   └── utils.ts            # UTC formatters, coordinate conversions, class merging
│   ├── services/
│   │   ├── interfaces.ts       # Service contracts for all intelligence domains
│   │   ├── demo-adapters.ts    # Demonstration adapter implementations
│   │   └── index.ts            # Service registry wiring
│   └── types/
│       └── index.ts            # Core TypeScript domain models & provenance types
├── ARCHITECTURE.md             # Detailed architectural specification & backend blueprint
└── package.json
```

---

## Getting Started

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the ASTRA console.

### Production Build & Verification
```bash
# Type check with strict TypeScript compiler
npx tsc --noEmit

# Static analysis and linting
npm run lint

# Production compilation with Next.js Turbopack
npm run build

# Start production server
npm start
```
All routes compile as static or dynamic server-side pages with zero build errors.

---

## License & Attribution

ASTRA is built for professional situational awareness and evaluation. In demonstration mode, all records are synthetic fixtures created solely for interface validation.
