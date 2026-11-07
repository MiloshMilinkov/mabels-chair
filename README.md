# Mabel's Chair

> **⚠️ View only — not open source.**
> This code is public for viewing only. Copying, modifying, deploying, redistributing or reusing any part of it (code, design, texts or branding), or using it to train AI models, is not allowed without written permission. See [LICENSE](LICENSE).

A showcase website for a made-up neighbourhood hair studio and barber, built to show local businesses what their site could look like.

**Live:** https://mabels-chair.milos300399.workers.dev

## What's on the page

- Hero with a lit vanity mirror and a live "open now / closed" badge (Belgrade time)
- Price list for cuts, colour and the barber corner
- Gallery of recent work, team, barber corner and "what a visit feels like"
- Reviews
- Booking request form (demo: nothing is sent) next to address and opening hours, with today highlighted

Plain HTML, CSS and a small script, with no build step. Hosted as static assets on Cloudflare Workers.

## Run locally

```bash
npm install
npm run dev      # http://127.0.0.1:8791
```

## Deploy

```bash
npm run deploy   # wrangler deploy, needs `wrangler login`
```

## Photo credits

Photos in `site/img` are from [Unsplash](https://unsplash.com), used under the Unsplash License. They belong to their photographers and are not covered by this project's licence.

## License

Copyright © 2026 Miloš Milinkov. All rights reserved.

This project is proprietary and **not** open source. No licence is granted to use, copy, modify, deploy or distribute it. See [LICENSE](LICENSE) for the full terms. For permission requests, contact milos300399@gmail.com.

Security issues: see [SECURITY.md](SECURITY.md).
