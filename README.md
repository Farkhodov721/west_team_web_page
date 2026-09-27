# BlockVision — team website

Website for **BlockVision**, WIUT Hackathon 2026 (Computer Vision track): a
rule-based traffic-violation detection system for fixed CCTV intersections.
This repo is the marketing/report site only — it does not contain the CV
pipeline itself.

Live routes: `/` `/team` `/approach` `/eda` `/results` `/demo` `/report`

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (CSS-first config, see `src/app/globals.css`)
- [shadcn/ui](https://ui.shadcn.com) components (`src/components/ui/`)
- [framer-motion](https://www.framer.com/motion/) for reveal/entrance animations
- [recharts](https://recharts.org) for the `/eda` and `/results` charts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server hot-reloads on save.

Other scripts:

```bash
npm run build   # production build — run this before pushing to catch type errors
npm run start   # serve the production build locally
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                  one folder per route (App Router)
    layout.tsx          root layout: fonts, <Nav>, global providers
    globals.css         design tokens (colors, fonts) as CSS variables
    page.tsx            home
    team/  approach/  eda/  results/  demo/  report/
  components/
    ui/                 shadcn primitives (button, card, sheet, etc.)
    eda/, results/      section-specific building blocks for those pages
    icons/              inline SVG icons not covered by lucide-react
    Nav.tsx             shared site nav (desktop + mobile sheet menu)
  lib/
    eventColors.ts      the 14 event classes -> status-color mapping,
                         shared by /eda and /results so colors stay consistent
    utils.ts            cn() classname helper
```

## Design system

Dark theme by default (`.dark` class is forced in `layout.tsx`). Key tokens
live in `src/app/globals.css`:

- **Status colors** — `text-status-{green,red,orange,gray,cyan}` /
  `bg-status-*`. These mirror the CV pipeline's own overlay colors and are
  the single source of truth for "what does this color mean" across the
  site (see `src/lib/eventColors.ts` for the event-class mapping).
- **Fonts** — `font-heading` (Chakra Petch, display/headings), `font-sans`
  (Inter, body copy), `font-mono` (JetBrains Mono, technical labels/data).
  All three are loaded via `next/font` in `layout.tsx`.
- **Nav** — `src/components/Nav.tsx`, shared across every route, with a
  mobile hamburger (shadcn `Sheet`).

## Content status — what's real vs. placeholder

The CV pipeline this site describes lives in a separate repo. As of now:

- `/team` and `/approach` — real content, pulled from the pipeline's own
  README (roles, pipeline stages, model licenses).
- `/eda` and `/results` — **placeholder data.** No sample videos,
  predictions, or evaluation numbers exist in this repo yet. Every chart
  and figure on these two pages is clearly labeled "placeholder data" in
  the UI and has a `// TODO` comment in code saying exactly what real
  artifact should replace it (e.g. `samples/`, `predictions_samples.json`).
  Search the codebase for `TODO` to find every one of these spots.
- `/demo` and `/report` — not yet built (still stub pages).

When real pipeline output becomes available, drop annotated clips into
`public/results/` — `src/components/results/ClipMedia.tsx` checks for them
at runtime and swaps out the placeholder automatically, no code change
needed.

## Notes for contributors

- This repo also contains an unrelated `main.py` / `pyproject.toml` —
  leftover PyCharm boilerplate, not part of the site. Ignore it.
- `.idea/` is gitignored; don't commit local IDE config.
- Run `npm run build` before pushing — it catches type errors that
  `next dev` won't.
