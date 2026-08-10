/**
 * Generate the social share image (Open Graph / Twitter), 1200×630, as a
 * committed static asset at public/og-image.png. It is generated once and
 * checked in — the Vercel build has no Cyrillic desktop fonts, so we cannot
 * render this text at deploy time. Re-run locally if the brand/wording changes:
 *
 *   pnpm --filter @kt/web gen:og
 */
import { Resvg } from "@resvg/resvg-js";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/og-image.png");

const RED = "#ec3013";
const RED_LIGHT = "#ff563c";

// The bus glyph from index.html, scaled up and centered in a rounded tile.
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${RED}"/>
  <g transform="translate(600 176)">
    <rect x="-84" y="-84" width="168" height="168" rx="40" fill="${RED_LIGHT}"/>
    <g transform="translate(-72 -72) scale(4)" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="19" r="3"/>
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
      <circle cx="18" cy="5" r="3"/>
    </g>
  </g>
  <text x="600" y="430" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="86" letter-spacing="4" fill="#ffffff">КУМАНОВО ТРАНЗИТ</text>
  <text x="600" y="500" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="500" font-size="36" fill="#ffe4de">Јавен превоз во Куманово · Линии · Постојки · Возен ред</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Arial" },
});
writeFileSync(OUT, resvg.render().asPng());
console.log(`Wrote ${OUT}${existsSync(OUT) ? "" : " (FAILED)"}`);
