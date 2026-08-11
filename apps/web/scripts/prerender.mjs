/**
 * Post-build prerenderer. The app is a client-rendered SPA, so a fresh
 * `dist/index.html` has an empty <div id="root"> and one generic <title> for
 * every URL — bad for crawlers that don't run JS (Bing, social/link previews)
 * and slower to index for those that do.
 *
 * This writes a real static HTML file per route into dist/, each with its own
 * <title>, meta description, canonical + Open Graph/Twitter tags, JSON-LD
 * structured data, and a semantic, link-rich content snapshot inside #root.
 * React clears #root on mount, so interactive users are unaffected. Also emits
 * sitemap.xml + robots.txt.
 *
 * Runs automatically after `vite build` (see package.json). Copy stays in sync
 * with src/seo/siteMeta.ts (the runtime head manager) by hand.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const DATA = resolve(__dirname, "../../../packages/data/src");

const SITE_URL = "https://kumanovotranzit.com";
const SITE_NAME = "Куманово Транзит";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const TODAY = new Date().toISOString().slice(0, 10);

const lines = JSON.parse(readFileSync(resolve(DATA, "lines.json"), "utf8"));
const stops = JSON.parse(readFileSync(resolve(DATA, "stops.json"), "utf8"));
const stopById = new Map(stops.map((s) => [s.id, s]));
const lineById = new Map(lines.map((l) => [l.id, l]));

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Serialize JSON-LD, neutralizing any "</script>" break-out. */
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(
    /</g,
    "\\u003c",
  )}</script>`;

const crumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: SITE_URL + it.path,
  })),
});

// ---- Structured data + content per route --------------------------------

function homePage() {
  const orgAndSite = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      alternateName: ["Куманово Превоз", "Јавен превоз Куманово", "Prevoz Kumanovo", "Kumanovo Transit"],
      url: SITE_URL + "/",
      logo: `${SITE_URL}/icon.svg`,
      areaServed: "Куманово, Северна Македонија",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL + "/",
      inLanguage: "mk",
    },
  ];
  const linksList = lines
    .map(
      (l) =>
        `<li><a href="/lines/${esc(l.id)}">Линија ${esc(l.num)}: ${esc(
          l.from,
        )} – ${esc(l.to)}</a></li>`,
    )
    .join("");
  const content = `
    <h1>Јавен превоз во Куманово</h1>
    <p>Куманово Транзит е водич за јавниот градски превоз во Куманово — автобуски линии, возен ред, постојки и цени на билети на едно место. Најди го автобускиот превоз низ Куманово, следните поаѓања и планирај рута.</p>
    <nav aria-label="Главна навигација"><ul>
      <li><a href="/lines">Автобуски линии</a></li>
      <li><a href="/stops">Автобуски постојки</a></li>
      <li><a href="/schedule">Возен ред</a></li>
      <li><a href="/planner">Планер на рута</a></li>
      <li><a href="/map">Мапа</a></li>
      <li><a href="/install">Инсталирај ја апликацијата</a></li>
    </ul></nav>
    <h2>Автобуски линии во Куманово</h2>
    <ul>${linksList}</ul>`;
  return { jsonLd: orgAndSite.map(ld).join(""), content };
}

function linesPage() {
  const items = lines
    .map(
      (l) =>
        `<li><a href="/lines/${esc(l.id)}">Линија ${esc(l.num)}: ${esc(
          l.from,
        )} – ${esc(l.to)}</a> — прв ${esc(l.first)}, последен ${esc(
          l.last,
        )}, на секои ${esc(l.freq)} мин</li>`,
    )
    .join("");
  const content = `
    <h1>Автобуски линии во Куманово</h1>
    <p>Сите линии на јавниот превоз во Куманово со рути, прв и последен автобус и фреквенција.</p>
    <ul>${items}</ul>`;
  return {
    jsonLd: ld(crumb([{ name: "Дома", path: "/" }, { name: "Линии", path: "/lines" }])),
    content,
  };
}

function linePage(line) {
  const stopItems = line.stopIds
    .map((sid) => {
      const s = stopById.get(sid);
      const name = s ? s.name : sid;
      return `<li><a href="/stops/${esc(sid)}">${esc(name)}</a></li>`;
    })
    .join("");
  const content = `
    <h1>Линија ${esc(line.num)}: ${esc(line.from)} – ${esc(line.to)}</h1>
    <dl>
      <dt>Прв автобус</dt><dd>${esc(line.first)}</dd>
      <dt>Последен автобус</dt><dd>${esc(line.last)}</dd>
      <dt>Фреквенција</dt><dd>на секои ${esc(line.freq)} минути</dd>
      <dt>Цена</dt><dd>${esc(line.price)} ден</dd>
      <dt>Превозник</dt><dd>${esc(line.company)}</dd>
    </dl>
    <h2>Постојки на линијата</h2>
    <ol>${stopItems}</ol>
    <p><a href="/schedule">Целосен возен ред</a></p>`;
  const busTrip = {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    name: `Линија ${line.num}: ${line.from} – ${line.to}`,
    busNumber: line.num,
    provider: { "@type": "Organization", name: line.company },
    departureBusStop: { "@type": "BusStop", name: line.from },
    arrivalBusStop: { "@type": "BusStop", name: line.to },
  };
  const jsonLd =
    ld(busTrip) +
    ld(
      crumb([
        { name: "Дома", path: "/" },
        { name: "Линии", path: "/lines" },
        { name: `Линија ${line.num}`, path: `/lines/${line.id}` },
      ]),
    );
  return { jsonLd, content };
}

function stopsPage() {
  const items = stops
    .map((s) => `<li><a href="/stops/${esc(s.id)}">${esc(s.name)}</a></li>`)
    .join("");
  const content = `
    <h1>Автобуски постојки во Куманово</h1>
    <p>Најди постојка и види кои линии застануваат таму.</p>
    <ul>${items}</ul>`;
  return {
    jsonLd: ld(crumb([{ name: "Дома", path: "/" }, { name: "Постојки", path: "/stops" }])),
    content,
  };
}

function stopPage(stop) {
  const serving = stop.lines
    .map((lid) => lineById.get(lid))
    .filter(Boolean)
    .map(
      (l) =>
        `<li><a href="/lines/${esc(l.id)}">Линија ${esc(l.num)}: ${esc(
          l.from,
        )} – ${esc(l.to)}</a></li>`,
    )
    .join("");
  const content = `
    <h1>Постојка ${esc(stop.name)}</h1>
    <p>Автобуска постојка во Куманово. Линии што застануваат тука:</p>
    <ul>${serving || "<li>Нема податоци за линии.</li>"}</ul>`;
  const busStop = {
    "@context": "https://schema.org",
    "@type": "BusStop",
    name: stop.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Куманово",
      addressCountry: "MK",
    },
  };
  const jsonLd =
    ld(busStop) +
    ld(
      crumb([
        { name: "Дома", path: "/" },
        { name: "Постојки", path: "/stops" },
        { name: stop.name, path: `/stops/${stop.id}` },
      ]),
    );
  return { jsonLd, content };
}

/** Simple content-only pages (breadcrumb + heading + copy). */
function simplePage(path, name, h1, body) {
  return {
    jsonLd: ld(crumb([{ name: "Дома", path: "/" }, { name, path }])),
    content: `<h1>${esc(h1)}</h1><p>${esc(body)}</p><p><a href="/">Почетна</a></p>`,
  };
}

// ---- Route table ---------------------------------------------------------

const META = {
  "/": {
    title: "Јавен превоз Куманово — линии, возен ред и постојки | Куманово Транзит",
    description:
      "Автобуски превоз во Куманово: сите линии, возен ред, постојки и цени. Најди поаѓања и планирај рута со јавниот градски превоз во Куманово.",
  },
  "/lines": {
    title: "Автобуски линии во Куманово — јавен превоз | Куманово Транзит",
    description:
      "Сите линии на јавниот превоз во Куманово: рути, прв и последен автобус, фреквенција и цени на билети за автобускиот превоз.",
  },
  "/stops": {
    title: "Автобуски постојки во Куманово | Куманово Транзит",
    description:
      "Најди автобуска постојка во Куманово и види кои линии застануваат таму и кога се следните поаѓања.",
  },
  "/schedule": {
    title: "Возен ред за јавен превоз во Куманово | Куманово Транзит",
    description:
      "Целосен возен ред на автобуските линии во Куманово по работен ден, сабота и недела/празник.",
  },
  "/planner": {
    title: "Планер на рута — јавен превоз Куманово | Куманово Транзит",
    description:
      "Планирај патување со јавен превоз во Куманово: избери почетна и крајна постојка и најди директна линија.",
  },
  "/map": {
    title: "Мапа на линии и постојки — Куманово | Куманово Транзит",
    description:
      "Интерактивна мапа на автобуските линии и постојки на јавниот превоз во Куманово.",
  },
  "/install": {
    title: "Инсталирај ја апликацијата Куманово Транзит",
    description:
      "Додади го Куманово Транзит на почетниот екран на телефонот за брз пристап до линии, постојки и возен ред.",
  },
  "/terms": {
    title: "Услови и политика на употреба | Куманово Транзит",
    description:
      "Услови и политика на употреба на апликацијата Куманово Транзит за јавниот превоз во Куманово.",
  },
};

const routes = [
  { path: "/", ...homePage(), priority: "1.0", changefreq: "daily" },
  { path: "/lines", ...linesPage(), priority: "0.9", changefreq: "weekly" },
  { path: "/stops", ...stopsPage(), priority: "0.8", changefreq: "weekly" },
  {
    path: "/schedule",
    ...simplePage(
      "/schedule",
      "Возен ред",
      "Возен ред за јавен превоз во Куманово",
      "Целосен возен ред на автобуските линии во Куманово по работен ден, сабота и недела или празник.",
    ),
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/planner",
    ...simplePage(
      "/planner",
      "Планер",
      "Планер на рута — јавен превоз Куманово",
      "Избери почетна и крајна постојка и најди директна автобуска линија во Куманово.",
    ),
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/map",
    ...simplePage(
      "/map",
      "Мапа",
      "Мапа на линии и постојки во Куманово",
      "Интерактивна мапа на автобуските линии и постојки на јавниот превоз во Куманово.",
    ),
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/install",
    ...simplePage(
      "/install",
      "Инсталирај",
      "Инсталирај ја апликацијата Куманово Транзит",
      "Додади го Куманово Транзит на почетниот екран на телефонот за брз пристап до линии, постојки и возен ред.",
    ),
    priority: "0.5",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    ...simplePage(
      "/terms",
      "Услови",
      "Услови и политика на употреба",
      "Услови и политика на употреба на апликацијата Куманово Транзит.",
    ),
    priority: "0.3",
    changefreq: "yearly",
  },
];

for (const line of lines) {
  routes.push({
    path: `/lines/${line.id}`,
    meta: {
      title: `Линија ${line.num}: ${line.from} – ${line.to} — возен ред | Куманово Транзит`,
      description: `Возен ред, постојки, фреквенција и цена за автобуска линија ${line.num} (${line.from} – ${line.to}) во јавниот превоз во Куманово.`,
    },
    ...linePage(line),
    priority: "0.7",
    changefreq: "weekly",
  });
}
for (const stop of stops) {
  routes.push({
    path: `/stops/${stop.id}`,
    meta: {
      title: `Постојка ${stop.name} — линии и поаѓања | Куманово Транзит`,
      description: `Автобуска постојка ${stop.name} во Куманово: кои линии застануваат тука и следни поаѓања.`,
    },
    ...stopPage(stop),
    priority: "0.5",
    changefreq: "weekly",
  });
}

// ---- Render + write ------------------------------------------------------

const template = readFileSync(resolve(DIST, "index.html"), "utf8");

function render(route) {
  const meta = route.meta || META[route.path];
  if (!meta) throw new Error(`No meta for route ${route.path}`);
  const url = SITE_URL + (route.path === "/" ? "/" : route.path);
  const t = esc(meta.title);
  const d = esc(meta.description);

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${d}$2`,
    )
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(
      /(<meta name="twitter:description" content=")[^"]*(")/,
      `$1${d}$2`,
    )
    .replace("</head>", `${route.jsonLd}</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root"><div id="kt-seo">${route.content}</div></div>`,
    );

  return html;
}

let count = 0;
for (const route of routes) {
  const html = render(route);
  const outDir = route.path === "/" ? DIST : resolve(DIST, "." + route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  count++;
}

// robots.txt
writeFileSync(
  resolve(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

// sitemap.xml
const urls = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${
        r.path === "/" ? "/" : r.path
      }</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${
        r.changefreq
      }</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  )
  .join("\n");
writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(
  `Prerendered ${count} routes + sitemap.xml + robots.txt (${lines.length} lines, ${stops.length} stops).`,
);
