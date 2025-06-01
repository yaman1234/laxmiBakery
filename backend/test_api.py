import requests
import json

BASE_URL = "http://localhost:8001"  # Updated to match the new port

def get_admin_token():
    url = f"{BASE_URL}/auth/login"
    data = {
        "username": "admin@example.com",  # OAuth2 form expects 'username' field
        "password": "admin123"
    }
    response = requests.post(url, data=data)  # Using form data
    print("\nLogin Response:", response.status_code)
    if response.status_code == 200:
        token = response.json()["access_token"]
        return token
    else:
        print("Error:", response.text)
        return None

def test_create_category(token):
    url = f"{BASE_URL}/categories"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": "Test Category",
        "description": "A detailed test category description for our bakery products",  # Minimum 10 chars
        "slug": "test-category"  # Added slug field
    }
    response = requests.post(url, json=data, headers=headers)
    print("\nCreate Category Response:", response.status_code)
    if response.status_code == 201:
        print(json.dumps(response.json(), indent=2))
        return response.json()["_id"]
    else:
        print("Error:", response.text)
        return None

def test_create_product(token, category_id):
    url = f"{BASE_URL}/products"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get category name for the given category_id
    category_response = requests.get(f"{BASE_URL}/categories/{category_id}")
    if category_response.status_code != 200:
        print("Error getting category:", category_response.text)
        return None
    category_name = category_response.json()["name"]
    
    # Create a multipart form data
    data = {
        "name": "Test Cake",
        "description": "A delicious test cake",
        "price": 299.99,
        "category": category_name,  # Using category name instead of ID
        "tags": json.dumps(["test", "cake", "delicious"]),  # Added tags as JSON string
        "discount": 0
    }
    # Create a test image file
    files = {
        "image": ("test.jpg", open("test_image.jpg", "rb"), "image/jpeg")
    }
    response = requests.post(url, data=data, files=files, headers=headers)
    print("\nCreate Product Response:", response.status_code)
    if response.status_code == 201:
        print(json.dumps(response.json(), indent=2))
        return response.json()["_id"]
    else:
        print("Error:", response.text)
        return None

def test_list_products():
    url = f"{BASE_URL}/products"
    response = requests.get(url)
    print("\nList Products Response:", response.status_code)
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)

def test_get_product(product_id):
    url = f"{BASE_URL}/products/{product_id}"
    response = requests.get(url)
    print("\nGet Product Response:", response.status_code)
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    print("Testing Laxmi Bakery API...")
    
    # Get admin token
    token = get_admin_token()
    if not token:
        print("Failed to get admin token. Stopping tests.")
        exit(1)
    
    # Test category creation
    category_id = test_create_category(token)
    if not category_id:
        print("Failed to create category. Stopping tests.")
        exit(1)
    
    # Test product creation
    product_id = test_create_product(token, category_id)
    if not product_id:
        print("Failed to create product. Stopping tests.")
        exit(1)
    
    # Test listing products
    test_list_products()
    
    # Test getting specific product
    test_get_product(product_id) 