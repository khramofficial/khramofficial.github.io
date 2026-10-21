# Khram website

Live site: **https://khramofficial.github.io** · Admin: **https://khramofficial.github.io/admin/**

Bilingual (English at `/`, Thai at `/th/`) static site for Khram journals, with a Supabase backend for
editing products and an anonymous visit counter.

| Part | Where |
|---|---|
| Code + hosting | GitHub org `khramofficial`, repo `khramofficial.github.io`, GitHub Pages (Actions) |
| Data, admin login, image uploads, stats | Supabase project `hobwlswwwvmfqawdgjip` (account khram.official@gmail.com) |
| Admins | rows in `public.admins` (now: khram.official@gmail.com) |

Khram is fully separate from Ashborne: own Supabase account, own GitHub org.

## How content flows

1. Edit in `/admin/` (sign in with an email link). Saves go straight to Supabase (row-level security: only admins can write).
2. Every page fetches the latest published rows when it opens, so edits show on the next refresh.
3. GitHub Actions rebuilds every 6 hours (and on every push). `npm run prebuild` pulls the catalog into
   `src/data/snapshot.json`, so the HTML Google reads has the latest text and new products get real pages.
   Until then a new product still opens: the 404 page looks the slug up in the live data.
4. If Supabase is empty or unreachable, the site falls back to `src/data/seed.ts`.

Thai text for products and collections lives in the `i18n.th` column; any Thai field left empty falls back to English.
UI words are in `src/i18n/ui.ts`.

## Stats

`public/site.js` sends one row per page view and per buy-button click to the `track()` function:
path, referrer domain, device type, browser language, time zone, `utm_source`, a random visitor id that resets daily.
No cookies, no IP addresses. Visits from the admin's own browser (after logging in) and from bots are not counted.
`admin_stats(days)` (admins only) powers the dashboard.

Tag links you post: `https://khramofficial.github.io/?utm_source=pinterest`.

## Commands

```bash
npm ci
npm run dev          # http://localhost:3000 (admin at /admin/)
npm run check        # typecheck, lint, build, link check
npm run seed:sql     # regenerate supabase/seed.sql from src/data/seed.ts
```

Database: `supabase/migrations/*.sql` (run in order in the Supabase SQL editor). The first admin login on an
empty database copies `seed.ts` into the tables automatically.

## Notes

- GitHub turns off scheduled workflows after 60 days without a commit. If the 6-hour rebuild stops, open
  Actions → Deploy site → Enable / Run workflow.
- Supabase free projects pause after a week with no API traffic; normal site visits keep it awake.
- Supabase's built-in email sender is rate limited (a few login emails per hour). Fine for one admin.
