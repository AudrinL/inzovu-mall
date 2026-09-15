# Inzovu Mall — site capture

Source: https://www.inzovumall.com/ — captured 2026-09-06.
Platform: WordPress 7.1 + Elementor 4.2.4, "Vault" theme (UiCore), WPML (FR default / EN).
Crawl scope followed robots.txt (only `/wp-admin/` is disallowed; everything captured is public).

## Folders

| Folder | Contents |
|---|---|
| `content/` | Text of all 21 pages as Markdown (12 FR + 9 EN), each with the list of images used on it |
| `raw-html/` | Original HTML of every page, as served |
| `brand/logos/` | Inzovu Mall logo files |
| `brand/partner-logos/` | Partner/tenant logos (BUT, Intermarché, Odalys) |
| `brand/uicore-global.css` | Live theme CSS — source of the colour/typography tokens below |
| `images/` | 76 real project images (renders, site photos, headers, icons) |
| `images/_theme-demo-assets/` | 21 stock "Vault"/"Business" theme demo files + 98 placeholders — **not** Inzovu brand assets |
| `images/_older-versions/`, `fonts/_older-versions/` | Superseded re-uploads kept for reference (prefixed with their upload year-month) |
| `fonts/` | General Sans (Regular / Medium / Semibold), TTF |
| `video/` | 2 project films (23 MB total) |
| `media-index.csv` | Full WordPress media library index: id, title, filename, mime, dimensions, alt text, URL |
| `pages-fr.txt`, `pages-en.txt`, `media-originals.txt` | Source URL lists |

## Brand tokens (from the live theme CSS)

| Role | Value |
|---|---|
| Primary | `#90C583` (green) |
| Secondary | `#A78E5F` (gold) |
| Accent | `#45BDCC` (cyan) |
| Headline text | `#393838` |
| Body text | `rgba(0,0,0,0.6)` |
| Light / white / dark | `#F2F2F2` / `#FFFFFF` / `#000000` |
| Page-title gradient | `#FFEEDE` → `#FFFFFF` |
| Page transition | `#FFBC7D` |
| Typeface | General Sans (Regular / Medium / Semibold) — all headings and body |
| Header logo height | 45px desktop, 50px mobile |

Note: `Logo-Inzovu.svg` is drawn in white fill (`#fff`) — it is the reversed/on-dark version.

## The project, in brief

Inzovu Mall is a mixed-use shopping and leisure development in **Kimihurura, Kigali, Rwanda**, next
to the Kigali Convention Centre. Developer: **Groupe Duval** (SAS, 45 avenue Georges Mandel, 75116
Paris; contact@groupeduval.com; +33 1 46 99 47 10). Hotel operator: **Odalys**, a Duval subsidiary.
EDGE-certified green building. Delivery: **Q1 2027** (works started Q3 2023).

### Key figures
- 29,000 m² gross leasable area (project footprint stated as 30,000+ m²)
- 9,000 m² shops (6,600 m² let to retailers, ~40 brands) — with VAT refund and in-mall duty free, a first in Rwanda
- 6,000 m² business centre / conference venue (site counter says 660 m²; page copy says close to 6,000 m² — figures conflict)
- 5,000 m² tourism residence — Inzovu Hôtel by Odalys, 95 rooms, 5-star, rooftop pool
- 4,000 m² leisure — incl. 1,800 m² kids area, ~700 m² gym, bowling
- 1,635 m² dining — restaurant + food court
- 400 parking spaces

### Site structure (FR / EN)
Home · Projet/Project · Commerces/Shops · Centre d'affaires/Business center · Restauration/Dining ·
Loisirs/Leisure · Résidence de tourisme/Tourism residence · Plans · Accès/Access · Mentions légales.
Two Gravity Forms: brochure request (gated — no public PDF exists) and contact/space reservation.

### Groupe Duval's other African projects (listed on the Projet page)
| Project | Location | Type | Area | Start | Delivery |
|---|---|---|---|---|---|
| Tour Sama | Abidjan, Côte d'Ivoire | Offices | 6,000 m² | – | Dec 2021 |
| Village Notre Père | Abidjan, Côte d'Ivoire | Offices, hotel, shops | 23,000 m² | Q3 2024 | Q1 2028 |
| Riviera Park | Abidjan, Côte d'Ivoire | Shopping & leisure | 40,000 m² | Q3 2024 | Q2 2028 |
| Sadi Mall | Douala, Cameroon | Offices, shops | 12,000 m² | Q2 2023 | Q2 2027 |
| Shop'In Lomé | Lomé, Togo | Shopping centre, offices | 13,000 m² | Q3 2024 | Q2 2028 |
| Inzovu Mall | Kigali, Rwanda | Hotel & commercial complex | 29,000 m² | Q3 2023 | Q1 2027 |

## Rights

The site's *mentions légales* (§5) state that Groupe Duval owns the IP in all site elements — text,
images, graphics, logos, icons — and that reproduction or republication requires prior written
authorisation. Fine for internal reference, analysis, or work done for the owner; get permission
before republishing any of it publicly.
