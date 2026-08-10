import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LANG_META, LANGS } from "@kt/shared";
import { useUIStore } from "@/store/uiStore";

/** Language switcher used inside the mobile menu overlay. */
export function LanguageMenu({ onPick }: { onPick?: () => void }) {
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const current = LANG_META[lang];

  return (
    <div style={{ position: "relative" }}>
      <button
        className="btn btn-secondary btn-block"
        style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{current.flag}</span>
        {current.label}
        {open ? (
          <ChevronUp size={18} style={{ marginLeft: "auto" }} />
        ) : (
          <ChevronDown size={18} style={{ marginLeft: "auto" }} />
        )}
      </button>
      {open && (
        <div
          className="card elev-md"
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 5, padding: 6, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {LANGS.map((code) => {
            const meta = LANG_META[code];
            const active = code === lang;
            return (
              <button
                key={code}
                className="btn btn-ghost"
                style={{
                  display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start", width: "100%",
                  color: "var(--color-text)",
                  ...(active ? { fontWeight: 800, background: "var(--color-accent-100)" } : {}),
                }}
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                  onPick?.();
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{meta.flag}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
