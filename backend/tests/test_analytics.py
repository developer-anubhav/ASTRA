"""Tests for ASTRA Analytics Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_analytics_overview(client):
    response = await client.get("/api/v1/analytics/overview")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    data = payload["data"]

    assert "vesselCount" in data or "vessel_count" in data
    assert "aircraftCount" in data or "aircraft_count" in data
    assert "satelliteCount" in data or "satellite_count" in data
    assert "eventCount" in data or "event_count" in data
    assert "eventsByCategory" in data or "events_by_category" in data
    assert "eventsBySeverity" in data or "events_by_severity" in data
    assert "eventTimeSeries" in data or "event_time_series" in data
