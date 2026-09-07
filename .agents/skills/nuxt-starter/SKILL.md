---
name: nuxt-starter
description: Implement, review, refactor, and debug this Nuxt starter using its exact installed versions, official framework/library guidance, SSR-safe Nuxt patterns, Better Auth, Drizzle 1.0 RC, Neon/Vercel, shadcn-vue/Reka UI, Tailwind 4, vee-validate/Zod, i18n, and Nuxt testing conventions.
---

# Nuxt Starter

Use this skill for substantial implementation, review, refactoring, debugging, architecture, dependency, authentication, database, UI, validation, localization, or testing work in this repository.

Read the repository root `AGENTS.md` first. Its rules are mandatory.

## Mandatory first steps

Before changing code:

1. Inspect `package.json`.
2. Resolve the exact versions of every relevant package.
3. Inspect the relevant existing project files.
4. Load the appropriate reference files below.
5. Prefer official installed skills and official documentation for those exact versions.

Never implement a version-sensitive API from memory alone.

## Reference routing

Load only the references relevant to the task:

- Project boundaries, architecture, dependencies, abstraction policy:
  - `references/architecture.md`
- Exact-version verification, source hierarchy, prereleases:
  - `references/versions.md`
- Nuxt 4, SSR, hydration, data fetching, runtime config, middleware:
  - `references/nuxt.md`
- Better Auth, sessions, handlers, server authorization:
  - `references/better-auth.md`
- Drizzle 1.0 RC, migrations, relations, Neon/Vercel:
  - `references/drizzle.md`
- shadcn-vue, Reka UI, Tailwind 4, forms:
  - `references/ui.md`
- Vitest, Nuxt Test Utils, ESLint, TypeScript, validation commands:
  - `references/testing.md`

For cross-cutting tasks, load multiple references.

## Documentation protocol

For each external library involved:

1. Identify the package owner.
2. Read the exact installed version from `package.json`.
3. Use an official skill maintained by that project when available.
4. Verify the implementation against official documentation applicable to that version.
5. Check migration/upgrade guides when examples may belong to another version line.
6. If ambiguity remains, inspect official source code, installed package types, or installed package source.
7. Do not fall back to community examples until official sources are exhausted.

Official project guidance outranks community skills.

## Installed skill expectations

When available, use official skills for:

- Better Auth
- shadcn-vue
- VueUse

Community skills may exist for Nuxt/Vue/i18n/Vite/Vitest/pnpm/Reka UI. Treat them as supplementary, never as higher authority than official documentation.

## Completion protocol

Before finishing substantial work:

1. Re-check exact installed versions.
2. Confirm no legacy API or workaround slipped in.
3. Run relevant validation:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test:run`
   - `pnpm build`
4. Report any unresolved upstream/version ambiguity explicitly.

Do not claim official compliance unless it was actually verified.
