"""
Automated Test Suite for Audit Trail and Compliance System.
Tests audit logging utility, RBAC retrieval, filtering, and event recording.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.postgres import SessionLocal
from app.models.user import User
from app.models.audit import AuditLog
from app.routes.audit import log_audit_event


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


def test_get_audit_logs_unauthorized(client):
    res = client.get("/api/v1/audit-logs")
    assert res.status_code == 401


def test_get_audit_logs_authenticated(client, auth_headers):
    res = client.get("/api/v1/audit-logs", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total"] >= 3
    assert len(data["auditLogs"]) >= 3

    first = data["auditLogs"][0]
    assert "id" in first
    assert "actionType" in first
    assert "timestamp" in first


def test_filter_audit_logs_by_action(client, auth_headers):
    res = client.get("/api/v1/audit-logs?actionType=USER_LOGIN", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["auditLogs"]:
        assert item["actionType"] == "USER_LOGIN"


def test_filter_audit_logs_by_user(client, auth_headers):
    res = client.get("/api/v1/audit-logs?userId=OFFICER-9041", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["auditLogs"]:
        assert item["userId"] == "OFFICER-9041"


def test_filter_audit_logs_by_resource_type(client, auth_headers):
    res = client.get("/api/v1/audit-logs?resourceType=EVIDENCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    for item in data["auditLogs"]:
        assert item["resourceType"] == "EVIDENCE"


def test_record_audit_log_endpoint(client, auth_headers):
    payload = {
        "action_type": "SUSPECT_INTERROGATION_LOG",
        "resource_type": "SUSPECT",
        "resource_id": "ENT-904",
        "details": "Recorded formal interrogation statement at Sector 62 Cyber Cell",
        "status": "SUCCESS"
    }
    res = client.post("/api/v1/audit-logs", json=payload, headers=auth_headers)
    assert res.status_code == 201
    created = res.json()
    assert created["actionType"] == "SUSPECT_INTERROGATION_LOG"
    assert created["resourceType"] == "SUSPECT"
    assert created["resourceId"] == "ENT-904"
    assert created["userBadge"] == "INSP-26189"


def test_log_audit_event_helper():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.badge_number == "INSP-26189").first()
        assert user is not None

        entry = log_audit_event(
            db=db,
            action_type="SECURITY_PERIMETER_SCAN",
            user=user,
            resource_type="NETWORK",
            resource_id="NET-GATEWAY-01",
            details="Automated IDS perimeter scan verification",
            status="SUCCESS"
        )
        assert entry is not None
        assert entry.id.startswith("AUD-")
        assert entry.action_type == "SECURITY_PERIMETER_SCAN"
        assert entry.user_id == user.id

        # Query back from DB
        fetched = db.query(AuditLog).filter(AuditLog.id == entry.id).first()
        assert fetched is not None
        assert fetched.resource_id == "NET-GATEWAY-01"
    finally:
        db.close()
