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
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// Defensive security headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

app.use(express.json());

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

async function start() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/blinkit";
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
