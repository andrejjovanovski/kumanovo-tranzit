let hidden = false;

/** Fade out and remove the boot splash defined in index.html. Idempotent —
 *  safe to call from multiple readiness signals. */
export function hideSplash(): void {
  if (hidden) return;
  hidden = true;
  const el = document.getElementById("kt-splash");
  if (!el) return;
  el.classList.add("kt-hide");
  el.addEventListener("transitionend", () => el.remove(), { once: true });
  // Safety net if the transition never fires (e.g. reduced motion).
  window.setTimeout(() => el.remove(), 600);
}
