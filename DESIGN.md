# Design System: Dream of The Holy Himalayas

> **Single source of truth for the Alpine Glass design language.** Generated from the
> `taste-design` skill and calibrated against what `apps/web` actually renders, so every
> rule here is either already implemented or explicitly marked as work to do.
> Tokens live in `apps/web/src/styles/global.css` (`@theme` block + `@layer utilities`).

---

## 1. Visual Theme & Atmosphere

An austere, high-altitude alpine atelier interface fusing Swiss typographic rigor with
declassified mountain telemetry. The aesthetic language is **Dark Alpine Glass**: deep
obsidian bedrock surfaces, frosted high-pass glass panels, double-bezel engineering borders,
and calibrated glacier-cyan vector accents.

The atmosphere evokes a late-night expedition command room in Village Mautar (1,950 m MSL) —
silent, authoritative, and medically precise.

| Property | Value | Meaning |
|---|---|---|
| **Creativity** | 9 | Distinctive, never generic |
| **Variance** | 8 | Offset asymmetric, irregular rhythm |
| **Motion** | 6 | Fluid CSS and spring-physics interpolation |
| **Density** | 5 | Daily-app balanced with high-density telemetry matrices |

Because variance is 8, **centered hero layouts are banned** — force split screen, left-aligned,
or asymmetric whitespace. Because density is 5, cards are permitted where elevation
communicates hierarchy, but high-density telemetry strips use border-top dividers.

---

## 2. Color Palette & Roles

Absolute neutral base with a **single** accent. No warm/cool gray fluctuation — one palette
throughout. **Never pure black**; obsidian is the floor.

| Role | Token | Hex | Used for |
|---|---|---|---|
| **Obsidian Bedrock** | `--color-obsidian` | `#050505` | Primary viewport canvas, the baseline depth without harsh pure-black clipping |
| **Command Slate** | `--color-slate` | `#0f172a` | Elevated surfaces, inset panels, bezel interiors |
| **Glacier Cyan** | `--color-glacier` / `--color-brand` | `#00f2fe` | **The single active accent.** CTAs, active states, focus rings, live telemetry |
| **Glacier Deep** | `--color-glacier-deep` | `#00b4d8` | Hover/pressed accent, depth variation on the accent |
| **Field Ink** | `--color-ink` | `#e8eef2` | Primary text on dark surfaces |
| **Ash Dim** | `--color-ink-dim` | `#a9b8c0` | Secondary text, descriptions, metadata |
| **Frosted Silver** | `--color-silver` | `#d4d4d8` | Tertiary text, axis labels, HUD readouts |
| **Glass Fill** | `--color-glass` | `rgb(255 255 255 / 0.10)` | Translucent panel fill |
| **Glass Border** | `--color-glass-border` | `rgb(255 255 255 / 0.20)` | 1px structural borders on glass |

### Semantic status colors

Not theme tokens — used sparingly for medical/operational state only:

| Color | Hex | Meaning |
|---|---|---|
| **Physiology Green** | `#34d399` | Optimal physiology, verified state |
| **Strain Amber** | `#fbbf24` | Mild hypoxia, caution, winter conditions |
| **Evacuation Rose** | `#fb7185` | Severe AMS, emergency, do-not-ascend |

These form the AMS severity ladder in the acclimatization lab. **Do not extend this palette
further** — three states, not a rainbow.

### Banned colors

- `#000000` pure black in any surface (use `#050505`)
- **Orange `#EA580C`** and Tailwind's `orange-*` palette — banned outright
- **Teal `#14b8a6` / `teal-*`** — a second cyan-family accent, contradicts "single active accent"
- Purple/blue neon, `cyan-*` / `blue-*` stock utilities in place of glacier
- Oversaturated accents of any hue
- Neon or outer-glow shadows on interactive elements

---

## 3. Typography Rules

Three families, each with a defined job. **Inter is banned.** Sans-serif pairings only.

| Role | Font | Token | Weight(s) loaded |
|---|---|---|---|
| **Display** | Space Grotesk | `--font-display` | 400, 600, 700 |
| **Body** | Geist | `--font-body` | 400, 500 |
| **Telemetry mono** | Geist Mono | `--font-mono` | 400 |

- **Display:** Track-tight (`tracking-tight`), controlled scale, hierarchy driven by weight and
  color rather than sheer size. Never screaming.
- **Body:** Relaxed leading, comfortable measure. Applied site-wide via `font-body` on `<body>`.
- **Mono:** Reserved for elevations, coordinates, timestamps, seat counts, financial figures,
  and HUD readouts — the "declassified telemetry" voice. Because density is 5 (not > 7), mono
  is *not* mandatory for all numbers, but any figure that reads as instrument output uses it.
- **Headline scale:** `clamp()` for responsive scaling.
- **Tailwind v4 note:** `--font-display` / `--font-body` / `--font-mono` generate the
  `.font-display` / `.font-body` / `.font-mono` utilities. An unqualified
  `@import "@fontsource/space-grotesk"` **resets Tailwind's theme variables and silently
  breaks all three utilities** — always import per-weight
  (`@fontsource/space-grotesk/400.css`). This caused a real regression; the comment in
  `global.css` records it.

### Banned type

- Inter (any weight, any usage)
- Generic serifs (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`)
- Default system sans for premium contexts
- Arbitrary-value font classes (`font-['Satoshi']`) that bypass the theme

---

## 4. Component Stylings

**Buttons.** Flat fills or glass. Primary = glacier fill with obsidian text. Tactile push
feedback on `:active` via `.btn-tactile` (scale 0.975, 1px translate, `--ease-snappy`).
**No outer glow.** Depth comes from the double-bezel and `.lens-edge` inner highlight, not
from a colored halo. Ghost/outline for secondary, never a competing accent.

**Cards & panels.** The signature move is the **double-bezel** concentric construction:
`.double-bezel-outer` (1.5px skin, `rounded-[24px]`, glass fill, structural border) wrapping
`.double-bezel-inner` (`rounded-[18px]`, slate-tinted glass, backdrop blur). Two nested radii
read as instrument housings rather than generic cards.

**Glass.** `.alpine-glass` / `.glass` for frosted panels with backdrop blur and saturation.
`.glass-refract` applies an SVG displacement filter — **decorative image layers only, never
text** — and fails soft (unfiltered render) where unsupported.

**Inputs.** Label above input, helper text optional, error text below. Focus ring in glacier.
No floating labels.

**Loaders.** **Skeletal, matching the exact layout dimensions being loaded.** Circular spinners
are banned — they signal generic AI scaffolding rather than instrument boot.

**Empty & error states.** Composed, honest compositions. When the basemap cannot load, the map
panel states why and points to the catalog rather than spinning forever. When elevation data
is missing for a trek, the panel says so plainly.

**Telemetry readouts.** `.ping-ring` provides the perpetual 2.4s basecamp pulse on active
instruments. Paired with `prefers-reduced-motion`, which stills every loop.

---

## 5. Layout Principles

- **Grid-first.** CSS Grid over flexbox math. No `calc()` percentage hacks.
- **No centered heroes.** Variance is 8 — force split-screen, left-aligned, or asymmetric
  whitespace.
- **No absolute-positioned content stacking.** Every element occupies its own clean spatial
  zone. Full-bleed photography sits behind a calibrated scrim; text never overlaps it.
- **No 3-equal-card feature rows.** Use 2-column zig-zag, asymmetric grids, or horizontal
  scroll. (Existing `md:grid-cols-3` uses are telemetry strips and footers, which are
  structural dividers rather than feature clichés — acceptable.)
- **Containment.** `max-w-7xl` (or tighter for reading measure) centered containers.
- **Full-height sections** use `min-h-[100dvh]`, never `h-screen` — `h-screen` causes a
  catastrophic jump on iOS Safari.
- **Responsive collapse.** Multi-column → single column below 768px, no exceptions, no
  horizontal overflow. Touch targets ≥ 44px.
- **Spacing.** Vertical section gaps scale via `clamp(3rem, 8vw, 6rem)`.

---

## 6. Motion & Interaction

Spring physics by default. Three easing tokens, all already in `global.css`:

| Token | Curve | Use |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.32, 0.72, 0, 1)` | Panel entrances, weighty reveals |
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 0, 1)` | Button presses, tactile feedback |
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` | Dialog choreography, scrim fades |

- **Perpetual micro-loops** on active instruments: `.ping-ring` (2.4s), and the pulse dot on
  the maps and telemetry bands. Still under `prefers-reduced-motion`.
- **Staggered orchestration.** Entrance cascades via `@starting-style` on dialogs, and
  view-transition fades on route change.
- **Hardware-accelerated only.** Animate `transform` and `opacity` exclusively. Never `top`,
  `left`, `width`, or `height`. Grain and noise filters live on fixed pseudo-elements only.
- **Dialog choreography** uses modern top-layer `transition-behavior: allow-discrete` with
  `::backdrop` scrim choreography, degrading gracefully where unsupported.
- **Route transitions:** `vt-fade-out` / `vt-fade-in` keyframes on view transitions.

---

## 7. Anti-Patterns (Banned)

Explicit NEVER rules. Several of these were real violations found and fixed during the audit
that produced this document — they are listed so they do not return.

### Color
- ❌ Never pure black `#000000` in any surface — obsidian `#050505` is the floor
- ❌ Never orange `#EA580C` or `orange-*`
- ❌ Never teal `#14b8a6` or `teal-*`
- ❌ Never a second cyan-family accent — glacier `#00f2fe` is the *only* active accent
- ❌ Never purple/blue neon, gradient CTAs (`from-[#00f2fe] to-[#14b8a6]`)
- ❌ Never oversaturated accents

### Type
- ❌ Never Inter
- ❌ Never generic serifs (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`)
- ❌ Never default system sans where Space Grotesk / Geist are available
- ❌ Never arbitrary-value font classes that bypass the theme tokens
- ❌ Never an unqualified `@fontsource` import (it resets Tailwind's font theme)

### Structure
- ❌ Never a centered hero layout at this variance
- ❌ No overlapping or absolutely-stacked content
- ❌ Never 3-column equal-card feature rows
- ❌ Never `h-screen` — use `min-h-[100dvh]`
- ❌ Never horizontal overflow on mobile

### Motion & polish
- ❌ **No neon or outer-glow shadows on buttons, CTAs, or panels.** Depth comes from the
  double-bezel and `.lens-edge` inner highlight. (Was present on 4 CTAs; removed.)
- ❌ No generic circular spinners — skeletal loaders matching layout dimensions only
- ❌ Never animate `top`, `left`, `width`, or `height`
- ❌ No `LABEL // YEAR` formatting
- ❌ No custom mouse cursors

### Content & trust
- ❌ No emojis anywhere
- ❌ No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "cutting-edge",
  "world-class", "unparalleled"
- ❌ No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- ❌ **No fabricated data or statistics.** Never invent metrics, uptime, response times, review
  counts, or ratings the agency did not explicitly provide. Use `[metric]` placeholders instead.
- ❌ No fake review/testimonial personas, no `aggregateRating` schema without real reviews
  behind it
- ❌ No generic placeholder names ("John Doe", "Acme", "Nexus")
- ❌ No fake round numbers presented as measurement (`99.99%`, `124ms`)
- ❌ No mock data labelled as live — the weather widget is "Seasonal Reference" precisely
  because its figures are typical ranges, not a sensor feed
- ❌ No broken image links; no `branding artifact` strings left in source
- ❌ No dead code shipped — components that are built but unrendered are either wired in or
  deleted

---

## 8. Where the tokens live

| File | Contents |
|---|---|
| `apps/web/src/styles/global.css` | `@theme` color/font/easing tokens, `@layer utilities` (glass, bezel, scrim, grid, ring), focus-visible, dialog choreography, reduced-motion, view transitions |

When adding a color, font, or easing value, add it to `@theme` and reference the utility — never
inline a literal in a component.
