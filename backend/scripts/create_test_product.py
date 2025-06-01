import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

async def create_test_product():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["laxmi_bakery"]
    
    # First create a test category if it doesn't exist
    category = await db.categories.find_one({"name": "Test Category"})
    if not category:
        category_result = await db.categories.insert_one({
            "name": "Test Category",
            "description": "Test Category Description",
            "created_at": datetime.utcnow()
        })
        category_id = str(category_result.inserted_id)
    else:
        category_id = str(category["_id"])

    # Create a test product
    product = {
        "name": "Test Product",
        "description": "This is a test product",
        "price": 99.99,
        "category_id": category_id,
        "image_url": "/uploads/test.jpg",
        "is_available": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    try:
        result = await db.products.insert_one(product)
        print(f"Test product created with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Error creating test product: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_test_product()) 