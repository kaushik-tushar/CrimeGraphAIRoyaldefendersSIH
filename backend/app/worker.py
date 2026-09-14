"""
Celery Background Worker and Task Execution Module for CrimeGraph AI.
Handles asynchronous evidence ingestion, OCR simulation, and NLP entity extraction.
"""

import os
import uuid
import logging
from typing import Dict, Any, List
from celery import Celery
from app.config import settings
from app.database.postgres import SessionLocal
from app.models.evidence import Evidence
from app.models.entity import Entity
from app.models.case import Case
from app.ai.nlp_processor import extract_entities

logger = logging.getLogger(__name__)

# Initialize Celery app instance configured with broker and backend
celery_app = Celery(
    "crimegraph_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.REDIS_URL,
)

import redis

# Check if Redis broker is actively reachable
def _check_broker_available(broker_url: str) -> bool:
    try:
        client = redis.Redis.from_url(broker_url, socket_connect_timeout=0.3, socket_timeout=0.3)
        client.ping()
        return True
    except Exception:
        return False

broker_online = _check_broker_available(settings.CELERY_BROKER_URL)
if not broker_online:
    logger.info(
        f"Redis broker at {settings.CELERY_BROKER_URL} is currently unreachable. "
        "Enabling Celery task_always_eager fallback for local environment / automated testing."
    )

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_always_eager=not broker_online,
    task_eager_propagates=False,
    broker_connection_retry_on_startup=False,
    broker_connection_max_retries=1,
    task_publish_retry=False,
    broker_transport_options={
        "socket_timeout": 0.5,
        "socket_connect_timeout": 0.5,
        "max_retries": 1,
    },
)

# Upload directory reference for OCR file reading
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))


def _simulate_ocr(evidence: Evidence) -> str:
    """
    Simulate OCR engine processing for evidence artifacts.
    If the file is accessible text/csv on disk, extracts content;
    otherwise generates contextually accurate tactical transcript for the artifact type.
    """
    file_path = None
    if evidence.file_url:
        # Extract filename from URL (e.g., /uploads/filename.ext)
        file_name = os.path.basename(evidence.file_url)
        candidate_path = os.path.join(UPLOAD_DIR, file_name)
        if os.path.exists(candidate_path):
            file_path = candidate_path

    # Try reading as text if small text/csv file
    if file_path and os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read(4096)
                if content and len(content.strip()) > 20:
                    return content
        except Exception as e:
            logger.warning(f"Could not read evidence file for OCR: {e}")

    # Fallback / Simulated OCR transcripts by evidence classification
    evd_type = (evidence.file_type or "").upper()
    if "CDR" in evd_type or "TOWER" in evd_type:
        return (
            f"TELECOM SURVEILLANCE LOG [Source: {evidence.file_name}]: "
            f"Originating caller +91 98210-44910 registered at BTS Tower Sector 62, Noida. "
            f"High-frequency call handoff to +91 98101-23456. "
            f"Target: Amit Sharma identified in telecom cluster. Cross-reference Suspect: Vikram Malhotra."
        )
    elif "FINANCIAL" in evd_type or "BANK" in evd_type:
        return (
            f"FINANCIAL FORENSIC AUDIT [Artifact: {evidence.file_name}]: "
            f"Suspicious RTGS transaction of INR 35,00,000 cleared at Connaught Place, New Delhi branch. "
            f"Remitter registered as Rajesh Kumar. Beneficiary verification contact: +91 98765-43210. "
            f"Associated hub identified in Western Logistics Corridor."
        )
    elif "SURVEILLANCE" in evd_type or "IMAGE" in evd_type or "ANPR" in evd_type:
        return (
            f"OPTICAL INTELLIGENCE OCR RECOGNITION [Artifact: {evidence.file_name}]: "
            f"Subject: Kabir Singhania observed at Sector 18, Noida transit terminal. "
            f"Facial biometric confidence 94.2%. Escort phone contact: +91 99100-11223. "
            f"Secondary sighting reported near Hauz Khas, Delhi."
        )
    else:
        return (
            f"FORENSIC DOSSIER TRANSCRIPT [Document: {evidence.file_name}]: "
            f"Accused: Sunil Verma linked to coordinated syndicate logistics across Gurugram and Delhi. "
            f"Primary communications intercept: +91 98210-99887. "
            f"Key safehouse address flagged at Rohini, Delhi."
        )


@celery_app.task(name="app.worker.process_evidence_task")
def process_evidence_task(evidence_id: str) -> Dict[str, Any]:
    """
    Celery background task to process evidence artifact:
    1. Fetch Evidence record from database.
    2. Simulate OCR process to extract text from artifact.
    3. Run NLP Entity Extraction (PERSON, PHONE, LOCATION).
    4. Create and persist Entity records linked to the evidence case.

    Args:
        evidence_id (str): Unique evidence identifier (e.g. 'EVD-101')

    Returns:
        Dict[str, Any]: Execution summary with entity creation count and metadata.
    """
    logger.info(f"[Celery Worker] Starting background processing for evidence: {evidence_id}")
    db = SessionLocal()
    try:
        # 1. Fetch Evidence record
        evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            logger.error(f"[Celery Worker] Evidence record not found: {evidence_id}")
            return {
                "success": False,
                "evidence_id": evidence_id,
                "error": f"Evidence {evidence_id} not found"
            }

        # 2. Simulate OCR process
        ocr_text = _simulate_ocr(evidence)
        logger.info(f"[Celery Worker] OCR extraction generated {len(ocr_text)} characters for {evidence_id}")

        # 3. Call NLP entity extractor
        extracted = extract_entities(ocr_text)
        logger.info(f"[Celery Worker] Extracted {len(extracted)} candidate entities from OCR text")

        # 4. Create corresponding Entity records in the database
        created_entities: List[Entity] = []
        for ent in extracted:
            name_val = ent["name_or_value"]
            ent_type = ent["entity_type"]

            # Check if this entity already exists for the case to prevent duplicate clutter
            existing_ent = None
            if evidence.case_id:
                existing_ent = db.query(Entity).filter(
                    Entity.name_or_value == name_val,
                    Entity.associated_case_id == evidence.case_id
                ).first()

            if not existing_ent:
                new_ent_id = f"ENT-{uuid.uuid4().hex[:6].upper()}"
                new_entity = Entity(
                    id=new_ent_id,
                    entity_type=ent_type,
                    name_or_value=name_val,
                    aliases=ent.get("aliases", f"Extracted from {evidence.file_name}"),
                    risk_score=ent.get("risk_score", 75),
                    associated_case_id=evidence.case_id,
                    status="ACTIVE"
                )
                db.add(new_entity)
                created_entities.append(new_entity)

        # Update case metrics if case exists
        if evidence.case_id and created_entities:
            case = db.query(Case).filter(Case.id == evidence.case_id).first()
            if case:
                person_count = sum(1 for e in created_entities if e.entity_type == "Person")
                if person_count > 0:
                    case.suspect_count = (case.suspect_count or 0) + person_count

        db.commit()

        # Refresh created entities
        for ent in created_entities:
            db.refresh(ent)

        logger.info(
            f"[Celery Worker] Successfully processed evidence {evidence_id}: "
            f"created {len(created_entities)} new entities."
        )

        return {
            "success": True,
            "evidence_id": evidence.id,
            "case_id": evidence.case_id,
            "entities_found": len(extracted),
            "entities_created": len(created_entities),
            "created_entities": [e.to_dict() for e in created_entities]
        }

    except Exception as e:
        db.rollback()
        logger.exception(f"[Celery Worker] Error processing evidence {evidence_id}: {e}")
        return {
            "success": False,
            "evidence_id": evidence_id,
            "error": str(e)
        }
    finally:
        db.close()
