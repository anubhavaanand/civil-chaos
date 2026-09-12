# MAP_COMPONENT_SPEC — homepage interactive trek map

## Goal
The hero moment: a Himalayan map of the agency's treks. Clustered markers → click marker/cluster → popup card (photo, name, difficulty, from-price) → CTA to trek page. Region chips (Garhwal / Kumaon / Himachal / All) fly the map to region bounds and filter markers.

## Library & tiles
MapLibre GL JS (latest v5). Style: MapTiler "outdoor"/"topo" (free key, 100k loads/mo). NO Google Maps key, NO self-hosted tiles yet. Attribution visible (OSM + MapTiler) — legally required.

## Data
At build time, generate `src/data/treks-geojson.json` from Strapi:
```
{ type:"FeatureCollection", features:[{ type:"Feature", geometry:{type:"Point",coordinates:[lng,lat]},
  properties:{ slug, name, difficulty, durationDays, fromPrice, regionSlug, photoUrl } }] }
```
Region boundaries (click-zones + outlines): download India admin level-1 GeoJSON from **datameet/maps** or **GADM**, keep ONLY Uttarakhand + Himachal Pradesh features, commit trimmed file `src/data/region-boundaries.json` (~< 100KB). Do NOT ship all-India boundaries.

## Component behavior (`<TrekMap client:visible />` — lazy, see below)
- Source `treks` with `cluster: true, clusterMaxZoom: 7, clusterRadius: 42`
- Layers: `clusters` (circle, sized by point_count: 20/30/40px), `cluster-count` (text), `unclustered-point` (teal mountain-marker via MapLibre marker or styled circle + icon font)
- Cluster click → zoom to `clusterExpansionZoom`. Point click → popup: 16:9 thumb, name, difficulty badge (Easy=green/Moderate=amber/Difficult=red), "N days · from ₹X", button "View trek →" → `/treks/{slug}`
- Region chips → `map.fitBounds(region.mapBounds)` + filter source by regionSlug
- Default view: fit bounds to both states; `maxZoom: 10`; NO pitch, NO 3D terrain, NO custom heavy sprites (mobile GPU)

## Performance (non-negotiable)
- Lazy-load the map: Astro `client:visible` directive; below the fold it must not block LCP. Place a static hero + skeleton under it.
- Bundle: import maplibre-gl CSS/JS only in this component; target < 180KB gz for map chunk.
- Mobile: touch pitch disabled (`touchPitch: false`), cooperative gestures (`cooperativeGestures: true`) so page scroll isn't trapped; full-width fallback below 640px = horizontal scroll chip-list + compact list cards instead of popups.
- Reduce motion: if `prefers-reduced-motion`, skip fly-to animations.

## No-JS / SEO fallback
A server-rendered `<noscript>` + always-visible "Browse all treks" list section below the map (styled list, same data). The map is an enhancement, never the only path to treks.

## States
Loading (skeleton shimmer) · Error (tile/key failure) → auto-fallback to list view with a small inline note · Empty (no treks in filter) → "New treks coming soon" card.

## Out of scope
Route/trail polylines (Phase 2+, needs GPX pipeline), altitude 3D, offline mode.
