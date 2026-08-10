# Куманово Транзит

Rider-facing public-transit app for Kumanovo (MK / EN / SQ): lines, stops, live
departures, timetables (Возен ред) with per-trip skipped-stop detail, a simple
route planner, and a PWA install guide. Built to grow into a native Flutter app
and a real backend without rewrites.

## Monorepo layout

```
apps/
  web/            React + TypeScript + Vite (this app)
  mobile/         Flutter app            — reserved for later
  api/            Backend                — reserved for later
packages/
  data/           JSON content + Zod schemas + the data-access "repository" seam
  shared/         framework-agnostic domain logic + i18n (usable by web & api)
```

Web imports the shared packages straight from their TypeScript source via the
`@kt/data` / `@kt/shared` aliases — no per-package build step.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build to apps/web/dist
pnpm preview    # serve the production build
pnpm typecheck  # type-check every workspace package
```

Requires Node ≥ 20 and pnpm.

## Where the data lives

All transit content is JSON in **`packages/data/src/`**
(`lines.json`, `stops.json`, `neighborhoods.json`) — this is the single source
of truth. Timetables are stored as raw departure times + per-trip skip info;
weekday/weekend/sunday and reverse-direction schedules are **derived** at load
time (`derive.ts`). Every read is validated with Zod (`schemas.ts`), so a typo
introduced while converting paper timetables fails loudly in development.

Pages never touch JSON directly — they call the repository
(`packages/data/src/repository.ts`) through React Query hooks
(`apps/web/src/hooks/useTransitData.ts`). Adding a line or stop is a pure data
edit: it appears automatically across Home, Lines, Stops, Schedule and Planner.

See [SECURITY.md](./SECURITY.md) for how the data is protected and the path to a
real backend.

## Design system

The look reproduces the bound **Modernist** design system (red `#ec3013`
accent, 2px rules) with the prototype's overrides: Montserrat type, rounded
cards, circular line badges, and a mobile bottom-nav with a raised center FAB.
Tokens live in `apps/web/src/styles/tokens.css`; ported component classes in
`components.css`. The original prototype is under `design & prototype/`.

## Deploying (Vercel)

`vercel.json` builds `apps/web`, serves `apps/web/dist`, and sets security
headers (CSP allowing only the Google My Maps iframe + self). The framework
preset is Vite.
