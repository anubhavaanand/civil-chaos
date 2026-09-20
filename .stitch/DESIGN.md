# Design System: Dream of The Holy Himalayas

## 1. Visual Theme & Atmosphere
A breathtaking, premium interface that feels like looking through a frosted window at a Himalayan peak. The atmosphere is immersive yet deeply trustworthy.
- **Density:** Daily App Balanced (5)
- **Variance:** Offset Asymmetric (6)
- **Motion:** Fluid CSS with Spring Physics (6)

## 2. Color Palette & Roles
- **Canvas Muted** (#F9FAFB) — Primary background surface when not over an image
- **Pure Surface** (#FFFFFF) — Card and container fill
- **Himalayan Slate** (#0F172A) — Primary text
- **Muted Frost** (#94A3B8) — Secondary text, metadata
- **Glass Border** (rgba(255,255,255,0.2)) — Structural lines for glassmorphism panels
- **Sherpa Orange** (#EA580C) — Single accent for CTAs, active states, and focus rings.

## 3. Typography Rules
- **Display:** Space Grotesk — Track-tight, controlled scale. Hierarchy through weight and color.
- **Body:** Satoshi (Replacing Inter) — Relaxed leading, 65ch max-width.
- **Mono:** JetBrains Mono — For altitude metrics, dates, and pricing numbers.
- **Banned:** Inter (too generic), generic serif fonts, pure black (#000000).

## 4. Component Stylings
* **Buttons:** Flat, tactile -1px translate on active state. Sherpa Orange fill for primary, glass/outline for secondary. No outer glows.
* **Cards:** Glassmorphism (`backdrop-blur-md bg-white/10 border border-white/20`). Mandatory dark scrim (`bg-black/30`) behind glass panels when layered over photos for WCAG contrast. Generously rounded corners (1.5rem).
* **Inputs:** Label above input, helper text optional, error text below.
* **Loaders:** Skeletal shimmer matching layout dimensions. No generic spinners.

## 5. Layout Principles
- No overlapping elements without proper spatial separation.
- Split Screen or Left-Aligned Hero sections. Centered heroes are BANNED.
- Grid-first responsive architecture. Mobile-First Collapse (< 768px) to a single column.
- Contain layouts using max-width constraints (1400px centered).

## 6. Motion & Interaction
- **Spring Physics default:** `stiffness: 100, damping: 20`.
- Staggered Orchestration for trek lists and itineraries.
- Animate exclusively via `transform` and `opacity`.

## 7. Anti-Patterns (Banned)
- No emojis anywhere.
- No pure black (#000000).
- No neon/outer glow shadows.
- No 3-column equal card layouts (use asymmetric grids).
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash").
- No fake round numbers or fabricated data.
