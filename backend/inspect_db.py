from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from pprint import pprint

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "laxmi_bakery"

async def inspect_collections():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    
    print("\nInspecting Categories Collection:")
    print("-" * 30)
    category = await db.categories.find_one()
    if category:
        print("Sample Category Document:")
        pprint(category)
    else:
        print("No categories found")
    
    print("\nInspecting Products Collection:")
    print("-" * 30)
    product = await db.products.find_one()
    if product:
        print("Sample Product Document:")
        pprint(product)
    else:
        print("No products found")

if __name__ == "__main__":
    asyncio.run(inspect_collections()) 