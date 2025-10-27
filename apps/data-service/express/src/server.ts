import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import cors from "cors";

import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import { verifyApiKey } from "./middleware/apiKey";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Public routes (no API key required)
app.use("/api/auth", authRouter);

// Protected routes (API key required)
app.use("/api/posts", verifyApiKey, postsRouter);
app.use("/api/comments", verifyApiKey, commentsRouter);
app.use("/api/users", verifyApiKey, usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
