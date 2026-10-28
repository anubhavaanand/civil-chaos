// apps/web/src/content/config.ts
// Astro Content Collections for typed editorial content.
// Treks, regions, batches and packages are defined here with zod schemas.
// Content is loaded at build time from the committed snapshot and can be
// supplemented by live Strapi data at runtime.

import { defineCollection, z } from 'astro:content';

const trekSchema = z.object({
  name: z.string(),
  slug: z.string(),
  difficulty: z.enum(['easy', 'moderate', 'difficult']),
  durationDays: z.number().min(1),
  maxAltitudeM: z.number().min(0),
  trekDistanceKm: z.number().min(0),
  summary: z.string(),
  description: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  region: z.string(),
  regionSlug: z.string(),
  startPoint: z.string(),
  bestSeasons: z.array(z.string()),
  fromPrice: z.number().min(0),
  heroImage: z.string(),
  gallery: z.array(z.string()),
  altitudeProfile: z.array(
    z.object({ distanceKm: z.number(), altitudeM: z.number(), label: z.string().optional() })
  ),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      altitudeM: z.number(),
      distanceKm: z.number(),
      description: z.string(),
    })
  ),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  howToReach: z.object({
    baseTown: z.string(),
    nearestAirport: z.string(),
    nearestRailway: z.string(),
    commuteDetails: z.string(),
    mapEmbedUrl: z.string().optional(),
  }),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  batches: z.array(
    z.object({
      id: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      seatsTotal: z.number(),
      seatsBooked: z.number(),
      pricePerPersonINR: z.number(),
      status: z.enum(['open', 'full', 'cancelled']),
    })
  ),
  packages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      priceINR: z.number(),
      description: z.string(),
      features: z.array(z.string()),
      isPopular: z.boolean().optional(),
    })
  ),
  isFeatured: z.boolean().optional(),
});

const regionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  state: z.enum(['uttarakhand', 'himachal_pradesh']),
  description: z.string(),
  bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});

const batchSchema = z.object({
  id: z.string(),
  trekSlug: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  seatsTotal: z.number(),
  seatsBooked: z.number(),
  pricePerPersonINR: z.number(),
  status: z.enum(['open', 'full', 'cancelled']),
});

export const collections = {
  treks: defineCollection({ schema: trekSchema }),
  regions: defineCollection({ schema: regionSchema }),
  batches: defineCollection({ schema: batchSchema }),
};
