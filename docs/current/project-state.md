# Project state

## Current baseline

2026-09-09 20:31 — Phase 1 environment and configuration

The repository has completed Phase 1 configuration: reproducible Node/pnpm setup, private runtime keys, on-use server settings validation and documented local/preview/production conventions. The public UI shell remains the only application functionality; database, authentication and account integrations are not implemented. The next item is provisioning an isolated Neon development database in Phase 2. Timestamps use Europe/Madrid.

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
- `server/database/schema/` exists locally but is empty. The only server source is `server/utils/config.ts`; there are no server handlers, middleware, plugins, database clients or auth modules. Empty directories are not tracked by Git and need not exist in a fresh clone.
- `shared/` is an established boundary for deliberately shared safe code, but does not yet exist. There are no application composables, plugins, route middleware, state stores or service/repository layers.
- `i18n/locales/` owns translation JSON. `public/` serves the favicon, robots file and static sitemap. `test/unit/` and `test/nuxt/` are empty local placeholders.
- [AGENTS.md](../../AGENTS.md) and `.agents/skills/` govern implementation. `skills-lock.json` records skill provenance; roadmap files describe future work, not completed integrations.

### Configuration

**Nuxt/build:** `nuxt.config.ts` enables Nuxt ESLint, shadcn-nuxt and i18n, development tools, global CSS and Tailwind's Vite plugin. SSR is not disabled. Compatibility date is `2025-07-15`. Head defaults supply the starter title, description, English language and favicon; the app reactively replaces the HTML language with the active locale. Seven empty private runtime keys declare the environment contract; none is public. There are no custom route rules or explicit Nitro deployment preset. Scripts expose development, production build, static generation and preview. Vercel-first is the intended deployment architecture; no CI workflow or repository deployment configuration currently establishes it.

**TypeScript:** root `tsconfig.json` references Nuxt's generated app, server, shared and Node projects. Generated configurations are strict, with unchecked indexed access enabled and library checking skipped. App coverage includes `app/`, i18n and Nuxt test directories; server/shared projects own their corresponding boundaries. `typescript.nodeTsConfig.include` additionally covers `drizzle.config.ts`, `vitest.config.ts` and `test/unit/**/*.ts` alongside Nuxt's tooling defaults. New test locations such as planned e2e/helpers need their inclusion checked when introduced. Typecheck is a separate script, not a build or CI gate automatically enforced by this repository.

**ESLint:** the flat config composes `.nuxt/eslint.config.mjs` with stylistic rules enabled. The sole project-added ignore is `.agents/skills/**`; application UI components remain linted. The resolved base also honors `.gitignore` and ignores dependency/build directories, `.vercel`, `.netlify` and `public`. Lint does not constitute validation of public XML, CSS or Markdown content.

**Environment:** `.env.example` declares `NUXT_DATABASE_URL`, `NUXT_BETTER_AUTH_SECRET`, `NUXT_BETTER_AUTH_URL`, the `NUXT_GOOGLE_CLIENT_ID`/`NUXT_GOOGLE_CLIENT_SECRET` pair and the `NUXT_RESEND_API_KEY`/`NUXT_EMAIL_FROM` pair. Nuxt owns runtime overrides; Drizzle Kit separately loads dotenv and directly reads the same database variable. The old unprefixed aliases are not supported. `.env` and `.env.*` remain ignored except `.env.example`.

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

`drizzle.config.ts` configures PostgreSQL, schema glob `./server/database/schema/*.ts` and migration output `./server/database/migrations`. These configuration fields are supported by installed Kit RC.4 types. The CLI command gates URL validation: migrate/push/pull/studio require a valid `NUXT_DATABASE_URL`; generate/check/up/export do not. This keeps credential-free generation separate from database access without importing Nuxt config into Kit. Scripts expose `db:generate`, `db:migrate`, `db:push` and `db:studio`. No schema, relations or migration artifacts exist; the migration output directory has not been created. The established production workflow is schema → generate → review/commit → migrate; push is reserved for appropriate development use.

Neon, Better Auth and its Drizzle adapter are dependencies only. No connection, adapter instance, auth server/client, catch-all handler, session consumer, authorization, OAuth, email delivery or account screen exists. No database/provider connectivity or migration was exercised. External provisioning cannot be inferred from the repository. Planned Neon HTTP and Better Auth Relations v2 integration belong to Phases 2–3; they are not an implemented compatibility claim.

### Current implementation state

The sole application page `/` renders “Hello Nuxt!” inside the default layout with a header/home link, starter SVG logo, external `example.com` link and localized footer app name/current year. There is no product data or protected content. The app shell has reactive locale metadata and fixed light styling. `robots.txt` permits crawling and advertises a static sitemap; both contain the placeholder `nuxt-auth-starter.com` origin. README now documents the supported setup and environment contract.

### Established decisions

Preserve Nuxt 4 runtime boundaries and generated tooling, shadcn-owned paths, Tailwind 4 CSS conventions and `no_prefix` localization. Better Auth will own sessions, Drizzle will own relational persistence, and server authorization remains authoritative. Keep the foundation small: Axios and Pinia are absent as direct dependencies, as are competing auth/ORM systems and speculative infrastructure. The detailed policies and exact-version verification rules remain in AGENTS.md rather than being duplicated here.

### Known pending work

Continue with [Phase 2 — Database foundation](../roadmap/phase2.md): provision an isolated Neon development database. No database connection, auth schema generation, migration or Better Auth/email integration was performed in Phase 1. The [roadmap](../roadmap/roadmap.md) retains later phases unchecked. Superseded environment naming is recorded in [deprecated configuration](../deprecated/environment.md).

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


### Phase 1 validation

2026-09-10 01:44 — Phase 1 completed and roadmap synchronized

Configuration implementation and runtime verification ran on 2026-09-09 with Node 24.21.0 / pnpm 12.3.4. The configuration source is unchanged since those checks; subsequent logo/Open Graph commits are outside Phase 1. Final documentation records the evidence below rather than implying external integrations or deployment were tested.

| Check | Result |
| --- | --- |
| Frozen installation and `nuxt prepare` | Passed with Node 24.21.0 / pnpm 12.3.4. The pnpm pin required package-manager lock metadata; application dependency resolutions are unchanged and the final frozen install passed without further drift. |
| `pnpm lint` | Passed; rerun on 2026-09-10 during completion. |
| `pnpm typecheck` | Passed; rerun on 2026-09-10 during completion. |
| `pnpm build` | Passed on 2026-09-09 with Nitro `node-server`. Non-fatal upstream DEP0155 export warnings (Vue/VueUse) and Rollup annotation warnings in Zod were emitted. |
| On-use configuration checks | 16 missing/malformed/partial cases rejected safely and 6 valid/isolated cases passed using disposable values. Cases covered PostgreSQL protocol, secret length, HTTPS/origin restrictions, Google pairing and email pairing/sender format. |
| Drizzle CLI boundary | Missing and malformed database URLs failed before connection with the variable name and no supplied value. Generation config loaded without credentials; no schema generation or database operation was performed. |
| Previously built runtime overrides | All seven private values were overridden in fresh processes without rebuilding. A valid set also passed all three server parsers. |
| Built-server HTTP and privacy | HTTP 200 on loopback with empty settings and with disposable markers. Private keys/markers were absent from rendered HTML/payload, and markers were absent from client assets. The built Nitro app was exercised directly; no diagnostic endpoint was added. |
| `pnpm test:run` | Exit 1 on 2026-09-09: no test files found, as expected by the Phase 1 plan. This is not a passing test suite; no `passWithNoTests` setting or placeholder tests were added. |

All five Phase 1 roadmap items and its verification checklist are complete. The next unchecked item is **Phase 2: provision an isolated Neon development database**. No database implementation, auth schema generation, Better Auth integration or later-phase functionality was started. Runtime smoke checks cover SSR output and configuration privacy, not browser hydration or a Vercel deployment.
