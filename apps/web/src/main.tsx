import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./styles/global.css";

import { QueryProvider } from "@/app/QueryProvider";
import { App } from "@/App";
import { hideSplash } from "@/lib/splash";
import { LANG_PREFIX, langFromPath, pathForLang } from "@/i18n/langUrl";
import { useUIStore } from "@/store/uiStore";

/**
 * Resolve the language from the URL before the router mounts, since it becomes
 * the router's `basename`. A prefixed URL (/en/…, /sq/…) always wins — that is
 * what crawlers and shared links carry. On an unprefixed URL we honour the
 * visitor's saved language instead by rewriting the address in place, so a
 * returning English reader lands on the English URL rather than reading English
 * UI under a Macedonian address.
 */
function resolveLang(): string {
  const urlLang = langFromPath(window.location.pathname);
  if (urlLang !== "mk") {
    useUIStore.getState().setLang(urlLang);
    return LANG_PREFIX[urlLang];
  }

  const saved = useUIStore.getState().lang;
  if (saved !== "mk") {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(
      null,
      "",
      pathForLang(pathname, saved) + search + hash,
    );
    return LANG_PREFIX[saved];
  }
  return "/";
}

const basename = resolveLang();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>,
);

// The splash is normally lifted by <SplashGate/> once data + fonts are ready.
// This is a hard cap so it can never hang if a readiness signal is delayed.
window.setTimeout(hideSplash, 4000);

// The service worker is registered from <PwaUpdatePrompt/>, which also renders
// the "new version available" toast when a deploy is ready.
