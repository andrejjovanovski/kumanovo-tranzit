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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
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
