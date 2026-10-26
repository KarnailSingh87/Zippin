import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// Defensive security & cache eviction headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'"
  );
  // Auto-evict stale browser cache on dynamic API calls & refresh
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use(express.json());

// Real-Time Server-Sent Events (SSE) / WebSocket Push Notification Stream
// (Architecture supports WebSocket & Socket.io pub-sub for live order & rider dispatch)
const sseClients = new Set();
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", timestamp: Date.now() })}\n\n`);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

export function broadcastRealtimeEvent(event, data) {
  const payload = `data: ${JSON.stringify({ event, data, timestamp: Date.now() })}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

// Automated Cache Cleanup Janitor
// Automatically cleans temp memory and stale cache entries every 30 minutes
const cacheStore = new Map();
export function purgeStaleCache(maxAgeMs = 30 * 60 * 1000) {
  const now = Date.now();
  let deletedCount = 0;
  for (const [key, value] of cacheStore.entries()) {
    if (now - value.timestamp > maxAgeMs) {
      cacheStore.delete(key);
      deletedCount++;
    }
  }
  return deletedCount;
}

setInterval(() => {
  const cleaned = purgeStaleCache();
  if (cleaned > 0) {
    console.log(`[Cache Janitor] Auto-purged ${cleaned} expired cache entries.`);
  }
}, 15 * 60 * 1000); // Check every 15 minutes

// Manual / Programmatic Cache Purge Endpoint
app.post("/api/cache/purge", (req, res) => {
  const purged = cacheStore.size;
  cacheStore.clear();
  res.json({ message: "Server cache cleared successfully", purgedItems: purged });
});

// simple health check
app.get("/health", (req, res) => {
  const state = mongoose.connection && mongoose.connection.readyState;
  res.json({ status: "ok", mongoState: state });
});

app.use("/api", routes);

// Global Error Handler (Handles Mongoose CastError, ValidationErrors gracefully)
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid resource identifier: ${err.value}` });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 4000;

const DEFAULT_MONGO_URI = "mongodb+srv://mk2251842_db_user:30y3SYcdhns1eige@cluster0.bdczfs1.mongodb.net/zippin?retryWrites=true&w=majority";

async function start() {
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (dbErr) {
    console.error("❌ MongoDB connection error:", dbErr.message);
    console.error("👉 Please verify your MONGO_URI, database user credentials, and that Network Access allows 0.0.0.0/0 in MongoDB Atlas.");
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
