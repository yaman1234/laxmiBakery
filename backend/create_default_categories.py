import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

# MongoDB connection settings
MONGODB_URL = "mongodb://localhost:27017"
DB_NAME = "laxmi_bakery"

async def create_default_categories():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    categories = db.categories

    # Default categories
    default_categories = [
        {
            "name": "Cakes",
            "description": "Delicious cakes for all occasions including birthdays, weddings, and celebrations.",
            "slug": "cakes",
        },
        {
            "name": "Pastries",
            "description": "Fresh and flaky pastries including croissants, danishes, and puffs.",
            "slug": "pastries",
        },
        {
            "name": "Breads",
            "description": "Freshly baked breads including whole wheat, multigrain, and specialty breads.",
            "slug": "breads",
        },
        {
            "name": "Cookies",
            "description": "Homemade cookies in various flavors including chocolate chip, butter, and specialty cookies.",
            "slug": "cookies",
        },
        {
            "name": "Cupcakes",
            "description": "Delightful cupcakes in various flavors with beautiful decorations.",
            "slug": "cupcakes",
        }
    ]

    # Create index for unique name
    await categories.create_index("name", unique=True)

    # Add categories
    for category in default_categories:
        try:
            # Check if category exists
            existing = await categories.find_one({"name": category["name"]})
            if not existing:
                print(f"Adding category: {category['name']}")
                await categories.insert_one(category)
            else:
                print(f"Category already exists: {category['name']}")
        except DuplicateKeyError:
            print(f"Category already exists: {category['name']}")
        except Exception as e:
            print(f"Error adding category {category['name']}: {str(e)}")

    # Print all categories
    print("\nCurrent categories in database:")
    async for category in categories.find():
        print(f"- {category['name']}")

    client.close()

if __name__ == "__main__":
    asyncio.run(create_default_categories()) 