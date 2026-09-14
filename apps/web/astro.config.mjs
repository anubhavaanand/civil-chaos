import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Cloudflare Pages deployment: output 'static' with adapter for server endpoints
// The @astrojs/node adapter enables server functions (actions, API routes) on Cloudflare
export default defineConfig({
  site: 'https://dreamoftheholyhimalayas.com',
  output: 'static',
  adapter: cloudflare(),


  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Generate sitemap and optimize for production
    inlineStylesheets: 'auto',
  },
});
