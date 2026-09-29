const fs = require('fs');
const file = 'apps/web/src/pages/treks/[slug].astro';
let content = fs.readFileSync(file, 'utf8');

const newSchema = `const touristTripSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": \`\${trek.name} 2027\`,
  "description": trek.description,
  "touristType": ["Trekkers", "Adventurers", "Hikers"],
  "provider": {
    "@type": "TravelAgency",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url
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

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": trek.name,
  "description": trek.description,
  "image": trek.heroImage,
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": trek.fromPrice,
    "availability": "https://schema.org/InStock"
  }
};`;

content = content.replace(/const touristTripSchema = \{[\s\S]*?\};\n/, newSchema + '\n');
content = content.replace(/<script type="application\/ld\+json" slot="head" set:html={JSON.stringify\(touristTripSchema\)} is:inline \/>/, `<script type="application/ld+json" slot="head" set:html={JSON.stringify([touristTripSchema, productSchema])} is:inline />`);

fs.writeFileSync(file, content);
