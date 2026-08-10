import type { RawStop, RawLine } from "@kt/data";

export type Lang = "mk" | "en" | "sq";
export const LANGS: Lang[] = ["mk", "en", "sq"];

export const LANG_META: Record<Lang, { label: string; flag: string }> = {
  mk: { label: "Македонски", flag: "🇲🇰" },
  en: { label: "English", flag: "🇬🇧" },
  sq: { label: "Shqip", flag: "🇦🇱" },
};

/** Pick the value for the active language (mk is the default/base). */
export const tr = (lang: Lang, mk: string, en: string, sq: string): string =>
  lang === "en" ? en : lang === "sq" ? sq : mk;

export const localizedStopName = (stop: RawStop, lang: Lang): string =>
  tr(lang, stop.name, stop.nameEn, stop.nameSq || stop.nameEn);

export interface LocalizedLine {
  from: string;
  to: string;
  company: string;
}

export const localizedLine = (line: RawLine, lang: Lang): LocalizedLine => ({
  from: tr(lang, line.from, line.fromEn, line.fromSq || line.fromEn),
  to: tr(lang, line.to, line.toEn, line.toSq || line.toEn),
  company: tr(lang, line.company, line.companyEn, line.company),
});
