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


def test_list_entities_unauthorized(client):
    res = client.get("/api/v1/entities")
    assert res.status_code == 401


def test_list_entities_authenticated(client, auth_headers):
    res = client.get("/api/v1/entities", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 4
    assert len(data["entities"]) >= 4

    first = data["entities"][0]
    assert "name" in first
    assert "type" in first
    assert "riskScore" in first


def test_filter_entities_by_case(client, auth_headers):
    res = client.get("/api/v1/entities?caseId=26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["entities"]:
        assert item["associatedCase"] == "26189-042"


def test_filter_entities_by_type(client, auth_headers):
    res = client.get("/api/v1/entities?type=Phone", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["entities"]:
        assert item["type"].lower() == "phone"


def test_get_entity_by_id(client, auth_headers):
    res = client.get("/api/v1/entities/ENT-901", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    ent = data["entity"]
    assert ent["id"] == "ENT-901"
    assert ent["name"] == "+91 98210-XXXXX"
    assert ent["riskScore"] == 92


def test_get_nonexistent_entity(client, auth_headers):
    res = client.get("/api/v1/entities/ENT-NONEXISTENT", headers=auth_headers)
    assert res.status_code == 404


def test_create_entity(client, auth_headers):
    payload = {
        "type": "Vehicle",
        "name": "DL-01-AB-1234 (Black Scorpio)",
        "aliases": "Getaway Vehicle",
        "riskScore": 88,
        "caseId": "26189-042",
        "status": "IMPOUNDED"
    }
    res = client.post("/api/v1/entities", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    created = data["entity"]
    assert created["name"] == payload["name"]
    assert created["type"] == "Vehicle"
    assert created["riskScore"] == 88
    assert created["status"] == "IMPOUNDED"
    assert created["associatedCase"] == "26189-042"


def test_update_entity_status(client, auth_headers):
    res = client.patch("/api/v1/entities/ENT-904?status=CAPTURED&riskScore=20", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    updated = data["entity"]
    assert updated["id"] == "ENT-904"
    assert updated["status"] == "CAPTURED"
    assert updated["riskScore"] == 20
