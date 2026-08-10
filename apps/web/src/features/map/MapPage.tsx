import { Map as MapIcon } from "lucide-react";
import { useT } from "@/i18n/useT";

/** The live Map tab is a "coming soon" placeholder, matching the prototype.
 *  (Per-line route maps are shown on the line detail page.) */
export function MapPage() {
  const { T } = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "var(--space-4)", minHeight: 360, padding: "var(--space-8)" }}>
      <MapIcon size={48} style={{ opacity: 0.4 }} />
      <h2 style={{ margin: 0 }}>{T.comingSoonTitle}</h2>
      <div style={{ fontSize: 14, opacity: 0.7, maxWidth: 360 }}>{T.comingSoonBody}</div>
    </div>
  );
}
