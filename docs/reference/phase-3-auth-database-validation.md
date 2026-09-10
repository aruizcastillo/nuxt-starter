Use a fresh PowerShell session for each target so test variables never carry into `dev`.

1. Confirm the existing development branch, then create the disposable branch from it:

```powershell
pnpm exec neon branches list --project-id ancient-water-37006854 --output json

pnpm exec neon branches create `
  --project-id ancient-water-37006854 `
  --name test-phase3 `
  --parent br-green-sky-zadolgsg `
  --no-secrets `
  --output json
```

This created `test-phase3` (`br-weathered-hall-zagc439i`) from `dev`.

2. Retrieve test-branch URLs and save them only in ignored `.env.test-phase3`, retaining the established variable names:

```powershell
$testDirect = pnpm exec neon connection-string test-phase3 `
  --project-id ancient-water-37006854 `
  --database-name nuxt_auth_starter_db `
  --role-name nuxt_auth_starter_db_owner

$testPooled = pnpm exec neon connection-string test-phase3 `
  --project-id ancient-water-37006854 `
  --database-name nuxt_auth_starter_db `
  --role-name nuxt_auth_starter_db_owner `
  --pooled
```

The file contained:

```text
NEON_BRANCH=test-phase3
DATABASE_URL_UNPOOLED=<test direct URL>
DATABASE_URL=<test pooled URL>
NUXT_DATABASE_URL=<test pooled URL>
NUXT_BETTER_AUTH_URL=https://auth.example.test
NUXT_BETTER_AUTH_SECRET=<new random 32-byte base64 secret>
NUXT_GOOGLE_CLIENT_ID=
NUXT_GOOGLE_CLIENT_SECRET=
NUXT_RESEND_API_KEY=
NUXT_EMAIL_FROM=
```

3. Generate the Better Auth Drizzle schema using the pinned CLI. Placeholder values are sufficient because schema generation constructs the client but does not query the database:

```powershell
$env:NUXT_DATABASE_URL = 'postgresql://schema:schema@localhost/schema'
$env:NUXT_BETTER_AUTH_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$env:NUXT_BETTER_AUTH_URL = 'https://schema.example.test'

pnpm auth:generate --yes
pnpm exec eslint server/database/schema/auth.ts --fix
```

This generated `user`, `session`, `account`, and `verification`, including Relations v2 definitions.

4. Confirm repeated generation is stable, then generate the Drizzle migration:

```powershell
pnpm auth:generate --yes
pnpm exec eslint server/database/schema/auth.ts --fix
pnpm db:generate
```

The migration created was:

```text
server/database/migrations/20260910134024_bumpy_baron_strucker/
```

A second `pnpm db:generate` reported:

```text
No schema changes, nothing to migrate
```

5. Verify `test-phase3` is the expected empty target, then apply the migration twice:

```powershell
$env:DOTENV_CONFIG_PATH = '.env.test-phase3'

pnpm db:migrate
pnpm db:migrate
```

The first run applied the migration; the second completed without adding another history row.

I used a temporary ignored inspection helper:

```powershell
node .cache/phase3/inspect.mjs test
```

It verified database identity and queried:

```sql
select tablename
from pg_tables
where schemaname = 'public'
order by tablename;

select c.relname as table_name, con.conname, pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
order by c.relname, con.conname;

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

select * from drizzle.__drizzle_migrations
order by id;
```

Expected application tables:

```text
account
session
user
verification
```

Verified constraints included unique `user.email`, unique `session.token`, and cascading `account.user_id` / `session.user_id` foreign keys to `user.id`. The `drizzle.__drizzle_migrations` row count remained one after rerunning migration.

6. Run the live auth validation against the disposable branch:

```powershell
Get-Content .env.test-phase3 | ForEach-Object {
  if ($_ -match '^([A-Z][A-Z0-9_]*)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
  }
}

pnpm test:run
pnpm build
```

This exercised the mounted handler, sign-up/sign-in, session retrieval, secure cookie attributes, sign-out revocation, malformed input, and expired sessions.

7. Reset `test-phase3` from the still-empty `dev` parent, then replay the committed migration from scratch:

```powershell
pnpm exec neon branches reset br-weathered-hall-zagc439i `
  --parent `
  --project-id ancient-water-37006854 `
  --output json

node .cache/phase3/inspect.mjs test

$env:DOTENV_CONFIG_PATH = '.env.test-phase3'
pnpm db:migrate
pnpm db:migrate

node .cache/phase3/inspect.mjs test
```

The replayed table, index, foreign-key, and migration-history catalog matched the initial test application.

8. Inspect `dev` before changing it:

```powershell
node .cache/phase3/inspect.mjs dev
```

It confirmed `dev` had no application tables.

9. Parse the local `.env` correctly, confirm it targets `dev`, then apply the validated migration:

```powershell
$settings = node --input-type=module -e "
  import { readFileSync } from 'node:fs'
  import { parse } from 'dotenv'
  console.log(JSON.stringify(parse(readFileSync('.env'))))
" | ConvertFrom-Json

foreach ($entry in $settings.PSObject.Properties) {
  [Environment]::SetEnvironmentVariable($entry.Name, [string]$entry.Value, 'Process')
}

$env:DOTENV_CONFIG_PATH = '.env'

pnpm db:migrate
pnpm db:migrate

node .cache/phase3/inspect.mjs dev
```

10. Compare the test and development catalogs after removing the run-specific migration timestamp:

```powershell
node -e "
  const fs = require('node:fs')
  const test = JSON.parse(fs.readFileSync('.cache/phase3/test-catalog.json'))
  const dev = JSON.parse(fs.readFileSync('.cache/phase3/dev-catalog.json'))

  for (const catalog of [test, dev]) {
    for (const migration of catalog.history) delete migration.applied_at
  }

  if (JSON.stringify(test) !== JSON.stringify(dev)) {
    throw Error('Development schema differs')
  }

  console.log('Development catalog and history match the validated disposable replay')
"
```

The final result was identical catalogs and one migration-history row on both `test-phase3` and `dev`.