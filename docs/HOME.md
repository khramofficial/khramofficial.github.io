# Home page (UX Pilot layout, 27 Oct 2026)

Bank's brief (27 Oct): follow his UX Pilot design for desktop and phone (section order, where things sit, links),
use Khram's real data, and blend the old look with the new one.

## Where things are
- `src/views/HomeView.tsx`: section order (same on every screen). Desktop layout = 1024px (`lg`) and up.
- `src/components/home/HomeStatic.tsx`: hero, who it's for, Why Khram, INDIGO (numbers, inside pages, Acts), From the pages, FAQ.
- `src/components/home/HomeLive.tsx`: parts that read the live catalog: hero buttons (lowest price), store bar + phone store strip (logos Bank supplied, `public/images/stores/`), formats (PDF + paperbacks), collections, 7 Nights, tonight's question, phone buy bar, FIRSTLIGHT line (`OFFER_END`, delete after 30 Oct 2026).
- `src/i18n/home.ts`: all home text, EN + TH.
- Header (`Header.tsx`): on the home page the desktop menu jumps to #product, #inside, #collections, #story, #faq and the
  announcement line sits above it; other pages keep the page menu. "Get INDIGO" always goes to the formats (`/#formats`).
- `public/site.js`: buy bar shows after the hero, hides over #formats and the footer.

## Phones = same content as desktop (Bank, 27 Oct 05:36: "always")
Every section, line and link on the desktop home is on the phone home too. Only the layout differs: stacked
columns (both format cards one under the other), swipe rows (who it's for, inside pages, from the pages,
collections), the "Made by Khram" strip under the hero (desktop has it inside the hero), and the slim buy bar.
Our Story, the FAQ answer "What does Khram mean?" and the emotional-healing-journal guide use the same words as
the home "Why Khram" (Bank's own text, 27 Oct). Check: a script compared the visible text of all 39 pages at
1440 px and 390 px (EN + TH) on 27 Oct: identical. When the desktop text changes, the
phone shows the same text automatically (one string per line in `src/i18n/home.ts`, no phone-only versions).

## Real data rules (do not break)
- No ratings, stars, reviews or "most popular" until real ones exist. The design's reviews slot shows real INDIGO prompts ("From the pages").
- Prices, store links and editions come from the catalog (admin). Paperback card lists every live Amazon edition.
- 7 Nights goes to its Gumroad page (no email form: Gumroad collects the email). CRIMSON "waitlist" = follow on Amazon.
- Brand meaning: brand guide section 0. Never the indigo-dye story, "One more dip." or "Made in the dark. Revealed in the light."

## Art
- `public/images/home/`: crops of Bank's sky-to-sea painting (night sky = hero, dawn = Why Khram, horizon = 7 Nights,
  sea = tonight's question). The full painting files and the old fixed-sky scroll were removed with this layout (git history has them).
