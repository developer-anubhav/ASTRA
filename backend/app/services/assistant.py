"""ASTRA CORTEX AI Reasoning Assistant Service

Provides structured intelligence findings, domain cross-correlation, and evidence grounding.
Architected to be anonymous by design with zero persistent conversation history.
In demonstration mode, executes deterministic analytical reasoning without requiring live external LLM credentials.
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional

from app.schemas.assistant import (
    CortexQueryRequest,
    CortexQueryResponse,
    CortexFinding,
    CortexResponseStatus,
)
from app.schemas.common import SourceReference, DataProvenance
from app.repositories.base import (
    IMaritimeRepository,
    IAviationRepository,
    ISpaceRepository,
    IEventsRepository,
    ISourcesRepository,
)


class CortexAssistantService:
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

    async def process_query(self, request: CortexQueryRequest) -> CortexQueryResponse:
        query_id = f"cortex-{uuid.uuid4().hex[:12]}"
        query_lower = request.query.lower().strip()

        # Context-specific evaluation if context was supplied
        if request.context:
            ctx = request.context
            if ctx.type == "vessel":
                vessel = await self._maritime.get_vessel_by_id(ctx.entity_id)
                if vessel:
                    return self._generate_vessel_response(query_id, request.query, vessel)
            elif ctx.type == "aircraft":
                aircraft = await self._aviation.get_aircraft_by_id(ctx.entity_id)
                if aircraft:
                    return self._generate_aircraft_response(query_id, request.query, aircraft)
            elif ctx.type == "satellite":
                satellite = await self._space.get_satellite_by_id(ctx.entity_id)
                if satellite:
                    return self._generate_satellite_response(query_id, request.query, satellite)
            elif ctx.type == "event":
                event = await self._events.get_event_by_id(ctx.entity_id)
                if event:
                    return self._generate_event_response(query_id, request.query, event)

        # Keyword and topic-based domain analysis
        if any(w in query_lower for w in ["vessel", "ship", "maritime", "boat", "cargo", "tanker", "ais"]):
            vessels, _ = await self._maritime.list_vessels(limit=5)
            return self._generate_maritime_domain_response(query_id, request.query, vessels)

        if any(w in query_lower for w in ["aircraft", "flight", "plane", "aviation", "airspace", "ads-b"]):
            aircraft_list, _ = await self._aviation.list_aircraft(limit=5)
            return self._generate_aviation_domain_response(query_id, request.query, aircraft_list)

        if any(w in query_lower for w in ["satellite", "orbit", "space", "norad", "celestrak", "tle"]):
            satellites, _ = await self._space.list_satellites(limit=5)
            return self._generate_space_domain_response(query_id, request.query, satellites)

        if any(w in query_lower for w in ["event", "incident", "conflict", "diplomatic", "news", "intelligence"]):
            events, _ = await self._events.list_events(limit=5)
            return self._generate_events_domain_response(query_id, request.query, events)

        if any(w in query_lower for w in ["source", "provider", "coverage", "api", "feed"]):
            sources = await self._sources.list_sources()
            return self._generate_sources_domain_response(query_id, request.query, sources)

        # Default multi-domain situational response
        return await self._generate_default_response(query_id, request.query)

    def _generate_vessel_response(self, query_id: str, query: str, vessel) -> CortexQueryResponse:
        pos_str = (
            f"lat {vessel.latest_position.position.lat:.2f}, lon {vessel.latest_position.position.lon:.2f}"
            if vessel.latest_position
            else "unknown location"
        )
        speed_str = (
            f"{vessel.latest_position.speed_knots} knots"
            if vessel.latest_position and vessel.latest_position.speed_knots is not None
            else "unreported speed"
        )

        findings = [
            CortexFinding(
                type="fact",
                content=f"Vessel {vessel.name or vessel.id} is registered as type '{vessel.vessel_type}', currently observed at {pos_str} moving at {speed_str}.",
                source_ref=vessel.source,
                confidence="high",
                entity_id=vessel.id,
                entity_type="vessel",
            ),
            CortexFinding(
                type="uncertainty",
                content="AIS ground coverage is subject to terrestrial line-of-sight and satellite reception latency. Destination and ETA are self-reported by crew.",
                confidence="medium",
            ),
            CortexFinding(
                type="suggestion",
                content="Cross-reference with nearby maritime traffic to evaluate potential formation or collision avoidance maneuvers.",
            ),
        ]

        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary=f"Analysis of vessel {vessel.name or vessel.id} based on available maritime surveillance data.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[vessel.source],
        )

    def _generate_aircraft_response(self, query_id: str, query: str, aircraft) -> CortexQueryResponse:
        pos_str = (
            f"lat {aircraft.latest_position.position.lat:.2f}, lon {aircraft.latest_position.position.lon:.2f}, altitude {aircraft.latest_position.position.altitude_meters or 0:.0f}m"
            if aircraft.latest_position
            else "unknown location"
        )

        findings = [
            CortexFinding(
                type="fact",
                content=f"Aircraft {aircraft.callsign or aircraft.icao24} ({aircraft.aircraft_type or 'Unknown type'}) observed at {pos_str}.",
                source_ref=aircraft.source,
                confidence="high",
                entity_id=aircraft.id,
                entity_type="aircraft",
            ),
            CortexFinding(
                type="inference",
                content="Kinematic parameters are consistent with en-route cruise phase based on current altitude and velocity.",
                confidence="medium",
            ),
            CortexFinding(
                type="uncertainty",
                content="ADS-B coverage may degrade outside receiver range. Radar corroboration is unavailable in this feed.",
                confidence="medium",
            ),
        ]

        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary=f"Aviation telemetry assessment for aircraft {aircraft.callsign or aircraft.icao24}.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[aircraft.source],
        )

    def _generate_satellite_response(self, query_id: str, query: str, satellite) -> CortexQueryResponse:
        findings = [
            CortexFinding(
                type="fact",
                content=f"Satellite {satellite.name} (NORAD ID {satellite.norad_id}) categorized as '{satellite.sat_type}'.",
                source_ref=satellite.source,
                confidence="high",
                entity_id=satellite.id,
                entity_type="satellite",
            ),
            CortexFinding(
                type="uncertainty",
                content="All displayed orbital coordinates are propagated estimates derived from two-line element (TLE) sets, not directly observed radar tracks.",
                confidence="high",
            ),
            CortexFinding(
                type="missing-data",
                content="Real-time telemetry and payload operational state are not public in standard orbital catalogs.",
                confidence="high",
            ),
        ]

        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary=f"Orbital intelligence overview for {satellite.name}.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[satellite.source],
        )

    def _generate_event_response(self, query_id: str, query: str, event) -> CortexQueryResponse:
        findings = [
            CortexFinding(
                type="fact",
                content=f"Event '{event.title}' is classified as category '{event.category}' with severity '{event.severity}'. Factual status: '{event.factual_status}'.",
                source_ref=event.source,
                confidence="medium",
                entity_id=event.id,
                entity_type="event",
            ),
            CortexFinding(
                type="inference",
                content=event.analysis_note or "Event requires continuous monitoring as multi-source corroboration evolves.",
                confidence="medium",
            ),
        ]

        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary=f"Intelligence briefing for event {event.id}.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[event.source],
        )

    def _generate_maritime_domain_response(self, query_id: str, query: str, vessels) -> CortexQueryResponse:
        vessel_names = ", ".join(v.name or v.id for v in vessels)
        findings = [
            CortexFinding(
                type="fact",
                content=f"Active tracking records contain {len(vessels)} demonstration vessels: {vessel_names}.",
                confidence="high",
            ),
            CortexFinding(
                type="uncertainty",
                content="Demonstration mode is active. Vessel positions and tracks are synthetic records for interface verification.",
                confidence="high",
            ),
            CortexFinding(
                type="suggestion",
                content="To view real-time maritime movements, configure an authorized AIS feed such as Spire Maritime or MarineTraffic.",
            ),
        ]
        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="ASTRA Maritime domain status and active tracked targets.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[v.source for v in vessels if v.source],
        )

    def _generate_aviation_domain_response(self, query_id: str, query: str, aircraft_list) -> CortexQueryResponse:
        callsigns = ", ".join(a.callsign or a.icao24 or a.id for a in aircraft_list)
        findings = [
            CortexFinding(
                type="fact",
                content=f"Currently tracking {len(aircraft_list)} aircraft across commercial, cargo, and private sectors: {callsigns}.",
                confidence="high",
            ),
            CortexFinding(
                type="uncertainty",
                content="Live OpenSky Network integration is unconfigured in development environment. Present flight vectors are demonstration fixtures.",
                confidence="high",
            ),
        ]
        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="ASTRA Aviation domain status and airspace surveillance summary.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[a.source for a in aircraft_list if a.source],
        )

    def _generate_space_domain_response(self, query_id: str, query: str, satellites) -> CortexQueryResponse:
        sat_names = ", ".join(s.name for s in satellites)
        findings = [
            CortexFinding(
                type="fact",
                content=f"Orbital catalog tracks {len(satellites)} objects across LEO, MEO, and GEO regimes: {sat_names}.",
                confidence="high",
            ),
            CortexFinding(
                type="uncertainty",
                content="Orbital positions are propagated estimates computed from Keplerian element sets, not radar or optical observations.",
                confidence="high",
            ),
        ]
        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="ASTRA Space domain orbital tracking summary.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[s.source for s in satellites if s.source],
        )

    def _generate_events_domain_response(self, query_id: str, query: str, events) -> CortexQueryResponse:
        findings = [
            CortexFinding(
                type="fact",
                content=f"There are {len(events)} recorded intelligence events spanning diplomatic, environmental, and security sectors.",
                confidence="high",
            ),
            CortexFinding(
                type="uncertainty",
                content="All displayed events are demonstration records. No confirmed real-world crisis or diplomatic emergency is currently asserted.",
                confidence="high",
            ),
        ]
        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="Global intelligence events summary and factual categorization.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[e.source for e in events if e.source],
        )

    def _generate_sources_domain_response(self, query_id: str, query: str, sources) -> CortexQueryResponse:
        active_sources = [s.name for s in sources if s.status == "active"]
        unconfigured = [s.name for s in sources if s.status == "unconfigured"]

        findings = [
            CortexFinding(
                type="fact",
                content=f"ASTRA registry lists {len(sources)} data sources: {len(active_sources)} active, {len(unconfigured)} unconfigured.",
                confidence="high",
            ),
            CortexFinding(
                type="missing-data",
                content=f"External providers requiring configuration: {', '.join(unconfigured)}.",
                confidence="high",
            ),
            CortexFinding(
                type="suggestion",
                content="Provide API keys in backend environment configuration (.env) to transition from demonstration fixtures to live telemetry.",
            ),
        ]
        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="ASTRA Data Provider telemetry and readiness assessment.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[],
        )

    async def _generate_default_response(self, query_id: str, query: str) -> CortexQueryResponse:
        sources = await self._sources.list_sources()
        vessels, v_count = await self._maritime.list_vessels(limit=10)
        aircraft, a_count = await self._aviation.list_aircraft(limit=10)
        satellites, s_count = await self._space.list_satellites(limit=10)
        events, e_count = await self._events.list_events(limit=10)

        findings = [
            CortexFinding(
                type="fact",
                content=f"ASTRA is actively tracking 4 domains: Maritime ({v_count} vessels), Aviation ({a_count} aircraft), Space ({s_count} satellites), and Events ({e_count} events).",
                confidence="high",
            ),
            CortexFinding(
                type="uncertainty",
                content="CORTEX is operating in demonstration mode. No live AI reasoning or unverified intelligence claims are asserted.",
                confidence="high",
            ),
            CortexFinding(
                type="suggestion",
                content="Select an entity on the global map or provide a specific domain query (e.g. 'maritime', 'events', 'airspace') for deep contextual analysis.",
            ),
        ]

        return CortexQueryResponse(
            query_id=query_id,
            query=query,
            status="success",
            summary="CORTEX situational awareness summary across all active surveillance domains.",
            findings=findings,
            is_demo=True,
            demo_label="DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference",
            data_provenance=["demonstration"],
            sources_consulted=[],
        )
