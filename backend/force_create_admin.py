import pymongo
from passlib.context import CryptContext
from datetime import datetime

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "laxmi_bakery"

def create_admin():
    try:
        client = pymongo.MongoClient(MONGO_URL)
        db = client[DATABASE_NAME]
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        email = "admin@example.com"
        password = "admin123"

        # Hash password using passlib to be 100% sure it's compatible
        hashed_password = pwd_context.hash(password)

        admin_data = {
            "email": email,
            "password": hashed_password,
            "is_admin": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Check if admin already exists
        existing_admin = db.users.find_one({"email": email})
        if existing_admin:
            print(f"Admin user {email} already exists! Updating password and is_admin flag...")
            db.users.update_one(
                {"email": email}, 
                {"$set": {
                    "password": hashed_password, 
                    "updated_at": datetime.utcnow(), 
                    "is_admin": True
                }}
            )
            print("Admin user updated successfully!")
        else:
            # Create admin user
            result = db.users.insert_one(admin_data)
            if result.inserted_id:
                print(f"Admin user {email} created successfully!")
            else:
                print("Failed to create admin user!")

        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_admin()
