# Home page (UX Pilot layout, 27 Oct 2026)

Bank's brief (27 Oct): follow his UX Pilot design for desktop and phone (section order, where things sit, links),
use Khram's real data, and blend the old look with the new one.

## Where things are
- `src/views/HomeView.tsx`: section order. Desktop = 1024px (`lg`) and up, the phone layout runs below that.
- `src/components/home/HomeStatic.tsx`: hero, proof strip, platforms bar, who it's for, Why Khram, INDIGO (numbers, inside pages, Acts), From the pages, What Khram believes, FAQ.
- `src/components/home/HomeLive.tsx`: parts that read the live catalog: hero buttons (lowest price), formats (PDF + paperbacks, phone toggle), collections, 7 Nights, tonight's question, phone buy bar, FIRSTLIGHT line (`OFFER_END`, delete after 30 Oct 2026).
- `src/i18n/home.ts`: all home text, EN + TH.
- Header (`Header.tsx`): on the home page the desktop menu jumps to #product, #inside, #collections, #story, #faq and the
  announcement line sits above it; other pages keep the page menu. "Get INDIGO" always goes to the formats (`/#formats`).
- `public/site.js`: buy bar shows after the hero, hides over #formats and the footer.

## Desktop vs phone (from the two UX Pilot screens)
- Desktop only: announcement line, platforms bar, Why Khram (#story, painting card + 3 moon steps), the 3 inside pages,
  collections (#collections) with "Follow Khram on Amazon".
- Phone only: proof strip, one inside overview image, What Khram believes, format toggle, buy bar.

## Real data rules (do not break)
- No ratings, stars, reviews or "most popular" until real ones exist. The design's reviews slot shows real INDIGO prompts ("From the pages").
- Prices, store links and editions come from the catalog (admin). Paperback card lists every live Amazon edition.
- 7 Nights goes to its Gumroad page (no email form: Gumroad collects the email). CRIMSON "waitlist" = follow on Amazon.
- Brand meaning: brand guide section 0. Never the indigo-dye story, "One more dip." or "Made in the dark. Revealed in the light."

## Art
- `public/images/home/`: crops of Bank's sky-to-sea painting (night sky = hero, dawn = Why Khram, horizon = 7 Nights,
  sea = tonight's question). The full painting files and the old fixed-sky scroll were removed with this layout (git history has them).
