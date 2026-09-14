import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.postgres import get_db
from app.models.user import User
from app.models.location import Location
from app.models.case import Case
from app.schemas.location import LocationListResponse, SingleLocationResponse
from app.security.permissions import get_current_user
from app.routes.audit import log_audit_event

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Geospatial Intelligence"])


@router.get("", response_model=LocationListResponse, summary="List Tactical Locations & Safehouses")
def list_locations(
    case_id: Optional[str] = Query(None, alias="caseId", description="Filter by associated Case ID"),
    type_filter: Optional[str] = Query(None, alias="type", description="Filter by location type (SAFEHOUSE, BTS_TOWER, etc.)"),
    city: Optional[str] = Query(None, description="Filter by city/district"),
    search: Optional[str] = Query(None, description="Search by location name or address"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve mapped tactical safehouses, cell towers, and transit hubs.
    """
    q = db.query(Location)

    if case_id:
        q = q.filter(
            (Location.associated_case_id == case_id) |
            (Location.case.has(Case.case_id == case_id)) |
            (Location.case.has(Case.fir_number == case_id))
        )

    if type_filter and type_filter.upper() != "ALL":
        q = q.filter(Location.location_type == type_filter.upper())

    if city:
        q = q.filter(Location.city.ilike(f"%{city}%"))

    if search:
        pattern = f"%{search}%"
        q = q.filter(
            Location.name.ilike(pattern) |
            Location.address.ilike(pattern) |
            Location.city.ilike(pattern)
        )

    total_count = q.count()
    items = q.order_by(Location.risk_score.desc(), Location.created_at.desc()).offset(offset).limit(limit).all()

    log_audit_event(
        db=db,
        user=current_user,
        action_type="LOCATIONS_QUERY",
        resource_type="LOCATION",
        details=f"Listed {len(items)} tactical geospatial points (case: {case_id or 'all'})"
    )

    return {
        "success": True,
        "locations": [loc.to_dict() for loc in items],
        "total": total_count
    }


@router.get("/{location_id}", response_model=SingleLocationResponse, summary="Retrieve Location Dossier by ID")
def get_location(
    location_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve geospatial coordinates and surveillance status for a specific location.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Location '{location_id}' not found in tactical registry."
        )

    log_audit_event(
        db=db,
        user=current_user,
        action_type="LOCATION_VIEW",
        resource_type="LOCATION",
        resource_id=location.id,
        details=f"Viewed geospatial coordinates for {location.name}"
    )

    return {
        "success": True,
        "location": location.to_dict()
    }
