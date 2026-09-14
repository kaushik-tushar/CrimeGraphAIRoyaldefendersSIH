from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class LocationBase(BaseModel):
    name: str = Field(..., description="Geographical name or tactical facility identifier")
    address: Optional[str] = Field(None, description="Full street address")
    city: Optional[str] = Field(None, description="City or district")
    state: Optional[str] = Field(None, description="State or province")
    coordinates: Optional[str] = Field(None, description="Latitude, Longitude string coordinates")
    latitude: Optional[float] = Field(None, description="Numerical latitude")
    longitude: Optional[float] = Field(None, description="Numerical longitude")
    location_type: Optional[str] = Field("SAFEHOUSE", description="Type: SAFEHOUSE, BTS_TOWER, CRIME_SCENE, LOGISTICS_HUB, TRANSIT")
    locationType: Optional[str] = Field(None, description="Frontend alias for location_type")
    type: Optional[str] = Field(None, description="Frontend alias for location_type")
    associated_case_id: Optional[str] = Field(None, description="Linked Case ID")
    associatedCase: Optional[str] = Field(None, description="Frontend alias for associated_case_id")
    caseId: Optional[str] = Field(None, description="Frontend alias for caseId")
    risk_score: Optional[int] = Field(65, description="Tactical location risk score (1-100)")
    riskScore: Optional[int] = Field(None, description="Frontend alias for risk_score")
    status: Optional[str] = Field("SURVEILLANCE", description="Status: SURVEILLANCE, RAIDED, MONITORED, INACTIVE")

    @model_validator(mode="before")
    @classmethod
    def reconcile_location_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "locationType" in data and "location_type" not in data:
                data["location_type"] = data["locationType"]
            elif "type" in data and "location_type" not in data:
                data["location_type"] = data["type"]
            if "associatedCase" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["associatedCase"]
            elif "caseId" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["caseId"]
            if "riskScore" in data and "risk_score" not in data:
                data["risk_score"] = data["riskScore"]
        return data


class LocationCreate(LocationBase):
    pass


class LocationResponse(BaseModel):
    id: str
    name: str
    address: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    coordinates: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    locationType: str
    location_type: Optional[str] = None
    type: Optional[str] = None
    associatedCase: Optional[str] = None
    associated_case_id: Optional[str] = None
    caseId: Optional[str] = None
    riskScore: int
    risk_score: Optional[int] = None
    status: str
    createdAt: Optional[str] = None
    created_at: Optional[str] = None


class LocationListResponse(BaseModel):
    success: bool = True
    locations: List[LocationResponse]
    total: int


class SingleLocationResponse(BaseModel):
    success: bool = True
    location: LocationResponse
