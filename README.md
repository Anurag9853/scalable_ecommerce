## Scalable E-Commerce Order & Inventory Management System

Full-stack e-commerce order and inventory management app designed to be **production-ready** and **resume-worthy** for backend / full-stack internships.

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT auth
- **Frontend**: React (hooks, functional components) + Vite
- **Auth**: JWT access tokens in `Authorization: Bearer <token>`
- **API style**: REST

---

### 1. Project Structure

- `backend/`
  - `server.js` – Express app entrypoint
  - `config/db.js` – MongoDB connection
  - `models/` – `User`, `Product`, `Order`
  - `routes/` – `authRoutes`, `productRoutes`, `orderRoutes`, `adminRoutes`, `paymentRoutes`
  - `controllers/` – request handling, thin, delegating to services
  - `services/` – business logic (auth, products, orders, inventory)
  - `middleware/` – `authMiddleware`, `errorMiddleware`
  - `utils/` – `generateToken`
  - `seeder.js` – seed admin user + products
  - `.env.example` – backend env variables template
- `frontend/`
  - `src/`
    - `App.jsx`, `main.jsx`
    - `api/client.js` – axios client with JWT interceptor
    - `context/` – `AuthContext`, `CartContext`
    - `components/` – `Navbar`, `ProtectedRoute`
    - `pages/` – `Login`, `Register`, `ProductList`, `ProductDetails`, `Cart`, `Orders`, `AdminDashboard`
    - `styles.css`
  - `.env.example` – frontend env variables template

---

### 2. Setup Instructions

#### Prerequisites

- Node.js LTS
- MongoDB running locally (or connection string to a cluster)

#### 2.1 Install dependencies

From the project root:

```bash
npm install
```

This installs root + backend + frontend deps.

#### 2.2 Configure environment variables

Backend:

```bash
cd backend
cp .env.example .env
# then edit .env with your Mongo URI and secrets
```

Key backend variables:

- `MONGO_URI` – e.g. `mongodb://localhost:27017/scalable_ecommerce`
- `JWT_SECRET` – strong random string
- `PORT` – default `5000`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` – seed admin user

Frontend:

```bash
cd ../frontend
cp .env.example .env
```

By default:

- `VITE_API_BASE_URL=http://localhost:5000/api`

#### 2.3 Seed database

From `backend/`:

```bash
cd backend
node seeder.js
```

This:

- Clears `users` and `products` collections
- Creates an **admin user** (from `.env` or defaults)
- Inserts sample products

#### 2.4 Run backend and frontend

Backend (port 5000):

```bash
cd backend
npm run dev
```

Frontend (port 3000):

```bash
cd ../frontend
npm run dev
```

Open the app at `http://localhost:3000`.

---

### 3. MongoDB Schemas (Summary)

- **User**
  - `name: String` (required)
  - `email: String` (required, unique, lowercased)
  - `password: String` (hashed with bcrypt, min length 6)
  - `role: 'ADMIN' | 'USER'` (default `'USER'`)

- **Product**
  - `name: String`
  - `description: String`
  - `price: Number`
  - `stock: Number`
  - `category: String`
  - `createdAt` (automatic via timestamps)

- **Order**
  - `user: ObjectId` (ref `User`)
  - `products: [{ productId, quantity, price }]`
  - `totalAmount: Number`
  - `status: 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'`
  - `createdAt` (automatic via timestamps)

---

### 4. API Routes

Base URL: `http://localhost:5000/api`

#### 4.1 Auth

- **POST** `/auth/register`
  - Body: `{ name, email, password }`
  - Response: `{ token, user: { id, name, email, role } }`

- **POST** `/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, name, email, role } }`

#### 4.2 Products

- **GET** `/products`
  - Public – list all products

- **GET** `/products/:id`
  - Public – get product details

- **POST** `/products` (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, description, price, stock, category }`

- **PUT** `/products/:id` (Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: any subset of `{ name, description, price, stock, category }`

- **DELETE** `/products/:id` (Admin only)
  - Headers: `Authorization: Bearer <token>`

#### 4.3 Orders

- **POST** `/orders` (User)
  - Headers: `Authorization: Bearer <token>`
  - Body:
    - `products: [{ productId, quantity }]`
  - Flow:
    - Frontend calls `/payments/charge` first
    - On success, calls `/orders` to create order + deduct stock atomically

- **GET** `/orders/my` (User)
  - Headers: `Authorization: Bearer <token>`
  - Returns all orders for current user

#### 4.4 Admin

All admin routes require:

- Headers: `Authorization: Bearer <admin-token>` with `role === 'ADMIN'`

- **GET** `/admin/orders`
  - Get all orders (with user info)

- **PATCH** `/admin/orders/:id/status`
  - Body: `{ status }` where status ∈ `['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']`

- **GET** `/admin/products/low-stock?threshold=5`
  - Lists low-stock products; default threshold is `5`

- **POST** `/admin/products`
  - Create product (same shape as `/products` POST)

- **PUT** `/admin/products/:id`
  - Update product

- **DELETE** `/admin/products/:id`
  - Delete product

#### 4.5 Payments (Simulation)

- **POST** `/payments/charge`
  - Body: `{ amount }` (optional)
  - Returns randomly:
    - `200 OK`: `{ success: true, transactionId, message }`
    - `402 Payment Required`: `{ success: false, message }`

---

### 5. Inventory & Order Logic

- Orders **cannot** be placed if stock is insufficient:
  - `reserveStockForOrder` uses `findOneAndUpdate` with condition `stock >= quantity`
  - If any product fails the check, **all previous stock deductions are rolled back**
- Stock is deducted **only after**:
  1. Frontend gets successful payment result from `/payments/charge`
  2. Backend creates order via `/orders` and performs atomic stock update
- This guards against **race conditions / concurrent orders** over-selling stock.

---

### 6. Frontend Features

- **Authentication**
  - Login / Register pages
  - Stores JWT + user info in `localStorage`
  - Axios interceptor attaches `Authorization` header automatically

- **Product Browsing**
  - `ProductListPage` – grid of products with add-to-cart
  - `ProductDetailsPage` – detailed view + add-to-cart

- **Cart & Checkout**
  - Client-side cart stored in context + `localStorage`
  - Update quantities, remove items
  - Checkout flow:
    1. Call `/payments/charge`
    2. On success, call `/orders` to place order
    3. Show success/failure message and clear cart

- **Orders**
  - `OrdersPage` – list user orders with status, line items, totals

- **Admin Dashboard**
  - `AdminDashboardPage`
    - View all orders
    - Update order status through buttons
    - View low-stock products table

---

### 7. Security & Error Handling

- **Password hashing**: bcrypt with salt, passwords never returned in responses.
- **JWT auth**:
  - `protect` middleware validates token and loads user
  - `admin` middleware restricts admin-only endpoints
- **Input validation**:
  - `express-validator` used on auth, product, and order endpoints
- **Global error handling**:
  - `errorMiddleware` ensures consistent JSON error responses and hides stack traces in production.

---

### 8. Deployment Notes

- **Backend**
  - Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in your hosting provider.
  - Use `npm start` in `backend/` for production.

- **Frontend**
  - Build static assets with:
    ```bash
    cd frontend
    npm run build
    ```
  - Serve `dist/` with any static host (e.g. Netlify, Vercel, S3/CloudFront, nginx).
  - Set `VITE_API_BASE_URL` to your deployed backend API URL.

You now have a complete, deploy-ready e-commerce order & inventory system suitable for showcasing on your internship-ready resume.

