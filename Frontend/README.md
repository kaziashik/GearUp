# GearUp Frontend

Next.js frontend for the GearUp sports & outdoor gear rental platform.

## Setup

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Folder Structure

Matches RentNest pattern with GearUp-specific routes:

- `(publicGroup)` — Home, gear browse, details, about, contact, payment result pages
- `(authGroup)` — Login, register with Google OAuth
- `(dashboardGroup)` — Customer, provider, admin dashboards with role-based nav
- `app/api/` — Server-side API proxies (forwards auth cookies to backend)

## Roles & Dashboards

| Role | Dashboard |
|------|-----------|
| CUSTOMER | `/customer-dashboard` |
| PROVIDER | `/provider-dashboard` |
| ADMIN | `/admin-dashboard` |

Protected by `middleware.ts` with JWT role decoding.
