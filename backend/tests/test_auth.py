"""
Tests for authentication endpoints
"""
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_register_user(test_client: AsyncClient, test_db):
    """Test user registration"""
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    response = await test_client.post("/auth/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "password" not in data

async def test_register_duplicate_email(test_client: AsyncClient, test_db):
    """Test registration with duplicate email"""
    user_data = {
        "email": "duplicate@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    # First registration
    response = await test_client.post("/auth/register", json=user_data)
    assert response.status_code == 201
    
    # Duplicate registration
    response = await test_client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

async def test_login_success(test_client: AsyncClient, test_db):
    """Test successful login"""
    # Register user first
    user_data = {
        "email": "login@example.com",
        "password": "testpass123",
        "full_name": "Login Test"
    }
    await test_client.post("/auth/register", json=user_data)
    
    # Try login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = await test_client.post("/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

async def test_login_invalid_credentials(test_client: AsyncClient, test_db):
    """Test login with invalid credentials"""
    login_data = {
        "username": "wrong@example.com",
        "password": "wrongpass"
    }
    response = await test_client.post("/auth/login", data=login_data)
    assert response.status_code == 401
    assert "incorrect email or password" in response.json()["detail"].lower()

async def test_get_current_user(test_client: AsyncClient, test_db, admin_token):
    """Test getting current user details"""
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = await test_client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"
    assert "password" not in data

async def test_get_current_user_invalid_token(test_client: AsyncClient, test_db):
    """Test getting user details with invalid token"""
    headers = {"Authorization": "Bearer invalid_token"}
    response = await test_client.get("/auth/me", headers=headers)
    assert response.status_code == 401 