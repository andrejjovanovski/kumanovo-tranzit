import type { Lang, Line, RawStop } from "@kt/shared";
import { LANG_PREFIX } from "@/i18n/langUrl";

/**
 * Single source of SEO truth for the runtime head manager (<RouteSeo/>). The
 * build-time prerenderer (scripts/prerender.mjs) intentionally re-declares the
 * same domain + copy so it can run in plain Node without a TS loader — keep the
 * two in sync when editing titles/descriptions.
 *
 * Every language has its own URL tree (MK unprefixed, EN under /en, SQ under
 * /sq), so titles and descriptions are written per language rather than always
 * emitting Macedonian. Macedonian copy carries Latin-script spellings of the
 * common queries ("javen prevoz Kumanovo", "vozen red") alongside Cyrillic,
 * because a large share of local searches are typed in Latin letters.
 */

/**
 * Absolute production origin — required for canonical + social tags.
 * Must match the host Vercel serves without redirecting: the apex 308s to www,
 * so www is the canonical host. Flip both here and in scripts/prerender.mjs if
 * the primary domain ever changes.
 */
export const SITE_URL = "https://www.kumanovotranzit.com";

export const SITE_NAME = "Куманово Транзит";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** BCP-47 tag per UI language, for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = {
  mk: "mk",
  en: "en",
  sq: "sq",
};

/** Open Graph locale per UI language. */
export const OG_LOCALE: Record<Lang, string> = {
  mk: "mk_MK",
  en: "en_US",
  sq: "sq_AL",
};

export const ALL_LANGS: Lang[] = ["mk", "en", "sq"];

export interface Meta {
  title: string;
  description: string;
}

/** Absolute URL for a language-neutral route path in a given language. */
export function absoluteUrl(routePath: string, lang: Lang): string {
  const clean = routePath === "/" ? "" : routePath;
  return SITE_URL + (LANG_PREFIX[lang] + clean || "/");
}

/** Localized name of a line's endpoints. */
function lineEndpoints(line: Line, lang: Lang): { from: string; to: string } {
  if (lang === "en") return { from: line.fromEn, to: line.toEn };
  if (lang === "sq") return { from: line.fromSq, to: line.toSq };
  return { from: line.from, to: line.to };
}

function stopName(stop: RawStop, lang: Lang): string {
  if (lang === "en") return stop.nameEn;
  if (lang === "sq") return stop.nameSq;
  return stop.name;
}

/** Static-route copy, keyed by language then pathname. */
const STATIC: Record<Lang, Record<string, Meta>> = {
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

/** Meta for a static route, or undefined for unknown/dynamic paths. */
export function staticMeta(pathname: string, lang: Lang): Meta | undefined {
  return STATIC[lang][pathname];
}

/** Meta for a line-detail page, in the active language. */
export function lineMeta(line: Line, lang: Lang): Meta {
  const { from, to } = lineEndpoints(line, lang);
  if (lang === "en") {
    return {
      title: `Bus line ${line.num}: ${from} – ${to} — timetable | Kumanovo Transit`,
      description: `Timetable, stops, frequency and ticket price for Kumanovo bus line ${line.num} (${from} – ${to}).`,
    };
  }
  if (lang === "sq") {
    return {
      title: `Linja ${line.num}: ${from} – ${to} — orari | Kumanovo Transit`,
      description: `Orari, stacionet, frekuenca dhe çmimi i biletës për linjën e autobusit ${line.num} (${from} – ${to}) në Kumanovë.`,
    };
  }
  return {
    title: `Линија ${line.num}: ${from} – ${to} — возен ред | Куманово Транзит`,
    description: `Возен ред, постојки, фреквенција и цена за автобуска линија ${line.num} (${from} – ${to}) во јавниот превоз во Куманово.`,
  };
}

/** Meta for a stop-detail page, in the active language. */
export function stopMeta(stop: RawStop, lang: Lang, lineCount: number): Meta {
  const name = stopName(stop, lang);
  if (lang === "en") {
    return {
      title: `${name} bus stop — lines and departures | Kumanovo Transit`,
      description: `${name} bus stop in Kumanovo: ${lineCount} ${
        lineCount === 1 ? "line calls" : "lines call"
      } here. See the next departures and the timetable.`,
    };
  }
  if (lang === "sq") {
    return {
      title: `Stacioni ${name} — linjat dhe nisjet | Kumanovo Transit`,
      description: `Stacioni i autobusit ${name} në Kumanovë: ${lineCount} ${
        lineCount === 1 ? "linjë ndalon" : "linja ndalojnë"
      } këtu. Shiko nisjet e radhës dhe orarin.`,
    };
  }
  return {
    title: `Постојка ${name} — линии и поаѓања | Куманово Транзит`,
    description: `Автобуска постојка ${name} во Куманово: ${lineCount} ${
      lineCount === 1 ? "линија застанува" : "линии застануваат"
    } тука. Види следни поаѓања и возен ред.`,
  };
}
