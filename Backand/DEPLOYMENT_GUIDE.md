# Backend Deployment Guide - Vercel

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- Hosted PostgreSQL database (Neon, Supabase, or Vercel Postgres)
- All environment variables ready

### 2. Deploy Command
```bash
cd Backand
vercel
```

### 3. Environment Variables Setup

After deployment, you need to set these environment variables in Vercel dashboard:

#### Database
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### JWT Configuration
```
JWT_ACCESS_SECRET=your-secure-access-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://your-frontend.vercel.app/payment/success
STRIPE_CANCEL_URL=https://your-frontend.vercel.app/payment/cancel
```

#### CORS & OAuth
```
CLIENT_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NODE_ENV=production
```

### 4. Set Environment Variables via CLI

```bash
# Set each variable
vercel env add DATABASE_URL production
vercel env add JWT_ACCESS_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add CLIENT_URL production
vercel env add GOOGLE_CLIENT_ID production
vercel env add NODE_ENV production
```

Or set them in Vercel Dashboard:
1. Go to your project on Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable

### 5. Redeploy After Setting Variables
```bash
vercel --prod
```

## 🗄️ Database Setup Options

### Option A: Neon (Recommended - Free Tier)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project "gearup-production"
4. Copy connection string
5. Use as DATABASE_URL

### Option B: Vercel Postgres
1. In Vercel dashboard, go to Storage
2. Create new Postgres database
3. Connect to your project
4. DATABASE_URL will be automatically added

### Option C: Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Use as DATABASE_URL

## ⚡ After Deployment

### Run Prisma Migrations
Your `postinstall` script automatically runs `prisma generate`, but you need to push the schema:

```bash
# After first deployment, run this in Vercel's project settings
# Or add to your build command in vercel.json
```

The schema will be pushed automatically via the postinstall hook.

### Seed Database (Optional)
If you want to seed your production database with demo data:
1. Install Vercel CLI
2. Run: `vercel env pull .env.production`
3. Run: `npm run db:seed`

## 🔗 Your Backend URLs

After deployment, your backend will be available at:
- **Production**: `https://your-project.vercel.app`
- **API Base**: `https://your-project.vercel.app/api`
- **Health Check**: `https://your-project.vercel.app/health`

## 🐛 Troubleshooting

### Issue: Prisma Client not generated
**Solution**: Add `postinstall` script to package.json (already included):
```json
"postinstall": "prisma generate"
```

### Issue: Database connection fails
**Solution**: Make sure DATABASE_URL is set and connection pooling is enabled:
```
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1
```

### Issue: Function timeout
**Solution**: Vercel serverless functions have a 10s timeout on Hobby plan, 60s on Pro.
Consider upgrading or optimizing slow queries.

### Issue: Cold starts with Prisma
**Solution**: Use Prisma Data Proxy or connection pooling:
```bash
npm install @prisma/adapter-pg pg
```
(Already installed in your project)

## 📝 Notes

- Your backend is configured for serverless deployment via `api/index.ts`
- All routes are handled through this single entry point
- CORS is configured to allow your frontend domain
- Stripe webhook endpoint is at `/api/payments/webhook/stripe`

## ✅ Verification

After deployment, test these endpoints:
1. `GET https://your-project.vercel.app/` - Should return API info
2. `GET https://your-project.vercel.app/health` - Should return OK
3. `GET https://your-project.vercel.app/api/categories` - Should return categories

## 🚀 Deploy Now!

```bash
cd Backand
vercel login
vercel
```

Follow the prompts:
- Link to existing project? No
- Project name? gearup-backend
- Directory? ./ (current)
- Override settings? No

Then set environment variables and run:
```bash
vercel --prod
```

Your backend will be live! 🎉
