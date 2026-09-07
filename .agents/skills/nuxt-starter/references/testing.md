# Testing, ESLint, TypeScript Reference

## Testing stack

Use:

```text
Vitest
@nuxt/test-utils
```

## Environment choice

Use plain Vitest for:

- pure functions
- schema helpers
- transformations
- framework-independent utilities

Use Nuxt Test Utils for:

- Nuxt composables
- Nuxt plugins
- route middleware
- auto-import-dependent code
- components requiring Nuxt context
- SSR/hydration behavior

Do not boot Nuxt unnecessarily.

## ESLint

Keep the Nuxt-generated flat config as the base.

Do not replace it with a generic Vue/TypeScript config.

Do not disable rules merely to silence valid failures.

Investigate parser/type/config issues first.

## TypeScript

Current TypeScript major is intentional.

Do not upgrade TypeScript major versions simply because a newer npm `latest` exists.

Verify compatibility across Nuxt and installed modules before major upgrades.

Keep strict typing.

Avoid:

```text
any
@ts-ignore
broad unsafe casts
```

unless a documented external typing defect requires a narrow workaround.

## Validation commands

Run the relevant subset before completion:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Do not claim completion with unexplained failures.
