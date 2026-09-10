import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'

// The server caller validates the URL with parseDatabaseConfig(useRuntimeConfig(event)).
export function createDatabase(databaseUrl: string): NeonHttpDatabase {
  return drizzle({ client: neon(databaseUrl) })
}
