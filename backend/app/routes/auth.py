import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.postgres import get_db
from app.models.user import User, UserRole
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    SessionVerifyResponse,
    LogoutResponse,
)
from app.security.hashing import verify_password
from app.security.jwt import create_access_token
from app.security.permissions import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=LoginResponse, summary="Authenticate Officer and Issue JWT")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate an officer using Badge ID / Service Number and password.
    Returns JWT access token and officer profile compatible with the CrimeGraph AI frontend.
    """
    identifier = login_data.identifier
    
    # Query user by badge_number (case-insensitive) or ID
    user = db.query(User).filter(
        func.lower(User.badge_number) == identifier.lower()
    ).first()

    if not user:
        user = db.query(User).filter(func.lower(User.id) == identifier.lower()).first()

    if not user:
        logger.warning(f"Failed login attempt: Identifier '{identifier}' not found.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Officer Badge ID or Password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(login_data.password, user.hashed_password):
        logger.warning(f"Failed login attempt: Incorrect password for officer '{identifier}'.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Officer Badge ID or Password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        logger.warning(f"Login rejected: Inactive account for officer '{identifier}'.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Officer account is deactivated. Contact Tactical Control System Admin.",
        )

    role_str = user.role.value if isinstance(user.role, UserRole) else str(user.role)
    token_payload = {
        "sub": user.badge_number,
        "id": user.id,
        "role": role_str,
        "name": user.name
    }
    token = create_access_token(data=token_payload)

    logger.info(f"Officer {user.badge_number} ({user.name}) successfully authenticated.")

    return {
        "success": True,
        "token": token,
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }


@router.get("/me", response_model=SessionVerifyResponse, summary="Get Current Authenticated Officer Profile")
def get_current_officer(current_user: User = Depends(get_current_user)):
    """
    Verify active session and retrieve officer identity attributes.
    """
    return {
        "success": True,
        "user": current_user.to_dict()
    }


@router.post("/logout", response_model=LogoutResponse, summary="Terminate Officer Session")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout officer session and acknowledge termination.
    """
    logger.info(f"Officer {current_user.badge_number} logged out.")
    return {
        "success": True,
        "message": "Session terminated successfully."
    }
