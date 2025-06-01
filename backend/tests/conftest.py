"""
Test configuration and fixtures for Laxmi Bakery API tests
"""
import os
import pytest
import asyncio
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.testclient import TestClient

from app.main import app
from app.database import init_db

# Test database name
TEST_DB_NAME = "laxmi_bakery_test"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_client():
    """Create a test client for the FastAPI application"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture(scope="function")
async def test_db():
    """Create a test database and clean it up after tests"""
    # Connect to test database
    client = AsyncIOMotorClient()
    test_db = client[TEST_DB_NAME]
    
    # Replace the main database with test database
    app.mongodb = test_db
    
    # Initialize collections
    app.users = test_db.users
    app.products = test_db.products
    app.categories = test_db.categories
    
    # Initialize indexes
    await init_db()
    
    yield test_db
    
    # Clean up: drop test database after tests
    await client.drop_database(TEST_DB_NAME)

@pytest.fixture
def test_image_file():
    """Create a temporary test image file"""
    # Create a small test image
    image_path = "test_image.jpg"
    with open(image_path, "wb") as f:
        f.write(b"fake image content")
    
    yield image_path
    
    # Clean up
    if os.path.exists(image_path):
        os.remove(image_path)

@pytest.fixture
async def admin_token(test_client):
    """Create and return an admin user token for testing"""
    admin_data = {
        "email": "admin@test.com",
        "password": "testpass123",
        "full_name": "Test Admin",
        "is_admin": True  # Set admin flag
    }
    
    # Register admin
    await test_client.post("/auth/register", json=admin_data)
    
    # Login and get token
    response = await test_client.post("/auth/login", data={
        "username": admin_data["email"],
        "password": admin_data["password"]
    })
    
    return response.json()["access_token"] 