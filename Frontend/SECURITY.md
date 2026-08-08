# 🔐 GearUp Frontend Security & Cookie Management

## Overview
The GearUp frontend now implements professional security patterns inspired by the RentNest project, featuring automatic token refresh, httpOnly cookies, and secure JWT handling.

---

## 🎯 Key Security Features Implemented

### 1. JWT Token Management
- **Location**: `Frontend/utils/jwt.ts`
- **Features**:
  - Token verification using `jsonwebtoken` library
  - Secure token decoding for middleware (Edge Runtime compatible)
  - Helper functions for dashboard routing

### 2. Automatic Token Refresh
- **Location**: `Frontend/service/refreshToken.ts`
- **Features**:
  - `getAccessToken()`: Automatically refreshes expired access tokens
  - Verifies both access and refresh tokens
  - Seamlessly updates cookies with new tokens
  - No user interruption - happens transparently

### 3. Middleware Protection
- **Location**: `Frontend/middleware.ts`
- **Pattern**: Next.js Edge Middleware
- **Features**:
  - Role-based route protection
  - Automatic redirect to login for unauthenticated users
  - Redirect authenticated users away from login/register pages
  - Dashboard access control (CUSTOMER, PROVIDER, ADMIN)
  - Preserves redirect URL for post-login navigation

### 4. Cookie-Based Authentication
- **Implementation**: All API calls use Cookie header
- **Security Features**:
  - `httpOnly`: true (prevents XSS attacks)
  - `secure`: true in production (HTTPS only)
  - `sameSite`: "lax" (CSRF protection)
  - Separate `accessToken` (1 day) and `refreshToken` (7 days) expiry

### 5. Server-Side API Calls
- **Location**: `Frontend/lib/server-api.ts`
- **Features**:
  - Uses `getAccessToken()` for automatic refresh
  - Sends tokens via Cookie header (more secure than Authorization header in SSR)
  - Centralized error handling
  - `cache: "no-store"` for real-time data

---

## 🔄 Authentication Flow

### Login Flow
```
1. User submits credentials
2. Backend validates & returns tokens
3. Frontend sets httpOnly cookies (accessToken + refreshToken)
4. User redirected to role-specific dashboard
```

### Token Refresh Flow
```
1. Access token expires
2. getAccessToken() detects expiration
3. Automatically calls backend /api/auth/refresh-token
4. Backend validates refresh token
5. Returns new access token
6. Frontend updates accessToken cookie
7. Request proceeds seamlessly
```

### Middleware Protection Flow
```
1. User visits protected route
2. Middleware decodes access token
3. Verifies user role matches route requirement
4. If unauthorized: redirect to login
5. If authorized: allow access
```

---

## 📁 Key Files Modified

### New Files
- `Frontend/utils/jwt.ts` - Token verification utilities
- `Frontend/service/refreshToken.ts` - Auto-refresh logic

### Updated Files
- `Frontend/middleware.ts` - Edge-compatible route protection
- `Frontend/lib/server-api.ts` - Cookie-based API calls
- `Frontend/service/getMe.ts` - Auto-refresh user data fetching
- `Frontend/app/(authGroup)/_actions/authAction.ts` - Token cookie management
- `Frontend/.env.local` - Added JWT secrets for verification

---

## 🔧 Environment Variables Required

```bash
# Frontend .env.local
JWT_ACCESS_SECRET=gearup-access-secret-dev-key-2026
JWT_REFRESH_SECRET=gearup-refresh-secret-dev-key-2026
```

**Important**: These must match the backend secrets exactly!

---

## 🛡️ Security Advantages

### Before
- ❌ Tokens stored in Authorization header only
- ❌ No automatic token refresh
- ❌ Manual token expiry handling
- ❌ Basic middleware protection

### After
- ✅ httpOnly cookies (XSS protection)
- ✅ Automatic token refresh (seamless UX)
- ✅ Cookie-based auth in SSR context
- ✅ Comprehensive middleware protection
- ✅ Role-based access control
- ✅ CSRF protection via sameSite
- ✅ Secure flag in production

---

## 🧪 Testing Checklist

- [x] Login sets both access and refresh cookies
- [x] Access token auto-refreshes when expired
- [x] Middleware redirects unauthenticated users
- [x] Role-based dashboard access works correctly
- [x] Logout deletes both cookies
- [x] Protected API calls use Cookie header
- [x] Build completes without errors

---

## 📝 Implementation Notes

### Why Cookie Header Instead of Authorization?
In Next.js server components/actions, using the Cookie header is more appropriate because:
1. Cookies are the standard for server-side session management
2. Backend can read from both Cookie and Authorization headers
3. More secure in SSR context (httpOnly cookies never exposed to client JS)

### Why Decode in Middleware, Verify in Server Actions?
- Middleware runs in Edge Runtime (no Node.js crypto APIs)
- Simple decoding is sufficient for routing decisions
- Full verification with refresh happens in server actions (Node.js runtime)
- This approach balances security with Edge Runtime constraints

---

## 🚀 Deployment Considerations

### Production Environment Variables
```bash
NODE_ENV=production
JWT_ACCESS_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<different-strong-random-string>
```

### Backend Configuration Required
- Ensure `/api/auth/refresh-token` endpoint accepts Cookie header
- Verify CORS allows credentials
- Configure cookie domain for production

---

## 📚 References

- Inspired by: [RentNest Frontend](https://github.com/kaziashik/rentnest_frontend-)
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

**Last Updated**: August 8, 2026
**Version**: 1.0.0
