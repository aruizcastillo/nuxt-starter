# Phase 5 — Client sessions and page access

## Goal

Connect Better Auth's authoritative session to Nuxt SSR and navigation, with server-protected current-account data and safe redirects.

## Preconditions

- Phase 4's server policies, real handler and tests pass. Relevant versions are Nuxt 4.5.2, Better Auth 1.7.3, Vue 3.5.42 and i18n 10.6.0.
- Installed `better-auth/dist/client/vue/index.d.mts` confirms the Nuxt overload `useSession(useFetch)`. Its implementation uses a stable Nuxt fetch key and watches the Better Auth session signal. The returned SSR overload has `data`, `error` and a resolved `isPending: false`; do not assume it exposes every AsyncData method.
- Keep `no_prefix` locale routing. The chosen route contract is `/sign-in`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` and `/account`; full screens belong to Phase 6.

## 1. Protect a minimal account endpoint using server-verified identity and ownership.

- [ ] Add `server/api/account.get.ts`; call Phase 4's `require-session.ts` before reading data. Derive the user exclusively from the verified session.
- [ ] Return an explicit projection such as `{ user: { id, name, email, emailVerified } }`. Do not serialize the session record, cookie token, account rows, OAuth tokens, password hash, IP or user agent.
- [ ] Accept no `userId` parameter. Reject unsupported selector query input with 400 using a small strict query schema; this makes the ownership contract unambiguous without adding user-by-ID CRUD.
- [ ] Set `Cache-Control: private, no-store` on success and errors. Keep this route outside Nitro cached handlers and SWR/ISR rules.
- [ ] Add live-server tests for anonymous 401, unverified 403, own-account success and attempts by user A to select user B. Prove B's data never appears and forged identity headers have no effect.

## 2. Integrate the Better Auth client as the single session authority.

- [ ] Create `app/lib/auth-client.ts` exporting `createAuthClient()` from `better-auth/vue` with the same-origin default endpoint. No database imports, server factory imports or public secret values are allowed.
- [ ] Use this client directly for auth actions. Do not add a generic API wrapper, Pinia session store, parallel `useState` session, localStorage token or custom `/api/session` proxy.
- [ ] Infer types from client results or type-only auth inference where supported. Ensure a type-only reference does not become a runtime import across the server boundary.

## 3. Resolve sessions correctly during SSR, hydration and client navigation.

- [ ] Use `await authClient.useSession(useFetch)` in setup and route middleware for session-dependent rendering. This is the documented 1.7.3 Nuxt integration; no manual cookie forwarding is needed. [Better Auth Nuxt integration](https://better-auth.com/docs/integrations/nuxt).
- [ ] Fetch `/api/account` with relative `useFetch` from the account page so Nuxt carries the current request context and reuses hydration data. Keep its result as account-page data, not another authentication authority.
- [ ] Preserve the library's cache key/session signal behavior. Do not use the client-only `useSession()` overload as the source of protected SSR HTML, or wrap protected content in `ClientOnly` to hide a mismatch.
- [ ] Add concurrent user-A/user-B SSR requests and compare their rendered payloads to detect cross-request state leakage. Test authenticated refresh, guest refresh and navigation with revoked cookies.
- [ ] Add Nuxt runtime tests under `test/nuxt/` for middleware and session consumers, plus live-server SSR cases under `test/e2e/`. Do not treat happy-dom assertions as a real browser hydration check.

## 4. Add authenticated-page and guest-page access rules.

- [ ] Add named `app/middleware/auth.ts` and `app/middleware/guest.ts`; await session resolution, handle fetch errors separately from a valid null session, and always return `navigateTo` when redirecting.
- [ ] Auth middleware sends guests to `/sign-in?redirect=...`, and unverified signed-in users to `/verify-email`. Guest middleware redirects a verified signed-in user from `/sign-in` or `/register` to the safe destination or `/account`.
- [ ] Add minimal route shells only as needed to make this phase's navigation executable. Opt `/account` into auth middleware and sign-in/register into guest middleware via `definePageMeta`; Phase 6 replaces shell contents with forms.
- [ ] Keep verification and reset landing routes reachable regardless of guest middleware. Otherwise an existing session could prevent completion of a recovery link. Do not apply a global redirect to `/api/auth` callbacks.
- [ ] Assert missing-session, verified, unverified and upstream-error outcomes. A session service outage must present a retry/error state, not an endless sign-in redirect.

## 5. Preserve safe return destinations without redirect loops.

- [ ] Add a pure `shared/utils/safe-redirect.ts` helper for the route contract. Accept a single local path, validate it with URL parsing against a fixed trusted origin, and return the normalized pathname/search/hash only for allowlisted application destinations (initially `/account` and `/`). Fall back to `/account`.
- [ ] Reject arrays, protocol-relative URLs, schemes, backslashes, control characters and encoded attempts that normalize to an external destination. Reject auth form routes, `/api/` and unsupported paths to prevent loops.
- [ ] Apply the same helper whenever consuming `redirect` for sign-in, registration and Google success callbacks. Preserve it through verification only when it can be carried safely; otherwise use `/account` consistently. Do not pass raw query values to `navigateTo` or OAuth callback parameters.
- [ ] Add `test/unit/safe-redirect.test.ts` with local query/hash preservation, external URLs, `//host`, backslashes, encoded separators, duplicate query values and loop destinations. Keep it independent of Nuxt.

## 6. Handle session loading, expiry and sign-out consistently.

- [ ] Distinguish unresolved/error states from a resolved guest in navigation and page shells. Use the documented hook's actual return types; track mutation pending state locally in the component rather than duplicating identity.
- [ ] After successful sign-out, let Better Auth invalidate its session signal, clear account-page data through Nuxt's data API and navigate to `/sign-in`. Do not clear identity optimistically on a failed sign-out request; show a retryable error.
- [ ] On account API 401, clear only stale page data and resolve the authoritative session before returning to sign-in. On 403 show the verification path. Keep transient 5xx failures distinct.
- [ ] Test sign-out from a second tab, session expiry while a page is open, browser back navigation and an expired cookie on hard refresh. Verify no old account content remains visible after revocation is observed.

## Phase verification

- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run` and `pnpm build` with both unit and server fixtures.
- [ ] Manually inspect a production-preview browser: direct `/account` load, refresh, client navigation, sign-out/back, and concurrent sessions. Confirm no hydration warnings or protected-content flash.
- [ ] Confirm account ownership is enforced over direct HTTP without relying on route middleware, and all untrusted redirect cases fall back safely.

## Expected state after completion

The account endpoint enforces identity and ownership. SSR, hydration and navigation use Better Auth's supported Nuxt session integration, with minimal route shells ready for the Phase 6 screens.
