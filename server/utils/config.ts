import { z } from 'zod'

// Database runtime configuration.
const databaseSchema = z.object({
  databaseUrl: z.url({ protocol: /^postgres(ql)?$/, hostname: /.+/ }),
})

// Shared parser for private configuration used by Nuxt runtime and tooling.
// Nuxt runtime callers should pass values from useRuntimeConfig(event).
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
// Call only when initializing database functionality, with useRuntimeConfig(event).
export function parseDatabaseConfig(config: unknown) {
  return parseSettings(databaseSchema, config)
}

// Better Auth runtime configuration.
// The caller supplies import.meta.dev; HTTPS is mandatory outside local development.
export function parseAuthConfig(config: unknown, development = false) {
  const origin = z.url({ protocol: /^https?$/, hostname: /.+/ }).refine((value) => {
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
      ctx.addIssue({ code: 'custom', path: [value.googleClientId ? 'googleClientSecret' : 'googleClientId'], message: 'Required with its partner' })
    }
  })
  return parseSettings(schema, config)
}

// Optional email configuration for sending emails via Resend.
export function parseEmailConfig(config: unknown) {
  const schema = z.object({
    resendApiKey: z.string().trim().default(''),
    emailFrom: z.string().trim().default(''),
  }).superRefine((value, ctx) => {
    // Resend credentials must always be configured as a pair.
    if (Boolean(value.resendApiKey) !== Boolean(value.emailFrom)) {
      ctx.addIssue({ code: 'custom', path: [value.resendApiKey ? 'emailFrom' : 'resendApiKey'], message: 'Required with its partner' })
    }
    // Accept both "email@example.com" and "Name <email@example.com>".
    if (value.emailFrom) {
      const address = value.emailFrom.match(/^[^<>\r\n]+ <([^<>\r\n]+)>$/)?.[1] ?? value.emailFrom
      if (!z.email().safeParse(address).success) {
        ctx.addIssue({ code: 'custom', path: ['emailFrom'], message: 'Invalid sender' })
      }
    }
  })
  return parseSettings(schema, config)
}
