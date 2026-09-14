import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from app.database.postgres import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    SENIOR_INVESTIGATOR = "SENIOR_INVESTIGATOR"
    INVESTIGATOR = "INVESTIGATOR"
    ANALYST = "ANALYST"
    AUDITOR = "AUDITOR"
    VIEWER = "VIEWER"


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    badge_number = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    rank = Column(String(128), nullable=False, default="Investigating Officer")
    unit = Column(String(256), nullable=False, default="Cyber Crime Unit")
    role = Column(SQLEnum(UserRole, native_enum=False, length=64), default=UserRole.ANALYST, nullable=False)
    clearance_level = Column(String(64), nullable=False, default="LEVEL_3_CONFIDENTIAL")
    avatar_url = Column(String(512), nullable=True)
    hashed_password = Column(String(256), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "badgeNumber": self.badge_number,
            "name": self.name,
            "rank": self.rank,
            "unit": self.unit,
            "role": self.role.value if isinstance(self.role, UserRole) else str(self.role),
            "clearanceLevel": self.clearance_level,
            "avatar": self.avatar_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        }
