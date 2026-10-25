# Home page sky-to-sea journey

The home page is one painting seen through a camera that tilts from the night sky down to the sea as you scroll.

## How it works (light theme since 25 Oct 2026 10:30)
- Bank, 25 Oct 10:08: the dimmed sections were hard to read; make the whole page bright like the painting. So the camera now stays inside the bright band of the painting (dawn clouds → horizon → sunlit water) and all text is ink.
- `SkyJourney` (`src/components/home/HomeStatic.tsx`) renders the painting inside `.sky`, a fixed layer behind the home page. `.journey` has `clip-path: inset(0)`, so the painting only shows behind the home sections, never behind the footer.
- The painting is a column `.sky-col` (aspect 2048 × 4332): `sky-top`, `sky-bottom` and `sky-clouds` stacked inside it. Its width is `max(100%, 113.5vh) × --sky-zoom`.
- `public/site.js` (journey block): `BAND_TOP 0.27` – `BAND_BOTTOM 0.64` of the column is the bright band (measured: mean brightness ≥ ~120/255). It zooms the column so the band is at least 1.25 screens tall (`--sky-zoom`), then moves it (`--sky-y`) only inside the band. Every section has `data-sky-stop` (0 = top of the band, 1 = bottom); between sections it moves evenly. CSS fallback before the script runs: zoom 1.15, top of the band.
- Current stops: hero 0 · INDIGO buy block 0.08 · See inside 0.16 · Who it's for 0.24 · philosophy 0.32 · story 0.42 · horizon 0.5 · collections 0.64 · 7 Nights 0.85 · closing 1.
- Colours: inside `.journey` (and the home header and phone buy bar) the light-on-dark tokens are flipped to ink versions (`--color-ivory` → #1b2547, `--color-moon` → #6b4716, `--color-gold` → #5a3a0e deep antique gold, `--color-lavender` → #5a4776), so every utility class reads on light without touching components. Main buttons become ink with rice text; ghost buttons get a light fill; collection theme colours are mixed 50% with ink; eyebrows are semi-bold. Text has a soft light halo (`--halo`).
- No boxes behind text. While a reading section (`.page-k` or the closing) is on screen, a light morning haze (`.sky::after`, rice 60% centre / 40% edges) rises with `opacity: var(--sky-dim)`, set by `site.js` from how much of the screen those sections fill; between sections and at the horizon it clears. The hero has its own soft light behind the copy (full-width band on phones/tablets).
- Product pictures have no frame, only a soft shadow. The INDIGO moon beside Our Story is cut out of its night sky with a soft warm glow (`/images/art/indigo-moon-soft.webp`, transparent, 880 × 880). The home header is light (rice, blurred when scrolled; dark again while the phone menu is open). The closing fades into the dark footer over its last 5rem.
- `sky-clouds` drifts sideways (75 s, ±1.4%) over a version of the sky where those clouds were removed.
- Reduced motion: no drift, no tilt (the camera stays at the top of the band), no reveals; the haze stays on at 60%.

## Page order (conversion plan, 25 Oct 2026)
1. Hero: tagline as the small line, a headline that says what it is and who it's for, the price line (from the live catalog), ONE main button "Get INDIGO" (scrolls to the buy block), "See inside", a trust row of true facts, and the FIRSTLIGHT line.
2. INDIGO buy block (`#indigo`): every format links straight to its store in a new tab. The PDF goes to Gumroad checkout (`?wanted=true`, FIRSTLIGHT applied there), paperbacks to Amazon. Clicks are tracked with `data-track`.
3. See inside (`#inside`): four real pages from the PDF (pages 6, 10, 11 and 50, rendered at 640 × 967).
4. Who it's for, then philosophy, story, horizon, collections, 7 Nights free (now a quiet ghost button), closing ("Get INDIGO" main, 7 Nights as a text link).
- FIRSTLIGHT lines (hero + buy block) show only until 30 Oct 2026 23:59 PDT (`OFFER_END` in `HomeLive.tsx`). They are never in the static HTML, so an expired offer can't flash; delete the code after the offer ends.
- Phones: a slim "INDIGO · from $17.99 · Get INDIGO" bar (`BuyBar`, outside `.journey` because `.journey` clips fixed children). `site.js` shows it once the hero has gone and hides it while the buy block, the closing or the footer is on screen, or the menu is open.
- No reviews, badges or sales numbers until real ones exist (FTC fake-review rule, Amazon rules, Khram's honesty rule).

## Art
- Source: the sky-to-sea painting Bank supplied on 25 Oct 2026 (1024 × 1536).
- Processing (`journey.py`, kept with the session files): 2× Lanczos upscale + light sharpen; the sea extended downward with perspective-scaled, mirrored copies of the lower water (irregular seams), deepening into Night Indigo; the upper clouds cut into their own layer (alpha) with a cleaned sky underneath; the crescent moon excluded so it never drifts.
- Files in `public/images/sky/`: `sky-top-{d,m}.webp`, `sky-bottom-{d,m}.webp` (top/bottom halves, 2 px overlap), `sky-clouds-{d,m}.webp` (RGBA). `d` = 2048 wide, `m` = 1280 wide (used up to 820 px wide screens).
- Moon image beside Our Story: `public/images/art/indigo-moon.webp`, the full moon from the INDIGO cover (page 1 of the journal PDF), recomposed on a matching night sky; shown as a circle.

## Replacing the painting
Keep the same layout (sky at the top, horizon a little above the middle of the column, sea below), export the six files at the same widths, and update `aspect-ratio` on `.sky-col`, the `.sky-bottom` top offset (split row ÷ total height), `BAND_TOP`/`BAND_BOTTOM` in `site.js` (re-measure where the painting is bright) and the CSS fallback offset (BAND_TOP × 4332/2048).
