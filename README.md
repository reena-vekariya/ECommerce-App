# ShopHub — Full-Stack E-Commerce Platform

A full-featured e-commerce application built as a monorepo. Includes a customer-facing storefront, a complete admin panel, and a RESTful API backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Backend | NestJS 10, MongoDB 8, Mongoose, Passport JWT |
| Frontend | Next.js 14 (App Router), Material UI v5, Tailwind CSS |
| State | Zustand (auth + cart + theme) |
| Data Fetching | TanStack React Query + Axios |
| Forms | React Hook Form + Zod |
| Auth | JWT (Bearer token), bcrypt password hashing |
| File Upload | Multer (local disk storage) |
| API Docs | Swagger UI at `/api-docs` |

---

## Project Structure

```
E-Commerce/
├── package.json              # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
│
├── packages/
│   └── shared-types/         # Shared TypeScript interfaces & DTOs
│       └── src/index.ts
│
└── apps/
    ├── api/                  # NestJS backend — port 4000
    │   └── src/
    │       ├── auth/         # JWT login & register
    │       ├── users/        # User CRUD, roles (user / admin)
    │       ├── products/     # Product CRUD, search, filters, stock
    │       ├── categories/   # Hierarchical category tree
    │       ├── cart/         # Per-user cart management
    │       ├── orders/       # Order creation (COD), status tracking
    │       ├── reviews/      # Product ratings & reviews
    │       ├── wishlist/     # User wishlist
    │       ├── coupons/      # Discount codes (% and fixed)
    │       ├── upload/       # Image upload via Multer
    │       └── admin/        # Dashboard stats & aggregations
    │
    └── web/                  # Next.js 14 frontend — port 3000
        └── src/
            ├── app/          # App Router pages
            │   ├── (auth)/   # Login & Register
            │   ├── products/ # Listing + detail pages
            │   ├── cart/
            │   ├── checkout/
            │   ├── orders/
            │   ├── wishlist/
            │   ├── search/
            │   ├── profile/
            │   └── admin/    # Full admin panel
            ├── components/   # Reusable UI components
            ├── hooks/        # useAuth, useCart, useWishlist
            ├── store/        # Zustand stores
            ├── services/     # Axios API client + service layer
            └── lib/          # MUI theme (light/dark)
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18+ (tested on v25.2.1) |
| pnpm | v10+ |
| MongoDB | v6+ (tested on v8.2.6) |

---

## Setup

### 1. Install MongoDB

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

Verify it's running:

```bash
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

### 2. Install Dependencies

```bash
cd E-Commerce
pnpm install
```

### 3. Configure Environment Variables

**Backend** — create `apps/api/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
PORT=4000
UPLOAD_DIR=./uploads
```

**Frontend** — create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Running the App

Open two terminal windows:

```bash
# Terminal 1 — Backend API (watch mode)
cd apps/api
pnpm dev
```

```bash
# Terminal 2 — Frontend
cd apps/web
pnpm dev
```

Or run everything from the root using Turborepo:

```bash
pnpm dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api-docs |

---

## Creating an Admin Account

1. Register via the UI at `/register` or via the API:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword","fullName":"Admin User"}'
```

2. Promote the account to admin via MongoDB:

```bash
mongosh ecommerce --eval \
  "db.users.updateOne({ email: 'admin@example.com' }, { \$set: { role: 'admin' } })"
```

3. Log in — admin users are automatically redirected to `/admin`.

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | — | List products (search, filter, paginate) |
| GET | `/products/:id` | — | Product detail |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | All categories |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | User | Get current cart |
| POST | `/cart` | User | Add item |
| PATCH | `/cart/:itemId` | User | Update quantity |
| DELETE | `/cart/:itemId` | User | Remove item |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders` | User | Place order (COD) |
| GET | `/orders` | User | Order history |
| GET | `/orders/:id` | User | Order detail |
| PATCH | `/orders/:id/status` | Admin | Update order status |

### Reviews, Wishlist & Coupons

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | User | Submit a review |
| GET | `/reviews/:productId` | — | Product reviews |
| GET | `/wishlist` | User | Get wishlist |
| POST | `/wishlist/:productId` | User | Add to wishlist |
| DELETE | `/wishlist/:productId` | User | Remove from wishlist |
| POST | `/coupons/validate` | — | Validate a coupon code |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Dashboard metrics |
| POST | `/upload` | Admin | Upload product image |
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/role` | Admin | Change user role |

---

## Product Filters

The `GET /products` endpoint supports:

| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search across name, description, brand, tags |
| `categoryId` | string | Filter by category ID |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `minRating` | number | Minimum average star rating |
| `inStock` | boolean | Only show in-stock items |
| `sort` | string | `newest` \| `price_asc` \| `price_desc` \| `rating` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |

---

## Database Collections

| Collection | Key Fields |
|---|---|
| `users` | email, passwordHash, fullName, role, addresses[] |
| `products` | name, slug, price, discountPrice, images[], categoryId, stock, ratings, brand, tags |
| `categories` | name, slug, parentId |
| `carts` | userId, items[{productId, qty, price}] |
| `orders` | userId, items[], shippingAddress, status, totalAmount, couponCode, discount |
| `reviews` | productId, userId, rating, comment |
| `wishlists` | userId, productIds[] |
| `coupons` | code, discountType, discountValue, minOrderAmount, maxUses, usedCount, expiresAt |

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Home — hero banner, featured products, category chips |
| `/products` | Product listing with sidebar filters and pagination |
| `/products/:id` | Product detail, image gallery, ratings, reviews |
| `/search?q=...` | Full-text search results |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Shipping address, coupon code, COD order placement |
| `/orders` | User order history |
| `/orders/:id` | Order detail and status tracking |
| `/wishlist` | Saved products |
| `/profile` | User profile and account links |
| `/login` | Sign in |
| `/register` | Create account |
| `/admin` | Dashboard — stats, recent orders, revenue by day |
| `/admin/products` | Product CRUD with image upload |
| `/admin/categories` | Category management |
| `/admin/orders` | Order list with inline status updates |
| `/admin/users` | User list and role management |
| `/admin/coupons` | Coupon CRUD |

---

## Checkout Flow

```
Browse Products
      ↓
Add to Cart  ←→  Update Quantity / Remove
      ↓
Apply Coupon (optional)
      ↓
Checkout — Enter Shipping Address
      ↓
Place Order (Cash on Delivery)
      ↓
Order Created — status: pending
      ↓
Admin: pending → processing → shipped → delivered
```

---

## Design System

color palette with full light/dark mode support toggled from the navbar.

| Token | Light | Dark |
|---|---|---|
| Primary (orange) | `#FF9900` | `#FF9900` |
| Navy | `#232F3E` | `#232F3E` |
| Background | `#FFFFFF` | `#0F1111` |
| Surface | `#F3F3F3` | `#1A1A1A` |
| Text primary | `#0F1111` | `#FFFFFF` |
| Text secondary | `#565959` | `#CCCCCC` |
| Success | `#007600` | `#4CAF50` |
| Error | `#B12704` | `#f44336` |

---

## Build for Production

```bash
# Build all packages and apps
pnpm build

# Start backend
cd apps/api && pnpm start

# Start frontend
cd apps/web && pnpm start
```

---

## Implementation Notes

- **Auth persistence** — JWT is read from `localStorage` synchronously at Zustand store init, avoiding the SSR hydration gap that causes premature logout redirects in Next.js App Router.
- **Cart** — Stored in MongoDB per user; fetched fresh from the API on login and page load. The client is never the source of truth.
- **Product search** — Backed by a MongoDB compound text index on `name`, `description`, `brand`, and `tags` fields.
- **Ratings** — Average and count are recalculated on every review create or delete and stored directly on the product document for fast reads.
- **Image upload** — Files saved to `apps/api/uploads/` and served statically at `http://localhost:4000/uploads/<filename>`.
- **MUI + Tailwind coexistence** — Tailwind `preflight` is disabled to avoid resetting MUI's baseline styles. Tailwind handles layout and spacing; MUI handles interactive components and theming.
- **Role-based access** — All admin routes on both the API (`RolesGuard`) and the frontend (`/admin` layout) verify the `admin` role before rendering.
