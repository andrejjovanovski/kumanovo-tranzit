# Куманово Транзит

Mobile-first public transit app for Kumanovo (МК/EN/SQ), plus an admin back-office and marketing/collateral assets. Built as Design Components (`.dc.html`) — open any file directly in a browser.

## Files

**Public app**
- `Kumanovo Transit.dc.html` — the rider-facing PWA: home, live departures, Возен ред (schedules) with accordion stop details and forward/return direction toggle, stops list, map, language switcher, Terms & Usage, PWA install guide (Android/iOS walkthroughs).
- `Kumanovo Transit Logo.dc.html` — logo lockups.

**Admin**
- `Kumanovo Transit Admin.dc.html` — back-office for company owners and super-admin (company filter dropdown for super-admin).

**Marketing**
- `Facebook Ad Mockup.dc.html`, `Instagram Story Ad.dc.html` — ad creative mockups.
- `Kumanovo Transit Municipal Presentation.dc.html` — 3-page A4 proposal document for the Municipality of Kumanovo (built on `doc-page.js`).

**Shared/support**
- `ios-frame.jsx` — device bezel for mockups.
- `image-slot.js`, `doc-page.js` — starter components (drag-drop image placeholders; paged-document shell).
- `support.js` — DC runtime, do not edit.
- `_ds/` — bound Modernist design system (tokens, bundle, docs).
- `screenshots/` — captured app screenshots used in the municipal presentation.

## Data

Two lines: Line 5 (52 departures, 05:05–22:35, short-workings) and Line 10 (15 departures, selective stop coverage). Each line has separate forward/return timetables and per-trip skipped-stop info. Line/company/schedule data lives inline in `Kumanovo Transit.dc.html`; all user-facing state (language, accepted terms, etc.) persists to `localStorage`.

## Design system

Modernist (flat, Archivo type, red-on-white, 2px rules, zero radius). Loaded via `_ds/modernist-.../styles.css` + `_ds_bundle.js`. Follow its tokens (`var(--color-*)`, `var(--space-*)`, etc.) rather than hardcoding values.

## Notes

- Admin app filters by company; super-admin sees a company-switcher in the header.
- Install guide has real screenshots for Android/iOS wired into `image-slot` placeholders where available.
- To open: any `.dc.html` file works standalone in a browser.
