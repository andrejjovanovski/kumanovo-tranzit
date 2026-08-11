import type { Lang, Line, RawStop } from "@kt/shared";

/**
 * Single source of SEO truth for the runtime head manager (<RouteSeo/>). The
 * build-time prerenderer (scripts/prerender.mjs) intentionally re-declares the
 * same domain + copy so it can run in plain Node without a TS loader — keep the
 * two in sync when editing titles/descriptions.
 */

/** Absolute production origin — required for canonical + social tags. */
export const SITE_URL = "https://kumanovotranzit.com";

export const SITE_NAME = "Куманово Транзит";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface Meta {
  title: string;
  description: string;
}

/** Localized name of a line's endpoints, MK-first. */
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

/** Static-route copy, keyed by pathname. MK is the indexed language. */
const STATIC_MK: Record<string, Meta> = {
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

/** Meta for a static route, or undefined for unknown/dynamic paths. */
export function staticMeta(pathname: string): Meta | undefined {
  return STATIC_MK[pathname];
}

/** Meta for a line-detail page, in the active UI language. */
export function lineMeta(line: Line, lang: Lang): Meta {
  const { from, to } = lineEndpoints(line, lang);
  return {
    title: `Линија ${line.num}: ${from} – ${to} — возен ред | Куманово Транзит`,
    description: `Возен ред, постојки, фреквенција и цена за автобуска линија ${line.num} (${from} – ${to}) во јавниот превоз во Куманово.`,
  };
}

/** Meta for a stop-detail page, in the active UI language. */
export function stopMeta(stop: RawStop, lang: Lang, lineCount: number): Meta {
  const name = stopName(stop, lang);
  return {
    title: `Постојка ${name} — линии и поаѓања | Куманово Транзит`,
    description: `Автобуска постојка ${name} во Куманово: ${lineCount} ${
      lineCount === 1 ? "линија застанува" : "линии застануваат"
    } тука. Види следни поаѓања и возен ред.`,
  };
}
