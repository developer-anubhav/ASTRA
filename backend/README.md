# ASTRA Backend — Foundation & API Architecture

**ASTRA Backend** provides the high-performance situational intelligence API and CORTEX reasoning boundary for the ASTRA platform.

Built with Python 3.12, **FastAPI**, **Pydantic v2**, **SQLAlchemy 2.0 (asyncio)**, **PostgreSQL / PostGIS**, and **Alembic**.

---

## 1. Architectural Highlights

- **Multi-Domain Intelligence Contracts**: Strongly-typed schemas for Maritime (vessels/tracks), Aviation (airframes/vectors), Space (orbital elements/TLE), and Events (geopolitical dispatches/factual status).
- **ServiceResult Envelope**: All domain endpoints return `{ "data": ..., "is_demo": bool, "timestamp": "...", "error": null }`, aligning with the Next.js frontend contract.
- **CamelCase & Snake_Case Interoperability**: Automatic JSON aliasing allows seamless consumption by both TypeScript camelCase frontends and Pythonic snake_case services.
- **Graceful Demonstration Fallback**: Operates out-of-the-box in demonstration mode without requiring a running PostgreSQL or PostGIS instance. When `DATABASE_URL` is configured, it transitions to live database persistence.
- **Anonymous by Design**: CORTEX reasoning sessions and natural language queries are ephemeral; no user accounts or persistent query histories are logged or stored.
- **Secret-Safe Structured Logging**: Custom JSON logger redacts credentials, prompts, and database internals.

---

## 2. Directory Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI application factory & lifespan
│   ├── core/
│   │   ├── config.py               # Typed Pydantic Settings & CORS rules
│   │   ├── errors.py               # Domain exceptions & error handlers
│   │   └── logging.py              # Structured JSON logging
│   ├── schemas/                    # Pydantic v2 Request & Response models
│   │   ├── common.py               # AstraBaseModel, ServiceResult, GeoCoordinate
│   │   ├── maritime.py             # Vessel, VesselPosition, TrackPoint
│   │   ├── aircraft.py             # Aircraft, AircraftPosition
│   │   ├── satellites.py           # Satellite, OrbitalElements, PropagatedPosition
│   │   ├── events.py               # GlobalEvent, categories, severities
│   │   ├── sources.py              # DataSource, status, licensing
│   │   ├── analytics.py            # AnalyticsSummary, timeseries
│   │   └── assistant.py            # CortexQueryRequest, CortexQueryResponse
│   ├── db/                         # Database persistence layer
│   │   ├── base.py                 # Declarative Base & TimestampMixin
│   │   ├── session.py              # Async connection pool & health checker
│   │   └── models/                 # SQLAlchemy 2.0 ORM models
│   ├── repositories/               # Data access abstraction
│   │   ├── base.py                 # Abstract repository interfaces
│   │   ├── in_memory.py            # Deterministic demonstration datasets
│   │   └── db_repository.py        # PostGIS / SQLAlchemy async queries
│   ├── services/                   # Business logic layer
│   │   ├── maritime.py
│   │   ├── aviation.py
│   │   ├── space.py
│   │   ├── events.py
│   │   ├── sources.py
│   │   ├── analytics.py
│   │   └── assistant.py            # CORTEX reasoning engine
│   └── api/                        # HTTP routing layer
│       ├── router.py               # Master API v1 router
│       └── routes/                 # Domain endpoints
│           ├── health.py
│           ├── maritime.py
│           ├── aircraft.py
│           ├── satellites.py
│           ├── events.py
│           ├── sources.py
│           ├── analytics.py
│           └── assistant.py
├── alembic/                        # Database migration scripts
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py   # Initial relational & spatial schema
├── tests/                          # Automated pytest suite
│   ├── conftest.py
│   ├── test_health.py
│   ├── test_maritime.py
│   ├── test_aircraft.py
│   ├── test_satellites.py
│   ├── test_events.py
│   ├── test_sources.py
│   ├── test_analytics.py
│   ├── test_assistant.py
│   └── test_errors.py
├── alembic.ini                     # Alembic configuration
├── pyproject.toml                  # Project configuration
├── requirements.txt                # Pinned dependencies
├── .env.example                    # Environment template
└── README.md
```

---

## 3. Quickstart & Local Development

### Prerequisites
- Python 3.11+ (Python 3.12 recommended)
- (Optional) PostgreSQL 15+ with PostGIS extension

### 1. Environment Setup
```powershell
# Navigate to the backend directory
cd backend

# Create virtual environment
py -3.12 -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.\.venv\Scripts\activate.bat
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy the example environment template:
```powershell
cp .env.example .env
```
*(By default, `DATABASE_URL` is empty, which enables demonstration mode without an external database).*

### 3. Run the Development Server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 4. API Endpoints Reference

All endpoints are versioned under `/api/v1`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service liveness and database readiness probe |
| `GET` | `/api/v1/maritime` | List vessels with optional bounding box and type filters |
| `GET` | `/api/v1/maritime/{vessel_id}` | Retrieve individual vessel and telemetry |
| `GET` | `/api/v1/aircraft` | List aircraft state vectors with altitude & category filters |
| `GET` | `/api/v1/aircraft/{aircraft_id}` | Retrieve aircraft details by ID or callsign |
| `GET` | `/api/v1/satellites` | List catalogued satellites and orbital elements |
| `GET` | `/api/v1/satellites/{satellite_id}`| Retrieve satellite Keplerian parameters |
| `GET` | `/api/v1/events` | List intelligence dispatches, keyword search, severity |
| `GET` | `/api/v1/events/{event_id}` | Retrieve single event and analysis note |
| `GET` | `/api/v1/sources` | Inspect data provider status, licensing, and rate limits |
| `GET` | `/api/v1/sources/{source_id}` | Retrieve specific provider telemetry |
| `GET` | `/api/v1/analytics/overview` | Cross-domain situational awareness metrics & timeseries |
| `POST`| `/api/v1/assistant/query` | CORTEX AI reasoning query with entity context |

### Example Request: CORTEX Query
```bash
curl -X POST "http://localhost:8000/api/v1/assistant/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Assess recent maritime movements near the Mediterranean",
    "context": {
      "type": "vessel",
      "entityId": "demo-vessel-001"
    }
  }'
```

---

## 5. Database Migrations (PostgreSQL + PostGIS)

When a PostgreSQL instance is provisioned:

```powershell
# Set your database URL in .env
DATABASE_URL=postgresql+asyncpg://astra_user:astra_password@localhost:5432/astra_db

# Run migrations to apply tables and PostGIS extension
alembic upgrade head
```

---

## 6. Running Tests

Execute the comprehensive automated test suite:
```powershell
pytest -v
```
All 26 automated tests verify health, domain filters, bounding boxes, CORTEX reasoning, CORS, and error handling without requiring an external database.
