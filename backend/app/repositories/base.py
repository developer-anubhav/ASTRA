"""ASTRA Repository Interfaces

Defines the contract for domain data access across demo and live database backends.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from app.schemas.maritime import Vessel, VesselType
from app.schemas.aircraft import Aircraft, AircraftCategory
from app.schemas.satellites import Satellite, SatelliteType
from app.schemas.events import GlobalEvent, EventCategory, EventSeverity
from app.schemas.sources import DataSource, SourceDomain
from app.schemas.analytics import AnalyticsSummary
from app.schemas.common import BoundingBox


class IMaritimeRepository(ABC):
    @abstractmethod
    async def list_vessels(
        self,
        vessel_type: Optional[VesselType] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Vessel], int]:
        """List vessels with optional type, bounding box filters, and pagination."""
        pass

    @abstractmethod
    async def get_vessel_by_id(self, vessel_id: str) -> Optional[Vessel]:
        """Retrieve a vessel by unique ID or MMSI."""
        pass


class IAviationRepository(ABC):
    @abstractmethod
    async def list_aircraft(
        self,
        category: Optional[AircraftCategory] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Aircraft], int]:
        """List aircraft with optional category and bounding box filters."""
        pass

    @abstractmethod
    async def get_aircraft_by_id(self, aircraft_id: str) -> Optional[Aircraft]:
        """Retrieve aircraft by unique ID, ICAO24, or callsign."""
        pass


class ISpaceRepository(ABC):
    @abstractmethod
    async def list_satellites(
        self,
        sat_type: Optional[SatelliteType] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Satellite], int]:
        """List catalogued satellites with optional type filter."""
        pass

    @abstractmethod
    async def get_satellite_by_id(self, satellite_id: str) -> Optional[Satellite]:
        """Retrieve satellite by unique ID or NORAD ID."""
        pass


class IEventsRepository(ABC):
    @abstractmethod
    async def list_events(
        self,
        category: Optional[EventCategory] = None,
        severity: Optional[EventSeverity] = None,
        bbox: Optional[BoundingBox] = None,
        query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[GlobalEvent], int]:
        """List global intelligence events with optional category, severity, and search."""
        pass

    @abstractmethod
    async def get_event_by_id(self, event_id: str) -> Optional[GlobalEvent]:
        """Retrieve event by unique ID."""
        pass


class ISourcesRepository(ABC):
    @abstractmethod
    async def list_sources(
        self,
        domain: Optional[SourceDomain] = None,
    ) -> List[DataSource]:
        """List configured and available data providers."""
        pass

    @abstractmethod
    async def get_source_by_id(self, source_id: str) -> Optional[DataSource]:
        """Retrieve source details by source ID."""
        pass


class IAnalyticsRepository(ABC):
    @abstractmethod
    async def get_overview(self) -> AnalyticsSummary:
        """Generate multi-domain intelligence aggregate metrics and timeseries."""
        pass
