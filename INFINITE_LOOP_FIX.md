# Fixed: Infinite Redirect Loop on Login

## Problem
After logging in, the page enters an infinite redirect loop, constantly requesting `/customer-dashboard` over and over.

## Root Cause
**Infinite Loop Chain:**
1. User logs in successfully → redirects to `/customer-dashboard`
2. Dashboard layout calls `getMe()` to verify user
3. If `getMe()` fails (but cookie still exists), layout redirects to `/login`
4. Middleware sees `accessToken` cookie exists
5. Middleware redirects back to `/customer-dashboard`
6. **Loop repeats infinitely!**

This happens when:
- Token exists in cookie but is invalid/expired
- Backend `/api/auth/me` endpoint fails
- Cookie and `getMe()` are out of sync

## Solution
**Changed Dashboard Layout Logic:**
- ❌ **Before**: If no user → `redirect("/login")` (causes loop!)
- ✅ **After**: If no user → Show loading state, let middleware handle redirect

**File Updated:** `Frontend/app/(dashboardGroup)/layout.tsx`

```typescript
// OLD (caused infinite loop):
export default async function DashboardLayout({ children }) {
  const user = await getMe();
  if (!user) redirect("/login");  // ❌ Creates loop!
  return <DashboardSidebar user={user} />;
}

// NEW (prevents loop):
export default async function DashboardLayout({ children }) {
  const user = await getMe();
  if (!user) {
    // ✅ Show loading, let middleware redirect
    return <LoadingState />;
  }
  return <DashboardSidebar user={user} />;
}
```

## How to Test the Fix

### 1. Clear All Cookies
```javascript
// In browser console (F12):
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
});
// Then refresh page
location.reload();
```

### 2. Make Sure Backend is Running
```bash
cd Backand
npm run dev
# Should show: Server running on port 5000
```

### 3. Restart Frontend
```bash
cd Frontend
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Test Login Flow
1. Go to `http://localhost:3000/login`
2. Login with credentials or demo button
3. Should redirect to dashboard **once** (not loop!)
4. Dashboard should load properly

## Verification Checklist

### ✅ Login Works If:
- [ ] Login page loads
- [ ] Can enter credentials
- [ ] Click login button
- [ ] Redirects to dashboard **once**
- [ ] Dashboard loads (not blank)
- [ ] No infinite loop in console/network tab
- [ ] Can navigate between dashboard pages

### ❌ Still Loops If:
- [ ] Backend not running (start it!)
- [ ] `.env.local` has wrong API_URL
- [ ] Cookies not being set (check Application tab)
- [ ] Backend `/api/auth/me` endpoint broken

## Debugging Steps

### Check 1: Are Cookies Being Set?
1. Login
2. Press **F12** → Application tab → Cookies
3. Should see:
   - `accessToken` (with long value)
   - `refreshToken` (with long value)
4. If missing → login is failing to set cookies

### Check 2: Is `/api/auth/me` Working?
```bash
# Get your accessToken from cookies, then:
curl -X GET http://localhost:5000/api/auth/me \
  -H "Cookie: accessToken=YOUR_TOKEN_HERE"

# Should return user data, not error
```

### Check 3: Check Console Logs
```javascript
// In browser console (F12):
// Look for errors like:
// - "Get me error: ..."
// - "Failed to fetch"
// - "CORS error"
// - "401 Unauthorized"
```

### Check 4: Network Tab
1. Press **F12** → Network tab
2. Login
3. Watch requests:
   - `/api/auth/login` → should return 200 with tokens
   - `/customer-dashboard` → should load once (not loop!)
   - `/api/auth/me` → should return 200 with user data

## Common Issues & Fixes

### Issue 1: "Failed to fetch /api/auth/me"
**Cause**: Backend not running or wrong URL
**Fix**: 
```bash
# Start backend:
cd Backand
npm run dev

# Check .env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Issue 2: "401 Unauthorized"
**Cause**: Token invalid or expired
**Fix**: Clear cookies and login again

### Issue 3: Still Looping
**Cause**: Middleware and layout redirect conflict
**Fix**: Check middleware.ts is not modifying dashboard routes

### Issue 4: Cookies Not Set
**Cause**: Login response not setting cookies
**Fix**: Check `authAction.ts` sets cookies in response

## What Changed in the Fix

### Before (Caused Loop):
```
User logs in
  ↓
Redirects to /customer-dashboard
  ↓
Layout: getMe() fails
  ↓
Layout: redirect("/login")  ← Problem!
  ↓
Middleware: sees token cookie
  ↓
Middleware: redirect("/customer-dashboard")
  ↓
INFINITE LOOP! ♾️
```

### After (No Loop):
```
User logs in
  ↓
Redirects to /customer-dashboard
  ↓
Layout: getMe() fails
  ↓
Layout: Show "Authenticating..." ← Fixed!
  ↓
Middleware: checks token
  ↓
Middleware: redirect("/login") if invalid
  ↓
No loop! ✅
```

## Expected Behavior

### On Successful Login:
1. ✅ Login page → Dashboard (redirect once)
2. ✅ Dashboard loads with user data
3. ✅ Sidebar shows user info
4. ✅ Can navigate between pages
5. ✅ No infinite requests in console

### On Failed Login:
1. ✅ Shows error message
2. ✅ Stays on login page
3. ✅ No redirect
4. ✅ No loop

---

## Quick Fix Commands

```bash
# 1. Clear everything and restart fresh:
# In browser console (F12):
localStorage.clear(); sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
});
location.reload();

# 2. Restart backend:
cd E:/Next_lavel_C/Extra_Project/GearUp/Backand
npm run dev

# 3. Restart frontend:
cd E:/Next_lavel_C/Extra_Project/GearUp/Frontend
npm run dev

# 4. Try login again at:
# http://localhost:3000/login
```

---

**The fix is complete!** The infinite loop should be resolved. Try logging in now! 🎉
