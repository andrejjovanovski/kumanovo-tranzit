import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@kt/shared";

interface UIState {
  /** Active UI language (persisted). */
  lang: Lang;
  /** Whether the user accepted the terms gate (persisted). */
  termsAccepted: boolean;
  /** Location permission state — controls "nearby" ordering. */
  locationDenied: boolean;

  setLang: (lang: Lang) => void;
  acceptTerms: () => void;
  enableLocation: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      lang: "mk",
      termsAccepted: false,
      locationDenied: true,
      setLang: (lang) => set({ lang }),
      acceptTerms: () => set({ termsAccepted: true }),
      enableLocation: () => set({ locationDenied: false }),
    }),
    {
      name: "kt-ui",
      partialize: (s) => ({ lang: s.lang, termsAccepted: s.termsAccepted }),
    },
  ),
);
