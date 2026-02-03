from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from ..database import db
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "placeholder@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "placeholder_password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "placeholder@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME="Laxmi Bakery Orders",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

class OrderCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    cakeType: str
    weight: str
    flavour: Optional[str] = None
    occasion: Optional[str] = None
    preferredDate: str
    message: Optional[str] = None

@router.post("")
async def place_order(order: OrderCreate, background_tasks: BackgroundTasks):
    try:
        # 1. Save to database (optional but good practice)
        order_dict = order.dict()
        await db.orders.insert_one(order_dict)
        
        # 2. Prepare Email Content
        html = f"""
        <h3>New Cake Order Received!</h3>
        <p><strong>Customer Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Cake Type:</strong> {order.cakeType}</p>
        <p><strong>Weight:</strong> {order.weight}</p>
        <p><strong>Flavour:</strong> {order.flavour or 'Not specified'}</p>
        <p><strong>Occasion:</strong> {order.occasion or 'Not specified'}</p>
        <p><strong>Preferred Date:</strong> {order.preferredDate}</p>
        <p><strong>Message/Instructions:</strong> {order.message or 'None'}</p>
        """

        message = MessageSchema(
            subject=f"New Cake Order - {order.name}",
            recipients=[os.getenv("BAKERY_ADMIN_EMAIL", "yamanmaharjan00@gmail.com")],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        
        # Send email in background
        background_tasks.add_task(fm.send_message, message)

        return {"status": "success", "message": "Order placed successfully! We will contact you soon."}
    except Exception as e:
        print(f"Error placing order: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while placing order")
