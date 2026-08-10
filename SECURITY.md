# Data protection & security notes

## The honest limitation

This is a **static frontend**. Any data the app renders is, by definition,
readable by the browser that renders it — so a purely client-side app can never
truly *hide* its transit data. Anyone determined enough can read what the app
displays. "Secure" here means **not carelessly exposed, tamper-resistant, and
easy to lock down later** — not "unreadable".

## What we do today

1. **No guessable data endpoint.** The JSON is imported at build time and
   bundled + minified into hashed JS chunks (`dist/assets/index-*.js`). There is
   **no** `/(public/)data.json` sitting at a predictable URL to scrape or hot-swap.
   (Verified: the production build emits zero `.json` files.)
2. **Integrity via validation.** All data is parsed through Zod schemas
   (`packages/data/src/schemas.ts`) on load. Malformed or tampered local data
   fails loudly rather than rendering garbage.
3. **A clean seam for the browser.** Every read goes through
   `packages/data/src/repository.ts`; the app never imports JSON directly.
4. **HTTP headers** (`vercel.json`): `nosniff`, `SAMEORIGIN`, a restrictive
   `Content-Security-Policy` that only allows the app's own origin plus the
   Google My Maps iframe (`frame-src https://www.google.com`), and a scoped
   `Permissions-Policy`.

## The upgrade path (when you want real protection)

Because all reads funnel through `repository.ts`, moving the data server-side is
a localized change — **no page or hook changes**:

1. Keep the JSON in `packages/data` but read it **server-side** from a Vercel
   Edge Function (`apps/api` is reserved for this), or a small database.
2. Change the bodies of `getLines()` / `getStops()` / … from
   `import + Zod.parse` to `fetch('/api/lines')` (they are already `async`).
3. Add rate limiting / auth / caching at that API layer.

At that point the browser only ever sees API responses, and the source data
never ships to the client.

## Reporting

For a real deployment, add a contact here (email or form) for responsible
disclosure of any security issues.
