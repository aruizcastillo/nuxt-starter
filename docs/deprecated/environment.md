# Superseded environment configuration

2026-09-09 20:31 — Private Nuxt runtime overrides replace unprefixed names

The initial scaffold used unprefixed database, Better Auth and Google environment names, and Drizzle read the database URL with a TypeScript non-null assertion. Private Nuxt configuration uses matching `NUXT_*` runtime overrides and on-use validation. Do not assign private values from differently named variables at build time.

The former rule against duplicate database URL variables is also superseded: Nuxt uses `NUXT_DATABASE_URL`, while Neon manages `DATABASE_URL` and `DATABASE_URL_UNPOOLED`. Kit's former use of `NUXT_DATABASE_URL` is replaced by the direct `DATABASE_URL_UNPOOLED`. See the [current database configuration](../current/database.md#environment-convention).

2026-09-10 14:48 — Abandoned separate local environment strategy

Neon CLI initially populated `.env.local` with development branch variables. The project abandoned that separate local-environment strategy and standardized on `.env` for local development so Nuxt and Drizzle tooling use a predictable default environment file. Explicit Neon development pulls target `.env` with `--file .env`; `.env.local` is no longer used. See the [current environment convention](../current/database.md#environment-convention).

2026-09-10 14:38 — Simplified Kit configuration supersedes command detection

The former `process.argv` command detection and CLI Zod URL validation are superseded. Kit reads `DATABASE_URL_UNPOOLED` and conditionally includes credentials, delegating command requirements to Kit itself. Preserve Nuxt runtime validation separately.
