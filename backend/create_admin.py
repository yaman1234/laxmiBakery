from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from passlib.context import CryptContext
import asyncio

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "laxmi_bakery"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    
    # Admin user data
    admin_data = {
        "email": "admin@example.com",
        "password": pwd_context.hash("admin123"),
        "is_admin": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": admin_data["email"]})
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    result = await db.users.insert_one(admin_data)
    if result.inserted_id:
        print("Admin user created successfully!")
    else:
        print("Failed to create admin user!")

if __name__ == "__main__":
    asyncio.run(create_admin_user()) 