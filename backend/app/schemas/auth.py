from typing import Optional
from pydantic import BaseModel, Field, model_validator


class LoginRequest(BaseModel):
    badgeNumber: Optional[str] = Field(None, description="Officer Badge ID / Service Number")
    badgeId: Optional[str] = Field(None, description="Alternative field for Officer Badge ID")
    username: Optional[str] = Field(None, description="Alternative field for username")
    email: Optional[str] = Field(None, description="Alternative field for email")
    password: str = Field(..., description="Access password")
    twoFactorCode: Optional[str] = Field(None, description="Optional 6-digit TOTP key")

    @model_validator(mode="after")
    def check_identifier(self):
        ident = self.badgeNumber or self.badgeId or self.username or self.email
        if not ident:
            raise ValueError("An officer identifier (badgeNumber, badgeId, or username) is required.")
        return self

    @property
    def identifier(self) -> str:
        return (self.badgeNumber or self.badgeId or self.username or self.email or "").strip()


class UserProfileResponse(BaseModel):
    id: str
    badgeNumber: str
    name: str
    rank: str
    unit: str
    role: str
    clearanceLevel: str
    avatar: Optional[str] = None


class LoginResponse(BaseModel):
    success: bool = True
    token: str
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse


class SessionVerifyResponse(BaseModel):
    success: bool = True
    user: UserProfileResponse


class LogoutResponse(BaseModel):
    success: bool = True
    message: str = "Session terminated successfully."
