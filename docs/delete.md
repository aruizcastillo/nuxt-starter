```ts
import { z } from 'zod'

// Database runtime configuration.
const databaseSchema = z.object({
  databaseUrl: z.url({ protocol: /^postgres(ql)?$/, hostname: /.+/ }),
})

// Shared parser for runtime configuration.
// Converts Zod field names to their corresponding NUXT_* environment variables
// so configuration errors are easier to diagnose.
function parseSettings<T>(schema: z.ZodType<T>, config: unknown): T {
  const result = schema.safeParse(config)

  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => {
      const key = String(issue.path[0])
      return `NUXT_${key.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase()}`
    }))]

    throw new Error(`Missing or invalid configuration: ${names.join(', ')}`)
  }

  return result.data
}

// Database config is parsed lazily when database functionality is initialized.
export function parseDatabaseConfig(config: unknown) {
  return parseSettings(databaseSchema, config)
}

// Better Auth runtime configuration.
// HTTPS is required outside local development.
export function parseAuthConfig(config: unknown, development = false) {
  const origin = z.url({
    protocol: /^https?$/,
    hostname: /.+/,
  }).refine((value) => {
    if (!URL.canParse(value)) return false

    const url = new URL(value)

    return (value === url.origin || value === `${url.origin}/`)
      && (url.protocol === 'https:' || (development && url.hostname === 'localhost'))
  })

  const schema = z.object({
    betterAuthSecret: z.string().min(32).refine(value => value.trim().length >= 32),
    betterAuthUrl: origin,

    // Optional until Google authentication is configured.
    googleClientId: z.string().trim().default(''),
    googleClientSecret: z.string().trim().default(''),
  }).superRefine((value, ctx) => {
    // Google credentials must always be configured as a pair.
    if (Boolean(value.googleClientId) !== Boolean(value.googleClientSecret)) {
      ctx.addIssue({
        code: 'custom',
        path: [value.googleClientId ? 'googleClientSecret' : 'googleClientId'],
        message: 'Required with its partner',
      })
    }
  })

  return parseSettings(schema, config)
}

// Email configuration remains optional until Phase 4 enables delivery.
export function parseEmailConfig(config: unknown) {
  const schema = z.object({
    resendApiKey: z.string().trim().default(''),
    emailFrom: z.string().trim().default(''),
  }).superRefine((value, ctx) => {
    // Resend credentials must always be configured as a pair.
    if (Boolean(value.resendApiKey) !== Boolean(value.emailFrom)) {
      ctx.addIssue({
        code: 'custom',
        path: [value.resendApiKey ? 'emailFrom' : 'resendApiKey'],
        message: 'Required with its partner',
      })
    }

    // Accept both "email@example.com" and "Name <email@example.com>".
    if (value.emailFrom) {
      const address = value.emailFrom.match(/^[^<>\r\n]+ <([^<>\r\n]+)>$/)?.[1]
        ?? value.emailFrom

      if (!z.email().safeParse(address).success) {
        ctx.addIssue({
          code: 'custom',
          path: ['emailFrom'],
          message: 'Invalid sender',
        })
      }
    }
  })

  return parseSettings(schema, config)
}
```

```ts
import 'dotenv/config'
import { createAuth } from './options'
import { createDatabase } from '../database/clients/neon'
import { parseAuthConfig, parseDatabaseConfig } from '../utils/config'

// Tooling entrypoint.
//
// This file runs outside Nuxt/Nitro, so it reads environment variables
// directly instead of using useRuntimeConfig().
const settings = parseAuthConfig({
  betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.NUXT_BETTER_AUTH_URL,
  googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
}, process.env.NODE_ENV === 'development')

const { databaseUrl } = parseDatabaseConfig({
  databaseUrl: process.env.NUXT_DATABASE_URL,
})

// Shared Better Auth instance used by CLI/tooling.
export const auth = createAuth(
  settings,
  createDatabase(databaseUrl),
)
```

```ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { authTables, type createDatabase } from '../database/clients/neon'
import type { parseAuthConfig } from '../utils/config'

// Pure Better Auth factory.
//
// Environment loading and database creation stay outside this function,
// making the auth configuration reusable from Nuxt runtime, tooling and tests.
export function createAuth(
  settings: ReturnType<typeof parseAuthConfig>,
  database: ReturnType<typeof createDatabase>,
) {
  return betterAuth({
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema: authTables,
      transaction: false,
    }),

    baseURL: settings.betterAuthUrl,
    basePath: '/api/auth',
    secret: settings.betterAuthSecret,

    // Phase 4 connects verification delivery and Google credentials/policy.
    emailAndPassword: {
      enabled: true,
    },

    // Sessions remain database-backed; cookie caching is intentionally disabled.
    session: {
      cookieCache: {
        enabled: false,
      },
    },
  })
}
```
