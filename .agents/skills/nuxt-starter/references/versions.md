# Version-Aware Implementation Reference

## Absolute rule

`package.json` is the source of truth for declared dependency constraints. The lockfile or installed package is the source of truth for the exact resolved version.

Never assume current online docs automatically match the installed version.

## Verification procedure

For every version-sensitive implementation:

1. Read the declared version range and exact resolved installed version.
2. Locate official documentation for that version or version line.
3. Check official upgrade/migration guides.
4. Confirm configuration keys, imports, APIs, defaults, and directory conventions.
5. If unclear, inspect official source or installed package types/source.
6. When official guidance is silent or non-prescriptive, verify a current, established ecosystem convention against the exact resolved version.
7. Only then implement.

## Current important version lines

Check `package.json`.

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
7. current, established ecosystem conventions verified for the exact version
8. community guidance and examples
9. model knowledge

Use an ecosystem convention only when higher-priority sources do not prescribe the choice. It cannot override explicit project decisions or official API, security, compatibility, or framework-boundary guidance.

## Never silently adapt stale examples

If an old example no longer matches current APIs, do not patch it until it compiles.

Find the current documented approach, or when official guidance is non-prescriptive, a verified current ecosystem convention.
