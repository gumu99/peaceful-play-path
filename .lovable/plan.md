# Lumen — Ambient Neon Music Pad

A single, polished, satisfying-music game. You tap, drag, or sweep across a glowing grid; every touch fires a beautiful note that's auto‑tuned to a pleasant scale, so nothing can sound wrong. Visuals bloom and ripple in dark neon. Easy to play, hard to put down.

## Core experience

- A 6×8 grid of glowing pads fills the screen on a deep navy background.
- Each pad plays one note from a curated scale (e.g. C minor pentatonic) — guaranteed to sound musical no matter what you tap.
- Tap = pluck. Hold = sustain with a gentle shimmer. Drag across pads = melodic sweep.
- Pads bloom on touch: neon ring expands, particles drift up, soft bass thump on every tap.
- Subtle ambient pad drone underneath ties everything together.
- An always-on gentle pulse (60–80 bpm) optionally quantizes notes so taps land on the beat — making any rhythm feel intentional.

## Controls / UI (minimal, floating)

- Top-left: app name "Lumen" in thin neon type.
- Bottom floating control bar (auto-hides):
  - Scale picker: Calm (minor pent), Dreamy (major pent), Mystic (Japanese), Warm (lydian)
  - Instrument: Crystal, Bells, Pluck, Pad
  - Tempo slider (affects pulse + delay)
  - Reverb amount slider
  - Quantize toggle
  - Mute / volume
- No score, no timer, no failure state. Just play.

## Visual direction

- Palette: bg `#0B0F1A`, surface `#1B2236`, primary neon violet `#7C5CFF`, accent cyan `#43E8D8`, soft white text.
- Pads use radial gradients with cyan→violet glow; idle state breathes slowly.
- On tap: expanding ring + particle burst + brief screen vignette pulse.
- Background: slow drifting gradient orbs (CSS blur) for ambient depth.
- Typography: Space Grotesk for the wordmark / labels, Inter for controls.
- Motion via framer-motion: spring-based pad scale on tap, ring expansion, particle drift.

## Tech approach

- TanStack Start route at `/` becomes the game (replace placeholder Index).
- Audio: Tone.js — PolySynth + reverb + delay + a soft ambient pad layer. Scales defined as arrays of note names; pad index → note via row/col mapping.
- Pointer handling: a single grid container with `pointerdown` / `pointermove` / `pointerup`; detect pad-under-pointer via `elementFromPoint` so drag-sweep works for both mouse and touch.
- AudioContext starts on first user gesture (required by browsers) — show a soft "Tap anywhere to begin" overlay until then.
- State: local React state + a small Zustand-free reducer for settings; persist settings in `localStorage`.
- All semantic colors added to `src/styles.css` `@theme` tokens; no hardcoded colors in components.

## File plan

- `src/routes/index.tsx` — replace placeholder, render `<Lumen />`, set proper SEO head (title "Lumen — Ambient Music Pad", description, og tags).
- `src/components/lumen/Lumen.tsx` — top-level layout, start overlay, control bar.
- `src/components/lumen/PadGrid.tsx` — grid, pointer handling, drag sweep.
- `src/components/lumen/Pad.tsx` — single pad with bloom + particle effects.
- `src/components/lumen/AmbientBackground.tsx` — drifting gradient orbs.
- `src/components/lumen/ControlBar.tsx` — scale / instrument / sliders / toggles.
- `src/lib/lumen/audio.ts` — Tone.js setup, scales, instrument presets, play/stop helpers.
- `src/lib/lumen/scales.ts` — scale definitions and pad→note mapping.
- `src/styles.css` — add neon tokens (`--neon-violet`, `--neon-cyan`, `--surface`, gradients, glow shadows) mapped in `@theme inline`.
- Install deps: `tone`, `framer-motion`, `@fontsource/space-grotesk`, `@fontsource/inter`.

## Out of scope (v1)

- Recording / exporting loops
- Multiplayer / sharing
- Accounts or saved sessions beyond local settings
- Additional games (single polished game per your choice)

Confirm and I'll build it.
