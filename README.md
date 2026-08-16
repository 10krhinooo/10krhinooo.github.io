# 10krhinooo.github.io

Personal portfolio for Victor Kimanga, backend software developer in Nairobi.

A React single page app served from GitHub Pages, backed by the
[portfolio-BE](https://github.com/10krhinooo/portfolio-BE) API for content, live GitHub data,
contact delivery, and analytics.

Live at <https://10krhinooo.github.io>

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (CSS-first `@theme` config) |
| Animation | Motion for scroll-linked transforms, CSS keyframes for reveals |
| Hosting | GitHub Pages via GitHub Actions |

## Getting started

```bash
npm install
cp .env.example .env.local     # optional, see Configuration
npm run dev                    # http://localhost:5173
```

Other scripts:

```bash
npm run build        # typecheck then production build into dist/
npm run preview      # serve the production build
npm run typecheck    # tsc --noEmit
```

## Configuration

One environment variable, read at build time:

```
VITE_API_BASE_URL=https://portfolio-be-production-dd7f.up.railway.app
```

Leave it unset to run purely on bundled content. For local full stack work, run portfolio-BE and
point at `http://localhost:8083`.

In CI the value comes from the repository variable `VITE_API_BASE_URL`
(Settings, Secrets and variables, Actions, Variables).

## The site works with the API down

This is a deliberate constraint, not a fallback that happens to exist. The backend sleeps on
Railway's free tier, so `src/data/fallback.ts` ships a complete copy of the content and every
request degrades to it silently. The hero status line reports which source is live rather than
hiding the difference.

`src/data/fallback.ts` is generated from the backend's `src/main/resources/seed/portfolio.json`,
which is the single source of truth for content. When that file changes, regenerate this one so
the two cannot drift.

The GitHub activity section has no bundled equivalent, because stale repository data would be
worse than none. It removes itself when the API is unreachable.

## Layout

```
index.html                 Entry shell, fonts, and the blocking theme script
public/                    favicon, robots.txt, sitemap.xml, .nojekyll
src/
  App.tsx  main.tsx  index.css
  components/
    layout/    Nav, Footer, ScrollProgress, TraceRail
    sections/  Hero, Skills, Work, Activity, Journey, Contact
    ui/        Reveal, SectionHeader, Tag, Marquee
  hooks/       useTheme, useContent, useScrollSpy, useMediaQuery, useReducedMotion
  lib/         api.ts, sections.ts, cn.ts
  data/        fallback.ts
  types/       index.ts
```

`src/lib/sections.ts` defines the page's spans once. The trace rail, the nav, and every section
header read from it, so the ordering cannot get out of sync.

## Design notes

The page presents itself as a system under observation, which is the one honest way to show
backend work that is otherwise invisible.

- **Trace rail.** A fixed distributed-trace waterfall marks progress through the page. Each
  section is a span. Shown from `xl` up, where there is a real gutter for it.
- **Live status line.** The hero prints the actual result of the page's own `GET /api/content`
  call, including latency. It is a measurement, not a claim.
- **Neo-brutalist surfaces.** Hard 2px borders, solid offset shadows, near-zero radius, no
  gradients or blur.
- **Palette.** Cobalt and signal orange on bone grey, inverted for dark. Borrowed from
  observability tooling rather than the terminal green that backend portfolios default to.
- **Type.** Archivo at the widest point of its variable width axis for display, Instrument Sans
  for body, JetBrains Mono for data and labels.

Theme follows the system preference until the visitor chooses, then persists in `localStorage`.
A blocking script in `index.html` applies it before first paint so the page never flashes.

### Motion

Scroll reveals are an IntersectionObserver toggling a CSS class, not a JS tween. React's
StrictMode double-mount cancels mount-triggered tweens and can strand elements at `opacity: 0`,
silently hiding content. The hidden start state is also scoped to `html.js`, which the app adds on
mount, so a failed bundle leaves the page fully readable instead of blank.

Every effect is dropped under `prefers-reduced-motion: reduce`. The pinned horizontal work section
falls back to a plain vertical grid below `1024px` and for reduced-motion visitors, with no content
removed.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`.

Pages must be set to **Settings, Pages, Source: GitHub Actions**. Deploying from a branch will not
work, since the published site is a build artifact rather than the repository contents.
