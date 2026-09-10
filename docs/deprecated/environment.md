# Superseded environment configuration

2026-09-09 20:31 — Private Nuxt runtime overrides replace unprefixed names

The initial scaffold used unprefixed database, Better Auth and Google environment names, and Drizzle read the database URL with a TypeScript non-null assertion. Phase 1 replaced them with matching private `NUXT_*` runtime overrides and on-use validation. The original no-duplicate-alias rule is superseded by the explicit exception below. Do not assign private values from differently named variables at build time.

Nuxt runtime consumers use `useRuntimeConfig(event)`; Drizzle Kit loads dotenv and reads `NUXT_DATABASE_URL` directly outside Nuxt. The current contract and environment-specific setup are in [README](../../README.md) and [project state](../current/project-state.md).


2026-09-10 02:36 — Neon-managed database variable exception

Neon now pulls `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and `NEON_BRANCH=dev` into `.env.local`. The maintainer explicitly requires keeping `DATABASE_URL` and `NUXT_DATABASE_URL` duplicated for now. Do not remove, rename or normalize either. Nuxt and Drizzle consumers still use `NUXT_DATABASE_URL`; automatic alias mapping and environment-loader changes are not implemented. This exception does not restore the old auth/Google variable names.
