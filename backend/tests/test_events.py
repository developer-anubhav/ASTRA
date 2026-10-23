"""Tests for ASTRA Global Events Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_list_events(client):
    response = await client.get("/api/v1/events")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) > 0

    first_evt = payload["data"][0]
    assert "id" in first_evt
    assert "title" in first_evt
    assert "category" in first_evt
    assert "severity" in first_evt
    assert "factualStatus" in first_evt or "factual_status" in first_evt


@pytest.mark.asyncio
async def test_filter_events_by_category(client):
    response = await client.get("/api/v1/events?category=diplomatic")
    assert response.status_code == 200

    payload = response.json()
    for evt in payload["data"]:
        assert evt["category"] == "diplomatic"


@pytest.mark.asyncio
async def test_search_events(client):
    response = await client.get("/api/v1/events?q=environmental")
    assert response.status_code == 200

    payload = response.json()
    assert len(payload["data"]) > 0
    assert any("environmental" in e["title"].lower() or "environmental" in e["summary"].lower() for e in payload["data"])


@pytest.mark.asyncio
async def test_get_event_by_id(client):
    response = await client.get("/api/v1/events/demo-evt-001")
    assert response.status_code == 200

    payload = response.json()
    assert payload["data"]["id"] == "demo-evt-001"
