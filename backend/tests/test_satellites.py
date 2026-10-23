"""Tests for ASTRA Space Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_list_satellites(client):
    response = await client.get("/api/v1/satellites")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) > 0

    first_sat = payload["data"][0]
    assert "id" in first_sat
    assert "satType" in first_sat or "sat_type" in first_sat


@pytest.mark.asyncio
async def test_filter_satellites_by_type(client):
    response = await client.get("/api/v1/satellites?sat_type=earth-observation")
    assert response.status_code == 200

    payload = response.json()
    for sat in payload["data"]:
        sat_type = sat.get("satType") or sat.get("sat_type")
        assert sat_type == "earth-observation"


@pytest.mark.asyncio
async def test_get_satellite_by_id(client):
    response = await client.get("/api/v1/satellites/demo-sat-001")
    assert response.status_code == 200

    payload = response.json()
    assert payload["data"]["id"] == "demo-sat-001"
