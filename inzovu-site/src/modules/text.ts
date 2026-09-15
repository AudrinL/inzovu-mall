import { gsap, ScrollTrigger, reduced } from "./scroll";

/** Wrap each word in a span (keeps existing inline elements like .tok intact). */
export function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
        else {
          const s = document.createElement("span");
          s.className = "word";
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      node.parentNode!.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && !(node as HTMLElement).classList.contains("tok")) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(el.childNodes).forEach(walk);
  return Array.from(el.querySelectorAll<HTMLElement>(".word"));
}

/** Split a block into visual lines, each wrapped in a mask. Re-runs on resize. */
export function splitLines(el: HTMLElement) {
  const original = el.innerHTML;
  const build = () => {
    el.innerHTML = original;
    const words = splitWords(el);
    // group by offsetTop
    const lines: HTMLElement[][] = [];
    let lastTop = -1;
    words.forEach((w) => {
      const top = w.offsetTop;
      if (top !== lastTop) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(w);
    });
    // rebuild: each line → .line-mask > .line
    const html = lines
      .map((ws) => `<span class="line-mask"><span class="line">${ws.map((w) => w.outerHTML).join(" ")}</span></span>`)
      .join("");
    el.innerHTML = html;
    return Array.from(el.querySelectorAll<HTMLElement>(".line"));
  };
  return build;
}

/** Scroll-triggered line reveal for every [data-reveal="lines"] */
export function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    const build = splitLines(el);
    let lines = build();
    const play = () => {
      gsap.set(lines, { yPercent: 110, rotate: 2, transformOrigin: "left top" });
      gsap.to(lines, { yPercent: 0, rotate: 0, duration: reduced ? 0 : 1.2, ease: "expo.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    };
    play();
    let t: number;
    addEventListener("resize", () => { clearTimeout(t); t = window.setTimeout(() => { lines = build(); gsap.set(lines, { yPercent: 0 }); }, 200); });
  });

  // headings: .t-h1/.t-h2 inside sections get a gentle line reveal too
  document.querySelectorAll<HTMLElement>("section .t-h2, section .t-h1, .stats__total, .t-h3").forEach((el) => {
    if (el.closest(".zone-view, .plans-view, .contact__done, .hero")) return;
    gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 1.3, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  document.querySelectorAll<HTMLElement>("section .t-body, section .t-label, .edge__list li, .timeline > div, .hotel__facts > div, .africa__row").forEach((el) => {
    if (el.closest(".zone-view, .plans-view, .contact__done, .hero, .zone-card, .treemap")) return;
    gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 1.1, ease: "expo.out", delay: 0.05,
      scrollTrigger: { trigger: el, start: "top 94%", once: true } });
  });
}

/** Count-up for [data-count] */
export function initCounters() {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const small = el.querySelector("small");
    const obj = { v: 0 };
    const render = () => {
      const txt = Math.round(obj.v).toLocaleString("en-US");
      if (small) { el.firstChild!.textContent = txt; } else el.textContent = txt;
    };
    render();
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: reduced ? 0 : 2.2, ease: "expo.out", onUpdate: render }),
    });
  });
}
