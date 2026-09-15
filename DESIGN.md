# Design System: Dream of The Holy Himalayas

## 1. Visual Theme & Atmosphere
An austere, high-altitude alpine atelier interface fusing Swiss typographic rigor with declassified mountain telemetry. The aesthetic language is Dark Alpine Glass: deep obsidian bedrock surfaces, frosted high-pass glass panels, double-bezel engineering borders, and calibrated glacier-cyan vector accents. The atmosphere evokes a late-night expedition command room in Village Mautar (1,950m MSL), silent, authoritative, and medically precise.

- **Density Index:** 5 (Daily App Balanced with high-density telemetry data matrices)
- **Layout Variance:** 8 (Offset Asymmetric: split-screen viewports, irregular rhythm, no centered heroes)
- **Motion Dynamics:** 7 (Fluid CSS and spring-physics interpolation with 120fps hardware-accelerated transforms)

---

## 2. Color Palette & Roles

### Base & Surface Hierarchy
- **Obsidian Bedrock** (`#050505`): Primary viewport canvas background. Absolute baseline depth without harsh pure-black clipping.
- **Alpine Slate** (`#0a0f18`): Primary container, card body, and modal backdrop with 90% opacity and 16px background blur.
- **Glacial Navy** (`#0f172a`): Secondary nested surface, active segment controls, and hovered state container fill.
- **Alpine Scrim** (`rgba(5, 5, 5, 0.75)`): Mandatory optical scrim layer placed between high-contrast photography and typography to ensure WCAG 2.1 AA legibility.

### Structural Borders & Dividers
- **Whisper Ice Line** (`rgba(255, 255, 255, 0.08)`): Primary 1px structural container boundary.
- **Technical Grid Divider** (`rgba(255, 255, 255, 0.14)`): Table row separators, split-screen seams, and telemetry panel edges.
- **Active Focus Bezel** (`rgba(0, 242, 254, 0.40)`): Highlighted border state for selected summits, active filters, and form inputs.

### Typographic Inks
- **High-Pass White** (`#F8FAFC`): Primary display titles, active metrics, and high-priority waypoints.
- **Weathered Silver** (`#94A3B8`): Secondary body text, long-form narratives, and explanatory field notes.
- **Glacier Frost** (`#CBD5E1`): Navigational links, category chips, and table headings.
- **Telemetry Muted** (`#64748B`): Coordinate grids, latitude/longitude labels, and inactive state tags.

### Functional Accent (Singular)
- **Glacier Cyan** (`#00F2FE`): Strictly the single active accent. Used for expedition waypoints, altitude datum callouts, active radio buttons, primary dispatch buttons, and pulse rings. Saturation calibrated to 78%. No secondary purple, pink, or yellow neon accents permitted.

---

## 3. Typography Architecture

### Font Stack Specifications
- **Display Headlines:** `Cabinet Grotesk` or `Space Grotesk` (weights 700 to 900). Track-tight (`-0.03em`), geometric construction, uppercase precision for sector titles.
- **Editorial Body:** `Satoshi` or `Geist` (weights 300 to 500). Relaxed leading (`1.65`), strictly capped at 65 characters per line (`max-w-[65ch]`) to prevent eye fatigue.
- **Telemetry Monospace:** `Geist Mono` or `JetBrains Mono` (weights 400 to 700). Mandatory for all elevations, timestamps, coordinates, degree symbols, and financial figures.

### Typographic Scale Hierarchy
- **Display Giant:** `clamp(2.5rem, 6vw, 4.5rem)`: Headline hero statements.
- **Section Heading:** `clamp(1.75rem, 3.5vw, 2.5rem)`: Route roster and telemetry titles.
- **Sub-section Title:** `1.25rem` (`20px`): Card headings, itinerary day headers.
- **Body Standard:** `0.9375rem` (`15px`): Route descriptions, guides biographies, safety charters.
- **Telemetry Micro:** `0.6875rem` (`11px`): Latitude/longitude coordinates, batch status indicators, barometric pressure readouts.

---

## 4. Component Behaviors & Styling

### Double-Bezel Alpine Container
All interactive cards, modals, and telemetry readouts employ the double-bezel construction:
1. **Outer Ring:** 1px solid border at `rgba(255, 255, 255, 0.08)`, outer radius `16px`.
2. **Inner Body:** Inset padding of `1px`, background `#0a0f18` with `backdrop-blur-md`, inner radius `15px`.
3. **Scrim Floor:** Under real mountain imagery, always enforce a dark backdrop filter (`backdrop-saturate-150 bg-black/40`) to maintain WCAG contrast.

### Buttons & Interactive Controls
- **Primary Dispatch Action:** Obsidian fill with 1px Glacier Cyan border, text in Glacier Cyan (`#00f2fe`), letter-spacing `0.1em` uppercase. On hover: background transitions to `rgba(0, 242, 254, 0.12)`, border brightens. On active: tactile `-1px` vertical translation.
- **Secondary Ghost Control:** Transparent background, 1px border `rgba(255, 255, 255, 0.12)`, text in Glacier Frost. On hover: border transitions to `rgba(255, 255, 255, 0.3)`.
- **Prohibited:** Outer drop-shadow glows, multi-color rainbow gradients, rounded pill shapes for primary buttons.

### Form Inputs & Select Fields
- Dark obsidian base (`#050505`) with 1px border `rgba(255, 255, 255, 0.15)`.
- Label positioned strictly above the field in uppercase monospace `11px` text (`#94A3B8`).
- Focus state: crisp 1px Glacier Cyan outline with zero offset. No glowing halos.
- Validation: inline monospace error string rendered below the input container.

### Status Badges & Telemetry Pills
- Monospace uppercase text (`10px` to `11px`), tracking `0.12em`.
- Background: `rgba(0, 0, 0, 0.6)`.
- Difficulty color matrix:
  - Easy: Emerald (`#34D399`) with `rgba(52, 211, 153, 0.15)` border.
  - Moderate: Amber (`#FBBF24`) with `rgba(251, 191, 36, 0.15)` border.
  - Difficult: Rose (`#FB7185`) with `rgba(251, 113, 133, 0.15)` border.

---

## 5. Layout Principles & Grid Architecture

### Asymmetric Viewport Distribution
- **Hero Section:** Left-aligned technical title and telemetry pill paired with an offset right-column 3D WebGL viewport or topography vector radar. Centered hero layouts are forbidden.
- **Feature Roster:** Asymmetric bento grid featuring a 2-column dominant hero expedition card followed by single-column technical route cards.
- **Section Heights:** Use `min-h-[100dvh]` for full-viewport staging. Never use `h-screen` due to mobile browser dynamic toolbar jumps.
- **Spatial Zones:** Every card, label, and control occupies its own isolated CSS grid cell. Zero absolute-positioned text stacking over primary body paragraphs.

---

## 6. Motion Philosophy & Micro-Interactions

### Physical Engine Tuning
- **Spring Physics:** `stiffness: 100, damping: 20`. Avoid linear or generic ease-in-out motion curves.
- **Interaction Feedback:** Tactile push depth (`transform: translateY(-1px)` or `scale(0.98)`) on active touch/click.
- **Waterfall Cascades:** Data tables and catalog matrices reveal entries via staggered delays (35ms per row) on viewport entry.

### Perpetual Micro-Interactions
- **Basecamp Ping:** Village Mautar HQ waypoint features a perpetual 2.4s pulse wave (`opacity` from 0.8 to 0, `scale` from 1 to 2.4) indicating live telemetry uplink.
- **Atmospheric Canvas:** Subtle particle drifting and topographic elevation contours rendered via hardware-accelerated WebGL or SVG path animations.
- **Performance Rule:** All animations restricted to `transform` and `opacity`. Never animate layout-triggering properties (`width`, `height`, `margin`, `top`, `left`).

---

## 7. Explicit Anti-Patterns (Banned Design Slop)

The following conventions are strictly prohibited across all generated screens:

1. **No Emojis Anywhere:** Zero decorative emojis in buttons, pills, headings, or navigation. All indicators must use calibrated 1.75px geometric SVGs.
2. **No Em-Dashes:** Zero em-dash characters (`\u2014`) in copy, metadata, or documentation. Use standard hyphens with spaces or colons.
3. **No Inter Font:** The generic `Inter` typeface is banned. Use `Cabinet Grotesk`, `Space Grotesk`, or `Satoshi`.
4. **No Pure Black Backgrounds:** `#000000` is banned for surfaces. Use layered Obsidian (`#050505`) and Alpine Slate (`#0a0f18`).
5. **No Neon / Cyberpunk Glows:** Radial box-shadow outer glows exceeding 12px or using saturated purple/magenta are banned.
6. **No 3-Column Equal Card Clichés:** Standard three equal-sized cards in a row are banned. Use asymmetric bento grids or horizontal technical matrices.
7. **No AI Copywriting Clichés:** Words like "Elevate", "Seamless", "Unleash", "Next-Gen", "Bespoke Journey" are banned. Use authentic Himalayan terminology ("Staging Window", "Alpine Ridge", "High Pass Traverse", "Acclimatization Profile").
8. **No Filler UI Navigation:** Floating bounce arrows, "Scroll to explore" badges, and pulsating down-chevrons are banned.
