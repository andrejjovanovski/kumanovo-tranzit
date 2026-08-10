import { useT } from "@/i18n/useT";
import { BackLink } from "@/components/ui/BackLink";

export function TermsPage() {
  const { T } = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 640 }}>
      <BackLink to="/" />
      <h2 style={{ margin: 0 }}>{T.termsTitle}</h2>
      {T.termsSections.map((sec, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h4 style={{ margin: 0 }}>{sec.title}</h4>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{sec.body}</p>
        </div>
      ))}
    </div>
  );
}
