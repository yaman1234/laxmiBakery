# Standard library imports
from typing import List
from datetime import datetime

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, status, Request
from bson import ObjectId

# Local imports
from ..models import CategoryCreate, CategoryUpdate, CategoryResponse
from ..auth import get_current_admin

# Create router instance
router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    request: Request,
    category_data: CategoryCreate,
    current_admin: dict = Depends(get_current_admin)
) -> dict:
    """
    Create a new category (Admin only)
    
    Args:
        request: FastAPI request object
        category_data: Category creation data
        current_admin: Current admin user (injected by dependency)
    
    Returns:
        dict: Created category information
    
    Raises:
        HTTPException: If category with same name exists
    """
    # Check if category name already exists
    if await request.app.categories.find_one({"name": category_data.name}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    # Create category document
    category = category_data.model_dump()
    
    # Insert into database
    result = await request.app.categories.insert_one(category)
    category["_id"] = str(result.inserted_id)
    
    return category

@router.get("", response_model=List[CategoryResponse])
async def list_categories(request: Request) -> List[dict]:
    """
    List all categories
    
    Args:
        request: FastAPI request object
    
    Returns:
        List[dict]: List of categories
    """
    # Get categories from database
    cursor = request.app.categories.find().sort("name", 1)
    category_list = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for category in category_list:
        category["_id"] = str(category["_id"])
    
    return category_list

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(request: Request, category_id: str) -> dict:
    """
    Get a single category by ID
    
    Args:
        request: FastAPI request object
        category_id: Category ID
    
    Returns:
        dict: Category information
    
    Raises:
        HTTPException: If category not found
    """
    try:
        category = await request.app.categories.find_one({"_id": ObjectId(category_id)})
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        # Convert ObjectId to string
        category["_id"] = str(category["_id"])
        return category
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching category: {str(e)}"
        )

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    request: Request,
    category_id: str,
    update_data: CategoryUpdate,
    current_admin: dict = Depends(get_current_admin)
) -> dict:
    """
    Update a category (Admin only)
    
    Args:
        request: FastAPI request object
        category_id: Category ID
        update_data: Category update data
        current_admin: Current admin user (injected by dependency)
    
    Returns:
        dict: Updated category information
    
    Raises:
        HTTPException: If category not found or update invalid
    """
    # Check if category exists
    category = await request.app.categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Prepare update data
    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Check if new name conflicts with existing category
    if "name" in update_dict:
        existing = await request.app.categories.find_one({
            "name": update_dict["name"],
            "_id": {"$ne": ObjectId(category_id)}
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )
    
    # Update in database
    result = await request.app.categories.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not updated"
        )
    
    # Get updated category
    updated_category = await request.app.categories.find_one({"_id": ObjectId(category_id)})
    updated_category["_id"] = str(updated_category["_id"])
    return updated_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    request: Request,
    category_id: str,
    current_admin: dict = Depends(get_current_admin)
) -> None:
    """
    Delete a category (Admin only)
    
    Args:
        request: FastAPI request object
        category_id: Category ID
        current_admin: Current admin user (injected by dependency)
    
    Raises:
        HTTPException: If category not found or has products
    """
    # Check if category has products
    product_count = await request.app.products.count_documents({"category": category_id})  # Changed from category_id to category
    if product_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with existing products"
        )
    
    # Delete category
    result = await request.app.categories.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        ) 