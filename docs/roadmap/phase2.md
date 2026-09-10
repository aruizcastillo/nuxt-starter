# Phase 2 — Database foundation

## Goal

Connect the server to an isolated Neon database and establish the migration procedure without inventing application tables.

## Preconditions

- Phase 1's private runtime configuration and Node/pnpm baseline are complete. Recheck its resolved-version inventory.
- Access to the existing Neon project and its isolated `dev` branch is available.
- Relevant installed versions: Neon 1.1.0 and Drizzle ORM/Kit 1.0.0-rc.4. Installed `neon-http/driver.d.ts` accepts `drizzle({ client, relations })`; the adapter's 1.7.3 PostgreSQL implementation supports operations without interactive transactions.

## 1. Provision an isolated Neon development database.

- [x] Reuse the existing isolated `dev` branch/database as instructed. Its London (`aws-eu-west-2`) endpoint and empty user schema are verified; align Vercel compute with that region in Phase 9. No production records or new branch were copied during this work.
- [x] Record the project, branch, database and role identifiers in local operational notes, excluding passwords. Keep TLS credentials local; retain Neon-managed `DATABASE_URL`/`DATABASE_URL_UNPOOLED` alongside `NUXT_DATABASE_URL` under the current duplication decision.
- [x] Confirm the selected role can perform the development migration workflow. Distinguish application access from the elevated migration role when configuring production in Phase 9; do not grant administrative rights merely for ordinary runtime queries.
- [x] Document how to obtain/reset development credentials and how to identify the target before any future mutation. Test and preview isolation are formalized in Phases 7/9.

## 2. Establish the server-only Drizzle connection using the supported Neon integration.

- [x] Create `server/database/clients/neon.ts` with an explicitly typed factory accepting the validated database URL. Import `neon` from `@neondatabase/serverless` and `drizzle` from `drizzle-orm/neon-http`; construct `drizzle({ client: neon(databaseUrl) })`. Keep Nuxt runtime lookup at the server call site. [Drizzle Neon integration](https://orm.drizzle.team/docs/connect-neon).
- [x] Use HTTP for this starter's queries; it does not need a persistent WebSocket pool. In Phase 3 leave the Better Auth adapter's `transaction` option false, its documented default. HTTP does not implement interactive `db.transaction(callback)`; do not enable it accidentally. Revisit the driver only if a reproduced requirement needs atomic multi-operation transactions.
- [x] Keep all database imports under `server/`. Pass the generated Relations v2 configuration into this factory in Phase 3; do not add empty user/domain tables now.
- [x] Avoid request/session data in module globals. Reuse only safe connection configuration/client objects if useful; do not cache users, cookies or query results. No repository/service interface is needed for a single Drizzle connection.

## 3. Confirm connectivity without exposing credentials or database code to the client.

- [x] Run a one-off server-side `db.execute(sql\`select 1\`)` using the validated development URL. Keep the probe outside the public API; do not leave an unauthenticated database diagnostics endpoint deployed.
- [x] Verify wrong credentials, an unreachable endpoint and a missing setting produce bounded, sanitized errors. Do not print the driver error object if it includes the connection string.
- [x] Inspect imports and a production client bundle for database code or private configuration. Confirm `app/` and `shared/` do not import `server/database/clients/neon.ts`.
- [x] Record successful connectivity without saving query credentials or adding network probes to every server startup.

## 4. Establish the reviewed, version-controlled migration workflow.

- [x] Retain existing scripts: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`. Document that production uses generate → SQL/metadata review → commit → migrate. [Kit generate](https://orm.drizzle.team/docs/drizzle-kit-generate), [Kit migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate).
- [x] Verify configuration against installed Kit RC types/help before use. Let RC.4 create its own migration directory/metadata format; do not prescribe the older 0.x journal layout or hand-author snapshots.
- [x] Document pre-migration target checks, review of destructive SQL, and the requirement to commit all generated migration artifacts. Never rewrite a migration already applied to a shared environment.
- [x] Keep `db:push` explicitly development-only. Do not run migrations during Nitro request handling, module import, build, or function cold starts.
- [x] Leave initial schema generation and the first migration to Phase 3. Describe replay against an empty target and forward corrective migrations as the acceptance criteria for that phase.

## Phase verification

- [x] Prove connectivity to the isolated development target and confirm there are still no invented domain tables.
- [x] Confirm only server files can access the connection and that no persistent pool, runtime DDL or public probe was introduced.
- [x] Run `pnpm lint`, `pnpm typecheck` and `pnpm build`; explain any failures. Record the expected absence of tests until Phase 3 rather than treating an empty suite as passing.

2026-09-10 14:37 — Phase 2 complete. The existing development database, server-only connection and migration workflow are verified. See [database setup and validation](../current/database.md).

## Completed state

The server can query Neon through a small HTTP Drizzle client. The repository retains its schema/migration paths, and the documented migration workflow is ready for Better Auth's schema in Phase 3.
