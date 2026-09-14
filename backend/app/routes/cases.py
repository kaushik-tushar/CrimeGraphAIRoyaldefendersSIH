import random
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.database.postgres import get_db
from app.models.user import User
from app.models.case import Case
from app.schemas.case import (
    CaseCreate,
    CaseUpdate,
    CaseListResponse,
    SingleCaseResponse,
)
from app.security.permissions import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Case Management"])


@router.get("", response_model=CaseListResponse, summary="List Tactical Case Files")
def list_cases(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by case status (ACTIVE, CLOSED, etc.)"),
    severity_filter: Optional[str] = Query(None, alias="severity", description="Filter by severity / risk level"),
    search_query: Optional[str] = Query(None, alias="query", description="Search by title, FIR number, or Case ID"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all registered case files matching query parameters and filters.
    Protected by officer JWT authentication.
    """
    q = db.query(Case)

    if status_filter and status_filter.upper() != "ALL":
        q = q.filter(func.upper(Case.status) == status_filter.upper())

    if severity_filter and severity_filter.upper() != "ALL":
        q = q.filter(func.upper(Case.risk_level) == severity_filter.upper())

    if search_query:
        term = f"%{search_query.lower()}%"
        q = q.filter(
            or_(
                func.lower(Case.title).like(term),
                func.lower(Case.fir_number).like(term),
                func.lower(Case.case_id).like(term),
                func.lower(Case.crime_category).like(term),
                func.lower(Case.id).like(term)
            )
        )

    total_count = q.count()
    cases = q.order_by(Case.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "success": True,
        "cases": [c.to_dict() for c in cases],
        "total": total_count
    }


@router.get("/{case_id}", response_model=SingleCaseResponse, summary="Retrieve Specific Case File")
def get_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch a complete Case dossier by Case ID, database ID, or FIR Number.
    """
    case_record = db.query(Case).filter(
        or_(
            Case.id == case_id,
            Case.case_id == case_id,
            Case.fir_number == case_id
        )
    ).first()

    if not case_record:
        logger.warning(f"Case lookup failed: {case_id} not found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case file '{case_id}' was not found in National Crime Mesh registry."
        )

    return {
        "success": True,
        "caseData": case_record.to_dict()
    }


@router.post("", response_model=SingleCaseResponse, status_code=status.HTTP_201_CREATED, summary="Register New FIR / Case Dossier")
def create_case(
    case_data: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Register a new Case or FIR record under law enforcement supervision.
    Automatically assigns unique identifier and records lead officer identity.
    """
    generated_suffix = random.randint(100, 999)
    case_db_id = f"26189-{generated_suffix}"
    case_code = case_data.case_id or f"CASE #{case_db_id}"
    fir_num = case_data.fir_number or f"FIR-2026-NCRB-{random.randint(1000, 9990)}"

    # Ensure uniqueness of FIR number
    existing_fir = db.query(Case).filter(Case.fir_number == fir_num).first()
    if existing_fir:
        fir_num = f"{fir_num}-{random.randint(10, 99)}"

    # Assign lead officer
    assigned_id = case_data.assigned_investigator_id or current_user.id
    assigned_name = case_data.assigned_officer_name or current_user.name

    new_case = Case(
        id=case_db_id,
        case_id=case_code,
        fir_number=fir_num,
        title=case_data.title,
        crime_category=case_data.crime_category or "Organized Crime / Cyber Fraud",
        location=case_data.location or "Delhi NCR / Interstate",
        date=case_data.date or "2026-09-01",
        assigned_investigator_id=assigned_id,
        assigned_officer_name=assigned_name,
        status=case_data.status or "ACTIVE",
        risk_level=case_data.risk_level or "HIGH",
        risk_score=case_data.risk_score if case_data.risk_score is not None else 80,
        description=case_data.description or "",
        suspect_count=case_data.suspect_count or 0,
        evidence_count=case_data.evidence_count or 0
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    logger.info(f"Officer {current_user.badge_number} successfully registered new case {new_case.case_id} ({new_case.fir_number}).")

    return {
        "success": True,
        "caseData": new_case.to_dict()
    }


@router.patch("/{case_id}", response_model=SingleCaseResponse, summary="Update Case File Status or Details")
def update_case(
    case_id: str,
    updates: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update details, status, risk score, or counts for an existing Case.
    """
    case_record = db.query(Case).filter(
        or_(
            Case.id == case_id,
            Case.case_id == case_id,
            Case.fir_number == case_id
        )
    ).first()

    if not case_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case file '{case_id}' not found."
        )

    update_dict = updates.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        if hasattr(case_record, field):
            setattr(case_record, field, val)

    db.commit()
    db.refresh(case_record)

    logger.info(f"Officer {current_user.badge_number} updated case {case_record.id}.")

    return {
        "success": True,
        "caseData": case_record.to_dict()
    }
