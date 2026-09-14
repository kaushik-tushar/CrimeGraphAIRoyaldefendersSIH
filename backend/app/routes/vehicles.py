import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.postgres import get_db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.case import Case
from app.schemas.vehicle import VehicleListResponse, SingleVehicleResponse
from app.security.permissions import get_current_user
from app.routes.audit import log_audit_event

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Vehicle Intelligence"])


@router.get("", response_model=VehicleListResponse, summary="List Tactical Vehicles Under Surveillance")
def list_vehicles(
    case_id: Optional[str] = Query(None, alias="caseId", description="Filter by associated Case ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by vehicle status (FLAGGED, STOLEN, etc.)"),
    search: Optional[str] = Query(None, description="Search query for license plate or owner"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve tracked vehicles registered in the law enforcement intelligence mesh.
    """
    q = db.query(Vehicle)

    if case_id:
        q = q.filter(
            (Vehicle.associated_case_id == case_id) |
            (Vehicle.case.has(Case.case_id == case_id)) |
            (Vehicle.case.has(Case.fir_number == case_id))
        )

    if status_filter and status_filter.upper() != "ALL":
        q = q.filter(Vehicle.status == status_filter.upper())

    if search:
        pattern = f"%{search}%"
        q = q.filter(
            Vehicle.license_plate.ilike(pattern) |
            Vehicle.make_model.ilike(pattern) |
            Vehicle.owner_name.ilike(pattern)
        )

    total_count = q.count()
    items = q.order_by(Vehicle.risk_score.desc(), Vehicle.created_at.desc()).offset(offset).limit(limit).all()

    log_audit_event(
        db=db,
        user=current_user,
        action_type="VEHICLES_QUERY",
        resource_type="VEHICLE",
        details=f"Listed {len(items)} vehicles (case filter: {case_id or 'all'})"
    )

    return {
        "success": True,
        "vehicles": [v.to_dict() for v in items],
        "total": total_count
    }


@router.get("/{vehicle_id}", response_model=SingleVehicleResponse, summary="Retrieve Vehicle Profile by ID")
def get_vehicle(
    vehicle_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve tactical dossier and ANPR history for a specific registered vehicle.
    """
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle '{vehicle_id}' not found in tactical registry."
        )

    log_audit_event(
        db=db,
        user=current_user,
        action_type="VEHICLE_VIEW",
        resource_type="VEHICLE",
        resource_id=vehicle.id,
        details=f"Accessed profile for plate {vehicle.license_plate}"
    )

    return {
        "success": True,
        "vehicle": vehicle.to_dict()
    }
