# Superseded environment configuration

2026-09-09 20:31 — Private Nuxt runtime overrides replace unprefixed names

The initial scaffold used unprefixed database, Better Auth and Google environment names, and Drizzle read the database URL with a TypeScript non-null assertion. Phase 1 replaced them with matching private `NUXT_*` runtime overrides and on-use validation. Do not reintroduce duplicate aliases or assign private values from differently named variables at build time.

Nuxt runtime consumers use `useRuntimeConfig(event)`; Drizzle Kit loads dotenv and reads `NUXT_DATABASE_URL` directly outside Nuxt. The current contract and environment-specific setup are in [README](../../README.md) and [project state](../current/project-state.md).
