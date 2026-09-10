# Project state

## Current baseline

2026-09-09 20:31 — Phase 1 environment and configuration

Phases 1–2 are complete, including live development database and build/runtime privacy checks. The public UI shell remains the only application page functionality; the server-only Neon HTTP factory can query the verified `dev` database. Authentication and account integrations remain unimplemented. Timestamps use Europe/Madrid. Current database evidence and validation results are in [database state](database.md).

### Stack

Resolved direct dependencies agree between `pnpm-lock.yaml` and the installed packages:

| Area | Resolved versions |
| --- | --- |
| Framework | Nuxt 4.5.2, Vue 3.5.42, Vue Router 5.3.1 |
| Database/auth packages | Drizzle ORM and Kit 1.0.0-rc.4, Neon serverless 1.1.0, Better Auth and its Drizzle adapter 1.7.3 |
| UI | Tailwind CSS and `@tailwindcss/vite` 4.3.3, shadcn-nuxt 2.8.2, Reka UI 2.10.4, `@lucide/vue` 1.42.0, vue-sonner 2.0.9 |
| UI utilities | VueUse 14.4.0, class-variance-authority 0.7.1, clsx 2.1.1, tailwind-merge 3.6.0, tw-animate-css 1.4.0 |
| Localization/forms | `@nuxtjs/i18n` 10.6.0, vee-validate 5.0.0-beta.1, Zod 4.5.4 |
| Static checks | TypeScript 6.0.3, vue-tsc 3.3.11, ESLint 10.10.0, `@nuxt/eslint` 1.17.0 |
| Tests/tooling | Vitest 4.1.11, `@nuxt/test-utils` 4.2.0, `@vue/test-utils` 2.5.0, happy-dom 20.14.0, dotenv 17.4.2 |

The build resolves Nitro 2.13.4 and Vite 8.2.2 transitively. The private package uses ESM. Manifest constraints remain authoritative: most are caret ranges; Drizzle ORM/Kit and shadcn-nuxt are exact pins. In particular, vee-validate is declared as `^5.0.0-beta.0` but resolves to beta.1. TypeScript 6 and Drizzle RC are intentional version lines.

Node 24 is the supported development/CI/Vercel major (`>=24.11.0 <25`); `.nvmrc` records tested Node 24.21.0 and `packageManager` pins pnpm 12.3.4. A frozen installation with that pair passed, including `postinstall`/`nuxt prepare`. Pinning pnpm required its package-manager dependency metadata in the lockfile; the application dependency graph is unchanged. The final frozen install did not change the locked graph. Deployment runtime selection remains Phase 9 work.

`pnpm-workspace.yaml` allows dependency build scripts for esbuild, unrs-resolver and vue-demi, and contains a release-age exception for `@lucide/vue@1.42.0`. `postinstall` runs `nuxt prepare` to generate Nuxt tooling files.

### Architecture

- `app/` holds the universal application: root component, one default layout, the index page, application components, UI primitives and CSS. Nuxt's `@`/`~` aliases resolve here; `@@`/`~~` resolve to the repository root.
- `server/database/schema/` exists locally but is empty. Server source includes `server/utils/config.ts` and the typed HTTP factory in `server/database/clients/neon.ts`; there are no server handlers, middleware, plugins or auth modules. Empty directories are not tracked by Git and need not exist in a fresh clone.
- `shared/` is an established boundary for deliberately shared safe code, but does not yet exist. There are no application composables, plugins, route middleware, state stores or service/repository layers.
- `i18n/locales/` owns translation JSON. `public/` serves the favicon, robots file and static sitemap. `test/unit/` and `test/nuxt/` are empty local placeholders.
- [AGENTS.md](../../AGENTS.md) and `.agents/skills/` govern implementation. `skills-lock.json` records skill provenance; roadmap files describe future work, not completed integrations.

### Configuration

**Nuxt/build:** `nuxt.config.ts` enables Nuxt ESLint, shadcn-nuxt and i18n, development tools, global CSS and Tailwind's Vite plugin. SSR is not disabled. Compatibility date is `2025-07-15`. Head defaults supply the starter title, description, English language and favicon; the app reactively replaces the HTML language with the active locale. Seven empty private runtime keys declare the environment contract; none is public. There are no custom route rules or explicit Nitro deployment preset. Scripts expose development, production build, static generation and preview. Vercel-first is the intended deployment architecture; no CI workflow or repository deployment configuration currently establishes it.

**TypeScript:** root `tsconfig.json` references Nuxt's generated app, server, shared and Node projects. Generated configurations are strict, with unchecked indexed access enabled and library checking skipped. App coverage includes `app/`, i18n and Nuxt test directories; server/shared projects own their corresponding boundaries. `typescript.nodeTsConfig.include` additionally covers `drizzle.config.ts`, `vitest.config.ts` and `test/unit/**/*.ts` alongside Nuxt's tooling defaults. New test locations such as planned e2e/helpers need their inclusion checked when introduced. Typecheck is a separate script, not a build or CI gate automatically enforced by this repository.

**ESLint:** the flat config composes `.nuxt/eslint.config.mjs` with stylistic rules enabled. The sole project-added ignore is `.agents/skills/**`; application UI components remain linted. The resolved base also honors `.gitignore` and ignores dependency/build directories, `.vercel`, `.netlify` and `public`. Lint does not constitute validation of public XML, CSS or Markdown content.

**Environment:** `.env.example` declares `NUXT_DATABASE_URL`, `NUXT_BETTER_AUTH_SECRET`, `NUXT_BETTER_AUTH_URL`, the `NUXT_GOOGLE_CLIENT_ID`/`NUXT_GOOGLE_CLIENT_SECRET` pair and the `NUXT_RESEND_API_KEY`/`NUXT_EMAIL_FROM` pair. Nuxt owns runtime overrides; Drizzle Kit separately loads dotenv and reads `DATABASE_URL_UNPOOLED`. Neon-managed `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and `NEON_BRANCH=dev` now live in the local development `.env`; `.env.local` is absent. Retain pooled `DATABASE_URL` and its matching private runtime override `NUXT_DATABASE_URL`. The final convention assigns direct `DATABASE_URL_UNPOOLED` to migrations, but Drizzle Kit now reads `DATABASE_URL_UNPOOLED` directly and conditionally supplies credentials. Nuxt and Drizzle load `.env` by default, with no automatic alias mapping. `.env` and `.env.*` remain ignored except `.env.example`.

`server/utils/config.ts` contains small Zod 4 parsers for database, auth and email settings. Future consumers pass `useRuntimeConfig(event)` only when initializing the relevant functionality; auth consumers pass `import.meta.dev` to allow HTTP on localhost during development. No eager startup validation or service integration exists. Database URLs require a PostgreSQL protocol and host. Auth requires a secret of at least 32 non-padding characters and a canonical origin; HTTPS is mandatory outside localhost development. Randomness is an operational requirement, not claimed by length validation. Google and email pairs reject partial settings while permitting an absent pair during foundation work; Phase 4 must enforce enabled-method requirements. Errors contain variable names without values or raw Zod issues.

README documents Node/pnpm setup, environment scopes, isolated service targets and independent secrets, stable controlled HTTPS preview origins, exact future OAuth callbacks, the same-origin `/api/auth` plan, and the selected Resend HTTP/fetch plan. Resend keys and a verified sender are justified configuration placeholders, not an implemented sender. Nuxt dev/build and local preview load `.env`; standalone built output requires process environment variables. Vercel environment provisioning remains Phase 9.

**i18n:** English and Spanish use `no_prefix`, with English as default, cookie detection through `i18n_redirected` and `redirectOn: 'root'`. Locale `file` entries load JSON from `i18n/locales/`, matching the [10.6.0 file-based loading convention](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations). Both files have matching key structure. There is no custom Vue I18n config, explicit message fallback policy, locale switcher or localized SEO setup. The shell uses translated app/navigation labels; the homepage and external link remain hardcoded placeholders.

### UI foundation

`components.json` records the shadcn-vue New York style, neutral CSS variables, TypeScript, Geist Sans metadata and Lucide icons. Generated-style component source and barrel exports live in `app/components/ui/`; `app/lib/utils.ts` supplies `cn()` using clsx and tailwind-merge. Installed shadcn-nuxt defaults register barrel exports with the `Ui` prefix. No standalone shadcn-vue CLI is pinned in the manifest.

Existing components cover buttons/groups, cards, badges, avatars, inputs/labels/fields, items, dropdown menus, scroll areas, separators, skeletons, spinners, tooltips and the Sonner toaster. `UiPageContainer` provides project-specific width/gap composition. Reka owns primitive behavior and prop/event forwarding; VueUse is directly imported where needed. The header uses button `as-child` composition around a link, and field errors expose alert semantics. `UiInput` supports an `inputRef` callback for future form focus handling. Interactive accessibility has not been comprehensively browser-tested.

Tailwind 4 is CSS-first: `main.css` imports Tailwind, animation CSS and topic stylesheets, maps semantic tokens through `@theme inline`, and defines a data-attribute dark variant. There is no Tailwind 3 config or separate PostCSS setup. Light/dark and soft/bold/sharp token presets exist, but `app.vue` fixes light theme/color-scheme and provides no theme/style control or persistence. Typography defaults to Geist and loads Google Fonts through external CSS; fonts are not self-hosted. The app mounts a top-center toaster globally.

### Validation and testing

vee-validate 5 beta and Zod 4 are installed, but there are no application forms, schemas or server input validators. Field components are UI infrastructure, not a completed validation integration.

Vitest defines two projects: `unit` uses Node and `test/unit/**/*.{test,spec}.ts`; `nuxt` uses `defineVitestProject`, the Nuxt environment and `test/nuxt/**/*.{test,spec}.ts`. Nuxt Test Utils defaults to happy-dom. `.nuxtrc` records its 4.2.0 setup. No test files, coverage gate, live-server project, browser harness or test environment settings exist. `pnpm test` is watch mode; `pnpm test:run` is the one-shot command. No `passWithNoTests` exception is configured, so an empty suite correctly exits nonzero.

### Database and authentication

`drizzle.config.ts` configures PostgreSQL, schema glob `./server/database/schema/*.ts` and migration output `./server/database/migrations`. These configuration fields are supported by installed Kit RC.4 types. Credentials are included only when `DATABASE_URL_UNPOOLED` is nonempty; Drizzle Kit owns credential requirements for each command. There is no command detection or custom CLI Zod parser. Scripts expose `db:generate`, `db:migrate`, `db:push` and `db:studio`. No schema, relations or migration artifacts exist; the migration output directory has not been created. The established production workflow is schema → generate → review/commit → migrate; push is reserved for appropriate development use.

Neon and Drizzle now back the server-only `createDatabase` HTTP factory described in [database state](database.md). Live connectivity to the existing development branch has been verified with read-only queries. Better Auth and its adapter remain dependencies only; no auth server/client, adapter instance, catch-all handler, session consumer, authorization, OAuth, email delivery or account screen exists. Database identity, ownership/privileges and an empty user schema were verified; no migrations or production queries were run. The HTTP factory is verified against installed Neon 1.1.0 and Drizzle RC.4 types and official integration documentation. Relations v2/auth integration remains Phase 3 work.

### Current implementation state

The sole application page `/` renders “Hello Nuxt!” inside the default layout with a header/home link, empty placeholder SVG logo, external `example.com` link and localized footer app name/current year. There is no product data or protected content. The app shell has reactive locale metadata and fixed light styling. `robots.txt` permits crawling and advertises a static sitemap; both contain the placeholder `nuxt-auth-starter.com` origin. README now documents the supported setup and environment contract.

### Established decisions

Preserve Nuxt 4 runtime boundaries and generated tooling, shadcn-owned paths, Tailwind 4 CSS conventions and `no_prefix` localization. Better Auth will own sessions, Drizzle will own relational persistence, and server authorization remains authoritative. Keep the foundation small: Axios and Pinia are absent as direct dependencies, as are competing auth/ORM systems and speculative infrastructure. The detailed policies and exact-version verification rules remain in AGENTS.md rather than being duplicated here.

### Known pending work

Continue with [Phase 3 — Better Auth server and initial migration](../roadmap/phase3.md) as the next unchecked roadmap step. No auth schema, migration or Better Auth integration has been started. Current database results and environment conventions are in [database state](database.md).

### Historical baseline validation snapshot (before Phase 1)

Local review on Node 26.8.1 / pnpm 12.3.4; application source and dependency declarations were unchanged.

| Check actually run | Result |
| --- | --- |
| Direct installed-package/lockfile comparison | All declared direct packages matched their lockfile resolutions; no reinstall was needed for these checks. Fresh installation was not tested. |
| `pnpm lint` | Passed, exit 0. |
| `pnpm typecheck` | Passed, exit 0. |
| `pnpm test:run` | Exit 1: no test files found in either project. Expected current absence, not passing tests or an architectural defect. |
| `pnpm build` | Passed, exit 0; Nitro `node-server` output. Non-fatal Rolldown plugin-timing warning and Node DEP0155 trailing-slash export warnings involving Vue/VueUse dependencies. |
| Built-server HTTP smoke check (`node .output/server/index.mjs`, temporary loopback port) | Passed for English and Spanish requests using locale cookies and language headers: HTTP 200, expected HTML language, translated navigation label, homepage greeting and light theme. Server stopped after the checks. |

Database mutations, provider calls and deployment were not run. The HTTP checks verify server-rendered HTML, not browser hydration, visual behavior or full keyboard accessibility; those remain unverified.


2026-09-10 01:57 — Phase 2 database code and workflow

Added the minimal server-only Neon HTTP factory and documented the existing migration workflow in [database state](database.md). At that implementation checkpoint, no local database URL or Neon API access was available. The setup reported below supersedes that blocker; live checks have not resumed. No domain/auth tables, migration artifacts, persistent pool or public diagnostics endpoint were added. Validation results are recorded in the database state document.


2026-09-10 02:36 — Neon setup and environment state recorded

Local Neon CLI 4.14.3 is available through `pnpm exec neon ...`. The repository is linked via `.neon` to project `ancient-water-37006854`, branch `dev` (`br-green-sky-zadolgsg`); branch variables were originally pulled into `.env.local` (superseded by the final `.env` convention below). Keep the Neon-managed database variables alongside `NUXT_DATABASE_URL` without normalization. See [database state](database.md#development-target) for the environment boundary and installed Neon skills.

Neon Auth is not used: authentication remains self-hosted Better Auth. `neon config init`, `neon.ts`, `neon deploy` and `@neon/config` are excluded. This update records maintainer-provided context only; no Neon commands, database checks, configuration changes or later-phase implementation were performed.


2026-09-10 14:15 — Development defaults and production reference policy

`.env` is local/dev, `.env.example` contains only empty template values, and `.env.local` is absent. `.env.production` is an optional ignored, untracked local reference only: never commit it, load it by default or treat it as deployment configuration. Vercel environment settings are authoritative for actual Preview/Production. Plaintext reference files can leak through backups/sync or accidental explicit use; an encrypted password manager is safer for values.

Neon CLI 4.14.3 supports pulling the explicit `dev` branch into `.env` with `--file .env` and a database-variable allowlist. It preserves unrelated lines but does not synchronize `NUXT_DATABASE_URL`; keep that mirror aligned explicitly. The verified command, variable responsibilities and now-completed Drizzle migration-variable change are recorded in [database state](database.md#development-target). Keep the provider-specific factory path `server/database/clients/neon.ts`.

This was a documentation-only review: inspected environment structure and ignore status without exposing values, and read CLI help. No environment files or runtime/tooling configuration changed; no live database or deployment verification occurred.


2026-09-10 14:35 — Phase 2 development database verified

Reused the existing Neon dev branch and its London endpoint. The current Drizzle factory passes read-only connectivity, identity and catalog checks; no user relations exist. Development migration privileges were checked without DDL. Wrong credentials, unreachable endpoint and missing configuration produce sanitized diagnostic failures. Production was untouched. See [database state](database.md) for exact target identifiers and validation evidence.


2026-09-10 14:37 — Phase 2 complete

Lint, typecheck and production build passed. Built Nuxt runtime configuration successfully queried the verified dev database through the current client; Kit targets the same development database directly. Homepage rendering and client assets passed privacy checks. `pnpm test:run` still exits 1 because no tests exist; that expected Phase 2 limitation is recorded, not counted as passing tests. All Phase 2 roadmap items are complete; Phase 1 overview checkboxes were synchronized with its established completed state. Next is Phase 3: configure Better Auth and the Drizzle adapter. No production connection, schema generation, migrations or auth integration occurred.
