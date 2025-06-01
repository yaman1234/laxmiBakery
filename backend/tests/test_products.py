"""
Tests for product endpoints
"""
import pytest
from httpx import AsyncClient
from bson import ObjectId
from datetime import datetime

pytestmark = pytest.mark.asyncio

async def test_create_product(test_client: AsyncClient, test_db, admin_token, test_image_file):
    """Test creating a new product"""
    # Create a test category first
    category_data = {"name": "Test Category", "description": "Test Category Description"}
    category_result = await test_db.categories.insert_one(category_data)
    category_id = str(category_result.inserted_id)
    
    # Create product
    headers = {"Authorization": f"Bearer {admin_token}"}
    data = {
        "name": "Test Product",
        "description": "Test Description",
        "price": "9.99",  # Form data requires strings
        "category_id": category_id
    }
    
    with open(test_image_file, "rb") as image:
        files = {"image": ("test.jpg", image, "image/jpeg")}
        response = await test_client.post(
            "/products",
            data=data,
            files=files,
            headers=headers
        )
    
    assert response.status_code == 201
    product_data = response.json()
    assert product_data["name"] == data["name"]
    assert product_data["price"] == float(data["price"])
    assert "image_url" in product_data
    assert product_data["is_available"] is True

async def test_create_product_unauthorized(test_client: AsyncClient, test_db, test_image_file):
    """Test creating product without admin token"""
    category_result = await test_db.categories.insert_one({"name": "Test Category"})
    category_id = str(category_result.inserted_id)
    
    data = {
        "name": "Test Product",
        "description": "Test Description",
        "price": "9.99",
        "category_id": category_id
    }
    
    with open(test_image_file, "rb") as image:
        files = {"image": ("test.jpg", image, "image/jpeg")}
        response = await test_client.post("/products", data=data, files=files)
    
    assert response.status_code == 401

async def test_list_products(test_client: AsyncClient, test_db):
    """Test listing products"""
    # Insert test products
    products = [
        {
            "name": "Product 1",
            "description": "Description 1",
            "price": 10.99,
            "category_id": str(ObjectId()),
            "image_url": "/uploads/test1.jpg",
            "is_available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Product 2",
            "description": "Description 2",
            "price": 20.99,
            "category_id": str(ObjectId()),
            "image_url": "/uploads/test2.jpg",
            "is_available": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    await test_db.products.insert_many(products)
    
    # Test listing all products
    response = await test_client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    
    # Test listing available products only
    response = await test_client.get("/products?available_only=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_available"] is True

async def test_get_product(test_client: AsyncClient, test_db):
    """Test getting a single product"""
    # Insert test product
    product = {
        "name": "Test Product",
        "description": "Test Description",
        "price": 15.99,
        "category_id": str(ObjectId()),
        "image_url": "/uploads/test.jpg",
        "is_available": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await test_db.products.insert_one(product)
    product_id = str(result.inserted_id)
    
    # Get product
    response = await test_client.get(f"/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product["name"]
    assert data["price"] == product["price"]

async def test_update_product(test_client: AsyncClient, test_db, admin_token):
    """Test updating a product"""
    # Insert test product
    product = {
        "name": "Original Name",
        "description": "Original Description",
        "price": 10.99,
        "category_id": str(ObjectId()),
        "image_url": "/uploads/test.jpg",
        "is_available": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await test_db.products.insert_one(product)
    product_id = str(result.inserted_id)
    
    # Update product
    headers = {"Authorization": f"Bearer {admin_token}"}
    update_data = {
        "name": "Updated Name",
        "price": 15.99,
        "is_available": False
    }
    
    response = await test_client.put(
        f"/products/{product_id}",
        json=update_data,
        headers=headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["price"] == update_data["price"]
    assert data["is_available"] == update_data["is_available"]
    assert data["description"] == product["description"]  # Unchanged field

async def test_delete_product(test_client: AsyncClient, test_db, admin_token):
    """Test deleting a product"""
    # Insert test product
    product = {
        "name": "Product to Delete",
        "description": "Will be deleted",
        "price": 10.99,
        "category_id": str(ObjectId()),
        "image_url": "/uploads/test.jpg",
        "is_available": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await test_db.products.insert_one(product)
    product_id = str(result.inserted_id)
    
    # Delete product
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = await test_client.delete(
        f"/products/{product_id}",
        headers=headers
    )
    
    assert response.status_code == 204
    
    # Verify product is deleted
    product = await test_db.products.find_one({"_id": ObjectId(product_id)})
    assert product is None 