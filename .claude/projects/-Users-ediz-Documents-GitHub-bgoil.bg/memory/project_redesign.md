---
name: BG OIL Premium Redesign (Industrial Luxury)
description: Full visual redesign of bgoil.bg to "Industrial Luxury" style with amber/orange theme
type: project
---

Completed a full "Industrial Luxury" premium dark redesign of bgoil.bg.

**Why:** User requested complete aesthetic overhaul — dark premium gas station brand with amber/orange accents instead of the previous red theme.

**How to apply:** These are the foundational design decisions. Do not revert to red colors or generic fonts.

## Design System

- **Primary color**: `#F59E0B` (amber-500) → `#F97316` (orange-500) gradient
- **Background**: `#0A0A0B` (near black)
- **Headings font**: Oswald (condensed, bold, uppercase, letter-spacing: 0.02em)
- **Body font**: DM Sans
- **Monospace font**: JetBrains Mono (prices, stats, times)
- **Grain overlay**: SVG fractalNoise on `body::before` at 4% opacity
- **Custom scrollbar**: 4px amber thumb on dark track

## Key Files Changed

- `app/globals.css` — complete design system (amber palette, grain, Oswald/DM Sans/JetBrains Mono font vars, amber scrollbar)
- `app/layout.tsx` — Oswald + DM_Sans + JetBrains_Mono from `next/font/google`
- `components/Hero.tsx` — amber particles, diagonal geometric lines, stat cards with amber hover, JetBrains Mono numbers
- `components/ServicesSection.tsx` — 12-column bento grid (asymmetric sizes), 9 services hardcoded (not from config), `"use client"` directive
- `components/FuelCard.tsx` — amber CLUB badge, amber/orange/blue color map by fuel type
- `components/Header.tsx` — amber gradient CTA button
- `components/Footer.tsx` — amber gradient separator + ambient glow
- `app/page.tsx` — amber marquee strip styling
