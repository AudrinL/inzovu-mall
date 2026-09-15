import { gsap, ScrollTrigger, reduced, lenis } from "./scroll";
import { splitWords } from "./text";

/** Manifesto: words light up one by one as the sentence scrolls through the middle of the screen. */
export function initManifesto() {
  const el = document.getElementById("manifesto-text")!;
  let st: ScrollTrigger | undefined;
  const build = () => {
    st?.kill();
    const words = splitWords(el);
    st = ScrollTrigger.create({ trigger: el, start: "top 75%", end: "bottom 45%", scrub: true,
      onUpdate: (self) => { const n = Math.floor(self.progress * words.length * 1.05); words.forEach((w, i) => w.classList.toggle("is-on", i < n)); } });
    if (!reduced) gsap.fromTo(el.querySelectorAll(".tok"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "elastic.out(1, .55)", stagger: 0.15,
      scrollTrigger: { trigger: el, start: "top 70%", once: true } });
  };
  build();
  document.addEventListener("inzovu:lang", build);
}

/** Parallax for [data-parallax] images (the element moves slower than the page). */
export function initParallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const img = el.querySelector("img") || el;
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
  // hotel string lights: a row of warm dots that fade in as the section arrives
  const hotel = document.getElementById("hotel")!;
  const lights = document.createElement("div"); lights.className = "hotel__lights";
  lights.innerHTML = `<svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" style="overflow:visible">
    <path d="M0 8 Q300 60 600 8 T1200 8" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
    ${Array.from({ length: 17 }, (_, i) => { const x = (i / 16) * 1200; const t = i / 16; const y = 8 + Math.sin(t * Math.PI) * 22 * (t < 0.5 ? 1 : 1) * (Math.abs(Math.sin(t * Math.PI * 2)) + 0.2); return `<circle cx="${x}" cy="${y + 6}" r="7" class="glow bulb"/><circle cx="${x}" cy="${y + 6}" r="2.2" class="bulb"/>`; }).join("")}
  </svg>`;
  hotel.prepend(lights);
  gsap.fromTo(lights.querySelectorAll(".bulb"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: { each: 0.07, from: "random" }, scrollTrigger: { trigger: hotel, start: "top 60%", once: true } });

  // autoplay videos when visible
  document.querySelectorAll<HTMLVideoElement>("video[data-autoplay]").forEach((v) => {
    ScrollTrigger.create({ trigger: v, start: "top 90%", end: "bottom 10%", onToggle: (st) => st.isActive ? v.play().catch(() => {}) : v.pause() });
  });
}

/** Footer marquee, live Kigali clock, year. */
export function initFooter() {
  const m = document.getElementById("marquee")!;
  if (!reduced) gsap.to(m.children, { xPercent: -100, ease: "none", duration: 28, repeat: -1 });
  ScrollTrigger.create({ trigger: m, start: "top bottom", end: "bottom top", onUpdate: (s) => { m.style.transform = `translateX(${-s.progress * 12}vw)`; } });
  document.getElementById("year")!.textContent = String(new Date().getFullYear());
  const clock = document.getElementById("kigali-time")!;
  const tick = () => { clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" }).format(new Date()); };
  tick(); setInterval(tick, 15000);
}

/** Floor plans overlay. */
export function initPlans() {
  const view = document.getElementById("plans-view")!;
  const levels = document.getElementById("plans-levels")!;
  const stage = document.getElementById("plans-stage")!;
  const PLANS = [
    { id: "ground", src: "/assets/img/plan-ground.webp", lvl: "L0", name: { en: "Ground floor", fr: "Rez-de-chaussée" }, d: { en: "Supermarket, plaza, anchor retail, parking access", fr: "Supermarché, place, locomotives, accès parking" } },
    { id: "first", src: "/assets/img/plan-first.webp", lvl: "L1", name: { en: "First floor", fr: "Premier étage" }, d: { en: "Retail gallery, food court, kids area", fr: "Galerie commerciale, food court, espace enfants" } },
    { id: "second", src: "/assets/img/plan-second.webp", lvl: "L2", name: { en: "Second floor", fr: "Deuxième étage" }, d: { en: "Leisure, gym, bowling, rooftop dining", fr: "Loisirs, salle de sport, bowling, restaurant rooftop" } },
    { id: "hotel", src: "/assets/img/plan-hotel.webp", lvl: "H", name: { en: "Hotel floor", fr: "Étage hôtel" }, d: { en: "Typical Odalys residence floor", fr: "Étage type résidence Odalys" } },
    { id: "office", src: "/assets/img/plan-office.webp", lvl: "O", name: { en: "Office floor", fr: "Plateau de bureaux" }, d: { en: "Typical open office floor plate", fr: "Plateau de bureaux type" } },
  ];
  const lang = () => (document.documentElement.lang === "fr" ? "fr" : "en");
  const render = () => {
    const L = lang();
    levels.innerHTML = PLANS.map((p, i) => `<button data-i="${i}"><span class="t-label">${p.lvl}</span><span><span class="name">${p.name[L]}</span><br><span class="t-body">${p.d[L]}</span></span></button>`).join("");
    stage.querySelectorAll("img").forEach((i) => i.remove());
    PLANS.forEach((p) => { const im = new Image(); im.src = p.src; im.alt = p.name[L]; stage.appendChild(im); });
    levels.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => show(+b.dataset.i!)));
    show(cur);
  };
  let cur = 0;
  const show = (i: number) => {
    cur = i;
    levels.querySelectorAll("button").forEach((b, j) => b.classList.toggle("is-on", j === i));
    stage.querySelectorAll("img").forEach((im, j) => im.classList.toggle("is-on", j === i));
  };
  render();
  const open = (e?: Event) => { e?.preventDefault(); view.classList.add("is-open"); lenis.stop(); history.replaceState(null, "", "#plans"); };
  const close = () => { view.classList.remove("is-open"); lenis.start(); history.replaceState(null, "", location.pathname); };
  document.querySelectorAll("[data-open-plans]").forEach((a) => a.addEventListener("click", open));
  document.getElementById("plans-close")!.addEventListener("click", close);
  addEventListener("keydown", (e) => { if (!view.classList.contains("is-open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowDown") show((cur + 1) % PLANS.length); if (e.key === "ArrowUp") show((cur - 1 + PLANS.length) % PLANS.length); });
  document.addEventListener("inzovu:lang", render);
  if (location.hash === "#plans") setTimeout(open, 400);
}

/** Conversational contact form. */
export function initContact() {
  const section = document.getElementById("contact")!;
  const form = document.getElementById("convo") as HTMLFormElement;
  const send = document.getElementById("convo-send")!;
  // select slots
  form.querySelectorAll<HTMLElement>(".slot--select").forEach((slot) => {
    const input = slot.querySelector("input")!;
    input.addEventListener("click", () => slot.classList.toggle("is-open"));
    slot.querySelectorAll<HTMLButtonElement>(".opts button").forEach((b) => b.addEventListener("click", () => { input.value = b.textContent || ""; input.dataset.v = b.dataset.v; slot.classList.remove("is-open"); }));
  });
  document.addEventListener("click", (e) => { if (!(e.target as HTMLElement).closest(".slot--select")) form.querySelectorAll(".slot--select").forEach((s) => s.classList.remove("is-open")); });
  // size inputs to content
  form.querySelectorAll<HTMLInputElement>("input").forEach((i) => {
    const fit = () => { const l = Math.max((i.value || i.placeholder).length, 4); i.style.width = l + 1.2 + "ch"; };
    i.addEventListener("input", fit); fit(); document.addEventListener("inzovu:lang", fit);
  });
  send.addEventListener("click", () => {
    const name = form.querySelector<HTMLInputElement>('[name="name"]')!; const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
    const shake = (el: HTMLElement) => gsap.fromTo(el.parentElement, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1, .3)" });
    if (!name.value.trim()) return shake(name), name.focus();
    if (!/.+@.+\..+/.test(email.value)) return shake(email), email.focus();
    // TODO: POST to the leasing inbox (e.g. Resend / Gravity Forms endpoint). Payload shape is ready:
    const payload = Object.fromEntries(new FormData(form).entries());
    (payload as any).interest = form.querySelector<HTMLInputElement>(".slot--select input")!.dataset.v || "";
    console.info("[inzovu] lead", payload);
    gsap.to([form, send.parentElement], { opacity: 0, y: -20, duration: 0.6, ease: "power2.in", onComplete: () => {
      section.classList.add("is-sent");
      gsap.fromTo(section.querySelector(".contact__done")!.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.1 });
    } });
  });
}
