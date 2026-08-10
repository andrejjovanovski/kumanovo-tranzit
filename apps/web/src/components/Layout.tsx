import type { ReactNode } from "react";
import { AppHeader } from "@/components/navigation/AppHeader";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TermsGate } from "@/components/TermsGate";
import { useBreakpoint } from "@/hooks/useBreakpoint";

/** App chrome: sticky header, responsive main column, mobile bottom nav,
 *  and the blocking terms gate. */
export function Layout({ children }: { children: ReactNode }) {
  const { isMobile, isTablet } = useBreakpoint();

  const padding = isMobile ? "16px" : isTablet ? "24px 32px" : "32px 40px";
  const paddingBottom = isMobile ? 84 : isTablet ? 32 : 40;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <AppHeader />
      <main style={{ flex: 1, width: "100%", maxWidth: 1320, margin: "0 auto", padding, paddingBottom, boxSizing: "border-box" }}>
        {children}
      </main>
      {isMobile && <BottomNav />}
      <TermsGate />
    </div>
  );
}
