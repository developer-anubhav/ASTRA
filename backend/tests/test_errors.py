"""Tests for ASTRA Error Handling & Validation"""

import pytest


@pytest.mark.asyncio
async def test_validation_error_invalid_coordinates(client):
    # Latitude must be <= 90
    response = await client.get("/api/v1/maritime?min_lat=999.0")
    assert response.status_code == 422

    payload = response.json()
    assert payload["data"] is None
    assert "error" in payload
    assert "validation" in payload["error"].lower()
    assert "details" in payload


@pytest.mark.asyncio
async def test_cors_headers(client):
    response = await client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
