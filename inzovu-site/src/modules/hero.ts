import { gsap, ScrollTrigger, reduced, isTouch } from "./scroll";

/**
 * Hero: three depth layers (sky / wordmark / building).
 * Entrance: wordmark rises from behind the horizon, building settles, UI fades in.
 * Idle: pointer parallax by [data-depth]. Scroll: the building grows, the word sinks.
 */
export function initHero() {
  const hero = document.getElementById("hero")!;
  const layers = Array.from(hero.querySelectorAll<HTMLElement>("[data-depth]"));
  const word = document.getElementById("hero-word")!;
  const ui = hero.querySelector<HTMLElement>(".hero__ui")!;
  const scrollHint = hero.querySelector<HTMLElement>(".hero__scroll")!;
  const building = hero.querySelector<HTMLElement>(".hero__building")!;

  gsap.set(word, { yPercent: 105 });
  gsap.set(ui.children, { opacity: 0, y: 20 });
  gsap.set(scrollHint, { yPercent: 100 });
  gsap.set(building, { scale: 1.08, transformOrigin: "50% 100%" });

  // pointer parallax
  if (!isTouch && !reduced) {
    const target = { x: 0, y: 0 }; const cur = { x: 0, y: 0 };
    hero.addEventListener("pointermove", (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 2;
      target.y = (e.clientY / innerHeight - 0.5) * 2;
    });
    let live = true;
    ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (st) => (live = st.isActive) });
    gsap.ticker.add(() => {
      if (!live) return;
      cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth) * 400;
        const centred = l.classList.contains("hero__word") && innerWidth > 900;
        l.style.transform = `translate3d(${-cur.x * d}px, ${-cur.y * d * 0.6}px, 0)${centred ? " translateX(-50%)" : ""}`;
      });
    });
  }

  // scroll: cinematic depth — built once the entrance has landed so start values are final
  const buildScrub = () => {
    const st = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    st.fromTo(word, { yPercent: 0, opacity: 1 }, { yPercent: 60, opacity: 0.4, ease: "none", immediateRender: false }, 0)
      .fromTo(building, { scale: 1, yPercent: 0 }, { scale: 1.16, yPercent: -6, ease: "none", immediateRender: false }, 0)
      .fromTo(hero.querySelector(".hero__sky"), { yPercent: 0 }, { yPercent: 12, ease: "none", immediateRender: false }, 0)
      .fromTo(ui, { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: -10, ease: "none", immediateRender: false }, 0);
  };

  return () => {
    const tl = gsap.timeline({ onComplete: buildScrub });
    tl.to(word, { yPercent: 0, duration: reduced ? 0 : 1.8, ease: "expo.out" }, 0)
      .to(building, { scale: 1, duration: reduced ? 0 : 2.4, ease: "expo.out" }, 0)
      .to(ui.children, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.6)
      .to(scrollHint, { yPercent: 0, duration: 1, ease: "expo.out" }, 1.2);
    ScrollTrigger.refresh();
  };
}
