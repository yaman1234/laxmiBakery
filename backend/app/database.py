# Third-party imports
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from pymongo.collection import Collection
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Database Configuration
MONGODB_URI: str = "mongodb://localhost:27017"
DB_NAME: str = "laxmi_bakery"

try:
    # Initialize MongoDB client
    logger.debug(f"Connecting to MongoDB at {MONGODB_URI}")
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000  # 5 second timeout for server selection
    )
    
    # Test connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Get database instance
db = client[DB_NAME]

# Collection definitions
# Each collection represents a different data type in our application
users = db.users           # User accounts and authentication
products = db.products     # Bakery products
categories = db.categories # Product categories

async def init_db() -> None:
    """
    Initialize database with required indexes
    
    Creates indexes for better query performance and data integrity
    Should be called when application starts
    """
    try:
        logger.debug("Starting database initialization")
        
        # Create unique index on user email
        logger.debug("Creating user email index")
        await users.create_index("email", unique=True)
        
        # Create indexes for product searches
        logger.debug("Creating product indexes")
        await products.create_index("name")
        await products.create_index("category_id")  # Changed from category to category_id
        await products.create_index([("name", "text"), ("description", "text")])  # Text search index
        
        # Create unique index on category name
        logger.debug("Creating category name index")
        await categories.create_index("name", unique=True)
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

def close_db() -> None:
    """
    Close database connection
    
    Should be called when application shuts down
    """
    try:
        client.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database connection: {str(e)}") 

# Add a function to get the next product_id
async def get_next_product_id():
    counter = await db.counters.find_one_and_update(
        {"_id": "product_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    return counter["seq"] 