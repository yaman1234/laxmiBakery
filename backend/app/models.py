# Standard library imports
from typing import List, Optional, Dict
from datetime import datetime

# Third-party imports
from pydantic import BaseModel, Field, EmailStr

# User Models
class UserBase(BaseModel):
    """Base User model with common attributes"""
    email: EmailStr
    full_name: str
    is_admin: bool = False

class UserCreate(UserBase):
    """User creation model with password field"""
    password: str

class UserResponse(UserBase):
    """User response model excluding sensitive data"""
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        """Pydantic model configuration"""
        populate_by_name = True

# Product Models
class ProductBase(BaseModel):
    """Base Product model with common attributes"""
    name: str
    description: str
    price: float
    category: str  # Changed from category_id to category
    available: bool = True  # Changed from is_available to available
    discount: float = 0
    tags: List[str] = []
    images: List[str] = []  # Changed from single image_url to images array

class ProductCreate(ProductBase):
    """Product creation model"""
    pass

class ProductUpdate(BaseModel):
    """Product update model with optional fields"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None  # Changed from category_id to category
    available: Optional[bool] = None  # Changed from is_available to available
    discount: Optional[float] = None
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None

class ProductResponse(ProductBase):
    """Model for product response data"""
    id: str = Field(alias="_id")

    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Chocolate Truffle Cake",
                "description": "Rich and moist chocolate cake layered with dark chocolate ganache.",
                "price": 850,
                "category": "Cake",
                "available": True,
                "discount": 0,
                "tags": ["chocolate", "birthday", "eggless"],
                "images": ["/images/products/chocolate-truffle.jpg"]
            }
        }
        populate_by_name = True

class ProductListResponse(BaseModel):
    """Model for paginated product list response"""
    items: List[ProductResponse]
    pagination: dict

# Category Models
class CategoryBase(BaseModel):
    """Base model for category data"""
    name: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=10, max_length=500)
    slug: str  # Added slug field, removed image_url

class CategoryCreate(CategoryBase):
    """Model for creating a new category"""
    pass

class CategoryUpdate(BaseModel):
    """Model for updating an existing category"""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, min_length=10, max_length=500)
    slug: Optional[str] = None

class CategoryResponse(CategoryBase):
    """Model for category response data"""
    id: str = Field(alias="_id")

    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "Cakes",
                "description": "Delicious cakes perfect for every occasion including birthdays and celebrations.",
                "slug": "cakes"
            }
        }
        populate_by_name = True

# Authentication Models
class Token(BaseModel):
    """JWT Token response model"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """JWT Token payload data"""
    email: str
    is_admin: bool

class PaginationMetadata(BaseModel):
    """Pagination metadata model"""
    page: int
    limit: int
    total_items: int
    total_pages: int
    has_next: bool
    has_prev: bool

# ... rest of the existing code ... 