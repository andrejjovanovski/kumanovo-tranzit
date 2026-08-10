# apps/api — Backend (reserved)

The optional backend will live here. Its job is to serve the transit data (and
later: real-time positions, disruptions, admin edits) so clients stop bundling
the raw JSON.

The migration is deliberately small because the web app already reads through a
repository seam:

1. Read `packages/data/src/*.json` **server-side** here (or from a database that
   these JSON files seed), validated with the existing Zod schemas in
   `packages/data/src/schemas.ts`.
2. Expose `GET /api/lines`, `/api/stops`, `/api/neighborhoods`.
3. In `packages/data/src/repository.ts`, switch the already-`async` functions
   from `import + parse` to `fetch(...)`. Nothing else in the web app changes.

Vercel Edge Functions are a natural fit for a first version (co-deploys with the
web app, no separate host).
