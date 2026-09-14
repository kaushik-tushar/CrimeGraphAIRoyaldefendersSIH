import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.security.hashing import get_password_hash, verify_password
from app.security.jwt import create_access_token, decode_access_token


@pytest.fixture(scope="module")
def client():
    """
    TestClient context manager ensures FastAPI lifespan triggers (creating tables and seeding users).
    """
    with TestClient(app) as test_client:
        yield test_client


def test_password_hashing():
    raw_password = "SecurePassword2026!"
    hashed = get_password_hash(raw_password)
    
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_token_flow():
    payload = {
        "sub": "INSP-26189",
        "id": "OFFICER-9041",
        "role": "ADMIN"
    }
    token = create_access_token(payload)
    assert isinstance(token, str) and len(token) > 20

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "INSP-26189"
    assert decoded["id"] == "OFFICER-9041"
    assert decoded["role"] == "ADMIN"
    assert "exp" in decoded

    # Invalid token check
    assert decode_access_token("corrupted.token.value") is None


def test_health_endpoints(client):
    res1 = client.get("/health")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["status"] == "healthy"

    res2 = client.get("/api/v1/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"


def test_admin_login_success(client):
    payload = {
        "badgeNumber": "INSP-26189",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "token" in data
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    user = data["user"]
    assert user["id"] == "OFFICER-9041"
    assert user["badgeNumber"] == "INSP-26189"
    assert user["name"] == "Inspector R. S. Verma"
    assert user["role"] == "ADMIN"
    assert user["clearanceLevel"] == "LEVEL_4_TOP_SECRET"


def test_senior_investigator_login_success(client):
    # Tests badgeId alias acceptance
    payload = {
        "badgeId": "NCRB-OFFICER-8021",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    user = data["user"]
    assert user["badgeNumber"] == "NCRB-OFFICER-8021"
    assert user["role"] == "SENIOR_INVESTIGATOR"
    assert "ACP Vikram Malhotra" in user["name"]


def test_analyst_login_with_alias_route(client):
    # Tests /api/auth/login alias route
    payload = {
        "username": "ANALYST-5501",
        "password": "password123"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    user = data["user"]
    assert user["badgeNumber"] == "ANALYST-5501"
    assert user["role"] == "ANALYST"
    assert user["clearanceLevel"] == "LEVEL_3_CONFIDENTIAL"


def test_login_invalid_password(client):
    payload = {
        "badgeNumber": "INSP-26189",
        "password": "incorrect_password"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid" in response.json()["detail"]


def test_login_unknown_badge(client):
    payload = {
        "badgeNumber": "UNKNOWN-9999",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid" in response.json()["detail"]


def test_protected_me_endpoint(client):
    # 1. Without credentials -> 401
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

    # 2. Login to obtain token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"badgeNumber": "INSP-26189", "password": "password123"}
    )
    token = login_res.json()["token"]

    # 3. Access with Bearer token -> 200
    headers = {"Authorization": f"Bearer {token}"}
    auth_res = client.get("/api/v1/auth/me", headers=headers)
    assert auth_res.status_code == 200
    data = auth_res.json()
    assert data["success"] is True
    assert data["user"]["badgeNumber"] == "INSP-26189"


def test_logout_endpoint(client):
    # Obtain token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"badgeNumber": "INSP-26189", "password": "password123"}
    )
    token = login_res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    logout_res = client.post("/api/v1/auth/logout", headers=headers)
    assert logout_res.status_code == 200
    assert logout_res.json()["success"] is True
