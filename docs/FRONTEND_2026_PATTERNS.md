# Frontier Frontend Patterns 2026 — Astro + Cloudflare Pages

Project: Dream of The Holy Himalayas (content-heavy travel/tourism site).
Stack: Astro 4.16, Tailwind v4 (`@tailwindcss/vite`), @astrojs/cloudflare, zod, Fontsource, MapLibre/Three chunked, booking via Astro actions.
Guardrail (AGENTS.md): no hard-coded trek content; Strapi is the CMS; booking writes only via Astro actions; no SSR on marketing pages; no payments/auth/GraphQL without approval.

## How to read this brief

Each pattern is rated:

- **P0 — Ship now.** Production-ready, broad browser support, low risk, high impact.
- **P1 — Next sprint.** Production-ready but requires integration work.
- **P2 — Watch / skip.** Experimental, narrow support, or low value for this site; revisit when support lands.

Priority order for this site: **Images > Data layer > CSS > JS minimalism > Typography > Observability > Bundle > AI.**

---

## 1. Modern CSS

| Pattern | Rating | Verdict for this site |
|---|---|---|
| Tailwind v4 `@theme` + CSS-first config | P0 | Already in `src/styles/global.css:14`. Keep. Derives `font-*`, `color-*`, `ease-*` utilities from CSS custom properties; no `tailwind.config.js` needed. |
| CSS nesting | P0 | Supported in all evergreen browsers. Use sparingly in component `<style>`; don't nest more than 2 levels deep. |
| Container queries (`@container`) | P0 | Production-ready. Ideal for `TrekCard`, `BatchTable`, `StatsStrip` — cards that reflow inside sidebars/modals regardless of viewport. |
| `:has()` selector | P0 | Full support across Chrome/Safari/Firefox. Use for stateful styling (e.g. "style card when it contains a full badge", "highlight nav when section is in view"). Avoid overuse; it can trigger style recalculation. |
| Anchor positioning (`anchor-name`/`position-anchor`) | P2 | Chrome-only / partial. Not production-ready for a public travel site. Skip; Popover API + absolute positioning covers dropdowns/tooltips. |
| Popover API (`popover`, `popovertarget`) | P0 | Production-ready (all major browsers). Replace custom dropdown/trap JS with `<div popover>` for batch pickers, filters, and mobile menus. Built-in light-dismiss and top layer. |
| View Transitions API (`document.startViewTransition`, `::view-transition-*`) | P0 (progressive enhancement) | Chrome + Safari 18+; Firefox supports cross-document VT in recent versions. Already styled in `global.css:180`. Use on trek-list → trek-detail navigation; fallback is a normal hard navigation, so safe to ship. |

**CSS action items (P0):**
- Migrate hand-written component styles into Tailwind v4 arbitrary variants / `@theme` tokens where they duplicate existing values.
- Add `@container` queries to `TrekCard` (stack image above text below a container width breakpoint, not a viewport breakpoint).
- Add `popover` to `GlassNav` mobile menu and booking batch picker; remove the inline `dialog` click-away JS where `popover` behavior suffices.
- Keep View Transition CSS; wire `document.startViewTransition` in a thin navigation wrapper on `/treks` links.

---

## 2. JavaScript minimalism

| Pattern | Rating | Verdict |
|---|---|---|
| Zero-JS by default | P0 | Astro default. HTML forms, `<details>/<summary>` (FAQ), `<dialog>` (booking modal — already used), native form validation. Ship zero JS on `/`, `/treks`, `/about`, `/contact`. |
| Progressive enhancement | P0 | Every interactive widget must work without JS, then enhance (e.g. map has a static image + coordinates list fallback). |
| Server-first interactions | P0 | Astro actions for mutations (booking, deposit order, webhook). Keep the booking flow server-rendered + `action:enhance` only where UX demands it (inline errors without redirect). |
| Astro actions vs client JS | P0 | Use actions for: booking submission, revalidate webhook, deposit order. Use client JS only for: map interactivity, charts, quiz state. Never duplicate validation in client JS and server — zod is the single source of truth (already in `actions/index.ts`). |
| Islands vs vanilla JS | P0 | Islands (`client:visible`, `client:idle`) for expensive widgets (MapLibreTrekMap, ElevationProfile, ThreeDPeakViewer). Vanilla inline `<script>` for tiny DOM behavior (already in BookingModal). Avoid React/Preact/Vue framework islands unless a widget needs complex reactive state. |

**JS action items:**
- P0: Audit `BookingModal` inline script — move batch-date copying and clear behavior into `action:enhance` or plain HTML where possible; keep the rest as vanilla JS (island not warranted).
- P1: Make `MapLibreTrekMap` lazy (`client:visible`) with a static hero-image fallback so map JS never blocks LCP.
- P1: Convert `FitnessQuiz`, `GearChecklist`, `AltitudeAcclimatizationLab` to small islands or static HTML + progressive enhancement.
- P2: Do not adopt a frontend framework (React/Vue) for marketing pages.

---

## 3. Image / video optimization

| Pattern | Rating | Verdict |
|---|---|---|
| AVIF / WebP | P0 | Production-ready via Astro Image + Cloudflare `imageService: 'cloudflare'` (already in `astro.config.mjs`). Serve AVIF with WebP fallback; quality `q_auto`-equivalent. |
| Responsive images (`srcset`/`sizes`) | P0 | Astro Image generates `srcset`/`sizes` automatically. Use `widths: [400, 800, 1200, 1600]` for hero/gallery; `sizes` tied to container breakpoints. |
| Lazy loading | P0 | `loading="lazy"` on all below-fold images (already in TrekCard). Eager only the LCP hero image with `fetchpriority="high"`. |
| LQIP / blur-up | P0 | Blur placeholder via `blur` transform or a tiny inline base64 + CSS filter; swap on `decode`. Prevents CLS. |
| Cloudflare Images | P0 | Already configured (`imageService: 'cloudflare'`). Use signed URLs + CF resize for uploads from Strapi; prefer Cloudflare Images over Cloudinary fetch for origin control. |
| `fetchpriority` | P0 | `fetchpriority="high"` on the hero LCP image; `low` on decorative/gallery images. |
| `decoding=async` | P0 | Add to below-fold `` tags to avoid decode work on the main thread. |

**Image action items (P0):**
- Ensure every `img` in `TrekCard`, `SectionRail`, hero sections uses Astro `<Image />` with `widths`, `sizes`, `loading="lazy"`, `decoding="async"`.
- `fetchpriority="high"` only on the single LCP hero per page; everything else `loading="lazy"`.
- Add blur-up placeholder (10–20 px wide base64) to hero images; remove once the sharp image decodes.
- Migrate Strapi/Cloudinary `f_auto,q_auto` transforms to Cloudflare Images resize URLs for consistency and origin control.

---

## 4. Typography

| Pattern | Rating | Verdict |
|---|---|---|
| Self-hosted Fontsource | P0 | Already used (Space Grotesk, Geist, Geist Mono). Keep; avoids Google Fonts request, gives full font-display control. |
| `font-display: swap` | P0 | Prevent FOIT; swap with fallback. Already implied by Fontsource CSS. Verify no `font-display: block` anywhere. |
| `font-size-adjust` (aspect-value) | P0 | Chrome 127+, Safari 18+, Firefox — production-ready in 2026. Set `font-size-adjust: 0.52` (or the font's aspect value) on `font-body` so fallback metrics match and CLS/shift is minimized when Geist fails to load. |
| Variable fonts | P0 | Fontsource variable-font packages exist; use a single file for all weights instead of multiple static weights. Reduces requests; `font-weight` becomes continuous. |
| FOIT/FOUT prevention | P0 | `font-display: swap` + `font-size-adjust` + `size-adjust` in `@font-face`; preload critical fonts via `<link rel=preload>`. |

**Typography action items (P0):**
- Add `font-size-adjust` to `@theme` body font and verify against Geist's aspect value (~0.52).
- Switch Geist / Space Grotesk imports to variable-font Fontsource variants if bundle size warrants; otherwise keep static weights (already fine).
- Preload the two most-used font files (`geist-sans/400`, `space-grotesk/700`) in `Layout.astro`.

---

## 5. Bundle / architecture

| Pattern | Rating | Verdict |
|---|---|---|
| Manual code splitting | P0 | Already done in `astro.config.mjs` (`manualChunks` for maplibre and three). Keep; extend only if a new heavy dep lands. |
| Tree-shaking | P0 | Vite/Rollup handles it. Prefer ESM imports and named imports; avoid default-importing whole libs. |
| Avoid heavy libraries | P0 | Three.js only on `ThreeDPeakViewer` (chunked, lazy). MapLibre only on trek-detail pages (chunked, lazy). Do not add charting/animation libraries; use CSS + Canvas native APIs. |
| Island granularity | P0 | Keep islands tiny and `client:visible`/`client:idle`. One island per widget, not per page. The booking modal is vanilla JS — correct choice. |

**Bundle action items:**
- P0: Keep `manualChunks` for maplibre/three; verify `npm run build` output shows separate `maplibre`/`three` chunks and they're not in the main entry.
- P1: Lazy-load `MapLibreTrekMap` via `client:visible`; `ThreeDPeakViewer` already behind a click (verify it's not in the initial JS).
- P2: No new heavy dependencies.

---

## 6. Data layer

| Pattern | Rating | Verdict |
|---|---|---|
| Typed fetch from CMS | P0 | Already in `src/lib/strapi.ts` (interfaces + `fetchStrapi`). Keep; add return-type generics and a typed wrapper per endpoint. |
| Zod schema validation | P0 | Already in `actions/index.ts` via `astro:schema`. Centralize shared schemas (e.g. `Trek`, `BookingInput`) in `src/lib/schemas.ts` and import in actions and client JS. |
| Optimistic UI | P2 | Low value here: booking redirects to WhatsApp (external) — nothing to optimistically render. Revisit only if Phase 2 adds on-site deposit confirmation with local state rollback. |
| Error boundaries | P1 | Astro has no client error-boundary primitive. Wrap island/map initialization in try/catch with fallback UI (static image + "map unavailable" message). Use `error:astro:actions` handling in `action:enhance`. |
| Loading states | P0 | CSS skeletons + `aria-busy`; no JS loading library. Reuse for batch table and trek detail while Strapi responds. |

**Data action items (P0):**
- Extract zod schemas from `actions/index.ts` into `src/lib/schemas.ts`; reuse in any future client validation.
- Add try/catch + fallback UI around MapLibre init and Strapi fetch in islands (degraded experience, never blank).
- Add a `s()` typed helper around `fetchStrapi` that throws on non-ok instead of returning `null` for critical pages (trek detail), letting Astro surface the 500/error page.

---

## 7. Observability

| Pattern | Rating | Verdict |
|---|---|---|
| RUM / Web Vitals | P0 | Production-ready. Cloudflare Web Analytics (zero-config, on Pages) or `web-vitals` beacon. Track LCP, CLS, INP, TTFB per route; alert on LCP > 2.5s on 4G (per FRONTEND_DESIGN_SPEC). |
| Error tracking (Sentry) | P0 | `@sentry/astro` or Cloudflare Sentry integration. Capture action failures and island JS errors; exclude known benign Strapi fallback paths (already fail-soft). |
| Log aggregation | P0 | Cloudflare Logpush / Workers logs. Centralize booking-action logs and Strapi fetch errors. |

**Observability action items (P0):**
- Enable Cloudflare Web Analytics on Pages (one toggle in dashboard).
- Add Sentry to the web workspace; instrument `actions/index.ts` and the Strapi fetch wrapper; mark CMS-fallback returns as non-errors.
- Define a Web Vitals budget: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-tier Android 4G; fail CI if build-time Lighthouse budget is exceeded (optional).

---

## 8. AI integration

| Pattern | Rating | Verdict |
|---|---|---|
| On-device AI | P2 | WebNN / Transformers.js in browser. Too heavy for a content site; skip unless a specific offline feature emerges. |
| Cloudflare Workers AI | P1 | Production-ready via Workers AI binding. Suitable for: trek-recommendation chat, itinerary summarization, multilingual FAQ. Already have `ChatBot` component — route it through Workers AI instead of a third-party API. |
| RAG with CMS content | P2 | Needs vector DB (Cloudflare Vectorize) + embedding pipeline + chunking of Strapi content. Overkill for ten treks; revisit when the catalog scales past ~100 pages or the chatbot needs grounded answers. |

**AI action items:**
- P1: Prototype `ChatBot` on Workers AI (`@cf/llama-...` or similar) with a system prompt grounded in site content; keep a canned fallback when AI is unavailable.
- P2: Do not build RAG yet. If needed later, embed Strapi trek/region content into Vectorize on the revalidate webhook.

---

## Prioritized rollout plan

**Week 1 (P0 — ship now):**
1. Images: Astro `<Image />` everywhere below fold + `fetchpriority="high"` on hero + `loading="lazy"`/`decoding="async"`.
2. CSS: `@container` on TrekCard; `popover` on GlassNav mobile menu/batch picker; `font-size-adjust` on body font; preload critical fonts.
3. Data: zod schemas extracted to `src/lib/schemas.ts`; try/catch fallbacks for map + Strapi in islands.
4. Observability: Cloudflare Web Analytics on; Sentry on actions + Strapi fetch.

**Week 2–3 (P1 — next sprint):**
1. `MapLibreTrekMap` → `client:visible` with static fallback; confirm ThreeDPeakViewer is lazy.
2. View Transition wiring on `/treks` → `/treks/[slug]` navigation.
3. Workers AI prototype for `ChatBot`.
4. Web Vitals budget + CI gate (optional).

**P2 — watch, do not ship yet:**
- Anchor positioning, on-device AI, RAG/Vectorize, optimistic UI for booking.

## Validation (per AGENTS.md)

Before declaring done:
- `npm run check --workspace=apps/web` — 0 errors
- `npm run build --workspace=apps/web` — completes
- Build from the commit you intend to ship, not a dirty tree
- If booking flow changed: run Playwright suite in `apps/web/tests/`
