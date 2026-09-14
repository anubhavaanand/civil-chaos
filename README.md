<div align="center">

  <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop" alt="Himalayan Peaks Banner" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">

  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/apps/web/public/favicon.svg" width="80" height="80" alt="Holy Himalayas Logo">
  
  <h1 align="center">Dream of The Holy Himalayas</h1>
  <p align="center"><strong>Next-Generation Himalayan Trekking & Expedition Platform</strong></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Astro-0C0E14?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/Strapi_5-2E7EEA?style=for-the-badge&logo=strapi&logoColor=white" alt="Strapi" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon Postgres" />
  </p>

  <p align="center">
    <i>HQ: Village Mautar, Uttarkashi, Uttarakhand</i>
  </p>
</div>

<br />

> **Dream of The Holy Himalayas** is a premium, high-performance web platform built for a boutique trekking agency. Designed to shatter the traditional "budget tour operator" aesthetic, this platform utilizes a bespoke **Alpine Glass** design system, cinematic dark-mode interfaces, interactive 3D topography, and real-time telemetry HUDs.

---

## 🏔 Features & Aesthetics

<table align="center">
  <tr>
    <td width="50%">
      <h3>💎 Alpine Glass UI</h3>
      <p>Dark mode natively. Neon teal topographical accents, frosted glass components, and hardware-accelerated CSS animations. Built entirely on Tailwind v4.</p>
    </td>
    <td width="50%">
      <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&auto=format&fit=crop" alt="Dark UI Concept" style="border-radius: 8px;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://images.unsplash.com/photo-1623910271015-c26569a941ea?q=80&w=600&auto=format&fit=crop" alt="3D Topography Concept" style="border-radius: 8px;">
    </td>
    <td width="50%">
      <h3>🌍 3D Peak Telemetry</h3>
      <p>An interactive <code>Three.js</code> viewport that dynamically loads GLTF meshes of Himalayan summits based on the selected trek, displaying altitude, temperature, and GPS coordinates.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🗺 Interactive MapLibre Engine</h3>
      <p>Custom <code>MapLibre GL JS</code> integration with MapTiler's <code>terrain-rgb-v2</code>. Renders the Himalayas in exaggerated 3D with atmospheric fog and custom vector tracking.</p>
    </td>
    <td width="50%">
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" alt="Map Interface Concept" style="border-radius: 8px;">
    </td>
  </tr>
</table>

---

## 🏗 System Architecture

The platform operates on a decoupled edge-architecture, ensuring lightning-fast static delivery with secure, serverless data fetching.

```mermaid
graph TD;
    User((🧑‍💻 Explorer)) -->|Visits Site| CF[☁️ Cloudflare Pages<br/>Astro Frontend];
    
    subgraph Edge Network
        CF
    end

    subgraph Infrastructure
        CF <-->|REST API / Webhooks| Render[⚙️ Render<br/>Strapi 5 CMS];
        Render <-->|Reads/Writes| Neon[(🐘 Neon Postgres<br/>Serverless DB)];
        Render <-->|Asset Uploads| Cloudinary[🖼️ Cloudinary<br/>Media CDN];
    end

    subgraph External APIs
        CF -.->|Loads 3D Terrain| MapTiler[🗺️ MapTiler API];
    end
```

### 🔀 Secure Booking Flow (Phase 1)

All Strapi write operations are routed securely through an Astro Server Action, completely hiding the Strapi API tokens from the client browser.

```mermaid
sequenceDiagram
    participant U as User
    participant A as Astro Client (Browser)
    participant C as Astro Server (Cloudflare)
    participant S as Strapi CMS (Render)
    
    U->>A: Submits Booking Form
    A->>C: POST /_actions/booking (Honeypot + Data)
    activate C
    C->>C: Validate Rate Limits & Bot Checks
    C->>S: Secure Server-to-Server POST /api/booking-requests
    S-->>C: 201 Created (Booking ID)
    C-->>A: Success Response
    deactivate C
    A->>U: Redirect to WhatsApp Deep Link for Verification
```

---

## 🚀 Local Development

### Prerequisites
* Node.js 20+
* NPM Workspace Support

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

### 3. Running the Stack
Run the entire monorepo concurrently:
```bash
npm run dev
```
* **Astro Frontend:** [http://localhost:4321](http://localhost:4321)
* **Strapi Admin Panel:** [http://localhost:1337/admin](http://localhost:1337/admin)

---
<p align="center">
  <i>Proprietary software. All rights reserved by Dream of The Holy Himalayas.</i>
</p>
