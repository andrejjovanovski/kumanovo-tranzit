import type { CSSProperties } from "react";

export interface BadgeStyle {
  bg: string;
  color: string;
  border: string;
}

/** Circular line-number badge. Sizes map to the prototype's usages. */
export function LineBadge({
  num,
  badge,
  size = 44,
  fontSize,
  style,
}: {
  num: string;
  badge: BadgeStyle;
  size?: number;
  fontSize?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, flex: "none",
        fontFamily: "var(--font-heading)", fontWeight: 800,
        fontSize: fontSize ?? Math.round(size * 0.45),
        background: badge.bg, color: badge.color, border: badge.border,
        borderRadius: "50%",
        ...style,
      }}
    >
      {num}
    </span>
  );
}
