import { getTreks } from '../lib/strapi';

export async function GET() {
  const treks = await getTreks();
  
  const geojson = {
    type: 'FeatureCollection',
    features: treks.map((trek) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: trek.coordinates
      },
      properties: {
        name: trek.name,
        slug: trek.slug,
        difficulty: trek.difficulty,
        maxAltitudeM: trek.maxAltitudeM,
        region: trek.region
      }
    }))
  };

  return new Response(JSON.stringify(geojson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
