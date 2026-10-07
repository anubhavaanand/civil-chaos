import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Prototype: pure static output, no adapter, no server functions.
// Booking = client-side WhatsApp deep link (honeypot + Indian mobile validation).
export default defineConfig({
  site: 'https://dreamoftheholyhimalayas.com',
  output: 'static',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('maplibre-gl')) return 'maplibre';
          },
        },
      },
    },
  },
});
