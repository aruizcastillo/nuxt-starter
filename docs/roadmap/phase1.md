# Phase 1 — Environment and configuration

## Goal

Make installation and private runtime configuration reproducible before connecting services. Completed implementation items are checked below; validation evidence is recorded in `docs/current/project-state.md`. The numbered headings preserve every checklist item in the [roadmap](./roadmap.md); execute substeps in order.

## Planning baseline (historical)

- Read `AGENTS.md`, the `nuxt-starter` skill and relevant official skills before implementation. Recheck `package.json`, `pnpm-lock.yaml` and installed types whenever versions change.
- Inspection baseline, 2026-09-09: Nuxt 4.5.2, Vue 3.5.42, Vue Router 5.3.1, Better Auth and `@better-auth/drizzle-adapter` 1.7.3, Drizzle ORM/Kit 1.0.0-rc.4, Neon 1.1.0, i18n 10.6.0, VueUse 14.4.0, Reka UI 2.10.4, shadcn-nuxt 2.8.2, Tailwind and its Vite plugin 4.3.3, vee-validate 5.0.0-beta.1, Zod 4.5.4, Vitest 4.1.11, Nuxt Test Utils 4.2.0, Vue Test Utils 2.5.0, happy-dom 20.14.0, ESLint 10.10.0, Nuxt ESLint 1.17.0, TypeScript 6.0.3, vue-tsc 3.3.11 and dotenv 17.4.2. These are resolved versions, not merely manifest ranges; vee-validate is declared as `^5.0.0-beta.0`.
- Existing `server/database/schema/`, `test/unit/` and `test/nuxt/` are empty. There are no auth handlers, schema files, migrations or actual tests. `nuxt.config.ts` has no runtime configuration. `.env.example` currently contains unprefixed database, auth and Google variables. README is the generic Nuxt template. Preserve unrelated existing work.
- Implementation choices below are project decisions, not framework mandates. No external accounts or credentials are assumed to exist.
- Evidence boundary: the Better Auth documentation identifies 1.7.3 and its key APIs were cross-checked in installed packages; Drizzle RC connection/relations were checked against RC-oriented docs and installed RC.4 types, and vee-validate against the v5 migration guide and beta types. The online version index and some Nuxt/Neon Markdown pages could not be opened through the browser tool; official indexed material and local types supplied the relevant checks. An exact compatible auth CLI release remains an explicit Phase 3 verification gate because that CLI is not installed. No external service behavior or application validation is claimed by these planning documents.

2026-09-09 20:31 — Phase 1 configuration implemented; Node 24.21.0 and pnpm 12.3.4 selected and verified. Runtime parsers are invoked by the functionality that needs them; there is no eager validation of unused services.

## 1. Document supported Node/pnpm versions and reproducible installation.

- [x] Standardize development, CI and Vercel on Node 24, at least 24.11.0. Installed Nuxt's engine range is `^22.19.0 || ^24.11.0 || >=26.0.0`; do not infer deployment support from this machine's Node 26.8.1. Vercel currently offers Node 24. [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
- [x] Validate pnpm 12.3.4 (the inspected local executable) with Node 24 and the existing lockfile before recording it in `packageManager`. Record the tested Node patch in a conventional version file and use an engine constraint that enforces the Nuxt minimum within Node 24. Do not upgrade the dependency graph to establish this baseline.
- [x] Replace README's competing install commands with the supported pnpm installation method, `pnpm install --frozen-lockfile`, `.env.example` copying, `pnpm dev` and `pnpm build`/`pnpm preview`. Explain that `postinstall` runs `nuxt prepare`. [pnpm installation](https://pnpm.io/installation).
- [x] Preserve `pnpm-workspace.yaml` build allowances and its existing release-age exception; document their purpose without broadening them. Preserve the generated ESLint base and TypeScript project references.

## 2. Connect private runtime configuration and validate required settings.

- [x] Add empty, serializable private keys to `nuxt.config.ts`: `databaseUrl`, `betterAuthSecret`, `betterAuthUrl`, `googleClientId`, `googleClientSecret`, `resendApiKey` and `emailFrom`. Keep credentials out of `runtimeConfig.public`. Use matching runtime environment overrides, not build-time assignments from differently named variables. [Nuxt configuration](https://nuxt.com/docs/4.x/getting-started/configuration).
- [x] Add a small server-only Zod settings parser in `server/utils/config.ts`; runtime callers pass `useRuntimeConfig(event)`. Validate a PostgreSQL URL, a random auth secret of at least 32 characters, and a canonical app origin with no credentials, query or fragment. Require HTTPS outside localhost development.
- [x] Treat Google ID/secret as a pair and email key/sender as a pair. Allow them to be absent during foundation work, but reject partial configuration. The Phase 4 plan retains missing enabled-method settings as an explicit startup/auth-initialization error; never silently disable a required production method.
- [x] Provide callable parsers for each functionality; later server consumers validate when that functionality initializes, before an outbound operation. Keep parsing independent of network access so `nuxt prepare`, schema generation and pure tests do not connect to Neon or email. Invalid settings must identify the variable name without echoing its value or Zod's raw input.
- [x] Keep config schemas server-only. Do not create a global client config store or read `process.env` throughout runtime application code.

## 3. Keep database tooling and application environment names consistent.

- [x] Rename the example's variables and update every consumer together: `DATABASE_URL` → `NUXT_DATABASE_URL`, `BETTER_AUTH_SECRET` → `NUXT_BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` → `NUXT_BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID` → `NUXT_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` → `NUXT_GOOGLE_CLIENT_SECRET`. This deliberate change enables Nuxt runtime overrides; retain the later explicit Neon database-variable duplication exception recorded in [database state](../current/database.md#development-target); auth/Google names remain unchanged.
- [x] Update `drizzle.config.ts` to load `dotenv/config`, validate `process.env.NUXT_DATABASE_URL` only for connecting Kit commands, and remove its non-null assertion. Keep `dialect: 'postgresql'`, `schema: './server/database/schema/*.ts'` and `out: './server/database/migrations'`.
- [x] Document that Drizzle Kit runs outside Nuxt, so it reads the same named environment variable directly. Later Better Auth configuration receives explicit `secret` and `baseURL` from private runtime config because renamed variables are not Better Auth's automatic defaults.
- [x] Search source and documentation for the previous names; remove stale examples. Retain `.gitignore` coverage for `.env` and `.env.*` with only `.env.example` committed.

## 4. Define environment-specific configuration for local, preview and production.

- [x] Add a README environment table: local origin `http://localhost:3000`, a controlled HTTPS preview origin, and the eventual production HTTPS origin. Record separate database targets, auth secrets, Google credentials and email senders per environment without embedding real values.
- [x] Specify a stable controlled preview hostname for complete OAuth testing; arbitrary preview URLs are not automatically trusted. Google callback registration must match each origin exactly in Phase 4/9.
- [x] Describe local `.env` loading versus Vercel's Development/Preview/Production environment settings. Built production output must receive variables from its process environment; do not assume deployment reads local `.env` files. [Vercel environments](https://vercel.com/docs/environment-variables).
- [x] Keep same-origin `/api/auth` as the intended client endpoint, avoiding a public auth-base setting and cross-origin cookie configuration. Do not provision infrastructure in this phase.

## 5. Extend `.env.example` with email delivery settings when the provider is selected.

- [x] Use Resend's HTTP API as the concrete plan default, subject to the maintainer's existing provider constraints. Record the choice in README; if another provider is selected, update this phase and Phases 4/9/10 consistently before implementing email.
- [x] Add empty `NUXT_RESEND_API_KEY` and `NUXT_EMAIL_FROM` examples and describe the sender format. Document the requirement for a verified sender and controlled test recipients before Phase 4; never place working keys or personal addresses in examples.
- [x] Plan a small server-only HTTP sender using the existing fetch stack; a new SDK is unnecessary for one endpoint. Actual email sending belongs to Phase 4. [Resend send API](https://resend.com/docs/api-reference/emails/send-email).

## Phase verification

- [x] Confirm the documented Node/pnpm pair performs a frozen installation without lockfile drift and prepares Nuxt successfully.
- [ ] Exercise missing, malformed and partial settings; errors reveal names only. Verify valid runtime overrides still apply when starting previously built output.
- [ ] Inspect rendered Nuxt payload and client assets using disposable marker values; no private setting may appear there.
- [ ] Run `pnpm lint`, `pnpm typecheck` and `pnpm build`. Record `pnpm test:run` reporting no tests at this stage; do not add `passWithNoTests` or meaningless tests to manufacture a pass. Actual suites begin in Phase 3.

## Expected state after completion

Installation, environment naming and runtime validation are documented and consistent. No database connection, auth feature or email delivery has been implemented yet. Subsequent phases use the same private variable contract.
