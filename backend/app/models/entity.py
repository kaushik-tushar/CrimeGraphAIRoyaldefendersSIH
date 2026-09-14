from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Entity(Base):
    __tablename__ = "entities"

    id = Column(String(64), primary_key=True, index=True)
    entity_type = Column(String(64), nullable=False, index=True)  # Person, Phone, Vehicle, Organization, Bank Account
    name_or_value = Column(String(256), nullable=False, index=True)
    aliases = Column(String(512), nullable=True)
    risk_score = Column(Integer, nullable=False, default=70)
    associated_case_id = Column(String(64), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(64), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    case = relationship("Case", foreign_keys=[associated_case_id], backref="associated_entities")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name_or_value,
            "name_or_value": self.name_or_value,
            "type": self.entity_type,
            "entity_type": self.entity_type,
            "aliases": self.aliases or "",
            "alias": self.aliases or "",
            "riskScore": self.risk_score,
            "risk_score": self.risk_score,
            "associatedCase": self.associated_case_id,
            "caseId": self.associated_case_id,
            "status": self.status,
            "lastSeen": self.updated_at.strftime("%Y-%m-%d %H:%M IST") if self.updated_at else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
