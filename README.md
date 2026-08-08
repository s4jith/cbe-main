# Rotaract Club of Coimbatore Gaalaxy — Website

Premium redesign of [rotaractcbegaalaxy.org](https://www.rotaractcbegaalaxy.org/). Full design rationale, content inventory, and page-by-page spec: [DESIGN.md](DESIGN.md).

## Stack

- **Next.js 16** (App Router, ISR) · **Tailwind CSS v4** · **Framer Motion** · **Lenis** smooth scroll
- **Payload CMS 3** on MongoDB + Vercel Blob, admin at [`/admin`](http://localhost:3000/admin)
- All imagery lives in the CMS media library; the seed sources live outside the deployment in [`scripts/seed-assets/`](scripts/seed-assets/)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000 — also pushes schema changes to the database
npm run seed     # fills any empty CMS field with the design default (safe to re-run)
npm run build    # production build
```

`MONGODB_URI`, `PAYLOAD_SECRET` and `BLOB_READ_WRITE_TOKEN` must be set in `.env`.

**`BLOB_READ_WRITE_TOKEN` is not optional in production.** Without it `vercelBlobStorage`
switches off and Payload falls back to local disk, so every upload is served by the
`/api/media/file/…` serverless route instead of the CDN — and wiped on the next deploy.

## Editing the site

Everything visible on the website is editable in the admin — nothing is hardcoded.

| Admin section | What it controls |
|---|---|
| **Pages** → Home, About, Team, Projects, Publications, Contact, Join Us, Blood Donor, 404 | Every headline, eyebrow, paragraph, button, background colour and SEO entry, section by section |
| **Design** → Theme & Colours | The 13-colour brand palette, website font, headline scale, corner rounding, loading screen, selection colours |
| **Design** → Header & Footer | Logo, wordmark, menu links, header button, footer columns, bottom bar |
| **Design** → Shared Sections | The join-us banner and the Four-Way Test, reused across pages |
| **Design** → Site Settings | Club identity, contact details, socials, Google Apps Script form endpoints, prayer text |
| **Content** | Projects, flagship projects, members, voices, publications |
| **Library** | Media uploads |

Conventions worth knowing:

- **Headlines** are authored one line per row; each row is a separately animated line. Wrap words in `*asterisks*` to paint them in the headline's accent colour (`We lead *✦* we rise.`).
- **Colours** are either a brand token (which follows Theme & Colours when it is re-themed) or a literal hex. Blank always means "use the design default".
- **`{tokens}`** in copy fill in from Site Settings — `{name}`, `{parent}`, `{district}`, `{clubId}`, `{group}`, `{chartered}`, `{year}`, and `{count}` on the projects page.
- **Forms** are field-by-field editable: label, data key (the Google Sheet column), type, width, placeholder and dropdown choices.
- **Images** can be uploaded straight off a phone. The media collection caps every stored original at 2000px and re-encodes it to WebP, so a 9 MB camera photo lands as a few hundred KB. Nothing to do by hand.
- Design defaults live in [`src/lib/defaults.ts`](src/lib/defaults.ts); the site renders those whenever a CMS field is left blank.

Saving any change revalidates the whole site immediately (`src/lib/revalidate.ts`); ISR otherwise refreshes every 5 minutes.

## Performance notes

The things that will make this site slow again, in the order they bit last time:

1. **Uncapped images.** The first seed uploaded 107 MB of originals (largest 8.2 MB) into the media library, and the image optimizer had to decode each one on first request. `Media.upload.resizeOptions` now caps this; don't remove it.
2. **Missing `BLOB_READ_WRITE_TOKEN`** — see above; images fall off the CDN.
3. **`searchParams` in a page.** Reading it opts that route out of ISR and puts a cold MongoDB round trip in front of every visit. `/projects` filters on the client for exactly this reason.
4. **`motion.*` instead of `m.*`.** Components use the lightweight `m` primitives under a single `LazyMotion` in [`MotionProvider.tsx`](src/components/MotionProvider.tsx); `strict` mode will throw if a `motion.*` sneaks back in.

`npm run compress:images` regenerates `scripts/seed-assets/` from a folder of new originals (max 2000px, quality 80) before re-seeding.

## Structure

| Route | What |
|---|---|
| `/` | Storytelling one-pager: shrink-fade hero, scroll-jacked project strip, avenue cards, stats odometer, flagship tabs, Four-Way Test, voices, team teaser, CTA |
| `/about` | Story, rotated photo fan, manifesto, timeline, Rotaract Prayer, affiliations |
| `/team` | Board grid + general-member constellation + leadership voices |
| `/projects` | All projects, filterable by avenue (`?avenue=club\|community\|professional\|international\|district`) |
| `/publications` | Newsletter shelf + scrapbooks, tilt-hover covers → PDFs |
| `/join`, `/blood-donor`, `/contact` | Forms posting to the club's Google Apps Script endpoints (honeypot preserved) |

## Notes

- Forms POST cross-origin to Google Apps Script; success is assumed on fetch resolve (same behavior as the old site).
- `prefers-reduced-motion` disables smooth scroll, reveals, and scroll-jacked sections site-wide.
- After changing any collection or global config, run `npm run generate:types` (and `npm run generate:importmap` if admin components changed).
