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
    """Base Product model with common attributes.
    
    This model defines the core attributes that all products must have.
    It is used as a base for both creating new products and updating existing ones.
    
    Attributes:
        name (str): The name of the product
        description (str): Detailed description of the product
        price (float): The price of the product in NRs.
        category (str): The category name the product belongs to
        available (bool): Whether the product is currently available (default: True)
        discount (float): Percentage discount on the product (default: 0)
        tags (List[str]): List of tags associated with the product
        images (List[str]): List of image URLs for the product
    """
    name: str
    description: str
    price: float
    category: str  # Category name instead of ID for better data consistency
    available: bool = True
    discount: float = Field(default=0, ge=0, le=100)  # Discount percentage between 0 and 100
    tags: List[str] = []
    images: List[str] = []  # Multiple images support

class ProductCreate(ProductBase):
    """Model for creating a new product.
    
    Inherits all fields from ProductBase and can add additional
    validation or fields specific to product creation.
    """
    pass

class ProductUpdate(BaseModel):
    """Model for updating an existing product.
    
    All fields are optional to support partial updates.
    Only the fields that are provided will be updated.
    
    Attributes:
        name (Optional[str]): Updated product name
        description (Optional[str]): Updated product description
        price (Optional[float]): Updated product price
        category (Optional[str]): Updated category name
        available (Optional[bool]): Updated availability status
        discount (Optional[float]): Updated discount percentage
        tags (Optional[List[str]]): Updated list of tags
        images (Optional[List[str]]): Updated list of image URLs
    """
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    available: Optional[bool] = None
    discount: Optional[float] = Field(default=None, ge=0, le=100)
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None

class ProductInDB(ProductBase):
    """Model representing a product as stored in the database.
    
    Extends ProductBase to include database-specific fields.
    
    Attributes:
        id (str): The unique identifier for the product
        created_at (datetime): Timestamp when the product was created
        updated_at (datetime): Timestamp when the product was last updated
    """
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        """Pydantic model configuration.
        
        Configures the model to work with MongoDB's ObjectId
        and allows population of fields from aliases.
        """
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

class ProductResponse(ProductBase):
    """Model for product responses in the API.
    
    Used when returning product data through the API.
    Includes all base fields plus the product ID.
    
    Attributes:
        _id (str): The unique identifier for the product
    """
    _id: str

    class Config:
        """Pydantic model configuration.
        
        Allows the model to work with different field names
        and properly handle MongoDB's _id field.
        """
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

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