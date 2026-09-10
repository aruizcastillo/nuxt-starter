import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { authTables, type createDatabase } from '../database/clients/neon'
import type { parseAuthConfig } from '../utils/config'

// Pure Better Auth factory.
// Environment loading and database creation stay outside this function, making the auth configuration reusable from Nuxt runtime, tooling and tests.
export function createAuth(settings: ReturnType<typeof parseAuthConfig>, database: ReturnType<typeof createDatabase>) {
  return betterAuth({
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema: authTables,
      transaction: false,
    }),
    baseURL: settings.betterAuthUrl,
    secret: settings.betterAuthSecret,
    basePath: '/api/auth',
    // Phase 4 connects verification delivery and Google policy/credentials.
    emailAndPassword: { enabled: true },
    // Cookie caching is explicitly disabled so session reads use the database.
    session: { cookieCache: { enabled: false } },
  })
}
