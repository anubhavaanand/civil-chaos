import sys

content = """---
import Layout from '../../layouts/Layout.astro';
import GlassNav from '../../components/GlassNav.astro';
import WhatsAppFab from '../../components/WhatsAppFab.astro';
import Footer from '../../components/Footer.astro';
import FAQAccordion from '../../components/FAQAccordion.astro';
import ElevationProfile from '../../components/ElevationProfile.astro';
import ItineraryTimeline from '../../components/ItineraryTimeline.astro';
import UpcomingBatchesTable from '../../components/UpcomingBatchesTable.astro';
import WeatherWidget from '../../components/WeatherWidget.astro';
import GearChecklist from '../../components/GearChecklist.astro';
import BookingModal from '../../components/BookingModal.astro';
import { mockTreks, type Trek } from '../../data/mock-treks';

export function getStaticPaths() {
  return mockTreks.map((trek) => ({
    params: { slug: trek.slug },
    props: { trek },
  }));
}

const { trek } = Astro.props as { trek: Trek };

const difficultyColor = trek.difficulty === 'easy' ? 'text-emerald-400' : trek.difficulty === 'moderate' ? 'text-amber-400' : 'text-rose-400';

// Schema.org TouristTrip + Product / Offer JSON-LD
const touristTripSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": `${trek.name} 2027`,
  "description": trek.description,
  "touristType": ["Trekkers", "Adventurers", "Hikers"],
  "provider": {
    "@type": "TravelAgency",
    "name": "Dream of The Holy Himalayas",
    "url": "https://holyhimalayas.com"
  },
  "itinerary": {
    "@type": "ItemList",
    "itemListElement": trek.itinerary.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "TouristAttraction",
        "name": item.title,
        "description": item.description
      }
    }))
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": trek.fromPrice,
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01"
  }
};
---

<Layout title={`${trek.name} | Dream of The Holy Himalayas`}>
  <script type="application/ld+json" slot="head" set:html={JSON.stringify(touristTripSchema)} is:inline />
  <GlassNav />

  <!-- 1. The Elite Exped Authority Hero -->
  <header class="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-end bg-[#06090e]">
    <img src={trek.heroImage} alt={trek.name} class="absolute inset-0 w-full h-full object-cover opacity-90" />
    
    <!-- Triple layer gradient overlay for stark contrast -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#06090E] via-[#06090E]/80 to-transparent"></div>
    
    <!-- Technical radial grid lines -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#06090E_100%)] opacity-50 mix-blend-multiply"></div>
    <div class="absolute inset-0" style="background-image: linear-gradient(rgba(20,184,166,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.05) 1px, transparent 1px); background-size: 60px 60px;"></div>

    <!-- High-Altitude GPS Crosshairs -->
    <div class="absolute top-28 right-6 lg:right-12 z-20 hidden md:block">
      <div class="font-mono text-teal-400 text-xs tracking-[0.2em] bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-sm border border-teal-500/30 flex items-center gap-3 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
        <span class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        LAT {trek.coordinates[1]}° N // LNG {trek.coordinates[0]}° E
      </div>
    </div>

    <!-- Hero Content -->
    <div class="container mx-auto px-4 relative z-20 pb-24">
      <span class="text-teal-400 font-mono tracking-widest text-xs md:text-sm uppercase mb-4 block">
        // Expedition Objective
      </span>
      <h1 class="text-5xl md:text-7xl lg:text-[6rem] font-display font-bold text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
        {trek.name}
      </h1>
      
      <!-- Key Meta Specs -->
      <div class="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-xs md:text-sm">
        <span class="bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-sm uppercase">Alt: {trek.maxAltitudeM.toLocaleString()} m</span>
        <span class="bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-sm uppercase">Distance: {trek.trekDistanceKm} km</span>
        <span class="bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-sm uppercase">{trek.region} Himalayas</span>
        <span class={`font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm bg-white/5 border border-white/10 ${difficultyColor}`}>
          Grade: {trek.difficulty}
        </span>
      </div>
    </div>
  </header>

  <!-- Main Body Wrapper -->
  <main class="bg-[#06090e] pb-40 w-full relative">
    
    <!-- Trust Badges Bento (Pulling up into the hero space) -->
    <div class="container mx-auto px-4 -mt-12 relative z-30 mb-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-2xl transition hover:border-teal-500/30">
          <span class="text-teal-400 text-2xl mb-2">🏔️</span>
          <h4 class="text-white font-bold text-sm">100% Certified Guides</h4>
          <p class="text-slate-400 text-xs mt-1">IMF & UIAGM Certified</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-2xl transition hover:border-teal-500/30">
          <span class="text-teal-400 text-2xl mb-2">👥</span>
          <h4 class="text-white font-bold text-sm">Micro Groups</h4>
          <p class="text-slate-400 text-xs mt-1">Max 12-15 Trekkers</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-2xl transition hover:border-teal-500/30">
          <span class="text-teal-400 text-2xl mb-2">📜</span>
          <h4 class="text-white font-bold text-sm">All Permits Arranged</h4>
          <p class="text-slate-400 text-xs mt-1">Zero hassle for you</p>
        </div>
        <div class="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-2xl transition hover:border-teal-500/30">
          <span class="text-teal-400 text-2xl mb-2">💰</span>
          <h4 class="text-white font-bold text-sm">Transparent Pricing</h4>
          <p class="text-slate-400 text-xs mt-1">No hidden gear fees</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-7xl space-y-24">
      
      <!-- 2. The North Face Technical Telemetry Grid -->
      <section>
        <div class="flex items-center gap-4 mb-8">
          <div class="h-px bg-teal-500/50 w-12"></div>
          <h2 class="text-teal-400 font-mono tracking-widest text-sm uppercase">Expedition Telemetry</h2>
          <div class="h-px bg-white/10 flex-1"></div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-slate-900/60 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(20,184,166,0.03)] relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 class="text-white font-display font-bold text-xl mb-6">Altitude Gradient Profile</h3>
            <ElevationProfile points={trek.altitudeProfile} maxAltitudeM={trek.maxAltitudeM} />
          </div>
          
          <div class="flex flex-col gap-6">
            <div class="bg-slate-900/60 backdrop-blur-md border border-teal-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(20,184,166,0.03)] flex-1">
              <WeatherWidget />
            </div>
            <!-- Safety Protocol Warning Mockup -->
            <div class="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
              <span class="text-amber-500 text-2xl">⚠️</span>
              <div>
                <h4 class="text-amber-500 font-mono text-xs font-bold tracking-[0.15em] uppercase mb-1.5">Safety Protocol 4B Active</h4>
                <p class="text-amber-200/80 text-sm leading-relaxed">High altitude moraine crossing requires pulse oximeter monitoring. Effective O2 saturation drops significantly above 14,000 ft.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Overview & Itinerary Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2 space-y-16">
          
          <section class="space-y-6">
            <div class="flex items-center gap-4 mb-8">
              <h2 class="text-3xl font-display font-bold text-white uppercase tracking-tight">Expedition Overview</h2>
              <div class="h-px bg-white/10 flex-1"></div>
            </div>
            <p class="text-lg text-slate-300 leading-relaxed font-light">{trek.description}</p>
            <div class="flex flex-wrap gap-3 pt-4">
              <span class="text-xs font-bold tracking-widest text-slate-500 uppercase font-mono mt-1">Best Seasons //</span>
              {trek.bestSeasons.map((season) => (
                <span class="rounded bg-white/5 px-3 py-1 text-xs font-mono text-teal-400 border border-white/10">{season}</span>
              ))}
            </div>
          </section>

          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 class="text-2xl font-display font-bold text-white uppercase">Fixed Departures</h2>
              <span class="text-xs font-mono text-teal-400 hidden sm:inline-block">LIVE AVAILABILITY</span>
            </div>
            <UpcomingBatchesTable batches={trek.batches} trekName={trek.name} trekSlug={trek.slug} />
          </section>

          <section class="space-y-8">
            <h2 class="text-3xl font-display font-bold text-white uppercase tracking-tight border-b border-white/10 pb-4">Daily Itinerary Log</h2>
            <ItineraryTimeline days={trek.itinerary} />
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-8 space-y-4">
              <h3 class="font-display text-xl font-bold text-teal-400 uppercase tracking-wide">Included</h3>
              <ul class="space-y-3 text-sm text-slate-300">
                {trek.inclusions.map((inc) => (
                  <li class="flex items-start gap-3">
                    <span class="text-teal-400 font-bold mt-0.5">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div class="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 space-y-4">
              <h3 class="font-display text-xl font-bold text-rose-400 uppercase tracking-wide">Excluded</h3>
              <ul class="space-y-3 text-sm text-slate-300">
                {trek.exclusions.map((exc) => (
                  <li class="flex items-start gap-3">
                    <span class="text-rose-400 font-bold mt-0.5">✕</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-display font-bold text-white uppercase border-b border-white/10 pb-4">Logistics & FAQs</h2>
            <div class="rounded-2xl border border-white/10 bg-slate-900/40 p-6 mb-8">
              <h3 class="font-bold text-white mb-4">Basecamp Routing: {trek.startPoint}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p class="font-mono text-teal-400 text-xs mb-1">✈️ AIRPORT</p>
                  <p class="text-slate-300">{trek.howToReach.nearestAirport}</p>
                </div>
                <div>
                  <p class="font-mono text-teal-400 text-xs mb-1">🚆 RAILWAY</p>
                  <p class="text-slate-300">{trek.howToReach.nearestRailway}</p>
                </div>
              </div>
              <p class="text-sm text-slate-400 pt-4 mt-4 border-t border-white/5">{trek.howToReach.commuteDetails}</p>
            </div>
            <FAQAccordion items={trek.faqs} />
          </section>

        </div>

        <!-- Right Side Utility Column -->
        <div class="lg:col-span-1 space-y-8">
           <div class="sticky top-24">
              <GearChecklist />
           </div>
        </div>
      </div>
    </div>
  </main>

  <!-- 4. The Much Better Adventures Sticky Info Bar -->
  <div class="fixed bottom-0 left-0 w-full z-50 bg-[#06090e]/90 backdrop-blur-2xl border-t border-teal-500/30 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-0 transition-transform duration-300">
    <div class="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
      
      <!-- Metrics (Hidden on Mobile) -->
      <div class="hidden md:flex items-center gap-6 font-mono text-xs lg:text-sm">
        <div class="text-slate-300 flex flex-col">
          <span class="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Duration</span> 
          <span>{trek.durationDays} DAYS / {trek.durationDays - 1} NIGHTS</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <div class="text-slate-300 flex flex-col">
          <span class="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Max Altitude</span> 
          <span>{trek.maxAltitudeM.toLocaleString()} m</span>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <div class="text-slate-300 flex flex-col">
          <span class="text-teal-500 font-bold uppercase tracking-widest text-[10px]">Difficulty</span> 
          <span class="uppercase">{trek.difficulty}</span>
        </div>
      </div>

      <!-- Pricing & CTA -->
      <div class="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
        <div class="flex flex-col">
          <span class="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-mono">Starts From</span>
          <span class="text-2xl md:text-3xl font-display font-bold text-white leading-none">₹{trek.fromPrice.toLocaleString('en-IN')}</span>
        </div>
        
        <button
          data-open-modal="booking-modal"
          class="open-booking-trigger group relative px-6 md:px-8 py-3.5 md:py-4 bg-teal-500 hover:bg-teal-400 text-[#06090E] font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all overflow-hidden whitespace-nowrap cursor-pointer"
        >
          <span class="relative z-10 flex items-center gap-2">
            Request Booking 
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>
      
    </div>
  </div>

  <BookingModal trek={trek} />
  <WhatsAppFab />
  <Footer />
</Layout>
"""

with open('apps/web/src/pages/treks/[slug].astro', 'w') as f:
    f.write(content)
