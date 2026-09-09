# Phase 6 — Authentication and account UI

## Goal

Deliver usable, localized and accessible authentication/account screens on the server and session foundations, with tests for each form's meaningful behavior.

## Preconditions

- Phases 3–5 pass, including email, recovery, Google, account ownership and route-shell behavior. Preserve the Phase 5 URL contract and middleware.
- Relevant resolved versions: vee-validate 5.0.0-beta.1, Zod 4.5.4, Vue 3.5.42, Reka UI 2.10.4, shadcn-nuxt 2.8.2, Tailwind 4.3.3 and i18n 10.6.0. Read the Vue, shadcn-vue, Reka and i18n skills before their implementation work.
- Reuse existing `UiInput`, field/label/error components, button, card, spinner, skeleton and `UiPageContainer`. `app/app.vue` already mounts a toaster and sets reactive HTML language. `components.json` owns `app/components/ui/` and `app/lib/utils.ts`.

## 1. Build registration, sign-in and Google sign-in screens.

- [ ] Implement `app/pages/register.vue` with name/email/password and `app/pages/sign-in.vue` with email/password. Use native forms, correct input types/autocomplete, submit buttons and the named guest middleware.
- [ ] Submit through `authClient.signUp.email` and `authClient.signIn.email`. Include only validated fields and Phase 5's safe callback destination. On registration, show a generic check-email outcome consistent with the server's duplicate-account behavior.
- [ ] Add a Google button using `authClient.signIn.social({ provider: 'google', ... })`, with safe success and error destinations. Give it `type="button"` inside forms and prevent duplicate actions while pending.
- [ ] Link sign-in, registration, forgotten password and the public home using Nuxt links. Do not nest links inside actual button elements; use the existing `as-child` composition where appropriate.
- [ ] Add component tests for valid submission, rejected fields, safe redirects, disabled pending actions and provider-start failure, using client-boundary mocks rather than mocking the forms themselves.

## 2. Add email-verification, resend, forgotten-password and reset-password screens.

- [ ] Implement `app/pages/verify-email.vue` as the check-email/resend/result screen. Let the Better Auth verification endpoint consume its token and return to this page; avoid reimplementing verification in a custom Nitro route.
- [ ] Use `authClient.sendVerificationEmail` for explicit resend with a validated email and safe callback URL. Display a generic acknowledgement and a retry state; do not reveal whether an address is registered or already verified.
- [ ] Implement `app/pages/forgot-password.vue` with `authClient.requestPasswordReset`, using the absolute reset destination built from the configured same-origin flow. Keep known/unknown address outcomes indistinguishable.
- [ ] Implement `app/pages/reset-password.vue`: validate the token/query shape, show a new-password/confirmation form, and call `authClient.resetPassword`. Handle missing, invalid, expired and used tokens with a link to request another email. Never persist tokens in localStorage or log them.
- [ ] On reset success, remove the sensitive token query via replacement navigation and send the user to sign-in. Keep verification/reset screens available even when a session exists, as specified in Phase 5.
- [ ] Test resend, recovery acceptance, invalid links and successful reset through component tests; extend live-server tests to follow the URLs captured by the email fixture.

## 3. Add a protected account page with basic profile editing and sign-out.

- [ ] Replace the `/account` shell with SSR account data from `useFetch('/api/account')` and the auth middleware. Display the server-provided name, email and verification state.
- [ ] Scope basic editing to the display name (for example trimmed 1–100 characters). Keep email read-only; email change, account deletion, uploads and linked-provider management remain deferred.
- [ ] Submit through `authClient.updateUser({ name })`, preserving Better Auth ownership checks. Enforce the same name rule server-side in a supported narrow Better Auth user-create/update hook in `server/auth/options.ts`; throw a documented safe API error for invalid names. Do not add a parallel profile mutation proxy.
- [ ] After successful update, let the client signal refresh session consumers and refresh the account page's fetched data. Preserve unsaved text on failure; update displayed data only after confirmed success.
- [ ] Wire sign-out to Phase 5's behavior and account/header navigation into `AppHeader.vue`. Add tests proving forged `userId`/`emailVerified` updates cannot change identity or another user's data through the built-in endpoint.

## 4. Apply vee-validate + Zod to forms while retaining authoritative server validation.

- [ ] Add small schemas in `shared/validation/auth.ts` and `shared/validation/profile.ts` only where safe rules are shared. Keep auth secrets, adapter configuration and database types out of them.
- [ ] Pass Zod schemas directly to `useForm({ validationSchema, initialValues })`. vee-validate v5 supports Standard Schema; do not add `@vee-validate/zod` or `toTypedSchema`. Explicitly initialize fields and required UI attributes instead of relying on removed schema-default/required inference. [v5 migration](https://vee-validate.logaretm.com/v5/guide/migration/).
- [ ] Bind fields through the installed v5 APIs to existing shadcn input/field components. Follow current field composition, while checking any online shadcn sample against the beta's types. [shadcn form composition](https://shadcn-vue.com/docs/forms/vee-validate).
- [ ] Add password confirmation as a client-only cross-field rule; send only the new password and token to Better Auth. Keep sign-in passwords untransformed and keep length rules aligned with Phase 4.
- [ ] Map stable Better Auth error codes and server validation errors to localized field/form messages. Treat unknown errors as a generic retryable failure; never render raw provider/server HTML or stack traces.
- [ ] Add unit tests for actual boundary rules and component tests proving invalid input never invokes a mutation. Test direct server requests independently to prove bypassing the client cannot bypass validation.

## 5. Cover pending, success, invalid-input, expired-link and provider-failure states.

- [ ] For each screen define and implement idle, submitting, success and error behavior; include network timeout, 429, invalid credentials, unverified identity, Google cancellation/collision and email-delivery uncertainty where relevant.
- [ ] Block duplicate mutations and expose visible pending text/spinners. Keep operation-specific state local; ensure an error restores usable controls and does not strand focus on a disabled element.
- [ ] Honor Better Auth's returned rate-limit retry header (1.7.3 documents `X-Retry-After`) for useful retry messaging. UI throttling is only feedback; the server remains authoritative.
- [ ] Clear password fields after success/navigation, never place them in URLs, and preserve non-sensitive fields on recoverable errors. Avoid optimistic success when the API returned an error object.
- [ ] Add behavioral tests for double submit, slow response, invalid/expired links, rate limit and provider failure. Do not replace these with static snapshots alone.

## 6. Localize starter UI and verify keyboard access, labels and focus behavior.

- [ ] Add equivalent auth/account/navigation/error keys to `i18n/locales/en.json` and `es.json`. Preserve `strategy: 'no_prefix'`, the existing `i18n_redirected` cookie and root-only detection. [i18n routing](https://i18n.nuxtjs.org/docs/guide).
- [ ] Use locale-aware schema messages or map safe validation codes at render time; ensure switching language updates visible errors without losing entered values. Do not store translated text in a global server singleton.
- [ ] Associate every input ID with `UiFieldLabel`, descriptions and error IDs; use `aria-invalid` and `aria-describedby`. Keep errors available inline, with an appropriate live status for submit results; toasts alone are insufficient.
- [ ] Focus the first invalid input using the existing `UiInput` `inputRef` support. Use Reka primitives for menus/focus behavior, preserve visible focus rings and avoid nested interactive controls.
- [ ] Test keyboard-only tab order, Enter submission, dropdown Escape/focus return, browser autofill/password-manager behavior, narrow viewport and both languages. Verify SSR language and hydrated content agree.

## Phase verification

- [ ] Exercise registration → real email verification → sign-in → edit name → sign-out and recovery → new-password sign-in. Exercise Google sign-in/cancel/collision independently.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run` and `pnpm build`; include the new unit, Nuxt component and live-server cases.
- [ ] Inspect production-preview refresh/navigation in both languages with no hydration warnings, duplicate session authority or private data in page payloads beyond the allowed user projection.
- [ ] Record manual keyboard/focus/mobile findings and fix failures before considering the phase done.

## Expected state after completion

All scoped authentication and account screens are usable and tested alongside implementation. Phase 7 strengthens cross-flow/browser coverage and makes the checks mandatory in CI.
