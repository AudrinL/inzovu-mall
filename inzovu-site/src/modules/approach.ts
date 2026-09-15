import { gsap, ScrollTrigger, isMobile, reduced } from "./scroll";

const FRAMES = 192;
const src = (i: number) => `/assets/frames/approach/f_${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Scroll-scrubbed aerial approach. 192 WebP frames painted to a canvas.
 * Frames load progressively (every 8th first, then the rest) so the first scrub is never blank.
 * Mobile / reduced-motion: a looping video instead.
 */
export function initApproach() {
  const section = document.getElementById("approach")!;
  const canvas = document.getElementById("approach-canvas") as HTMLCanvasElement;
  const video = document.getElementById("approach-video") as HTMLVideoElement;
  const caps = Array.from(section.querySelectorAll<HTMLElement>(".approach__cap"));
  const time = document.getElementById("approach-time")!;
  const progress = document.getElementById("approach-progress")!;

  if (isMobile() || reduced) {
    canvas.remove();
    video.style.display = "block";
    video.preload = "auto";
    ScrollTrigger.create({ trigger: section, start: "top 80%", end: "bottom 20%",
      onToggle: (st) => st.isActive ? video.play().catch(() => {}) : video.pause() });
    section.style.height = "220vh";
  } else {
    video.remove();
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAMES);
    let current = -1;
    const dpr = Math.min(devicePixelRatio, 1.5);

    const fit = () => {
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      current = -1; draw(lastIdx);
    };
    let lastIdx = 0;
    const draw = (i: number) => {
      lastIdx = i;
      // nearest loaded frame
      let img = frames[i];
      if (!img) { for (let d = 1; d < 16 && !img; d++) img = frames[i - d] || frames[i + d]; }
      if (!img || !img.complete || i === current) return;
      current = i;
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    const load = (i: number) => new Promise<void>((res) => {
      const im = new Image(); im.decoding = "async";
      im.onload = () => { frames[i] = im; if (Math.abs(i - lastIdx) < 4) { current = -1; draw(lastIdx); } res(); };
      im.onerror = () => res();
      im.src = src(i);
    });
    // progressive: coarse pass, then fill
    const start = async () => {
      const coarse = []; for (let i = 0; i < FRAMES; i += 8) coarse.push(load(i));
      await Promise.all(coarse); draw(0);
      for (let i = 0; i < FRAMES; i++) if (!frames[i]) load(i);
    };
    ScrollTrigger.create({ trigger: section, start: "top 150%", once: true, onEnter: start });
    fit(); addEventListener("resize", fit);

    gsap.to({ f: 0 }, { f: FRAMES - 1, ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.4,
        onUpdate: (self) => {
          draw(Math.round(self.progress * (FRAMES - 1)));
          progress.style.transform = `scaleX(${self.progress})`;
          const t = self.progress * 12; time.textContent = `00:${String(Math.floor(t)).padStart(2, "0")}.${String(Math.floor((t % 1) * 24)).padStart(2, "0")}`;
        } } });
  }

  // captions swap along the scrub
  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true } });
  const n = caps.length; const seg = 1 / n;
  caps.forEach((c, i) => {
    tl.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: seg * 0.3, ease: "power2.out" }, i * seg + seg * 0.1)
      .to(c, { opacity: 0, y: -30, duration: seg * 0.25, ease: "power2.in" }, (i + 1) * seg - seg * 0.25);
  });

  // frame + hud fade in when pinned
  gsap.fromTo(section.querySelectorAll(".approach__frame, .approach__hud, .approach__progress"), { opacity: 0 }, { opacity: 1, duration: 1,
    scrollTrigger: { trigger: section, start: "top 30%", toggleActions: "play none none reverse" } });
}
