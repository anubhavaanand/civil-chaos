---
name: Dream of The Holy Himalayas
colors:
  obsidian: '#050505'
  alpine-slate: '#0a0f18'
  glacial-navy: '#0f172a'
  high-pass-white: '#F8FAFC'
  weathered-silver: '#94A3B8'
  glacier-frost: '#CBD5E1'
  telemetry-muted: '#64748B'
  ink: '#e8eef2'
  ink-dim: '#a9b8c0'
  glacier: '#00F2FE'
  glacier-deep: '#00b4d8'
  easy-emerald: '#34D399'
  moderate-amber: '#FBBF24'
  difficult-rose: '#FB7185'
  whisper-ice-line: 'rgba(255,255,255,0.08)'
  technical-grid-divider: 'rgba(255,255,255,0.14)'
  focus-bezel: 'rgba(0,242,254,0.40)'
  alpine-scrim: 'rgba(5,5,5,0.75)'
typography:
  display-giant:
    fontFamily: Space Grotesk
    fontSize: clamp(2.5rem, 6vw, 4.5rem)
    fontWeight: '800'
    lineHeight: 1.08
    letterSpacing: '-0.03em'
  section-heading:
    fontFamily: Space Grotesk
    fontSize: clamp(1.75rem, 3.5vw, 2.5rem)
    fontWeight: '700'
    letterSpacing: '-0.02em'
  body-standard:
    fontFamily: Geist Sans
    fontSize: 15px
    fontWeight: '300'
    lineHeight: 1.65
  telemetry-micro:
    fontFamily: Geist Mono
    fontSize: 11px
    fontWeight: '700'
    letterSpacing: '0.12em'
---

# Design System: Dream of The Holy Himalayas

> Extracted from `apps/web` source (Astro 5 + Tailwind v4 `@theme` tokens in `src/styles/global.css`). This is the corrected, code-truth version - it supersedes the earlier light-theme draft.

## 1. Visual Theme & Atmosphere

An austere, high-altitude alpine atelier interface fusing Swiss typographic rigor with declassified mountain telemetry. Deep obsidian bedrock surfaces, frosted high-pass glass panels, double-bezel engineering borders, and calibrated glacier-cyan vector accents. The atmosphere evokes a late-night expedition command room in Village Mautar (1,950m MSL): silent, authoritative, medically precise.

Full-bleed Himalayan documentary photography sits under calibrated dark scrims everywhere text appears. Data is presented as telemetry: monospace tabular figures, uppercase micro-labels with wide tracking, GPS crosshairs, pulsing uplink dots. The site reads like an instrument panel crossed with a mountaineering journal.

## 2. Color Palette & Roles

### Primary Foundation
- **Obsidian Bedrock** (`#050505`): page canvas. Never pure black `#000000`.
- **Alpine Slate** (`#0a0f18`): card bodies, modal backdrops, nav fill (85-95% opacity + blur).
- **Glacial Navy** (`#0f172a`): nested surfaces, hovered fills, inner bezel bodies.
- **Alpine Scrim** (`rgba(5,5,5,0.5-0.75)`): mandatory layer between photography and any text/glass.

### Accent & Interactive
- **Glacier Cyan** (`#00F2FE`): the ONLY accent. Waypoints, primary dispatch buttons, active filters, focus rings, prices, pulse rings. Deep variant `#00b4d8`. Orange (`#EA580C`) is banned. No rainbow gradients.
- **WhatsApp Green** (`#25D366`): reserved exclusively for WhatsApp CTAs.

### Typography & Text Hierarchy
- **High-Pass White** (`#F8FAFC`): display titles, active metrics.
- **Weathered Silver** (`#94A3B8`): body text, long-form.
- **Glacier Frost** (`#CBD5E1`): links, chips, table headings.
- **Telemetry Muted** (`#64748B`): coordinates, inactive tags, footnotes.

### Functional States
- Easy: Emerald `#34D399` (border `rgba(52,211,153,0.3)` on `rgba(...,0.1)` fill)
- Moderate: Amber `#FBBF24` (same recipe)
- Difficult: Rose `#FB7185` (same recipe)
- Error text uses the rose token; success ticks use emerald.

## 3. Typography Rules

### Hierarchy & Weights
- **Display: Space Grotesk** (700-900, tracking -0.03em). Uppercase for section titles ("EXPEDITION CATALOG"). Hero: `clamp(2.5rem, 6vw, 4.5rem)`, leading 1.08.
- **Body: Geist Sans** (300-500; Satoshi is the accepted alternate). Leading 1.65, hard cap `65ch` per line.
- **Telemetry: Geist Mono** (400/700, `tabular-nums`). MANDATORY for elevations, coordinates, prices, dates, batch status, GPS readouts. Micro-labels: 10-11px uppercase, tracking 0.12em.

### Spacing Principles
- 8px base grid; sections breathe at `py-24` to `py-32` (96-128px).
- Card padding: 24-32px. Never crowd telemetry rows.

## 4. Component Stylings

### Buttons
- **Primary dispatch**: Glacier Cyan fill, obsidian text, rounded-full, uppercase mono 11-12px tracking-widest. Hover: fill darkens to Alpine Slate, text turns cyan. Active: `scale(0.975) translateY(1px)` (`.btn-tactile`).
- **Ghost**: transparent on `rgba(255,255,255,0.12)` border, Frost text. Hover: border cyan, text cyan.
- Banned: outer glows, pill-shaped rainbow gradients, generic `hover:-translate-y-1`.

### Cards & Containers
- **Double-bezel**: outer ring 1px `rgba(255,255,255,0.08-0.1)`, radius 24px, 6px padding; inner body radius 18px, Alpine Slate 85% + `backdrop-blur(24px)`, border `rgba(255,255,255,0.06)` (`.double-bezel-outer/inner`).
- **Glass panel**: `blur(16px) saturate(150%)` on `rgba(255,255,255,0.03-0.1)`, border `rgba(255,255,255,0.12)` (`.glass`). Fallback via `@supports not (backdrop-filter)` to solid `#0b111a/95`.
- **Refraction glass** (`.glass-refract`): SVG `feDisplacementMap` lens bends DECORATIVE photo layers at panel edges. Never applied to text. Filter defs `#alpine-refraction` live in `Layout.astro`.
- Trek cards: full-bleed photo at 40% opacity over Alpine Slate, gradient to obsidian, region + difficulty chips top, name + mono telemetry footer with cyan price.
- **Lens bevel** (`.lens-edge`): inset 1px top highlight `rgba(255,255,255,0.14)`.

### Navigation
- Fixed glass bar, rounded-2xl, persists across routes (`transition:persist`). Links in Frost, hover Glacier. Mobile: CSS-only checkbox drawer. CTA pill "Reserve Batch" top-right.

### Inputs & Forms
- Obsidian `#050505` fields, 1px `rgba(255,255,255,0.15)` border, rounded-xl.
- Labels ABOVE fields: uppercase mono 11px, Silver. Focus: 1px Glacier Cyan outline + ring, zero halo. Phone input prefixed `+91`, digits-only, pattern `^[6-9]\d{9}$`.
- Inline mono error strings in rose below the field.

### Domain-Specific Components
- **Booking dialog**: native `<dialog>` with `@starting-style` scale/fade, 75% obsidian backdrop + 12px blur, double-bezel body, honeypot `company` field, WhatsApp deep-link success state.
- **Batches table**: mono, tabular; seat badges (glacier = open, amber = low, rose = full), Reserve buttons feed the dialog.
- **Sticky reservation bar** (trek pages): fixed bottom, obsidian/90 blur, cyan top border, duration/altitude/difficulty telemetry + price + Request Booking.
- **Map** (pending rework): glacier pins with halo pulses on a dark basemap.
- **Telemetry ping** (`.ping-ring`): 2.4s expanding cyan ring on live-status dots.

## 5. Layout Principles

### Grid & Structure
- Max width 1280px (`max-w-7xl`) centered, 24px page gutters.
- **Asymmetric bento grids**: first card spans 2 columns as hero expedition; never 3 equal columns.
- Split heroes: left-aligned editorial headline + right/under photography; centered heroes banned.

### Whitespace Strategy
- Full-viewport staging: `min-h-[100dvh]` (never `h-screen`).
- Section rhythm: 96-128px vertical; trust strips pull up into hero space (`-mt-10`).

### Alignment & Visual Balance
- Telemetry right-aligned against editorial left content; prices right in cards/tables.
- 40px background grid lines (`bg-grid`) at 3% white on hero canvases.

### Responsive Behavior & Touch
- Mobile-first collapse to single column < 768px; tables scroll horizontally.
- All motion `transform`/`opacity` only; `prefers-reduced-motion` kills every animation.
- View Transitions: hero image/title/telemetry morph via `transition:name`, nav persists.

## 6. Design System Notes for Stitch Generation

### Language to Use
"Dark alpine expedition command room", "frosted high-pass glass over Himalayan documentary photography", "Swiss typographic telemetry", "obsidian bedrock", "glacier-cyan instrument accents".

### Color References
Obsidian `#050505` canvas; Alpine Slate `#0a0f18` panels; Glacier Cyan `#00F2FE` sole accent; text White `#F8FAFC` / Silver `#94A3B8` / Frost `#CBD5E1`; states Emerald/Amber/Rose per difficulty.

### Component Prompts
- "Generate a dark alpine expedition homepage: left-aligned Space Grotesk headline over a full-bleed Himalaya sunrise photo with a calibrated obsidian scrim, glass trust cards, a mono telemetry eyebrow pill with a pulsing glacier dot, and a rounded glacier-cyan dispatch button. No emojis, no orange, no centered hero."
- "Generate an expedition catalog: double-bezel filter toolbar with uppercase mono pills (region / altitude band / trail rigor) with live counts, then an asymmetric bento grid of trek cards - full-bleed photos under a dark gradient, region+difficulty chips, and a monospace footer with days, altitude, and a glacier-cyan from-price."
- "Generate a booking dialog: obsidian scrim 75% with 12px blur, double-bezel panel, uppercase mono labels above obsidian inputs with glacier focus rings, +91 phone prefix, and a full-width glacier dispatch button."

### Incremental Iteration
Generate one screen at a time; keep the double-bezel + scrim recipes verbatim; enforce the mono-for-numbers rule on every revision; reject any screen introducing a second accent hue, emojis, or centered heroes.
