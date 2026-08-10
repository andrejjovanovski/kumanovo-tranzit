import { Smartphone } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { BackLink } from "@/components/ui/BackLink";

interface Step {
  n: number;
  label: string;
  placeholder: string;
}

function StepList({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, background: "var(--color-bg)", zIndex: 2, paddingBlock: 10, borderBottom: "2px solid var(--color-divider)" }}>
        <Smartphone size={18} />
        <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</h3>
      </div>
      {steps.map((st) => (
        <div key={st.n} className="card" style={{ gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, flex: "none", background: "var(--color-neutral-900)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, borderRadius: 8 }}>
              {st.n}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{st.label}</div>
          </div>
          <div
            style={{
              width: "100%", aspectRatio: "9 / 16", maxHeight: 360, marginTop: "var(--space-2)",
              border: "2px dashed var(--color-divider)", borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
              padding: "var(--space-4)", color: "color-mix(in srgb, var(--color-text) 45%, transparent)", fontSize: 12,
            }}
          >
            {st.placeholder}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InstallPage() {
  const { T, tr } = useT();
  const { isMobile } = useBreakpoint();

  const androidSteps: Step[] = [
    { n: 1, label: tr("Отворете го Chrome и допрете на менито (⋮)", "Open Chrome and tap the menu (⋮)", "Hapni Chrome dhe prekni menun (⋮)"), placeholder: tr("Слика: Chrome мени", "Screenshot: Chrome menu", "Foto: Menuja Chrome") },
    { n: 2, label: tr("Изберете „Додај на почетен екран“", 'Select "Add to Home screen"', 'Zgjidhni "Shto në ekranin kryesor"'), placeholder: tr("Слика: Додај на почетен екран", "Screenshot: Add to Home screen", "Foto: Shto në ekranin kryesor") },
    { n: 3, label: tr("Потврдете со „Додај“", 'Confirm by tapping "Add"', 'Konfirmoni duke prekur "Shto"'), placeholder: tr("Слика: Потврда", "Screenshot: Confirmation", "Foto: Konfirmimi") },
    { n: 4, label: tr("Иконата се појавува на почетниот екран", "The icon appears on your home screen", "Ikona shfaqet në ekranin kryesor"), placeholder: tr("Слика: Икона на екран", "Screenshot: Icon on home screen", "Foto: Ikona në ekran") },
  ];
  const iosSteps: Step[] = [
    { n: 1, label: tr("Отворете во Safari и допрете „Сподели“", "Open in Safari and tap the Share icon", 'Hapni në Safari dhe prekni ikonën "Share"'), placeholder: tr("Слика: Копче Сподели", "Screenshot: Share button", "Foto: Butoni Share") },
    { n: 2, label: tr("Скролувајте и изберете „Додај на почетен екран“", 'Scroll down and select "Add to Home Screen"', 'Rrëshqisni poshtë dhe zgjidhni "Add to Home Screen"'), placeholder: tr("Слика: Додај на почетен екран", "Screenshot: Add to Home Screen", "Foto: Add to Home Screen") },
    { n: 3, label: tr("Потврдете со „Додај“ горе десно", 'Confirm by tapping "Add" top-right', 'Konfirmoni duke prekur "Add" në të djathtë sipër'), placeholder: tr("Слика: Потврда", "Screenshot: Confirmation", "Foto: Konfirmimi") },
    { n: 4, label: tr("Иконата се појавува на почетниот екран", "The icon appears on your home screen", "Ikona shfaqet në ekranin kryesor"), placeholder: tr("Слика: Икона на екран", "Screenshot: Icon on home screen", "Foto: Ikona në ekran") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", maxWidth: 900 }}>
      <BackLink to="/" />
      <div>
        <h2 style={{ margin: "0 0 6px" }}>{T.installTitle}</h2>
        <p style={{ margin: 0, opacity: 0.75, maxWidth: 560 }}>{T.installIntro}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "var(--space-5)" }}>
        <StepList title={T.installAndroidTitle} steps={androidSteps} />
        <StepList title={T.installIosTitle} steps={iosSteps} />
      </div>
    </div>
  );
}
