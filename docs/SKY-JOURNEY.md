# Home page sky-to-sea journey

The home page is one painting seen through a camera that tilts from the night sky down to the sea as you scroll.

## How it works
- `SkyJourney` (`src/components/home/HomeStatic.tsx`) renders the painting inside `.sky`, a fixed layer behind the home page. `.journey` (the home page wrapper) has `clip-path: inset(0)`, so the fixed painting is only visible behind the home sections and never behind the footer.
- The painting is a column `.sky-col` (aspect 2048 × 4332): `sky-top`, `sky-bottom` and `sky-clouds` stacked inside it. On wide screens the column is as wide as the window; on tall screens it is 113.5vh wide (240vh tall) and shifted so the moon and the light on the water stay in view (`--sky-fx`).
- `public/site.js` (last block) moves the column up with `--sky-y`. Every home section has `data-sky-stop` (0 = top of the sky, 1 = deep water). When a section is centred on screen the camera points at that part of the painting; between sections it moves evenly. This keeps each section on the same part of the painting on every screen size, which is what keeps text readable.
- Current stops: hero 0 · philosophy 0.08 · story 0.28 · horizon 0.5 (the horizon is at 0.535 of the column) · collections 0.64 · INDIGO 0.8 · 7 Nights 0.92 · closing 1.
- Text rules: open sky only where the painting is dark enough for ivory (hero with a soft night shadow, closing in deep water) or bright enough for ink (horizon). Everything over mid-tones sits on a night-mist page (`.page-k`): a veil of Night Indigo (80%) on `::before` that blurs the sky a little (14px backdrop blur) and fades out softly over `--feather` (44–96px) past every edge, so pages have no hard box edges (Bank, 25 Oct). Inside the page the veil is fully dark, so text contrast is unchanged. Phones and touch screens skip the live blur (redrawn every frame while the sky moves) and use an 86% veil with a 40px feather.
- The hero moon image fades into the sky with a radial mask (no frame). The home header loses its bottom line when scrolled and fades into the sky with a short gradient.
- `sky-clouds` drifts sideways (75 s, ±1.4%) over a version of the sky where those clouds were removed, so the clouds move and the stars and moon stay still.
- Reduced motion: no drift, no tilt (the camera stays at the top), no reveals; the horizon and closing text get a journal page so they stay readable over the night sky.

## Art
- Source: the sky-to-sea painting Bank supplied on 25 Oct 2026 (1024 × 1536).
- Processing (`journey.py`, kept with the session files): 2× Lanczos upscale + light sharpen; the sea extended downward with perspective-scaled, mirrored copies of the lower water (irregular seams), deepening into Night Indigo; the upper clouds cut into their own layer (alpha) with a cleaned sky underneath; the crescent moon excluded so it never drifts.
- Files in `public/images/sky/`: `sky-top-{d,m}.webp`, `sky-bottom-{d,m}.webp` (top/bottom halves, 2 px overlap), `sky-clouds-{d,m}.webp` (RGBA). `d` = 2048 wide, `m` = 1280 wide (used up to 820 px wide screens).
- Hero showcase image: `public/images/art/indigo-moon.webp`, the full moon from the INDIGO cover (page 1 of the journal PDF), recomposed with room around it on a matching night sky.

## Replacing the painting
Keep the same layout (sky at the top, horizon a little above the middle of the column, sea below), export the six files at the same widths, and update `aspect-ratio` on `.sky-col`, the `.sky-bottom` top offset (split row ÷ total height) and the horizon stop if the horizon moves.
