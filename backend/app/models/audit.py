from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_badge = Column(String(64), nullable=True)
    user_name = Column(String(128), nullable=True)
    action_type = Column(String(64), nullable=False, index=True)  # e.g. USER_LOGIN, EVIDENCE_UPLOAD, CASE_ACCESS, ENTITY_VIEW, GRAPH_QUERY
    resource_type = Column(String(64), nullable=True)             # e.g. CASE, EVIDENCE, ENTITY, VEHICLE, PHONE, LOCATION, USER
    resource_id = Column(String(64), nullable=True, index=True)
    ip_address = Column(String(64), nullable=True)
    details = Column(String(1024), nullable=True)
    status = Column(String(32), nullable=False, default="SUCCESS") # SUCCESS, FAILURE, WARNING
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    user = relationship("User", foreign_keys=[user_id], backref="audit_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "user_id": self.user_id,
            "userBadge": self.user_badge or (self.user.badge_number if self.user else ""),
            "user_badge": self.user_badge or (self.user.badge_number if self.user else ""),
            "userName": self.user_name or (self.user.name if self.user else "System"),
            "user_name": self.user_name or (self.user.name if self.user else "System"),
            "actionType": self.action_type,
            "action_type": self.action_type,
            "action": self.action_type,
            "resourceType": self.resource_type or "",
            "resource_type": self.resource_type or "",
            "resourceId": self.resource_id or "",
            "resource_id": self.resource_id or "",
            "ipAddress": self.ip_address or "",
            "ip_address": self.ip_address or "",
            "details": self.details or "",
            "status": self.status,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S IST") if self.timestamp else "",
            "isoTimestamp": self.timestamp.isoformat() if self.timestamp else None,
            "created_at": self.timestamp.isoformat() if self.timestamp else None,
        }
