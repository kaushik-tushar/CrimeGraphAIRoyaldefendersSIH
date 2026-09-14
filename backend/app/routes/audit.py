import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.postgres import get_db
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogListResponse, AuditLogResponse, AuditLogCreate
from app.security.permissions import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Audit & Compliance"])


def log_audit_event(
    db: Session,
    action_type: str,
    user: Optional[User] = None,
    user_id: Optional[str] = None,
    user_badge: Optional[str] = None,
    user_name: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    details: Optional[str] = None,
    status: str = "SUCCESS"
) -> AuditLog:
    """
    Utility helper to append an immutable audit log entry into the database.
    """
    try:
        resolved_uid = user.id if user else user_id
        resolved_badge = user.badge_number if user else user_badge
        resolved_name = user.name if user else (user_name or "System")

        audit_id = f"AUD-{uuid.uuid4().hex[:8].upper()}"
        entry = AuditLog(
            id=audit_id,
            user_id=resolved_uid,
            user_badge=resolved_badge,
            user_name=resolved_name,
            action_type=action_type,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            details=details,
            status=status
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        logger.info(f"[Audit Log] {action_type} recorded by {resolved_badge or 'System'}: {resource_type or ''} {resource_id or ''}")
        return entry
    except Exception as e:
        db.rollback()
        logger.error(f"[Audit Log] Failed to write audit event: {e}")
        return None


@router.get("", response_model=AuditLogListResponse, summary="Retrieve Immutable Audit Log Records")
def get_audit_logs(
    action_type: Optional[str] = Query(None, alias="actionType", description="Filter by action type (e.g. USER_LOGIN, CASE_ACCESS)"),
    user_id: Optional[str] = Query(None, alias="userId", description="Filter by user ID"),
    resource_type: Optional[str] = Query(None, alias="resourceType", description="Filter by resource type"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch audit trail logs for administrative oversight and chain-of-custody compliance.
    """
    q = db.query(AuditLog)

    if action_type:
        q = q.filter(AuditLog.action_type == action_type)
    if user_id:
        q = q.filter(AuditLog.user_id == user_id)
    if resource_type:
        q = q.filter(AuditLog.resource_type == resource_type)

    total_count = q.count()
    items = q.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

    return {
        "success": True,
        "auditLogs": [item.to_dict() for item in items],
        "total": total_count
    }


@router.post("", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED, summary="Record Custom Client/Security Audit Event")
def record_audit_log(
    payload: AuditLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Explicitly log a tactical or security audit event from client workflows.
    """
    entry = log_audit_event(
        db=db,
        action_type=payload.action_type,
        user=current_user,
        resource_type=payload.resource_type,
        resource_id=payload.resource_id,
        ip_address=payload.ip_address,
        details=payload.details,
        status=payload.status or "SUCCESS"
    )
    return entry.to_dict()
