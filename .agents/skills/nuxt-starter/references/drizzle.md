# Drizzle + Neon Reference

## Critical version boundary

Current project versions:

```text
drizzle-orm 1.0.0-rc.4
drizzle-kit 1.0.0-rc.4
```

Always re-check `package.json`.

Treat Drizzle 0.x examples as potentially obsolete.

## Documentation

Use current official Drizzle 1.0 RC documentation.

Verify:

- schema APIs
- imports
- relations APIs
- query APIs
- Kit configuration
- generate/migrate behavior
- Neon integration

If official docs are ambiguous, inspect installed package types/source or the official repository.

## Modeling

Use real typed relational schemas.

Do not build generic JSONB domain storage merely to avoid schema design.

Do not create tables dynamically at runtime.

Do not perform application-level `CREATE TABLE` as a repository concern.

## Relations

Prefer the current Drizzle 1.0 relations architecture documented for the installed RC.

Do not use Relations v1 patterns unless current RC docs explicitly support them for the chosen implementation.

## Migrations

Production workflow:

```text
schema
→ drizzle-kit generate
→ review migration
→ commit migration
→ drizzle-kit migrate
```

`push` can be useful during local development where appropriate. It is not a replacement for version-controlled production migrations.

## Neon

The project uses `@neondatabase/serverless` and deploys to Vercel.

Before creating the DB client:

1. Verify current Neon driver docs.
2. Verify current Drizzle Neon docs.
3. Choose the documented serverless connection pattern.
4. Do not copy traditional long-lived Node pool settings without explicit support.

## Configuration

`drizzle.config.ts` runs outside normal Nuxt runtime. Environment loading may therefore differ from `useRuntimeConfig()`.

Keep tooling config and application runtime config conceptually separate while using consistent variable names.
