import { gsap, ScrollTrigger, reduced } from "./scroll";

// Simplified continental outline (lon, lat)
const COAST: [number, number][] = [
  [-5.8, 35.8], [-2, 35.2], [3, 36.9], [10.2, 37.2], [11.1, 33.9], [15.2, 32.4], [20, 32.1], [25, 31.7], [29.9, 31.2], [32.3, 31.3],
  [34.2, 27.8], [35.5, 23.5], [37.3, 19.5], [38.6, 18], [39.4, 15.4], [41.2, 13.5], [43.2, 12.6], [43.2, 11.6], [45.5, 10.6], [48.5, 11.3], [51.3, 11.8],
  [50.8, 9.5], [49, 6.5], [47.5, 4.5], [45.3, 2], [43, -0.5], [41.5, -1.7], [40.2, -3], [39.7, -4], [39.3, -6.8], [39.5, -8.5], [40.5, -10.5], [40.5, -12.5], [40.6, -15], [39.6, -16.5], [36.8, -17.9], [34.9, -19.8], [35.4, -22.5], [35.5, -24], [32.9, -25.9], [32.6, -26.9], [32.3, -28.5], [31, -29.9], [29.5, -31.7], [27.5, -33.5], [25.6, -34], [22.5, -34.1], [20, -34.8], [18.4, -33.9], [18.3, -32.5], [17.9, -31.5], [17, -30], [16.5, -28.5], [15.2, -26.6], [14.5, -23], [13.4, -20.8], [12.5, -18.9], [11.8, -17.2], [12.2, -15.2], [13.2, -12.5], [13.5, -10.5], [13.2, -8.8], [12.6, -7], [12.2, -5.8], [11.9, -4.8], [11, -3.5], [9.8, -2], [9.4, 0.4], [9.6, 2.4], [9.7, 4], [8.6, 4.5], [7, 4.4], [5.5, 4.4], [4.5, 6.2], [3.4, 6.5], [2, 6.3], [1.2, 6.1], [0, 5.7], [-1.5, 5], [-3, 5.1], [-4, 5.3], [-6, 4.8], [-7.6, 4.4], [-9.5, 5.5], [-10.8, 6.3], [-12.5, 7.5], [-13.2, 8.5], [-13.8, 9.7], [-15, 11], [-16.6, 12.4], [-16.8, 13.6], [-17.4, 14.7], [-16.5, 16.5], [-16.3, 19.3], [-17, 20.9], [-15.9, 23.7], [-14.5, 26], [-13.2, 27.1], [-11, 28.5], [-9.6, 30.4], [-9.8, 32], [-7.6, 33.6], [-6.5, 34.5], [-5.8, 35.8],
];
const MADA: [number, number][] = [[49.3, -12.3], [50.4, -15.5], [49.7, -18.5], [48.5, -22.5], [47.1, -24.8], [45.2, -25.5], [43.7, -23.5], [43.3, -21], [44.4, -17.5], [46.3, -15.6], [47.9, -13.4], [49.3, -12.3]];

const PINS: Record<string, { lon: number; lat: number; name: string }> = {
  sama: { lon: -4.0, lat: 5.32, name: "Abidjan" },
  notrepere: { lon: -3.98, lat: 5.36, name: "Abidjan" },
  riviera: { lon: -3.95, lat: 5.34, name: "Abidjan" },
  sadi: { lon: 9.7, lat: 4.05, name: "Douala" },
  lome: { lon: 1.22, lat: 6.13, name: "Lomé" },
  kigali: { lon: 30.09, lat: -1.95, name: "Kigali" },
};

const W = 640, H = 640;
const proj = (lon: number, lat: number) => ({ x: ((lon + 20) / 75) * W, y: ((38 - lat) / 75) * H });

/** Dotted continent, gold pins for Groupe Duval's projects, a dashed line from each to Kigali. */
export function initAfrica() {
  const root = document.getElementById("africa-map")!;
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".africa__row"));
  const pathFrom = (pts: [number, number][]) => pts.map((p, i) => { const q = proj(p[0], p[1]); return `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`; }).join(" ") + "Z";

  // dot grid clipped to the continent
  const step = 13; let dots = "";
  const clip = `<clipPath id="af-clip"><path d="${pathFrom(COAST)}"/><path d="${pathFrom(MADA)}"/></clipPath><clipPath id="af-grow"><circle id="af-reveal" cx="${proj(PINS.kigali.lon, PINS.kigali.lat).x}" cy="${proj(PINS.kigali.lon, PINS.kigali.lat).y}" r="0"/></clipPath>`;
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) dots += `<circle class="dot" cx="${x + (y / step % 2) * step / 2}" cy="${y}" r="1.6"/>`;

  const home = proj(PINS.kigali.lon, PINS.kigali.lat);
  const links = Object.entries(PINS).filter(([k]) => k !== "kigali").map(([k, p]) => {
    const q = proj(p.lon, p.lat); const mx = (q.x + home.x) / 2, my = Math.min(q.y, home.y) - 60;
    return `<path class="link" data-link="${k}" d="M${q.x} ${q.y} Q${mx} ${my} ${home.x} ${home.y}"/>`;
  }).join("");
  const pins = Object.entries(PINS).map(([k, p]) => {
    const q = proj(p.lon, p.lat);
    return `<g class="pin ${k === "kigali" ? "home is-active" : ""}" data-pin="${k}" transform="translate(${q.x} ${q.y})"><circle class="halo" r="6"/><circle r="4"/><text x="10" y="4" font-family="var(--font-mono)" font-size="10" fill="currentColor" opacity=".7">${p.name}</text></g>`;
  }).join("");

  root.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><defs>${clip}</defs><g clip-path="url(#af-grow)"><g clip-path="url(#af-clip)">${dots}</g></g><path class="outline" d="${pathFrom(COAST)}"/><path class="outline" d="${pathFrom(MADA)}"/>${links}${pins}</svg>`;

  const svg = root.querySelector("svg")!;
  const setActive = (key: string) => {
    rows.forEach((r) => r.classList.toggle("is-active", r.dataset.pin === key));
    svg.querySelectorAll<SVGGElement>(".pin").forEach((p) => p.classList.toggle("is-active", p.dataset.pin === key || p.dataset.pin === "kigali"));
    svg.querySelectorAll<SVGPathElement>(".link").forEach((l) => {
      const on = l.dataset.link === key;
      const len = l.getTotalLength();
      gsap.killTweensOf(l);
      if (on) { l.style.strokeDasharray = `${len}`; l.style.strokeDashoffset = `${len}`; gsap.to(l, { opacity: 1, strokeDashoffset: 0, duration: reduced ? 0 : 1.2, ease: "expo.out" }); }
      else gsap.to(l, { opacity: 0, duration: 0.4 });
    });
  };
  rows.forEach((r) => { r.addEventListener("pointerenter", () => setActive(r.dataset.pin!)); r.addEventListener("click", () => setActive(r.dataset.pin!)); });
  svg.querySelectorAll<SVGGElement>(".pin").forEach((p) => p.addEventListener("pointerenter", () => setActive(p.dataset.pin!)));

  // entrance: one clip circle grows out of Kigali (a single tween, not one per dot)
  if (!reduced) {
    const reveal = svg.querySelector<SVGCircleElement>("#af-reveal")!;
    gsap.set(svg.querySelectorAll(".pin"), { opacity: 0, scale: 0, transformOrigin: "center" });
    ScrollTrigger.create({ trigger: root, start: "top 75%", once: true, onEnter: () => {
      gsap.to(reveal, { attr: { r: 900 }, duration: 2.2, ease: "power2.out" });
      gsap.to(svg.querySelectorAll(".pin"), { opacity: 1, scale: 1, duration: 1, ease: "back.out(2)", stagger: 0.12, delay: 1.0 });
    } });
  } else {
    svg.querySelector("#af-reveal")!.setAttribute("r", "900");
  }
}
