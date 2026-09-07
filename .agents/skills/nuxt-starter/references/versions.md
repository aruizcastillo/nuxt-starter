# Version-Aware Implementation Reference

## Absolute rule

`package.json` is the source of truth for installed versions.

Never assume current online docs automatically match the installed version.

## Verification procedure

For every version-sensitive implementation:

1. Read the exact installed version.
2. Locate official documentation for that version or version line.
3. Check official upgrade/migration guides.
4. Confirm configuration keys, imports, APIs, defaults, and directory conventions.
5. If unclear, inspect official source or installed package types/source.
6. Only then implement.

## Current important version lines

At the time this guidance was created:

```text
Nuxt                  4.5.x
Vue                   3.5.x
Vue Router            5.3.x
Better Auth           1.7.x
Drizzle ORM           1.0.0-rc.4
Drizzle Kit           1.0.0-rc.4
Tailwind CSS          4.3.x
Reka UI               2.10.x
shadcn-nuxt           2.8.2
Zod                   4.5.x
vee-validate          4.15.x
VueUse                14.4.x
Nuxt i18n             10.6.x
Vitest                5.x
Nuxt Test Utils       4.2.x
ESLint                10.x
TypeScript            6.0.x
```

If `package.json` differs, `package.json` wins.

## Prereleases

For RC/beta/canary packages, stable documentation is potentially incompatible until verified.

Drizzle `1.0.0-rc.4` is especially important.

Do not use Drizzle 0.x Relations, query APIs, Kit configuration, migration behavior, or examples unless current 1.0 RC docs confirm them.

## Source priority

Use:

1. repository requirements
2. official project skill
3. official version-matched docs
4. official migration guides
5. official source / installed types
6. intentional project conventions
7. community guidance
8. model knowledge

## Never silently adapt stale examples

If an old example no longer matches current APIs, do not patch it until it compiles.

Find the current documented approach instead.
