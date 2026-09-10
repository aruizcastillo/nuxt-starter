import { describe, expect, it } from 'vitest'
import { parseAuthConfig, parseDatabaseConfig, parseEmailConfig } from '../../server/utils/config'

const auth = { betterAuthSecret: 'a'.repeat(32), betterAuthUrl: 'https://app.example.test' }

describe('private configuration', () => {
  it('accepts PostgreSQL URLs and rejects missing/non-PostgreSQL URLs without leaking values', () => {
    expect(parseDatabaseConfig({ databaseUrl: 'postgresql://user:password@localhost/db' }).databaseUrl).toContain('postgresql:')
    for (const databaseUrl of [undefined, '', 'https://private:password@example.test/db', 'postgresql:///db']) {
      expect(() => parseDatabaseConfig({ databaseUrl })).toThrow('Missing or invalid configuration: NUXT_DATABASE_URL')
    }
  })

  it('accepts canonical HTTPS origins and allows localhost HTTP only in development', () => {
    expect(parseAuthConfig(auth).betterAuthUrl).toBe(auth.betterAuthUrl)
    expect(parseAuthConfig({ ...auth, betterAuthUrl: 'http://localhost:3000' }, true).betterAuthUrl).toBe('http://localhost:3000')
    for (const betterAuthUrl of ['http://localhost:3000', 'http://example.test', 'https://app.example.test/path', 'https://user:password@app.example.test', 'https://app.example.test?query=1', 'https://app.example.test#hash']) {
      expect(() => parseAuthConfig({ ...auth, betterAuthUrl })).toThrow('NUXT_BETTER_AUTH_URL')
    }
    expect(() => parseAuthConfig({ ...auth, betterAuthUrl: 'http://example.test' }, true)).toThrow('NUXT_BETTER_AUTH_URL')
  })

  it('requires a non-padding secret of at least 32 characters', () => {
    for (const betterAuthSecret of ['', 'x'.repeat(31), ' '.repeat(32), ` ${'x'.repeat(31)}`]) {
      expect(() => parseAuthConfig({ ...auth, betterAuthSecret })).toThrow('NUXT_BETTER_AUTH_SECRET')
    }
  })

  it('permits absent provider pairs and rejects partial Google credentials', () => {
    expect(parseAuthConfig(auth).googleClientId).toBe('')
    expect(parseAuthConfig({ ...auth, googleClientId: 'id', googleClientSecret: 'secret' }).googleClientId).toBe('id')
    expect(() => parseAuthConfig({ ...auth, googleClientId: 'id' })).toThrow('NUXT_GOOGLE_CLIENT_SECRET')
    expect(() => parseAuthConfig({ ...auth, googleClientSecret: 'secret' })).toThrow('NUXT_GOOGLE_CLIENT_ID')
  })

  it('validates paired email settings and plain/named sender addresses', () => {
    expect(parseEmailConfig({})).toEqual({ resendApiKey: '', emailFrom: '' })
    for (const emailFrom of ['sender@example.test', 'Starter <sender@example.test>']) {
      expect(parseEmailConfig({ resendApiKey: 'key', emailFrom }).emailFrom).toBe(emailFrom)
    }
    expect(() => parseEmailConfig({ resendApiKey: 'key' })).toThrow('NUXT_EMAIL_FROM')
    expect(() => parseEmailConfig({ emailFrom: 'sender@example.test' })).toThrow('NUXT_RESEND_API_KEY')
    expect(() => parseEmailConfig({ resendApiKey: 'key', emailFrom: 'invalid' })).toThrow('NUXT_EMAIL_FROM')
  })
})
