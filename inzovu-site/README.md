# Inzovu Mall — site rebuild

A single-page, bilingual (EN/FR) experience for Inzovu Mall, Kigali. Built from the real project assets in
`../site-capture` — nothing here is stock.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/ (static, deploy anywhere: Vercel, Netlify, S3, nginx)
```

Regenerate the derived assets (dusk grade, hero cut-outs, film frames, clips) from the captured originals:

```bash
python tools/assets.py            # everything
python tools/assets.py images     # or one stage: images | fonts | frames | video
```

## What's in the experience

| Beat | What happens | Where |
|---|---|---|
| Preloader | Satellite descent from Rwanda into Kigali (cut from the developer's film), live coordinates, logo mark draws itself, sand curtain hands over. Plays once per session, skippable. | `modules/preloader.ts` |
| Hero | The wordmark sits *behind* the towers (sky / type / building are three layers — the sky was flood-filled out of the render). Pointer parallax by depth, scroll pushes the building forward. Frosted stat pills, notch scroll cue. | `modules/hero.ts`, `tools/assets.py → sky_cutout_flood` |
| Manifesto | Words illuminate as the sentence passes mid-screen; inline render "tokens" pop in and expand on hover. | `modules/misc.ts → initManifesto` |
| Aerial approach | 192 WebP frames of the fly-through painted to a canvas, scrubbed by scroll, with a HUD, timecode and four caption beats. Coarse-then-fine loading so the first scrub is never blank. Mobile / reduced-motion gets a looping video instead. | `modules/approach.ts` |
| The ribbon | Six zone cards travel horizontally; a green line — the building's own curve — draws itself weaving over and under them. | `modules/zones.ts` |
| Zone overlay | Opens as a circle from the click point. Amáli-style spec bar, prev/next, auto-cycling gallery, ←/→/↑/↓/Esc, hash-routed (`#space=hotel`). | `modules/zones.ts`, `data/zones.ts` |
| Figures, to scale | A squarified treemap: every block is proportional to its floor area. Hover reveals the space; click opens its overlay. | `modules/stats.ts` |
| Earth → landmark | Before/after wipe between the construction photo and the aerial render. Scroll sweeps it until you grab it. Live "months to opening" counter. | `modules/build.ts` |
| EDGE | Planted-terrace render, spinning certification badge. | `index.html` |
| Groupe Duval in Africa | Dotted continent (hand-plotted coastline), pins for the six projects, dashed link to Kigali on hover. Dots bloom out from Kigali. | `modules/africa.ts` |
| Hotel | The whole page shifts to dusk (theme tokens flip), string lights fade in, rooftop pool loop. | `modules/scroll.ts` (theme trigger), `modules/misc.ts` |
| Contact | A conversational sentence instead of a form. Inline validation, dropdown slot, honeypot. Success state: *received. murakoze.* | `modules/misc.ts → initContact` |
| Footer | Wordmark marquee, live Kigali clock, partner marks. | `modules/misc.ts → initFooter` |
| Plans | Full-screen floor-plan viewer (the plans were sitting unused in the old media library). | `modules/misc.ts → initPlans` |
| Chrome | Custom cursor with contextual labels, magnetic pills, difference-blend nav that inverts over any background, left-edge progress ribbon, film grain. | `modules/cursor.ts`, `styles/chrome.css` |

FR/EN toggles in place with a crossfade (`modules/i18n.ts`); choice persists.

## Design system

Tokens in `src/styles/tokens.css`. Ground is warm sand, ink is near-black, **gold is the only accent**; green is
reserved for the ribbon and the EDGE story (cyan from the old theme was dropped). Display face is Archivo
(variable width, lowercase), body is General Sans (the brand's own), Instrument Serif italic for the editorial
moments, JetBrains Mono for metadata.

## To wire up before launch

1. **Form endpoint** — `initContact` in `modules/misc.ts` logs the payload; POST it to the leasing inbox (Resend, or the existing Gravity Forms endpoint). Payload: `{ name, company, interest, email, phone }`.
2. **Client data to confirm** — business-centre area (660 vs 6,000 m² on the old site; 6,000 used here), the brand colour (orange signage in renders vs green/gold web palette), tenant list and logos for the footer, exact opening date for the live counter (assumes 31 Mar 2027).
3. **Rights** — Groupe Duval owns the renders, film and plans. Fine for work done for them; get written sign-off before this goes public.
4. **Legal / privacy pages** — linked in the footer, not yet written.
5. **Analytics** — none included, by design.

## Performance notes

- JS ≈ 65 KB gzipped (GSAP + Lenis + app). No framework.
- Frame sequence is 9 MB and only starts loading when the section is 1.5 screens away; mobile never loads it.
- `prefers-reduced-motion` is honoured: no preloader, no scrub, no parallax, instant reveals.
- Pinned sections use `refreshPriority` so triggers created earlier still compute against the pin spacer.
