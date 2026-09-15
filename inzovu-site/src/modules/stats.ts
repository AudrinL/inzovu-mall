import { gsap, ScrollTrigger, reduced } from "./scroll";
import { getLang, onLangChange } from "./i18n";

type Cell = { id: string; v: number; name: { en: string; fr: string }; img: string };
const DATA: Cell[] = [
  { id: "shops", v: 9000, name: { en: "shops", fr: "commerces" }, img: "/assets/img/shops-1.webp" },
  { id: "business", v: 6000, name: { en: "business centre", fr: "centre d'affaires" }, img: "/assets/img/business-2.webp" },
  { id: "hotel", v: 5000, name: { en: "inzovu hôtel", fr: "inzovu hôtel" }, img: "/assets/img/pool-sunset.webp" },
  { id: "leisure", v: 4000, name: { en: "leisure", fr: "loisirs" }, img: "/assets/img/aerial-2.webp" },
  { id: "dining", v: 1635, name: { en: "dining", fr: "restauration" }, img: "/assets/img/rooftop-night.webp" },
  { id: "other", v: 3365, name: { en: "services & circulation", fr: "services & circulations" }, img: "/assets/img/plaza-4.webp" },
];

/** Squarified treemap (Bruls et al.) — every block is proportional to its floor area. */
function squarify(items: Cell[], x: number, y: number, w: number, h: number): { c: Cell; x: number; y: number; w: number; h: number }[] {
  const out: { c: Cell; x: number; y: number; w: number; h: number }[] = [];
  const total = items.reduce((a, b) => a + b.v, 0);
  const scale = (w * h) / total;
  let rest = [...items].sort((a, b) => b.v - a.v);
  let rx = x, ry = y, rw = w, rh = h;
  const worst = (row: Cell[], side: number) => {
    const s = row.reduce((a, b) => a + b.v * scale, 0);
    const mx = Math.max(...row.map((r) => r.v * scale)); const mn = Math.min(...row.map((r) => r.v * scale));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  while (rest.length) {
    const vertical = rw >= rh; const side = vertical ? rh : rw;
    let row: Cell[] = [rest[0]]; let i = 1;
    while (i < rest.length && worst([...row, rest[i]], side) <= worst(row, side)) { row.push(rest[i]); i++; }
    const area = row.reduce((a, b) => a + b.v * scale, 0);
    const thick = area / side;
    let off = 0;
    row.forEach((c) => {
      const len = (c.v * scale) / thick;
      out.push(vertical ? { c, x: rx, y: ry + off, w: thick, h: len } : { c, x: rx + off, y: ry, w: len, h: thick });
      off += len;
    });
    if (vertical) { rx += thick; rw -= thick; } else { ry += thick; rh -= thick; }
    rest = rest.slice(i);
  }
  return out;
}

export function initStats() {
  const root = document.getElementById("treemap")!;
  const gap = 6;
  const build = () => {
    const W = root.clientWidth, H = root.clientHeight;
    const L = getLang();
    const cells = squarify(DATA, 0, 0, W, H);
    root.innerHTML = "";
    cells.forEach((k) => {
      const el = document.createElement("div");
      el.className = "treemap__cell" + (k.w < 160 || k.h < 120 ? " treemap__cell--xs" : "");
      el.dataset.id = k.c.id;
      const fs = Math.round(Math.max(16, Math.min(64, k.w * 0.13, k.h * 0.26)));
      el.style.cssText = `left:${k.x + gap / 2}px;top:${k.y + gap / 2}px;width:${k.w - gap}px;height:${k.h - gap}px;--cell-img:url(${k.c.img});--fs:${fs}px`;
      const pct = Math.round((k.c.v / 29000) * 100);
      el.innerHTML = `<span class="t-label">${pct}%</span><div><b>${k.c.v.toLocaleString("en-US")}<small> m²</small></b><div class="name">${k.c.name[L]}</div></div><span class="enter">${L === "fr" ? "entrer ↗" : "enter ↗"}</span>`;
      el.setAttribute("data-cursor", L === "fr" ? "entrer" : "enter");
      root.appendChild(el);
    });
    const els = Array.from(root.children);
    if (!reduced) {
      gsap.set(els, { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" });
      ScrollTrigger.create({ trigger: root, start: "top 80%", once: true,
        onEnter: () => gsap.to(els, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out", stagger: { each: 0.08, from: "start" } }) });
    }
    els.forEach((el) => el.addEventListener("click", () => {
      const id = (el as HTMLElement).dataset.id!;
      document.querySelector<HTMLElement>(`[data-open-zone="${id}"]`)?.click();
    }));
  };
  build();
  let t: number; addEventListener("resize", () => { clearTimeout(t); t = window.setTimeout(build, 200); });
  onLangChange(build);
}
