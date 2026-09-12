# FRONTEND_DESIGN_SPEC — pages, design system, SEO

## Routes
| route | render | content |
|---|---|---|
| `/` | static | hero + TrekMap + featured treks + upcoming departures strip + trust bar (Google 5.0★ embed) + about + contact CTA |
| `/treks` | static | filter bar (region/difficulty/duration/price) + trek cards |
| `/treks/[slug]` | static (ISR) | detail per DATABASE_SCHEMA |
| `/regions/[slug]` | static | region intro + its treks |
| `/about`, `/contact` | static | agency story, phone/WhatsApp/email, Google Business embed, address |
| `/_actions/booking` | server fn | see BOOKING_FLOW |
| `/api/revalidate` | server fn | webhook |
| 404 / 500 | static | friendly, WhatsApp CTA |

## Design language: "Alpine Glass" (aave.com reference)
Tailwind v4 theme tokens (`@theme`):
```
--color-glass: rgb(255 255 255 / 0.10);  --color-glass-border: rgb(255 255 255 / 0.20);
--color-ink: #e8eef2;  --color-ink-dim: #a9b8c0;  --color-brand: #14b8a6 (teal)  --color-brand-deep: #0f766e;
--font-display: "Space Grotesk", sans;  --font-body: "Inter", sans;
```
Glass recipe: `backdrop-blur-md backdrop-saturate-150 bg-white/10 border border-white/20 rounded-2xl shadow-lg`.
**Contrast trap (mandatory)**: over bright snow/sky photos, white glass text fails WCAG. EVERY glass panel over imagery must sit on a fixed dark scrim layer `bg-black/30` between photo and glass. Audit contrast against the busiest area of real hero photos (not solid mockups) — body text ≥ 4.5:1.
**Fallback**: `@supports not (backdrop-filter: blur(1px))` → replace glass with `bg-slate-900/85` solid panel (older Safari / low-end Android GPUs).
Global look: full-bleed Himalayan photography, glass nav (sticky, blurs on scroll), generous whitespace, large type, teal accent, subtle scroll-reveal (CSS-only; no heavy animation libs).

## Components
GlassNav · TrekCard (image, difficulty badge, days, altitude, from-price) · BatchTable (date, seats left, price, "Request booking") · ItineraryTimeline · InclusionList · FAQAccordion (details/summary, no JS) · GalleryLightbox · WhatsAppFab (floating button, mobile) · MapPopupCard · ReviewBadge.

## Imagery
Cloudinary fetch via Strapi media; use `f_auto,q_auto,w_800/1600` transforms; LQIP blur-up via Astro image or Cloudinary `e_blur:1000` placeholder; lazy-load below fold; every image has alt text from CMS.

## SEO (per page)
- URLs/keywords exactly: `/treks/kuari-pass-trek` targeting "Kuari Pass trek 2027", "Kuari Pass trek cost", "Kuari Pass itinerary", "Kuari Pass best time" — in H1, title, meta, first 100 words.
- Schema on trek page: `TouristTrip` (name, description, provider, itinerary as ItemList, touristType) + nested `Product` with `Offer` (priceINR, availability from batch status, priceCurrency INR).
- Homepage: `Organization` + `LocalBusiness` schema (name, aggregateRating 5.0, address Mautar, Uttarakhand).
- sitemap.xml generated at build from trek/region slugs; robots.txt; canonical URLs; OG images = trek hero (1200×630).
- `[DECISION-3]` brand/domain confirmed before launch.

## Accessibility & quality bar
Semantic HTML landmarks, keyboard-navigable map fallback list, alt text required in CMS, focus rings visible, color not the only difficulty signal (icon + text). Targets: LCP < 2.5s on 4G mid-tier Android (lazy map helps), CLS < 0.1, WCAG 2.1 AA.
