# Standard library imports
from datetime import timedelta, datetime
from typing import Dict

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId

# Local imports
from ..models import UserCreate, UserResponse, Token
from ..auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user
)

# Create router instance
router = APIRouter(
    tags=["Authentication"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(request: Request, user_data: UserCreate) -> Dict:
    """
    Register a new user
    
    Args:
        request: FastAPI request object
        user_data: User registration data
    
    Returns:
        dict: Created user information
    
    Raises:
        HTTPException: If email already exists
    """
    # Check if email already exists
    if await request.app.users.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_dict = user_data.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_dict["created_at"] = datetime.utcnow()
    
    # Insert into database
    result = await request.app.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    return user_dict

@router.post("/login", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()) -> Dict:
    """
    Authenticate user and create access token
    
    Args:
        request: FastAPI request object
        form_data: OAuth2 password request form
    
    Returns:
        dict: Access token and token type
    
    Raises:
        HTTPException: If authentication fails
    """
    # Find user by email
    user = await request.app.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "is_admin": user.get("is_admin", False)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    """
    Get current authenticated user information
    
    Args:
        current_user: Current authenticated user (injected by dependency)
    
    Returns:
        UserResponse: Current user information
    """
    return current_user 