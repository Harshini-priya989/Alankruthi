# Alankruthi

Alankruthi is a full-stack custom embroidery ecommerce platform for browsing handmade designs, placing made-to-order requests, and managing customer orders from an admin dashboard.

## Features

- Customer registration and login with JWT authentication
- Product browsing with search, sorting, grouped categories, and product detail pages
- Cart management with quantity updates, item removal, subtotals, and order total
- Checkout flow for custom embroidery orders with shipping address, cloth delivery method, preferred thread colors, and design notes
- Customer order history with status, payment state, completion estimate, item details, and delivery address
- Admin dashboard with users, products, orders, revenue, and recent orders
- Admin product management with create, edit, delete, image upload, category assignment, availability toggles, search, and filtering
- Admin order management with status updates, completion-day estimates, payment tracking, item details, and shipping address visibility
- Cloudinary-backed product image upload

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt
- Images: Multer, Cloudinary

## Project Structure

```text
backend/
  config/          Database and Cloudinary configuration
  controllers/     Route business logic
  middleware/      Auth, admin, upload, and error middleware
  models/          Mongoose models
  routes/          Express API routes
  server.js        API entry point

frontend/
  public/          Static images and icons
  src/
    components/    Shared UI and route guards
    context/       Auth state provider
    layouts/       App layout
    pages/         Customer and admin screens
    styles/        Global app styling
```

## Local Setup

1. Install backend dependencies.

```bash
cd backend
npm install
```

2. Create `backend/.env` from `backend/.env.example`.

```bash
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

3. Start the backend.

```bash
npm run dev
```

4. Install frontend dependencies.

```bash
cd ../frontend
npm install
```

5. Create `frontend/.env` from `frontend/.env.example`.

```bash
VITE_API_URL=http://localhost:3000/api
```

6. Start the frontend.

```bash
npm run dev
```

## API Overview

- `POST /api/auth/register` - register customer
- `POST /api/auth/login` - login
- `GET /api/products` - list available products
- `GET /api/products/categories` - list active grouped categories
- `GET /api/products/:id` - get product details
- `GET /api/cart` - get customer cart
- `POST /api/cart` - add product to cart
- `PUT /api/cart/:id` - update cart quantity
- `DELETE /api/cart/:id` - remove cart item
- `POST /api/orders` - place order
- `GET /api/orders` - get current customer's orders
- `GET /api/orders/all` - admin order list
- `PUT /api/orders/:id` - admin order update
- `GET /api/admin/dashboard` - admin stats
- `GET /api/admin/users` - admin user list
- `GET /api/admin/products` - admin product list including hidden products
- `POST /api/upload` - admin image upload
- `POST /api/ai/design-suggestion` - generate an AI embroidery design brief

## AI Design Assistant

The AI Design Assistant helps customers turn a rough idea into a structured embroidery brief. Customers enter an occasion, garment or item, preferred colors, and notes. The frontend sends that form data to the backend, and the backend calls the Groq API with the API key stored safely in `.env`.

To use Groq locally, add these values to `backend/.env` and restart the backend:

```bash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```


The model returns structured JSON with:

- recommended embroidery category
- color palette
- thread suggestions
- complexity level
- design notes
- artisan brief
- care tip
