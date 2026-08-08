# 🚀 Deploy GearUp Backend to Vercel

## Step 1: Deploy Backend

Open PowerShell in this directory (`Backand/`) and run:

```powershell
# Login to Vercel
vercel login

# Deploy
vercel
```

### Vercel Setup Questions:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Choose your account
- **Link to existing project?** → `N` (No)
- **Project name?** → `gearup-backend` (or any name)
- **Directory?** → Press Enter (use `./`)
- **Override settings?** → `N` (No)

Wait for deployment to complete. You'll get a URL like:
```
https://gearup-backend-xxxxx.vercel.app
```

**📝 Save this URL! You'll need it for the frontend.**

---

## Step 2: Set Environment Variables

### Option A: Use PowerShell Script (Easiest)

```powershell
# Run the automated script
.\set-vercel-env.ps1
```

### Option B: Use Vercel Dashboard

1. Go to your project on Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

```
NODE_ENV=production
DATABASE_URL=your-postgres-connection-string-here
JWT_ACCESS_SECRET=your-jwt-access-secret-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**⚠️ IMPORTANT: You'll need to add these AFTER deploying frontend:**
```
STRIPE_SUCCESS_URL=https://YOUR-FRONTEND-URL.vercel.app/payment/success
STRIPE_CANCEL_URL=https://YOUR-FRONTEND-URL.vercel.app/payment/cancel
CLIENT_URL=https://YOUR-FRONTEND-URL.vercel.app
```

---

## Step 3: Deploy Frontend

Now deploy your frontend to Vercel:

```powershell
cd ..\Frontend
vercel
```

### Vercel Setup Questions:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Choose your account
- **Link to existing project?** → `N` (No)
- **Project name?** → `gearup-frontend` (or any name)
- **Directory?** → Press Enter (use `./`)
- **Override settings?** → `N` (No)

You'll get a URL like:
```
https://gearup-frontend-xxxxx.vercel.app
```

---

## Step 4: Update Backend Environment Variables

Now that you have your frontend URL, update the backend:

```powershell
# Go back to backend directory
cd ..\Backand

# Update environment variables with your actual frontend URL
vercel env add STRIPE_SUCCESS_URL production
# Enter: https://YOUR-FRONTEND-URL.vercel.app/payment/success

vercel env add STRIPE_CANCEL_URL production
# Enter: https://YOUR-FRONTEND-URL.vercel.app/payment/cancel

vercel env add CLIENT_URL production
# Enter: https://YOUR-FRONTEND-URL.vercel.app
```

---

## Step 5: Update Frontend Environment Variables

```powershell
cd ..\Frontend

# Add backend URL
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://YOUR-BACKEND-URL.vercel.app/api

# Add Google Client ID
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
# Enter: 784078754464-4mhqg13l58rjev637fb34kks0oq87p2v.apps.googleusercontent.com
```

---

## Step 6: Redeploy Both

After setting all environment variables:

```powershell
# Redeploy backend
cd ..\Backand
vercel --prod

# Redeploy frontend
cd ..\Frontend
vercel --prod
```

---

## Step 7: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add Authorized JavaScript origins:
   - `https://YOUR-FRONTEND-URL.vercel.app`
6. Add Authorized redirect URIs:
   - `https://YOUR-FRONTEND-URL.vercel.app`
7. Save

---

## ✅ Verification

Test your deployed backend:

1. **Health Check**: `https://YOUR-BACKEND-URL.vercel.app/health`
   - Should return: `{"success": true, "message": "OK"}`

2. **API Info**: `https://YOUR-BACKEND-URL.vercel.app/`
   - Should return API information

3. **Categories**: `https://YOUR-BACKEND-URL.vercel.app/api/categories`
   - Should return list of categories

Test your deployed frontend:
- Visit: `https://YOUR-FRONTEND-URL.vercel.app`
- Try login with demo credentials
- Test all features

---

## 🎉 You're Live!

Your GearUp application is now deployed to Vercel!

**Backend**: `https://YOUR-BACKEND-URL.vercel.app`
**Frontend**: `https://YOUR-FRONTEND-URL.vercel.app`

---

## 🐛 Troubleshooting

### Backend not connecting to database
- Check DATABASE_URL is set correctly in Vercel dashboard
- Verify Prisma client is generated (should happen automatically via postinstall)

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check CORS settings in backend allow your frontend URL

### Google OAuth not working
- Verify authorized origins include your Vercel frontend URL
- Check GOOGLE_CLIENT_ID is set in frontend env variables

### Stripe payments failing
- Verify STRIPE_SUCCESS_URL and STRIPE_CANCEL_URL point to your frontend
- Check CLIENT_URL is set to your frontend URL in backend
