export interface Segment<T extends string> {
  key: T;
  label: string;
}

/** Minimalist segmented control: a hairline-bordered row where the active
 *  segment is an accent fill. Shared by the Schedule and Line detail pages so
 *  their toggles stay identical. */
export function SegmentedButtons<T extends string>({
  segments,
  value,
  onChange,
  fullWidth = true,
}: {
  segments: Segment<T>[];
  value: T;
  onChange: (key: T) => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: fullWidth ? "100%" : undefined,
        alignSelf: fullWidth ? undefined : "flex-start",
        border: "1px solid var(--color-divider)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      {segments.map((seg, i) => {
        const sel = seg.key === value;
        return (
          <button
            key={seg.key}
            onClick={() => onChange(seg.key)}
            aria-pressed={sel}
            style={{
              flex: fullWidth ? 1 : undefined,
              border: "none",
              borderRight: i < segments.length - 1 ? "1px solid var(--color-divider)" : "none",
              padding: "10px 14px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "background 0.15s",
              background: sel ? "var(--color-accent-600)" : "transparent",
              color: sel ? "#fff" : "var(--color-text)",
            }}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
