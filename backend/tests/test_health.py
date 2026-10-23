"""Tests for ASTRA Health Endpoint"""

import pytest


@pytest.mark.asyncio
async def test_health_endpoint(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert "status" in data
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data
    assert "environment" in data
    assert "database" in data
    assert "services" in data
    assert "timestamp" in data

    # Verify no secrets or sensitive internal settings are leaked
    assert "secret" not in str(data).lower()
    assert "password" not in str(data).lower()


@pytest.mark.asyncio
async def test_root_probe(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data
