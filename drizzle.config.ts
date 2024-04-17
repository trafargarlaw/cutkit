import { env } from "@/env";
import { type Config } from "drizzle-kit";

import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
