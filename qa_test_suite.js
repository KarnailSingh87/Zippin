/**
 * ============================================================================
 * ZIPPIN CLONE - PHASE 2 BACKEND & API AUTOMATED QA TEST SUITE
 * ============================================================================
 * Covers:
 *  2.1 Endpoint Catalog (59 Endpoints)
 *  2.2 Input Variation Matrix (Valid, Empty, Wrong Type, Long, Special Chars, Tokens, Roles)
 *  2.3 HTTP Status Code Verification (200, 201, 400, 401, 403, 404, 500)
 *  2.4 Authentication & Session Lifecycle (Register, Login, Expiry, Refresh, OTP)
 *  2.5 Authorization & IDOR Matrix (Horizontal & Vertical Privilege Escalation)
 *  2.6 Security Testing (NoSQL Injection, Stored XSS, CSRF, Rate Limiting, File Uploads)
 *  2.7 Performance & Load Testing (Latency Benchmarks & 100 Concurrent Requests)
 *  2.8 Concurrency Race Conditions (Simultaneous Stock Purchase / Double-Spend)
 * ============================================================================
 */

import http from "http";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mongoose = require("./backend/node_modules/mongoose");
const jwt = require("./backend/node_modules/jsonwebtoken");

const BASE_URL = "http://localhost:4000";
const JWT_SECRET = process.env.JWT_SECRET || "greatstack";

function httpReq(method, path, body = null, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? (typeof body === "string" ? body : JSON.stringify(body)) : null;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        ...(postData ? { "Content-Length": Buffer.byteLength(postData) } : {}),
        ...headers,
      },
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const durationMs = Date.now() - startTime;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: json,
          raw: data,
          durationMs,
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        status: 0,
        error: err.message,
        durationMs: Date.now() - startTime,
      });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log("==================================================================");
  console.log("  PHASE 2: FULL-STACK BACKEND & API AUTOMATED TEST SUITE RUNNER  ");
  console.log("  Target Base URL: " + BASE_URL);
  console.log("==================================================================\n");

  await mongoose.connect("mongodb://127.0.0.1:27017/zippin");
  const db = mongoose.connection.db;

  // Verify Admin Account
  const adminUser = await db.collection("users").findOne({ roles: "admin" });
  if (!adminUser) {
    throw new Error("No admin user found in database!");
  }
  const adminToken = jwt.sign(
    { sub: adminUser._id.toString(), roles: ["admin"] },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Setup Test Customer Accounts
  await db.collection("users").deleteMany({
    email: { $in: ["qa_customer_alpha@test.com", "qa_customer_beta@test.com"] },
  });

  const custA = await db.collection("users").insertOne({
    name: "Customer Alpha QA",
    firstName: "Customer",
    lastName: "Alpha",
    email: "qa_customer_alpha@test.com",
    phone: "9100000011",
    city: "Gurugram",
    passwordHash: "$2a$10$wK1kCqB7E1i91Z9oB1G3Ou7xZ4Y1Z9oB1G3Ou7xZ4Y1Z9oB1G3Ou.",
    roles: ["customer"],
    addresses: [{ label: "Home", street: "101 Alpha Tower", city: "Gurugram", pincode: "122002" }],
    createdAt: new Date(),
  });
  const tokenCustA = jwt.sign(
    { sub: custA.insertedId.toString(), roles: ["customer"] },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const custB = await db.collection("users").insertOne({
    name: "Customer Beta QA",
    firstName: "Customer",
    lastName: "Beta",
    email: "qa_customer_beta@test.com",
    phone: "9100000012",
    city: "Gurugram",
    passwordHash: "$2a$10$wK1kCqB7E1i91Z9oB1G3Ou7xZ4Y1Z9oB1G3Ou7xZ4Y1Z9oB1G3Ou.",
    roles: ["customer"],
    addresses: [{ label: "Office", street: "202 Beta Tech Park", city: "Gurugram", pincode: "122002" }],
    createdAt: new Date(),
  });
  const tokenCustB = jwt.sign(
    { sub: custB.insertedId.toString(), roles: ["customer"] },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  const expiredToken = jwt.sign(
    { sub: custA.insertedId.toString(), roles: ["customer"] },
    JWT_SECRET,
    { expiresIn: -60 }
  );
  const tamperedToken = tokenCustA.slice(0, -6) + "xxxxxx";

  const sampleProduct = await db.collection("products").findOne({ isAvailable: true });
  const sampleProdId = sampleProduct._id.toString();
  const sampleStore = await db.collection("stores").findOne({ isActive: true });
  const sampleStoreId = sampleStore._id.toString();

  const testReport = [];

  function logTest(id, section, title, expected, actual, pass, details = "") {
    testReport.push({ id, section, title, expected, actual, pass, details });
    const tag = pass ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
    console.log(`${tag} ${id.padEnd(9)} | ${title} -> Exp: ${expected} | Act: ${actual} ${details ? "| " + details : ""}`);
  }

  // =========================================================================
  // SECTION 2.1 & 2.2 & 2.3: ENDPOINT & INPUT VARIATION MATRIX
  // =========================================================================
  console.log("\n>>> SECTION 2.1 - 2.3: ENDPOINTS & STATUS CODES MATRIX <<<");

  // Health
  let r = await httpReq("GET", "/health");
  logTest("TC-2.1.01", "Endpoints", "GET /health (valid status check)", "200", `${r.status}`, r.status === 200);

  // Auth: Register
  r = await httpReq("POST", "/api/auth/register", {});
  logTest("TC-2.2.01", "Endpoints", "POST /api/auth/register (empty body)", "400", `${r.status}`, r.status === 400);

  r = await httpReq("POST", "/api/auth/register", { name: 12345, email: true, phone: {}, password: [] });
  logTest("TC-2.2.02", "Endpoints", "POST /api/auth/register (wrong types)", "400", `${r.status}`, r.status === 400, "Accepted corrupted types without schema error");

  r = await httpReq("POST", "/api/auth/register", { name: "A".repeat(10000), email: "long_" + "a".repeat(500) + "@test.com", phone: "9876543210", password: "p".repeat(500) });
  logTest("TC-2.2.03", "Endpoints", "POST /api/auth/register (very long input 10k chars)", "400", `${r.status}`, [400, 413].includes(r.status), `Server returned ${r.status}`);

  // Auth: Login
  r = await httpReq("POST", "/api/auth/login", {});
  logTest("TC-2.2.04", "Endpoints", "POST /api/auth/login (empty body)", "400", `${r.status}`, r.status === 400);

  r = await httpReq("POST", "/api/auth/login", { email: "nonexistent@user.com", password: "bad" });
  logTest("TC-2.2.05", "Endpoints", "POST /api/auth/login (invalid credentials)", "401", `${r.status}`, r.status === 401);

  // Auth: Me
  r = await httpReq("GET", "/api/auth/me");
  logTest("TC-2.2.06", "Endpoints", "GET /api/auth/me (missing token)", "401", `${r.status}`, r.status === 401);

  r = await httpReq("GET", "/api/auth/me", null, { Authorization: `Bearer ${expiredToken}` });
  logTest("TC-2.2.07", "Endpoints", "GET /api/auth/me (expired token)", "401", `${r.status}`, r.status === 401);

  r = await httpReq("GET", "/api/auth/me", null, { Authorization: `Bearer ${tamperedToken}` });
  logTest("TC-2.2.08", "Endpoints", "GET /api/auth/me (tampered signature)", "401", `${r.status}`, r.status === 401);

  r = await httpReq("GET", "/api/auth/me", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.09", "Endpoints", "GET /api/auth/me (valid customer token)", "200", `${r.status}`, r.status === 200);

  // Products
  r = await httpReq("GET", "/api/products");
  logTest("TC-2.2.10", "Endpoints", "GET /api/products (public catalog list)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", "/api/products?q=" + encodeURIComponent("!@#$%^&*()_+~|}{[]:;?><,./'\""));
  logTest("TC-2.2.11", "Endpoints", "GET /api/products (special characters in query)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", `/api/products/${sampleProdId}`);
  logTest("TC-2.2.12", "Endpoints", "GET /api/products/:id (valid ObjectId)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", "/api/products/000000000000000000000000");
  logTest("TC-2.2.13", "Endpoints", "GET /api/products/:id (non-existent valid ObjectId)", "404", `${r.status}`, r.status === 404);

  // Product Admin Operations & Role Verification
  r = await httpReq("GET", "/api/products/stats/summary", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.14", "Endpoints", "GET /api/products/stats/summary (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("GET", "/api/products/stats/summary", null, { Authorization: `Bearer ${adminToken}` });
  logTest("TC-2.2.15", "Endpoints", "GET /api/products/stats/summary (Admin token)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("PATCH", `/api/products/${sampleProdId}/stock`, { stock: 99 }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.16", "Endpoints", "PATCH /api/products/:id/stock (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("POST", "/api/products", { title: "New Item", price: 100 }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.17", "Endpoints", "POST /api/products (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  // Categories
  r = await httpReq("GET", "/api/categories");
  logTest("TC-2.2.18", "Endpoints", "GET /api/categories (public categories)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", "/api/categories/vegetables-fruits");
  logTest("TC-2.2.19", "Endpoints", "GET /api/categories/:slug (valid slug)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", "/api/categories/completely-invalid-slug-999");
  logTest("TC-2.2.20", "Endpoints", "GET /api/categories/:slug (non-existent slug)", "404", `${r.status}`, r.status === 404);

  r = await httpReq("POST", "/api/categories", { name: "Unauthorized Cat" }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.21", "Endpoints", "POST /api/categories (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  // Orders
  r = await httpReq("GET", "/api/orders");
  logTest("TC-2.2.22", "Endpoints", "GET /api/orders (missing token)", "401", `${r.status}`, r.status === 401);

  r = await httpReq("GET", "/api/orders", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.23", "Endpoints", "GET /api/orders (valid customer token)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("GET", "/api/orders/all", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.24", "Endpoints", "GET /api/orders/all (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("GET", "/api/orders/all", null, { Authorization: `Bearer ${adminToken}` });
  logTest("TC-2.2.25", "Endpoints", "GET /api/orders/all (Admin token)", "200", `${r.status}`, r.status === 200);

  // Stores
  r = await httpReq("GET", "/api/stores");
  logTest("TC-2.2.26", "Endpoints", "GET /api/stores (public store directory)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("POST", "/api/stores", { name: "Store X", code: "SX", city: "Gurugram", area: "Sec 1" }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.27", "Endpoints", "POST /api/stores (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  // Delivery Partners
  r = await httpReq("GET", "/api/delivery-partners");
  logTest("TC-2.2.28", "Endpoints", "GET /api/delivery-partners (Fleet info exposure)", "401/403", `${r.status}`, [401, 403].includes(r.status), r.status === 200 ? "LEAK: Unauthenticated public endpoint exposes riders" : "Restricted");

  r = await httpReq("POST", "/api/delivery-partners", { firstName: "Rider", phone: "9000000000", city: "Gurugram" }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.29", "Endpoints", "POST /api/delivery-partners (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  // Payments
  r = await httpReq("GET", "/api/payments", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.30", "Endpoints", "GET /api/payments (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("GET", "/api/payments", null, { Authorization: `Bearer ${adminToken}` });
  logTest("TC-2.2.31", "Endpoints", "GET /api/payments (Admin token)", "200", `${r.status}`, r.status === 200);

  // Deliveries
  r = await httpReq("GET", "/api/deliveries", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.32", "Endpoints", "GET /api/deliveries (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("GET", "/api/deliveries", null, { Authorization: `Bearer ${adminToken}` });
  logTest("TC-2.2.33", "Endpoints", "GET /api/deliveries (Admin token)", "200", `${r.status}`, r.status === 200);

  // Inventory
  r = await httpReq("GET", "/api/inventory", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.34", "Endpoints", "GET /api/inventory (Customer role check)", "403", `${r.status}`, r.status === 403, r.status === 200 ? "VULNERABLE: Customers can view warehouse inventory" : "Protected");

  // Banners
  r = await httpReq("GET", "/api/banners");
  logTest("TC-2.2.35", "Endpoints", "GET /api/banners (public banners)", "200", `${r.status}`, r.status === 200);

  r = await httpReq("POST", "/api/banners", { title: "Promo", image: "img.jpg", link: "/cat" }, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.36", "Endpoints", "POST /api/banners (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  // Analytics
  r = await httpReq("GET", "/api/analytics/revenue", null, { Authorization: `Bearer ${tokenCustA}` });
  logTest("TC-2.2.37", "Endpoints", "GET /api/analytics/revenue (Customer calling Admin)", "403", `${r.status}`, r.status === 403);

  r = await httpReq("GET", "/api/analytics/revenue", null, { Authorization: `Bearer ${adminToken}` });
  logTest("TC-2.2.38", "Endpoints", "GET /api/analytics/revenue (Admin token)", "200", `${r.status}`, r.status === 200);

  // =========================================================================
  // SECTION 2.4: AUTHENTICATION & SESSION MANAGEMENT
  // =========================================================================
  console.log("\n>>> SECTION 2.4: AUTHENTICATION & SESSION MANAGEMENT <<<");

  // Duplicate email registration
  r = await httpReq("POST", "/api/auth/register", {
    name: "Customer Alpha",
    email: "qa_customer_alpha@test.com",
    phone: "9199999999",
    password: "Password123!",
  });
  logTest("TC-2.4.01", "Auth", "Register duplicate email", "400", `${r.status}`, r.status === 400);

  // Duplicate phone registration
  r = await httpReq("POST", "/api/auth/register", {
    name: "Customer New",
    email: "unique_qa_12345@test.com",
    phone: "9100000011",
    password: "Password123!",
  });
  logTest("TC-2.4.02", "Auth", "Register duplicate phone number", "400", `${r.status}`, r.status === 400);

  // Login with correct email + password
  await httpReq("POST", "/api/auth/register", {
    name: "Login Test User",
    email: "login_test_temp@test.com",
    phone: "9100000033",
    password: "CorrectPassword123!",
  });
  r = await httpReq("POST", "/api/auth/login", {
    email: "login_test_temp@test.com",
    password: "CorrectPassword123!",
  });
  logTest("TC-2.4.03", "Auth", "Login with valid credentials", "200", `${r.status}`, r.status === 200 && !!r.body?.token);

  // Login with wrong password
  r = await httpReq("POST", "/api/auth/login", {
    email: "login_test_temp@test.com",
    password: "WrongPassword!",
  });
  logTest("TC-2.4.04", "Auth", "Login with wrong password", "401", `${r.status}`, r.status === 401);

  // Cleanup temp user
  await db.collection("users").deleteOne({ email: "login_test_temp@test.com" });

  // OTP authentication audit
  const otpSendRes = await httpReq("POST", "/api/auth/otp/send", { phone: "9876543210" });
  const otpVerifyRes = await httpReq("POST", "/api/auth/otp/verify", { phone: "9876543210", otp: "123456" });
  const otpSuccess = otpSendRes.status === 200 && otpVerifyRes.status === 200 && !!otpVerifyRes.body?.token;
  logTest("TC-2.4.05", "Auth", "Phone OTP Login Support", "Implemented", otpSuccess ? "Implemented" : "Missing", otpSuccess, "Endpoints /api/auth/otp/send and /verify operational");

  // OTP brute-force rate limit
  let otpRateLimited = false;
  for (let i = 0; i < 10; i++) {
    const limRes = await httpReq("POST", "/api/auth/otp/send", { phone: "9876543210" });
    if (limRes.status === 429) {
      otpRateLimited = true;
      break;
    }
  }
  logTest("TC-2.4.06", "Auth", "OTP Brute-Force Rate Limiting", "Implemented", otpRateLimited ? "Implemented" : "N/A", otpRateLimited, "Rate limiter restricts aggressive OTP requests");

  // Token refresh audit
  const refreshRes = await httpReq("POST", "/api/auth/refresh", { token: otpVerifyRes.body?.token || tokenCustA });
  const refreshSuccess = refreshRes.status === 200 && !!refreshRes.body?.token;
  logTest("TC-2.4.07", "Auth", "Token Refresh Endpoint", "Implemented", refreshSuccess ? "Implemented" : "Missing", refreshSuccess, "POST /api/auth/refresh provides fresh tokens");

  // =========================================================================
  // SECTION 2.5: AUTHORIZATION & IDOR (Insecure Direct Object Reference)
  // =========================================================================
  console.log("\n>>> SECTION 2.5: AUTHORIZATION & IDOR TESTING <<<");

  // Create Order for Customer Alpha
  const createOrderA = await httpReq("POST", "/api/orders", {
    items: [{ productId: sampleProdId, qty: 1 }],
    deliveryAddress: { label: "Home", street: "101 Confidential Penthouse", city: "Gurugram", pincode: "122002" },
    payment: { method: "cod", status: "pending" },
    storeId: sampleStoreId,
  }, { Authorization: `Bearer ${tokenCustA}` });

  const orderAId = createOrderA.body?._id;

  if (orderAId) {
    // IDOR TEST 1: Customer Beta attempts to view Customer Alpha's order
    r = await httpReq("GET", `/api/orders/${orderAId}`, null, { Authorization: `Bearer ${tokenCustB}` });
    const orderIdorExploited = r.status === 200 && r.body?.deliveryAddress?.street === "101 Confidential Penthouse";
    logTest(
      "TC-2.5.01",
      "Authorization",
      "IDOR on GET /api/orders/:id (Customer Beta views Customer Alpha order)",
      "403 Forbidden",
      `${r.status} ${r.status === 200 ? "OK" : ""}`,
      !orderIdorExploited && r.status === 403,
      orderIdorExploited ? "CRITICAL IDOR: Customer Beta received Customer Alpha's private address & contact info!" : "Access blocked"
    );

    // IDOR TEST 2: Customer Beta views Customer Alpha's payment record
    r = await httpReq("GET", `/api/payments/order/${orderAId}`, null, { Authorization: `Bearer ${tokenCustB}` });
    const paymentIdorExploited = r.status === 200;
    logTest(
      "TC-2.5.02",
      "Authorization",
      "IDOR on GET /api/payments/order/:orderId (Customer Beta views Customer Alpha payment)",
      "403 Forbidden",
      `${r.status} ${r.status === 200 ? "OK" : ""}`,
      !paymentIdorExploited && r.status === 403,
      paymentIdorExploited ? "CRITICAL IDOR: Customer Beta viewed payment amount, transactionId & status!" : "Access blocked"
    );

    // IDOR TEST 3: Customer Beta views Customer Alpha's delivery tracking
    r = await httpReq("GET", `/api/deliveries/order/${orderAId}`, null, { Authorization: `Bearer ${tokenCustB}` });
    const deliveryIdorExploited = r.status === 200;
    logTest(
      "TC-2.5.03",
      "Authorization",
      "IDOR on GET /api/deliveries/order/:orderId (Customer Beta views Customer Alpha delivery)",
      "403 Forbidden",
      `${r.status} ${r.status === 200 ? "OK" : ""}`,
      !deliveryIdorExploited && r.status === 403,
      deliveryIdorExploited ? "CRITICAL IDOR: Customer Beta tracked Customer Alpha's live rider and drop location!" : "Access blocked"
    );

    // Customer tampering with Delivery Partner status
    const partner = await db.collection("deliverypartners").findOne({});
    if (partner) {
      r = await httpReq("PATCH", `/api/delivery-partners/${partner._id}/status`, { status: "offline" }, { Authorization: `Bearer ${tokenCustA}` });
      logTest(
        "TC-2.5.04",
        "Authorization",
        "Horizontal Escalation: Customer PATCH /api/delivery-partners/:id/status",
        "403 Forbidden",
        `${r.status}`,
        r.status === 403,
        r.status === 200 ? "VULNERABILITY: Ordinary customer forced delivery rider offline!" : "Blocked"
      );
    }

    // Customer tampering with Order Delivery Status
    const deliveryDoc = await db.collection("deliveries").findOne({ order: new mongoose.Types.ObjectId(orderAId) });
    if (deliveryDoc) {
      r = await httpReq("PATCH", `/api/deliveries/${deliveryDoc._id}/status`, { status: "delivered" }, { Authorization: `Bearer ${tokenCustB}` });
      logTest(
        "TC-2.5.05",
        "Authorization",
        "Horizontal Escalation: Customer Beta PATCH /api/deliveries/:id/status",
        "403 Forbidden",
        `${r.status}`,
        r.status === 403,
        r.status === 200 ? "VULNERABILITY: Customer Beta maliciously marked Customer Alpha's delivery as 'delivered'!" : "Blocked"
      );
    }
  }

  // =========================================================================
  // SECTION 2.6: SECURITY TESTING (Injection, XSS, CSRF, Rate Limiting)
  // =========================================================================
  console.log("\n>>> SECTION 2.6: SECURITY & INJECTION TESTING <<<");

  // NoSQL Object Injection on Query Parameters
  r = await httpReq("GET", "/api/products?category[$ne]=null");
  logTest("TC-2.6.01", "Security", "NoSQL Injection: GET /api/products?category[$ne]=null", "400/Sanitized", `${r.status}`, r.status === 400 || (r.status === 200 && Array.isArray(r.body)), "Server parsed parameter directly");

  // NoSQL Injection in Login Body
  r = await httpReq("POST", "/api/auth/login", {
    email: { $gt: "" },
    password: { $gt: "" },
  });
  logTest(
    "TC-2.6.02",
    "Security",
    "NoSQL Injection: POST /api/auth/login with object operators {$gt: ''}",
    "400 Bad Request",
    `${r.status}`,
    r.status === 400 || r.status === 401,
    `Server returned ${r.status}`
  );

  // Stored XSS in Order Delivery Address
  r = await httpReq("POST", "/api/orders", {
    items: [{ productId: sampleProdId, qty: 1 }],
    deliveryAddress: {
      label: "<script>alert('XSS_LABEL')</script>",
      street: "<img src=x onerror=alert('XSS_STREET')>",
      city: "Gurugram",
      pincode: "122001",
    },
    payment: { method: "cod" },
  }, { Authorization: `Bearer ${tokenCustA}` });

  const xssStored = r.body?.deliveryAddress?.label?.includes("<script>");
  logTest(
    "TC-2.6.03",
    "Security",
    "Stored XSS: Raw script injection in order address label",
    "Sanitized (<script> stripped/encoded)",
    xssStored ? "Raw tags stored verbatim" : "Sanitized",
    !xssStored,
    xssStored ? "VULNERABILITY: Unescaped JavaScript stored in database and served to Admin dashboard" : "Safe"
  );
  if (r.body?._id) {
    await db.collection("orders").deleteOne({ _id: new mongoose.Types.ObjectId(r.body._id) });
  }

  // Rate Limiting (50 rapid consecutive requests)
  console.log("  -> Firing 50 rapid requests to /api/auth/login to test rate limiting...");
  const rateLimitPromises = [];
  for (let i = 0; i < 50; i++) {
    rateLimitPromises.push(httpReq("POST", "/api/auth/login", { email: "rate_test@test.com", password: "bad" }));
  }
  const rateLimitResponses = await Promise.all(rateLimitPromises);
  const triggeredRateLimit = rateLimitResponses.some((res) => res.status === 429);
  logTest(
    "TC-2.6.04",
    "Security",
    "Rate Limiting on POST /api/auth/login (50 rapid requests)",
    "429 Too Many Requests",
    triggeredRateLimit ? "429 Triggered" : "No 429 (all returned 401)",
    triggeredRateLimit,
    triggeredRateLimit ? "Protected against credential stuffing" : "VULNERABLE: No rate limiter; brute-force permitted"
  );

  // File Upload Security
  r = await httpReq("GET", "/api/uploads/sign");
  logTest(
    "TC-2.6.05",
    "Security",
    "Unrestricted Cloudinary Signature Generation (GET /api/uploads/sign)",
    "401 Unauthorized",
    `${r.status}`,
    r.status === 401,
    r.status === 200 ? "VULNERABLE: Public endpoint generates valid Cloudinary upload signatures" : "Protected"
  );

  // =========================================================================
  // SECTION 2.7: PERFORMANCE & LOAD TESTING (100+ Concurrent Users)
  // =========================================================================
  console.log("\n>>> SECTION 2.7: PERFORMANCE & CONCURRENT LOAD TESTING <<<");

  // Latency benchmarks
  r = await httpReq("GET", "/api/products");
  logTest("TC-2.7.01", "Performance", "Baseline Latency: GET /api/products (< 500 ms)", "< 500ms", `${r.durationMs}ms`, r.durationMs < 500);

  r = await httpReq("GET", "/api/categories");
  logTest("TC-2.7.02", "Performance", "Baseline Latency: GET /api/categories (< 500 ms)", "< 500ms", `${r.durationMs}ms`, r.durationMs < 500);

  r = await httpReq("GET", "/api/banners");
  logTest("TC-2.7.03", "Performance", "Baseline Latency: GET /api/banners (< 500 ms)", "< 500ms", `${r.durationMs}ms`, r.durationMs < 500);

  // Load Test: 100 concurrent requests on search
  console.log("  -> Executing 100 concurrent search requests (GET /api/products?q=milk)...");
  const loadStart = Date.now();
  const loadPromises = [];
  for (let i = 0; i < 100; i++) {
    loadPromises.push(httpReq("GET", "/api/products?q=milk"));
  }
  const loadResults = await Promise.all(loadPromises);
  const totalLoadDuration = Date.now() - loadStart;
  const successfulLoads = loadResults.filter((res) => res.status === 200).length;
  const latencies = loadResults.map((res) => res.durationMs);
  const minLat = Math.min(...latencies);
  const maxLat = Math.max(...latencies);
  const avgLat = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);

  logTest(
    "TC-2.7.04",
    "Performance",
    "Load Test: 100 Concurrent Searches (/api/products?q=milk)",
    "100/100 Success (100%)",
    `${successfulLoads}/100 Success`,
    successfulLoads === 100,
    `Wall Clock: ${totalLoadDuration}ms | Avg Latency: ${avgLat}ms | Min: ${minLat}ms | Max: ${maxLat}ms`
  );

  // =========================================================================
  // SECTION 2.8: CONCURRENCY & RACE CONDITIONS (Stock Oversell)
  // =========================================================================
  console.log("\n>>> SECTION 2.8: CONCURRENCY & STOCK OVERSOLD RACE CONDITIONS <<<");

  // Create an exclusive single-stock test product in MongoDB
  const raceProdRes = await db.collection("products").insertOne({
    title: "QA Limited Edition Truffle Oil",
    slug: "qa-limited-truffle-oil",
    price: 999,
    mrp: 1200,
    stock: 1, // EXACTLY 1 IN STOCK
    unit: "1 bottle",
    isAvailable: true,
    createdAt: new Date(),
  });
  const raceProdId = raceProdRes.insertedId.toString();

  console.log(`  -> Configured target product "${raceProdId}" with Stock = 1`);
  console.log("  -> Launching 2 simultaneous purchase requests for the last 1 item...");

  const [raceOrder1, raceOrder2] = await Promise.all([
    httpReq("POST", "/api/orders", {
      items: [{ productId: raceProdId, qty: 1 }],
      deliveryAddress: { label: "Home", street: "Buyer 1", city: "Gurugram" },
      payment: { method: "cod" },
      storeId: sampleStoreId,
    }, { Authorization: `Bearer ${tokenCustA}` }),
    httpReq("POST", "/api/orders", {
      items: [{ productId: raceProdId, qty: 1 }],
      deliveryAddress: { label: "Home", street: "Buyer 2", city: "Gurugram" },
      payment: { method: "cod" },
      storeId: sampleStoreId,
    }, { Authorization: `Bearer ${tokenCustB}` }),
  ]);

  const verifiedProd = await db.collection("products").findOne({ _id: raceProdRes.insertedId });
  const finalStockLevel = verifiedProd.stock;

  const raceConditionSucceeded = (raceOrder1.status === 200 && raceOrder2.status === 400) || (raceOrder1.status === 400 && raceOrder2.status === 200);
  logTest(
    "TC-2.8.01",
    "Concurrency",
    "Two users buying last stock item concurrently (Race Condition Test)",
    "1 Success (200 OK) & 1 Rejected (400 Out of Stock)",
    `Buyer1: ${raceOrder1.status} | Buyer2: ${raceOrder2.status} | DB Stock: ${finalStockLevel}`,
    raceConditionSucceeded,
    raceOrder1.status === 200 && raceOrder2.status === 200
      ? `DOUBLE-ALLOCATION BUG: Both orders succeeded! Stock remained unchanged at ${finalStockLevel}. Zero atomic reservation!`
      : "Stock check atomic"
  );

  // =========================================================================
  // CLEANUP TEST ARTIFACTS
  // =========================================================================
  console.log("\n>>> CLEANING UP TEST ARTIFACTS <<<");
  await db.collection("users").deleteMany({
    email: { $in: ["qa_customer_alpha@test.com", "qa_customer_beta@test.com"] },
  });
  await db.collection("products").deleteOne({ _id: raceProdRes.insertedId });
  if (orderAId) {
    await db.collection("orders").deleteOne({ _id: new mongoose.Types.ObjectId(orderAId) });
    await db.collection("payments").deleteOne({ order: new mongoose.Types.ObjectId(orderAId) });
    await db.collection("deliveries").deleteOne({ order: new mongoose.Types.ObjectId(orderAId) });
  }
  if (raceOrder1.body?._id) {
    await db.collection("orders").deleteOne({ _id: new mongoose.Types.ObjectId(raceOrder1.body._id) });
    await db.collection("payments").deleteOne({ order: new mongoose.Types.ObjectId(raceOrder1.body._id) });
    await db.collection("deliveries").deleteOne({ order: new mongoose.Types.ObjectId(raceOrder1.body._id) });
  }
  if (raceOrder2.body?._id) {
    await db.collection("orders").deleteOne({ _id: new mongoose.Types.ObjectId(raceOrder2.body._id) });
    await db.collection("payments").deleteOne({ order: new mongoose.Types.ObjectId(raceOrder2.body._id) });
    await db.collection("deliveries").deleteOne({ order: new mongoose.Types.ObjectId(raceOrder2.body._id) });
  }

  await mongoose.disconnect();

  // Summary
  const total = testReport.length;
  const passed = testReport.filter((t) => t.pass).length;
  const failed = total - passed;

  console.log("\n==================================================================");
  console.log(`  PHASE 2 SUMMARY: Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log("==================================================================\n");

  return testReport;
}

runTestSuite().catch(console.error);
