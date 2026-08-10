# apps/mobile — Flutter (reserved)

The native mobile app will live here. It reuses the same source of truth as the
web app:

- **Content**: `packages/data/src/*.json` — the identical timetables/stops.
  Either bundle these assets into the Flutter app or (preferably) fetch them
  from the future `apps/api`, which reads the same JSON server-side.
- **Domain rules**: the logic in `packages/shared` (status, departures,
  schedule derivation, i18n string keys) is the reference implementation to port
  to Dart, so web and mobile behave identically.

Suggested first step: `flutter create .` in this folder, then mirror the screen
list from `apps/web/src/features` (home, lines, line detail, stops, stop detail,
schedule, planner, map, terms, install).
