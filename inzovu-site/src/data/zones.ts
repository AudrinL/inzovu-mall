export type Zone = {
  id: string;
  idx: string;
  kicker: { en: string; fr: string };
  title: { en: string; fr: string };
  lead: { en: string; fr: string };
  specs: { v: string; k: { en: string; fr: string } }[];
  media: { type: "img" | "video"; src: string }[];
};

export const ZONES: Zone[] = [
  {
    id: "shops", idx: "01",
    kicker: { en: "Retail · duty free · VAT refund", fr: "Commerces · duty free · détaxe" },
    title: { en: "shops", fr: "commerces" },
    lead: {
      en: "9,000 m² of retail, 6,600 m² of it let to around forty brands. International visitors get VAT refunds — and, for the first time in Rwanda, duty-free purchases inside a mall.",
      fr: "9 000 m² de commerces, dont 6 600 m² loués à une quarantaine d'enseignes. Les visiteurs étrangers bénéficient de la détaxe — et, pour la première fois au Rwanda, d'achats duty free au sein d'un centre commercial.",
    },
    specs: [
      { v: "9,000 m²", k: { en: "retail", fr: "commerces" } },
      { v: "40", k: { en: "brands", fr: "enseignes" } },
      { v: "6,600 m²", k: { en: "let to retailers", fr: "loués" } },
      { v: "1st", k: { en: "in-mall duty free in Rwanda", fr: "duty free en centre au Rwanda" } },
    ],
    media: [
      { type: "img", src: "/assets/img/shops-1.webp" },
      { type: "img", src: "/assets/img/plaza-6.webp" },
      { type: "img", src: "/assets/img/plaza-7.webp" },
      { type: "img", src: "/assets/img/shops-2.webp" },
    ],
  },
  {
    id: "business", idx: "02",
    kicker: { en: "Offices · conference venue", fr: "Bureaux · centre de conférences" },
    title: { en: "business centre", fr: "centre d'affaires" },
    lead: {
      en: "Office floors in the second tower and a conference venue on the podium — a few hundred metres from the Kigali Convention Centre, in the district where the city does business.",
      fr: "Des plateaux de bureaux dans la seconde tour et un centre de conférences sur le socle — à quelques centaines de mètres du Kigali Convention Centre, dans le quartier où la ville fait des affaires.",
    },
    specs: [
      { v: "≈6,000 m²", k: { en: "offices & conferences", fr: "bureaux & conférences" } },
      { v: "KCC", k: { en: "next door", fr: "voisin" } },
      { v: "Kimihurura", k: { en: "business district", fr: "quartier d'affaires" } },
    ],
    media: [
      { type: "img", src: "/assets/img/business-2.webp" },
      { type: "img", src: "/assets/img/business-1.webp" },
      { type: "img", src: "/assets/img/business-3.webp" },
      { type: "img", src: "/assets/img/plaza-3.webp" },
    ],
  },
  {
    id: "dining", idx: "03",
    kicker: { en: "Restaurant · food court · rooftop", fr: "Restaurant · food court · rooftop" },
    title: { en: "dining", fr: "restauration" },
    lead: {
      en: "A restaurant, a food court and a rooftop terrace strung with lights, looking over the hills. 1,635 m² for the part of the day that isn't shopping.",
      fr: "Un restaurant, un food court et une terrasse rooftop sous les guirlandes, face aux collines. 1 635 m² pour la partie de la journée qui n'est pas du shopping.",
    },
    specs: [
      { v: "1,635 m²", k: { en: "dining", fr: "restauration" } },
      { v: "1", k: { en: "restaurant", fr: "restaurant" } },
      { v: "1", k: { en: "food court", fr: "food court" } },
      { v: "rooftop", k: { en: "terrace", fr: "terrasse" } },
    ],
    media: [
      { type: "img", src: "/assets/img/rooftop-night.webp" },
      { type: "img", src: "/assets/img/dining-1.webp" },
      { type: "img", src: "/assets/img/terrace-hills.webp" },
      { type: "img", src: "/assets/img/dining-3.webp" },
    ],
  },
  {
    id: "leisure", idx: "04",
    kicker: { en: "Kids · gym · bowling · Ferris wheel", fr: "Enfants · salle de sport · bowling · grande roue" },
    title: { en: "leisure", fr: "loisirs" },
    lead: {
      en: "4,000 m² of leisure: an 1,800 m² kids area, a 700 m² gym, bowling — and, rising over the plaza, the Kigali Ferris wheel.",
      fr: "4 000 m² de loisirs : un espace enfants de 1 800 m², une salle de sport de 700 m², un bowling — et, au-dessus de la place, la grande roue de Kigali.",
    },
    specs: [
      { v: "4,000 m²", k: { en: "leisure", fr: "loisirs" } },
      { v: "1,800 m²", k: { en: "kids area", fr: "espace enfants" } },
      { v: "700 m²", k: { en: "gym", fr: "salle de sport" } },
      { v: "1", k: { en: "Ferris wheel", fr: "grande roue" } },
    ],
    media: [
      { type: "video", src: "/assets/video/ferris.mp4" },
      { type: "img", src: "/assets/img/aerial-2.webp" },
      { type: "img", src: "/assets/img/plaza.webp" },
      { type: "video", src: "/assets/video/plaza.mp4" },
    ],
  },
  {
    id: "hotel", idx: "05",
    kicker: { en: "Inzovu Hôtel by Odalys · 5★", fr: "Inzovu Hôtel by Odalys · 5★" },
    title: { en: "inzovu hôtel", fr: "inzovu hôtel" },
    lead: {
      en: "95 rooms, five stars, a rooftop pool and the Convention Centre dome for a view. Operated by Odalys, Groupe Duval's hospitality arm, in a business-tourism residence format.",
      fr: "95 chambres, cinq étoiles, une piscine sur le toit et le dôme du Convention Centre en ligne de mire. Exploité par Odalys, la filiale hôtelière du Groupe Duval, en résidence de tourisme d'affaires.",
    },
    specs: [
      { v: "95", k: { en: "rooms", fr: "chambres" } },
      { v: "5★", k: { en: "standard", fr: "standing" } },
      { v: "5,000 m²", k: { en: "floor area", fr: "surface" } },
      { v: "rooftop", k: { en: "pool", fr: "piscine" } },
    ],
    media: [
      { type: "img", src: "/assets/img/pool-sunset.webp" },
      { type: "video", src: "/assets/video/pool.mp4" },
      { type: "img", src: "/assets/img/hotel-room.webp" },
      { type: "img", src: "/assets/img/terrace-dome.webp" },
    ],
  },
  {
    id: "access", idx: "06",
    kicker: { en: "Parking · access · location", fr: "Parking · accès · situation" },
    title: { en: "access", fr: "accès" },
    lead: {
      en: "400 parking spaces under and around the podium. On KN 5 Road in Kimihurura, beside the Kigali Convention Centre, twenty minutes from the airport.",
      fr: "400 places de parking sous et autour du socle. Sur la KN 5 Road à Kimihurura, à côté du Kigali Convention Centre, à vingt minutes de l'aéroport.",
    },
    specs: [
      { v: "400", k: { en: "parking spaces", fr: "places" } },
      { v: "KN 5", k: { en: "road", fr: "road" } },
      { v: "20 min", k: { en: "from the airport", fr: "de l'aéroport" } },
      { v: "1°57′S", k: { en: "30°05′E", fr: "30°05′E" } },
    ],
    media: [
      { type: "img", src: "/assets/img/aerial.webp" },
      { type: "img", src: "/assets/img/plaza-2.webp" },
      { type: "img", src: "/assets/img/access-map.webp" },
    ],
  },
];
