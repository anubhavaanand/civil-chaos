# PRD — Dream of The Holy Himalayas Website

## Problem
The agency ("Dream of The Holy Himalayas", Mautar, Uttarakhand — 5.0★, 40 Google reviews) has no website. Customers discover treks via WhatsApp/word-of-mouth; catalogs, prices and itineraries live in chats. A competing site (trekupindia.com) loads broken chunk errors. We ship a fast, trustworthy, bookable catalog site first.

## Goal (Phase 1 — this build)
A trekker anywhere can: land on the site → see an interactive Himalayan map → pick a trek → read gallery + itinerary + cost + how-to-reach → submit a booking request → agency gets it on WhatsApp. The agency can edit ALL content (treks, prices, dates, photos) in Strapi without a developer.

## Non-goals (Phase 1)
- Online payment (Phase 2: Razorpay)
- User accounts / login
- Marketplace of other agencies
- All-India trek directory (map is scoped to UK + HP)
- Reviews engine (Phase 2 — we already have Google reviews to embed)

## Users
1. **Trekker (customer)** — browses on mobile (60%+), wants price, dates, difficulty, photos, "how do I reach", and a fast way to say "I'm in".
2. **Agency admin (non-technical)** — updates treks/batches/photos in Strapi admin; gets booking notifications on WhatsApp.

## Phase 1 features (MoSCoW)
**Must**
- Homepage with interactive MapLibre map (UK/HP trek markers, clustered, click → trek card → detail)
- Trek listing page (filter: region, difficulty, duration, price)
- Trek detail page: hero gallery, itinerary day-by-day, inclusions/exclusions, cost per batch, how-to-reach (Google Maps embed + commute info), FAQ, booking CTA
- Booking request flow (Astro Action: validation, honeypot, rate limit → Strapi entry → WhatsApp deep-link + email to agency)
- Strapi CMS: regions, treks, batches (dates/seats/price), packages, itinerary days, gallery, booking-requests
- SEO: per-trek pages targeting "[Trek] trek 2027 / cost / itinerary / best time" + TouristTrip + Offer schema
- Contact page (phone, WhatsApp, Google Maps business embed, address)

**Should**
- Season/best-time badges, difficulty meter, altitude profile callout
- "Upcoming departures" strip on homepage (from batches)
- Google Reviews embed on homepage (existing 5.0★)

**Could (only if time allows)**
- Hindi/English toggle — structure ready, content Phase 2 `[DECISION-1]`
- Group-discount pricing display

## Phase 2 (documented, not built)
Razorpay payments + payment status on booking · reviews engine · pan-India directory map · Hindi content · blog/SEO content hub · offline trek maps PDF.

## Success metrics
Prototype success = agency can edit a trek price/date themselves + receives a test booking on WhatsApp end-to-end. Launch metrics: booking requests/week, page speed (LCP < 2.5s mobile), indexed trek pages.

## References (studied)
trekupindia.com (feature set + what breaks: Next.js chunk-load failures → we go static), IndiaHikes (trust patterns: transparent cost, how-to-reach, batch calendar), MakeMyTrip (booking flow), aave.com/design (glassmorphism UI reference).

## Open decisions (grep `DECISION` repo-wide)
- DECISION-1: Hindi toggle scope · DECISION-2: show per-batch seats remaining or not · DECISION-3: domain + brand assets (logo/photos) source
