"""
Tactical Risk Scoring Engine for CrimeGraph AI.
Computes multi-factor dynamic threat scores for entities based on case severity,
evidence correlation density, and historical surveillance logs.
"""

import logging
from typing import Dict, Any, Optional
from app.database.postgres import SessionLocal
from app.models.entity import Entity
from app.models.case import Case
from app.models.evidence import Evidence
from app.models.audit import AuditLog
from app.models.phone import Phone
from app.models.vehicle import Vehicle
from app.models.location import Location

logger = logging.getLogger(__name__)


def calculate_entity_risk(entity_id: str) -> Dict[str, Any]:
    """
    Calculate dynamic multi-factor threat priority score (0-100) for a given entity.

    Factors analyzed:
    1. Base entity status threat weight (ABSCONDING, FLAGGED, UNDER_SURVEILLANCE, ACTIVE).
    2. Linked case severity (CRITICAL, HIGH, MEDIUM, LOW).
    3. Evidence correlation density (count of case evidence artifacts).
    4. Audit trail surveillance frequency (logged queries / intercepts).

    Args:
        entity_id (str): Unique entity ID (e.g. 'ENT-901', 'PHN-101', 'VEH-101', 'LOC-101').

    Returns:
        Dict[str, Any]: Detailed risk assessment and explainable factor breakdown.
    """
    db = SessionLocal()
    try:
        name_or_val = ""
        ent_type = "Entity"
        status = "ACTIVE"
        case_id = None
        base_threat = 25

        # 1. Look up in primary entities table
        entity = db.query(Entity).filter(Entity.id == entity_id).first()
        if entity:
            name_or_val = entity.name_or_value
            ent_type = entity.entity_type
            status = entity.status
            case_id = entity.associated_case_id
        else:
            # Check specialized tables
            phone = db.query(Phone).filter(Phone.id == entity_id).first()
            if phone:
                name_or_val = phone.phone_number
                ent_type = "Phone"
                status = phone.status
                case_id = phone.associated_case_id
            else:
                vehicle = db.query(Vehicle).filter(Vehicle.id == entity_id).first()
                if vehicle:
                    name_or_val = vehicle.license_plate
                    ent_type = "Vehicle"
                    status = vehicle.status
                    case_id = vehicle.associated_case_id
                else:
                    location = db.query(Location).filter(Location.id == entity_id).first()
                    if location:
                        name_or_val = location.name
                        ent_type = "Location"
                        status = location.status
                        case_id = location.associated_case_id

        if not name_or_val:
            return {
                "success": False,
                "entity_id": entity_id,
                "error": f"Entity '{entity_id}' not found in tactical registries."
            }

        # 2. Base status score
        status_upper = (status or "ACTIVE").upper()
        if "ABSCONDING" in status_upper:
            base_threat = 40
        elif "FLAGGED" in status_upper or "STOLEN" in status_upper:
            base_threat = 35
        elif "SURVEILLANCE" in status_upper or "INTERCEPTED" in status_upper:
            base_threat = 30
        elif "FROZEN" in status_upper or "IMPOUNDED" in status_upper:
            base_threat = 25
        elif "ACTIVE" in status_upper or "MONITORED" in status_upper:
            base_threat = 20
        else:
            base_threat = 15

        # 3. Linked Case severity weight
        case_weight = 10
        case_title = "Unassigned"
        case_risk_lvl = "MEDIUM"
        if case_id:
            case = db.query(Case).filter(Case.id == case_id).first()
            if case:
                case_title = case.title
                case_risk_lvl = (case.risk_level or "MEDIUM").upper()
                if "CRITICAL" in case_risk_lvl:
                    case_weight = 25
                elif "HIGH" in case_risk_lvl:
                    case_weight = 18
                elif "MEDIUM" in case_risk_lvl:
                    case_weight = 12
                else:
                    case_weight = 6

        # 4. Evidence correlation density
        evidence_count = 0
        if case_id:
            evidence_count = db.query(Evidence).filter(Evidence.case_id == case_id).count()
        evidence_weight = min(evidence_count * 4, 20)

        # 5. Audit log surveillance frequency
        audit_count = db.query(AuditLog).filter(AuditLog.resource_id == entity_id).count()
        audit_weight = min(audit_count * 5, 15)

        # Calculate final priority risk score
        calculated_score = min(max(base_threat + case_weight + evidence_weight + audit_weight, 10), 99)

        # Classify risk level
        if calculated_score >= 85:
            risk_level = "CRITICAL"
        elif calculated_score >= 70:
            risk_level = "HIGH"
        elif calculated_score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        explanation = (
            f"Entity '{name_or_val}' ({ent_type}) evaluated with {risk_level} threat priority score ({calculated_score}/100). "
            f"Assigned status '{status_upper}' (weight: +{base_threat}), linked to {case_risk_lvl} priority case '{case_title}' "
            f"(weight: +{case_weight}), corroborated by {evidence_count} evidence artifacts (weight: +{evidence_weight}), "
            f"and referenced in {audit_count} surveillance audit actions (weight: +{audit_weight})."
        )

        return {
            "success": True,
            "entity_id": entity_id,
            "entity_name": name_or_val,
            "entity_type": ent_type,
            "risk_score": calculated_score,
            "risk_level": risk_level,
            "breakdown": {
                "base_threat_weight": base_threat,
                "case_severity_weight": case_weight,
                "evidence_density_weight": evidence_weight,
                "surveillance_audit_weight": audit_weight,
            },
            "metrics": {
                "case_id": case_id,
                "case_risk_level": case_risk_lvl,
                "evidence_count": evidence_count,
                "audit_hits": audit_count,
            },
            "explanation": explanation
        }
    except Exception as e:
        logger.exception(f"Error calculating risk for {entity_id}: {e}")
        return {
            "success": False,
            "entity_id": entity_id,
            "error": str(e)
        }
    finally:
        db.close()
