import { gsap, isTouch } from "./scroll";

/**
 * Custom cursor: a dot that leads, a ring that follows.
 * Any element with [data-cursor="label"] turns the ring into a labelled disc.
 * Buttons/links with .pill or .magnetic get a magnetic pull.
 */
export function initCursor() {
  const root = document.getElementById("cursor")!;
  if (isTouch) { root.remove(); document.body.classList.remove("no-cursor"); return; }
  const dot = root.querySelector<HTMLElement>(".cursor__dot")!;
  const ring = root.querySelector<HTMLElement>(".cursor__ring")!;
  const label = ring.querySelector("span")!;

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };
  let visible = false;

  const setDot = gsap.quickSetter(dot, "x", "px"); const setDotY = gsap.quickSetter(dot, "y", "px");
  const setRing = gsap.quickSetter(ring, "x", "px"); const setRingY = gsap.quickSetter(ring, "y", "px");

  addEventListener("pointermove", (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    if (!visible) { visible = true; gsap.to(ring, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }); }
  });
  document.addEventListener("mouseleave", () => { visible = false; gsap.to(ring, { opacity: 0, scale: 0.5, duration: 0.4 }); });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    setDot(pos.x); setDotY(pos.y);
    setRing(ringPos.x); setRingY(ringPos.y);
  });

  // labelled states
  document.addEventListener("pointerover", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    if (t) { label.textContent = t.dataset.cursor || ""; root.classList.add("is-text"); return; }
    const link = (e.target as HTMLElement).closest("a, button, .africa__row, .treemap__cell, .plans-view__levels button");
    if (link) gsap.to(ring, { scale: 1.6, duration: 0.5, ease: "expo.out" });
  });
  document.addEventListener("pointerout", (e) => {
    const t = (e.target as HTMLElement).closest("[data-cursor]");
    if (t) root.classList.remove("is-text");
    const link = (e.target as HTMLElement).closest("a, button, .africa__row, .treemap__cell, .plans-view__levels button");
    if (link) gsap.to(ring, { scale: 1, duration: 0.5, ease: "expo.out" });
  });
  document.addEventListener("pointerdown", () => gsap.to(dot, { scale: 2.2, duration: 0.2 }));
  document.addEventListener("pointerup", () => gsap.to(dot, { scale: 1, duration: 0.4, ease: "expo.out" }));

  // magnetic pills
  document.querySelectorAll<HTMLElement>(".pill, .nav__burger, .zone-view__nav").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "expo.out" });
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }));
  });
}
