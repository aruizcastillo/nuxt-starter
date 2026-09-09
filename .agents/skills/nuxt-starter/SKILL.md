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
5. Follow `AGENTS.md` for the project's source hierarchy and architecture policy.

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

## Versioned skill examples

Some bundled skills contain generic commands or examples using `@latest`, or describe a different version line. Do not execute those commands or adopt their generated output in this repository until their compatibility with the resolved installed version is verified. Prefer the project's installed CLI; otherwise use a reviewed, compatible pinned CLI version.

Official project skills and documentation remain primary references. When they do not prescribe an application choice, follow the verified current ecosystem convention defined by `AGENTS.md`.

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
