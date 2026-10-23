"""Tests for ASTRA CORTEX AI Assistant Endpoints"""

import pytest


@pytest.mark.asyncio
async def test_cortex_query_general(client):
    body = {
        "query": "What surveillance domains does ASTRA track?",
    }
    response = await client.post("/api/v1/assistant/query", json=body)
    assert response.status_code == 200

    payload = response.json()
    assert "data" in payload
    data = payload["data"]

    assert data["status"] == "success"
    assert "findings" in data
    assert len(data["findings"]) > 0
    assert data["isDemo"] is True or data.get("is_demo") is True
    assert "DEMONSTRATION" in (data.get("demoLabel") or data.get("demo_label", ""))


@pytest.mark.asyncio
async def test_cortex_query_maritime_domain(client):
    body = {
        "query": "Show me vessels currently in transit",
    }
    response = await client.post("/api/v1/assistant/query", json=body)
    assert response.status_code == 200

    payload = response.json()
    data = payload["data"]
    findings = data["findings"]

    # Verify structured finding categories
    types = [f["type"] for f in findings]
    assert "fact" in types or "uncertainty" in types


@pytest.mark.asyncio
async def test_cortex_query_with_vessel_context(client):
    body = {
        "query": "Explain the speed and heading of this vessel",
        "context": {
            "type": "vessel",
            "entityId": "demo-vessel-001",
        },
    }
    response = await client.post("/api/v1/assistant/query", json=body)
    assert response.status_code == 200

    payload = response.json()
    data = payload["data"]
    assert "demo-vessel-001" in str(data)
