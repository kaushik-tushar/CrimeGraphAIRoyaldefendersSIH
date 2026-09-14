from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class PhoneBase(BaseModel):
    phone_number: str = Field(..., description="E.164 or formatted telecom phone number")
    phoneNumber: Optional[str] = Field(None, description="Frontend alias for phone_number")
    imei: Optional[str] = Field(None, description="15-digit International Mobile Equipment Identity")
    imsi: Optional[str] = Field(None, description="International Mobile Subscriber Identity")
    carrier: Optional[str] = Field(None, description="Telecom network provider / carrier")
    registered_name: Optional[str] = Field(None, description="Subscriber name on telecom record")
    registeredName: Optional[str] = Field(None, description="Frontend alias for registered_name")
    associated_case_id: Optional[str] = Field(None, description="Linked Case ID")
    associatedCase: Optional[str] = Field(None, description="Frontend alias for associated_case_id")
    caseId: Optional[str] = Field(None, description="Frontend alias for caseId")
    risk_score: Optional[int] = Field(75, description="Syndicate risk score (1-100)")
    riskScore: Optional[int] = Field(None, description="Frontend alias for risk_score")
    status: Optional[str] = Field("ACTIVE", description="Status: ACTIVE, UNDER_SURVEILLANCE, INTERCEPTED, DISCONNECTED")
    call_count: Optional[int] = Field(0, description="Identified call frequency count")
    callCount: Optional[int] = Field(None, description="Frontend alias for call_count")

    @model_validator(mode="before")
    @classmethod
    def reconcile_phone_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "phoneNumber" in data and "phone_number" not in data:
                data["phone_number"] = data["phoneNumber"]
            if "registeredName" in data and "registered_name" not in data:
                data["registered_name"] = data["registeredName"]
            if "associatedCase" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["associatedCase"]
            elif "caseId" in data and "associated_case_id" not in data:
                data["associated_case_id"] = data["caseId"]
            if "riskScore" in data and "risk_score" not in data:
                data["risk_score"] = data["riskScore"]
            if "callCount" in data and "call_count" not in data:
                data["call_count"] = data["callCount"]
        return data


class PhoneCreate(PhoneBase):
    pass


class PhoneResponse(BaseModel):
    id: str
    phoneNumber: str
    phone_number: Optional[str] = None
    imei: Optional[str] = ""
    imsi: Optional[str] = ""
    carrier: Optional[str] = ""
    registeredName: Optional[str] = ""
    registered_name: Optional[str] = ""
    associatedCase: Optional[str] = None
    associated_case_id: Optional[str] = None
    caseId: Optional[str] = None
    riskScore: int
    risk_score: Optional[int] = None
    status: str
    callCount: int
    call_count: Optional[int] = None
    lastActive: Optional[str] = None
    last_active: Optional[str] = None
    createdAt: Optional[str] = None
    created_at: Optional[str] = None


class PhoneListResponse(BaseModel):
    success: bool = True
    phones: List[PhoneResponse]
    total: int


class SinglePhoneResponse(BaseModel):
    success: bool = True
    phone: PhoneResponse
