# Phase 7 — Tests and CI gates

## Goal

Complete the tests introduced during Phases 3–6 and make meaningful validation a required merge/deployment gate. This phase does not defer basic implementation testing until the end.

## Preconditions

- Phases 3–6 already contain config/schema/redirect unit tests, Nuxt component/middleware tests and live-server auth/account tests.
- Recheck Vitest 4.1.11, Nuxt Test Utils 4.2.0, Vue Test Utils 2.5.0, happy-dom 20.14.0, TypeScript 6.0.3 and the Phase 1 Node/pnpm pair.
- `vitest.config.ts` initially defines only `unit` and `nuxt`; Phase 3 adds the Node-based live-server project. Nuxt Test Utils 4.2.0 exports `e2e` and `playwright`; Playwright is an optional peer, not an installed direct project dependency. Add a browser dependency only for this concrete browser-testing requirement.

## 1. Define test-specific environment configuration.

- [ ] Document required test values in `docs/testing.md`; keep actual `.env.test` ignored. Use Phase 1's runtime variable names when starting Nuxt, with a unique test auth secret, localhost origin and isolated database URL.
- [ ] Require an explicit test database identity/allowlist before fixture cleanup or migration replay. Refuse absent configuration and development/production targets. Create an empty ephemeral branch/database for CI, or a dedicated isolated test target with serialized jobs.
- [ ] Select test email transport at the test factory/fixture boundary, never through a public production toggle or unauthenticated inbox endpoint. Keep OAuth mocks inside test fixtures; no real Google credentials are needed for ordinary deterministic CI.
- [ ] Load test environment configuration before constructing the Nuxt server and auth instance. Avoid accidentally inheriting developer `.env` credentials; use unique per-run test data and clean it in `finally`/teardown.

## 2. Cover pure validation and utilities with Vitest.

- [ ] Inventory `test/unit/` against Phase 1 settings parsing, Phase 5 safe redirects and Phase 6 validation. Add missing edge cases and meaningful expected outcomes, not tests that merely reproduce implementation expressions.
- [ ] Cover empty/whitespace names, password bounds and confirmation, invalid email, query arrays, encoded redirect attacks and partial private settings. Assert sensitive values do not appear in settings errors.
- [ ] Keep these tests in the existing Node environment with explicit imports. Do not boot Nuxt for pure schemas/helpers or introduce a new test framework.

## 3. Cover server authorization and session behavior with Nuxt-aware tests.

- [ ] Keep `test/nuxt/` for runtime composables, middleware and components using `@nuxt/test-utils/runtime`. Keep `test/e2e/` for a real Nitro server via `@nuxt/test-utils/e2e` in a separate Node project. [Nuxt test environments](https://nuxt.com/docs/4.x/getting-started/testing).
- [ ] Exercise real `/api/auth` and `/api/account` handlers with actual migrated test data for session creation, expiry, revocation, 401/403 and safe account projection. Do not substitute an always-authenticated mock for the security gate.
- [ ] Cover session lookup errors separately from guests, two independent cookie jars, concurrent SSR requests, unverified identities and forged headers/selectors.
- [ ] Keep time-sensitive unit behavior deterministic and integration lifetimes short/configured. Avoid arbitrary sleeps; wait on explicit state or controlled clock behavior where supported.

## 4. Test authentication flows, recovery links and cross-user access rejection.

- [ ] Complete sign-up → captured verification email → verification endpoint → sign-in → account → profile update → sign-out through real HTTP. Assert identity and database effects, not merely status 200.
- [ ] Complete recovery → captured reset URL → password replacement → old-password rejection → all-old-session rejection → fresh sign-in. Include missing/tampered/expired/reused tokens.
- [ ] Create users A and B and prove A cannot select B's account or mutate B through `updateUser`; verify B's persisted name and verification state remain unchanged. Do not add a new user-by-ID endpoint just to create a cross-user test.
- [ ] Test known/unknown email request responses, repeated resend and provider transport failure with deterministic transport fixtures. Keep tokens/cookies/passwords out of snapshots and CI artifacts.
- [ ] Cover Google cancellation, state mismatch and linking policy with provider-boundary mocks, while maintaining a manual real-provider smoke checklist for Phase 9. CI must not claim that a mock verifies Google's callback registration.

## 5. Verify protected-page refreshes, redirects and hydration in a browser.

- [ ] Add a compatible pinned `@playwright/test` development dependency and Chromium installation for the browser job; verify the release against Nuxt Test Utils' optional peer range. Keep it separate from happy-dom tests. Use `@nuxt/test-utils/playwright` or the documented e2e browser integration, not both competing harnesses.
- [ ] Add `playwright.config.ts`, a `test:browser` script and `test/browser/` cases. Start a production-built app with isolated test settings, wait for readiness, and close the process/fixtures after each run.
- [ ] Test anonymous direct `/account`, successful sign-in redirect, authenticated hard refresh, safe return query, sign-out/back navigation, reset landing with an existing session and session expiry in another tab.
- [ ] Capture browser console/page errors and fail on hydration mismatch. Assert protected account data is absent from guest HTML and no other user's payload leaks across sessions.
- [ ] Cover one English and one Spanish form flow, field labels, invalid-field focus and keyboard submission. Store failure traces only with short retention and scrub/avoid credential-bearing URLs and bodies.

## 6. Test migrations against an isolated empty database.

- [ ] In a dedicated CI step, provision/choose an empty permitted test target and run `pnpm db:migrate` using committed migrations only. Confirm core tables and constraints, then run again and assert no new migration is applied.
- [ ] Run auth integration tests against that migrated target. This proves the committed schema supports the current adapter instead of relying on a developer database updated by `push`.
- [ ] Run `pnpm db:generate` in a disposable checkout after tests and fail on unexpected tracked/untracked migration changes. Do not commit generated drift from CI or modify the migration under test.
- [ ] Dispose of only the per-run target after completion. Keep branch API credentials scoped to test infrastructure and never expose them to untrusted pull-request code.

## 7. Require lint, typecheck, actual tests and production build in CI.

- [ ] Create the repository-host CI workflow (for GitHub, `.github/workflows/ci.yml`) with the supported Node/pnpm versions and `pnpm install --frozen-lockfile`. Preserve the lockfile and package-manager trust/build settings.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run` and `pnpm build`, plus `pnpm test:browser`. Configure jobs so migrations precede database tests and the production build precedes browser tests.
- [ ] Fail on zero discovered tests, skipped required suites, migration drift and any command failure. Report missing test infrastructure as a failed required gate rather than a success with silent skips.
- [ ] Configure required checks/branch protection and deployment gating. Separate secret-free lint/unit checks for untrusted contributions from trusted integration execution; do not use a privileged workflow to run unreviewed fork code with secrets.
- [ ] Verify a deliberately broken auth assertion and a deliberate type error fail the expected checks, then remove those temporary failures. Record commands, test counts and manual-only checks in `docs/testing.md`.

## Phase verification

- [ ] A clean CI run discovers and passes actual unit, Nuxt, server and browser tests using migrations replayed from an empty target.
- [ ] A failure in any required command blocks merge/deployment, and untrusted code receives no protected secrets.
- [ ] Confirm no `passWithNoTests`, blanket skips, production test bypasses or leaked auth artifacts exist.

## Expected state after completion

The starter has reliable repeatable tests and mandatory CI checks. Real provider and deployment behavior remains explicitly covered by Phase 9's manual environment smoke tests.
