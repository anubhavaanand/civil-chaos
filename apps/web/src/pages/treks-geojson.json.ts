import geojson from '../data/treks-geojson.json';

export async function GET() {
  return new Response(JSON.stringify(geojson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour; regenerated on each build via scripts/generate-geojson.mjs
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
