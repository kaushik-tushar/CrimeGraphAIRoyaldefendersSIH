from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(256), nullable=False, index=True)        # e.g. "Sector 62 Node, Noida"
    address = Column(String(512), nullable=True)                  # e.g. "C-56/12, Industrial Area, Sector 62"
    city = Column(String(128), nullable=True, index=True)         # e.g. "Noida", "New Delhi"
    state = Column(String(128), nullable=True)                    # e.g. "Uttar Pradesh", "Delhi"
    coordinates = Column(String(128), nullable=True)              # e.g. "28.6280, 77.3649"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_type = Column(String(64), nullable=False, default="SAFEHOUSE")  # SAFEHOUSE, BTS_TOWER, CRIME_SCENE, LOGISTICS_HUB, TRANSIT
    associated_case_id = Column(String(64), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    risk_score = Column(Integer, nullable=False, default=65)
    status = Column(String(64), nullable=False, default="SURVEILLANCE")      # SURVEILLANCE, RAIDED, MONITORED, INACTIVE

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    case = relationship("Case", foreign_keys=[associated_case_id], backref="associated_locations")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address or "",
            "city": self.city or "",
            "state": self.state or "",
            "coordinates": self.coordinates or "",
            "latitude": self.latitude,
            "longitude": self.longitude,
            "locationType": self.location_type,
            "location_type": self.location_type,
            "type": self.location_type,
            "associatedCase": self.associated_case_id,
            "associated_case_id": self.associated_case_id,
            "caseId": self.associated_case_id,
            "riskScore": self.risk_score,
            "risk_score": self.risk_score,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
