# Nuxt Auth Starter

## Project overview

A reusable Nuxt 4 starter with a public application UI and a server-side Better Auth foundation backed by Drizzle and Neon Postgres.

The current implementation includes the Better Auth server endpoint, core auth schema, and reviewed initial migration. It does not yet include sign-in/account pages, email verification or password-recovery delivery, Google OAuth, protected application pages, or a production-ready authentication policy. Those remain planned work in the [roadmap](docs/roadmap/roadmap.md).

## Requirements

- Git.
- Node.js `>=24.11.0 <25`. The tested version in `.nvmrc` is `24.21.0`.
- pnpm `12.3.4`, matching the `packageManager` field in `package.json`.
- A Neon account and an isolated Postgres branch/database for development.

Use the same Node major in local development, CI, and deployment. With POSIX nvm:

```sh
nvm install
nvm use
```

With nvm-windows in PowerShell:

```powershell
nvm install 24.21.0
nvm use 24.21.0
```

Install the pinned pnpm release:

```sh
npm install --global pnpm@12.3.4
```

## Quick start

1. Clone the repository and enter it:

   ```sh
   git clone https://github.com/aruizcastillo/nuxt-auth-starter.git
   cd nuxt-auth-starter
   ```

2. Install exactly the locked dependency graph:

   ```sh
   pnpm install --frozen-lockfile
   ```

   Installation also runs `nuxt prepare` through the `postinstall` script.

3. Create the local environment file:

   ```sh
   cp .env.example .env
   ```

   In PowerShell, use `Copy-Item .env.example .env` instead.

4. Create or select an isolated development database in Neon, then complete `.env` as described in [Environment configuration](#environment-configuration) and [Database setup](#database-setup).

5. Apply the committed migrations:

   ```sh
   pnpm db:migrate
   ```

6. Start the development server:

   ```sh
   pnpm dev
   ```

7. Open `http://localhost:3000`.

The public shell can start with empty service values, but the database and auth endpoint are not usable until the required local values below are configured and the migration is applied.

## Environment configuration

Keep local secrets in `.env`; environment files other than `.env.example` are ignored by Git. Do not commit credentials.

The minimal usable local database/auth setup requires `NUXT_DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NUXT_BETTER_AUTH_SECRET`, and `NUXT_BETTER_AUTH_URL`. The template contains these database and auth settings:

| Variable | Requirement |
| --- | --- |
| `NUXT_DATABASE_URL` | Required for server database/auth requests. Use the Neon pooled connection string. |
| `DATABASE_URL` | Not read by the application or Drizzle Kit. Configure it when using Neon tooling that expects the standard pooled URL, and keep it identical to `NUXT_DATABASE_URL`. |
| `DATABASE_URL_UNPOOLED` | Required by Drizzle Kit for migrations and other database commands. Use the direct connection string for the same database. |
| `NEON_BRANCH` | Not read by the application or migration command. Set it to the selected branch name when using target-aware Neon/test tooling. |
| `NUXT_BETTER_AUTH_SECRET` | Required when the auth endpoint initializes. Use an independently generated random secret of at least 32 characters. |
| `NUXT_BETTER_AUTH_URL` | Required when the auth endpoint initializes. Use `http://localhost:3000` locally. Non-local origins must use HTTPS. |

Generate a local auth secret with Node:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

The following pairs are reserved for Phase 4 and should remain blank for the current implementation:

| Variables | When required |
| --- | --- |
| `NUXT_GOOGLE_CLIENT_ID`, `NUXT_GOOGLE_CLIENT_SECRET` | Both become required when Google OAuth is implemented and enabled. Never configure only one. |
| `NUXT_RESEND_API_KEY`, `NUXT_EMAIL_FROM` | Both become required when email delivery is implemented and enabled. `NUXT_EMAIL_FROM` must be a verified sender in `address@example.com` or `App <address@example.com>` form. |

All `NUXT_*` settings are private Nuxt runtime configuration. For local `dev`, `build`, and `preview`, Nuxt loads `.env`. A standalone built server receives these values from its process environment.

## Database setup

1. In Neon, create a project if needed and create or select a development branch that is isolated from production data. See [Neon branching](https://neon.com/docs/introduction/branching) and [connection guidance](https://neon.com/docs/connect/connect-from-any-app).
2. Obtain both connection strings for the same branch, database, and role:
   - pooled connection for `DATABASE_URL` and `NUXT_DATABASE_URL`;
   - direct connection for `DATABASE_URL_UNPOOLED`.
3. Set `NEON_BRANCH` to the selected branch name and confirm every database variable targets that branch before migrating.
4. Apply the migration already committed under `server/database/migrations/`:

   ```sh
   pnpm db:migrate
   ```

Drizzle Kit loads `.env` directly and reads `DATABASE_URL_UNPOOLED`; it does not use Nuxt runtime configuration.

For future schema changes, use the reviewed workflow:

1. Change the typed schema under `server/database/schema/`.
2. Run `pnpm db:generate`.
3. Review and commit every generated SQL and metadata artifact.
4. Run `pnpm db:migrate` against the explicitly selected target.

Do not rewrite an applied migration. `pnpm db:push` is for appropriate development use only and is not the production migration workflow. See [database documentation](docs/current/database.md#migration-procedure) for operational detail.

## Authentication setup

Set `NUXT_BETTER_AUTH_SECRET` and `NUXT_BETTER_AUTH_URL`, configure the database variables, and apply the migration. The Better Auth handler is then mounted at `/api/auth` and stores users, sessions, accounts, and verification records in Postgres.

This is the completed server foundation from Phase 3, not a finished authentication product. Basic email/password behavior exists for backend lifecycle validation, but there is no auth UI, email delivery, verified-email access policy, recovery flow, Google provider, protected application route, or production hardening yet. Do not advertise or deploy those Phase 4+ capabilities as complete. See [current auth state](docs/current/auth.md) and [Phase 4](docs/roadmap/phase4.md).

## Development and validation commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Nuxt development server. |
| `pnpm lint` | Run ESLint across the repository. |
| `pnpm typecheck` | Run Nuxt/Vue TypeScript checks. |
| `pnpm exec vitest run --project unit` | Run database-independent configuration tests. |
| `pnpm test` | Run Vitest in watch mode. |
| `pnpm test:run` | Run all tests once, including live database auth tests. See the constraint below. |
| `pnpm build` | Create the production build. |
| `pnpm preview` | Preview a completed production build locally. |
| `pnpm generate` | Generate a static build when that output mode is appropriate. |
| `pnpm db:generate` | Generate a migration from schema changes. |
| `pnpm db:migrate` | Apply committed migrations using `DATABASE_URL_UNPOOLED`. |
| `pnpm db:push` | Push schema changes directly for deliberate development-only use. |
| `pnpm db:studio` | Open Drizzle Studio for the configured database. |

Run the reproducible local checks with:

```sh
pnpm lint
pnpm typecheck
pnpm exec vitest run --project unit
pnpm build
```

`pnpm test:run` additionally mutates and cleans up test accounts on a specifically allowlisted disposable Neon branch. The current allowlist is repository-instance-specific, so a new clone cannot run the live suite merely by supplying an arbitrary database URL. It fails rather than skipping the integration tests or risking another database. Maintainers can follow [the explicit test-target procedure](docs/current/auth.md#test-target-and-commands); making arbitrary fresh-clone test targets safely configurable remains future test/CI work.

There is currently no Markdown-specific validation script.

## Deployment

The intended hosting path is Vercel with Neon, but the repository does not yet contain a completed or verified production deployment workflow. Vercel runtime selection, isolated Preview/Production databases, a controlled migration step, provider callbacks, email delivery, production security checks, and recovery procedures remain [Phase 9 work](docs/roadmap/phase9.md).

For deployment experiments, configure the same required environment variables separately for Vercel Development, Preview, and Production scopes. Use independent database targets and auth secrets, set `NUXT_BETTER_AUTH_URL` to each stable canonical HTTPS origin, and do not treat `pnpm preview` as a Vercel Preview deployment. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

No reproducible production deployment can be claimed until the Phase 9 checklist is completed.

## Further documentation

- [Current project state](docs/current/project-state.md) — implemented stack, architecture, compatibility notes, and validation evidence.
- [Database foundation](docs/current/database.md) — database integration, environment conventions, migration policy, and operational evidence.
- [Better Auth server](docs/current/auth.md) — current auth implementation, schema generation, live-test boundary, and validation evidence.
- [Roadmap](docs/roadmap/roadmap.md) — completed phases, incomplete functionality, dependencies, and production definition of done.
- [Phase 3 validation record](docs/reference/phase-3-auth-database-validation.md) — detailed migration and auth-server verification history.
