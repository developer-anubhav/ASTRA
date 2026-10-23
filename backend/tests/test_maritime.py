"""Tests for ASTRA Maritime Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_list_vessels(client):
    response = await client.get("/api/v1/maritime")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) > 0

    first_vessel = payload["data"][0]
    assert "id" in first_vessel
    assert "vesselType" in first_vessel or "vessel_type" in first_vessel
    assert "provenance" in first_vessel
    assert payload["isDemo"] is True or payload.get("is_demo") is True


@pytest.mark.asyncio
async def test_filter_vessels_by_type(client):
    response = await client.get("/api/v1/maritime?vessel_type=cargo")
    assert response.status_code == 200

    payload = response.json()
    for v in payload["data"]:
        # Verify camelCase or snake_case matches cargo
        v_type = v.get("vesselType") or v.get("vessel_type")
        assert v_type == "cargo"


@pytest.mark.asyncio
async def test_get_vessel_by_id(client):
    response = await client.get("/api/v1/maritime/demo-vessel-001")
    assert response.status_code == 200

    payload = response.json()
    assert payload["data"]["id"] == "demo-vessel-001"


@pytest.mark.asyncio
async def test_get_vessel_not_found(client):
    response = await client.get("/api/v1/maritime/non-existent-vessel-id")
    assert response.status_code == 404

    payload = response.json()
    assert payload["data"] is None
    assert "error" in payload
    assert "not found" in payload["error"].lower()
