# GearUp — API Integration Guide

This document maps **Frontend** routes/actions to **Backend** API endpoints.

**Base URLs**
- Local: `http://localhost:5000`
- Production: `https://gareup.vercel.app`

Most authenticated requests send the JWT via **HttpOnly cookie** (`accessToken`). Some flows also accept `Authorization: Bearer <token>`.

---

## Auth

| Frontend Action | Method | Backend Endpoint | Notes |
|-----------------|--------|------------------|-------|
| Login | `POST` | `/api/auth/login` | Returns user + access/refresh tokens |
| Register | `POST` | `/api/auth/register` | Role selected at signup |
| Google Login | `POST` | `/api/auth/google` | Body: `{ idToken, role? }` |
| Current User | `GET` | `/api/auth/me` | Requires auth cookie/token |
| Refresh Token | `POST` | `/api/auth/refresh-token` | Issues new access token |
| Logout | Client cookie clear | — | Tokens are stateless JWTs |

---

## Public Catalog

| Frontend Page | Method | Backend Endpoint |
|---------------|--------|------------------|
| Home featured gear | `GET` | `/api/gear?limit=6&available=true` |
| Browse gear | `GET` | `/api/gear?page=&limit=&search=&categoryId=&brand=&minPrice=&maxPrice=&sort=&available=` |
| Gear details | `GET` | `/api/gear/:id` |
| Categories filter | `GET` | `/api/categories` |
| Reviews list | `GET` | `/api/reviews?gearId=` |

---

## Customer Rentals & Payments

| Frontend Flow | Method | Backend Endpoint |
|---------------|--------|------------------|
| Create rental order | `POST` | `/api/rentals` or app proxy `/api/rentals/create` |
| My rentals | `GET` | `/api/rentals` |
| Cancel rental | `PATCH` / `DELETE` | `/api/rentals/:id` |
| Create Stripe checkout | `POST` | `/api/payments/create` |
| Confirm payment | `POST` | `/api/payments/confirm` |
| Payment history | `GET` | `/api/payments` |
| Leave review | `POST` | `/api/reviews` |

---

## Provider

| Frontend Flow | Method | Backend Endpoint |
|---------------|--------|------------------|
| My gear list | `GET` | `/api/provider/gear` |
| Create gear | `POST` | `/api/provider/gear` |
| Update / delete gear | `PATCH` / `DELETE` | `/api/provider/gear/:id` |
| Incoming orders | `GET` | `/api/provider/orders` |
| Update order status | `PATCH` | `/api/provider/orders/:id` |

---

## Admin

| Frontend Flow | Method | Backend Endpoint |
|---------------|--------|------------------|
| Users list | `GET` | `/api/admin/users` |
| Suspend / activate user | `PATCH` | `/api/admin/users/:id` |
| Platform gear / rentals | `GET` | `/api/gear`, `/api/rentals` |

---

## Users / Profile

| Frontend Flow | Method | Backend Endpoint |
|---------------|--------|------------------|
| Get profile | `GET` | `/api/users/profile` |
| Update profile (incl. image) | `PATCH` | `/api/users/profile` |

---

## Payment Redirects

Stripe success/cancel URLs point to frontend pages:
- Success: `/payment/success?session_id=...`
- Cancel: `/payment/cancel`

Frontend confirms the Stripe session with the backend, then shows UI feedback.

---

## Auth Cookie Pattern (Frontend)

1. Login/register response sets `accessToken` + `refreshToken` as **HttpOnly** cookies
2. `middleware.ts` protects dashboard routes by role
3. Server actions / `apiFetch` attach cookies for authenticated API calls
4. Public catalog endpoints (`/api/gear`, `/api/categories`, `/api/reviews`) work without login

---

## Quick Health Check

```bash
# API root / health style check (example)
curl https://gareup.vercel.app/api/categories

# Local gear list
curl "http://localhost:5000/api/gear?limit=3&available=true"
```

For full Postman coverage, see `Backand/research/GearUp_API.postman_collection.json` if present.
