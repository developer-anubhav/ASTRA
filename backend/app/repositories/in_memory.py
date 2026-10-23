"""ASTRA In-Memory / Demonstration Repository

Provides fully functional, deterministic demonstration records for development and testing
when no external database or live providers are connected.
"""

from datetime import datetime, timezone
from typing import List, Optional, Tuple
from app.schemas.common import (
    SourceReference,
    GeoCoordinate,
    BoundingBox,
)
from app.schemas.maritime import Vessel, VesselPosition, VesselType
from app.schemas.aircraft import Aircraft, AircraftPosition, AircraftCategory
from app.schemas.satellites import Satellite, OrbitalElements, SatelliteType
from app.schemas.events import GlobalEvent, EventCategory, EventSeverity
from app.schemas.sources import DataSource, SourceDomain
from app.schemas.analytics import AnalyticsSummary, TimeSeriesPoint
from app.repositories.base import (
    IMaritimeRepository,
    IAviationRepository,
    ISpaceRepository,
    IEventsRepository,
    ISourcesRepository,
    IAnalyticsRepository,
)

# Demo Sources
DEMO_SOURCE_MARITIME = SourceReference(
    source_id="demo-maritime",
    source_name="ASTRA Demonstration Data",
    observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    ingested_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    provenance="demonstration",
    attribution="Fictitious demonstration records — not real vessel positions",
)

DEMO_SOURCE_AVIATION = SourceReference(
    source_id="demo-aviation",
    source_name="ASTRA Demonstration Data",
    observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    ingested_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    provenance="demonstration",
    attribution="Fictitious demonstration records — not real aircraft positions",
)

DEMO_SOURCE_SPACE = SourceReference(
    source_id="demo-space",
    source_name="ASTRA Demonstration Data",
    observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    ingested_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    provenance="demonstration",
    attribution="Fictitious demonstration records — not real satellite orbital data",
)

DEMO_SOURCE_EVENTS = SourceReference(
    source_id="demo-events",
    source_name="ASTRA Demonstration Data",
    observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    ingested_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
    provenance="demonstration",
    attribution="Fictitious demonstration records — not real world events",
)

# Demonstration Vessels
DEMO_VESSELS: List[Vessel] = [
    Vessel(
        id="demo-vessel-001",
        mmsi="000000001",
        name="MV DEMO ALPHA",
        flag="XX",
        vessel_type="cargo",
        gross_tonnage=48000,
        length_meters=225.0,
        destination="DEMO PORT",
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=35.12, lon=-10.45),
            heading=275.0,
            speed_knots=14.2,
            nav_status="Under Way Using Engine",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
    Vessel(
        id="demo-vessel-002",
        mmsi="000000002",
        name="MT DEMO BRAVO",
        flag="XX",
        vessel_type="tanker",
        gross_tonnage=120000,
        length_meters=330.0,
        destination="DEMO TERMINAL",
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=24.5, lon=57.3),
            heading=110.0,
            speed_knots=12.8,
            nav_status="Under Way Using Engine",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
    Vessel(
        id="demo-vessel-003",
        mmsi="000000003",
        name="FV DEMO CHARLIE",
        flag="XX",
        vessel_type="fishing",
        length_meters=48.0,
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=-5.3, lon=42.1),
            heading=45.0,
            speed_knots=3.5,
            nav_status="Engaged in Fishing",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
    Vessel(
        id="demo-vessel-004",
        mmsi="000000004",
        name="MV DEMO DELTA",
        flag="XX",
        vessel_type="cargo",
        gross_tonnage=32000,
        length_meters=190.0,
        destination="DEMO PORT EAST",
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=1.28, lon=104.5),
            heading=20.0,
            speed_knots=13.0,
            nav_status="Under Way Using Engine",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
    Vessel(
        id="demo-vessel-005",
        mmsi="000000005",
        name="MV DEMO ECHO",
        flag="XX",
        vessel_type="passenger",
        gross_tonnage=85000,
        length_meters=280.0,
        destination="DEMO CRUISE PORT",
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=18.5, lon=-66.0),
            heading=200.0,
            speed_knots=18.0,
            nav_status="Under Way Using Engine",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
    Vessel(
        id="demo-vessel-006",
        mmsi="000000006",
        name="TUG DEMO FOXTROT",
        flag="XX",
        vessel_type="tug",
        length_meters=32.0,
        latest_position=VesselPosition(
            position=GeoCoordinate(lat=51.45, lon=4.2),
            heading=90.0,
            speed_knots=6.2,
            nav_status="Restricted Manoeuvrability",
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_MARITIME,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real vessel",
    ),
]

# Demonstration Aircraft
DEMO_AIRCRAFT: List[Aircraft] = [
    Aircraft(
        id="demo-ac-001",
        icao24="ab0001",
        callsign="DEMO001",
        aircraft_type="B738",
        category="commercial",
        latest_position=AircraftPosition(
            position=GeoCoordinate(lat=51.5, lon=-2.5, altitude_meters=10670.0),
            heading=260.0,
            speed_knots=450.0,
            on_ground=False,
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_AVIATION,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real aircraft",
    ),
    Aircraft(
        id="demo-ac-002",
        icao24="ab0002",
        callsign="DEMO002",
        aircraft_type="A320",
        category="commercial",
        latest_position=AircraftPosition(
            position=GeoCoordinate(lat=48.85, lon=2.35, altitude_meters=9144.0),
            heading=95.0,
            speed_knots=430.0,
            on_ground=False,
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_AVIATION,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real aircraft",
    ),
    Aircraft(
        id="demo-ac-003",
        icao24="ab0003",
        callsign="DEMO003",
        aircraft_type="C172",
        category="private",
        latest_position=AircraftPosition(
            position=GeoCoordinate(lat=40.71, lon=-74.0, altitude_meters=1200.0),
            heading=180.0,
            speed_knots=110.0,
            on_ground=False,
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_AVIATION,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real aircraft",
    ),
    Aircraft(
        id="demo-ac-004",
        icao24="ab0004",
        callsign="DEMO004",
        aircraft_type="B77W",
        category="cargo",
        latest_position=AircraftPosition(
            position=GeoCoordinate(lat=25.0, lon=55.0, altitude_meters=11280.0),
            heading=60.0,
            speed_knots=480.0,
            on_ground=False,
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_AVIATION,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real aircraft",
    ),
    Aircraft(
        id="demo-ac-005",
        icao24="ab0005",
        callsign="DEMO005",
        aircraft_type="EC45",
        category="helicopter",
        latest_position=AircraftPosition(
            position=GeoCoordinate(lat=-33.87, lon=151.21, altitude_meters=350.0),
            heading=320.0,
            speed_knots=130.0,
            on_ground=False,
            observed_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        ),
        source=DEMO_SOURCE_AVIATION,
        quality="unverified",
        provenance="demonstration",
        coverage_note="Demonstration record — not a real aircraft",
    ),
]

# Demonstration Satellites
DEMO_SATELLITES: List[Satellite] = [
    Satellite(
        id="demo-sat-001",
        norad_id=99001,
        cospar_id="2026-DEMO-A",
        name="DEMO-SAT-ALPHA",
        country="XX",
        sat_type="earth-observation",
        operational_status="Demonstration object — not a real satellite",
        orbital_elements=OrbitalElements(
            epoch=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
            inclination=97.6,
            raan=180.0,
            eccentricity=0.0001,
            argument_of_perigee=90.0,
            mean_anomaly=0.0,
            mean_motion=14.57,
            perigee_km=485.0,
            apogee_km=492.0,
            period_minutes=94.7,
        ),
        source=DEMO_SOURCE_SPACE,
        quality="unverified",
        provenance="demonstration",
    ),
    Satellite(
        id="demo-sat-002",
        norad_id=99002,
        cospar_id="2026-DEMO-B",
        name="DEMO-SAT-BRAVO",
        country="XX",
        sat_type="communications",
        operational_status="Demonstration object — not a real satellite",
        orbital_elements=OrbitalElements(
            epoch=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
            inclination=0.05,
            raan=0.0,
            eccentricity=0.00005,
            argument_of_perigee=0.0,
            mean_anomaly=120.0,
            mean_motion=1.0027,
            perigee_km=35780.0,
            apogee_km=35800.0,
            period_minutes=1436.1,
        ),
        source=DEMO_SOURCE_SPACE,
        quality="unverified",
        provenance="demonstration",
    ),
    Satellite(
        id="demo-sat-003",
        norad_id=99003,
        cospar_id="2026-DEMO-C",
        name="DEMO-SAT-CHARLIE",
        country="XX",
        sat_type="navigation",
        operational_status="Demonstration object — not a real satellite",
        orbital_elements=OrbitalElements(
            epoch=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
            inclination=55.0,
            raan=60.0,
            eccentricity=0.01,
            argument_of_perigee=270.0,
            mean_anomaly=180.0,
            mean_motion=2.0057,
            perigee_km=19100.0,
            apogee_km=19500.0,
            period_minutes=717.5,
        ),
        source=DEMO_SOURCE_SPACE,
        quality="unverified",
        provenance="demonstration",
    ),
    Satellite(
        id="demo-sat-004",
        norad_id=99004,
        cospar_id="2026-DEMO-D",
        name="DEMO-SAT-DELTA",
        country="XX",
        sat_type="weather",
        operational_status="Demonstration object — not a real satellite",
        orbital_elements=OrbitalElements(
            epoch=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
            inclination=98.7,
            raan=270.0,
            eccentricity=0.00009,
            argument_of_perigee=90.0,
            mean_anomaly=270.0,
            mean_motion=14.23,
            perigee_km=825.0,
            apogee_km=832.0,
            period_minutes=101.2,
        ),
        source=DEMO_SOURCE_SPACE,
        quality="unverified",
        provenance="demonstration",
    ),
    Satellite(
        id="demo-sat-005",
        norad_id=99005,
        cospar_id="2026-DEMO-E",
        name="DEMO-DEBRIS-ECHO",
        country="XX",
        sat_type="debris",
        operational_status="Demonstration object — not a real debris object",
        orbital_elements=OrbitalElements(
            epoch=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
            inclination=71.0,
            raan=45.0,
            eccentricity=0.03,
            argument_of_perigee=180.0,
            mean_anomaly=90.0,
            mean_motion=13.1,
            perigee_km=580.0,
            apogee_km=750.0,
            period_minutes=105.8,
        ),
        source=DEMO_SOURCE_SPACE,
        quality="unverified",
        provenance="demonstration",
    ),
]

# Demonstration Events
DEMO_EVENTS: List[GlobalEvent] = [
    GlobalEvent(
        id="demo-evt-001",
        title="Demonstration: Simulated Diplomatic Engagement",
        summary="DEMONSTRATION RECORD — Fictitious event generated to illustrate the ASTRA events interface. No actual diplomatic event has occurred.",
        category="diplomatic",
        severity="medium",
        factual_status="reported",
        location=GeoCoordinate(lat=52.52, lon=13.4),
        location_name="Demonstration Region Alpha",
        country="XX",
        started_at=datetime(2026, 1, 1, 8, 0, tzinfo=timezone.utc),
        updated_at=datetime(2026, 1, 1, 10, 0, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "diplomatic"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
        analysis_note="Demonstration record. No analytical conclusion should be drawn.",
    ),
    GlobalEvent(
        id="demo-evt-002",
        title="Demonstration: Simulated Environmental Observation",
        summary="DEMONSTRATION RECORD — Fictitious event illustrates how environmental observations appear in ASTRA. No real environmental event is represented.",
        category="environmental",
        severity="high",
        factual_status="reported",
        location=GeoCoordinate(lat=-8.0, lon=115.0),
        location_name="Demonstration Region Bravo",
        country="XX",
        started_at=datetime(2026, 1, 1, 6, 0, tzinfo=timezone.utc),
        updated_at=datetime(2026, 1, 1, 9, 30, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "environmental"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
        analysis_note="Demonstration record. No analytical conclusion should be drawn.",
    ),
    GlobalEvent(
        id="demo-evt-003",
        title="Demonstration: Simulated Security Incident",
        summary="DEMONSTRATION RECORD — Fictitious event illustrates security incidents in the ASTRA interface. No real security event is represented.",
        category="security",
        severity="critical",
        factual_status="reported",
        location=GeoCoordinate(lat=15.55, lon=32.53),
        location_name="Demonstration Region Charlie",
        country="XX",
        started_at=datetime(2026, 1, 1, 4, 0, tzinfo=timezone.utc),
        updated_at=datetime(2026, 1, 1, 7, 0, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "security"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
        analysis_note="Demonstration record. No analytical conclusion should be drawn.",
    ),
    GlobalEvent(
        id="demo-evt-004",
        title="Demonstration: Simulated Economic Development",
        summary="DEMONSTRATION RECORD — Fictitious event illustrates economic reporting in ASTRA. No real economic development is represented.",
        category="economic",
        severity="low",
        factual_status="reported",
        location=GeoCoordinate(lat=22.3, lon=114.17),
        location_name="Demonstration Region Delta",
        country="XX",
        started_at=datetime(2026, 1, 1, 2, 0, tzinfo=timezone.utc),
        updated_at=datetime(2026, 1, 1, 2, 0, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "economic"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
    ),
    GlobalEvent(
        id="demo-evt-005",
        title="Demonstration: Simulated Humanitarian Situation",
        summary="DEMONSTRATION RECORD — Fictitious event illustrates humanitarian tracking in ASTRA. No real humanitarian situation is represented.",
        category="humanitarian",
        severity="high",
        factual_status="reported",
        location=GeoCoordinate(lat=13.5, lon=2.1),
        location_name="Demonstration Region Echo",
        country="XX",
        started_at=datetime(2025, 12, 31, 18, 0, tzinfo=timezone.utc),
        updated_at=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "humanitarian"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
        analysis_note="Demonstration record. No analytical conclusion should be drawn.",
    ),
    GlobalEvent(
        id="demo-evt-006",
        title="Demonstration: Simulated Political Development",
        summary="DEMONSTRATION RECORD — Fictitious event illustrates political reporting in ASTRA. No real political development is represented.",
        category="political",
        severity="medium",
        factual_status="reported",
        location=GeoCoordinate(lat=35.7, lon=51.4),
        location_name="Demonstration Region Foxtrot",
        country="XX",
        started_at=datetime(2025, 12, 30, 12, 0, tzinfo=timezone.utc),
        updated_at=datetime(2025, 12, 31, 15, 0, tzinfo=timezone.utc),
        source_name="ASTRA Demonstration Data",
        tags=["demonstration", "political"],
        source=DEMO_SOURCE_EVENTS,
        provenance="demonstration",
    ),
]

# Demonstration Data Sources
DEMO_SOURCES: List[DataSource] = [
    DataSource(
        id="demo-maritime",
        name="ASTRA Demo Maritime",
        domain="maritime",
        description="Demonstration maritime data for interface evaluation. Does not represent real vessel positions.",
        status="active",
        last_checked=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        last_successful=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        coverage_note="Demonstration data only. For live data, integrate an authorized AIS provider.",
        attribution_required=False,
        requires_api_key=False,
        is_demo=True,
    ),
    DataSource(
        id="opensky-network",
        name="OpenSky Network",
        domain="aviation",
        description="Open-source air traffic surveillance network. Provides ADS-B data for research purposes.",
        status="unconfigured",
        rate_limit_note="Anonymous access: 400 credits/day. Authenticated: 1000 credits/day.",
        license_note="Data for research and non-commercial use. Attribution required.",
        coverage_note="Coverage limited to areas with ground station receivers.",
        attribution_required=True,
        requires_api_key=False,
        is_demo=False,
    ),
    DataSource(
        id="celestrak",
        name="CelesTrak",
        domain="space",
        description="Authoritative source of NORAD two-line element (TLE) satellite orbital data.",
        status="unconfigured",
        license_note="Free for non-commercial use. Attribution required.",
        coverage_note="Covers catalogued objects in the NORAD catalog.",
        attribution_required=True,
        requires_api_key=False,
        is_demo=False,
    ),
    DataSource(
        id="demo-aviation",
        name="ASTRA Demo Aviation",
        domain="aviation",
        description="Demonstration aviation data for interface evaluation. Does not represent real aircraft positions.",
        status="active",
        last_checked=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        last_successful=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        coverage_note="Demonstration data only. For live data, configure an authorized aviation data provider.",
        attribution_required=False,
        requires_api_key=False,
        is_demo=True,
    ),
    DataSource(
        id="demo-space",
        name="ASTRA Demo Space",
        domain="space",
        description="Demonstration satellite catalog for interface evaluation. Does not represent real satellites.",
        status="active",
        last_checked=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        last_successful=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        coverage_note="Demonstration data only. For live data, configure CelesTrak or a commercial TLE provider.",
        attribution_required=False,
        requires_api_key=False,
        is_demo=True,
    ),
    DataSource(
        id="demo-events",
        name="ASTRA Demo Events",
        domain="events",
        description="Demonstration global events for interface evaluation. Events are entirely fictitious.",
        status="active",
        last_checked=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        last_successful=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc),
        coverage_note="Demonstration data only. For live data, configure authorized news and events providers.",
        attribution_required=False,
        requires_api_key=False,
        is_demo=True,
    ),
    DataSource(
        id="global-fishing-watch",
        name="Global Fishing Watch",
        domain="maritime",
        description="Open-access datasets on fishing vessel activity and ocean health.",
        status="unconfigured",
        license_note="CC BY-SA 4.0 for research; commercial use requires a separate agreement.",
        coverage_note="Vessel monitoring data with varying temporal and spatial resolution.",
        attribution_required=True,
        requires_api_key=True,
        is_demo=False,
    ),
    DataSource(
        id="noaa",
        name="NOAA Environmental Data",
        domain="environment",
        description="Environmental and oceanographic datasets from the US National Oceanic and Atmospheric Administration.",
        status="unconfigured",
        license_note="Open government data. Attribution recommended.",
        coverage_note="Coverage varies by dataset.",
        attribution_required=True,
        requires_api_key=False,
        is_demo=False,
    ),
]


def _in_bbox(coord: Optional[GeoCoordinate], bbox: Optional[BoundingBox]) -> bool:
    """Helper to check if a coordinate falls inside a BoundingBox."""
    if not bbox or not coord:
        return True
    lat_ok = bbox.south <= coord.lat <= bbox.north
    if bbox.west <= bbox.east:
        lon_ok = bbox.west <= coord.lon <= bbox.east
    else:
        # Crosses antimeridian
        lon_ok = coord.lon >= bbox.west or coord.lon <= bbox.east
    return lat_ok and lon_ok


class InMemoryMaritimeRepository(IMaritimeRepository):
    def __init__(self, vessels: Optional[List[Vessel]] = None):
        self._vessels = list(vessels or DEMO_VESSELS)

    async def list_vessels(
        self,
        vessel_type: Optional[VesselType] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Vessel], int]:
        filtered = self._vessels
        if vessel_type:
            filtered = [v for v in filtered if v.vessel_type == vessel_type]
        if bbox:
            filtered = [
                v for v in filtered
                if v.latest_position and _in_bbox(v.latest_position.position, bbox)
            ]
        total = len(filtered)
        paginated = filtered[offset : offset + limit]
        return paginated, total

    async def get_vessel_by_id(self, vessel_id: str) -> Optional[Vessel]:
        for v in self._vessels:
            if v.id == vessel_id or v.mmsi == vessel_id:
                return v
        return None


class InMemoryAviationRepository(IAviationRepository):
    def __init__(self, aircraft: Optional[List[Aircraft]] = None):
        self._aircraft = list(aircraft or DEMO_AIRCRAFT)

    async def list_aircraft(
        self,
        category: Optional[AircraftCategory] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Aircraft], int]:
        filtered = self._aircraft
        if category:
            filtered = [a for a in filtered if a.category == category]
        if bbox:
            filtered = [
                a for a in filtered
                if a.latest_position and _in_bbox(a.latest_position.position, bbox)
            ]
        total = len(filtered)
        paginated = filtered[offset : offset + limit]
        return paginated, total

    async def get_aircraft_by_id(self, aircraft_id: str) -> Optional[Aircraft]:
        for a in self._aircraft:
            if (
                a.id == aircraft_id
                or a.icao24 == aircraft_id
                or (a.callsign and a.callsign.upper() == aircraft_id.upper())
            ):
                return a
        return None


class InMemorySpaceRepository(ISpaceRepository):
    def __init__(self, satellites: Optional[List[Satellite]] = None):
        self._satellites = list(satellites or DEMO_SATELLITES)

    async def list_satellites(
        self,
        sat_type: Optional[SatelliteType] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Satellite], int]:
        filtered = self._satellites
        if sat_type:
            filtered = [s for s in filtered if s.sat_type == sat_type]
        total = len(filtered)
        paginated = filtered[offset : offset + limit]
        return paginated, total

    async def get_satellite_by_id(self, satellite_id: str) -> Optional[Satellite]:
        for s in self._satellites:
            if s.id == satellite_id or str(s.norad_id) == satellite_id:
                return s
        return None


class InMemoryEventsRepository(IEventsRepository):
    def __init__(self, events: Optional[List[GlobalEvent]] = None):
        self._events = list(events or DEMO_EVENTS)

    async def list_events(
        self,
        category: Optional[EventCategory] = None,
        severity: Optional[EventSeverity] = None,
        bbox: Optional[BoundingBox] = None,
        query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[GlobalEvent], int]:
        filtered = self._events
        if category:
            filtered = [e for e in filtered if e.category == category]
        if severity:
            filtered = [e for e in filtered if e.severity == severity]
        if bbox:
            filtered = [e for e in filtered if _in_bbox(e.location, bbox)]
        if query:
            q_lower = query.lower()
            filtered = [
                e for e in filtered
                if q_lower in e.title.lower()
                or q_lower in e.summary.lower()
                or (e.location_name and q_lower in e.location_name.lower())
                or (e.tags and any(q_lower in t.lower() for t in e.tags))
            ]
        total = len(filtered)
        paginated = filtered[offset : offset + limit]
        return paginated, total

    async def get_event_by_id(self, event_id: str) -> Optional[GlobalEvent]:
        for e in self._events:
            if e.id == event_id:
                return e
        return None


class InMemorySourcesRepository(ISourcesRepository):
    def __init__(self, sources: Optional[List[DataSource]] = None):
        self._sources = list(sources or DEMO_SOURCES)

    async def list_sources(
        self,
        domain: Optional[SourceDomain] = None,
    ) -> List[DataSource]:
        if domain:
            return [s for s in self._sources if s.domain == domain]
        return self._sources

    async def get_source_by_id(self, source_id: str) -> Optional[DataSource]:
        for s in self._sources:
            if s.id == source_id:
                return s
        return None


class InMemoryAnalyticsRepository(IAnalyticsRepository):
    def __init__(
        self,
        maritime_repo: IMaritimeRepository,
        aviation_repo: IAviationRepository,
        space_repo: ISpaceRepository,
        events_repo: IEventsRepository,
        sources_repo: ISourcesRepository,
    ):
        self._maritime = maritime_repo
        self._aviation = aviation_repo
        self._space = space_repo
        self._events = events_repo
        self._sources = sources_repo

    async def get_overview(self) -> AnalyticsSummary:
        vessels, vessel_total = await self._maritime.list_vessels(limit=1000)
        aircraft, aircraft_total = await self._aviation.list_aircraft(limit=1000)
        satellites, satellite_total = await self._space.list_satellites(limit=1000)
        events, event_total = await self._events.list_events(limit=1000)
        sources = await self._sources.list_sources()

        events_by_cat: dict = {
            "conflict": 0, "disaster": 0, "political": 0, "economic": 0,
            "environmental": 0, "humanitarian": 0, "security": 0,
            "diplomatic": 0, "technology": 0, "other": 0,
        }
        for e in events:
            if e.category in events_by_cat:
                events_by_cat[e.category] += 1

        events_by_sev: dict = {
            "critical": 0, "high": 0, "medium": 0, "low": 0, "informational": 0,
        }
        for e in events:
            if e.severity in events_by_sev:
                events_by_sev[e.severity] += 1

        vessels_by_type: dict = {}
        for v in vessels:
            vessels_by_type[v.vessel_type] = vessels_by_type.get(v.vessel_type, 0) + 1

        aircraft_by_cat: dict = {}
        for a in aircraft:
            aircraft_by_cat[a.category] = aircraft_by_cat.get(a.category, 0) + 1

        active_sources = sum(1 for s in sources if s.status == "active")

        # Time series points
        ts_points = [
            TimeSeriesPoint(timestamp=datetime(2025, 12, 30, 0, 0, tzinfo=timezone.utc), value=1, label="2025-12-30"),
            TimeSeriesPoint(timestamp=datetime(2025, 12, 31, 0, 0, tzinfo=timezone.utc), value=2, label="2025-12-31"),
            TimeSeriesPoint(timestamp=datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc), value=3, label="2026-01-01"),
        ]

        return AnalyticsSummary(
            generated_at=datetime.now(timezone.utc),
            period="Demonstration snapshot (not a real time period)",
            vessel_count=vessel_total,
            aircraft_count=aircraft_total,
            satellite_count=satellite_total,
            event_count=event_total,
            source_count=len(sources),
            active_sources=active_sources,
            events_by_category=events_by_cat,
            events_by_severity=events_by_sev,
            vessels_by_type=vessels_by_type,
            aircraft_by_category=aircraft_by_cat,
            event_time_series=ts_points,
            coverage_note="Analytics calculated from demonstration records only. Values do not reflect real-world conditions.",
            provenance="demonstration",
        )
