import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Lang } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useLine, useStop } from "@/hooks/useTransitData";
import {
  ALL_LANGS,
  HTML_LANG,
  type Meta,
  OG_IMAGE,
  OG_LOCALE,
  SITE_NAME,
  absoluteUrl,
  lineMeta,
  staticMeta,
  stopMeta,
} from "./siteMeta";

/** Create or reuse a <meta>/<link> head tag identified by a key attribute. */
function upsert(
  tag: "meta" | "link",
  keyAttr: "name" | "property" | "rel",
  keyVal: string,
  valAttr: "content" | "href",
  value: string,
): void {
  const selector = `${tag}[${keyAttr}="${keyVal}"]`;
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(keyAttr, keyVal);
    document.head.appendChild(el);
  }
  el.setAttribute(valAttr, value);
}

/**
 * Point <link rel="alternate" hreflang> at this route in each language, so
 * Google serves the Macedonian, English or Albanian URL to the matching
 * audience instead of treating them as duplicates. Rewritten wholesale on every
 * route change — the set is small and always the same shape.
 */
function applyAlternates(path: string): void {
  for (const el of document.head.querySelectorAll(
    'link[rel="alternate"][hreflang]',
  )) {
    el.remove();
  }
  const add = (hreflang: string, href: string) => {
    const el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    el.setAttribute("href", href);
    document.head.appendChild(el);
  };
  for (const alt of ALL_LANGS) add(HTML_LANG[alt], absoluteUrl(path, alt));
  add("x-default", absoluteUrl(path, "mk"));
}

/** Apply the full set of per-route head tags on the client. */
function applyHead(meta: Meta, path: string, lang: Lang): void {
  const url = absoluteUrl(path, lang);
  document.title = meta.title;
  document.documentElement.lang = HTML_LANG[lang];

  upsert("meta", "name", "description", "content", meta.description);
  upsert("link", "rel", "canonical", "href", url);
  applyAlternates(path);

  upsert("meta", "property", "og:title", "content", meta.title);
  upsert("meta", "property", "og:description", "content", meta.description);
  upsert("meta", "property", "og:url", "content", url);
  upsert("meta", "property", "og:type", "content", "website");
  upsert("meta", "property", "og:site_name", "content", SITE_NAME);
  upsert("meta", "property", "og:image", "content", OG_IMAGE);
  upsert("meta", "property", "og:locale", "content", OG_LOCALE[lang]);

  upsert("meta", "name", "twitter:card", "content", "summary_large_image");
  upsert("meta", "name", "twitter:title", "content", meta.title);
  upsert("meta", "name", "twitter:description", "content", meta.description);
  upsert("meta", "name", "twitter:image", "content", OG_IMAGE);
}

/**
 * Keeps document title, meta description, canonical, hreflang alternates and
 * social tags in sync with the current route during client-side navigation (and
 * when a JS-capable crawler renders the app). Static HTML for first paint /
 * non-JS crawlers is produced separately by scripts/prerender.mjs. Rendered
 * once from <Layout/>.
 *
 * `pathname` here is language-neutral: the language prefix is the router's
 * basename, so it never appears in the location the router reports.
 */
export function RouteSeo() {
  const { pathname } = useLocation();
  const params = useParams();
  const { lang } = useT();

  // Detect line/stop detail routes and resolve the entity for its title.
  const lineId = pathname.startsWith("/lines/") ? params.id : undefined;
  const stopId = pathname.startsWith("/stops/") ? params.id : undefined;
  const { data: line } = useLine(lineId);
  const { data: stop } = useStop(stopId);

  useEffect(() => {
    let meta = staticMeta(pathname, lang);
    if (!meta && lineId && line) meta = lineMeta(line, lang);
    if (!meta && stopId && stop) {
      meta = stopMeta(stop, lang, stop.lines.length);
    }
    if (!meta) return; // Detail data not loaded yet — wait for a later pass.
    applyHead(meta, pathname, lang);
  }, [pathname, lang, lineId, stopId, line, stop]);

  return null;
}
