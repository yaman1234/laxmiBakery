# Laxmi Bakery Website

A modern, responsive website for Laxmi Bakery built with React, TypeScript, Material-UI, and FastAPI.

## Features

- 🎨 Modern and responsive design
- 📱 Mobile-friendly navigation
- 🛍️ Product catalog
- 👤 Admin dashboard for product management
- 🔒 Secure authentication system

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Material-UI (MUI)
  - Redux Toolkit
  - React Router
  - Axios
- **Backend:**
  - FastAPI
  - MongoDB (via Motor)
  - JWT Authentication

## Project Structure

```
frontend/
backend/
```

## Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   ```

2. **Start MongoDB:**
   - Make sure MongoDB is running locally on the default port (27017).

3. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`.

4. **API Documentation:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Backend API Overview

- **Products**
  - `POST /products` (admin): Create a new product
  - `GET /products`: List all products (paginated)
  - `GET /products/{product_id}`: Get a single product
  - `PUT /products/{product_id}` (admin): Update a product
  - `DELETE /products/{product_id}` (admin): Delete a product

- **Categories**
  - `POST /categories` (admin): Create a new category
  - `GET /categories`: List all categories
  - `GET /categories/{category_id}`: Get a single category
  - `PUT /categories/{category_id}` (admin): Update a category
  - `DELETE /categories/{category_id}` (admin): Delete a category

- **Authentication**
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Login and get JWT token

## Environment Variables

- The backend uses `mongodb://localhost:27017` by default. You can change this in `backend/app/database.py`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact:
- Email: info@laxmibakery.com
- Phone: +91 98765 43210

## Acknowledgments

- Material-UI for the beautiful components
- React team for the amazing framework
- All contributors who have helped with the project 