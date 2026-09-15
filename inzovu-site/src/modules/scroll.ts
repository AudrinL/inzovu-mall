import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = window.matchMedia("(hover: none)").matches;
export const isMobile = () => window.innerWidth < 761;

export let lenis: Lenis;

export function initScroll() {
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // released after the preloader

  // progress ribbon (left edge)
  const bar = document.getElementById("progress-bar")!;
  const label = document.getElementById("progress-label")!;
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > footer"));
  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - innerHeight,
    onUpdate: (self) => {
      bar.style.transform = `scaleY(${self.progress})`;
    },
  });
  sections.forEach((s, i) => {
    ScrollTrigger.create({
      trigger: s,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (st) => {
        if (st.isActive) label.textContent = String(i).padStart(2, "0") + " — " + (s.id || "");
      },
    });
  });

  // theme: the page goes to dusk at the hotel
  const trigger = document.querySelector<HTMLElement>("[data-theme-trigger]");
  if (trigger) {
    ScrollTrigger.create({
      trigger,
      start: "top 70%",
      endTrigger: "main > footer", end: "bottom top", // footer bottom never reaches the viewport top → stays dark to the end
      onToggle: (st) => st.isActive ? document.documentElement.setAttribute("data-theme", "dark") : document.documentElement.removeAttribute("data-theme"),
    });
  }

  // anchor links → smooth scroll
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.hasAttribute("data-open-plans") || a.hasAttribute("data-open-zone")) return;
    const id = a.getAttribute("href")!;
    if (id.length < 2) return;
    let el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    // pinned sections live inside a pin-spacer: aim for its top so the pin plays from the start
    if (el.parentElement?.classList.contains("pin-spacer")) el = el.parentElement;
    lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
}

export function releaseScroll() {
  lenis.start();
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
