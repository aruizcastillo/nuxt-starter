import 'dotenv/config'
import { createAuth } from './options'
import { createDatabase } from '../database/clients/neon'
import { parseAuthConfig, parseDatabaseConfig } from '../utils/config'

const settings = parseAuthConfig({
  betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.NUXT_BETTER_AUTH_URL,
  googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
}, process.env.NODE_ENV === 'development')
const { databaseUrl } = parseDatabaseConfig({ databaseUrl: process.env.NUXT_DATABASE_URL })

export const auth = createAuth(settings, createDatabase(databaseUrl))
