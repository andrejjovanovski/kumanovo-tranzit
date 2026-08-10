import { AlertTriangle } from "lucide-react";
import type { Departure } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { departureVisual } from "@/lib/departureVisual";

/** Compact status indicator for a departure: an amber warning square when the
 *  trip skips stops, otherwise a labelled status pill. */
export function DepartureStatus({ dep }: { dep: Departure }) {
  const { lang, T } = useT();
  const v = departureVisual(dep, lang, T);

  if (v.warning) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: 3, background: v.bg, color: v.color, borderRadius: 6 }}>
        <AlertTriangle size={12} />
      </span>
    );
  }
  if (!v.label) return null;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", background: v.bg, color: v.color, borderRadius: 999 }}>
      {v.label}
    </span>
  );
}
