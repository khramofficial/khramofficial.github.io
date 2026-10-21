# Khram website — launch checklist

Built 21 Oct 2026. Facts on the site were checked against the live Gumroad listings, the live Amazon page (B0HNKH2M57) and the Khram project docs on that date.

## 1. Artwork still needed

| Where | Now | Needed |
|---|---|---|
| Home hero, Our Story banner | Text-free crops of the INDIGO cover (1000 px wide, from the Amazon image) | Optional: the original art file at 2000+ px for sharper large screens |
| INDIGO digital gallery | Gumroad cover images (1280 × 720) | Optional: a few single-page images (tracker, a prompt page, a letter page) at ~1600 px |
| Black & White paperback | Uses the colour cover only | 1–2 pages from the B&W interior (white writing panel) so buyers see the difference |
| CRIMSON | Generated lac-red cloth texture + stitched thread/moon motif | Cover art and 2–3 interior pages once the Canva build is done |
| SAFFRON, EBONY | Generated cloth textures + stitched motifs | Real paintings when these collections start (brand guide §2 subjects) |
| Logo | Gumroad avatar file (badge on cream, 400 px) | Badge master PNG (~3000 px, indigo on black) for the footer and favicon |
| Link preview (Open Graph) | `opengraph-image.jpg` from the INDIGO Gumroad hero | Fine as is; optional 1200 × 630 made in Canva with the wordmark |

Art rule (brand guide §5): no text baked into images; keep text in HTML.

## 2. Business details to confirm

- [ ] **Contact email** shown on the site: `khram.official@gmail.com`. This is also the Amazon/KDP sign-in email. Change it any time in Admin → ตั้งค่าเว็บ.
- [ ] **Domain**: live at https://khramofficial.github.io. For a custom domain: add it in the repo's Settings → Pages, update `SITE_ORIGIN` in `src/lib/config.ts`, and the Site URL + redirect URL in Supabase → Authentication → URL Configuration.
- [ ] **B&W paperback price** shows `$17.99` (the price saved in KDP). Confirm before it goes live, then add the Amazon link in Admin → สินค้า.
- [ ] **CRIMSON** copy says “planned in three Acts: The Pull, The Knot and The Steady Hand” and lists planned contents from manuscript v1. Edit if the plan changes.
- [ ] **SAFFRON / EBONY** themes are from the brand guide roadmap with “no release date”. Remove them from the site if you'd rather not show unreleased collections yet.
- [ ] **Instagram / Pinterest**: not linked because the accounts aren't set up yet. Add them in Admin → ตั้งค่าเว็บ when they are.
- [ ] Discount codes (FIRSTLIGHT, SEVENNIGHTS) are intentionally not shown on the site.

## 3. Test checklist

Run `npm run check` first (typecheck, lint, build, link check). Then by hand:

**Phone (375–430 px)**
- [ ] No sideways scrolling on any page
- [ ] Menu button opens and closes the menu; Escape closes it; tapping a link closes it
- [ ] Hero text and buttons fit; buttons are full width and easy to tap
- [ ] Collection cards, product cards and the dye steps read well in one column
- [ ] Product gallery thumbnails switch the main image

**Tablet (768–1024 px)**
- [ ] Header shows the full navigation, no Menu button
- [ ] Grids show 2 columns without a lonely last card

**Desktop (1280 px+)**
- [ ] INDIGO cover on the home page stays in view while scrolling the INDIGO section
- [ ] FAQ topic links jump to each group

**Every page**
- [ ] One heading at the top, correct browser tab title
- [ ] Keyboard: Tab shows a visible gold focus ring; “Skip to content” appears first
- [ ] All Gumroad / Amazon / TikTok links open the right page in a new tab
- [ ] Prices match Gumroad and Amazon on the day you launch

**Routes**
- [ ] `/`, `/collections/`, `/collections/indigo/`, `/collections/crimson/`, `/collections/saffron/`, `/collections/ebony/`
- [ ] `/products/indigo-digital/`, `/products/indigo-paperback-color/`, `/products/indigo-paperback-bw/`, `/products/seven-nights/`, `/products/crimson-workbook/`
- [ ] `/our-story/`, `/faq/`, `/contact/`, `/privacy/`, and a wrong address shows the “page isn't here” page
- [ ] The same pages under `/th/`; the language switch keeps you on the same page
- [ ] `/admin/`: sign in, edit a product, refresh the public page and see the change

Last automated run (21 Oct 2026): 34 pages built (EN + TH + admin); admin tested against a mocked backend (stats, product and collection editors, settings save); live-data fallback for new products tested.

Earlier run: 18 pages built; 0 broken links or images; no horizontal overflow at 390 px or 1440 px; no console errors; mobile menu, gallery, FAQ, copy button and no-JavaScript fallback checked with Playwright.
