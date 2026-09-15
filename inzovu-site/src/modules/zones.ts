import { gsap, ScrollTrigger, lenis, isMobile, reduced } from "./scroll";
import { ZONES } from "../data/zones";
import { getLang, onLangChange } from "./i18n";

/**
 * The ribbon: six cards travel horizontally while a green line — the building's own curve —
 * draws itself through them. Click a card: the overlay opens as a circle from the pointer,
 * with an Amáli-style spec bar and prev/next. Hash-routed (#space=shops), keyboard-navigable.
 */
export function initZones() {
  const section = document.getElementById("zones")!;
  const track = document.getElementById("zones-track")!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>(".zone-card"));
  const svg = document.getElementById("zones-ribbon") as unknown as SVGSVGElement;
  const path = document.getElementById("zones-ribbon-path") as unknown as SVGPathElement;

  let horizontal: ScrollTrigger | undefined;

  const buildRibbon = () => {
    const w = track.scrollWidth; const h = section.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.style.width = w + "px"; svg.style.height = h + "px";
    // weave: over the odd cards, under the even ones (even cards sit 5vh lower via transform)
    const lift = 26;
    const pts = cards.map((c, i) => {
      const shift = i % 2 ? innerHeight * 0.05 : 0;
      const y = i % 2 ? c.offsetTop + c.offsetHeight + shift + lift : c.offsetTop - lift;
      return { x: c.offsetLeft + c.offsetWidth / 2, y, hw: c.offsetWidth / 2 };
    });
    let d = `M ${-100} ${h * 0.5}`;
    let prev = { x: -100, y: h * 0.5 };
    pts.forEach((p) => {
      const cx = (prev.x + (p.x - p.hw * 0.7)) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x - p.hw * 0.7} ${p.y} L ${p.x + p.hw * 0.7} ${p.y}`;
      prev = { x: p.x + p.hw * 0.7, y: p.y };
    });
    d += ` C ${prev.x + 300} ${prev.y}, ${w + 200} ${h * 0.5}, ${w + 400} ${h * 0.5}`;
    path.setAttribute("d", d);
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`; path.style.strokeDashoffset = `${len}`;
    return len;
  };

  const bar = document.getElementById("zones-track-bar")!;
  const idx = document.getElementById("zones-idx")!;
  // prev / next buttons step the pinned scroll by one card
  const step = (dir: 1 | -1) => {
    if (!horizontal) return;
    const span = horizontal.end - horizontal.start;
    const cur = Math.round(horizontal.progress * cards.length);
    const target = Math.max(0, Math.min(cards.length, cur + dir));
    lenis.scrollTo(horizontal.start + (target / cards.length) * span, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  };
  document.getElementById("zones-prev")!.addEventListener("click", () => step(-1));
  document.getElementById("zones-next")!.addEventListener("click", () => step(1));

  const setup = () => {
    horizontal?.kill();
    if (isMobile()) { gsap.set(track, { x: 0 }); return; }
    const len = buildRibbon();
    const dist = () => track.scrollWidth - innerWidth;
    const tl = gsap.timeline({ scrollTrigger: {
      trigger: section, start: "top top", end: () => "+=" + (dist() + innerHeight * 0.5), pin: true, scrub: 0.6, invalidateOnRefresh: true, refreshPriority: 10,
      onUpdate: (self) => {
        path.style.strokeDashoffset = `${len * (1 - Math.min(1, self.progress * 1.15))}`;
        bar.style.setProperty("--p", String(self.progress));
        idx.textContent = String(Math.min(cards.length, 1 + Math.floor(self.progress * cards.length))).padStart(2, "0");
      },
    } });
    tl.to([track, svg], { x: () => -dist(), ease: "none" }, 0);
    horizontal = tl.scrollTrigger!;
    // subtle per-card parallax on the image while travelling
    cards.forEach((card) => {
      const img = card.querySelector("img")!;
      gsap.fromTo(img, { xPercent: -4 }, { xPercent: 4, ease: "none", scrollTrigger: { containerAnimation: tl, trigger: card, start: "left right", end: "right left", scrub: true } });
    });
  };
  setup();
  let rt: number; addEventListener("resize", () => { clearTimeout(rt); rt = window.setTimeout(() => { setup(); ScrollTrigger.refresh(); }, 250); });

  // ── overlay ────────────────────────────────────────────────
  const view = document.getElementById("zone-view")!;
  const media = document.getElementById("zone-media")!;
  const dots = document.getElementById("zone-dots")!;
  const idxEl = document.getElementById("zone-idx")!;
  const kicker = document.getElementById("zone-kicker")!;
  const title = document.getElementById("zone-title")!;
  const lead = document.getElementById("zone-lead")!;
  const specs = document.getElementById("zone-specs")!;
  const prevBtn = document.getElementById("zone-prev")!; const nextBtn = document.getElementById("zone-next")!;
  const prevName = document.getElementById("zone-prev-name")!; const nextName = document.getElementById("zone-next-name")!;
  const closeBtn = document.getElementById("zone-close")!;

  let openIdx = -1; let slide = 0; let slideTimer: number | undefined;

  const render = (i: number, animate = true) => {
    const z = ZONES[i]; const L = getLang();
    idxEl.textContent = `${z.idx} / 0${ZONES.length}`;
    kicker.textContent = z.kicker[L]; title.textContent = z.title[L]; lead.textContent = z.lead[L];
    specs.innerHTML = z.specs.map((s) => `<span><b>${s.v}</b>${s.k[L]}</span>`).join("");
    const p = ZONES[(i - 1 + ZONES.length) % ZONES.length]; const n = ZONES[(i + 1) % ZONES.length];
    prevName.textContent = p.title[L]; nextName.textContent = n.title[L];
    media.innerHTML = z.media.map((m) => m.type === "video"
      ? `<video src="${m.src}" muted loop playsinline preload="metadata"></video>`
      : `<img src="${m.src}" alt="">`).join("");
    dots.innerHTML = z.media.map((_, k) => `<button aria-label="Image ${k + 1}"></button>`).join("");
    dots.querySelectorAll("button").forEach((b, k) => b.addEventListener("click", () => showSlide(k)));
    slide = 0; showSlide(0);
    if (animate && !reduced) {
      gsap.fromTo([kicker, title, lead, specs], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.25 });
    }
  };
  const showSlide = (k: number) => {
    const items = Array.from(media.children) as (HTMLImageElement | HTMLVideoElement)[];
    slide = (k + items.length) % items.length;
    items.forEach((el, j) => { el.classList.toggle("is-on", j === slide); if (el instanceof HTMLVideoElement) j === slide ? el.play().catch(() => {}) : el.pause(); });
    dots.querySelectorAll("button").forEach((b, j) => b.classList.toggle("is-on", j === slide));
    clearTimeout(slideTimer); slideTimer = window.setTimeout(() => showSlide(slide + 1), 5200);
  };

  const open = (i: number, x = innerWidth / 2, y = innerHeight / 2) => {
    openIdx = i; render(i);
    view.style.setProperty("--ox", x + "px"); view.style.setProperty("--oy", y + "px");
    view.classList.add("is-open"); lenis.stop(); document.body.style.overflow = "hidden";
    history.replaceState(null, "", `#space=${ZONES[i].id}`);
    gsap.to(view, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`, duration: reduced ? 0 : 1.2, ease: "expo.inOut" });
  };
  const close = () => {
    if (openIdx < 0) return;
    const x = parseFloat(view.style.getPropertyValue("--ox")); const y = parseFloat(view.style.getPropertyValue("--oy"));
    gsap.to(view, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: reduced ? 0 : 0.9, ease: "expo.inOut", onComplete: () => { view.classList.remove("is-open"); media.innerHTML = ""; } });
    openIdx = -1; clearTimeout(slideTimer); lenis.start(); document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname);
  };
  const go = (dir: 1 | -1) => {
    const next = (openIdx + dir + ZONES.length) % ZONES.length;
    const tl = gsap.timeline();
    tl.to([kicker, title, lead, specs], { x: -40 * dir, opacity: 0, duration: 0.4, ease: "power2.in", stagger: 0.03 })
      .add(() => { openIdx = next; render(next, false); history.replaceState(null, "", `#space=${ZONES[next].id}`); })
      .fromTo([kicker, title, lead, specs], { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.06 });
  };

  cards.forEach((card, i) => card.addEventListener("click", (e) => open(i, e.clientX, e.clientY)));
  document.querySelectorAll<HTMLElement>("[data-open-zone]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); const i = ZONES.findIndex((z) => z.id === a.dataset.openZone); if (i >= 0) open(i, e.clientX, e.clientY);
  }));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => go(-1)); nextBtn.addEventListener("click", () => go(1));
  addEventListener("keydown", (e) => {
    if (openIdx < 0) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowDown") showSlide(slide + 1); if (e.key === "ArrowUp") showSlide(slide - 1);
  });
  let wheelAt = 0;
  view.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) < 30 || performance.now() - wheelAt < 900) return;
    wheelAt = performance.now(); showSlide(slide + Math.sign(e.deltaY));
  }, { passive: true });
  onLangChange(() => { if (openIdx >= 0) render(openIdx, false); });

  // deep link
  const m = location.hash.match(/space=([a-z]+)/);
  if (m) { const i = ZONES.findIndex((z) => z.id === m[1]); if (i >= 0) setTimeout(() => open(i), 400); }
}
