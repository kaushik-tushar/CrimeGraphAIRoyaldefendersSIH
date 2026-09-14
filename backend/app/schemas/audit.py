from typing import Optional, List
from pydantic import BaseModel, Field


class AuditLogCreate(BaseModel):
    user_id: Optional[str] = None
    user_badge: Optional[str] = None
    user_name: Optional[str] = None
    action_type: str = Field(..., description="Action performed: USER_LOGIN, CASE_ACCESS, EVIDENCE_UPLOAD, etc.")
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    details: Optional[str] = None
    status: Optional[str] = "SUCCESS"


class AuditLogResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    user_id: Optional[str] = None
    userBadge: Optional[str] = ""
    user_badge: Optional[str] = ""
    userName: Optional[str] = "System"
    user_name: Optional[str] = "System"
    actionType: str
    action_type: Optional[str] = None
    action: Optional[str] = None
    resourceType: Optional[str] = ""
    resource_type: Optional[str] = ""
    resourceId: Optional[str] = ""
    resource_id: Optional[str] = ""
    ipAddress: Optional[str] = ""
    ip_address: Optional[str] = ""
    details: Optional[str] = ""
    status: str
    timestamp: str
    isoTimestamp: Optional[str] = None
    created_at: Optional[str] = None


class AuditLogListResponse(BaseModel):
    success: bool = True
    auditLogs: List[AuditLogResponse]
    total: int
