import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, FileText, Menu, X } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { NAV, isNavActive } from "./navConfig";
import { Logo } from "./Logo";
import { LanguageMenu } from "./LanguageMenu";

/** Sticky top bar: brand, desktop tabs, and a full-screen mobile menu with
 *  Install / Terms / language options. */
export function AppHeader() {
  const { T } = useT();
  const { isMobile } = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--color-bg)", borderBottom: "2px solid var(--color-divider)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)" }}>
        <Logo />

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "stretch", gap: "var(--space-4)", marginLeft: "var(--space-2)", alignSelf: "stretch" }}>
            {NAV.map((def) => {
              const active = isNavActive(def, location.pathname);
              const Icon = def.icon;
              return (
                <Link
                  key={def.key}
                  to={def.to}
                  aria-current={active ? "page" : undefined}
                  style={{
                    fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, letterSpacing: "0.03em",
                    color: active ? "var(--color-accent-600)" : "var(--color-text)", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 7,
                    borderBottom: active ? "2px solid var(--color-accent)" : "2px solid transparent", paddingBottom: 4,
                  }}
                >
                  <Icon size={16} />
                  {def.label(T)}
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "var(--space-3)", position: "relative" }}>
          <button className="btn btn-icon btn-ghost" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-3) var(--space-4)", borderBottom: "2px solid var(--color-divider)" }}>
            <Logo onClick={() => { closeMenu(); navigate("/"); }} />
            <button className="btn btn-icon btn-ghost" onClick={closeMenu} aria-label="Close">
              <X size={22} />
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-4)", maxWidth: 480, margin: "0 auto", width: "100%" }}>
            <button className="btn btn-secondary btn-block" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start" }} onClick={() => { closeMenu(); navigate("/install"); }}>
              <Download size={18} />
              {T.installMenu}
            </button>
            <button className="btn btn-secondary btn-block" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start" }} onClick={() => { closeMenu(); navigate("/terms"); }}>
              <FileText size={18} />
              {T.termsMenu}
            </button>
            <LanguageMenu />
          </div>
        </div>
      )}
    </div>
  );
}
