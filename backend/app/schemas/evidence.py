from typing import Optional, List
from pydantic import BaseModel, Field


class EvidenceResponse(BaseModel):
    id: str
    caseId: Optional[str] = None
    case_id: Optional[str] = None
    firNo: Optional[str] = None
    fileName: str
    file_name: Optional[str] = None
    fileType: str
    type: Optional[str] = None
    fileUrl: str
    file_url: Optional[str] = None
    fileSize: Optional[str] = "0 KB"
    sha256Hash: str
    file_hash_sha256: Optional[str] = None
    uploadedById: Optional[str] = None
    collectedBy: Optional[str] = "Investigating Officer"
    blockchainStatus: str = "VERIFIED"
    integrityStatus: str = "VERIFIED"
    timestamp: Optional[str] = ""
    created_at: Optional[str] = None


class EvidenceListResponse(BaseModel):
    success: bool = True
    evidence: List[EvidenceResponse]
    total: int


class SingleEvidenceResponse(BaseModel):
    success: bool = True
    evidence: EvidenceResponse


class ChecksumVerifyResponse(BaseModel):
    success: bool = True
    evidenceId: str
    sha256Hash: str
    integrityStatus: str = "VERIFIED"
    verifiedAt: str
