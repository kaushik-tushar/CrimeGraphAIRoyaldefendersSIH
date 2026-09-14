from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Phone(Base):
    __tablename__ = "phones"

    id = Column(String(64), primary_key=True, index=True)
    phone_number = Column(String(64), nullable=False, index=True)  # e.g. "+91 98210-XXXXX", "+91 98101-23456"
    imei = Column(String(64), nullable=True, index=True)          # e.g. "869402049182391"
    imsi = Column(String(64), nullable=True)                      # e.g. SIM identifier
    carrier = Column(String(64), nullable=True)                   # e.g. "Airtel", "Jio", "Vodafone"
    registered_name = Column(String(128), nullable=True)          # Registered subscriber
    associated_case_id = Column(String(64), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    risk_score = Column(Integer, nullable=False, default=75)
    status = Column(String(64), nullable=False, default="ACTIVE") # ACTIVE, UNDER_SURVEILLANCE, INTERCEPTED, DISCONNECTED
    call_count = Column(Integer, nullable=False, default=0)
    last_active = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    case = relationship("Case", foreign_keys=[associated_case_id], backref="associated_phones")

    def to_dict(self):
        return {
            "id": self.id,
            "phoneNumber": self.phone_number,
            "phone_number": self.phone_number,
            "imei": self.imei or "",
            "imsi": self.imsi or "",
            "carrier": self.carrier or "",
            "registeredName": self.registered_name or "",
            "registered_name": self.registered_name or "",
            "associatedCase": self.associated_case_id,
            "associated_case_id": self.associated_case_id,
            "caseId": self.associated_case_id,
            "riskScore": self.risk_score,
            "risk_score": self.risk_score,
            "status": self.status,
            "callCount": self.call_count,
            "call_count": self.call_count,
            "lastActive": self.last_active.isoformat() if self.last_active else None,
            "last_active": self.last_active.isoformat() if self.last_active else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
