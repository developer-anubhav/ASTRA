"""Tests for ASTRA Sources Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_list_sources(client):
    response = await client.get("/api/v1/sources")
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) >= 5

    first_src = payload["data"][0]
    assert "id" in first_src
    assert "domain" in first_src
    assert "status" in first_src


@pytest.mark.asyncio
async def test_filter_sources_by_domain(client):
    response = await client.get("/api/v1/sources?domain=maritime")
    assert response.status_code == 200

    payload = response.json()
    for src in payload["data"]:
        assert src["domain"] == "maritime"


@pytest.mark.asyncio
async def test_get_source_by_id(client):
    response = await client.get("/api/v1/sources/demo-maritime")
    assert response.status_code == 200

    payload = response.json()
    assert payload["data"]["id"] == "demo-maritime"
