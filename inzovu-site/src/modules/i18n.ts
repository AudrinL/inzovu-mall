import { gsap, reduced } from "./scroll";

type Lang = "en" | "fr";
const FR: Record<string, string> = {
  "loader.alt": "alt. 1 567 m", "loader.skip": "passer",
  "nav.zones": "Espaces", "nav.figures": "Chiffres", "nav.build": "Chantier", "nav.plans": "Plans", "nav.hotel": "Hôtel", "nav.contact": "Contact", "nav.cta": "Réserver un espace",
  "hero.m1k": "Situation", "hero.m2k": "Statut", "hero.m2v": "En construction · Livraison T1 2027", "hero.m3k": "Promoteur",
  "hero.tag": "Bien plus qu'un centre commercial.", "hero.tag2": "Une destination sur la colline.", "hero.cta": "Découvrir les espaces",
  "hero.s1": "de surface locative brute", "hero.s2": "enseignes, dont le premier duty free du Rwanda", "hero.s3": "chambres · hôtel 5★ Odalys", "hero.scroll": "défiler",
  "man.eyebrow": "L'idée",
  "man.text": `Commerces <span class="tok"><img src="/assets/img/shops-1.webp" alt="" loading="lazy"></span>, restauration <span class="tok"><img src="/assets/img/rooftop-night.webp" alt="" loading="lazy"></span>, loisirs <span class="tok"><img src="/assets/img/aerial-2.webp" alt="" loading="lazy"></span> et un hôtel cinq étoiles <span class="tok"><img src="/assets/img/pool-sunset.webp" alt="" loading="lazy"></span> — un seul lieu de vie sur une colline de Kigali, à quelques pas du Convention Centre.`,
  "man.p1": "Inzovu signifie éléphant en kinyarwanda. Le bâtiment porte le nom sans tricher : un ruban blanc de terrasses qui s'enroule autour d'une place, planté du vert des collines, ouvert sur le dôme du Kigali Convention Centre.",
  "man.p2": "Développé par le Groupe Duval, exploité avec Odalys, certifié EDGE pour sa conception énergétique et hydrique. Travaux lancés au T3 2023. Ouverture au premier trimestre 2027.",
  "ap.rec": "aérien · approche", "ap.alt": "alt. 1 567 m · Kimihurura", "ap.c1k": "Le pays", "ap.c1": "mille collines", "ap.c2k": "Le quartier", "ap.c3k": "Le voisin", "ap.c3": "kigali convention centre", "ap.c4k": "Le repère",
  "zones.eyebrow": "Les espaces", "zones.title": "un ruban,<br>six mondes", "zones.hint": "cliquez un espace pour y entrer", "zones.scroll": "défilez pour avancer", "z.enter": "Entrer", "ap.cue": "continuez à défiler pour approcher", "build.drag": "glissez pour comparer", "af.hint": "survolez ou touchez un projet pour le relier à kigali", "zv.gallery": "défilez pour d'autres images",
  "z.shops.k": "commerces · duty free", "z.shops.t": "commerces", "z.shops.d": "40 enseignes. Détaxe et premier duty free en centre commercial du Rwanda.",
  "z.biz.k": "bureaux · conférences", "z.biz.t": "centre d'affaires", "z.biz.d": "Plateaux de bureaux et centre de conférences, voisins du KCC.",
  "z.dine.k": "restaurant · food court", "z.dine.t": "restauration", "z.dine.d": "Un restaurant, un food court, et une terrasse rooftop face aux collines.",
  "z.play.k": "enfants · sport · bowling · roue", "z.play.t": "loisirs", "z.play.d": "1 800 m² d'espace enfants, 700 m² de salle de sport, bowling — et la grande roue de Kigali.",
  "z.hotel.k": "5★ · odalys", "z.hotel.t": "inzovu hôtel", "z.hotel.u": "chambres", "z.hotel.d": "Cinq étoiles, une piscine sur le toit, et le dôme du Convention Centre en vue.",
  "z.acc.k": "parking · accès", "z.acc.t": "accès", "z.acc.u": "places", "z.acc.d": "400 places de parking, KN 5 Road, à 10 minutes de la route de l'aéroport.",
  "stats.eyebrow": "Les chiffres, à l'échelle", "stats.p": "Chaque bloc ci-dessous est dessiné proportionnellement à la surface qu'il représente. Survolez pour voir l'espace, cliquez pour y entrer ; le rectangle entier représente les 29 000 m² de surface locative brute.",
  "stats.n1": "Surfaces selon le promoteur · arrondies", "stats.n2": "+ 400 places de parking, hors échelle",
  "build.eyebrow": "Chantier", "build.title": "de la terre rouge<br>au ruban blanc", "build.p": "Les travaux ont débuté au troisième trimestre 2023. Glissez la ligne pour passer du terrain tel qu'il était au bâtiment tel qu'il sera.",
  "build.a": "T3 2023 · terrassements", "build.b": "T1 2027 · livraison",
  "build.t1": "Lancement des travaux. Excavation et fondations sur la parcelle KN 5 Road.", "build.t2": "La structure s'élève. Socle commercial, puis tours hôtel et bureaux.", "build.t3": "Façades, terrasses, aménagements. Les enseignes prennent leurs clés.", "build.t4": "mois avant l'ouverture. Le compteur est en direct.",
  "edge.eyebrow": "Conçu pour le climat", "edge.title": "les collines montent<br>le long du bâtiment", "edge.p": "Chaque terrasse du ruban est plantée. Le bâtiment est certifié EDGE pour sa conception énergétique, hydrique et matérielle — un engagement mesurable envers les objectifs climatiques du Rwanda, pas une couche de peinture verte.",
  "edge.l1": "Enveloppe et systèmes économes en énergie", "edge.l2": "Demande en eau réduite sur l'ensemble", "edge.l3": "Carbone incorporé réduit dans les matériaux", "edge.l4": "Terrasses plantées à chaque niveau des deux tours",
  "af.eyebrow": "Le Groupe Duval en Afrique", "af.title": "six projets,<br>cinq pays",
  "hotel.eyebrow": "Inzovu Hôtel by Odalys", "hotel.title": "restez jusqu'à<br><span class=\"t-serif\">l'heure des lumières</span>", "hotel.p": "Quatre-vingt-quinze chambres, cinq étoiles, une piscine sur le toit et une terrasse qui regarde droit vers le dôme du Convention Centre. Exploité par Odalys, la branche hôtelière du Groupe Duval, pour les voyageurs d'affaires qui préféreraient ne pas quitter le bâtiment.",
  "hotel.c1": "terrasse rooftop · crépuscule", "hotel.c2": "piscine rooftop · coucher de soleil", "hotel.c3": "chambre · odalys",
  "hotel.f1k": "Chambres", "hotel.f1": "Format résidence de tourisme d'affaires.", "hotel.f2k": "Standing", "hotel.f2": "Cinq étoiles, exploité par Odalys.", "hotel.f3k": "Surface", "hotel.f3": "Sur la tour et le toit.", "hotel.f4k": "Toit", "hotel.f4u": "piscine", "hotel.f4": "Et la meilleure place pour le dôme du KCC.",
  "ct.eyebrow": "Rejoindre l'aventure", "ct.title": "réservez votre place<br>sur le ruban",
  "ct.s1": "Bonjour, je suis", "ct.name": "votre nom", "ct.s2": "de", "ct.company": "votre société", "ct.s3": "Je m'intéresse à", "ct.interest": "un local commercial",
  "ct.o1": "un local commercial", "ct.o2": "des bureaux", "ct.o3": "un espace restauration", "ct.o4": "la plaquette", "ct.o5": "autre chose",
  "ct.s4": "Contactez-moi sur", "ct.email": "e-mail", "ct.s5": "ou au", "ct.phone": "téléphone",
  "ct.send": "Envoyer à l'équipe commerciale", "ct.note": "Un de nos experts vous répond sous deux jours ouvrés. Vos coordonnées vont à l'équipe commercialisation du Groupe Duval, et nulle part ailleurs.",
  "ct.done": "bien reçu. <span class=\"t-serif\">murakoze.</span>", "ct.done2": "Merci — nous revenons vers vous très vite.",
  "ft.p": "KN 5 Road, Kimihurura, Kigali, Rwanda. À côté du Kigali Convention Centre.", "ft.h1": "Espaces", "ft.h2": "Projet", "ft.duval": "Le Groupe Duval en Afrique", "ft.time": "Heure de Kigali", "ft.legal": "Mentions légales", "ft.privacy": "Confidentialité",
  "zv.close": "Retour au ruban", "zv.prev": "précédent", "zv.next": "suivant",
  "pl.eyebrow": "Plans", "pl.title": "niveau par niveau", "pl.note": "Plans indicatifs du promoteur. Les surfaces et positions des lots peuvent évoluer jusqu'à la livraison.", "pl.close": "Fermer",
};

let lang: Lang = (localStorage.getItem("inzovu:lang") as Lang) || (navigator.language.startsWith("fr") ? "fr" : "en");
const EN: Record<string, string> = {};
const listeners: (() => void)[] = [];

export const getLang = () => lang;
export const onLangChange = (fn: () => void) => listeners.push(fn);

export function initI18n() {
  // snapshot English from the DOM
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => { const k = el.dataset.i18n!; if (!(k in EN)) EN[k] = el.innerHTML; });
  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => { const k = el.dataset.i18nHtml!; if (!(k in EN)) EN[k] = el.innerHTML; });
  document.querySelectorAll<HTMLInputElement>("[data-i18n-ph]").forEach((el) => { const k = el.dataset.i18nPh!; if (!(k in EN)) EN[k] = el.placeholder; });
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang as Lang)));
  apply(false);
}

export function setLang(l: Lang) {
  if (l === lang) return;
  lang = l; localStorage.setItem("inzovu:lang", l);
  apply(true);
}

function apply(animate: boolean) {
  const dict = lang === "fr" ? FR : EN;
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
  const swap = () => {
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => { const v = dict[el.dataset.i18n!] ?? EN[el.dataset.i18n!]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => { const v = dict[el.dataset.i18nHtml!] ?? EN[el.dataset.i18nHtml!]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll<HTMLInputElement>("[data-i18n-ph]").forEach((el) => { const v = dict[el.dataset.i18nPh!] ?? EN[el.dataset.i18nPh!]; if (v != null) el.placeholder = v; });
    listeners.forEach((f) => f());
    document.dispatchEvent(new CustomEvent("inzovu:lang"));
  };
  if (!animate || reduced) return swap();
  const targets = document.querySelectorAll("[data-i18n], [data-i18n-html]");
  gsap.to(targets, { opacity: 0, y: -6, duration: 0.25, ease: "power2.in", onComplete: () => { swap(); gsap.to(targets, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.004 }); } });
}
