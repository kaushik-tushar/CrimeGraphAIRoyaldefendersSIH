from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(64), primary_key=True, index=True)
    license_plate = Column(String(64), nullable=False, index=True)  # e.g. "UP 16 Z 9041", "DL 01 AB 7744"
    make_model = Column(String(128), nullable=True)                 # e.g. "Toyota Fortuner", "Mahindra Scorpio"
    color = Column(String(64), nullable=True)                       # e.g. "Obsidian Black", "Metallic Silver"
    vin = Column(String(64), nullable=True, index=True)             # Vehicle Identification Number
    owner_name = Column(String(128), nullable=True)
    associated_case_id = Column(String(64), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    risk_score = Column(Integer, nullable=False, default=70)
    status = Column(String(64), nullable=False, default="FLAGGED")  # FLAGGED, IMPOUNDED, STOLEN, SURVEILLANCE
    last_seen_location = Column(String(256), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    case = relationship("Case", foreign_keys=[associated_case_id], backref="associated_vehicles")

    def to_dict(self):
        return {
            "id": self.id,
            "licensePlate": self.license_plate,
            "license_plate": self.license_plate,
            "makeModel": self.make_model or "",
            "make_model": self.make_model or "",
            "color": self.color or "",
            "vin": self.vin or "",
            "ownerName": self.owner_name or "",
            "owner_name": self.owner_name or "",
            "associatedCase": self.associated_case_id,
            "associated_case_id": self.associated_case_id,
            "caseId": self.associated_case_id,
            "riskScore": self.risk_score,
            "risk_score": self.risk_score,
            "status": self.status,
            "lastSeenLocation": self.last_seen_location or "",
            "last_seen_location": self.last_seen_location or "",
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
