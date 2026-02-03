from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from ..database import db
from ..models import MenuCreate, MenuUpdate, MenuResponse
from ..auth import get_current_admin

router = APIRouter()

@router.get("", response_model=List[MenuResponse])
async def get_menu(active_only: bool = False):
    query = {}
    if active_only:
        query["is_active"] = True
    
    cursor = db.menu.find(query)
    menu_items = await cursor.to_list(length=100)
    
    # Convert _id to string for each item
    for item in menu_items:
        item["_id"] = str(item["_id"])
    
    return menu_items

@router.get("/{item_id}", response_model=MenuResponse)
async def get_menu_item(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    item = await db.menu.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    item["_id"] = str(item["_id"])
    return item

@router.post("", response_model=MenuResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(item: MenuCreate, admin: dict = Depends(get_current_admin)):
    # Check if cake_type already exists
    existing = await db.menu.find_one({"cake_type": item.cake_type})
    if existing:
        raise HTTPException(status_code=400, detail="Cake type already exists")
    
    item_dict = item.model_dump()
    item_dict["created_at"] = datetime.utcnow()
    item_dict["updated_at"] = datetime.utcnow()
    result = await db.menu.insert_one(item_dict)
    
    new_item = await db.menu.find_one({"_id": result.inserted_id})
    new_item["_id"] = str(new_item["_id"])
    return new_item

@router.put("/{item_id}", response_model=MenuResponse)
async def update_menu_item(item_id: str, item_update: MenuUpdate, admin: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    update_data = {k: v for k, v in item_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.menu.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    updated_item = await db.menu.find_one({"_id": ObjectId(item_id)})
    updated_item["_id"] = str(updated_item["_id"])
    return updated_item

@router.delete("/{item_id}")
async def delete_menu_item(item_id: str, admin: dict = Depends(get_current_admin)):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await db.menu.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    return {"message": "Menu item deleted successfully"}
