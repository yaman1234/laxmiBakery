from app.models import MenuResponse
from bson import ObjectId

# Simulate what the database returns
db_item = {
    "_id": str(ObjectId()),
    "cake_type": "Test Cake",
    "base_price": 500.0,
    "description": "Test Description",
    "category": "General",
    "is_active": True,
    "min_weight": 0.5
}

print(f"Testing validation with: {db_item}")

try:
    response = MenuResponse(**db_item)
    print("Success!")
    print(f"Validated Model: {response.model_dump()}")
except Exception as e:
    print(f"Validation Failed: {e}")
