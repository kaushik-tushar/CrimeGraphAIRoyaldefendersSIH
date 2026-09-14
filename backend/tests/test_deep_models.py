"""
Automated Test Suite for Specialized Entity Models: Vehicles, Phones, and Locations.
Tests API retrieval, case association filtering, search queries, and single dossier lookups.
"""

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


# ------------------ VEHICLES ------------------

def test_vehicles_unauthorized(client):
    res = client.get("/api/v1/vehicles")
    assert res.status_code == 401


def test_list_vehicles(client, auth_headers):
    res = client.get("/api/v1/vehicles", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 3
    assert len(data["vehicles"]) >= 3
    first = data["vehicles"][0]
    assert "licensePlate" in first
    assert "status" in first


def test_filter_vehicles_by_case(client, auth_headers):
    res = client.get("/api/v1/vehicles?caseId=26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["vehicles"]) >= 2
    for v in data["vehicles"]:
        assert v["caseId"] == "26189-042"


def test_get_vehicle_by_id(client, auth_headers):
    res = client.get("/api/v1/vehicles/VEH-101", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["vehicle"]["id"] == "VEH-101"
    assert data["vehicle"]["licensePlate"] == "UP 16 Z 9041"


def test_get_vehicle_not_found(client, auth_headers):
    res = client.get("/api/v1/vehicles/VEH-NONEXISTENT", headers=auth_headers)
    assert res.status_code == 404


# ------------------ PHONES ------------------

def test_phones_unauthorized(client):
    res = client.get("/api/v1/phones")
    assert res.status_code == 401


def test_list_phones(client, auth_headers):
    res = client.get("/api/v1/phones", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 3
    first = data["phones"][0]
    assert "phoneNumber" in first
    assert "status" in first


def test_filter_phones_by_case(client, auth_headers):
    res = client.get("/api/v1/phones?caseId=26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for p in data["phones"]:
        assert p["caseId"] == "26189-042"


def test_get_phone_by_id(client, auth_headers):
    res = client.get("/api/v1/phones/PHN-101", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["phone"]["id"] == "PHN-101"
    assert "+91 98210-44910" in data["phone"]["phoneNumber"]


def test_get_phone_not_found(client, auth_headers):
    res = client.get("/api/v1/phones/PHN-NONEXISTENT", headers=auth_headers)
    assert res.status_code == 404


# ------------------ LOCATIONS ------------------

def test_locations_unauthorized(client):
    res = client.get("/api/v1/locations")
    assert res.status_code == 401


def test_list_locations(client, auth_headers):
    res = client.get("/api/v1/locations", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 3
    first = data["locations"][0]
    assert "name" in first
    assert "locationType" in first


def test_filter_locations_by_case(client, auth_headers):
    res = client.get("/api/v1/locations?caseId=26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for loc in data["locations"]:
        assert loc["caseId"] == "26189-042"


def test_get_location_by_id(client, auth_headers):
    res = client.get("/api/v1/locations/LOC-101", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["location"]["id"] == "LOC-101"
    assert "Sector 62" in data["location"]["name"]


def test_get_location_not_found(client, auth_headers):
    res = client.get("/api/v1/locations/LOC-NONEXISTENT", headers=auth_headers)
    assert res.status_code == 404
