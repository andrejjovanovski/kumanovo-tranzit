import { useLocation, useNavigate } from "react-router-dom";
import { useT } from "@/i18n/useT";
import { NAV, isNavActive } from "./navConfig";

/** Mobile bottom tab bar with a raised center FAB (Возен ред). */
export function BottomNav() {
  const { T } = useT();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
        background: "var(--color-bg)", borderTop: "2px solid var(--color-divider)", display: "flex",
      }}
    >
      {NAV.map((def) => {
        const active = isNavActive(def, location.pathname);
        const Icon = def.icon;
        const isFab = def.fab;
        const iconColor = isFab ? "#fff" : active ? "var(--color-accent-600)" : "var(--color-text)";
        const labelColor = isFab || active ? "var(--color-accent-600)" : "var(--color-text)";
        return (
          <button
            key={def.key}
            onClick={() => navigate(def.to)}
            aria-label={def.label(T)}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
              gap: 4, padding: "6px 0 8px", background: "none", border: "none", cursor: "pointer",
            }}
          >
            <div
              style={{
                width: isFab ? 54 : 26, height: isFab ? 54 : 26, borderRadius: "50%",
                background: isFab ? "var(--color-accent-500)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: isFab ? -24 : 0, boxShadow: isFab ? "var(--shadow-md)" : "none",
              }}
            >
              <Icon size={isFab ? 25 : 20} color={iconColor} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: labelColor }}>{def.label(T)}</span>
          </button>
        );
      })}
    </nav>
  );
}
