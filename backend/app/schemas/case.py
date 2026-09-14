from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class CaseBase(BaseModel):
    title: str = Field(..., description="Title or primary dossier name of the case")
    fir_number: Optional[str] = Field(None, description="Official FIR registration number")
    firNo: Optional[str] = Field(None, description="Frontend alias for FIR number")
    case_id: Optional[str] = Field(None, description="Unique case code like 'CASE #26189-042'")
    caseId: Optional[str] = Field(None, description="Frontend alias for case code")
    crime_category: Optional[str] = Field("Organized Crime / Cyber Fraud", description="Crime categorization")
    category: Optional[str] = Field(None, description="Frontend alias for crime categorization")
    location: Optional[str] = Field("Delhi NCR / Interstate", description="Primary jurisdiction/incident location")
    date: Optional[str] = Field(None, description="Incident or FIR registration date")
    assigned_investigator_id: Optional[str] = Field(None, description="Investigator officer ID")
    assigned_officer_name: Optional[str] = Field(None, description="Investigating officer display name")
    assignedOfficer: Optional[str] = Field(None, description="Frontend alias for officer name")
    status: Optional[str] = Field("ACTIVE", description="Case status: ACTIVE, UNDER_INVESTIGATION, CLOSED, etc.")
    risk_level: Optional[str] = Field("HIGH", description="Risk level: CRITICAL, HIGH, MEDIUM, LOW")
    severity: Optional[str] = Field(None, description="Frontend alias for risk level")
    risk_score: Optional[int] = Field(80, description="Numerical risk score between 1 and 100")
    riskScore: Optional[int] = Field(None, description="Frontend alias for risk score")
    description: Optional[str] = Field(None, description="Detailed case overview narrative")
    suspect_count: Optional[int] = Field(0, description="Count of identified suspects")
    evidence_count: Optional[int] = Field(0, description="Count of linked digital evidence items")

    @model_validator(mode="before")
    @classmethod
    def reconcile_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "firNo" in data and "fir_number" not in data:
                data["fir_number"] = data["firNo"]
            if "caseId" in data and "case_id" not in data:
                data["case_id"] = data["caseId"]
            if "category" in data and "crime_category" not in data:
                data["crime_category"] = data["category"]
            if "assignedOfficer" in data and "assigned_officer_name" not in data:
                data["assigned_officer_name"] = data["assignedOfficer"]
            if "severity" in data and "risk_level" not in data:
                data["risk_level"] = data["severity"]
            if "riskScore" in data and "risk_score" not in data:
                data["risk_score"] = data["riskScore"]
        return data


class CaseCreate(CaseBase):
    pass


class CaseUpdate(BaseModel):
    title: Optional[str] = None
    crime_category: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    risk_level: Optional[str] = None
    risk_score: Optional[int] = None
    description: Optional[str] = None
    suspect_count: Optional[int] = None
    evidence_count: Optional[int] = None
    assigned_investigator_id: Optional[str] = None
    assigned_officer_name: Optional[str] = None


class CaseResponse(BaseModel):
    id: str
    caseId: str
    case_id: Optional[str] = None
    firNo: str
    fir_number: Optional[str] = None
    title: str
    category: str
    crime_category: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    assignedInvestigatorId: Optional[str] = None
    assignedOfficer: Optional[str] = None
    status: str
    riskLevel: str
    severity: str
    riskScore: int
    description: Optional[str] = ""
    suspectCount: int = 0
    entitiesCount: int = 0
    evidenceCount: int = 0
    evidenceFilesCount: int = 0
    lastUpdated: Optional[str] = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class CaseListResponse(BaseModel):
    success: bool = True
    cases: List[CaseResponse]
    total: int


class SingleCaseResponse(BaseModel):
    success: bool = True
    caseData: CaseResponse
