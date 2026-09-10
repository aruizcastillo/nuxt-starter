import { neon } from '@neondatabase/serverless'
import { defineRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { account, authRelations, session, user, verification } from '../schema/auth'

export const authTables = { user, session, account, verification }
const relations = { ...defineRelations(authTables), ...authRelations }

// The server caller validates the URL with parseDatabaseConfig(useRuntimeConfig(event)).
export function createDatabase(databaseUrl: string) {
  return drizzle({ client: neon(databaseUrl), relations })
}
