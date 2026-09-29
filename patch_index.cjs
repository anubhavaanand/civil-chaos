const fs = require('fs');
const file = 'apps/web/src/pages/index.astro';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"@type": "TouristInformationCenter",/, `"@type": ["Organization", "LocalBusiness", "TouristInformationCenter"],`);
fs.writeFileSync(file, content);
