import { gsap, reduced } from "./scroll";
import { MARK } from "../mark";

/**
 * Preloader: a satellite descent from Rwanda into Kigali while assets warm up.
 * Coordinates tick, the counter climbs, the logo mark draws itself,
 * then a sand curtain rises and hands over to the hero.
 */
export function runPreloader(onDone: () => void) {
  const root = document.getElementById("loader")!;
  const video = document.getElementById("loader-video") as HTMLVideoElement;
  const count = document.getElementById("loader-count")!;
  const bar = document.getElementById("loader-bar")!;
  const word = document.getElementById("loader-word")!;
  const sub = document.getElementById("loader-sub")!;
  const coords = document.getElementById("loader-coords")!;
  const curtain = document.getElementById("loader-curtain")!;
  const skip = document.getElementById("loader-skip")!;
  const markPath = root.querySelector<SVGPathElement>("#loader-mark path")!;
  markPath.setAttribute("d", MARK);

  const seen = sessionStorage.getItem("inzovu:seen") === "1";
  if (seen || reduced) {
    root.remove();
    onDone();
    return;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    sessionStorage.setItem("inzovu:seen", "1");
    const tl = gsap.timeline({ onComplete: () => { root.remove(); } });
    tl.to(curtain, { y: "0%", duration: 1.0, ease: "expo.inOut" }, 0)
      .to(root.querySelectorAll(".loader__top, .loader__center, .loader__bottom, .loader__bar, .loader__skip"), { opacity: 0, duration: 0.4 }, 0.3)
      .add(() => onDone(), 0.55)
      .to(curtain, { y: "-101%", duration: 1.1, ease: "expo.inOut" }, 1.05);
  };

  // coordinate ticker: drift from the Rwanda-wide view into the exact plot
  const from = { lat: -1.6, lon: 29.6 };
  const to = { lat: -1.9532, lon: 30.0928 };
  const fmt = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v); const d = Math.floor(a); const m = ((a - d) * 60).toFixed(1);
    return `${String(d).padStart(v === to.lon || v === from.lon ? 3 : 2, "0")}°${m.padStart(4, "0")}′${v < 0 ? neg : pos}`;
  };
  const state = { p: 0 };

  const tl = gsap.timeline();
  tl.set(word, { yPercent: 110 })
    .to(video, { opacity: 0.85, duration: 1.2, ease: "power2.out" }, 0)
    .to(markPath, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.1)
    .to(word, { yPercent: 0, duration: 1.4, ease: "expo.out" }, 0.6)
    .to(sub, { opacity: 0.7, duration: 0.8 }, 1.4)
    .to(state, { p: 1, duration: 4.4, ease: "power1.inOut", onUpdate: () => {
        const lat = from.lat + (to.lat - from.lat) * state.p;
        const lon = from.lon + (to.lon - from.lon) * state.p;
        coords.textContent = `${fmt(lat, "N", "S")} · ${fmt(lon, "E", "W")}`;
        const pct = Math.round(state.p * 100);
        count.textContent = String(pct);
        bar.style.transform = `scaleX(${state.p})`;
      } }, 0.2)
    .add(finish, 4.9);

  video.play().catch(() => {});
  skip.addEventListener("click", () => { tl.kill(); finish(); });
}
