# Standard library imports
from typing import List
from datetime import datetime

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile, Form
from bson import ObjectId

# Local imports
from ..models import CategoryCreate, CategoryUpdate, CategoryResponse
from ..auth import get_current_admin
from ..utils.file_handler import is_valid_image, save_upload_file

# Create router instance
router = APIRouter(
    tags=["Categories"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    request: Request,
    name: str = Form(...),
    description: str = Form(...),
    slug: str = Form(...),
    image: UploadFile = File(None),
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
    if await request.app.categories.find_one({"name": name}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    images = []
    if image:
        if not is_valid_image(image):
            raise HTTPException(status_code=400, detail="Invalid image format")
        image_url = await save_upload_file(image)
        if not image_url:
            raise HTTPException(status_code=500, detail="Error saving image")
        images.append(image_url)
    # Create category document
    category = {
        "name": name,
        "description": description,
        "slug": slug,
        "images": images
    }
    # Insert into database
    result = await request.app.categories.insert_one(category)
    category["_id"] = str(result.inserted_id)
    return category

@router.get("", response_model=dict)
async def list_categories(request: Request) -> dict:
    """
    List all categories with total count
    """
    cursor = request.app.categories.find().sort("name", 1)
    category_list = await cursor.to_list(length=None)
    # Convert ObjectId to string and validate with CategoryResponse
    from ..models import CategoryResponse
    items = []
    for category in category_list:
        category["_id"] = str(category["_id"])
        # Validate and serialize with Pydantic
        try:
            items.append(CategoryResponse(**category))
        except Exception as e:
            print(f"Skipping invalid category: {category.get('_id', '')}, error: {e}")
    return {"items": [item.model_dump(by_alias=True) for item in items], "total": len(items)}

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
    name: str = Form(None),
    description: str = Form(None),
    slug: str = Form(None),
    image: UploadFile = File(None),
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
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if slug is not None:
        update_data["slug"] = slug
    if image:
        if not is_valid_image(image):
            raise HTTPException(status_code=400, detail="Invalid image format")
        image_url = await save_upload_file(image)
        if not image_url:
            raise HTTPException(status_code=500, detail="Error saving image")
        update_data["images"] = category.get("images", []) + [image_url]
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    # Check if new name conflicts with existing category
    if "name" in update_data:
        existing = await request.app.categories.find_one({
            "name": update_data["name"],
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
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not updated"
        )
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