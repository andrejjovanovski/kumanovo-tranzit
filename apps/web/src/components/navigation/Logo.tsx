import { Route } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** The "КУМАНОВО ТРАНЗИТ" brand lockup. Clickable → home by default. */
export function Logo({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      onClick={onClick ?? (() => navigate("/"))}
    >
      <div
        style={{
          width: 38, height: 38, flex: "none", background: "var(--color-accent-500)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Route size={20} color="#fff" strokeWidth={2.5} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16,
          letterSpacing: "-0.01em", lineHeight: 1.05,
        }}
      >
        КУМАНОВО
        <br />
        <span style={{ color: "var(--color-accent-600)" }}>ТРАНЗИТ</span>
      </div>
    </div>
  );
}
