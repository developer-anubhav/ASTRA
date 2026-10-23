"""ASTRA SQLAlchemy Database Repository

Production database data access layer utilizing SQLAlchemy 2.0 async sessions and PostGIS geospatial operations.
"""

from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models.vessel import VesselModel, VesselObservationModel
from app.db.models.aircraft import AircraftModel, AircraftObservationModel
from app.db.models.satellite import SatelliteModel, OrbitalElementModel
from app.db.models.event import EventModel
from app.db.models.source import SourceModel

from app.schemas.common import (
    GeoCoordinate,
    BoundingBox,
    SourceReference,
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


class DatabaseMaritimeRepository(IMaritimeRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list_vessels(
        self,
        vessel_type: Optional[VesselType] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Vessel], int]:
        stmt = select(VesselModel).options(selectinload(VesselModel.observations))
        count_stmt = select(func.count(VesselModel.id))

        if vessel_type:
            stmt = stmt.where(VesselModel.vessel_type == vessel_type)
            count_stmt = count_stmt.where(VesselModel.vessel_type == vessel_type)

        total_res = await self._session.execute(count_stmt)
        total = total_res.scalar_one_or_none() or 0

        stmt = stmt.offset(offset).limit(limit)
        result = await self._session.execute(stmt)
        models = result.scalars().all()

        vessels: List[Vessel] = []
        for m in models:
            latest_obs = m.observations[0] if m.observations else None
            latest_pos = None
            if latest_obs:
                latest_pos = VesselPosition(
                    position=GeoCoordinate(lat=latest_obs.lat, lon=latest_obs.lon),
                    heading=latest_obs.heading,
                    speed_knots=latest_obs.speed_knots,
                    course_over_ground=latest_obs.course_over_ground,
                    nav_status=latest_obs.nav_status,
                    observed_at=latest_obs.observed_at,
                )
            vessels.append(
                Vessel(
                    id=m.id,
                    mmsi=m.mmsi,
                    imo=m.imo,
                    call_sign=m.call_sign,
                    name=m.name,
                    flag=m.flag,
                    vessel_type=m.vessel_type,  # type: ignore
                    gross_tonnage=m.gross_tonnage,
                    length_meters=m.length_meters,
                    beam_meters=m.beam_meters,
                    draft=m.draft,
                    destination=latest_obs.destination if latest_obs else None,
                    latest_position=latest_pos,
                    source=SourceReference(
                        source_id=latest_obs.source_id if latest_obs else "database",
                        source_name="ASTRA Database",
                        observed_at=latest_obs.observed_at if latest_obs else datetime.now(timezone.utc),
                        ingested_at=latest_obs.created_at if latest_obs else datetime.now(timezone.utc),
                        provenance="live",
                    ),
                    quality="verified",
                    provenance="live",
                )
            )
        return vessels, total

    async def get_vessel_by_id(self, vessel_id: str) -> Optional[Vessel]:
        stmt = (
            select(VesselModel)
            .where((VesselModel.id == vessel_id) | (VesselModel.mmsi == vessel_id))
            .options(selectinload(VesselModel.observations))
        )
        res = await self._session.execute(stmt)
        m = res.scalar_one_or_none()
        if not m:
            return None

        latest_obs = m.observations[0] if m.observations else None
        latest_pos = None
        if latest_obs:
            latest_pos = VesselPosition(
                position=GeoCoordinate(lat=latest_obs.lat, lon=latest_obs.lon),
                heading=latest_obs.heading,
                speed_knots=latest_obs.speed_knots,
                course_over_ground=latest_obs.course_over_ground,
                nav_status=latest_obs.nav_status,
                observed_at=latest_obs.observed_at,
            )

        return Vessel(
            id=m.id,
            mmsi=m.mmsi,
            imo=m.imo,
            call_sign=m.call_sign,
            name=m.name,
            flag=m.flag,
            vessel_type=m.vessel_type,  # type: ignore
            gross_tonnage=m.gross_tonnage,
            length_meters=m.length_meters,
            beam_meters=m.beam_meters,
            draft=m.draft,
            destination=latest_obs.destination if latest_obs else None,
            latest_position=latest_pos,
            source=SourceReference(
                source_id=latest_obs.source_id if latest_obs else "database",
                source_name="ASTRA Database",
                observed_at=latest_obs.observed_at if latest_obs else datetime.now(timezone.utc),
                ingested_at=latest_obs.created_at if latest_obs else datetime.now(timezone.utc),
                provenance="live",
            ),
            quality="verified",
            provenance="live",
        )


class DatabaseAviationRepository(IAviationRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list_aircraft(
        self,
        category: Optional[AircraftCategory] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Aircraft], int]:
        stmt = select(AircraftModel).options(selectinload(AircraftModel.observations))
        count_stmt = select(func.count(AircraftModel.id))

        if category:
            stmt = stmt.where(AircraftModel.category == category)
            count_stmt = count_stmt.where(AircraftModel.category == category)

        total_res = await self._session.execute(count_stmt)
        total = total_res.scalar_one_or_none() or 0

        stmt = stmt.offset(offset).limit(limit)
        result = await self._session.execute(stmt)
        models = result.scalars().all()

        aircraft_list: List[Aircraft] = []
        for m in models:
            latest_obs = m.observations[0] if m.observations else None
            latest_pos = None
            if latest_obs:
                latest_pos = AircraftPosition(
                    position=GeoCoordinate(
                        lat=latest_obs.lat,
                        lon=latest_obs.lon,
                        altitude_meters=latest_obs.altitude_meters,
                    ),
                    heading=latest_obs.heading,
                    speed_knots=latest_obs.speed_knots,
                    vertical_rate_ms=latest_obs.vertical_rate_ms,
                    squawk=latest_obs.squawk,
                    on_ground=latest_obs.on_ground,
                    observed_at=latest_obs.observed_at,
                )
            aircraft_list.append(
                Aircraft(
                    id=m.id,
                    icao24=m.icao24,
                    callsign=m.callsign,
                    registration=m.registration,
                    aircraft_type=m.aircraft_type,
                    operator=m.operator,
                    origin=m.origin,
                    destination=m.destination,
                    category=m.category,  # type: ignore
                    latest_position=latest_pos,
                    source=SourceReference(
                        source_id=latest_obs.source_id if latest_obs else "database",
                        source_name="ASTRA Database",
                        observed_at=latest_obs.observed_at if latest_obs else datetime.now(timezone.utc),
                        ingested_at=latest_obs.created_at if latest_obs else datetime.now(timezone.utc),
                        provenance="live",
                    ),
                    quality="verified",
                    provenance="live",
                )
            )
        return aircraft_list, total

    async def get_aircraft_by_id(self, aircraft_id: str) -> Optional[Aircraft]:
        stmt = (
            select(AircraftModel)
            .where((AircraftModel.id == aircraft_id) | (AircraftModel.icao24 == aircraft_id))
            .options(selectinload(AircraftModel.observations))
        )
        res = await self._session.execute(stmt)
        m = res.scalar_one_or_none()
        if not m:
            return None

        latest_obs = m.observations[0] if m.observations else None
        latest_pos = None
        if latest_obs:
            latest_pos = AircraftPosition(
                position=GeoCoordinate(
                    lat=latest_obs.lat,
                    lon=latest_obs.lon,
                    altitude_meters=latest_obs.altitude_meters,
                ),
                heading=latest_obs.heading,
                speed_knots=latest_obs.speed_knots,
                vertical_rate_ms=latest_obs.vertical_rate_ms,
                squawk=latest_obs.squawk,
                on_ground=latest_obs.on_ground,
                observed_at=latest_obs.observed_at,
            )

        return Aircraft(
            id=m.id,
            icao24=m.icao24,
            callsign=m.callsign,
            registration=m.registration,
            aircraft_type=m.aircraft_type,
            operator=m.operator,
            origin=m.origin,
            destination=m.destination,
            category=m.category,  # type: ignore
            latest_position=latest_pos,
            source=SourceReference(
                source_id=latest_obs.source_id if latest_obs else "database",
                source_name="ASTRA Database",
                observed_at=latest_obs.observed_at if latest_obs else datetime.now(timezone.utc),
                ingested_at=latest_obs.created_at if latest_obs else datetime.now(timezone.utc),
                provenance="live",
            ),
            quality="verified",
            provenance="live",
        )


class DatabaseSpaceRepository(ISpaceRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list_satellites(
        self,
        sat_type: Optional[SatelliteType] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Satellite], int]:
        stmt = select(SatelliteModel).options(selectinload(SatelliteModel.orbital_elements))
        count_stmt = select(func.count(SatelliteModel.id))

        if sat_type:
            stmt = stmt.where(SatelliteModel.sat_type == sat_type)
            count_stmt = count_stmt.where(SatelliteModel.sat_type == sat_type)

        total_res = await self._session.execute(count_stmt)
        total = total_res.scalar_one_or_none() or 0

        stmt = stmt.offset(offset).limit(limit)
        res = await self._session.execute(stmt)
        models = res.scalars().all()

        sats: List[Satellite] = []
        for m in models:
            latest_orb = m.orbital_elements[0] if m.orbital_elements else None
            orb_elem = None
            if latest_orb:
                orb_elem = OrbitalElements(
                    epoch=latest_orb.epoch,
                    inclination=latest_orb.inclination,
                    raan=latest_orb.raan,
                    eccentricity=latest_orb.eccentricity,
                    argument_of_perigee=latest_orb.argument_of_perigee,
                    mean_anomaly=latest_orb.mean_anomaly,
                    mean_motion=latest_orb.mean_motion,
                    b_star_drag_term=latest_orb.b_star_drag_term,
                    semimajor_axis_km=latest_orb.semimajor_axis_km,
                    perigee_km=latest_orb.perigee_km,
                    apogee_km=latest_orb.apogee_km,
                    period_minutes=latest_orb.period_minutes,
                )
            sats.append(
                Satellite(
                    id=m.id,
                    norad_id=m.norad_id,
                    cospar_id=m.cospar_id,
                    name=m.name,
                    country=m.country,
                    launch_date=m.launch_date,
                    sat_type=m.sat_type,  # type: ignore
                    operational_status=m.operational_status,
                    orbital_elements=orb_elem,
                    source=SourceReference(
                        source_id=latest_orb.source_id if latest_orb else "celestrak",
                        source_name="CelesTrak / NORAD",
                        observed_at=latest_orb.epoch if latest_orb else datetime.now(timezone.utc),
                        ingested_at=latest_orb.created_at if latest_orb else datetime.now(timezone.utc),
                        provenance="propagated",
                    ),
                    quality="verified",
                    provenance="propagated",
                )
            )
        return sats, total

    async def get_satellite_by_id(self, satellite_id: str) -> Optional[Satellite]:
        norad_query = int(satellite_id) if satellite_id.isdigit() else -1
        stmt = (
            select(SatelliteModel)
            .where((SatelliteModel.id == satellite_id) | (SatelliteModel.norad_id == norad_query))
            .options(selectinload(SatelliteModel.orbital_elements))
        )
        res = await self._session.execute(stmt)
        m = res.scalar_one_or_none()
        if not m:
            return None

        latest_orb = m.orbital_elements[0] if m.orbital_elements else None
        orb_elem = None
        if latest_orb:
            orb_elem = OrbitalElements(
                epoch=latest_orb.epoch,
                inclination=latest_orb.inclination,
                raan=latest_orb.raan,
                eccentricity=latest_orb.eccentricity,
                argument_of_perigee=latest_orb.argument_of_perigee,
                mean_anomaly=latest_orb.mean_anomaly,
                mean_motion=latest_orb.mean_motion,
                b_star_drag_term=latest_orb.b_star_drag_term,
                semimajor_axis_km=latest_orb.semimajor_axis_km,
                perigee_km=latest_orb.perigee_km,
                apogee_km=latest_orb.apogee_km,
                period_minutes=latest_orb.period_minutes,
            )

        return Satellite(
            id=m.id,
            norad_id=m.norad_id,
            cospar_id=m.cospar_id,
            name=m.name,
            country=m.country,
            launch_date=m.launch_date,
            sat_type=m.sat_type,  # type: ignore
            operational_status=m.operational_status,
            orbital_elements=orb_elem,
            source=SourceReference(
                source_id=latest_orb.source_id if latest_orb else "celestrak",
                source_name="CelesTrak / NORAD",
                observed_at=latest_orb.epoch if latest_orb else datetime.now(timezone.utc),
                ingested_at=latest_orb.created_at if latest_orb else datetime.now(timezone.utc),
                provenance="propagated",
            ),
            quality="verified",
            provenance="propagated",
        )


class DatabaseEventsRepository(IEventsRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list_events(
        self,
        category: Optional[EventCategory] = None,
        severity: Optional[EventSeverity] = None,
        bbox: Optional[BoundingBox] = None,
        query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[GlobalEvent], int]:
        stmt = select(EventModel)
        count_stmt = select(func.count(EventModel.id))

        filters = []
        if category:
            filters.append(EventModel.category == category)
        if severity:
            filters.append(EventModel.severity == severity)
        if query:
            filters.append(
                (EventModel.title.ilike(f"%{query}%")) | (EventModel.summary.ilike(f"%{query}%"))
            )
        if bbox:
            filters.append(
                and_(
                    EventModel.lat >= bbox.south,
                    EventModel.lat <= bbox.north,
                    EventModel.lon >= bbox.west,
                    EventModel.lon <= bbox.east,
                )
            )

        if filters:
            stmt = stmt.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total_res = await self._session.execute(count_stmt)
        total = total_res.scalar_one_or_none() or 0

        stmt = stmt.order_by(EventModel.started_at.desc()).offset(offset).limit(limit)
        res = await self._session.execute(stmt)
        models = res.scalars().all()

        events: List[GlobalEvent] = []
        for m in models:
            loc = GeoCoordinate(lat=m.lat, lon=m.lon) if m.lat is not None and m.lon is not None else None
            events.append(
                GlobalEvent(
                    id=m.id,
                    title=m.title,
                    summary=m.summary,
                    category=m.category,  # type: ignore
                    severity=m.severity,  # type: ignore
                    factual_status=m.factual_status,  # type: ignore
                    location=loc,
                    location_name=m.location_name,
                    country=m.country,
                    started_at=m.started_at,
                    updated_at=m.event_updated_at,
                    source_url=m.source_url,
                    source_name=m.source_name,
                    tags=m.tags,
                    source=SourceReference(
                        source_id=m.source_id,
                        source_name=m.source_display_name,
                        observed_at=m.started_at,
                        ingested_at=m.created_at,
                        provenance=m.provenance,  # type: ignore
                    ),
                    provenance=m.provenance,  # type: ignore
                    analysis_note=m.analysis_note,
                )
            )
        return events, total

    async def get_event_by_id(self, event_id: str) -> Optional[GlobalEvent]:
        stmt = select(EventModel).where(EventModel.id == event_id)
        res = await self._session.execute(stmt)
        m = res.scalar_one_or_none()
        if not m:
            return None

        loc = GeoCoordinate(lat=m.lat, lon=m.lon) if m.lat is not None and m.lon is not None else None
        return GlobalEvent(
            id=m.id,
            title=m.title,
            summary=m.summary,
            category=m.category,  # type: ignore
            severity=m.severity,  # type: ignore
            factual_status=m.factual_status,  # type: ignore
            location=loc,
            location_name=m.location_name,
            country=m.country,
            started_at=m.started_at,
            updated_at=m.event_updated_at,
            source_url=m.source_url,
            source_name=m.source_name,
            tags=m.tags,
            source=SourceReference(
                source_id=m.source_id,
                source_name=m.source_display_name,
                observed_at=m.started_at,
                ingested_at=m.created_at,
                provenance=m.provenance,  # type: ignore
            ),
            provenance=m.provenance,  # type: ignore
            analysis_note=m.analysis_note,
        )


class DatabaseSourcesRepository(ISourcesRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list_sources(
        self,
        domain: Optional[SourceDomain] = None,
    ) -> List[DataSource]:
        stmt = select(SourceModel)
        if domain:
            stmt = stmt.where(SourceModel.domain == domain)
        res = await self._session.execute(stmt)
        models = res.scalars().all()
        return [
            DataSource(
                id=m.id,
                name=m.name,
                domain=m.domain,  # type: ignore
                description=m.description,
                status=m.status,  # type: ignore
                base_url=m.base_url,
                last_checked=m.last_checked,
                last_successful=m.last_successful,
                rate_limit_note=m.rate_limit_note,
                license_note=m.license_note,
                coverage_note=m.coverage_note,
                attribution_required=m.attribution_required,
                requires_api_key=m.requires_api_key,
                is_demo=m.is_demo,
            )
            for m in models
        ]

    async def get_source_by_id(self, source_id: str) -> Optional[DataSource]:
        stmt = select(SourceModel).where(SourceModel.id == source_id)
        res = await self._session.execute(stmt)
        m = res.scalar_one_or_none()
        if not m:
            return None
        return DataSource(
            id=m.id,
            name=m.name,
            domain=m.domain,  # type: ignore
            description=m.description,
            status=m.status,  # type: ignore
            base_url=m.base_url,
            last_checked=m.last_checked,
            last_successful=m.last_successful,
            rate_limit_note=m.rate_limit_note,
            license_note=m.license_note,
            coverage_note=m.coverage_note,
            attribution_required=m.attribution_required,
            requires_api_key=m.requires_api_key,
            is_demo=m.is_demo,
        )
