/**
 * Generate iOS "apple-touch-startup-image" launch screens (one PNG per device
 * size × orientation) plus the matching <link> tags. These give an installed
 * PWA a branded launch screen on iOS instead of a blank web view.
 *
 * Run:  pnpm --filter @kt/web gen:splash
 * Then paste scripts/ios-splash-links.html into index.html (already done).
 */
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/splash");
const BG = "#f3f2f2";

// Logical (CSS px) size + device pixel ratio per device family.
const DEVICES = [
  { dw: 375, dh: 667, dpr: 2 }, // iPhone SE / 8
  { dw: 414, dh: 736, dpr: 3 }, // iPhone 8 Plus
  { dw: 375, dh: 812, dpr: 3 }, // iPhone X/XS/11 Pro/12–13 mini
  { dw: 414, dh: 896, dpr: 2 }, // iPhone XR / 11
  { dw: 414, dh: 896, dpr: 3 }, // iPhone XS Max / 11 Pro Max
  { dw: 390, dh: 844, dpr: 3 }, // iPhone 12/13/14
  { dw: 428, dh: 926, dpr: 3 }, // iPhone 12/13 Pro Max / 14 Plus
  { dw: 393, dh: 852, dpr: 3 }, // iPhone 14 Pro / 15 / 16
  { dw: 430, dh: 932, dpr: 3 }, // iPhone 14 Pro Max / 15 Plus / 15 Pro Max
  { dw: 402, dh: 874, dpr: 3 }, // iPhone 16 Pro
  { dw: 440, dh: 956, dpr: 3 }, // iPhone 16 Pro Max
  { dw: 768, dh: 1024, dpr: 2 }, // iPad mini / 9.7"
  { dw: 810, dh: 1080, dpr: 2 }, // iPad 10.2"
  { dw: 820, dh: 1180, dpr: 2 }, // iPad Air
  { dw: 834, dh: 1112, dpr: 2 }, // iPad 10.5"
  { dw: 834, dh: 1194, dpr: 2 }, // iPad Pro 11"
  { dw: 1024, dh: 1366, dpr: 2 }, // iPad Pro 12.9"
];

/** SVG canvas of the given pixel size: flat background + centered logo. */
function canvasSvg(w, h) {
  const size = Math.round(Math.min(w, h) * 0.22);
  const x = (w - size) / 2;
  const y = (h - size) / 2;
  const s = size / 512;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="${BG}"/>
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect width="512" height="512" rx="120" fill="#ff563c"/>
    <g transform="translate(112 112) scale(12)" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="19" r="3"/>
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
      <circle cx="18" cy="5" r="3"/>
    </g>
  </g>
</svg>`;
}

function render(w, h) {
  const png = new Resvg(canvasSvg(w, h)).render().asPng();
  const name = `apple-splash-${w}-${h}.png`;
  writeFileSync(resolve(OUT_DIR, name), png);
  return name;
}

mkdirSync(OUT_DIR, { recursive: true });

const links = [];
for (const { dw, dh, dpr } of DEVICES) {
  const pw = dw * dpr;
  const ph = dh * dpr;
  const portrait = render(pw, ph);
  const landscape = render(ph, pw);
  const base = `screen and (device-width: ${dw}px) and (device-height: ${dh}px) and (-webkit-device-pixel-ratio: ${dpr})`;
  links.push(`    <link rel="apple-touch-startup-image" media="${base} and (orientation: portrait)" href="/splash/${portrait}" />`);
  links.push(`    <link rel="apple-touch-startup-image" media="${base} and (orientation: landscape)" href="/splash/${landscape}" />`);
}

writeFileSync(resolve(__dirname, "ios-splash-links.html"), links.join("\n") + "\n");
console.log(`Generated ${DEVICES.length * 2} splash PNGs in public/splash and link tags in scripts/ios-splash-links.html`);
