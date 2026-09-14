import random
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.database.postgres import get_db
from app.models.user import User
from app.models.case import Case
from app.models.entity import Entity
from app.schemas.entity import (
    EntityCreate,
    EntityListResponse,
    SingleEntityResponse,
)
from app.security.permissions import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Entity Intelligence"])


@router.get("", response_model=EntityListResponse, summary="Query Intelligence Entities & Suspect Nodes")
def list_entities(
    case_id: Optional[str] = Query(None, alias="caseId", description="Filter by associated Case ID"),
    entity_type: Optional[str] = Query(None, alias="type", description="Filter by Entity category (Person, Phone, Vehicle, etc.)"),
    search_query: Optional[str] = Query(None, alias="query", description="Search by name, phone number, IMEI, or alias"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search and filter target entities across cases or statewide surveillance networks.
    """
    q = db.query(Entity)

    if case_id:
        q = q.filter(
            (Entity.associated_case_id == case_id) |
            (Entity.case.has(Case.case_id == case_id)) |
            (Entity.case.has(Case.fir_number == case_id))
        )

    if entity_type and entity_type.upper() != "ALL":
        q = q.filter(func.upper(Entity.entity_type) == entity_type.upper())

    if search_query:
        term = f"%{search_query.lower()}%"
        q = q.filter(
            or_(
                func.lower(Entity.name_or_value).like(term),
                func.lower(Entity.aliases).like(term),
                func.lower(Entity.id).like(term)
            )
        )

    total_count = q.count()
    items = q.order_by(Entity.risk_score.desc(), Entity.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "success": True,
        "entities": [e.to_dict() for e in items],
        "total": total_count
    }


@router.get("/{entity_id}", response_model=SingleEntityResponse, summary="Retrieve Entity Deep Profile")
def get_entity(
    entity_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch comprehensive intelligence dossier for a suspect, burner phone, IMEI, vehicle, or organization.
    """
    item = db.query(Entity).filter(Entity.id == entity_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entity '{entity_id}' not found in intelligence registry."
        )

    return {
        "success": True,
        "entity": item.to_dict()
    }


@router.post("", response_model=SingleEntityResponse, status_code=status.HTTP_201_CREATED, summary="Register New Intelligence Entity")
def create_entity(
    entity_data: EntityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Register a newly identified node/entity into the intelligence graph.
    """
    ent_id = f"ENT-{random.randint(100, 999)}"

    # Validate linked case
    resolved_case_id = None
    if entity_data.associated_case_id:
        case = db.query(Case).filter(
            (Case.id == entity_data.associated_case_id) |
            (Case.case_id == entity_data.associated_case_id) |
            (Case.fir_number == entity_data.associated_case_id)
        ).first()
        if case:
            resolved_case_id = case.id
            case.suspect_count = (case.suspect_count or 0) + 1

    new_entity = Entity(
        id=ent_id,
        entity_type=entity_data.entity_type,
        name_or_value=entity_data.name_or_value,
        aliases=entity_data.aliases or "",
        risk_score=entity_data.risk_score if entity_data.risk_score is not None else 70,
        associated_case_id=resolved_case_id,
        status=entity_data.status or "ACTIVE"
    )

    db.add(new_entity)
    db.commit()
    db.refresh(new_entity)

    logger.info(f"Officer {current_user.badge_number} registered entity {new_entity.id} ({new_entity.name_or_value}).")

    return {
        "success": True,
        "entity": new_entity.to_dict()
    }


@router.patch("/{entity_id}", response_model=SingleEntityResponse, summary="Update Entity Surveillance Status")
def update_entity_status(
    entity_id: str,
    status_val: Optional[str] = Query(None, alias="status"),
    risk_score: Optional[int] = Query(None, alias="riskScore"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Modify surveillance tracking or risk scoring for an entity.
    """
    item = db.query(Entity).filter(Entity.id == entity_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entity '{entity_id}' not found."
        )

    if status_val:
        item.status = status_val
    if risk_score is not None:
        item.risk_score = risk_score

    db.commit()
    db.refresh(item)

    return {
        "success": True,
        "entity": item.to_dict()
    }
