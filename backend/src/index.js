import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

// simple health check
app.get("/health", (req, res) => {
  const state = mongoose.connection && mongoose.connection.readyState;
  res.json({ status: "ok", mongoState: state });
});

app.use("/api", routes);

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
