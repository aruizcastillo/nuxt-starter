# Nuxt Starter — Agent Instructions

This repository is a clean, reusable Nuxt application starter.

The goal is not merely to make features work. Implementations must follow the current, documented, idiomatic approach of each framework and library used by the project.

Avoid custom abstractions, compatibility hacks, historical patterns, and unnecessary infrastructure when an official supported solution exists.

## Core principle

Use the officially documented solution for the exact installed version of each technology.

Before implementing anything version-sensitive:

1. Read `package.json`.
2. Identify the exact installed package version.
3. Use documentation applicable to that version or version line.
4. Check official migration/upgrade documentation when APIs may have changed.
5. If documentation is unclear, inspect official source code, package types, or the installed package before making assumptions.

Never assume that examples from search results, blog posts, Stack Overflow, GitHub discussions, old docs, or model knowledge apply to the installed version.

## Source-of-truth hierarchy

When sources or approaches disagree, use this priority:

1. Explicit requirements in this `AGENTS.md`
2. Official skill maintained by the framework/library
3. Official documentation applicable to the installed version
4. Official migration and upgrade guides
5. Official source code and installed package types
6. Existing intentional conventions in this repository
7. Widely accepted current ecosystem conventions
8. High-quality community skills/documentation
9. Other community examples
10. Agent prior knowledge

Never override a documented project decision merely because another architecture is technically valid.

## Version awareness is mandatory

`package.json` is authoritative.

Follow `package.json`.

### Prerelease rule

Drizzle ORM and Drizzle Kit currently use `1.0.0-rc.4`.

Treat stable Drizzle 0.x documentation and examples as potentially obsolete. Do not use Drizzle 0.x relations, configuration, query, or migration patterns unless current Drizzle 1.0 RC documentation explicitly confirms them.

Never silently adapt an outdated example with a workaround.

## Architecture philosophy

Start simple. Add architectural layers only when a concrete requirement justifies them.

Prefer:

```text
framework primitive
→ small project-specific abstraction when useful
→ application code
```

Avoid repository/service/locator/container/contract layers by default.

Do not build generic CRUD frameworks, generic database abstractions, custom auth frameworks, or runtime schema systems unless a real requirement demonstrates the need.

## Framework ownership

Respect conventions belonging to the tool that owns the files.

Examples:

- `app/lib/utils.ts` stays there because shadcn-vue uses that convention.
- `app/components/ui/` follows shadcn-vue conventions.
- Nuxt runtime configuration uses `runtimeConfig`.
- Better Auth owns authentication/session state.
- Drizzle owns relational schema/query/migration concerns.
- Reka UI owns primitive behavior beneath shadcn-vue components.

Do not reorganize tool-owned structure merely to make it look more generically “Nuxt-like”.

## Nuxt

Follow Nuxt 4 conventions.

Primary boundaries:

```text
app/       client/universal application code
server/    Nitro/server-only code
shared/    code intentionally shared between app and server
public/    static public files
```

Prefer Nuxt-native primitives such as `useFetch`, `useAsyncData`, `$fetch`, `useRequestFetch`, `useRuntimeConfig`, route middleware, server middleware, Nitro handlers, and Nuxt plugins.

SSR and hydration correctness are mandatory.

Do not hide SSR problems with `<ClientOnly>`, `onMounted()`, arbitrary delays, or manual cookie/header forwarding when Nuxt or the integrated library provides an official SSR-safe solution.

## Better Auth

Better Auth is the sole authentication system.

Follow the installed official Better Auth skills and documentation for the installed `1.7.x` version.

Do not mirror Better Auth session state into Pinia by default.

Do not create custom auth API proxies, custom auth controllers, manual session synchronization, first-user-admin behavior, fake email verification, or client-only authorization.

Server-side authorization remains authoritative.

## Drizzle

Use current Drizzle 1.0 RC documentation for the installed version.

Prefer typed relational schemas and current relations APIs.

Do not create runtime tables, generic JSONB-backed domain models, or runtime DDL as a data-access abstraction.

Production schema evolution uses versioned migrations:

```text
schema
→ drizzle-kit generate
→ reviewed migration
→ drizzle-kit migrate
```

`push` may be used in development when appropriate, but is not the production migration workflow.

## Neon and Vercel

The deployment architecture is Vercel-first and PostgreSQL is hosted on Neon.

Use `@neondatabase/serverless` according to current Neon and Drizzle documentation.

Do not copy long-running Node server pool assumptions into serverless code.

## shadcn-vue and Reka UI

shadcn-vue is the component layer. Reka UI is the primitive layer.

Use shadcn-vue conventions for generated components and Reka UI documentation/skills for primitive behavior such as `as-child`, focus management, portals, keyboard interaction, controlled state, dismissable layers, and menu/dialog/popover semantics.

Maintain valid HTML and accessibility semantics.

## Tailwind CSS

This project uses Tailwind CSS 4 with `@tailwindcss/vite`.

Do not introduce Tailwind 3 patterns, legacy configuration, PostCSS setup, or old plugin conventions unless current Tailwind 4 documentation explicitly requires them.

## Forms and validation

Forms use vee-validate + Zod 4.

Use documentation for the installed versions. Do not copy Zod 3 patterns blindly.

Client validation improves UX; server validation remains mandatory for untrusted input.

## State management

Pinia is intentionally not installed.

Before adding state management, verify the requirement cannot be solved cleanly by Vue reactivity, Nuxt composables, `useState`, Better Auth state, router/URL state, or Nuxt data-fetching state.

## HTTP

Axios is intentionally not installed.

Prefer Nuxt’s native `$fetch`, `useFetch`, `useAsyncData`, and `useRequestFetch`.

## i18n

Use current `@nuxtjs/i18n 10.x` conventions. Do not copy configuration from older module generations without verifying compatibility.

## VueUse

Prefer official VueUse composables when they solve a common reactive/browser problem correctly, especially when SSR behavior is relevant.

## Testing

Use Vitest for pure unit tests and `@nuxt/test-utils` when Nuxt runtime behavior is required.

Do not boot Nuxt unnecessarily for pure utilities.

## ESLint and TypeScript

Keep the Nuxt-generated ESLint flat configuration as the base.

Do not replace it with a generic Vue/TypeScript ESLint setup.

TypeScript `6.0.x` is intentional. Do not change TypeScript major versions merely because npm reports a newer `latest`.

Do not solve type errors with broad `any`, unsafe casts, `@ts-ignore`, or disabled rules unless an external defect is documented and the workaround is narrowly scoped.

## Dependencies

Do not add dependencies without a concrete requirement.

Before adding a package:

1. Check whether Nuxt/Vue or an installed dependency already solves it.
2. Verify compatibility with exact installed versions.
3. Prefer official integrations.
4. Avoid overlapping libraries.

Dependencies intentionally absent include Axios, Pinia, Prisma, Firebase, Clerk, Supabase Auth, TanStack Query, Redis, tRPC, GraphQL, and Express unless requirements change.

## No workaround-first development

When something fails:

1. Reproduce and isolate it.
2. Verify the exact installed version.
3. Read current official documentation.
4. Check migration/upgrade notes.
5. Inspect package types/source if needed.
6. Implement the documented solution.
7. Only then consider a workaround.

Do not reflexively use `<ClientOnly>`, `onMounted`, timers, `eslint-disable`, `@ts-ignore`, dependency downgrades, pnpm overrides, manual cookie forwarding, or duplicated state.

## Before completing a task

For changes involving external libraries:

- confirm installed versions;
- confirm the implementation against applicable official documentation;
- verify no legacy API or pattern was introduced;
- verify SSR/hydration where relevant;
- verify accessibility where relevant;
- remove unnecessary abstractions/workarounds;
- run relevant validation.

Default validation:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

If a command cannot run or fails for unrelated reasons, report that explicitly.

Never claim completion while knowingly leaving unexplained lint, type, test, or build failures.

## Final rule

When choosing between a clever custom solution and the current documented solution provided by the framework/library, use the documented solution.
