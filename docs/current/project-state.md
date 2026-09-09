# Project state

## Current baseline

2026-09-09 20:04 — Initial repository baseline

The repository is a pre-Phase-1 Nuxt starter: a public UI shell and development tooling are present; database, authentication and account functionality are not implemented. The source agrees with the version baseline and implementation boundaries in the [roadmap](../roadmap/roadmap.md). No blocking baseline inconsistency was found; the repository is ready to begin Phase 1. This is a local repository baseline, not evidence of provisioned services or production readiness. Timestamp uses Europe/Madrid.

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

The repository has a pnpm lockfile (format 9.0) and workspace settings, but no `packageManager`, `engines` or Node version file. This review used Node 26.8.1 and pnpm 12.3.4. Installed Nuxt requires Node `^22.19.0 || ^24.11.0 || >=26.0.0`; that is a package constraint, not a verified deployment runtime. Phase 1 plans Node 24 (at least 24.11.0) and verification of pnpm before pinning it. That pair and a fresh frozen installation remain unverified.

`pnpm-workspace.yaml` allows dependency build scripts for esbuild, unrs-resolver and vue-demi, and contains a release-age exception for `@lucide/vue@1.42.0`. `postinstall` runs `nuxt prepare` to generate Nuxt tooling files.

### Architecture

- `app/` holds the universal application: root component, one default layout, the index page, application components, UI primitives and CSS. Nuxt's `@`/`~` aliases resolve here; `@@`/`~~` resolve to the repository root.
- `server/database/schema/` exists locally but is empty. There are no server handlers, middleware, plugins, database clients or auth modules. Empty directories are not tracked by Git and need not exist in a fresh clone.
- `shared/` is an established boundary for deliberately shared safe code, but does not yet exist. There are no application composables, plugins, route middleware, state stores or service/repository layers.
- `i18n/locales/` owns translation JSON. `public/` serves the favicon, robots file and static sitemap. `test/unit/` and `test/nuxt/` are empty local placeholders.
- [AGENTS.md](../../AGENTS.md) and `.agents/skills/` govern implementation. `skills-lock.json` records skill provenance; roadmap files describe future work, not completed integrations.

### Configuration

**Nuxt/build:** `nuxt.config.ts` enables Nuxt ESLint, shadcn-nuxt and i18n, development tools, global CSS and Tailwind's Vite plugin. SSR is not disabled. Compatibility date is `2025-07-15`. Head defaults supply the starter title, description, English language and favicon; the app reactively replaces the HTML language with the active locale. There are no custom route rules, runtime configuration keys or explicit Nitro deployment preset. Scripts expose development, production build, static generation and preview. Vercel-first is the intended deployment architecture; no CI workflow or repository deployment configuration currently establishes it.

**TypeScript:** root `tsconfig.json` references Nuxt's generated app, server, shared and Node projects. Generated configurations are strict, with unchecked indexed access enabled and library checking skipped. App coverage includes `app/`, i18n and Nuxt test directories; server/shared projects own their corresponding boundaries. `typescript.nodeTsConfig.include` additionally covers `drizzle.config.ts`, `vitest.config.ts` and `test/unit/**/*.ts` alongside Nuxt's tooling defaults. New test locations such as planned e2e/helpers need their inclusion checked when introduced. Typecheck is a separate script, not a build or CI gate automatically enforced by this repository.

**ESLint:** the flat config composes `.nuxt/eslint.config.mjs` with stylistic rules enabled. The sole project-added ignore is `.agents/skills/**`; application UI components remain linted. The resolved base also honors `.gitignore` and ignores dependency/build directories, `.vercel`, `.netlify` and `public`. Lint does not constitute validation of public XML, CSS or Markdown content.

**Environment:** `.env.example` contains empty `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Drizzle tooling is the only current consumer, loading dotenv and reading `DATABASE_URL!`; the assertion is not runtime validation. There is no application settings parser, email configuration or local/preview/production contract. `.env` and `.env.*` are ignored except `.env.example`. Phase 1's private `NUXT_*` contract is planned and has not replaced these names.

**i18n:** English and Spanish use `no_prefix`, with English as default, cookie detection through `i18n_redirected` and `redirectOn: 'root'`. Locale `file` entries load JSON from `i18n/locales/`, matching the [10.6.0 file-based loading convention](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations). Both files have matching key structure. There is no custom Vue I18n config, explicit message fallback policy, locale switcher or localized SEO setup. The shell uses translated app/navigation labels; the homepage and external link remain hardcoded placeholders.

### UI foundation

`components.json` records the shadcn-vue New York style, neutral CSS variables, TypeScript, Geist Sans metadata and Lucide icons. Generated-style component source and barrel exports live in `app/components/ui/`; `app/lib/utils.ts` supplies `cn()` using clsx and tailwind-merge. Installed shadcn-nuxt defaults register barrel exports with the `Ui` prefix. No standalone shadcn-vue CLI is pinned in the manifest.

Existing components cover buttons/groups, cards, badges, avatars, inputs/labels/fields, items, dropdown menus, scroll areas, separators, skeletons, spinners, tooltips and the Sonner toaster. `UiPageContainer` provides project-specific width/gap composition. Reka owns primitive behavior and prop/event forwarding; VueUse is directly imported where needed. The header uses button `as-child` composition around a link, and field errors expose alert semantics. `UiInput` supports an `inputRef` callback for future form focus handling. Interactive accessibility has not been comprehensively browser-tested.

Tailwind 4 is CSS-first: `main.css` imports Tailwind, animation CSS and topic stylesheets, maps semantic tokens through `@theme inline`, and defines a data-attribute dark variant. There is no Tailwind 3 config or separate PostCSS setup. Light/dark and soft/bold/sharp token presets exist, but `app.vue` fixes light theme/color-scheme and provides no theme/style control or persistence. Typography defaults to Geist and loads Google Fonts through external CSS; fonts are not self-hosted. The app mounts a top-center toaster globally.

### Validation and testing

vee-validate 5 beta and Zod 4 are installed, but there are no application forms, schemas or server input validators. Field components are UI infrastructure, not a completed validation integration.

Vitest defines two projects: `unit` uses Node and `test/unit/**/*.{test,spec}.ts`; `nuxt` uses `defineVitestProject`, the Nuxt environment and `test/nuxt/**/*.{test,spec}.ts`. Nuxt Test Utils defaults to happy-dom. `.nuxtrc` records its 4.2.0 setup. No test files, coverage gate, live-server project, browser harness or test environment settings exist. `pnpm test` is watch mode; `pnpm test:run` is the one-shot command. No `passWithNoTests` exception is configured, so an empty suite correctly exits nonzero.

### Database and authentication

`drizzle.config.ts` configures PostgreSQL, schema glob `./server/database/schema/*.ts` and migration output `./server/database/migrations`. These configuration fields are supported by installed Kit RC.4 types. Scripts expose `db:generate`, `db:migrate`, `db:push` and `db:studio`. No schema, relations or migration artifacts exist; the migration output directory has not been created. The established production workflow is schema → generate → review/commit → migrate; push is reserved for appropriate development use.

Neon, Better Auth and its Drizzle adapter are dependencies only. No connection, adapter instance, auth server/client, catch-all handler, session consumer, authorization, OAuth, email delivery or account screen exists. No database/provider connectivity or migration was exercised. External provisioning cannot be inferred from the repository. Planned Neon HTTP and Better Auth Relations v2 integration belong to Phases 2–3; they are not an implemented compatibility claim.

### Current implementation state

The sole application page `/` renders “Hello Nuxt!” inside the default layout with a header/home link, empty placeholder SVG logo, external `example.com` link and localized footer app name/current year. There is no product data or protected content. The app shell has reactive locale metadata and fixed light styling. `robots.txt` permits crawling and advertises a static sitemap; both contain the placeholder `nuxt-auth-starter.com` origin. The README is still the generic Nuxt template with multiple package-manager instructions.

### Established decisions

Preserve Nuxt 4 runtime boundaries and generated tooling, shadcn-owned paths, Tailwind 4 CSS conventions and `no_prefix` localization. Better Auth will own sessions, Drizzle will own relational persistence, and server authorization remains authoritative. Keep the foundation small: Axios and Pinia are absent as direct dependencies, as are competing auth/ORM systems and speculative infrastructure. The detailed policies and exact-version verification rules remain in AGENTS.md rather than being duplicated here.

### Known pending work

Begin with [Phase 1 — Environment and configuration](../roadmap/phase1.md): reproducible runtime/package-manager setup, private settings validation, consistent environment naming and environment-specific guidance. The [roadmap](../roadmap/roadmap.md) then sequences database/auth, sessions and UI, meaningful tests/CI, security, deployment and reusable-starter cleanup. Tests accompany implementation; later quality gates do not imply production readiness now. Deferred domain features and infrastructure remain deferred.

The roadmap overview and phase plans live under `docs/roadmap/`; their references resolve to that directory. The generic README and unpinned runtime are acknowledged Phase 1 work, not evidence that the planned configuration already exists. No superseded implementation warrants deprecated documentation.

2026-09-09 20:10 — Roadmap references corrected

Phase 1 now links to the roadmap overview in its own directory. The previously recorded path discrepancy is resolved; readiness to begin Phase 1 is unchanged. Local documentation links and diff whitespace checks passed. Application validation results below remain those of the initial baseline; they were not rerun for this documentation-only correction.

### Validation snapshot

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
