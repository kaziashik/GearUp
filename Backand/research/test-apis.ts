/**
 * GearUp API Integration Test Script
 * Run: npm run dev (in one terminal), then: npx tsx research/test-apis.ts
 */
const BASE_URL = process.env.API_URL || "http://localhost:5000";

interface TestResult {
  name: string;
  method: string;
  path: string;
  status: number;
  success: boolean;
  message?: string;
}

const results: TestResult[] = [];

let customerToken = "";
let providerToken = "";
let adminToken = "";
let categoryId = "";
let gearId = "";
let rentalId = "";

async function request(
  method: string,
  path: string,
  body?: object,
  token?: string
): Promise<{ status: number; data: Record<string, unknown> }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, data };
}

function log(name: string, method: string, path: string, status: number, data: Record<string, unknown>) {
  const success = data.success === true;
  results.push({ name, method, path, status, success, message: data.message as string });
  const icon = success ? "✅" : "❌";
  console.log(`${icon} [${method}] ${path} → ${status} | ${data.message || "No message"}`);
}

async function runTests() {
  console.log("\n🏋️ GearUp API Test Suite\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Health
  let r = await request("GET", "/health");
  log("Health Check", "GET", "/health", r.status, r.data);

  // Auth - Register Customer
  r = await request("POST", "/api/auth/register", {
    email: `testcustomer_${Date.now()}@test.com`,
    password: "Test@123456",
    name: "Test Customer",
    role: "CUSTOMER",
  });
  log("Register Customer", "POST", "/api/auth/register", r.status, r.data);
  if (r.data.data && typeof r.data.data === "object") {
    const d = r.data.data as { accessToken?: string };
    customerToken = d.accessToken || "";
  }

  // Auth - Register Provider
  r = await request("POST", "/api/auth/register", {
    email: `testprovider_${Date.now()}@test.com`,
    password: "Test@123456",
    name: "Test Provider Shop",
    role: "PROVIDER",
    phone: "+1111111111",
  });
  log("Register Provider", "POST", "/api/auth/register", r.status, r.data);
  if (r.data.data && typeof r.data.data === "object") {
    const d = r.data.data as { accessToken?: string };
    providerToken = d.accessToken || "";
  }

  // Auth - Login Admin (seed account)
  r = await request("POST", "/api/auth/login", {
    email: "admin@gearup.com",
    password: "Admin@123",
  });
  log("Login Admin", "POST", "/api/auth/login", r.status, r.data);
  if (r.data.data && typeof r.data.data === "object") {
    const d = r.data.data as { accessToken?: string };
    adminToken = d.accessToken || "";
  }

  // Auth - Login seeded provider
  r = await request("POST", "/api/auth/login", {
    email: "provider@gearup.com",
    password: "Provider@123",
  });
  log("Login Provider (seed)", "POST", "/api/auth/login", r.status, r.data);
  if (r.data.data && typeof r.data.data === "object") {
    const d = r.data.data as { accessToken?: string };
    if (!providerToken) providerToken = d.accessToken || "";
  }

  // Auth - Login seeded customer
  r = await request("POST", "/api/auth/login", {
    email: "customer@gearup.com",
    password: "Customer@123",
  });
  log("Login Customer (seed)", "POST", "/api/auth/login", r.status, r.data);
  if (r.data.data && typeof r.data.data === "object") {
    const d = r.data.data as { accessToken?: string };
    if (!customerToken) customerToken = d.accessToken || "";
  }

  // Auth - Get Me
  r = await request("GET", "/api/auth/me", undefined, customerToken);
  log("Get Me", "GET", "/api/auth/me", r.status, r.data);

  // Categories
  r = await request("GET", "/api/categories");
  log("Get All Categories", "GET", "/api/categories", r.status, r.data);
  if (Array.isArray(r.data.data) && r.data.data.length > 0) {
    categoryId = (r.data.data[0] as { id: string }).id;
  }

  // Admin - Create Category
  r = await request(
    "POST",
    "/api/admin/categories",
    { name: `Test Category ${Date.now()}`, description: "Test category" },
    adminToken
  );
  log("Create Category (Admin)", "POST", "/api/admin/categories", r.status, r.data);

  // Gear - Public
  r = await request("GET", "/api/gear");
  log("Get All Gear", "GET", "/api/gear", r.status, r.data);
  if (Array.isArray(r.data.data) && r.data.data.length > 0) {
    gearId = (r.data.data[0] as { id: string }).id;
  }

  r = await request("GET", "/api/gear?search=bike&available=true");
  log("Search/Filter Gear", "GET", "/api/gear?search=bike", r.status, r.data);

  if (gearId) {
    r = await request("GET", `/api/gear/${gearId}`);
    log("Get Gear by ID", "GET", `/api/gear/${gearId}`, r.status, r.data);
  }

  // Provider - Gear Management
  if (categoryId) {
    r = await request(
      "POST",
      "/api/provider/gear",
      {
        categoryId,
        name: "Test Surfboard",
        description: "A high quality surfboard for testing purposes.",
        brand: "WaveRider",
        pricePerDay: 30,
        quantity: 2,
        specifications: { length: "6ft", material: "Fiberglass" },
        images: ["https://example.com/surfboard.jpg"],
      },
      providerToken
    );
    log("Create Gear (Provider)", "POST", "/api/provider/gear", r.status, r.data);
    if (r.data.data && typeof r.data.data === "object") {
      gearId = (r.data.data as { id: string }).id || gearId;
    }
  }

  r = await request("GET", "/api/provider/gear", undefined, providerToken);
  log("Get My Gear (Provider)", "GET", "/api/provider/gear", r.status, r.data);

  // User Profile
  r = await request("GET", "/api/users/profile", undefined, customerToken);
  log("Get My Profile", "GET", "/api/users/profile", r.status, r.data);

  r = await request(
    "PATCH",
    "/api/users/profile",
    { name: "Updated Customer Name", phone: "+9999999999" },
    customerToken
  );
  log("Update My Profile", "PATCH", "/api/users/profile", r.status, r.data);

  // Rentals
  if (gearId) {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date();
    end.setDate(end.getDate() + 4);

    r = await request(
      "POST",
      "/api/rentals",
      {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        items: [{ gearItemId: gearId, quantity: 1 }],
        notes: "Test rental order",
      },
      customerToken
    );
    log("Create Rental Order", "POST", "/api/rentals", r.status, r.data);
    if (r.data.data && typeof r.data.data === "object") {
      rentalId = (r.data.data as { id: string }).id;
    }
  }

  r = await request("GET", "/api/rentals", undefined, customerToken);
  log("Get My Rentals", "GET", "/api/rentals", r.status, r.data);

  if (rentalId) {
    r = await request("GET", `/api/rentals/${rentalId}`, undefined, customerToken);
    log("Get Rental by ID", "GET", `/api/rentals/${rentalId}`, r.status, r.data);

    // Provider confirms order
    r = await request(
      "PATCH",
      `/api/provider/orders/${rentalId}`,
      { status: "CONFIRMED" },
      providerToken
    );
    log("Confirm Order (Provider)", "PATCH", `/api/provider/orders/${rentalId}`, r.status, r.data);

    // Payment create (SSLCommerz fallback when Stripe not configured)
    r = await request(
      "POST",
      "/api/payments/create",
      { rentalOrderId: rentalId, method: "SSLCOMMERZ" },
      customerToken
    );
    log("Create Payment", "POST", "/api/payments/create", r.status, r.data);
  }

  r = await request("GET", "/api/payments", undefined, customerToken);
  log("Get Payment History", "GET", "/api/payments", r.status, r.data);

  // Provider orders
  r = await request("GET", "/api/provider/orders", undefined, providerToken);
  log("Get Provider Orders", "GET", "/api/provider/orders", r.status, r.data);

  // Admin
  r = await request("GET", "/api/admin/users", undefined, adminToken);
  log("Get All Users (Admin)", "GET", "/api/admin/users", r.status, r.data);

  r = await request("GET", "/api/admin/gear", undefined, adminToken);
  log("Get All Gear (Admin)", "GET", "/api/admin/gear", r.status, r.data);

  r = await request("GET", "/api/admin/rentals", undefined, adminToken);
  log("Get All Rentals (Admin)", "GET", "/api/admin/rentals", r.status, r.data);

  // Reviews
  if (gearId) {
    r = await request("GET", `/api/reviews/gear/${gearId}`);
    log("Get Gear Reviews", "GET", `/api/reviews/gear/${gearId}`, r.status, r.data);
  }

  // Auth - Refresh & Logout
  r = await request("POST", "/api/auth/refresh-token", {}, customerToken);
  log("Refresh Token", "POST", "/api/auth/refresh-token", r.status, r.data);

  r = await request("POST", "/api/auth/logout", {}, customerToken);
  log("Logout", "POST", "/api/auth/logout", r.status, r.data);

  // Summary
  const passed = results.filter((t) => t.success).length;
  const failed = results.filter((t) => !t.success).length;
  console.log("\n" + "=".repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${results.length} total`);
  console.log("=".repeat(50));

  if (failed > 0) {
    console.log("\n❌ Failed tests:");
    results.filter((t) => !t.success).forEach((t) => {
      console.log(`   - ${t.name}: ${t.message}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner error:", err.message);
  process.exit(1);
});
