import { gsap, ScrollTrigger, lenis } from "./scroll";
import { MARK } from "../mark";

export function initNav() {
  const nav = document.getElementById("nav")!;
  document.querySelectorAll<SVGPathElement>("svg.mark path").forEach((p) => p.setAttribute("d", MARK));

  ScrollTrigger.create({
    start: "top -80%",
    onToggle: (st) => nav.classList.toggle("is-scrolled", st.isActive || scrollY > innerHeight * 0.8),
  });
  addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > innerHeight * 0.8), { passive: true });

  // white nav while a dark passage sits under it (dark-theme sections handle themselves via --fg)
  const lightOver = document.querySelectorAll<HTMLElement>("[data-nav-light]");
  const under = new Set<HTMLElement>();
  const ribbon = document.querySelector(".ribbon-progress");
  const sync = () => { nav.classList.toggle("is-light", under.size > 0); ribbon?.classList.toggle("is-light", under.size > 0); };
  lightOver.forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 40px", end: "bottom 40px",
    onToggle: (st) => { st.isActive ? under.add(el) : under.delete(el); sync(); } }));

  // active link
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>(".nav__links a"));
  links.forEach((a) => {
    const id = a.getAttribute("href")!;
    if (a.hasAttribute("data-open-plans")) return;
    const el = document.querySelector(id);
    if (!el) return;
    ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%",
      onToggle: (st) => a.classList.toggle("is-active", st.isActive) });
  });

  // mobile menu
  const burger = document.getElementById("burger")!;
  const menu = document.getElementById("menu")!;
  let open = false;
  const setOpen = (v: boolean) => {
    open = v;
    menu.classList.toggle("is-open", v);
    gsap.to(burger.children[0], { rotate: v ? 45 : 0, y: v ? 2 : 0, duration: 0.4 });
    gsap.to(burger.children[1], { rotate: v ? -45 : 0, y: v ? -2 : 0, duration: 0.4 });
    nav.classList.toggle("is-menu", v);
    v ? lenis.stop() : lenis.start();
  };
  burger.addEventListener("click", () => setOpen(!open));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

export function showNav() {
  document.getElementById("nav")!.classList.add("is-in");
}
