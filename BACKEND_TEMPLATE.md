# 🎯 Professional Backend Project Template

> **Use this template when creating any new backend project with Node.js, Express, TypeScript, and Prisma**

---

## 📁 Folder Structure

```
Backend/
├── prisma/
│   ├── schema/
│   │   ├── user.prisma           # User model
│   │   ├── [entity].prisma       # One file per entity
│   │   └── schema.prisma         # Main schema (imports all)
│   └── seed.ts                   # Database seeding
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── index.ts              # Environment variables
│   ├── middlewares/
│   │   ├── auth.ts               # Authentication middleware
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.interface.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.interface.ts
│   │   └── [feature]/
│   │       ├── [feature].controller.ts
│   │       ├── [feature].service.ts
│   │       ├── [feature].route.ts
│   │       ├── [feature].interface.ts
│   │       └── [feature].validation.ts
│   ├── routes/
│   │   └── index.ts              # Central route aggregator
│   └── utils/
│       ├── catchAsync.ts         # Async error wrapper
│       ├── sendResponse.ts       # Standardized responses
│       └── jwt.ts                # JWT utilities
├── .env                          # Environment variables (never commit)
├── .env.example                  # Template for environment variables
├── .gitignore
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── tsup.config.ts                # Build configuration (for Vercel)
└── vercel.json                   # Vercel deployment config
```

---

## 🔧 Essential Configuration Files

### 1. `package.json`

```json
{
  "name": "project-backend",
  "version": "1.0.0",
  "description": "Professional backend API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "http-status": "^1.7.0",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/cors": "^2.8.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/cookie-parser": "^1.4.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "tsup": "^8.0.0",
    "prisma": "latest"
  }
}
```

### 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. `tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  target: "node18",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ["@prisma/client", ".prisma/client"],
  noExternal: [],
});
```

### 4. `.env.example`

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel

# Frontend URL
CLIENT_URL=http://localhost:3000

# Google OAuth (if needed)
GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🔐 Security Patterns

### 1. JWT Utility (`src/utils/jwt.ts`)

```typescript
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const jwtUtils = { createToken, verifyToken };
```

### 2. Async Error Wrapper (`src/utils/catchAsync.ts`)

```typescript
import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
```

### 3. Standardized Response (`src/utils/sendResponse.ts`)

```typescript
import { Response } from "express";

type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
};

export const sendResponse = <T>(
  res: Response,
  responseData: TResponseData<T>
) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
    meta: responseData.meta,
  });
};
```

### 4. Auth Middleware (`src/middlewares/auth.ts`)

```typescript
import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import prisma from "../lib/prisma";

export const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check cookies first, then Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decoded = jwtUtils.verifyToken(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (!decoded.success) {
      throw new Error("Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded.data as any).userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (roles.length && !roles.includes(user.role)) {
      throw new Error("Forbidden access");
    }

    req.user = user;
    next();
  });
};
```

---

## 🎯 Controller Pattern

```typescript
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { featureService } from "./feature.service";

const createFeature = catchAsync(async (req: Request, res: Response) => {
  const result = await featureService.createFeature(req.body);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature created successfully",
    data: result,
  });
});

const getAllFeatures = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await featureService.getAllFeatures(req.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Features retrieved successfully",
    data,
    meta,
  });
});

export const featureController = {
  createFeature,
  getAllFeatures,
};
```

---

## 📝 Service Pattern

```typescript
import prisma from "../../lib/prisma";

const createFeature = async (data: any) => {
  const result = await prisma.feature.create({
    data,
  });
  return result;
};

const getAllFeatures = async (query: any) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [data, total] = await Promise.all([
    prisma.feature.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.feature.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const featureService = {
  createFeature,
  getAllFeatures,
};
```

---

## 🌐 App Configuration (`src/app.ts`)

```typescript
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app: Application = express();

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api", router);

// Error Handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;
```

---

## 🚀 Server Entry (`src/server.ts`)

```typescript
import app from "./app";
import { config } from "./config";

const startServer = () => {
  const port = config.port || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`Environment: ${config.env}`);
  });
};

// For local development
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// Export for Vercel serverless
export default app;
```

---

## 📊 Prisma Schema Pattern

```prisma
// prisma/schema/user.prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  status    Status   @default(ACTIVE)
  image     String?
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  CUSTOMER
  PROVIDER
  ADMIN
}

enum Status {
  ACTIVE
  SUSPENDED
}
```

---

## ✅ Coding Standards

1. **File Naming**: kebab-case (e.g., `user.controller.ts`)
2. **Function Naming**: camelCase (e.g., `getUserById`)
3. **Interface Naming**: PascalCase with prefix (e.g., `IUserData`)
4. **Always use**: `catchAsync` for async controllers
5. **Always use**: `sendResponse` for API responses
6. **Always use**: `httpStatus` constants for status codes
7. **Error handling**: Centralized with global error handler
8. **Validation**: Use Zod for request validation

---

## 🔒 Cookie Configuration

```typescript
// When setting cookies (login/register)
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 1000, // 1 day
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
});
```

---

## 📦 Deployment (Vercel)

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

---

## ✨ Key Principles

1. ✅ **Modular structure** - One feature per folder
2. ✅ **Separation of concerns** - Controller → Service → Database
3. ✅ **Centralized error handling** - Consistent error responses
4. ✅ **JWT with cookies** - Secure authentication
5. ✅ **TypeScript strict mode** - Type safety
6. ✅ **Environment variables** - All configs in .env
7. ✅ **Validation** - Input validation with Zod
8. ✅ **Pagination** - All list endpoints support pagination
9. ✅ **CORS** - Properly configured with credentials
10. ✅ **Professional commit messages** - Clear and descriptive

---

**Use this template for every new backend project to maintain consistency and professional standards!** 🚀
