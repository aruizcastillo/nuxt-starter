# Nuxt Reference

## Version

Follow Nuxt 4 documentation applicable to the installed Nuxt version.

Do not default to Nuxt 3 root-directory conventions.

## Primary directories

```text
app/
server/
shared/
public/
```

Use each for its intended runtime boundary.

## Native primitives first

Prefer Nuxt-native capabilities:

```ts
useFetch()
useAsyncData()
$fetch()
useRequestFetch()
useRuntimeConfig()
defineNuxtRouteMiddleware()
defineNuxtPlugin()
defineEventHandler()
```

Use a small, conventional application abstraction only when the Nuxt primitive does not provide the required behavior or boundary; preserve SSR, hydration, and generated types.

## SSR and hydration

SSR correctness is mandatory.

Do not use these as first-line fixes:

```text
<ClientOnly>
onMounted-only initialization
setTimeout/delay hydration hacks
manual cookie forwarding
manual SSR state duplication
```

When a library provides a documented Nuxt SSR integration, use it.

## Runtime config

Use `runtimeConfig` and `useRuntimeConfig()` for Nuxt runtime configuration.

Avoid a parallel custom config system based on `process.env` scattered across runtime code.

Tooling outside Nuxt runtime, such as `drizzle.config.ts`, may need direct environment access.

## Data fetching

Use `useFetch` / `useAsyncData` for SSR-aware reactive page/component data.

Use `$fetch` for imperative requests.

Use `useRequestFetch` where request-context-aware forwarding is required.

Do not recreate Nuxt's request forwarding manually unless the documented primitive cannot solve the case.

## Middleware

Use Nuxt route middleware for navigation-level concerns.

Use Nitro/server middleware for server request concerns.

Do not confuse client route protection with server authorization: server-side authorization is still required for protected data/actions.
