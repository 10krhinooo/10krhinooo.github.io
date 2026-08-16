# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
npm install
npm run dev          # Vite dev server on :5173
npm run build        # tsc -b && vite build, output in dist/
npm run preview      # serve the production build
npm run typecheck    # tsc --noEmit
```

There is no test runner and no linter configured. `npm run build` is the gate: it typechecks
before bundling, so a broken build fails there.

## Architecture

React 19 + TypeScript + Vite 7 + Tailwind CSS 4, deployed to GitHub Pages by
`.github/workflows/deploy.yml`. Single page, no router.

Data comes from the `portfolio-BE` Spring Boot service (a sibling repository, usually cloned at
`../portfolio-BE`) via `VITE_API_BASE_URL`.

### Non-negotiable: the site must render fully with the API down

The backend sleeps on Railway's free tier. `src/lib/api.ts` never throws and never surfaces an
error state; every fetch degrades to `src/data/fallback.ts` and reports which source was used.
When adding a data-driven section, follow that pattern rather than introducing a loading or error
branch that can leave the page empty.

The one exception is `Activity`, which returns `null` without live GitHub data. Stale repository
data would be worse than an absent section.

### Content is generated, not hand-maintained

`src/data/fallback.ts` is derived from `portfolio-BE/src/main/resources/seed/portfolio.json`, the
single source of truth. Edit the seed JSON, then regenerate the TypeScript so the two cannot
drift. Do not edit `fallback.ts` by hand to add or reword content.

### Section ordering lives in one place

`src/lib/sections.ts` defines the ordered spans. `TraceRail`, `Nav`, `useScrollSpy`, and the
section headers all read from it. Adding a section means adding it there and giving the
`<section>` a matching `id`.

## Styling

Tailwind 4 with a CSS-first config in `src/index.css`. There is no `tailwind.config.ts`.

- Design tokens are CSS custom properties on `:root`, mapped into Tailwind through `@theme`.
- The light palette is the base definition. Dark is redefined twice: under
  `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme='light'])`, and under
  `:root[data-theme='dark']` so an explicit choice wins in both directions. Never give a colour
  its only definition inside a media query.
- `.brut`, `.brut-sm`, `.brut-press`, `.label`, and `.mono` are the shared surface and type
  primitives. Prefer them over reassembling border, shadow, and background utilities.

## Motion rules

1. Scroll reveals use `Reveal`, an IntersectionObserver toggling a CSS class. Do not replace it
   with a JS tween: StrictMode's double-mount cancels mount-triggered animations and strands
   elements at `opacity: 0`, silently hiding content.
2. The hidden start state is scoped to `html.js`, added in `main.tsx`. Content must never be
   invisible on the strength of CSS alone.
3. Motion is used only for scroll-linked transforms (`useScroll` and `useTransform` in
   `ScrollProgress` and `Work`), where its value is real.
4. Percentage translates resolve against the element's own width. `Work` measures pixel distances
   instead, because its lane is many times the viewport width.
5. Every effect must be gated on `useReducedMotion` or neutralised by the global
   `prefers-reduced-motion` block, and must degrade without removing content.

## Accessibility floor

Real `<form>` with labels and an `aria-live` status region, skip link, visible `:focus-visible`
rings, `aria-current` on the active nav link, valid list markup (`Reveal` takes `as="li"` for this
reason), and no horizontal page scroll at any width. Verify at 390px before considering a layout
change done.
