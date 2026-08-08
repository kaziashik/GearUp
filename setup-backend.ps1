# GearUp Setup Script - Run this to fix login issues

Write-Host "🔧 Setting up GearUp Backend..." -ForegroundColor Cyan

Set-Location Backand

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🗄️ Setting up database schema..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push --accept-data-loss

Write-Host "`n🌱 Seeding demo data..." -ForegroundColor Yellow
npm run db:seed

Write-Host "`n✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Demo accounts created:" -ForegroundColor Green
Write-Host "  Customer: customer@gearup.com / Customer@123"
Write-Host "  Provider: provider@gearup.com / Provider@123"
Write-Host "  Admin: admin@gearup.com / Admin@123"
Write-Host ""
Write-Host "🚀 Start backend with: npm run dev" -ForegroundColor Cyan
