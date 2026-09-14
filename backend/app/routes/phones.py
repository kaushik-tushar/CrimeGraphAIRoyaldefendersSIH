import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.postgres import get_db
from app.models.user import User
from app.models.phone import Phone
from app.models.case import Case
from app.schemas.phone import PhoneListResponse, SinglePhoneResponse
from app.security.permissions import get_current_user
from app.routes.audit import log_audit_event

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Telecom Intelligence"])


@router.get("", response_model=PhoneListResponse, summary="List Tracked Telecom Identifiers")
def list_phones(
    case_id: Optional[str] = Query(None, alias="caseId", description="Filter by associated Case ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (ACTIVE, UNDER_SURVEILLANCE, etc.)"),
    search: Optional[str] = Query(None, description="Search by phone number, IMEI, or subscriber name"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve tracked phone numbers and IMEI devices in the tactical surveillance grid.
    """
    q = db.query(Phone)

    if case_id:
        q = q.filter(
            (Phone.associated_case_id == case_id) |
            (Phone.case.has(Case.case_id == case_id)) |
            (Phone.case.has(Case.fir_number == case_id))
        )

    if status_filter and status_filter.upper() != "ALL":
        q = q.filter(Phone.status == status_filter.upper())

    if search:
        pattern = f"%{search}%"
        q = q.filter(
            Phone.phone_number.ilike(pattern) |
            Phone.imei.ilike(pattern) |
            Phone.registered_name.ilike(pattern) |
            Phone.carrier.ilike(pattern)
        )

    total_count = q.count()
    items = q.order_by(Phone.risk_score.desc(), Phone.created_at.desc()).offset(offset).limit(limit).all()

    log_audit_event(
        db=db,
        user=current_user,
        action_type="PHONES_QUERY",
        resource_type="PHONE",
        details=f"Queried {len(items)} phone intercept targets (case: {case_id or 'all'})"
    )

    return {
        "success": True,
        "phones": [p.to_dict() for p in items],
        "total": total_count
    }


@router.get("/{phone_id}", response_model=SinglePhoneResponse, summary="Retrieve Telecom Profile by ID")
def get_phone(
    phone_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve CDR intercept logs and detailed profile for a specific monitored telecom target.
    """
    phone = db.query(Phone).filter(Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Phone target '{phone_id}' not found in telecom registry."
        )

    log_audit_event(
        db=db,
        user=current_user,
        action_type="PHONE_VIEW",
        resource_type="PHONE",
        resource_id=phone.id,
        details=f"Viewed telecom profile for {phone.phone_number}"
    )

    return {
        "success": True,
        "phone": phone.to_dict()
    }
