# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

Monorepo containing the full GearUp platform — backend API and Next.js frontend.

## Project Structure

```
GearUp/
├── Backand/          # Node.js + Express + Prisma API
├── Frontend/         # Next.js 15 App Router UI
└── DEMO_DATA.md      # Test accounts & demo seed guide
```

## Quick Start

### 1. Backend

```bash
cd Backand
npm install
cp .env.example .env
# Edit DATABASE_URL in .env
npx prisma db push --accept-data-loss
npm run db:seed
npm run dev
```

API runs at **http://localhost:5000**

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

App runs at **http://localhost:3000**

## Test Accounts

See [DEMO_DATA.md](./DEMO_DATA.md) for full demo data and credentials.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gearup.com | Admin@123 |
| Provider | provider@gearup.com | Provider@123 |
| Customer | customer@gearup.com | Customer@123 |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL |
| Frontend | Next.js 15, Tailwind CSS, shadcn/ui, Framer Motion |
| Auth | JWT + httpOnly cookies, Google OAuth |
| Payments | Stripe Checkout, SSLCommerz (stub) |

## License

ISC
