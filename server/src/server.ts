// server.ts (Node.js + TypeScript)
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { createProxyServer } from "./proxy";
import sessionRoutes from "./routes/sessions";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use("/api/sessions", sessionRoutes);

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tailapi", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("✅ Connected to MongoDB");
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });

    // Start Proxy
    createProxyServer();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
})();
