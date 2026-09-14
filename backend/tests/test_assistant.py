"""
Automated Test Suite for LLM Assistant & Risk Scoring Analytics Engine.
Tests autonomous insight generation, intent classification, audit logging,
and dynamic multi-factor entity risk scoring.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.risk_scoring import calculate_entity_risk
from app.ai.llm_assistant import generate_case_insight


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def auth_headers(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"badgeNumber": "INSP-26189", "password": "password123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["token"]
    return {"Authorization": f"Bearer {token}"}


# ------------------ ASSISTANT QUERY ENDPOINT ------------------

def test_assistant_query_unauthorized(client):
    res = client.post("/api/v1/assistant/query", json={"query": "What is the primary threat?"})
    assert res.status_code == 401


def test_assistant_query_with_case_context(client, auth_headers):
    payload = {
        "query": "Provide situational assessment for this case",
        "case_id": "26189-042"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["case_id"] == "26189-042"
    assert "FIR-2026-NCRB-9021" in data["fir_number"]
    assert len(data["insight"]) > 50
    assert data["confidence_score"] >= 0.9
    assert len(data["recommended_actions"]) >= 2
    assert len(data["source_documents"]) >= 1


def test_assistant_query_risk_factors(client, auth_headers):
    payload = {
        "query": "Why is this case flagged as high risk?",
        "case_id": "26189-042"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "risk" in data["insight"].lower() or "threat" in data["insight"].lower()
    assert any("ANPR" in r or "surveillance" in r.lower() or "look-out" in r.lower() for r in data["recommended_actions"])


def test_assistant_query_suspect_intent(client, auth_headers):
    payload = {
        "query": "Who are the primary suspects and targets in this investigation?",
        "case_id": "26189-042"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "person of interest" in data["insight"].lower() or "suspect" in data["insight"].lower()


def test_assistant_query_evidence_intent(client, auth_headers):
    payload = {
        "query": "Verify forensic evidence and cryptographic chain of custody",
        "case_id": "26189-042"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "evidence" in data["insight"].lower() or "sha-256" in data["insight"].lower()


def test_assistant_query_vehicle_intent(client, auth_headers):
    payload = {
        "query": "Which vehicles and license plates are under surveillance?",
        "case_id": "26189-042"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "vehicle" in data["insight"].lower() or "plate" in data["insight"].lower()


def test_assistant_query_without_case_id(client, auth_headers):
    payload = {
        "query": "Summarize cross-jurisdictional syndicate activity"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["insight"]) > 30


def test_assistant_query_nonexistent_case(client, auth_headers):
    payload = {
        "query": "Check status of unknown case",
        "case_id": "NON-EXISTENT-CASE-999"
    }
    res = client.post("/api/v1/assistant/query", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "insight" in data


# ------------------ DYNAMIC RISK SCORING ------------------

def test_entity_risk_score_unauthorized(client):
    res = client.get("/api/v1/assistant/risk-score/ENT-901")
    assert res.status_code == 401


def test_entity_risk_score_valid(client, auth_headers):
    res = client.get("/api/v1/assistant/risk-score/ENT-901", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["entity_id"] == "ENT-901"
    assert data["risk_score"] > 0
    assert data["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    assert "breakdown" in data
    assert "base_threat_weight" in data["breakdown"]
    assert "case_severity_weight" in data["breakdown"]
    assert len(data["explanation"]) > 20


def test_entity_risk_score_not_found(client, auth_headers):
    res = client.get("/api/v1/assistant/risk-score/ENT-INVALID-9999", headers=auth_headers)
    assert res.status_code == 404


def test_calculate_entity_risk_unit():
    """Unit test calculate_entity_risk on specialized tables."""
    # Test on phone entity
    phn_res = calculate_entity_risk("PHN-101")
    assert phn_res["success"] is True
    assert phn_res["entity_type"] == "Phone"
    assert phn_res["risk_score"] >= 50

    # Test on vehicle entity
    veh_res = calculate_entity_risk("VEH-101")
    assert veh_res["success"] is True
    assert veh_res["entity_type"] == "Vehicle"
    assert veh_res["risk_score"] >= 50
