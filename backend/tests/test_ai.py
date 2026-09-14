"""
Automated Test Suite for Phase 5: AI Ingestion Engine & Celery Worker.
Tests NLP entity extraction, OCR task simulation, and evidence upload dispatch.
"""

import io
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.database.postgres import SessionLocal
from app.models.evidence import Evidence
from app.models.entity import Entity
from app.ai.nlp_processor import extract_entities
from app.worker import process_evidence_task


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


def test_extract_entities_phone_numbers():
    text = (
        "Intercept from CDR dump: Originating terminal +91-98101-23456 "
        "connected to secondary line 9821044910."
    )
    entities = extract_entities(text)
    phone_entities = [e for e in entities if e["type"] == "Phone"]
    assert len(phone_entities) >= 2
    extracted_numbers = [e["value"] for e in phone_entities]
    assert any("+91-98101-23456" in num for num in extracted_numbers)
    assert any("9821044910" in num for num in extracted_numbers)


def test_extract_entities_persons():
    text = (
        "Police incident report: Suspect: Amit Sharma was spotted in conference with "
        "Target: Vikram Malhotra. Also observed was Raju standing guard."
    )
    entities = extract_entities(text)
    person_entities = [e for e in entities if e["type"] == "Person"]
    names = [e["value"] for e in person_entities]
    assert "Amit Sharma" in names
    assert "Vikram Malhotra" in names
    assert "Raju" in names


def test_extract_entities_locations():
    text = (
        "Surveillance log: Subject departed from Connaught Place heading towards "
        "Sector 62, Noida before halting at Western Logistics Corridor."
    )
    entities = extract_entities(text)
    loc_entities = [e for e in entities if e["type"] == "Location"]
    locations = [e["value"] for e in loc_entities]
    assert any("Connaught Place" in loc for loc in locations)
    assert any("Sector 62, Noida" in loc or "Noida" in loc for loc in locations)
    assert any("Western Logistics Corridor" in loc for loc in locations)


def test_extract_entities_empty_input():
    assert extract_entities("") == []
    assert extract_entities(None) == []


def test_process_evidence_task_sync_execution():
    """
    Test direct execution of process_evidence_task against an existing seeded evidence artifact.
    """
    db = SessionLocal()
    try:
        evidence = db.query(Evidence).filter(Evidence.id == "EVD-101").first()
        assert evidence is not None
        case_id = evidence.case_id

        # Run task directly
        result = process_evidence_task("EVD-101")
        assert result["success"] is True
        assert result["evidence_id"] == "EVD-101"
        assert result["case_id"] == case_id
        assert result["entities_found"] > 0

        # Verify created entities in database
        entities = db.query(Entity).filter(Entity.associated_case_id == case_id).all()
        assert len(entities) > 0
    finally:
        db.close()


def test_process_evidence_task_nonexistent_evidence():
    result = process_evidence_task("EVD-NONEXISTENT-999")
    assert result["success"] is False
    assert "not found" in result["error"].lower()


def test_upload_evidence_dispatches_celery_task(client, auth_headers):
    """
    Verify that POST /api/v1/evidence/upload dispatches process_evidence_task.delay.
    """
    file_bytes = b"CDR Log Dump\nSuspect: Rajesh Kumar\nPhone: +919876543210\nLocation: Connaught Place\n"
    files = {
        "file": ("ai_test_evidence.csv", io.BytesIO(file_bytes), "text/csv")
    }
    data = {
        "case_id": "26189-042",
        "file_type": "CDR_TOWER_DUMP"
    }

    with patch("app.routes.evidence.process_evidence_task.delay") as mock_delay:
        mock_delay.return_value = MagicMock(id="task-mock-12345")
        res = client.post("/api/v1/evidence/upload", files=files, data=data, headers=auth_headers)

        assert res.status_code == 201
        res_data = res.json()
        assert res_data["success"] is True
        evd_id = res_data["evidence"]["id"]

        # Assert task was dispatched with newly created evidence id
        mock_delay.assert_called_once_with(evd_id)
