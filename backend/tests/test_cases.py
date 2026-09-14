import pytest
from fastapi.testclient import TestClient
from app.main import app


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


def test_dashboard_unauthorized(client):
    res = client.get("/api/v1/dashboard")
    assert res.status_code == 401


def test_dashboard_authenticated(client, auth_headers):
    res = client.get("/api/v1/dashboard", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert data["success"] is True
    assert "summary" in data
    assert "kpis" in data
    assert len(data["kpis"]) >= 5
    assert "highRiskEntities" in data
    assert len(data["highRiskEntities"]) >= 4
    assert "criticalAlerts" in data
    assert len(data["criticalAlerts"]) >= 3
    assert "recentActivity" in data


def test_dashboard_alias_route(client, auth_headers):
    res = client.get("/api/dashboard", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["success"] is True


def test_list_cases_unauthorized(client):
    res = client.get("/api/v1/cases")
    assert res.status_code == 401


def test_list_cases(client, auth_headers):
    res = client.get("/api/v1/cases", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert data["success"] is True
    assert data["total"] >= 4
    assert len(data["cases"]) >= 4
    
    first_case = data["cases"][0]
    assert "firNo" in first_case
    assert "caseId" in first_case
    assert "title" in first_case
    assert "status" in first_case


def test_filter_cases_by_status(client, auth_headers):
    res = client.get("/api/v1/cases?status=ACTIVE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for c in data["cases"]:
        assert c["status"].upper() == "ACTIVE"


def test_search_cases_by_query(client, auth_headers):
    res = client.get("/api/v1/cases?query=Phantom", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["cases"]) >= 1
    assert "Phantom" in data["cases"][0]["title"]


def test_get_case_by_id(client, auth_headers):
    res = client.get("/api/v1/cases/26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    case = data["caseData"]
    assert case["id"] == "26189-042"
    assert case["firNo"] == "FIR-2026-NCRB-9021"
    assert case["severity"] == "CRITICAL"


def test_get_nonexistent_case(client, auth_headers):
    res = client.get("/api/v1/cases/NONEXISTENT-9999", headers=auth_headers)
    assert res.status_code == 404


def test_create_case(client, auth_headers):
    payload = {
        "title": "Operation Blackout - Ransomware Syndicate",
        "category": "Cyber Extortion",
        "location": "Bengaluru Tech Corridor",
        "risk_level": "CRITICAL",
        "risk_score": 95,
        "description": "Targeted ransomware deployed against cloud supply chain providers.",
        "suspect_count": 5,
        "evidence_count": 18
    }
    res = client.post("/api/v1/cases", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    created = data["caseData"]
    assert created["title"] == payload["title"]
    assert created["category"] == payload["category"]
    assert created["severity"] == "CRITICAL"
    assert created["assignedOfficer"] == "Inspector R. S. Verma"
    assert "FIR-2026-NCRB-" in created["firNo"]


def test_update_case(client, auth_headers):
    update_payload = {
        "status": "CLOSED",
        "risk_score": 10
    }
    res = client.patch("/api/v1/cases/26189-144", json=update_payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    updated = data["caseData"]
    assert updated["status"] == "CLOSED"
    assert updated["riskScore"] == 10
