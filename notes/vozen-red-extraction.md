# `vozen-red.pdf` Extraction Inventory

Source file: `/Users/andrej/Downloads/vozen-red.pdf`

## Import Rules For This Repo

- The left side of each timetable is the forward direction and maps to `times`.
- The right side of each timetable is the return direction and maps to `timesRev`.
- The ordered stop list in the middle maps to `stopIds`.
- Not every departure serves every stop. When a departure skips part of the route, it must be represented with `tripInfo[HH:MM].skipIds` or `tripInfoRev[HH:MM].skipIds`.
- Do not assume a line is “full-stop” service unless the PDF page clearly shows that every listed stop is served by that departure.

## Current Repo State

- `packages/data/src/lines.json` currently contains lines `1`, `2`, `3`, `4`, `5`, `8`, `10`, `19`, `20`, `21`, `22`, `23`, `24`, and `26`.
- Line `8` already uses the correct repo pattern for partial-stop departures via `tripInfo` and `tripInfoRev`.
- The remaining PDF lines still need staged extraction before they can be safely added to runtime data.

## Page Inventory

| Pages | Line | Route title read from PDF | Status |
| --- | --- | --- | --- |
| 1 | 1 | `с.Проевце - Бединје` | imported |
| 2-3 | 2 | `Горно Којнаре - Долно Којнаре - Куманово` | imported |
| 4 | 3 | `Зелен Рид - Жел. Станица` | imported, branch rows should be re-verified later |
| 5 | 4 | `Бединје - с. Доброшане` | imported |
| 6-7 | 5 | `Ливаде - с. Карпош - Жел. Станица` | already in app, PDF still useful for verification |
| 8 | 6 | `Режановце - Куманово` | title confirmed |
| 9-10 | 7 | `Куманово - Бединје - с. Лопате` | title confirmed |
| 11-12 | 8 | `Бединје - с. Тромегја` | partially imported in app, needs exact verification |
| 13 | 9 | `с. Черкези - Куманово` | title confirmed |
| 14-15 | 10 | `с. Биљановце - Бединје` | already in app, PDF still useful for verification |
| 16 | 11 | `с. Умин Дол - с. Ново Село - с. Љубодраг - Куманово` | title confirmed |
| 17 | 12 | `Романовце - Куманово` | title confirmed |
| 18 | 13 | `Куманово - Речица` | title confirmed |
| 19 | 14 | `Автобуска станица - с. Орашац` | title confirmed |
| 20 | 15 | `Куманово - с. Шупли Камен` | title confirmed |
| 21 | 16 | `Куманово - Табановце - Карабичане - с. Сопот` | title confirmed |
| 22 | 17 | `Куманово - с. Табановце (Станиште)` | title mostly confirmed, re-check wording before import |
| 23 | 18 | `Куманово - с. Скачковце` | title confirmed |
| 24 | 19 | `Куманово - с. Пчиња - с. Студена Бара` | imported |
| 25 | 20 | `Куманово - с. Четирце` | imported |
| 26 | 21 | `Куманово - с. Градиште - с. Пезово - с. Клече - с. Кокошиње` | imported |
| 27 | 22 | `Куманово - с. Новосељане - с. Косматац - с. Мургаш` | imported |
| 28 | 23 | `Куманово - с. Кучкарево - с. Габреш` | single-page table readable |
| 29 | 24 | `Куманово - Костурник` | single-page table readable |
| 30 | 26 | `Бајрам Шабани - Бединје` | single-page table readable |

## Numbering Note

- No line `25` was identified in the 30 scanned pages that were rendered from this PDF.
- The document appears to jump from line `24` on page `29` to line `26` on page `30`.
- This should be treated as a source-document gap until another scan or municipal source confirms line `25`.

## Exact Single-Page Extracts Already Readable

These are the best candidates for the next direct import pass because the scans are clear and the whole table fits on one page.

### Line 23

- Route: `Куманово - с. Кучкарево - с. Габреш`
- Forward departures: `07:30`, `12:00`, `15:00`
- Return departures: `09:10`, `13:50`, `16:50`
- Stops visible on the page: `Ав.станица`, `Ул.11-ти Октомври`, `3 МУБ`, `Р-1204`, `с.Кучкарево`, `с.Габреш`

### Line 24

- Route: `Куманово - Костурник`
- Forward departures: `06:00`, `07:00`, `08:00`, `10:00`, `11:30`, `13:00`, `15:00`, `17:20`, `19:00`
- Return departures: `07:00`, `08:00`, `10:00`, `11:30`, `13:00`, `15:00`, `17:00`, `19:00`, `20:00`
- Stops visible on the page: `Куманово`, `Костурник`

### Line 26

- Route: `Бајрам Шабани - Бединје`
- Forward departures: `06:00`, `12:00`, `13:00`, `19:00`
- Return departures: `07:00`, `13:00`, `14:00`, `20:00`
- Stops visible on the page: `Б. Шабани`, `Центар`, `11ти Окт.`, `11ти Ное.`, `Бединје`

## Next Import Order

1. Revisit the still-missing lines: `6`, `7`, `9`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`.
2. Re-verify branch and short-turn metadata for lines `2`, `3`, and `8`, where the scan quality makes some `skipIds` less certain.
3. Confirm whether another municipal scan exists for line `25`.
