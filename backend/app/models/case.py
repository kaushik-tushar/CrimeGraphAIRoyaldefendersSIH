from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(64), primary_key=True, index=True)
    case_id = Column(String(64), unique=True, index=True, nullable=False)
    fir_number = Column(String(128), unique=True, index=True, nullable=False)
    title = Column(String(256), nullable=False)
    crime_category = Column(String(128), nullable=False, default="Organized Crime / Cyber Fraud")
    location = Column(String(256), nullable=True, default="Delhi NCR / Interstate")
    date = Column(String(64), nullable=True, default="2026-09-01")
    assigned_investigator_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_officer_name = Column(String(128), nullable=True)
    status = Column(String(64), nullable=False, default="ACTIVE")
    risk_level = Column(String(64), nullable=False, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    risk_score = Column(Integer, nullable=False, default=80)
    description = Column(Text, nullable=True)
    suspect_count = Column(Integer, default=0, nullable=False)
    evidence_count = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    assigned_investigator = relationship("User", foreign_keys=[assigned_investigator_id], backref="assigned_cases")

    def to_dict(self):
        officer_name = self.assigned_officer_name
        if not officer_name and self.assigned_investigator:
            officer_name = self.assigned_investigator.name

        return {
            "id": self.id,
            "caseId": self.case_id,
            "case_id": self.case_id,
            "firNo": self.fir_number,
            "fir_number": self.fir_number,
            "title": self.title,
            "category": self.crime_category,
            "crime_category": self.crime_category,
            "location": self.location,
            "date": self.date,
            "assignedInvestigatorId": self.assigned_investigator_id,
            "assignedOfficer": officer_name or "Unassigned",
            "status": self.status,
            "riskLevel": self.risk_level,
            "severity": self.risk_level,
            "riskScore": self.risk_score,
            "description": self.description or "",
            "suspectCount": self.suspect_count,
            "entitiesCount": self.suspect_count,
            "evidenceCount": self.evidence_count,
            "evidenceFilesCount": self.evidence_count,
            "lastUpdated": self.updated_at.strftime("%Y-%m-%d %H:%M IST") if self.updated_at else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
