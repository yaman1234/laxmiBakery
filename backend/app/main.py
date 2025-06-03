# Standard library imports
import os
from typing import Dict

# Third-party imports
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Local imports
from .database import init_db, db, users, products, categories

# Initialize FastAPI application
app = FastAPI(
    title="Laxmi Bakery API",
    description="Backend API for Laxmi Bakery Website",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI endpoint
    redoc_url="/redoc"  # ReDoc endpoint
)

# Add database and collections to app state
app.mongodb = db
app.users = users
app.products = products
app.categories = categories

# CORS Configuration
# Allow cross-origin requests for web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# File Storage Configuration
# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount static file directory for serving uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Include routers with their specific prefixes
from .routes import auth, products, categories
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(products.router, prefix="/products")  # This will handle /api/products/*
api_router.include_router(categories.router, prefix="/categories")

# Include the API router in the main app
app.include_router(api_router)

# Health Check Endpoint
@app.get("/health", tags=["System"])
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify API status
    
    Returns:
        dict: Status information including version
    """
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

# Startup Event Handler
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    await init_db()

# Main entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Enable auto-reload on code changes
    ) 