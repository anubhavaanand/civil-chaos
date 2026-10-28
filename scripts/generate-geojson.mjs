#!/usr/bin/env node
/**
 * scripts/generate-geojson.mjs
 * Build-time script: generate src/data/treks-geojson.json from Strapi (or
 * committed snapshot as fallback) so the map component can read a static
 * file instead of hitting an API route at runtime.
 *
 * Run: node scripts/generate-geojson.mjs
 * Or add to package.json build step: "generate:geojson": "node scripts/generate-geojson.mjs"
 */

import { getTreks } from '../apps/web/src/lib/treks.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const OUT_PATH = join(process.cwd(), 'apps/web/src/data/treks-geojson.json');

async function main() {
  const treks = await getTreks();

  const geojson = {
    type: 'FeatureCollection',
    features: treks.map((trek) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: trek.coordinates,
      },
      properties: {
        name: trek.name,
        slug: trek.slug,
        difficulty: trek.difficulty,
        maxAltitudeM: trek.maxAltitudeM,
        region: trek.region,
        regionSlug: trek.regionSlug,
        fromPrice: trek.fromPrice,
        heroImage: trek.heroImage,
      },
    })),
  };

  writeFileSync(OUT_PATH, JSON.stringify(geojson, null, 2));
  console.log(`Generated ${OUT_PATH} with ${geojson.features.length} trek features`);
}

main().catch((err) => {
  console.error('GeoJSON generation failed:', err);
  process.exit(1);
});
