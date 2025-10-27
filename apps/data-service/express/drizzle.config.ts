import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

// Try .env.local first, then fall back to .env (for production)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
