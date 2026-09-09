# Architecture Reference

## Goal

Keep the starter minimal, idiomatic, understandable, and reusable.

The preferred architecture is the one developers familiar with the installed technologies would expect to find.

## Core boundaries

```text
app/       Nuxt application/client/universal code
server/    Nitro/server-only code
shared/    deliberately shared app/server code
public/    static public files
```

Respect tool-owned conventions inside those boundaries.

## Tool-owned paths

Do not move these merely to satisfy generic Nuxt preferences:

```text
app/lib/utils.ts
app/components/ui/
```

They follow shadcn-vue conventions.

## Deliberate abstraction

Start with framework primitives and small, conventional application modules. Introduce a layer when a real use case demonstrates that it creates a meaningful boundary, reduces demonstrated duplication, or isolates meaningful complexity.

Do not add generic CRUD engines, dependency containers, custom auth state layers, API-client frameworks, or runtime database-schema abstractions merely in anticipation of future needs.

## Dependencies

Before adding a dependency, check whether the installed stack already covers the need.

Examples:

```text
HTTP                  → Nuxt fetch stack
auth/session          → Better Auth
simple shared state   → Vue/Nuxt reactivity
UI components         → shadcn-vue
UI primitives         → Reka UI
common composables    → VueUse
validation            → Zod + vee-validate
database              → Drizzle
```

Do not add dependencies merely because they are familiar.

## Server/client safety

Database code and secrets stay server-side.

Do not import server-only code into app/universal code.

Place code in `shared/` only when it is genuinely safe and useful in both environments.

## Existing code

Before restructuring existing code:

1. Determine why it exists.
2. Check whether an installed tool owns the convention.
3. Change it only for correctness or a concrete improvement, not personal preference.
