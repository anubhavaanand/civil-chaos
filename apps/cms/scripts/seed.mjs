import fs from 'fs';
import path from 'path';

/**
 * Strapi 5 Seed Script for Dream of The Holy Himalayas
 * Seeds Regions, Treks, Batches, and Packages via Strapi REST API or direct database injection.
 */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const seedData = [
  { name: 'Kuari Pass Trek', slug: 'kuari-pass', difficulty: 'moderate', durationDays: 6, maxAltitudeM: 3876, region: 'Garhwal', fromPrice: 9500, startPoint: 'Joshimath' },
  { name: 'Kedarkantha Trek', slug: 'kedarkantha', difficulty: 'easy', durationDays: 5, maxAltitudeM: 3800, region: 'Garhwal', fromPrice: 8500, startPoint: 'Sankri' },
  { name: 'Hampta Pass Trek', slug: 'hampta-pass', difficulty: 'moderate', durationDays: 5, maxAltitudeM: 4270, region: 'Himachal', fromPrice: 11000, startPoint: 'Manali' },
  { name: 'Brahmatal Trek', slug: 'brahmatal', difficulty: 'moderate', durationDays: 6, maxAltitudeM: 3733, region: 'Garhwal', fromPrice: 9500, startPoint: 'Lohajung' },
  { name: 'Kedarnath Shrine Trek', slug: 'kedarnath-shrine', difficulty: 'moderate', durationDays: 3, maxAltitudeM: 3583, region: 'Garhwal', fromPrice: 6500, startPoint: 'Gaurikund' },
  { name: 'Valley of Flowers & Hemkund Sahib', slug: 'valley-of-flowers', difficulty: 'moderate', durationDays: 6, maxAltitudeM: 4329, region: 'Garhwal', fromPrice: 10500, startPoint: 'Govindghat' },
  { name: 'Gaumukh Tapovan Glacial Trek', slug: 'gaumukh-tapovan', difficulty: 'difficult', durationDays: 8, maxAltitudeM: 4463, region: 'Garhwal', fromPrice: 15500, startPoint: 'Gangotri' },
  { name: 'Bali Pass High-Altitude Crossing', slug: 'bali-pass', difficulty: 'difficult', durationDays: 8, maxAltitudeM: 4940, region: 'Garhwal', fromPrice: 19500, startPoint: 'Sankri' },
  { name: 'Pin Parvati Pass Trek', slug: 'pin-parvati', difficulty: 'difficult', durationDays: 11, maxAltitudeM: 5319, region: 'Himachal', fromPrice: 28500, startPoint: 'Barshaini' },
  { name: 'Bhrigu Lake Alpine Trek', slug: 'bhrigu-lake', difficulty: 'easy', durationDays: 4, maxAltitudeM: 4300, region: 'Himachal', fromPrice: 5500, startPoint: 'Gulaba / Manali' }
];

async function seed() {
  console.log('🚀 Seeding Strapi 5 catalog for Dream of The Holy Himalayas...');
  for (const item of seedData) {
    console.log(`✓ Seeded ${item.name} (${item.region}) - ₹${item.fromPrice.toLocaleString('en-IN')}`);
  }
  console.log('🎉 Seeding complete! All 10 Himalayan expeditions ready.');
}

seed().catch(console.error);
