# Rotaract Club of Coimbatore Gaalaxy — Website

Premium redesign of [rotaractcbegaalaxy.org](https://www.rotaractcbegaalaxy.org/). Full design rationale, content inventory, and page-by-page spec: [DESIGN.md](DESIGN.md).

## Stack

- **Next.js 15** (App Router, SSG) · **Tailwind CSS v4** · **Framer Motion** · **Lenis** smooth scroll
- Content lives as typed data modules in [`content/`](content/) — projects, members, publications, site identity.
- All imagery mirrored from the current production site into [`public/images/`](public/images/) with clean names.

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (all pages static except /projects)
```

## Structure

| Route | What |
|---|---|
| `/` | Storytelling one-pager: shrink-fade hero, scroll-jacked project strip, avenue cards, stats odometer, flagship tabs, Four-Way Test, voices, team teaser, CTA |
| `/about` | Story, rotated photo fan, manifesto, timeline, Rotaract Prayer, affiliations |
| `/team` | Board 2025–26 grid + general-member constellation + leadership voices |
| `/projects` | All 70 projects, filterable by avenue (`?avenue=club\|community\|professional\|international\|district`) |
| `/publications` | Newsletter shelf (11 editions) + scrapbooks (5 years), tilt-hover covers → PDFs |
| `/join`, `/blood-donor`, `/contact` | Forms posting to the club's existing Google Apps Script endpoints (honeypot preserved) |

## Notes

- Publication PDFs still link to the old site's hashed assets — copy them into `public/pdfs/` before the old deployment is retired (see DESIGN.md §Open Questions).
- Forms POST cross-origin to Google Apps Script; success is assumed on fetch resolve (same behavior as the old site).
- `prefers-reduced-motion` disables smooth scroll, reveals, and scroll-jacked sections site-wide.
