# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenFlux is a French-language RSS feed aggregator built with **Astro 5** and deployed on **Netlify**. It aggregates ~40 tech RSS feeds (blogs + podcasts) into a static site with client-side search and filtering. Site: `https://flux.erwancodes.me`.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on localhost:4321 |
| `npm run build` | Production build → `./dist/` |
| `npm run preview` | Preview production build |
| `npm run fetch-feeds` | Fetch RSS articles → `/data/*.json` |

No test framework or linter is configured. Node 22 is used in CI and Netlify.

## Architecture

**Data pipeline:** `feeds.yaml` → `scripts/fetch-feeds.ts` (rss-parser + retry logic) → monthly JSON files in `/data/` → Astro static build → Netlify deploy.

**Key flow:** GitHub Actions runs `fetch-feeds` daily at 4 UTC, commits new data files to `data/`, then Netlify auto-rebuilds on push.

**Frontend:** Static HTML with client-side JS for Fuse.js search, category/source/type filtering, and pagination (15 articles/page). Uses Tailwind CSS v4 (via Vite plugin) and Astro View Transitions (`ClientRouter`).

**Feed types:** Feeds can be `blog` (default) or `podcast`. Podcasts have `audioUrl` and `duration` fields. Image extraction differs for podcasts (uses `itunes:image` instead of enclosure).

## Key Files

- `feeds.yaml` — RSS source definitions with categories and optional `type: podcast`
- `scripts/fetch-feeds.ts` — Aggregation script (dedup via SHA256 URL hash, image extraction, date filtering with `MIN_DATE`)
- `src/utils/articles.ts` — Article loading (`import.meta.glob`), search, categorization, pagination utilities
- `src/types/index.ts` — TypeScript interfaces (Article, FeedConfig, MonthlyData, FeedType)
- `src/pages/index.astro` — Main page with article list
- `src/pages/page/[page].astro` — Static pagination pages
- `src/pages/article/[id].astro` — Dynamic article detail (noindex)
- `src/pages/rs.astro` — Tweet generation tool (Gemini API, localStorage cache for API key and tweets)
- `src/pages/rss.xml.ts` — Outbound RSS feed (50 latest articles)
- `src/pages/search-index.json.ts` — JSON search index for Fuse.js

## Conventions

- All UI text is in French
- Path alias: `@/*` maps to `src/*`
- TypeScript strict mode enabled
- Articles are deduplicated by SHA256 hash of URL (first 12 chars)
- Data files are organized monthly: `/data/YYYY-MM.json` — these are committed to git
- Article pages have `noindex` meta; sitemap excludes `/article/` and `/page/` routes
- Categories: `Programmation`, `IA`, `DevOps`, `Cybersécurité`, `Cloud`, `Web`, `Robotique`, `Vibe Coding`
- Adding a new feed: edit `feeds.yaml`, run `npm run fetch-feeds`, then build
