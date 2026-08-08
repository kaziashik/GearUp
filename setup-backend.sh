#!/bin/bash
# GearUp Setup Script - Run this to fix login issues

echo "🔧 Setting up GearUp Backend..."

cd Backand

echo "📦 Installing dependencies..."
npm install

echo "🗄️ Setting up database schema..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "🌱 Seeding demo data..."
npm run db:seed

echo "✅ Backend setup complete!"
echo ""
echo "Demo accounts created:"
echo "  Customer: customer@gearup.com / Customer@123"
echo "  Provider: provider@gearup.com / Provider@123"
echo "  Admin: admin@gearup.com / Admin@123"
echo ""
echo "🚀 Start backend with: npm run dev"
