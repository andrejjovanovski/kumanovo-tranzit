import type { LucideIcon } from "lucide-react";

/** Centered empty/no-results card with an icon and message. */
export function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="card" style={{ alignItems: "center", textAlign: "center", padding: "var(--space-8)" }}>
      <Icon size={28} style={{ opacity: 0.5 }} />
      <div style={{ fontSize: 13, opacity: 0.7 }}>{message}</div>
    </div>
  );
}
