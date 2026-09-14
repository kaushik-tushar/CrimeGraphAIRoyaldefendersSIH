import io
import os
import hashlib
import pytest
from fastapi.testclient import TestClient
from app.main import app, UPLOAD_DIR


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


def test_list_evidence_unauthorized(client):
    res = client.get("/api/v1/evidence")
    assert res.status_code == 401


def test_list_evidence_authenticated(client, auth_headers):
    res = client.get("/api/v1/evidence", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 2
    assert len(data["evidence"]) >= 2
    first = data["evidence"][0]
    assert "sha256Hash" in first
    assert "fileName" in first
    assert first["blockchainStatus"] == "VERIFIED"


def test_list_evidence_filter_by_case(client, auth_headers):
    res = client.get("/api/v1/evidence?caseId=26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["evidence"]:
        assert item["caseId"] == "26189-042"


def test_get_evidence_by_id(client, auth_headers):
    res = client.get("/api/v1/evidence/EVD-101", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    evd = data["evidence"]
    assert evd["id"] == "EVD-101"
    assert evd["fileName"] == "tower_dump_sector_62_noida.csv"
    assert len(evd["sha256Hash"]) == 64


def test_verify_evidence_checksum(client, auth_headers):
    res = client.post("/api/v1/evidence/EVD-101/verify", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["evidenceId"] == "EVD-101"
    assert data["integrityStatus"] == "VERIFIED"
    assert len(data["sha256Hash"]) == 64


def test_upload_evidence_file(client, auth_headers):
    file_bytes = b"Sample forensic call data dump\nCall 1: +9198210 to +9197110\n"
    expected_hash = hashlib.sha256(file_bytes).hexdigest()

    files = {
        "file": ("forensic_dump_test.csv", io.BytesIO(file_bytes), "text/csv")
    }
    data = {
        "case_id": "26189-042",
        "file_type": "CDR_TOWER_DUMP"
    }

    res = client.post("/api/v1/evidence/upload", files=files, data=data, headers=auth_headers)
    assert res.status_code == 201
    res_data = res.json()
    assert res_data["success"] is True

    created = res_data["evidence"]
    assert created["fileName"] == "forensic_dump_test.csv"
    assert created["sha256Hash"] == expected_hash
    assert created["caseId"] == "26189-042"
    assert created["blockchainStatus"] == "VERIFIED"
    assert created["collectedBy"] == "Inspector R. S. Verma"

    # Verify static file download accessibility
    file_url = created["fileUrl"]
    static_res = client.get(file_url)
    assert static_res.status_code == 200
    assert static_res.content == file_bytes
