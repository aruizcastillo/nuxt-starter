# Better Auth Reference

## Version first

Read the installed `better-auth` and `@better-auth/drizzle-adapter` versions from `package.json` before implementation.

Use official Better Auth skills and official documentation matching that version.

Expected official skills may include:

- `create-auth`
- `better-auth-best-practices`
- `better-auth-security-best-practices`
- `email-and-password-best-practices`

## Ownership

Better Auth owns authentication and session state.

Avoid a parallel authentication framework. Introduce a wrapper, proxy, or separate state only for a concrete, verified integration need while keeping Better Auth authoritative for authentication and session state.

## Nuxt integration

Use Better Auth's documented Nuxt integration.

Implement the documented catch-all server handler.

Implement the documented client integration.

For SSR session access, use the current officially documented Nuxt-aware session/data-fetching approach.

Do not manually forward cookies if Better Auth + Nuxt already provide the supported solution.

## State

Do not mirror Better Auth session state into Pinia by default.

Create separate state only for application state that Better Auth does not own.

## Server authorization

Client route middleware improves UX but is not authoritative security.

Protected server handlers must verify authorization server-side.

## Avoid insecure shortcuts

Do not:

- make the first registered user admin automatically
- silently mark users email-verified
- rely solely on UI visibility for authorization
- use excessive session cache without understanding revocation consequences
- weaken defaults for convenience

## Schema

When Better Auth provides an official schema-generation flow compatible with the installed Drizzle version, prefer it over manually recreating Better Auth internals.

Verify Better Auth + Drizzle 1.0 RC compatibility before generating or modifying schema.
