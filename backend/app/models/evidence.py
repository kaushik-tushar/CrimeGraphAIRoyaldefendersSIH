from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.postgres import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(64), primary_key=True, index=True)
    case_id = Column(String(64), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    file_name = Column(String(256), nullable=False)
    file_type = Column(String(64), nullable=False, default="DOCUMENT")
    file_url = Column(String(512), nullable=False)
    file_size = Column(String(64), nullable=True, default="0 KB")
    file_hash_sha256 = Column(String(64), nullable=False, index=True)
    uploaded_by_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    uploaded_by_name = Column(String(128), nullable=True)
    blockchain_status = Column(String(64), nullable=False, default="VERIFIED")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    case = relationship("Case", foreign_keys=[case_id], backref="evidence_items")
    uploader = relationship("User", foreign_keys=[uploaded_by_id], backref="uploaded_evidence")

    def to_dict(self):
        collector = self.uploaded_by_name
        if not collector and self.uploader:
            collector = self.uploader.name

        fir_num = self.case.fir_number if self.case else None

        return {
            "id": self.id,
            "caseId": self.case_id,
            "case_id": self.case_id,
            "firNo": fir_num,
            "fileName": self.file_name,
            "file_name": self.file_name,
            "fileType": self.file_type,
            "type": self.file_type,
            "fileUrl": self.file_url,
            "file_url": self.file_url,
            "fileSize": self.file_size,
            "sha256Hash": self.file_hash_sha256,
            "file_hash_sha256": self.file_hash_sha256,
            "uploadedById": self.uploaded_by_id,
            "collectedBy": collector or "Investigating Officer",
            "blockchainStatus": self.blockchain_status,
            "integrityStatus": self.blockchain_status,
            "timestamp": self.created_at.strftime("%Y-%m-%d %H:%M:%S IST") if self.created_at else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
