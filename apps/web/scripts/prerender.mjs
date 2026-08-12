/**
 * Post-build prerenderer. The app is a client-rendered SPA, so a fresh
 * `dist/index.html` has an empty <div id="root"> and one generic <title> for
 * every URL — bad for crawlers that don't run JS (Bing, social/link previews)
 * and slower to index for those that do.
 *
 * This writes a real static HTML file per route per language into dist/, each
 * with its own <html lang>, <title>, meta description, canonical, hreflang
 * alternates, Open Graph/Twitter tags, JSON-LD structured data, and a semantic,
 * link-rich content snapshot inside #root. React clears #root on mount, so
 * interactive users are unaffected. Also emits sitemap.xml + robots.txt.
 *
 * Languages get their own URL trees — MK at the root, EN under /en, SQ under
 * /sq — because a Macedonian-only page cannot rank for English or Albanian
 * queries. The SPA mounts its router with the prefix as `basename`, so the same
 * files serve all three (see src/i18n/langUrl.ts).
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

/** Canonical host: the apex 308-redirects to www, so www is what we advertise. */
const SITE_URL = "https://www.kumanovotranzit.com";
const SITE_NAME = "Куманово Транзит";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const TODAY = new Date().toISOString().slice(0, 10);

const LANGS = ["mk", "en", "sq"];
const PREFIX = { mk: "", en: "/en", sq: "/sq" };
const HTML_LANG = { mk: "mk", en: "en", sq: "sq" };
const OG_LOCALE = { mk: "mk_MK", en: "en_US", sq: "sq_AL" };

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

/** Absolute URL for a language-neutral route path in a given language. */
const urlFor = (path, lang) =>
  SITE_URL + (PREFIX[lang] + (path === "/" ? "" : path) || "/");

/** Pick the variant for a language from a {mk, en, sq} bundle. */
const t = (lang, bundle) => bundle[lang];

// ---- Localized data accessors -------------------------------------------

const lineFrom = (l, lang) =>
  lang === "en" ? l.fromEn : lang === "sq" ? l.fromSq : l.from;
const lineTo = (l, lang) =>
  lang === "en" ? l.toEn : lang === "sq" ? l.toSq : l.to;
const stopName = (s, lang) =>
  lang === "en" ? s.nameEn : lang === "sq" ? s.nameSq : s.name;
const company = (l, lang) => (lang === "mk" ? l.company : l.companyEn);

const prices = lines.map((l) => l.price).filter((p) => typeof p === "number");
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const priceRange =
  minPrice === maxPrice ? `${minPrice}` : `${minPrice}–${maxPrice}`;

// ---- Shared copy ---------------------------------------------------------

const WORDS = {
  home: { mk: "Дома", en: "Home", sq: "Ballina" },
  lines: { mk: "Линии", en: "Lines", sq: "Linjat" },
  stops: { mk: "Постојки", en: "Stops", sq: "Stacionet" },
  schedule: { mk: "Возен ред", en: "Timetable", sq: "Orari" },
  planner: { mk: "Планер", en: "Planner", sq: "Planifikuesi" },
  map: { mk: "Мапа", en: "Map", sq: "Harta" },
  install: { mk: "Инсталирај", en: "Install", sq: "Instalo" },
  terms: { mk: "Услови", en: "Terms", sq: "Kushtet" },
  line: { mk: "Линија", en: "Line", sq: "Linja" },
  navLines: {
    mk: "Автобуски линии",
    en: "Bus lines",
    sq: "Linjat e autobusit",
  },
  navStops: {
    mk: "Автобуски постојки",
    en: "Bus stops",
    sq: "Stacionet e autobusit",
  },
  installLong: {
    mk: "Инсталирај ја апликацијата",
    en: "Install the app",
    sq: "Instalo aplikacionin",
  },
  firstBus: { mk: "прв", en: "first", sq: "i pari" },
  lastBus: { mk: "последен", en: "last", sq: "i fundit" },
  every: { mk: "на секои", en: "every", sq: "çdo" },
  minutes: { mk: "мин", en: "min", sq: "min" },
  backHome: { mk: "Почетна", en: "Home", sq: "Ballina" },
  faqHeading: {
    mk: "Често поставувани прашања",
    en: "Frequently asked questions",
    sq: "Pyetjet e bëra shpesh",
  },
  otherLangs: {
    mk: "Оваа страница на други јазици",
    en: "This page in other languages",
    sq: "Kjo faqe në gjuhë të tjera",
  },
  langName: { mk: "Македонски", en: "English", sq: "Shqip" },
};

const w = (key, lang) => WORDS[key][lang];

/** Cross-language links, so crawlers reach every tree from any page. */
function langLinks(path, lang) {
  const others = LANGS.filter((l) => l !== lang)
    .map(
      (l) =>
        `<li><a href="${esc(urlFor(path, l))}" hreflang="${HTML_LANG[l]}">${esc(
          WORDS.langName[l],
        )}</a></li>`,
    )
    .join("");
  return `<nav aria-label="${esc(w("otherLangs", lang))}"><p>${esc(
    w("otherLangs", lang),
  )}:</p><ul>${others}</ul></nav>`;
}

const crumb = (items, lang) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: urlFor(it.path, lang),
  })),
});

const homeCrumb = (lang) => ({ name: w("home", lang), path: "/" });

/** <h2>-headed FAQ block plus its FAQPage structured data. */
function faq(entries, lang) {
  const html = entries
    .map((e) => `<h3>${esc(e.q)}</h3><p>${esc(e.a)}</p>`)
    .join("");
  const jsonLd = ld({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: HTML_LANG[lang],
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  });
  return {
    html: `<section><h2>${esc(w("faqHeading", lang))}</h2>${html}</section>`,
    jsonLd,
  };
}

// ---- Structured data + content per route --------------------------------

const HOME_FAQ = {
  mk: [
    {
      q: "Каде можам да го најдам возниот ред за автобусите во Куманово?",
      a: `Целосниот возен ред за сите ${lines.length} линии на јавниот превоз во Куманово е на страницата „Возен ред“, поделен по работен ден, сабота и недела или празник. Секоја линија има и своја страница со поаѓања и постојки.`,
    },
    {
      q: "Колку чини билет за автобус во Куманово?",
      a: `Цената на билетот зависи од линијата и се движи околу ${priceRange} денари. Точната цена е наведена на страницата на секоја линија.`,
    },
    {
      q: "Кои автобуски линии возат во Куманово?",
      a: `Во Куманово има ${lines.length} линии на градски и приградски автобуски превоз, кои опслужуваат ${stops.length} постојки. Сите се наведени на страницата „Автобуски линии“.`,
    },
    {
      q: "Дали Куманово Транзит прикажува автобуси во живо?",
      a: "Не. Куманово Транзит го прикажува официјалниот возен ред и пресметува кои се следните поаѓања според него — нема следење на автобуси во реално време.",
    },
  ],
  en: [
    {
      q: "Where can I find the Kumanovo bus timetable?",
      a: `The full timetable for all ${lines.length} public transport lines in Kumanovo is on the Timetable page, split by weekday, Saturday and Sunday/holiday. Each line also has its own page with departures and stops.`,
    },
    {
      q: "How much does a bus ticket cost in Kumanovo?",
      a: `Ticket prices depend on the line and are around ${priceRange} MKD. The exact fare is listed on each line's page.`,
    },
    {
      q: "Which bus lines run in Kumanovo?",
      a: `Kumanovo has ${lines.length} city and suburban bus lines serving ${stops.length} stops. They are all listed on the Bus lines page.`,
    },
    {
      q: "Does Kumanovo Transit show buses in real time?",
      a: "No. Kumanovo Transit shows the official timetable and works out the next departures from it — there is no live vehicle tracking.",
    },
  ],
  sq: [
    {
      q: "Ku mund ta gjej orarin e autobusëve në Kumanovë?",
      a: `Orari i plotë për të gjitha ${lines.length} linjat e transportit publik në Kumanovë ndodhet te faqja „Orari“, i ndarë për ditë pune, të shtunë dhe të diel/festë. Çdo linjë ka edhe faqen e vet me nisjet dhe stacionet.`,
    },
    {
      q: "Sa kushton bileta e autobusit në Kumanovë?",
      a: `Çmimi i biletës varet nga linja dhe sillet rreth ${priceRange} denarë. Çmimi i saktë është shënuar te faqja e secilës linjë.`,
    },
    {
      q: "Cilat linja autobusi qarkullojnë në Kumanovë?",
      a: `Kumanova ka ${lines.length} linja autobusi urban dhe periferik që shërbejnë ${stops.length} stacione. Të gjitha janë të listuara te faqja „Linjat e autobusit“.`,
    },
    {
      q: "A i tregon Kumanovo Transit autobusët në kohë reale?",
      a: "Jo. Kumanovo Transit tregon orarin zyrtar dhe llogarit nisjet e radhës sipas tij — nuk ka gjurmim të autobusëve në kohë reale.",
    },
  ],
};

const HOME_H1 = {
  mk: "Јавен превоз во Куманово",
  en: "Public transport in Kumanovo",
  sq: "Transporti publik në Kumanovë",
};

const HOME_INTRO = {
  mk: `Куманово Транзит е водич за јавниот градски и приградски превоз во Куманово — ${lines.length} автобуски линии, возен ред, ${stops.length} постојки и цени на билети на едно место. Најди ги следните поаѓања и планирај рута низ градот. Страницата ја бараат и со латиница: javen prevoz Kumanovo, avtobuski linii Kumanovo, vozen red Kumanovo, avtobus Kumanovo, gradski prevoz Kumanovo.`,
  en: `Kumanovo Transit is a guide to public transport in Kumanovo, North Macedonia — ${lines.length} city and suburban bus lines, the full bus timetable, ${stops.length} bus stops and ticket prices in one place. Find the next departures and plan a route across the city.`,
  sq: `Kumanovo Transit është udhëzues për transportin publik urban dhe periferik në Kumanovë — ${lines.length} linja autobusi, orari i plotë, ${stops.length} stacione dhe çmimet e biletave në një vend. Gjej nisjet e radhës dhe planifiko rrugën nëpër qytet.`,
};

function homePage(lang) {
  const orgAndSite = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      alternateName: [
        "Куманово Транзит",
        "Куманово Превоз",
        "Јавен превоз Куманово",
        "Javen prevoz Kumanovo",
        "Prevoz Kumanovo",
        "Kumanovo Transit",
        "Kumanovo public transport",
        "Transporti publik Kumanovë",
      ],
      url: urlFor("/", lang),
      logo: `${SITE_URL}/icon.svg`,
      areaServed: {
        "@type": "City",
        name: t(lang, { mk: "Куманово", en: "Kumanovo", sq: "Kumanovë" }),
        addressCountry: "MK",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: "Kumanovo Transit",
      url: urlFor("/", lang),
      inLanguage: HTML_LANG[lang],
    },
  ];

  const linksList = lines
    .map(
      (l) =>
        `<li><a href="${esc(urlFor(`/lines/${l.id}`, lang))}">${esc(
          w("line", lang),
        )} ${esc(l.num)}: ${esc(lineFrom(l, lang))} – ${esc(
          lineTo(l, lang),
        )}</a></li>`,
    )
    .join("");

  const nav = [
    ["/lines", w("navLines", lang)],
    ["/stops", w("navStops", lang)],
    ["/schedule", w("schedule", lang)],
    ["/planner", t(lang, { mk: "Планер на рута", en: "Route planner", sq: "Planifikuesi i rrugës" })],
    ["/map", w("map", lang)],
    ["/install", w("installLong", lang)],
  ]
    .map(
      ([path, label]) =>
        `<li><a href="${esc(urlFor(path, lang))}">${esc(label)}</a></li>`,
    )
    .join("");

  const questions = faq(HOME_FAQ[lang], lang);

  const content = `
    <h1>${esc(HOME_H1[lang])}</h1>
    <p>${esc(HOME_INTRO[lang])}</p>
    <nav aria-label="${esc(
      t(lang, { mk: "Главна навигација", en: "Main navigation", sq: "Navigimi kryesor" }),
    )}"><ul>${nav}</ul></nav>
    <h2>${esc(
      t(lang, {
        mk: "Автобуски линии во Куманово",
        en: "Bus lines in Kumanovo",
        sq: "Linjat e autobusit në Kumanovë",
      }),
    )}</h2>
    <ul>${linksList}</ul>
    ${questions.html}
    ${langLinks("/", lang)}`;

  return {
    jsonLd: orgAndSite.map(ld).join("") + questions.jsonLd,
    content,
  };
}

function linesPage(lang) {
  const items = lines
    .map(
      (l) =>
        `<li><a href="${esc(urlFor(`/lines/${l.id}`, lang))}">${esc(
          w("line", lang),
        )} ${esc(l.num)}: ${esc(lineFrom(l, lang))} – ${esc(
          lineTo(l, lang),
        )}</a> — ${esc(w("firstBus", lang))} ${esc(l.first)}, ${esc(
          w("lastBus", lang),
        )} ${esc(l.last)}, ${esc(w("every", lang))} ${esc(l.freq)} ${esc(
          w("minutes", lang),
        )}</li>`,
    )
    .join("");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t(lang, {
      mk: "Автобуски линии во Куманово",
      en: "Bus lines in Kumanovo",
      sq: "Linjat e autobusit në Kumanovë",
    }),
    numberOfItems: lines.length,
    itemListElement: lines.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${w("line", lang)} ${l.num}: ${lineFrom(l, lang)} – ${lineTo(l, lang)}`,
      url: urlFor(`/lines/${l.id}`, lang),
    })),
  };

  const content = `
    <h1>${esc(
      t(lang, {
        mk: "Автобуски линии во Куманово",
        en: "Bus lines in Kumanovo",
        sq: "Linjat e autobusit në Kumanovë",
      }),
    )}</h1>
    <p>${esc(
      t(lang, {
        mk: "Сите линии на јавниот превоз во Куманово со рути, прв и последен автобус и фреквенција.",
        en: "Every public transport line in Kumanovo with its route, first and last bus and frequency.",
        sq: "Të gjitha linjat e transportit publik në Kumanovë me rrugët, autobusin e parë dhe të fundit dhe frekuencën.",
      }),
    )}</p>
    <ul>${items}</ul>
    ${langLinks("/lines", lang)}`;

  return {
    jsonLd:
      ld(itemList) +
      ld(
        crumb(
          [homeCrumb(lang), { name: w("lines", lang), path: "/lines" }],
          lang,
        ),
      ),
    content,
  };
}

function linePage(line, lang) {
  const from = lineFrom(line, lang);
  const to = lineTo(line, lang);
  const stopItems = line.stopIds
    .map((sid) => {
      const s = stopById.get(sid);
      const name = s ? stopName(s, lang) : sid;
      return `<li><a href="${esc(urlFor(`/stops/${sid}`, lang))}">${esc(
        name,
      )}</a></li>`;
    })
    .join("");

  const labels = t(lang, {
    mk: {
      first: "Прв автобус",
      last: "Последен автобус",
      freq: "Фреквенција",
      freqVal: `на секои ${line.freq} минути`,
      price: "Цена",
      priceVal: `${line.price} ден`,
      operator: "Превозник",
      stopsH2: "Постојки на линијата",
      full: "Целосен возен ред",
      intro: `Возен ред, постојки и цена за автобуската линија ${line.num} во јавниот превоз во Куманово.`,
    },
    en: {
      first: "First bus",
      last: "Last bus",
      freq: "Frequency",
      freqVal: `every ${line.freq} minutes`,
      price: "Fare",
      priceVal: `${line.price} MKD`,
      operator: "Operator",
      stopsH2: "Stops on this line",
      full: "Full timetable",
      intro: `Timetable, stops and fare for bus line ${line.num} of Kumanovo public transport.`,
    },
    sq: {
      first: "Autobusi i parë",
      last: "Autobusi i fundit",
      freq: "Frekuenca",
      freqVal: `çdo ${line.freq} minuta`,
      price: "Çmimi",
      priceVal: `${line.price} denarë`,
      operator: "Operatori",
      stopsH2: "Stacionet e kësaj linje",
      full: "Orari i plotë",
      intro: `Orari, stacionet dhe çmimi për linjën e autobusit ${line.num} të transportit publik në Kumanovë.`,
    },
  });

  const content = `
    <h1>${esc(w("line", lang))} ${esc(line.num)}: ${esc(from)} – ${esc(to)}</h1>
    <p>${esc(labels.intro)}</p>
    <dl>
      <dt>${esc(labels.first)}</dt><dd>${esc(line.first)}</dd>
      <dt>${esc(labels.last)}</dt><dd>${esc(line.last)}</dd>
      <dt>${esc(labels.freq)}</dt><dd>${esc(labels.freqVal)}</dd>
      <dt>${esc(labels.price)}</dt><dd>${esc(labels.priceVal)}</dd>
      <dt>${esc(labels.operator)}</dt><dd>${esc(company(line, lang))}</dd>
    </dl>
    <h2>${esc(labels.stopsH2)}</h2>
    <ol>${stopItems}</ol>
    <p><a href="${esc(urlFor("/schedule", lang))}">${esc(labels.full)}</a></p>
    ${langLinks(`/lines/${line.id}`, lang)}`;

  const busTrip = {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    name: `${w("line", lang)} ${line.num}: ${from} – ${to}`,
    busNumber: line.num,
    provider: { "@type": "Organization", name: company(line, lang) },
    departureBusStop: { "@type": "BusStop", name: from },
    arrivalBusStop: { "@type": "BusStop", name: to },
    offers: {
      "@type": "Offer",
      price: line.price,
      priceCurrency: "MKD",
    },
  };

  const jsonLd =
    ld(busTrip) +
    ld(
      crumb(
        [
          homeCrumb(lang),
          { name: w("lines", lang), path: "/lines" },
          { name: `${w("line", lang)} ${line.num}`, path: `/lines/${line.id}` },
        ],
        lang,
      ),
    );

  return { jsonLd, content };
}

function stopsPage(lang) {
  const items = stops
    .map(
      (s) =>
        `<li><a href="${esc(urlFor(`/stops/${s.id}`, lang))}">${esc(
          stopName(s, lang),
        )}</a></li>`,
    )
    .join("");

  const content = `
    <h1>${esc(
      t(lang, {
        mk: "Автобуски постојки во Куманово",
        en: "Bus stops in Kumanovo",
        sq: "Stacionet e autobusit në Kumanovë",
      }),
    )}</h1>
    <p>${esc(
      t(lang, {
        mk: `Најди постојка меѓу ${stops.length} автобуски постојки во Куманово и види кои линии застануваат таму.`,
        en: `Find a stop among ${stops.length} bus stops in Kumanovo and see which lines call there.`,
        sq: `Gjej një stacion mes ${stops.length} stacioneve të autobusit në Kumanovë dhe shiko cilat linja ndalojnë aty.`,
      }),
    )}</p>
    <ul>${items}</ul>
    ${langLinks("/stops", lang)}`;

  return {
    jsonLd: ld(
      crumb(
        [homeCrumb(lang), { name: w("stops", lang), path: "/stops" }],
        lang,
      ),
    ),
    content,
  };
}

function stopPage(stop, lang) {
  const name = stopName(stop, lang);
  const serving = stop.lines
    .map((lid) => lineById.get(lid))
    .filter(Boolean)
    .map(
      (l) =>
        `<li><a href="${esc(urlFor(`/lines/${l.id}`, lang))}">${esc(
          w("line", lang),
        )} ${esc(l.num)}: ${esc(lineFrom(l, lang))} – ${esc(
          lineTo(l, lang),
        )}</a></li>`,
    )
    .join("");

  const content = `
    <h1>${esc(
      t(lang, {
        mk: `Постојка ${name}`,
        en: `${name} bus stop`,
        sq: `Stacioni ${name}`,
      }),
    )}</h1>
    <p>${esc(
      t(lang, {
        mk: "Автобуска постојка во Куманово. Линии што застануваат тука:",
        en: "A bus stop in Kumanovo. Lines calling here:",
        sq: "Stacion autobusi në Kumanovë. Linjat që ndalojnë këtu:",
      }),
    )}</p>
    <ul>${
      serving ||
      `<li>${esc(
        t(lang, {
          mk: "Нема податоци за линии.",
          en: "No line data.",
          sq: "Nuk ka të dhëna për linjat.",
        }),
      )}</li>`
    }</ul>
    ${langLinks(`/stops/${stop.id}`, lang)}`;

  const busStop = {
    "@context": "https://schema.org",
    "@type": "BusStop",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: t(lang, {
        mk: "Куманово",
        en: "Kumanovo",
        sq: "Kumanovë",
      }),
      addressCountry: "MK",
    },
  };

  const jsonLd =
    ld(busStop) +
    ld(
      crumb(
        [
          homeCrumb(lang),
          { name: w("stops", lang), path: "/stops" },
          { name, path: `/stops/${stop.id}` },
        ],
        lang,
      ),
    );

  return { jsonLd, content };
}

/** Simple content-only pages (breadcrumb + heading + copy). */
function simplePage(path, crumbName, h1, body, lang) {
  return {
    jsonLd: ld(crumb([homeCrumb(lang), { name: crumbName, path }], lang)),
    content: `<h1>${esc(h1)}</h1><p>${esc(body)}</p><p><a href="${esc(
      urlFor("/", lang),
    )}">${esc(w("backHome", lang))}</a></p>${langLinks(path, lang)}`,
  };
}

// ---- Route table ---------------------------------------------------------

/**
 * Per-language titles and descriptions. Mirrors src/seo/siteMeta.ts — the
 * Macedonian copy deliberately carries Latin-script spellings of the common
 * queries, since many local searches are typed in Latin letters.
 */
const META = {
  mk: {
    "/": {
      title: "Јавен превоз Куманово — линии, возен ред и постојки | Куманово Транзит",
      description:
        "Автобуски превоз во Куманово: сите линии, возен ред, постојки и цени. Најди поаѓања и планирај рута со јавниот градски превоз во Куманово (javen prevoz Kumanovo).",
    },
    "/lines": {
      title: "Автобуски линии во Куманово — јавен превоз | Куманово Транзит",
      description:
        "Сите линии на јавниот превоз во Куманово: рути, прв и последен автобус, фреквенција и цени на билети за автобускиот превоз (avtobuski linii Kumanovo).",
    },
    "/stops": {
      title: "Автобуски постојки во Куманово | Куманово Транзит",
      description:
        "Најди автобуска постојка во Куманово и види кои линии застануваат таму и кога се следните поаѓања.",
    },
    "/schedule": {
      title: "Возен ред за автобуси во Куманово — јавен превоз | Куманово Транзит",
      description:
        "Целосен возен ред на автобуските линии во Куманово по работен ден, сабота и недела/празник (vozen red Kumanovo).",
    },
    "/planner": {
      title: "Планер на рута — јавен превоз Куманово | Куманово Транзит",
      description:
        "Планирај патување со јавен превоз во Куманово: избери почетна и крајна постојка и најди директна линија.",
    },
    "/map": {
      title: "Мапа на автобуски линии и постојки — Куманово | Куманово Транзит",
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
  },
  en: {
    "/": {
      title: "Kumanovo Public Transport — bus lines, timetable and stops | Kumanovo Transit",
      description:
        "Public transport in Kumanovo, North Macedonia: every city bus line, the full timetable, bus stops and ticket prices. Find the next departure and plan your route.",
    },
    "/lines": {
      title: "Bus lines in Kumanovo — city bus routes | Kumanovo Transit",
      description:
        "All public transport lines in Kumanovo: routes, first and last bus, frequency and ticket prices for every city bus line.",
    },
    "/stops": {
      title: "Bus stops in Kumanovo | Kumanovo Transit",
      description:
        "Find any bus stop in Kumanovo and see which lines call there and when the next departures are.",
    },
    "/schedule": {
      title: "Kumanovo bus timetable — full schedule | Kumanovo Transit",
      description:
        "Complete bus timetable for Kumanovo by weekday, Saturday and Sunday/holiday, for every city bus line.",
    },
    "/planner": {
      title: "Route planner — Kumanovo public transport | Kumanovo Transit",
      description:
        "Plan a trip on Kumanovo public transport: pick a start and end stop and find a direct bus line.",
    },
    "/map": {
      title: "Map of bus lines and stops — Kumanovo | Kumanovo Transit",
      description:
        "Interactive map of Kumanovo's public transport bus lines and bus stops.",
    },
    "/install": {
      title: "Install the Kumanovo Transit app",
      description:
        "Add Kumanovo Transit to your phone's home screen for quick access to bus lines, stops and timetables.",
    },
    "/terms": {
      title: "Terms and usage policy | Kumanovo Transit",
      description:
        "Terms and usage policy for the Kumanovo Transit public transport app.",
    },
  },
  sq: {
    "/": {
      title: "Transporti publik Kumanovë — linjat, orari dhe stacionet | Kumanovo Transit",
      description:
        "Transporti publik në Kumanovë: të gjitha linjat e autobusit, orari i autobusëve, stacionet dhe çmimet e biletave. Gjej nisjen e radhës dhe planifiko rrugën.",
    },
    "/lines": {
      title: "Linjat e autobusit në Kumanovë — transport urban | Kumanovo Transit",
      description:
        "Të gjitha linjat e transportit publik në Kumanovë: rrugët, autobusi i parë dhe i fundit, frekuenca dhe çmimi i biletës.",
    },
    "/stops": {
      title: "Stacionet e autobusit në Kumanovë | Kumanovo Transit",
      description:
        "Gjej një stacion autobusi në Kumanovë dhe shiko cilat linja ndalojnë aty dhe nisjet e radhës.",
    },
    "/schedule": {
      title: "Orari i autobusëve në Kumanovë | Kumanovo Transit",
      description:
        "Orari i plotë i linjave të autobusit në Kumanovë për ditë pune, të shtunë dhe të diel/festë.",
    },
    "/planner": {
      title: "Planifikuesi i rrugës — transporti publik Kumanovë | Kumanovo Transit",
      description:
        "Planifiko udhëtimin me transport publik në Kumanovë: zgjidh stacionin e nisjes dhe të mbërritjes dhe gjej linjën direkte.",
    },
    "/map": {
      title: "Harta e linjave dhe stacioneve — Kumanovë | Kumanovo Transit",
      description:
        "Hartë interaktive e linjave dhe stacioneve të autobusit të transportit publik në Kumanovë.",
    },
    "/install": {
      title: "Instalo aplikacionin Kumanovo Transit",
      description:
        "Shto Kumanovo Transit në ekranin kryesor të telefonit për qasje të shpejtë te linjat, stacionet dhe orari.",
    },
    "/terms": {
      title: "Kushtet dhe politika e përdorimit | Kumanovo Transit",
      description:
        "Kushtet dhe politika e përdorimit të aplikacionit Kumanovo Transit për transportin publik në Kumanovë.",
    },
  },
};

const SIMPLE = {
  "/schedule": {
    crumb: "schedule",
    h1: {
      mk: "Возен ред за јавен превоз во Куманово",
      en: "Kumanovo bus timetable",
      sq: "Orari i autobusëve në Kumanovë",
    },
    body: {
      mk: "Целосен возен ред на автобуските линии во Куманово по работен ден, сабота и недела или празник.",
      en: "The complete timetable for Kumanovo's bus lines by weekday, Saturday and Sunday or holiday.",
      sq: "Orari i plotë i linjave të autobusit në Kumanovë për ditë pune, të shtunë dhe të diel ose festë.",
    },
    priority: "0.8",
    changefreq: "weekly",
  },
  "/planner": {
    crumb: "planner",
    h1: {
      mk: "Планер на рута — јавен превоз Куманово",
      en: "Route planner — Kumanovo public transport",
      sq: "Planifikuesi i rrugës — transporti publik Kumanovë",
    },
    body: {
      mk: "Избери почетна и крајна постојка и најди директна автобуска линија во Куманово.",
      en: "Pick a start and end stop and find a direct bus line in Kumanovo.",
      sq: "Zgjidh stacionin e nisjes dhe të mbërritjes dhe gjej linjën direkte të autobusit në Kumanovë.",
    },
    priority: "0.7",
    changefreq: "monthly",
  },
  "/map": {
    crumb: "map",
    h1: {
      mk: "Мапа на линии и постојки во Куманово",
      en: "Map of bus lines and stops in Kumanovo",
      sq: "Harta e linjave dhe stacioneve në Kumanovë",
    },
    body: {
      mk: "Интерактивна мапа на автобуските линии и постојки на јавниот превоз во Куманово.",
      en: "Interactive map of the bus lines and stops of Kumanovo public transport.",
      sq: "Hartë interaktive e linjave dhe stacioneve të transportit publik në Kumanovë.",
    },
    priority: "0.6",
    changefreq: "monthly",
  },
  "/install": {
    crumb: "install",
    h1: {
      mk: "Инсталирај ја апликацијата Куманово Транзит",
      en: "Install the Kumanovo Transit app",
      sq: "Instalo aplikacionin Kumanovo Transit",
    },
    body: {
      mk: "Додади го Куманово Транзит на почетниот екран на телефонот за брз пристап до линии, постојки и возен ред.",
      en: "Add Kumanovo Transit to your phone's home screen for quick access to lines, stops and timetables.",
      sq: "Shto Kumanovo Transit në ekranin kryesor të telefonit për qasje të shpejtë te linjat, stacionet dhe orari.",
    },
    priority: "0.5",
    changefreq: "monthly",
  },
  "/terms": {
    crumb: "terms",
    h1: {
      mk: "Услови и политика на употреба",
      en: "Terms and usage policy",
      sq: "Kushtet dhe politika e përdorimit",
    },
    body: {
      mk: "Услови и политика на употреба на апликацијата Куманово Транзит.",
      en: "Terms and usage policy for the Kumanovo Transit app.",
      sq: "Kushtet dhe politika e përdorimit të aplikacionit Kumanovo Transit.",
    },
    priority: "0.3",
    changefreq: "yearly",
  },
};

/** Build the full route list for one language. */
function routesFor(lang) {
  const out = [
    { path: "/", ...homePage(lang), priority: "1.0", changefreq: "daily" },
    { path: "/lines", ...linesPage(lang), priority: "0.9", changefreq: "weekly" },
    { path: "/stops", ...stopsPage(lang), priority: "0.8", changefreq: "weekly" },
  ];

  for (const [path, cfg] of Object.entries(SIMPLE)) {
    out.push({
      path,
      ...simplePage(path, w(cfg.crumb, lang), cfg.h1[lang], cfg.body[lang], lang),
      priority: cfg.priority,
      changefreq: cfg.changefreq,
    });
  }

  for (const line of lines) {
    const from = lineFrom(line, lang);
    const to = lineTo(line, lang);
    out.push({
      path: `/lines/${line.id}`,
      meta: t(lang, {
        mk: {
          title: `Линија ${line.num}: ${from} – ${to} — возен ред | Куманово Транзит`,
          description: `Возен ред, постојки, фреквенција и цена за автобуска линија ${line.num} (${from} – ${to}) во јавниот превоз во Куманово.`,
        },
        en: {
          title: `Bus line ${line.num}: ${from} – ${to} — timetable | Kumanovo Transit`,
          description: `Timetable, stops, frequency and ticket price for Kumanovo bus line ${line.num} (${from} – ${to}).`,
        },
        sq: {
          title: `Linja ${line.num}: ${from} – ${to} — orari | Kumanovo Transit`,
          description: `Orari, stacionet, frekuenca dhe çmimi i biletës për linjën e autobusit ${line.num} (${from} – ${to}) në Kumanovë.`,
        },
      }),
      ...linePage(line, lang),
      priority: "0.7",
      changefreq: "weekly",
    });
  }

  for (const stop of stops) {
    const name = stopName(stop, lang);
    out.push({
      path: `/stops/${stop.id}`,
      meta: t(lang, {
        mk: {
          title: `Постојка ${name} — линии и поаѓања | Куманово Транзит`,
          description: `Автобуска постојка ${name} во Куманово: кои линии застануваат тука и следни поаѓања.`,
        },
        en: {
          title: `${name} bus stop — lines and departures | Kumanovo Transit`,
          description: `${name} bus stop in Kumanovo: which lines call here and the next departures.`,
        },
        sq: {
          title: `Stacioni ${name} — linjat dhe nisjet | Kumanovo Transit`,
          description: `Stacioni i autobusit ${name} në Kumanovë: cilat linja ndalojnë këtu dhe nisjet e radhës.`,
        },
      }),
      ...stopPage(stop, lang),
      priority: "0.5",
      changefreq: "weekly",
    });
  }

  return out.map((r) => ({ ...r, lang }));
}

const routes = LANGS.flatMap(routesFor);

// ---- Render + write ------------------------------------------------------

const template = readFileSync(resolve(DIST, "index.html"), "utf8");

/** hreflang set for one route — every language plus x-default (MK). */
function alternates(path) {
  const links = LANGS.map(
    (l) =>
      `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${esc(
        urlFor(path, l),
      )}" />`,
  ).join("");
  return (
    links +
    `<link rel="alternate" hreflang="x-default" href="${esc(
      urlFor(path, "mk"),
    )}" />`
  );
}

function render(route) {
  const { lang } = route;
  const meta = route.meta || META[lang][route.path];
  if (!meta) throw new Error(`No meta for route ${lang} ${route.path}`);
  const url = urlFor(route.path, lang);
  const t2 = esc(meta.title);
  const d = esc(meta.description);

  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${HTML_LANG[lang]}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t2}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(
      /<meta property="og:locale" content="[^"]*" \/>/,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    )
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t2}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t2}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace("</head>", `${alternates(route.path)}${route.jsonLd}</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root"><div id="kt-seo">${route.content}</div></div>`,
    );
}

let count = 0;
for (const route of routes) {
  const html = render(route);
  const outPath = PREFIX[route.lang] + (route.path === "/" ? "" : route.path);
  const outDir = outPath ? resolve(DIST, "." + outPath) : DIST;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  count++;
}

// robots.txt
writeFileSync(
  resolve(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

// sitemap.xml — one <url> per language variant, each listing the others as
// xhtml:link alternates so Google groups them instead of picking one.
const paths = [...new Set(routes.map((r) => r.path))];
const byPath = new Map(routes.map((r) => [`${r.lang}${r.path}`, r]));

const urls = LANGS.flatMap((lang) =>
  paths.map((path) => {
    const r = byPath.get(`${lang}${path}`);
    const alts = LANGS.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${urlFor(
          path,
          l,
        )}" />`,
    )
      .concat(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(
          path,
          "mk",
        )}" />`,
      )
      .join("\n");
    return `  <url>\n    <loc>${urlFor(
      path,
      lang,
    )}</loc>\n${alts}\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${
      r.changefreq
    }</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
  }),
).join("\n");

writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);

console.log(
  `Prerendered ${count} routes (${LANGS.join(", ")}) + sitemap.xml + robots.txt (${lines.length} lines, ${stops.length} stops).`,
);
