import type { Lang } from "./i18n/tr";
import { tr } from "./i18n/tr";
import type { Strings } from "./i18n/strings";

const DAY_NAMES: Record<Lang, string[]> = {
  mk: ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  sq: ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"],
};

const MONTHS: Record<Lang, string[]> = {
  mk: ["Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  sq: ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Korr", "Gush", "Sht", "Tet", "Nën", "Dhj"],
};

export const dayName = (d: Date, lang: Lang): string => DAY_NAMES[lang][d.getDay()];
export const monthShort = (d: Date, lang: Lang): string => MONTHS[lang][d.getMonth()];

/** Time-of-day greeting from the app strings. */
export function greetingFor(d: Date, T: Strings): string {
  const h = d.getHours();
  return h < 12 ? T.morning : h < 18 ? T.afternoon : T.evening;
}

/** "Monday · 11:08" style subheading. */
export function nowLabel(d: Date, lang: Lang): string {
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${dayName(d, lang)} · ${hh}:${mm}`;
}

export const frequencyLabel = (freq: number, lang: Lang): string =>
  tr(lang, `На секои ${freq} мин`, `Every ${freq} min`, `Çdo ${freq} min`);
