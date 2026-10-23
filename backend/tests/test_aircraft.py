"""Tests for ASTRA Aviation Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_list_aircraft(client):
    response = await client.get("/api/v1/aircraft")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) > 0

    first_ac = payload["data"][0]
    assert "id" in first_ac
    assert "category" in first_ac


@pytest.mark.asyncio
async def test_filter_aircraft_by_category(client):
    response = await client.get("/api/v1/aircraft?category=commercial")
    assert response.status_code == 200

    payload = response.json()
    for ac in payload["data"]:
        assert ac["category"] == "commercial"


@pytest.mark.asyncio
async def test_get_aircraft_by_id(client):
    response = await client.get("/api/v1/aircraft/demo-ac-001")
    assert response.status_code == 200

    payload = response.json()
    assert payload["data"]["id"] == "demo-ac-001"


@pytest.mark.asyncio
async def test_get_aircraft_not_found(client):
    response = await client.get("/api/v1/aircraft/non-existent-aircraft")
    assert response.status_code == 404
