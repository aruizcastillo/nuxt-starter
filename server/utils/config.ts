import { z } from 'zod'

const databaseSchema = z.object({
  databaseUrl: z.url({ protocol: /^postgres(ql)?$/, hostname: /.+/ }),
})

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

// Call only when initializing database functionality, with useRuntimeConfig(event).
export function parseDatabaseConfig(config: unknown) {
  return parseSettings(databaseSchema, config)
}

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
    googleClientId: z.string().trim().default(''),
    googleClientSecret: z.string().trim().default(''),
  }).superRefine((value, ctx) => {
    if (Boolean(value.googleClientId) !== Boolean(value.googleClientSecret)) {
      ctx.addIssue({ code: 'custom', path: [value.googleClientId ? 'googleClientSecret' : 'googleClientId'], message: 'Required with its partner' })
    }
  })
  return parseSettings(schema, config)
}

// An absent pair is allowed until email functionality is enabled in Phase 4.
export function parseEmailConfig(config: unknown) {
  const schema = z.object({
    resendApiKey: z.string().trim().default(''),
    emailFrom: z.string().trim().default(''),
  }).superRefine((value, ctx) => {
    if (Boolean(value.resendApiKey) !== Boolean(value.emailFrom)) {
      ctx.addIssue({ code: 'custom', path: [value.resendApiKey ? 'emailFrom' : 'resendApiKey'], message: 'Required with its partner' })
    }
    if (value.emailFrom) {
      const address = value.emailFrom.match(/^[^<>\r\n]+ <([^<>\r\n]+)>$/)?.[1] ?? value.emailFrom
      if (!z.email().safeParse(address).success) {
        ctx.addIssue({ code: 'custom', path: ['emailFrom'], message: 'Invalid sender' })
      }
    }
  })
  return parseSettings(schema, config)
}
