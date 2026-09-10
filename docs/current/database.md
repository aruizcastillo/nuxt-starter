# Database foundation

2026-09-10 01:57 — Neon HTTP client and migration procedure

`server/database/clients/neon.ts` exports `createDatabase(databaseUrl: string): NeonHttpDatabase`. It constructs `drizzle({ client: neon(databaseUrl) })` with the installed Neon 1.1.0 and Drizzle ORM 1.0.0-rc.4. This matches the [official Neon integration](https://orm.drizzle.team/docs/connect-neon) and the installed RC.4 types. It creates no persistent pool, tables, migrations or module-global client. Constructing the client does not execute a query.

Server consumers obtain `useRuntimeConfig(event)`, validate it with `parseDatabaseConfig`, and pass its `databaseUrl` to the factory. Runtime lookup stays at the call site. No current application route consumes the client; no public database probe or startup query exists. Keep database imports under `server/` and never return driver errors or connection objects to clients.

The selected transport is HTTP for one-shot queries. It does not support interactive `db.transaction(callback)`. Phase 3 will add Relations v2 to the factory with the generated auth schema and retain the Better Auth adapter's default `transaction: false`. No auth integration is implemented here.

## Development target

2026-09-10 02:36 — Repository linked to Neon development branch

Maintainer-reported setup (no Neon command or live query was run for this documentation update):

| Setting | Current value |
| --- | --- |
| Local CLI | `neon@4.14.3`, invoked with `pnpm exec neon ...` |
| Project | `ancient-water-37006854` |
| Active branch | `dev` |
| Branch ID | `br-green-sky-zadolgsg` |
| Repository link | `.neon` |
| Local development environment | `.env` (the previous `.env.local` is absent) |

2026-09-10 14:15 — Final local environment convention

| Location | Purpose |
| --- | --- |
| `.env` | Local development only; loaded by default by Nuxt and the existing Drizzle dotenv integration. Current `NEON_BRANCH` is `dev`. |
| `.env.example` | Committed template: variable names with empty values and no secrets. All values are currently empty, including `NEON_BRANCH`; use `dev` locally. |
| `.env.production` | Optional local-only production reference, ignored and untracked. Never load it by default, commit it, or use it as deployment configuration. |
| Vercel environment configuration | Authoritative values for Preview and Production, scoped separately. |
| `.env.local` | Not used by the final convention and currently absent. Do not introduce a second automatically loaded local source. |

`NUXT_DATABASE_URL` is the private Nuxt runtime override and mirrors Neon’s pooled `DATABASE_URL`. Neon manages `DATABASE_URL`, `DATABASE_URL_UNPOOLED` (direct) and `NEON_BRANCH`. Both URL names remain intentional; there is no build-time alias mapping. The direct URL is designated for migration tooling. **Pending implementation:** `drizzle.config.ts` still reads `NUXT_DATABASE_URL` for connecting commands; it has not yet switched migration access to `DATABASE_URL_UNPOOLED`.

The current `.env` contains matching pooled `NUXT_DATABASE_URL`/`DATABASE_URL` and a direct `DATABASE_URL_UNPOOLED`; all three URLs request TLS. `.env.production` has the same arrangement for its production-labelled reference. Values were inspected without printing credentials; labels and URL structure do not constitute live target or permission verification.

The installed Neon CLI 4.14.3 help confirms `--file` selects the destination and preserves non-Neon lines. For a future explicit development pull, use:

```sh
pnpm exec neon env pull --project-id ancient-water-37006854 --branch dev --file .env --env DATABASE_URL --env DATABASE_URL_UNPOOLED --env NEON_BRANCH
```

The variable allowlist restricts the pull to the database variables and branch label. After pulling, explicitly synchronize `NUXT_DATABASE_URL` with the new pooled `DATABASE_URL`; Neon does not manage that Nuxt key. Do not pull a production/preview branch into `.env`. This command was verified through installed CLI help, not executed.

Nuxt and Drizzle retain their default `.env` loading. `.env.production` is not automatically loaded by this project's Nuxt/Drizzle setup; do not select it with dotenv flags, source it into a shell, or add loader scripts for it. Existing process variables can override file values, so local shells must not carry production credentials. Built deployment output receives its variables from the deployment environment rather than these local files.

A gitignored plaintext production reference still risks exposure through backups/sync, explicit loading, copying, or forced Git inclusion. It is permitted as a local reference under the stated constraints, but an encrypted password-manager entry is the safer place for production values; a names-only reference avoids keeping another plaintext copy. Vercel remains authoritative either way.

The installed skills are `neon`, `neon-postgres`, `neon-postgres-branches` and `neon-object-storage`, installed with `pnpm exec neon skills`. Use that same command if additional Neon skills are needed later. Skill availability does not mean Object Storage or other Neon services are integrated.

Authentication remains self-hosted Better Auth; Neon Auth is intentionally unused. Do not run or introduce `neon config init`, `neon.ts`, `neon deploy` or `@neon/config`.

Project and branch selection are now recorded. Region, database/role identifiers, isolation from production data, schema emptiness, migration privileges and live connectivity still need verification when implementation resumes. Keep credentials out of documentation and logs; production runtime and elevated migration credentials remain separate Phase 9 concerns.

To rotate development credentials, select the exact project/branch/role and reset that role's password in Neon, then replace the local connection URL. Resetting credentials interrupts connections; verify the target first. See [Neon's role password operation](https://api-docs.neon.tech/reference/resetprojectbranchrolepassword).

When implementation resumes, run a one-off server-side ``db.execute(sql`select 1`)`` through the factory and validated URL. Use a bounded diagnostic process, catch failures without printing the raw driver error, and record only success/failure. Verify missing settings, wrong credentials and an unreachable endpoint separately. Inspect the target's existing schema and role privileges with read-only queries; do not create test/domain tables to prove connectivity. These live checks remain pending.

## Migration procedure

Drizzle Kit 1.0.0-rc.4 owns migration generation and metadata. Its installed types and `generate --help`/`migrate --help` confirm the existing configuration and commands. Keep:

- Schema: `server/database/schema/*.ts`.
- Migrations: `server/database/migrations`.
- Scripts: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`.

The production workflow is **generate → review SQL and metadata → commit all generated artifacts → migrate**. Before migration, identify the project/branch/endpoint in Neon and compare the selected database/role with the intended target. Confirm backups/recovery arrangements and review destructive statements and data transformations. The final convention assigns migration credentials to `DATABASE_URL_UNPOOLED`; the current Kit consumer still needs that change before this convention is fully implemented. Kit loads dotenv outside Nuxt and does not share a runtime abstraction with the application.

Let RC.4 generate its own directory and metadata format; do not hand-author snapshots or assume the old 0.x journal layout. Never rewrite a migration already applied to a shared environment. Fix mistakes with reviewed forward migrations. `db:push` is development-only. Do not migrate during requests, imports, builds or function cold starts.

Phase 3 owns initial auth schema generation and the first migration. Acceptance requires reviewing and committing every generated artifact, replaying against an isolated empty target, and verifying that corrective changes use forward migrations. No schema or migration was generated or applied in Phase 2 implementation work so far.

References: [Kit generate](https://orm.drizzle.team/docs/drizzle-kit-generate), [Kit migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate).


## Validation

2026-09-10 02:00 — Local database foundation checks

- `pnpm lint` and `pnpm typecheck`: passed.
- Offline check: missing `NUXT_DATABASE_URL` fails with the variable name only; constructing the typed HTTP client with a disposable URL makes zero network requests.
- Imports/client assets: no database imports in `app/` or `shared/` (the latter is absent); the generated production client contains no database factory/driver or private configuration keys.
- Schema/migrations: no schema files or migration directory were created. No DDL, persistent pool, public probe or automatic migration was added.
- `pnpm test:run`: exit 1 because no test files exist, as expected by the roadmap; this is not a passing test suite.
- Live development connectivity, remote schema emptiness, migration-role permissions, wrong credentials and unreachable-endpoint checks: not yet run against the configured development target. Offline checks do not establish these results.

2026-09-10 02:06 — Production build verified

`pnpm build` passed with Nitro `node-server` after retrying outside the sandbox. The first attempt failed during dependency tracing with `EPERM` reading the user-directory link; no source workaround was introduced. Non-fatal Rolldown plugin-timing, Zod annotation and Vue/VueUse export-deprecation warnings remain.


2026-09-10 14:15 — Environment review only

Confirmed file presence, branch labels, URL roles/TLS, empty template values, and Git ignore/untracked status for local environment files. Read `pnpm exec neon env pull --help` to verify destination and variable selection. No environment files, application code or tooling configuration were changed; no credentials were printed, Neon variables pulled, database queries run or deployment settings changed. The explicit provider path `server/database/clients/neon.ts` is retained by project decision. Earlier build/test results remain historical; application checks were not rerun for documentation-only work.
