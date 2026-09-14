from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, model_validator


class AssistantQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Tactical question or analysis query")
    case_id: Optional[str] = Field(None, description="Optional linked Case ID")
    caseId: Optional[str] = Field(None, description="Frontend alias for case_id")

    @model_validator(mode="before")
    @classmethod
    def reconcile_case_id(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "caseId" in data and "case_id" not in data:
                data["case_id"] = data["caseId"]
            elif "case_id" in data and "caseId" not in data:
                data["caseId"] = data["case_id"]
        return data


class AssistantQueryResponse(BaseModel):
    success: bool = True
    query: str
    case_id: Optional[str] = None
    caseId: Optional[str] = None
    fir_number: Optional[str] = None
    insight: str
    confidence_score: float = 0.96
    confidenceScore: float = 0.96
    source_documents: List[str] = Field(default_factory=list)
    sourceDocuments: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    recommendedActions: List[str] = Field(default_factory=list)
    tactical_summary: Optional[str] = ""
    tacticalSummary: Optional[str] = ""


class EntityRiskResponse(BaseModel):
    success: bool = True
    entity_id: str
    entity_name: str
    entity_type: str
    risk_score: int
    risk_level: str
    breakdown: Dict[str, Any] = Field(default_factory=dict)
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict)
    explanation: str
