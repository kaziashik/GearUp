# GearUp Backend API 🏋️

Sports & Outdoor Gear Rental API built with Node.js, Express 5, TypeScript, Prisma 7, and PostgreSQL.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Setup

```bash
cd Backand
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Server runs at **http://localhost:5000**

### 3. Test Accounts (after seed)

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@gearup.com       | Admin@123     |
| Provider | provider@gearup.com    | Provider@123  |
| Customer | customer@gearup.com    | Customer@123  |

### 4. Postman Collection

Import `research/GearUp_API.postman_collection.json` into Postman.

### 5. Run API Tests

```bash
npm run dev
# In another terminal:
npx tsx research/test-apis.ts
```

## Project Structure

```
Backand/
├── prisma/schema/       # Split Prisma schema files
├── src/
│   ├── config/          # App configuration
│   ├── lib/             # Prisma & Stripe clients
│   ├── middlewares/     # Auth, error handling
│   ├── modules/         # Feature modules
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── gear/
│   │   ├── payment/
│   │   ├── provider/
│   │   ├── rental/
│   │   ├── review/
│   │   └── users/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── api/index.ts         # Vercel serverless entry
└── research/            # Postman collection & tests
```

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Categories | `/api/categories` |
| Gear (Public) | `/api/gear` |
| Rentals | `/api/rentals` |
| Payments | `/api/payments` |
| Provider | `/api/provider` |
| Admin | `/api/admin` |
| Reviews | `/api/reviews` |

## Rental Order Status Flow

```
PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
         ↘ CANCELLED ↙
```
