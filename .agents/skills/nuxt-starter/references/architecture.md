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

## Avoid premature abstraction

Do not create by default:

- repositories
- services
- service locators
- dependency containers
- generic contracts layers
- generic CRUD engines
- custom auth state layers
- custom API client frameworks
- runtime database schema abstractions

Introduce a layer only when a real use case demonstrates that it reduces meaningful duplication or isolates meaningful complexity.

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
