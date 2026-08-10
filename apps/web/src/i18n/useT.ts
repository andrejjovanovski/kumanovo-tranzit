import { getStrings, type Lang, type Strings, tr as trBase } from "@kt/shared";
import { useUIStore } from "@/store/uiStore";

export interface I18n {
  lang: Lang;
  T: Strings;
  /** Pick a value for the active language. */
  tr: (mk: string, en: string, sq: string) => string;
}

/** Access the current language + its strings + a `tr` helper bound to it. */
export function useT(): I18n {
  const lang = useUIStore((s) => s.lang);
  const T = getStrings(lang);
  return {
    lang,
    T,
    tr: (mk, en, sq) => trBase(lang, mk, en, sq),
  };
}
