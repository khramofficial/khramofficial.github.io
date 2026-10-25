# Home page sky-to-sea journey

The home page is one painting seen through a camera that tilts from the night sky down to the sea as you scroll.

## How it works
- `SkyJourney` (`src/components/home/HomeStatic.tsx`) renders the painting inside `.sky`, a fixed layer behind the home page. `.journey` (the home page wrapper) has `clip-path: inset(0)`, so the fixed painting is only visible behind the home sections and never behind the footer.
- The painting is a column `.sky-col` (aspect 2048 × 4332): `sky-top`, `sky-bottom` and `sky-clouds` stacked inside it. On wide screens the column is as wide as the window; on tall screens it is 113.5vh wide (240vh tall) and shifted so the moon and the light on the water stay in view (`--sky-fx`).
- `public/site.js` (last block) moves the column up with `--sky-y`. Every home section has `data-sky-stop` (0 = top of the sky, 1 = deep water). When a section is centred on screen the camera points at that part of the painting; between sections it moves evenly. This keeps each section on the same part of the painting on every screen size, which is what keeps text readable.
- Current stops (order rebuilt for sales on 25 Oct 2026, see "Page order" below): hero 0 · INDIGO buy block 0.08 · See inside 0.16 · Who it's for 0.24 · philosophy 0.32 · story 0.42 · horizon 0.5 (the horizon is at 0.535 of the column) · collections 0.64 · 7 Nights 0.85 · closing 1.
- Text rules: open sky only where the painting is dark enough for ivory (hero with a soft night shadow, closing in deep water) or bright enough for ink (horizon). Everything over mid-tones sits on a night-mist page (`.page-k`): a veil of Night Indigo (80%) on `::before` that blurs the sky a little (14px backdrop blur) and fades out softly over `--feather` (44–96px) past every edge, so pages have no hard box edges (Bank, 25 Oct). Inside the page the veil is fully dark, so text contrast is unchanged. Phones and touch screens skip the live blur (redrawn every frame while the sky moves) and use an 86% veil with a 40px feather.
- The hero shows the product (`/images/products/indigo-hero-books.webp`: the paperback cover with an inside page behind it, shadows baked in, transparent background). The INDIGO moon now sits in the Our Story page and fades into it with a radial mask. On phones and tablets the hero copy sits on a soft night mist, because it runs down over the brighter clouds. The home header loses its bottom line when scrolled and fades into the sky with a short gradient.
- `sky-clouds` drifts sideways (75 s, ±1.4%) over a version of the sky where those clouds were removed, so the clouds move and the stars and moon stay still.
- Reduced motion: no drift, no tilt (the camera stays at the top), no reveals; the horizon and closing text get a journal page so they stay readable over the night sky.

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
- Hero showcase image: `public/images/art/indigo-moon.webp`, the full moon from the INDIGO cover (page 1 of the journal PDF), recomposed with room around it on a matching night sky.

## Replacing the painting
Keep the same layout (sky at the top, horizon a little above the middle of the column, sea below), export the six files at the same widths, and update `aspect-ratio` on `.sky-col`, the `.sky-bottom` top offset (split row ÷ total height) and the horizon stop if the horizon moves.
