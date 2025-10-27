import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import cors from "cors";

import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import statusRouter from "./routes/status";
import { verifyApiKey } from "./middleware/apiKey";
import { db } from "./db/client";
import { sql } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to only allow requests from frontend
const allowedOrigins = [
  "http://localhost:3000", // Development
  "http://localhost:5173", // Vite dev server
  process.env.FRONTEND_URL, // Production (if set)
  process.env.FRONTEND_URL?.replace("://", "://www."), // www version
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check - checks API and database connection
const healthCheckHandler = async (_req: express.Request, res: express.Response) => {
  const startTime = Date.now();

  // Check database connection
  let dbStatus = "unknown";
  let dbError = null;

  try {
    await db.execute(sql`SELECT 1`);
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "disconnected";
    dbError = error instanceof Error ? error.message : "Unknown error";
    console.error("[Health] Database check failed:", error);
  }

  const responseTime = Date.now() - startTime;

  // If database is down, return 503 Service Unavailable
  if (dbStatus === "disconnected") {
    return res.status(503).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      error: dbError,
      responseTime: `${responseTime}ms`,
    });
  }

  // Everything is ok
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    responseTime: `${responseTime}ms`,
  });
};

// Health endpoint - checks if API and database are responding
// Supports both GET and HEAD requests for UptimeRobot compatibility
app.get("/health", healthCheckHandler);
app.head("/health", healthCheckHandler);

// Public routes (no API key required)
app.use("/api/auth", authRouter);
app.use("/api/status", statusRouter);

// Protected routes (API key required)
app.use("/api/posts", verifyApiKey, postsRouter);
app.use("/api/comments", verifyApiKey, commentsRouter);
app.use("/api/users", verifyApiKey, usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
