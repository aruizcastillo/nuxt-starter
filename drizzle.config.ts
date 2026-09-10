import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema/*.ts',
  out: './server/database/migrations',
  ...(databaseUrl && {
    dbCredentials: {
      url: databaseUrl,
    },
  }),
})
