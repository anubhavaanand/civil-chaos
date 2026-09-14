<div align="center">
  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/apps/web/public/favicon.svg" width="100" height="100" alt="Holy Himalayas Logo">
  <h1>Dream of The Holy Himalayas</h1>
  <p><strong>Next-Generation Himalayan Trekking & Expedition Platform</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Astro-0C0E14?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/Strapi-2E7EEA?style=for-the-badge&logo=strapi&logoColor=white" alt="Strapi" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon Postgres" />
  </p>
</div>

---

## 🏔 The Project

**Dream of The Holy Himalayas** is a premium, high-performance web platform built for a boutique trekking agency based in Village Mautar, Uttarkashi. Designed to shatter the traditional "budget tour operator" aesthetic, this platform utilizes a bespoke **Alpine Glass** design system, combining cinematic dark-mode interfaces, interactive 3D topography, and real-time telemetry HUDs.

## ✨ Core Features

*   **Cinematic "Alpine Glass" UI:** Dark mode natively, neon teal topographical accents, and frosted glass components using Tailwind v4.
*   **3D Peak Telemetry Engine:** An interactive `Three.js` viewport that dynamically loads `.glb` meshes of Himalayan summits based on the selected trek.
*   **Interactive 3D Topography:** `MapLibre GL JS` integrated with MapTiler's `terrain-rgb-v2` to render the Himalayas in exaggerated 3D with atmospheric fog and custom vector tracking.
*   **Headless Content Architecture:** Fully powered by **Strapi 5**, allowing the agency to instantly update itineraries, batches, and pricing without touching the codebase.

## 🏗 System Architecture

This monorepo handles both the frontend web application and the headless backend CMS, orchestrated for edge deployment.

| Layer | Technology | Deployment Target |
| :--- | :--- | :--- |
| **Frontend** | Astro (Hybrid SSR) | Cloudflare Pages |
| **Backend CMS** | Strapi 5 | Render |
| **Database** | PostgreSQL | Neon (Serverless) |
| **Asset CDN** | Cloudinary | Cloudinary |
| **Maps & 3D** | MapLibre + Three.js | Client-side Canvas |

---

## 🚀 Local Development

### Prerequisites
*   Node.js 20+
*   NPM Workspace Support

### 1. Installation
Clone the repository and install dependencies from the root directory:
```bash
git clone https://github.com/anubhavaanand/civil-chaos.git
cd civil-chaos
npm install
```

### 2. Environment Setup
You will need to configure environment variables for both the frontend and the CMS. 
```bash
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env
```
*(Populate these files with your MapTiler Key, Neon Postgres URL, and Cloudinary keys).*

### 3. Running the Stack
Run the entire monorepo concurrently:
```bash
npm run dev
```
*   **Astro Frontend:** [http://localhost:4321](http://localhost:4321)
*   **Strapi Admin Panel:** [http://localhost:1337/admin](http://localhost:1337/admin)

## 📂 Monorepo Structure

```text
civil-chaos/
├── apps/
│   ├── web/                # Astro Frontend (Pages, UI Components, 3D Engines)
│   └── cms/                # Strapi 5 Backend (Content Types, APIs, Webhooks)
├── docs/                   # Architectural Specs and Product Requirements
├── package.json            # Monorepo Workspace Configuration
└── .npmrc                  # CI/CD Dependency Rules
```

## 📜 License
Proprietary software. All rights reserved by Dream of The Holy Himalayas.
