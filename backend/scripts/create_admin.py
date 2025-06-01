import requests
import json

def create_admin_user():
    url = "http://localhost:8000/auth/register"
    
    admin_data = {
        "email": "admin@laxmibakery.com",
        "full_name": "Admin User",
        "password": "Admin@123",
        "is_admin": True
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=admin_data, headers=headers)
        if response.status_code == 201:
            print("Admin user created successfully!")
            print("Email: admin@laxmibakery.com")
            print("Password: Admin@123")
        else:
            print(f"Error: {response.status_code}")
            print(response.json())
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure the backend server is running.")

if __name__ == "__main__":
    create_admin_user() 