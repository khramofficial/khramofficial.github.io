"use client";

import { type CSSProperties, useSyncExternalStore } from "react";
import { ExternalMark } from "@/components/ui/Button";
import { homeText } from "@/i18n/home";
import { ui } from "@/i18n/ui";
import { findProduct, localizeCollection, productsIn } from "@/lib/catalog";
import type { Lang, Product } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { cn, external, href, routes } from "@/lib/utils";
import { Icon } from "./Icon";

/* Parts of the home page that read the live catalog (prices, store links, collections), so an edit in the admin shows on the next visit. */

/** FIRSTLIGHT (30% off the INDIGO PDF) ends 30 Oct 2026, 23:59 Pacific time. Lines that mention it disappear on their own after that. */
const OFFER_END = Date.parse("2026-10-31T06:59:59Z");
const noSubscribe = () => () => {};

/** True while the launch offer runs. The static HTML never includes it, so an expired offer can't flash on screen. */
function useOfferLive() {
  return useSyncExternalStore(
    noSubscribe,
    () => Date.now() < OFFER_END,
    () => false,
  );
}

const priceOf = (p: Product | undefined) => {
  if (!p) return null;
  const n = typeof p.price === "number" ? p.price : Number.parseFloat(p.priceLabel.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const money = (n: number) => `$${n.toFixed(2)}`;

/** The link that sells this format: Gumroad opens straight on checkout (?wanted=true), Amazon on the book's page. */
function buyUrl(p: Product | undefined): string | null {
  if (!p?.url || p.status !== "available") return null;
  if (p.store === "Gumroad") return p.url + (p.url.includes("?") ? "&" : "?") + "wanted=true";
  return p.url;
}

/** "Paperback · Full color" → "Full color" (the edition part of the format name). */
const edition = (p: Product) => p.format.split("·").pop()?.trim() || p.format;

function useIndigo(lang: Lang) {
  const catalog = useCatalog();
  const live = productsIn(catalog, "indigo", lang).filter((p) => p.status === "available" && p.url);
  const pdf = live.find((p) => p.store === "Gumroad");
  const papers = live
    .filter((p) => p.store === "Amazon")
    .sort((a, b) => (priceOf(b) ?? 0) - (priceOf(a) ?? 0)); // Full Color first
  const prices = live.map(priceOf).filter((n): n is number => n !== null);
  const paperPrices = papers.map(priceOf).filter((n): n is number => n !== null);
  return {
    pdf,
    papers,
    pdfPrice: priceOf(pdf),
    paperFrom: paperPrices.length ? Math.min(...paperPrices) : null,
    from: prices.length ? Math.min(...prices) : null,
  };
}

/** The launch price line, only while FIRSTLIGHT runs. */
export function OfferLine({ lang, className }: { lang: Lang; className?: string }) {
  const live = useOfferLive();
  const { pdfPrice } = useIndigo(lang);
  if (!live || pdfPrice === null) return null;
  return <p className={className}>{homeText(lang).offer(money(Math.round(pdfPrice * 70) / 100))}</p>;
}

/** Hero buttons: one to the formats, one to the free sample. */
export function HeroActions({ lang }: { lang: Lang }) {
  const h = homeText(lang).hero;
  const { from } = useIndigo(lang);
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-9">
      <a href="#formats" className="btn btn-primary btn-lg group shadow-[0_12px_40px_-12px_rgba(217,181,132,0.7)]">
        {from !== null ? h.primary(money(from)) : homeText(lang).buyBar.cta}
        <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </a>
      <a href="#free-sample" className="btn btn-ghost btn-lg">
        <Icon name="moon" className="h-3.5 w-3.5" />
        {h.secondary}
      </a>
    </div>
  );
}

/**
 * The two stores, each one tap to INDIGO there: Gumroad → the PDF checkout, Amazon → the paperback.
 * Logos: files Bank supplied (27 Oct) in public/images/stores/. Gumroad = round "G" mark beside the name;
 * Amazon = its wordmark (already says "amazon"), recoloured to Soft Ivory with the orange arrow kept so it reads on the dark bar.
 */
function useStores(lang: Lang) {
  const t = homeText(lang).platforms;
  const { pdf, papers } = useIndigo(lang);
  const paper = papers[0];
  const list: { name: string; url: string | null; track: string; label: string; logo: { src: string; w: number; h: number }; wordmark: boolean }[] = [
    { name: "Gumroad", url: buyUrl(pdf), track: `${pdf?.slug ?? "indigo-digital"}:Gumroad`, label: t.gumroad, logo: { src: "/images/stores/gumroad.png", w: 112, h: 112 }, wordmark: false },
    { name: "Amazon", url: paper?.url ?? null, track: `${paper?.slug ?? "indigo-paperback"}:Amazon`, label: t.amazon, logo: { src: "/images/stores/amazon.png", w: 300, h: 91 }, wordmark: true },
  ];
  return list.filter((s) => s.url);
}

/** Where checkout happens, with a link straight to each store. One row on desktop, stacked on phones. */
export function Platforms({ lang }: { lang: Lang }) {
  const t = homeText(lang).platforms;
  const nt = ui(lang).newTab;
  const stores = useStores(lang);
  return (
    <section aria-label={t.label} className="mt-10 border-y border-gold/10 bg-navy/60 lg:mt-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-[0.95rem] text-ivory/70 sm:px-8 lg:flex-row lg:gap-5 lg:py-5">
        <span className="eyebrow text-[0.7rem] text-gold">{t.label}</span>
        <ul className="flex items-center gap-8 lg:gap-10" role="list">
          {stores.map((s) => (
            <li key={s.name}>
              <a href={s.url ?? "#"} data-track={s.track} title={s.label} className="store-link group" {...external}>
                {s.wordmark ? (
                  <img src={s.logo.src} alt={s.name} width={s.logo.w} height={s.logo.h} className="store-wordmark h-[2rem] w-auto lg:h-[2.25rem]" />
                ) : (
                  <>
                    <img src={s.logo.src} alt="" width={s.logo.w} height={s.logo.h} className="h-10 w-10 lg:h-11 lg:w-11" />
                    <span className="font-body text-[1.5rem] leading-none text-ivory/85 transition-colors group-hover:text-gold lg:text-[1.65rem]">{s.name}</span>
                  </>
                )}
                <Icon name="external" className="h-3.5 w-3.5 text-ivory/40 transition-colors group-hover:text-gold" />
                <span className="sr-only">
                  {s.label} {nt}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <span className="flex items-center gap-2 text-center">
          <Icon name="lock" className="h-3.5 w-3.5 shrink-0 text-moon" />
          {t.note}
        </span>
      </div>
    </section>
  );
}

/** Phones: who makes it, under the hero (desktop shows the same line inside the hero). */
export function ProofStrip({ lang }: { lang: Lang }) {
  const t = homeText(lang).hero;
  return (
    <div className="mx-5 mt-2 flex items-center gap-3 rounded-2xl border border-ivory/5 bg-navy/70 px-4 py-3.5 sm:mx-8 lg:hidden">
      <img src="/images/brand/khram-badge.webp" alt="" width={56} height={56} className="h-9 w-9 shrink-0 rounded-full" />
      <div className="min-w-0 text-[0.85rem] leading-snug">
        <div className="font-display tracking-[0.12em] text-gold uppercase">{t.maker}</div>
        <div className="text-ivory/65">{t.makerSub}</div>
      </div>
    </div>
  );
}

/** Choose your format: the PDF (Gumroad) and the paperbacks (Amazon). Side by side on desktop, stacked on phones. */
export function Formats({ lang }: { lang: Lang }) {
  const t = homeText(lang);
  const f = t.formats;
  const nt = ui(lang).newTab;
  const { pdf, papers, pdfPrice, paperFrom } = useIndigo(lang);
  const pdfUrl = buyUrl(pdf);

  return (
    <section id="formats" className="home-band border-y border-gold/10 scroll-mt-16" aria-labelledby="formats-h">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3 text-moon lg:mb-4">{f.eyebrow}</p>
          <h2 id="formats-h" className="h-sec">
            {f.h2[0]}
            <span className="text-gold lg:text-gold">{f.h2[1]}</span>
          </h2>
          <p className="mt-4 text-[1.02rem] text-ivory/70 lg:text-lg">{f.p}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-6">
          {/* PDF: dark edition */}
          <div id="format-pdf" data-product={pdf?.slug} className="relative flex flex-col rounded-3xl border-2 border-moon/70 bg-night p-5 sm:p-8">
            <span className="absolute -top-3.5 left-6 rounded-full bg-moon px-3.5 py-1 font-display text-[11px] font-semibold tracking-[0.15em] text-night uppercase sm:left-8">{f.pdf.badge}</span>
            <div className="relative mt-2 overflow-hidden rounded-2xl bg-navy">
              <img src="/images/products/indigo-digital-hero.webp" alt={f.pdf.imgAlt} width={1280} height={720} loading="lazy" className="aspect-video h-auto w-full object-cover" />
            </div>
            <div className="mt-6 flex items-start justify-between gap-4 lg:mt-7">
              <div>
                <h3 className="font-display text-[1.6rem] font-semibold tracking-[0.06em]">{f.pdf.title}</h3>
                <p className="mt-1 text-[0.95rem] text-ivory/65">{f.pdf.sub}</p>
              </div>
              {pdfPrice !== null ? (
                <div className="text-right">
                  <div className="font-display text-4xl text-gold">{money(pdfPrice)}</div>
                  <div className="text-sm italic text-ivory/55">{f.pdf.once}</div>
                </div>
              ) : null}
            </div>
            <OfferLine lang={lang} className="mt-3 text-[0.98rem] text-moon" />
            <ul className="mt-5 flex-1 space-y-3 text-[1.02rem] text-ivory/90 lg:text-[1.06rem]" role="list">
              {f.pdf.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-moon" />
                  {b}
                </li>
              ))}
              <li className="flex gap-3">
                <Icon name="shield" className="mt-1.5 h-4 w-4 shrink-0 text-moon" />
                <strong className="font-bold text-ivory">{f.pdf.guarantee}</strong>
              </li>
            </ul>
            {pdfUrl && pdf ? (
              <a href={pdfUrl} className="btn btn-primary btn-lg mt-8 w-full" data-track={`${pdf.slug}:Gumroad`} {...external}>
                {f.pdf.cta}
                <ExternalMark label={nt} />
              </a>
            ) : null}
          </div>

          {/* Paperback: rice paper */}
          <div id="format-paper" className="on-paper relative flex flex-col rounded-3xl p-5 sm:p-8">
            <span className="absolute -top-3.5 left-6 rounded-full bg-ink px-3.5 py-1 font-display text-[11px] font-semibold tracking-[0.15em] text-rice uppercase sm:left-8">{f.paper.badge}</span>
            <div className="paper-stage relative mt-2 flex aspect-video items-center justify-center overflow-hidden rounded-2xl">
              <img src="/images/products/indigo-paperback-cover.webp" alt={f.paper.imgAlt} width={1000} height={1499} loading="lazy" className="relative h-[86%] w-auto -rotate-3 rounded-[3px] shadow-[0_24px_40px_-18px_rgba(6,15,36,0.75)]" />
              <span aria-hidden="true" className="ruled-light absolute bottom-[9%] right-[12%] aspect-[2/3] w-[19%] rotate-6 rounded-sm bg-rice shadow-xl ring-1 ring-faded-gold/30" />
            </div>
            <div className="mt-6 flex items-start justify-between gap-4 lg:mt-7">
              <div>
                <h3 className="font-display text-[1.6rem] font-semibold tracking-[0.06em]">{f.paper.title}</h3>
                <p className="mt-1 text-[0.95rem] text-ink/70">{f.paper.sub}</p>
              </div>
              {paperFrom !== null ? (
                <div className="text-right">
                  <div className="text-sm italic text-ink/60">{f.paper.from}</div>
                  <div className="font-display text-4xl">{money(paperFrom)}</div>
                </div>
              ) : null}
            </div>
            <ul className="mt-5 flex-1 space-y-3 text-[1.02rem] text-ink/90 lg:text-[1.06rem]" role="list">
              {f.paper.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-faded-gold" />
                  {b}
                </li>
              ))}
              <li className="flex gap-3">
                <Icon name="gift" className="mt-1.5 h-4 w-4 shrink-0 text-faded-gold" />
                {f.paper.gift}
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              {papers.map((p, i) => (
                <a
                  key={p.slug}
                  href={p.url ?? "#"}
                  data-product={p.slug}
                  data-track={`${p.slug}:Amazon`}
                  className={cn("btn btn-lg w-full", i === 0 ? "btn-primary" : "btn-ghost")}
                  {...external}
                >
                  {f.paper.cta(edition(p))} · {p.priceLabel}
                  <ExternalMark label={nt} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div id="guarantee" className="mt-5 flex items-center gap-4 rounded-2xl border border-moon/30 bg-moon/[0.06] p-5 text-left sm:p-8 lg:mt-8 lg:gap-6 lg:rounded-3xl">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-moon/60 lg:h-24 lg:w-24">
            <span className="font-display text-2xl leading-none text-moon lg:text-4xl">14</span>
            <span className="font-display text-[8px] tracking-[0.25em] text-moon uppercase lg:text-[10px]">{f.guarantee.days}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[1.05rem] font-semibold leading-snug tracking-[0.02em] lg:text-2xl">
              {f.guarantee.h}
            </h3>
            <p className="mt-1.5 text-[0.9rem] text-ivory/70 lg:mt-2 lg:text-base">
              {f.guarantee.p}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The four collections (desktop). Colour, status and text come from the catalog. */
export function Collections({ lang }: { lang: Lang }) {
  const t = homeText(lang).collections;
  const tu = ui(lang);
  const catalog = useCatalog();
  const items = catalog.collections.map((c) => localizeCollection(c, lang));
  return (
    <section id="collections" className="home-band scroll-mt-16 border-y border-gold/10" aria-labelledby="collections-h">
      <div className="mx-auto max-w-7xl py-14 lg:px-8 lg:py-28">
        <div className="max-w-2xl px-5 sm:px-8 lg:px-0">
          <p className="eyebrow mb-4 text-moon">{t.eyebrow}</p>
          <h2 id="collections-h" className="h-sec">
            {t.h2}
          </h2>
          <p className="mt-4 text-[1.02rem] text-ivory/70 lg:text-lg">{t.p}</p>
        </div>
        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0" role="list">
          {items.map((c) => {
            const isLive = c.status === "available";
            return (
              <li key={c.slug} className="w-[66%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
                <a
                  href={isLive ? "#formats" : href(lang, routes.collection(c.slug))}
                  className={cn("group relative block aspect-[3/4] overflow-hidden rounded-2xl text-ivory no-underline", isLive ? "ring-2" : "ring-1 ring-white/10")}
                  style={{ "--accent": c.accent.text, ...(isLive ? { "--tw-ring-color": "color-mix(in oklab, var(--accent) 70%, transparent)" } : {}) } as CSSProperties}
                >
                  {c.swatch.src ? (
                    <img src={c.swatch.src} alt={c.swatch.alt} width={c.swatch.width} height={c.swatch.height} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
                  <span aria-hidden="true" className="coll-moon" />
                  <span className="chip absolute left-4 top-4" data-status={c.status}>
                    {tu.status.collection[c.status]}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex flex-col p-5">
                    <span className="text-sm" style={{ color: "var(--accent)" }}>
                      {c.theme}
                    </span>
                    <span className="font-deco text-[1.75rem] tracking-[0.05em] text-ivory">{c.name}</span>
                    <span className="mt-1 text-[0.95rem] italic leading-snug text-ivory/75">{c.summary}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        {catalog.settings.amazonAuthor ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 px-5 text-center sm:flex-row sm:gap-4">
            <span className="italic text-ivory/70">{t.followQ}</span>
            <a href={catalog.settings.amazonAuthor} className="btn btn-ghost" {...external}>
              {t.follow}
              <ExternalMark label={tu.newTab} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** 7 Nights in INDIGO, the free sample. */
export function FreeSample({ lang }: { lang: Lang }) {
  const t = homeText(lang).free;
  const tu = ui(lang);
  const catalog = useCatalog();
  const seven = findProduct(catalog, "seven-nights", lang);
  if (!seven?.url) return null;
  return (
    <section id="free-sample" className="scroll-mt-16 px-5 py-14 sm:px-8 lg:py-28" aria-labelledby="free-h">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-ivory/10 bg-gradient-to-br from-navy via-[#0b1736] to-night lg:grid-cols-2 lg:rounded-[32px] lg:border-gold/15 lg:bg-navy">
        <div className="order-last p-6 sm:p-12 lg:order-first lg:p-16" data-product={seven.slug}>
          <p className="eyebrow mb-3 text-moon lg:mb-4">
            {t.eyebrow}
          </p>
          <h2 id="free-h" className="font-display text-[1.85rem] font-semibold leading-tight tracking-[0.02em] sm:text-4xl">
            {t.h2[0]}
            <span className="text-gold">{t.h2[1]}</span>
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-ivory/80 lg:mt-5 lg:text-lg">{t.p}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-8">
            <a href={seven.url} className="btn btn-primary btn-lg" data-track={`${seven.slug}:Gumroad`} {...external}>
              {t.cta}
              <ExternalMark label={tu.newTab} />
            </a>
            <a href={href(lang, routes.product(seven.slug))} className="link-k self-center text-[1rem]">
              {t.secondary}
            </a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-[0.85rem] text-ivory/55 sm:justify-start">
            <Icon name="lock" className="h-3.5 w-3.5" />
            {t.note}
          </p>
        </div>
        <div className="relative min-h-[240px] lg:min-h-[340px]">
          <img src="/images/home/horizon.webp" alt={t.imgAlt} width={1000} height={750} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-gold/20 bg-night/85 p-4 backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5">
            <div className="font-display text-[11px] tracking-[0.25em] text-gold uppercase">{t.night}</div>
            <div className="mt-1 text-lg italic leading-snug sm:text-xl">{t.q}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tonight's question, over the sea from Bank's painting. */
export function FinalCta({ lang }: { lang: Lang }) {
  const t = homeText(lang).final;
  const nt = ui(lang).newTab;
  const { pdf, papers, pdfPrice } = useIndigo(lang);
  const pdfUrl = buyUrl(pdf);
  const paper = papers[0];
  return (
    <section id="final-cta" className="relative overflow-hidden" aria-labelledby="final-h">
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/home/sea-m.webp" />
        <img src="/images/home/sea-d.webp" alt="" width={1920} height={1078} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-night via-night/30 to-night" />
      <div className="relative mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 lg:min-h-[600px] lg:py-24">
        <p className="eyebrow text-moon">{t.eyebrow}</p>
        <h2 id="final-h" className="mt-3 font-body text-[2.1rem] italic leading-tight text-ivory sm:text-6xl lg:mt-5">
          {t.quote}
        </h2>
        <p className="mt-4 text-[0.95rem] text-ivory/80 lg:mt-6 lg:text-lg">
          {t.p}
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:mt-10">
          {pdfUrl && pdf && pdfPrice !== null ? (
            <a href={pdfUrl} className="btn btn-primary btn-lg" data-track={`${pdf.slug}:Gumroad`} {...external}>
              {t.pdf(money(pdfPrice))}
              <ExternalMark label={nt} />
            </a>
          ) : null}
          {paper?.url ? (
            <a href={paper.url} className="btn btn-ghost btn-lg bg-night/60" data-track={`${paper.slug}:Amazon`} {...external}>
              {t.paper}
              <ExternalMark label={nt} />
            </a>
          ) : null}
        </div>
        <p className="mt-5 flex items-center gap-2 text-[0.95rem] text-ivory/65">
          <Icon name="shield" className="h-4 w-4 text-moon" />
          {t.guarantee}
        </p>
      </div>
    </section>
  );
}

/** Phones and tablets: a slim "Get INDIGO" bar. public/site.js shows it once the hero is gone and hides it over the formats and the footer. */
export function BuyBar({ lang }: { lang: Lang }) {
  const t = homeText(lang).buyBar;
  const { from } = useIndigo(lang);
  if (from === null) return null;
  return (
    <div className="buy-bar" data-buy-bar>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm tracking-[0.12em] text-gold">{t.name}</div>
        <div className="truncate text-[0.82rem] text-ivory/65">{t.sub(money(from))}</div>
      </div>
      <a href="#formats" className="btn btn-primary btn-sm shrink-0">
        {t.cta}
      </a>
    </div>
  );
}
