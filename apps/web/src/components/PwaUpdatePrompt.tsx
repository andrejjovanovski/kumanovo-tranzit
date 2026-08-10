import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useBreakpoint } from "@/hooks/useBreakpoint";

// How often to re-check for a newer service worker.
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Registers the service worker and, when a new deploy is ready, shows a toast
 * asking the user to refresh (instead of reloading silently). Installed PWAs
 * are often resumed from the background, so we also poll for updates on an
 * interval and when the app returns to the foreground.
 */
export function PwaUpdatePrompt() {
  const { T } = useT();
  const { isMobile } = useBreakpoint();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      window.setInterval(() => registration.update(), UPDATE_INTERVAL_MS);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update();
      });
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: isMobile ? 92 : 20,
        zIndex: 60,
        width: "min(420px, calc(100% - 32px))",
      }}
    >
      <div
        className="card elev-lg"
        style={{ flexDirection: "row", alignItems: "center", gap: "var(--space-3)", background: "var(--color-neutral-900)", color: "#fff" }}
      >
        <RefreshCw size={18} style={{ flex: "none", color: "var(--color-accent-400)" }} />
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{T.updateAvailable}</div>
        <button
          className="btn btn-primary"
          style={{ flex: "none" }}
          onClick={() => updateServiceWorker(true)}
        >
          {T.refresh}
        </button>
        <button
          className="btn btn-icon"
          aria-label={T.dismiss}
          style={{ flex: "none", color: "#fff" }}
          onClick={() => setNeedRefresh(false)}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
