# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # webpack dev server (memory-limited to 2GB)
npm run dev:turbo    # turbopack dev server (faster HMR)
npm run build        # production build — run before pushing
npm run lint         # ESLint v9
```

No test suite is configured. Verify changes with `npm run build`.

## Architecture

### Data Flow

All data fetching is done in **async Server Components** only. There is no client-side data fetching, no `useEffect` API calls, and no API routes serving data.

```
Page (async Server Component)
  └─ getXYZ() from app/lids/
       ├─ microcms.ts  → MicroCMS REST API
       └─ github.ts    → GitHub GraphQL API
  └─ passes data as props to presentational components
```

### Data Layer (`app/lids/`)

- `microcms.ts` — All MicroCMS calls. Uses `customRequestInit: { next: { revalidate: N } }` for per-call ISR control. Default revalidation is `REVALIDATE_SECONDS = 60`. Draft preview disables caching with `revalidate: 0`.
- `github.ts` — Fetches contribution calendar via GraphQL. Requires `GITHUB_TOKEN`; returns `null` silently if missing (UI falls back to a chart image).
- `utils.ts` — Date formatting only (dayjs, Asia/Tokyo timezone).
- `constants/index.ts` — Pagination limits: `TOP_NEWS_LIMIT=5`, `NEWS_LIST_LIMIT=10`, `MEMBERS_LIST_LIMIT=100`.

### Server vs. Client Components

- Pages and data-fetching components are **Server Components** (no directive needed).
- Add `"use client"` only when component needs `useState`/`useEffect`/browser APIs.
- `ContributionSection` is the primary example: receives calendar data as props from a Server Component parent, uses `useState` for year toggle.

### MicroCMS Content Types

- `News` — Blog articles; detail pages at `/news/[slug]`
- `Work` — Portfolio projects; fields are confusingly named `name1` (title), `name2` (image), `name3` (description)
- `Profile` — Single-object endpoint; has a `DEFAULT_PROFILE` fallback hardcoded in `microcms.ts`
- `Member`, `Category` — Supporting types

HTML content from MicroCMS rich-text is sanitized with `sanitize-html` in `Article` before `dangerouslySetInnerHTML`.

### ISR / Caching

Each page exports `export const revalidate = N`. Missing export means Next.js default (cache indefinitely). Draft preview uses `?dk=DRAFT_KEY` query param and sets `revalidate: 0`.

### Styling

Tailwind CSS v4 + CSS Modules. Each component folder has an `index.module.css`. Use `classnames` library for conditional class merging. Do not add global styles to `globals.css` for component-specific styles.

## Required Environment Variables

```
MICROCMS_SERVICE_DOMAIN=   # required in production
MICROCMS_API_KEY=           # required in production
GITHUB_USERNAME=            # defaults to mazikaru492
GITHUB_TOKEN=               # optional; enables detailed contribution graph
```

See `.env.example` for the full template. Without MicroCMS vars, the site throws at runtime.

## Key Gotchas

- Two Next.js config files exist: `next.config.mjs` (active) and `next.config.ts` (unused). Edit only `next.config.mjs`.
- `app/contect/` is a typo of `contact/` — both exist; don't delete either without checking routes.
- `app/actions/` directory exists but is currently empty (no Server Actions implemented yet).
- MicroCMS images must be in `remotePatterns` in `next.config.mjs` (already configured for `images.microcms-assets.io`).
