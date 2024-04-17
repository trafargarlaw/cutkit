import { env } from '@/env'
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./server/db/schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})