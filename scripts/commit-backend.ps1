# Backend-only commits for GearUp monorepo (frontend already committed)
Set-Location "E:\Next_lavel_C\Extra_Project\GearUp"
$ErrorActionPreference = "Stop"

function Commit-Files {
    param([string]$Message, [string[]]$Paths)
    foreach ($p in $Paths) {
        if (-not (Test-Path $p)) {
            Write-Warning "Missing: $p"
        }
        git add -- "$p"
    }
    $staged = git diff --cached --name-only
    if (-not $staged) {
        Write-Host "SKIP (nothing staged): $Message"
        return
    }
    git commit -m $Message
    Write-Host "OK: $Message"
}

Commit-Files "chore(backend): initialize project with package.json and typescript config" @(
    "Backand/package.json", "Backand/tsconfig.json", "Backand/vercel.json", "Backand/prisma.config.ts"
)
Commit-Files "chore(backend): add environment template and gitignore" @(
    "Backand/.gitignore", "Backand/.env.example"
)
Commit-Files "feat(backend/db): add prisma datasource and generator config" @("Backand/prisma/schema/schema.prisma")
Commit-Files "feat(backend/db): add shared enums for roles, rentals, and payments" @("Backand/prisma/schema/enums.prisma")
Commit-Files "feat(backend/db): add user model with google auth fields" @("Backand/prisma/schema/user.prisma")
Commit-Files "feat(backend/db): add category and gear item models" @(
    "Backand/prisma/schema/category.prisma", "Backand/prisma/schema/gear.prisma"
)
Commit-Files "feat(backend/db): add rental order, payment, and review models" @(
    "Backand/prisma/schema/rentalOrder.prisma", "Backand/prisma/schema/payment.prisma", "Backand/prisma/schema/review.prisma"
)
Commit-Files "feat(backend/core): add app configuration and environment loader" @("Backand/src/config/index.ts")
Commit-Files "feat(backend/core): add prisma, stripe, and google auth libraries" @(
    "Backand/src/lib/prisma.ts", "Backand/src/lib/stripe.ts", "Backand/src/lib/googleAuth.ts"
)
Commit-Files "feat(backend/core): add jwt, error handling, and response utilities" @(
    "Backand/src/utils/jwt.ts", "Backand/src/utils/AppError.ts", "Backand/src/utils/sendResponse.ts",
    "Backand/src/utils/catchAsync.ts", "Backand/src/utils/getParam.ts"
)
Commit-Files "feat(backend/core): add authentication and global error middlewares" @(
    "Backand/src/middlewares/auth.ts", "Backand/src/middlewares/globalErrorhandler.ts", "Backand/src/middlewares/notFound.ts"
)
Commit-Files "feat(backend/auth): implement auth module with jwt cookies and google oauth" @(
    "Backand/src/modules/auth/auth.interface.ts", "Backand/src/modules/auth/auth.service.ts",
    "Backand/src/modules/auth/auth.controller.ts", "Backand/src/modules/auth/auth.routes.ts"
)
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
Commit-Files "feat(backend/db): add prisma seed script with demo gear and users" @("Backand/prisma/seed.ts")
Commit-Files "docs(backend): add readme, postman collection, and api test script" @(
    "Backand/README.md", "Backand/research/GearUp_API.postman_collection.json", "Backand/research/test-apis.ts"
)
Commit-Files "chore(backend): add package lock file for reproducible installs" @("Backand/package-lock.json")
Commit-Files "chore: add commit helper scripts for monorepo history" @(
    "scripts/create-commits.ps1", "scripts/commit-backend.ps1"
)

Write-Host "`nTotal commits:"
(git log --oneline | Measure-Object -Line).Lines
