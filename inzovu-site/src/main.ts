import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/chrome.css";
import "./styles/sections.css";

import { initScroll, releaseScroll, ScrollTrigger, lenis } from "./modules/scroll";
import { initI18n } from "./modules/i18n";
import { runPreloader } from "./modules/preloader";
import { initCursor } from "./modules/cursor";
import { initNav, showNav } from "./modules/nav";
import { initHero } from "./modules/hero";
import { initReveals, initCounters } from "./modules/text";
import { initApproach } from "./modules/approach";
import { initZones } from "./modules/zones";
import { initStats } from "./modules/stats";
import { initBuild } from "./modules/build";
import { initAfrica } from "./modules/africa";
import { initManifesto, initParallax, initFooter, initPlans, initContact } from "./modules/misc";

/*
  Boot order matters:
  1. i18n snapshots the English DOM before anything splits text.
  2. Scroll engine starts stopped; every section registers its ScrollTriggers.
  3. Preloader plays; on hand-over the hero enters, nav drops in, scroll is released.
*/
initI18n();
initScroll();
initCursor();
initNav();
const enterHero = initHero();
initManifesto();
initApproach();
initZones();
initStats();
initBuild();
initAfrica();
initParallax();
initReveals();
initCounters();
initPlans();
initContact();
initFooter();

// fonts + hero images before the curtain lifts
const ready = Promise.all([
  document.fonts?.ready ?? Promise.resolve(),
  ...Array.from(document.querySelectorAll<HTMLImageElement>(".hero img")).map((im) => im.complete ? Promise.resolve() : new Promise<void>((r) => { im.onload = () => r(); im.onerror = () => r(); })),
]);

runPreloader(() => {
  ready.then(() => {
    lenis.scrollTo(0, { immediate: true });
    enterHero();
    showNav();
    releaseScroll();
    ScrollTrigger.refresh();
  });
});
