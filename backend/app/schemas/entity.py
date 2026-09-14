from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class EntityBase(BaseModel):
    entity_type: str = Field(..., description="Entity category: Person, Phone, Vehicle, Organization, Bank Account")
    type: Optional[str] = Field(None, description="Frontend alias for entity_type")
    name_or_value: str = Field(..., description="Entity identifier or legal name")
    name: Optional[str] = Field(None, description="Frontend alias for name_or_value")
    aliases: Optional[str] = Field("", description="Known aliases or front names")
    risk_score: Optional[int] = Field(70, description="Numerical syndicate threat risk score (1-100)")
    riskScore: Optional[int] = Field(None, description="Frontend alias for risk_score")
    associated_case_id: Optional[str] = Field(None, description="Linked Case ID")
    associatedCase: Optional[str] = Field(None, description="Frontend alias for associated_case_id")
    caseId: Optional[str] = Field(None, description="Frontend alias for caseId")
    status: Optional[str] = Field("ACTIVE", description="Surveillance status: UNDER_SURVEILLANCE, FLAGGED, FROZEN, ACTIVE")

    @model_validator(mode="before")
    @classmethod
    def reconcile_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "type" in data and "entity_type" not in data:
                data["entity_type"] = data["type"]
            if "name" in data and "name_or_value" not in data:
                data["name_or_value"] = data["name"]
            if "riskScore" in data and "risk_score" not in data:
                data["risk_score"] = data["riskScore"]
            if "associatedCase" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["associatedCase"]
            elif "caseId" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["caseId"]
        return data


class EntityCreate(EntityBase):
    pass


class EntityResponse(BaseModel):
    id: str
    name: str
    name_or_value: Optional[str] = None
    type: str
    entity_type: Optional[str] = None
    aliases: Optional[str] = ""
    alias: Optional[str] = ""
    riskScore: int
    risk_score: Optional[int] = None
    associatedCase: Optional[str] = None
    caseId: Optional[str] = None
    status: str
    lastSeen: Optional[str] = ""
    created_at: Optional[str] = None


class EntityListResponse(BaseModel):
    success: bool = True
    entities: List[EntityResponse]
    total: int


class SingleEntityResponse(BaseModel):
    success: bool = True
    entity: EntityResponse
