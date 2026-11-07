# Mabel's Chair (showcase site)

Demo website for a fictional neighbourhood hair studio and barber in Novi Sad. Used as a sales showcase for local-business websites. Proprietary (see LICENSE), owner Miloš Milinkov. Sibling showcase with the same setup: `../CoffeBarShowcase` (Little Fern Coffee).

## Stack

- Plain static site: `site/index.html`, `site/styles.css`, `site/main.js`. No framework, no build step.
- Fonts from Google Fonts: Young Serif (headings, quotes, the "small things" list) and Figtree (everything else).
- Photos: Unsplash, downloaded as WebP into `site/img` (credited in README, footer and LICENSE clause 4). To swap one, fetch `https://images.unsplash.com/photo-<id>?w=900&q=72&fm=webp`.
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`, assets dir `./site`, `404-page` handling).
- Live: https://mabels-chair.milos300399.workers.dev
- Repo: https://github.com/MiloshMilinkov/mabels-chair

## Commands

```bash
npm install        # only dependency is wrangler
npm run dev        # wrangler dev on http://127.0.0.1:8791 (also .claude/launch.json "site")
npm run deploy     # wrangler deploy (wrangler is already logged in on this machine)
```

No tests, lint or typecheck. Verify changes in the browser at desktop and 375px mobile width (no horizontal scroll).

## Layout

```
site/
  index.html   hero (mirror SVG), #prices, #work gallery, #team, barber corner,
               "what a visit feels like", reviews, #book form + #visit info
  styles.css   design tokens on :root, then sections in page order, responsive at the end
  main.js      open-now badge + today's hours row (Europe/Belgrade), mobile nav,
               booking form (client-side validation, demo confirmation, nothing sent)
  404.html     not-found page
  favicon.svg  same arch-mirror mark as the header logo
  img/         Unsplash photos (WebP)
```

## Rules and gotchas

- Opening hours live only in the hours table in `index.html` (`data-days`, `data-open`/`data-close`, or `data-closed`); `main.js` reads them for the open-now badges. Update the visible text in the same row too.
- The booking form never sends anything. The confirmation says so; keep that demo note.
- Keep the demo notice bar and footer credit: they link prospective clients to the portfolio (milos-milinkov.milos300399.workers.dev).
- Design: blush background, plum ink, mulberry primary, mint only for barber things (with the checkered tile strip), brass for the mirror bulbs. Avoid cream + terracotta, all-caps eyebrows and numbered 01/02/03 markers.
- The only automatic motion is the mirror bulbs lighting up on load; it respects `prefers-reduced-motion`.
- `[hidden] { display: none !important }` in the base CSS is needed: `.book-form` is `display: grid`, which otherwise beats the `hidden` attribute.
- The gallery uses `grid-template-areas` (desktop 6 cols, mobile 2 cols); add or remove photos in both layouts.
- After CSS edits the browser pane may serve a cached stylesheet; reload with a cache-busting query.
- Copyright header goes only in `index.html`, `styles.css`, `main.js`.
