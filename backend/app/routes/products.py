# Standard library imports
from typing import List, Optional
from datetime import datetime

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request, Query
from bson import ObjectId
from bson.errors import InvalidId

# Local imports
from ..models import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from ..database import products, categories
from ..auth import get_current_admin
from ..utils.file_handler import is_valid_image, save_upload_file, delete_file

# Create router instance
router = APIRouter(
    tags=["Products"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    request: Request,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    tags: str = Form("[]"),
    discount: float = Form(0),
    image: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin)
) -> dict:
    """
    Create a new product (Admin only).
    Validates category, image, and saves the product.
    """
    # Validate category exists
    if not await request.app.categories.find_one({"name": category}):
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Validate and save image
    if not is_valid_image(image):
        raise HTTPException(status_code=400, detail="Invalid image format")
    image_url = await save_upload_file(image)
    if not image_url:
        raise HTTPException(status_code=500, detail="Error saving image")
    
    # Parse tags from JSON string
    try:
        import json
        tags_list = json.loads(tags)
        if not isinstance(tags_list, list):
            raise ValueError("Tags must be a list")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid tags format")
    
    # Create product document
    product = {
        "name": name,
        "description": description,
        "price": price,
        "category": category,
        "images": [image_url],
        "available": True,
        "discount": discount,
        "tags": tags_list
    }
    
    # Insert into database
    result = await request.app.products.insert_one(product)
    product["_id"] = str(result.inserted_id)
    return product

@router.get("", response_model=ProductListResponse)
async def list_products(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=50, description="Items per page"),
    category: Optional[str] = Query(None, description="Optional category name to filter products")
) -> dict:
    """
    List all products with pagination and optional category filtering.
    
    Args:
        request: FastAPI request object
        page: Page number (starts from 1)
        limit: Number of items per page (between 1 and 50)
        category: Optional category name to filter products
        
    Returns:
        dict: Dictionary containing:
            - items: List of products for the current page
            - pagination: Pagination details including total items and pages
            
    Notes:
        - Returns all available products when no category is specified
        - When category is provided, filters products by that category (case-insensitive)
        - Results are sorted alphabetically by product name
    """
    # Build base query
    query = {"available": True}  # Only return available products by default
    
    # Add category filter if provided
    if category:
        # Get category document to handle case-insensitive name
        category_doc = await request.app.categories.find_one(
            {"name": {"$regex": f"^{category}$", "$options": "i"}}
        )
        if category_doc:
            query["category"] = category_doc["name"]
        else:
            # Return empty result if category doesn't exist
            return {
                "items": [],
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total_items": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_prev": False
                }
            }
    
    # Calculate skip for pagination
    skip = (page - 1) * limit
    
    # Get total count for pagination
    total_count = await request.app.products.count_documents(query)
    
    # Get products for current page
    cursor = request.app.products.find(query).sort("name", 1).skip(skip).limit(limit)
    product_list = await cursor.to_list(length=None)
    
    # Convert ObjectId to string for each product
    for product in product_list:
        product["_id"] = str(product["_id"])
    
    # Calculate pagination details
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "items": product_list,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_items": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(request: Request, product_id: str) -> dict:
    """
    Get a single product by ID
    """
    try:
        product = await request.app.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Convert ObjectId to string
        product["_id"] = str(product["_id"])
        return product
        
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID format"
        )

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    request: Request,
    product_id: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    available: Optional[bool] = Form(None),
    discount: Optional[float] = Form(None),
    tags: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_admin: dict = Depends(get_current_admin)
) -> dict:
    """
    Update a product (Admin only)
    """
    # Check if product exists
    product = await request.app.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Prepare update data
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if price is not None:
        update_data["price"] = price
    if category is not None:
        # Validate category exists
        if not await request.app.categories.find_one({"name": category}):
            raise HTTPException(status_code=404, detail="Category not found")
        update_data["category"] = category
    if available is not None:
        update_data["available"] = available
    if discount is not None:
        update_data["discount"] = discount
    if tags is not None:
        try:
            import json
            tags_list = json.loads(tags)
            if not isinstance(tags_list, list):
                raise ValueError("Tags must be a list")
            update_data["tags"] = tags_list
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid tags format")
    
    # Handle image update
    if image:
        if not is_valid_image(image):
            raise HTTPException(status_code=400, detail="Invalid image format")
        image_url = await save_upload_file(image)
        if not image_url:
            raise HTTPException(status_code=500, detail="Error saving image")
        # Add new image to images array
        update_data["images"] = product.get("images", []) + [image_url]
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update in database
    result = await request.app.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product not updated"
        )
    
    # Get updated product
    updated_product = await request.app.products.find_one({"_id": ObjectId(product_id)})
    updated_product["_id"] = str(updated_product["_id"])
    return updated_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    request: Request,
    product_id: str,
    current_admin: dict = Depends(get_current_admin)
) -> None:
    """
    Delete a product (Admin only)
    """
    # Get product to delete its images
    product = await request.app.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Delete product images
    for image_url in product.get("images", []):
        await delete_file(image_url)
    
    # Delete product
    result = await request.app.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        ) 