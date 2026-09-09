import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { z } from 'zod'

// Kit runs outside Nuxt. Only commands that connect need credentials;
// generate/check/up/export must remain usable without a database.
const connects = ['migrate', 'push', 'pull', 'studio'].includes(process.argv[2] ?? '')
const databaseUrl = connects
  ? z.url({ protocol: /^postgres(ql)?$/, hostname: /.+/ }).safeParse(process.env.NUXT_DATABASE_URL)
  : undefined

if (databaseUrl && !databaseUrl.success) {
  throw new Error('Missing or invalid NUXT_DATABASE_URL: expected a PostgreSQL URL')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema/*.ts',
  out: './server/database/migrations',
  ...(databaseUrl?.success ? { dbCredentials: { url: databaseUrl.data } } : {}),
})
