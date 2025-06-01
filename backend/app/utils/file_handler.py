# Standard library imports
import os
from datetime import datetime
from typing import Optional

# Third-party imports
from fastapi import UploadFile
import aiofiles

# Constants
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def is_valid_image(file: UploadFile) -> bool:
    """
    Validate uploaded image file
    
    Args:
        file: Uploaded file object
    
    Returns:
        bool: True if file is valid, False otherwise
    """
    # Check file extension
    ext = file.filename.split(".")[-1].lower() if file.filename else ""
    return ext in ALLOWED_EXTENSIONS

async def save_upload_file(file: UploadFile) -> Optional[str]:
    """
    Save uploaded file to uploads directory
    
    Args:
        file: Uploaded file object
    
    Returns:
        Optional[str]: Relative path to saved file or None if save failed
    """
    try:
        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Ensure upload directory exists
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        
        # Save file
        async with aiofiles.open(filepath, "wb") as buffer:
            content = await file.read()
            if len(content) > MAX_FILE_SIZE:
                return None
            await buffer.write(content)
        
        return f"/uploads/{filename}"
    
    except Exception as e:
        print(f"Error saving file: {e}")
        return None

async def delete_file(file_path: str) -> bool:
    """
    Delete file from uploads directory
    
    Args:
        file_path: Relative path to file
    
    Returns:
        bool: True if deletion successful, False otherwise
    """
    try:
        # Extract filename from path
        filename = file_path.split("/")[-1]
        full_path = os.path.join(UPLOAD_DIR, filename)
        
        # Delete file if exists
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
    
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False 