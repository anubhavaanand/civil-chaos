# Dark Alpine Glass Prototype

A static Astro 5 prototype of the Dream of The Holy Himalayas frontend, implementing the
[Dark Alpine Glass](../DESIGN.md) design system end to end: obsidian surfaces, glacier-cyan
accent, Space Grotesk / Geist type scale, double-bezel containers, View Transitions, and an
Aave-style SVG refraction glass on decorative layers.

It exists to validate the design language and booking funnel quickly, without touching the
production app in `apps/web`.

## Run

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # astro check (must pass)
npm run build     # static build to dist/
```

## Data flow

1. **Live Strapi** (`PUBLIC_STRAPI_URL`, defaults to `https://civil-chaos.onrender.com`) is
   fetched at build time.
2. If Strapi is unreachable (Render cold start / offline), the build falls back to the
   committed snapshot in `src/data/treks-snapshot.json`.
3. Rich editorial content (itineraries, FAQs, galleries) that the agency has not filled in
   Strapi yet is merged from `apps/cms/data/seed-data.json`. Live Strapi fields always win.

## Booking

Pure Phase 1 flow, client-side: honeypot + Indian mobile validation (`^[6-9]\d{9}$`) then a
WhatsApp deep-link with the pre-filled request. No server functions, no adapter - the whole
app is `output: 'static'`.

## Map

MapLibre GL v6 with the keyless Esri World Dark Gray Canvas raster basemap (attribution
rendered on-map). MapTiler can be swapped in later when a key is provisioned. The worker is
wired explicitly via `maplibregl.setWorkerUrl()` because Vite code-splitting breaks the
relative worker URL.

## Not in scope here

Astro Actions booking writes, the revalidation webhook, chatbot, and 3D peak viewer live in
`apps/web`. This prototype intentionally omits them.
