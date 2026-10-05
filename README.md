# Verstappen — fan concept

An experimental, editorial single-page website dedicated to Max Verstappen: oversized type, telemetry-inspired details and scroll-driven motion.

> **Unofficial fan-made concept. Not affiliated with Max Verstappen, Red Bull Racing or Formula 1.**
> Created by Willian Minatto for portfolio and educational purposes. Licensed helmet images are attributed in `IMAGE_CREDITS.md` and `/credits`. The six local photographs have source/license pending confirmation and are not cleared for publication.

**Status:** visual integration in progress; publication remains pending confirmation of photograph sources and licenses.

## Stack

- [Next.js](https://nextjs.org) (App Router) · React · TypeScript (strict)
- Tailwind CSS v4
- GSAP + ScrollTrigger (`@gsap/react`) for motion
- Lenis for smooth scrolling, driven by the GSAP ticker

## Running

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Purpose                      |
| ------------------- | ---------------------------- |
| `npm run build`     | Production build             |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | `tsc --noEmit`               |
| `npm run test`      | Unit tests (Vitest)          |
| `npm run format`    | Prettier                     |
| `npm run check`     | lint, typecheck, test, build |

## Structure

```
src/
  app/         layout, page, global styles, icon
  sections/    one file per page section (Hero, Driver, Timeline, …)
  components/  layout/ (header, preloader, scroll, reveals) · ui/ (art, type helpers)
  data/        all editable content
  lib/         GSAP setup, small utilities, f1/ (season data)
```

## Live season data

The strip under the hero (next race, championship position, last result) is filled automatically from [Jolpica F1](https://api.jolpi.ca/docs/), a public API that needs no key. The season is whatever the API reports as `current`; nothing in the code names a year.

- **Dynamic:** next race (name, circuit, place, date and UTC time, round), Max's position, points and wins in the standings, and his most recent result.
- **Local:** career totals in `src/data/stats.ts`, and all other content.
- **Cache:** requests are made on the server only and reused for 30 minutes through Next.js revalidation (`src/lib/f1/config.ts`), so visits never hit the API directly.
- **Fallback:** every request has a 6 s timeout and may fail on its own. A part that cannot be loaded shows a short notice; if nothing loads the strip is left out. The build does not depend on the API being reachable.

The layer lives in `src/lib/f1` (client → normalisation → service) and is covered by `npm test`.

## Editing content

Everything editable lives in `src/data`:

- `stats.ts` — career figures. They change every race weekend: update `value` and `asOf` together.
- `driver.ts` — driver facts and racing numbers; the number marked `current` drives the hero numeral.
- `timeline.ts`, `onTrack.ts`, `beyond.ts`, `legacy.ts`, `helmets.ts` — section content.
- `media.ts` — every image slot. Set `src` to a file in `public/images` to replace a generated art plate with a real image (rendered through `next/image`). Only use assets you have the rights to.
