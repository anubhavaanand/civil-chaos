const fs = require('fs');
const file = 'apps/web/src/pages/contact.astro';
let content = fs.readFileSync(file, 'utf8');

const schema = `<script type="application/ld+json" slot="head" is:inline set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "TouristInformationCenter"],
    "name": SITE_CONFIG.name,
    "image": "https://images.unsplash.com/photo-1542228262-3d663b306a53?q=80&w=2071&auto=format&fit=crop",
    "@id": "https://www.dreamoftheholyhimalayas.com",
    "url": "https://www.dreamoftheholyhimalayas.com",
    "telephone": SITE_CONFIG.phoneTel,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Village Mautar",
      "addressLocality": "Uttarkashi",
      "addressRegion": "Uttarakhand",
      "postalCode": "249128", 
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.coordinates.lat,
      "longitude": SITE_CONFIG.coordinates.lng
    }
  })} />`;

content = content.replace(/<Layout title="Alpine Dispatch & Contact \| Dream of The Holy Himalayas">/, `<Layout title="Alpine Dispatch & Contact | Dream of The Holy Himalayas">\n  ${schema}`);
fs.writeFileSync(file, content);
