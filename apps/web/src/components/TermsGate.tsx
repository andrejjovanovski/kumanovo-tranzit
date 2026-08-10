import { useT } from "@/i18n/useT";
import { useUIStore } from "@/store/uiStore";

/** Blocking dialog shown until the user accepts the terms & usage policy. */
export function TermsGate() {
  const { T } = useT();
  const accepted = useUIStore((s) => s.termsAccepted);
  const acceptTerms = useUIStore((s) => s.acceptTerms);

  if (accepted) return null;

  return (
    <div className="dialog-backdrop" style={{ zIndex: 100 }}>
      <div className="dialog" style={{ maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div className="dialog-title">{T.termsTitle}</div>
        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flex: 1, minHeight: 0 }}>
          <p style={{ margin: 0 }}>{T.termsGateBody}</p>
          {T.termsSections.map((sec, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h4 style={{ margin: 0, fontSize: 14 }}>{sec.title}</h4>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, opacity: 0.8 }}>{sec.body}</p>
            </div>
          ))}
        </div>
        <div className="dialog-actions">
          <button className="btn btn-primary" onClick={acceptTerms}>
            {T.acceptTermsBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
