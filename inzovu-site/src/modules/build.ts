import { gsap, reduced } from "./scroll";

/** Earth → landmark comparison: drag, or let the scroll drive it until the user takes over. */
export function initBuild() {
  const el = document.getElementById("compare")!;
  let x = 0.5; let userHeld = false; let userTouched = false;
  const set = (v: number) => { x = Math.min(0.985, Math.max(0.015, v)); el.style.setProperty("--x", (x * 100).toFixed(2) + "%"); };
  set(0.5);

  const onMove = (e: PointerEvent) => { if (!userHeld) return; const r = el.getBoundingClientRect(); set((e.clientX - r.left) / r.width); };
  el.addEventListener("pointerdown", (e) => { userHeld = true; userTouched = true; el.setPointerCapture(e.pointerId); onMove(e); });
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", () => (userHeld = false));
  el.addEventListener("pointercancel", () => (userHeld = false));

  // scroll-driven until touched: the render sweeps in from the right as you scroll past
  if (!reduced) {
    const obj = { v: 0.02 };
    gsap.to(obj, { v: 0.62, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: 0.8,
      onUpdate: () => { if (!userTouched) set(obj.v); } } });
  }

  // live months-to-opening (Q1 2027 → 31 March 2027 as the latest date of the quarter)
  const ml = document.getElementById("months-left")!;
  const target = new Date(2027, 2, 31);
  const now = new Date();
  const months = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()));
  ml.textContent = String(months);
}
