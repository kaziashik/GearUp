# GearUp - Professional Git Commit Script
# Creates 30 meaningful commits for backend + frontend monorepo

Set-Location "E:\Next_lavel_C\Extra_Project\GearUp"

function Commit-Files {
    param([string]$Message, [string[]]$Paths)
    git add @Paths
    git commit -m $Message
}

# Root
Commit-Files "chore: initialize monorepo with gitignore and readme" @(".gitignore", "README.md")

# Backend - project setup
Commit-Files "chore(backend): initialize project with package.json and typescript config" @(
    "Backand/package.json", "Backand/tsconfig.json", "Backand/vercel.json", "Backand/prisma.config.ts"
)
Commit-Files "chore(backend): add environment template and gitignore" @(
    "Backand/.gitignore", "Backand/.env.example"
)

# Backend - prisma schema
Commit-Files "feat(backend/db): add prisma datasource and generator config" @("Backand/prisma/schema/schema.prisma")
Commit-Files "feat(backend/db): add shared enums for roles, rentals, and payments" @("Backand/prisma/schema/enums.prisma")
Commit-Files "feat(backend/db): add user model with google auth fields" @("Backand/prisma/schema/user.prisma")
Commit-Files "feat(backend/db): add category and gear item models" @(
    "Backand/prisma/schema/category.prisma", "Backand/prisma/schema/gear.prisma"
)
Commit-Files "feat(backend/db): add rental order and payment models" @(
    "Backand/prisma/schema/rentalOrder.prisma", "Backand/prisma/schema/payment.prisma", "Backand/prisma/schema/review.prisma"
)

# Backend - core
Commit-Files "feat(backend/core): add app configuration and environment loader" @("Backand/src/config/index.ts")
Commit-Files "feat(backend/core): add prisma and stripe client libraries" @(
    "Backand/src/lib/prisma.ts", "Backand/src/lib/stripe.ts", "Backand/src/lib/googleAuth.ts"
)
Commit-Files "feat(backend/core): add jwt, error handling, and response utilities" @(
    "Backand/src/utils/jwt.ts", "Backand/src/utils/AppError.ts", "Backand/src/utils/sendResponse.ts",
    "Backand/src/utils/catchAsync.ts", "Backand/src/utils/getParam.ts"
)
Commit-Files "feat(backend/core): add authentication and global error middlewares" @(
    "Backand/src/middlewares/auth.ts", "Backand/src/middlewares/globalErrorhandler.ts", "Backand/src/middlewares/notFound.ts"
)

# Backend - auth module
Commit-Files "feat(backend/auth): implement auth module with jwt cookies and google oauth" @(
    "Backand/src/modules/auth/auth.interface.ts", "Backand/src/modules/auth/auth.service.ts",
    "Backand/src/modules/auth/auth.controller.ts", "Backand/src/modules/auth/auth.routes.ts",
    "Backand/src/lib/googleAuth.ts"
)

# Backend - feature modules
Commit-Files "feat(backend/users): add user profile and password management module" @(
    "Backand/src/modules/users/user.interface.ts", "Backand/src/modules/users/user.service.ts",
    "Backand/src/modules/users/user.controller.ts", "Backand/src/modules/users/user.routers.ts"
)
Commit-Files "feat(backend/gear): add public gear browsing and search api" @(
    "Backand/src/modules/gear/gear.interface.ts", "Backand/src/modules/gear/gear.service.ts",
    "Backand/src/modules/gear/gear.controller.ts", "Backand/src/modules/gear/gear.router.ts"
)
Commit-Files "feat(backend/category): add category crud and listing endpoints" @(
    "Backand/src/modules/category/category.interface.ts", "Backand/src/modules/category/category.service.ts",
    "Backand/src/modules/category/category.controller.ts", "Backand/src/modules/category/category.router.ts"
)
Commit-Files "feat(backend/rental): add rental order creation and status management" @(
    "Backand/src/modules/rental/rental.interface.ts", "Backand/src/modules/rental/rental.service.ts",
    "Backand/src/modules/rental/rental.controller.ts", "Backand/src/modules/rental/rental.router.ts"
)
Commit-Files "feat(backend/payment): add stripe checkout and payment history api" @(
    "Backand/src/modules/payment/payment.interface.ts", "Backand/src/modules/payment/payment.service.ts",
    "Backand/src/modules/payment/payment.controller.ts", "Backand/src/modules/payment/payment.router.ts",
    "Backand/src/modules/payment/webhook.controller.ts"
)
Commit-Files "feat(backend/provider): add provider gear inventory and order management" @(
    "Backand/src/modules/provider/provider.controller.ts", "Backand/src/modules/provider/provider.router.ts"
)
Commit-Files "feat(backend/review): add gear review submission and listing" @(
    "Backand/src/modules/review/review.interface.ts", "Backand/src/modules/review/review.service.ts",
    "Backand/src/modules/review/review.controller.ts", "Backand/src/modules/review/review.router.ts"
)
Commit-Files "feat(backend/admin): add admin user and platform moderation endpoints" @(
    "Backand/src/modules/admin/admin.service.ts", "Backand/src/modules/admin/admin.controller.ts",
    "Backand/src/modules/admin/admin.router.ts"
)
Commit-Files "feat(backend/app): wire express routes and vercel serverless entry" @(
    "Backand/src/app.ts", "Backand/src/server.ts", "Backand/api/index.ts"
)
Commit-Files "feat(backend/db): add demo seed data with unsplash images" @("Backand/prisma/seed.ts", "DEMO_DATA.md")
Commit-Files "docs(backend): add readme and postman api collection" @(
    "Backand/README.md", "Backand/research/GearUp_API.postman_collection.json", "Backand/research/test-apis.ts"
)

# Frontend - setup
Commit-Files "chore(frontend): initialize next.js project with tailwind and shadcn config" @(
    "Frontend/package.json", "Frontend/tsconfig.json", "Frontend/next.config.js",
    "Frontend/tailwind.config.ts", "Frontend/postcss.config.js", "Frontend/components.json",
    "Frontend/.gitignore", "Frontend/.env.example"
)
Commit-Files "feat(frontend/ui): add base shadcn-style ui components" @(
    "Frontend/components/ui/button.tsx", "Frontend/components/ui/input.tsx", "Frontend/components/ui/label.tsx",
    "Frontend/components/ui/card.tsx", "Frontend/components/ui/badge.tsx", "Frontend/components/ui/textarea.tsx",
    "Frontend/components/ui/select.tsx", "Frontend/components/ui/skeleton.tsx"
)
Commit-Files "feat(frontend/shared): add navbar, footer, and dark mode theme toggle" @(
    "Frontend/components/shared/navbar.tsx", "Frontend/components/shared/Footer.tsx",
    "Frontend/components/shared/theme-provider.tsx", "Frontend/components/shared/ThemeToggle.tsx"
)
Commit-Files "feat(frontend/lib): add types, api client, and rental status badges" @(
    "Frontend/lib/utils.ts", "Frontend/lib/types.ts", "Frontend/lib/api.ts", "Frontend/lib/server-api.ts",
    "Frontend/lib/statusBadge.ts", "Frontend/utils/jwt.ts", "Frontend/hooks/use-mobile.ts"
)
Commit-Files "feat(frontend/auth): add middleware and auth server actions" @(
    "Frontend/middleware.ts", "Frontend/service/getMe.ts", "Frontend/service/logout.ts",
    "Frontend/service/refreshToken.ts", "Frontend/app/(authGroup)/_actions/authAction.ts"
)

# Frontend - pages
Commit-Files "feat(frontend/public): add home page with featured gear hero section" @(
    "Frontend/app/layout.tsx", "Frontend/app/globals.css", "Frontend/app/(publicGroup)/layout.tsx",
    "Frontend/app/(publicGroup)/page.tsx", "Frontend/app/(publicGroup)/_components/GearCard.tsx"
)
Commit-Files "feat(frontend/public): add gear browse page with search filters and pagination" @(
    "Frontend/app/(publicGroup)/gear/page.tsx"
)
Commit-Files "feat(frontend/public): add gear details page with date picker rental flow" @(
    "Frontend/app/(publicGroup)/gearDetails/[id]/page.tsx", "Frontend/app/(publicGroup)/gearDetails/[id]/GearDetailsClient.tsx"
)
Commit-Files "feat(frontend/auth-ui): add login and register forms with google oauth" @(
    "Frontend/app/(authGroup)/login/page.tsx", "Frontend/app/(authGroup)/register/page.tsx",
    "Frontend/app/(authGroup)/_components/AuthForms.tsx"
)
Commit-Files "feat(frontend/dashboard): add shared dashboard layout and sidebar navigation" @(
    "Frontend/app/(dashboardGroup)/layout.tsx", "Frontend/app/(dashboardGroup)/_config/dashboardNav.ts",
    "Frontend/app/(dashboardGroup)/_components/DashboardSidebar.tsx"
)
Commit-Files "feat(frontend/customer): add customer dashboard, orders, and payments" @(
    "Frontend/app/(dashboardGroup)/customer-dashboard/page.tsx",
    "Frontend/app/(dashboardGroup)/customer-dashboard/orders/page.tsx",
    "Frontend/app/(dashboardGroup)/customer-dashboard/payments/page.tsx",
    "Frontend/app/(dashboardGroup)/customer-dashboard/orders/[id]/pay/page.tsx",
    "Frontend/app/(dashboardGroup)/customer-dashboard/orders/[id]/review/page.tsx"
)
Commit-Files "feat(frontend/provider): add provider dashboard, gear crud, and order management" @(
    "Frontend/app/(dashboardGroup)/provider-dashboard/page.tsx",
    "Frontend/app/(dashboardGroup)/provider-dashboard/gear/page.tsx",
    "Frontend/app/(dashboardGroup)/provider-dashboard/gear/new/page.tsx",
    "Frontend/app/(dashboardGroup)/provider-dashboard/orders/page.tsx"
)
Commit-Files "feat(frontend/admin): add admin dashboard and user management table" @(
    "Frontend/app/(dashboardGroup)/admin-dashboard/page.tsx",
    "Frontend/app/(dashboardGroup)/admin-dashboard/users/page.tsx"
)
Commit-Files "feat(frontend/api): add next.js proxy routes for authenticated backend calls" @(
    "Frontend/app/api/rentals/create/route.ts", "Frontend/app/api/rentals/[id]/route.ts",
    "Frontend/app/api/payments/create/route.ts", "Frontend/app/api/reviews/create/route.ts",
    "Frontend/app/api/provider/gear/route.ts", "Frontend/app/api/provider/orders/route.ts",
    "Frontend/app/api/provider/orders/[id]/route.ts", "Frontend/app/api/admin/users/route.ts",
    "Frontend/app/api/admin/users/[id]/route.ts"
)
Commit-Files "feat(frontend/public): add static pages and global error boundaries" @(
    "Frontend/app/(publicGroup)/about/page.tsx", "Frontend/app/(publicGroup)/services/page.tsx",
    "Frontend/app/(publicGroup)/contact/page.tsx", "Frontend/app/(publicGroup)/success/page.tsx",
    "Frontend/app/(publicGroup)/cancel/page.tsx", "Frontend/app/loading.tsx", "Frontend/app/error.tsx",
    "Frontend/app/not-found.tsx", "Frontend/README.md"
)

# Lock files last
Commit-Files "chore: add package lock files for reproducible installs" @(
    "Backand/package-lock.json", "Frontend/package-lock.json"
)

Write-Host "`n✅ Done! Commit count:"
git log --oneline | Measure-Object -Line
