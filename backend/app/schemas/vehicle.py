from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class VehicleBase(BaseModel):
    license_plate: str = Field(..., description="Vehicle registration / license plate number")
    licensePlate: Optional[str] = Field(None, description="Frontend alias for license_plate")
    make_model: Optional[str] = Field(None, description="Make and model of the vehicle")
    makeModel: Optional[str] = Field(None, description="Frontend alias for make_model")
    color: Optional[str] = Field(None, description="Vehicle exterior color")
    vin: Optional[str] = Field(None, description="Vehicle Identification Number")
    owner_name: Optional[str] = Field(None, description="Registered legal owner name")
    ownerName: Optional[str] = Field(None, description="Frontend alias for owner_name")
    associated_case_id: Optional[str] = Field(None, description="Linked Case ID")
    associatedCase: Optional[str] = Field(None, description="Frontend alias for associated_case_id")
    caseId: Optional[str] = Field(None, description="Frontend alias for caseId")
    risk_score: Optional[int] = Field(70, description="Syndicate tactical risk score (1-100)")
    riskScore: Optional[int] = Field(None, description="Frontend alias for risk_score")
    status: Optional[str] = Field("FLAGGED", description="Status: FLAGGED, IMPOUNDED, STOLEN, SURVEILLANCE")
    last_seen_location: Optional[str] = Field(None, description="Last detected ANPR or tactical location")
    lastSeenLocation: Optional[str] = Field(None, description="Frontend alias for last_seen_location")

    @model_validator(mode="before")
    @classmethod
    def reconcile_vehicle_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "licensePlate" in data and "license_plate" not in data:
                data["license_plate"] = data["licensePlate"]
            if "makeModel" in data and "make_model" not in data:
                data["make_model"] = data["makeModel"]
            if "ownerName" in data and "owner_name" not in data:
                data["owner_name"] = data["ownerName"]
            if "associatedCase" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["associatedCase"]
            elif "caseId" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["caseId"]
            if "riskScore" in data and "risk_score" not in data:
                data["risk_score"] = data["riskScore"]
            if "lastSeenLocation" in data and "last_seen_location" not in data:
                data["last_seen_location"] = data["lastSeenLocation"]
        return data


class VehicleCreate(VehicleBase):
    pass


class VehicleResponse(BaseModel):
    id: str
    licensePlate: str
    license_plate: Optional[str] = None
    makeModel: Optional[str] = ""
    make_model: Optional[str] = ""
    color: Optional[str] = ""
    vin: Optional[str] = ""
    ownerName: Optional[str] = ""
    owner_name: Optional[str] = ""
    associatedCase: Optional[str] = None
    associated_case_id: Optional[str] = None
    caseId: Optional[str] = None
    riskScore: int
    risk_score: Optional[int] = None
    status: str
    lastSeenLocation: Optional[str] = ""
    last_seen_location: Optional[str] = ""
    createdAt: Optional[str] = None
    created_at: Optional[str] = None


class VehicleListResponse(BaseModel):
    success: bool = True
    vehicles: List[VehicleResponse]
    total: int


class SingleVehicleResponse(BaseModel):
    success: bool = True
    vehicle: VehicleResponse
