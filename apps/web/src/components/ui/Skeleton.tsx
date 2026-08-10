import type { CSSProperties } from "react";

/** Shimmering placeholder block used while data loads. */
export function Skeleton({ height = 96, style }: { height?: number; style?: CSSProperties }) {
  return (
    <div
      className="card elev-md"
      style={{ height, animation: "kt-shimmer 1.4s ease-in-out infinite", ...style }}
    />
  );
}
