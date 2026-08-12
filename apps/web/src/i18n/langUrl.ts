import type { Lang } from "@kt/shared";

/**
 * Language lives in the URL so each language has its own indexable pages:
 * Macedonian at the root (`/lines`), English at `/en/lines`, Albanian at
 * `/sq/lines`. MK is unprefixed because it is the primary/default language and
 * the one the canonical + x-default hreflang point at.
 *
 * The router never sees the prefix: <BrowserRouter> is mounted with it as
 * `basename` (see main.tsx), so every existing absolute <Link to="/lines"/>
 * keeps working and automatically stays inside the active language.
 */

/** URL prefix for each language ("" for the unprefixed default). */
export const LANG_PREFIX: Record<Lang, string> = {
  mk: "",
  en: "/en",
  sq: "/sq",
};

const PREFIXED: Array<[string, Lang]> = [
  ["/en", "en"],
  ["/sq", "sq"],
];

/** Language a pathname belongs to, defaulting to MK for unprefixed paths. */
export function langFromPath(pathname: string): Lang {
  for (const [prefix, lang] of PREFIXED) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return lang;
  }
  return "mk";
}

/** Drop a leading /en or /sq, yielding the language-neutral route path. */
export function stripLangPrefix(pathname: string): string {
  const prefix = LANG_PREFIX[langFromPath(pathname)];
  if (!prefix) return pathname || "/";
  return pathname.slice(prefix.length) || "/";
}

/**
 * Absolute site path for a language-neutral route in a given language.
 * `routePath` is what the router reports (already prefix-free).
 */
export function pathForLang(routePath: string, lang: Lang): string {
  const clean = routePath === "/" ? "" : routePath;
  return LANG_PREFIX[lang] + clean || "/";
}
