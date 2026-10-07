export interface AltitudePoint {
  distanceKm: number;
  altitudeM: number;
  label?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  altitudeM: number;
  distanceKm: number;
  description: string;
}

export interface Batch {
  id: string;
  startDate: string;
  endDate: string;
  seatsTotal: number;
  seatsBooked: number;
  pricePerPersonINR: number;
  status: 'open' | 'full' | 'cancelled';
}

export interface PackageTier {
  id: string;
  name: string;
  priceINR: number;
  isPopular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToReach {
  baseTown: string;
  nearestAirport: string;
  nearestRailway: string;
  commuteDetails: string;
}

export interface Trek {
  name: string;
  slug: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
  durationDays: number;
  maxAltitudeM: number;
  trekDistanceKm: number;
  summary: string;
  description: string;
  coordinates: [number, number]; // [lng, lat]
  region: string;
  regionSlug: string;
  startPoint: string;
  bestSeasons: string[];
  fromPrice: number;
  heroImage: string;
  gallery: string[];
  altitudeProfile: AltitudePoint[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  howToReach: HowToReach;
  faqs: FAQItem[];
  batches: Batch[];
  packages: PackageTier[];
  isFeatured: boolean;
}

export interface RegionInfo {
  name: string;
  slug: string;
  mapBounds: [number, number, number, number];
}
