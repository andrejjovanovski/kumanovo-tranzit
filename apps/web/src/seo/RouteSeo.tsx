import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useT } from "@/i18n/useT";
import { useLine, useStop } from "@/hooks/useTransitData";
import {
  type Meta,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
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

/** Apply the full set of per-route head tags on the client. */
function applyHead(meta: Meta, path: string, lang: string): void {
  const url = SITE_URL + (path === "/" ? "/" : path);
  document.title = meta.title;
  document.documentElement.lang = lang;

  upsert("meta", "name", "description", "content", meta.description);
  upsert("link", "rel", "canonical", "href", url);

  upsert("meta", "property", "og:title", "content", meta.title);
  upsert("meta", "property", "og:description", "content", meta.description);
  upsert("meta", "property", "og:url", "content", url);
  upsert("meta", "property", "og:type", "content", "website");
  upsert("meta", "property", "og:site_name", "content", SITE_NAME);
  upsert("meta", "property", "og:image", "content", OG_IMAGE);

  upsert("meta", "name", "twitter:card", "content", "summary_large_image");
  upsert("meta", "name", "twitter:title", "content", meta.title);
  upsert("meta", "name", "twitter:description", "content", meta.description);
  upsert("meta", "name", "twitter:image", "content", OG_IMAGE);
}

/**
 * Keeps document title, meta description, canonical and social tags in sync
 * with the current route during client-side navigation (and when a JS-capable
 * crawler renders the app). Static HTML for first paint / non-JS crawlers is
 * produced separately by scripts/prerender.mjs. Rendered once from <Layout/>.
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
    let meta = staticMeta(pathname);
    if (!meta && lineId && line) meta = lineMeta(line, lang);
    if (!meta && stopId && stop) {
      meta = stopMeta(stop, lang, stop.lines.length);
    }
    if (!meta) return; // Detail data not loaded yet — wait for a later pass.
    applyHead(meta, pathname, lang);
  }, [pathname, lang, lineId, stopId, line, stop]);

  return null;
}
