"use client";

import { useSyncExternalStore } from "react";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ui } from "@/i18n/ui";
import { findProduct, localizeCollection, productsIn } from "@/lib/catalog";
import type { Lang, Product } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { external, href, routes } from "@/lib/utils";

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

const priceOf = (label: string) => {
  const n = Number.parseFloat(label.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const money = (n: number) => `$${n.toFixed(2)}`;

/** The link that sells this format: Gumroad opens straight on checkout (?wanted=true), Amazon on the book's page. */
function buyUrl(p: Product): string | null {
  if (!p.url || p.status !== "available") return null;
  if (p.store === "Gumroad") return p.url + (p.url.includes("?") ? "&" : "?") + "wanted=true";
  return p.url;
}

function useIndigo(lang: Lang) {
  const catalog = useCatalog();
  const formats = productsIn(catalog, "indigo", lang).filter((p) => p.status !== "free");
  const live = formats.filter((p) => p.status === "available" && p.url);
  const prices = (list: Product[]) => list.map((p) => priceOf(p.priceLabel)).filter((n): n is number => n !== null);
  const pdf = live.find((p) => p.slug === "indigo-digital");
  const paper = prices(live.filter((p) => p.slug.includes("paperback")));
  const all = prices(live);
  return {
    formats,
    pdfPrice: pdf ? priceOf(pdf.priceLabel) : null,
    paperFrom: paper.length ? Math.min(...paper) : null,
    from: all.length ? Math.min(...all) : null,
  };
}

/** "Digital PDF $17.99 · Paperback from $17.99", from the live catalog. */
export function HeroPrice({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const { pdfPrice, paperFrom } = useIndigo(lang);
  if (pdfPrice === null || paperFrom === null) return null;
  return <p className="hero-price">{t.hero.price(money(pdfPrice), money(paperFrom))}</p>;
}

/** The launch price line, only while FIRSTLIGHT runs. */
export function OfferLine({ lang, className }: { lang: Lang; className?: string }) {
  const t = ui(lang);
  const live = useOfferLive();
  const { pdfPrice } = useIndigo(lang);
  if (!live || pdfPrice === null) return null;
  return <p className={className}>{t.offer(money(Math.round(pdfPrice * 70) / 100))}</p>;
}

/** The INDIGO buy block, right under the hero: what it is, every format with its price and store, one tap to the checkout. */
export function FeaturedJournal({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const { formats } = useIndigo(lang);
  const cover = formats.find((p) => p.slug === "indigo-paperback-color") ?? formats[0];
  if (!cover) return null;
  return (
    <section id="indigo" className="journey-sec journey-sec-tight anchor-sec" aria-labelledby="featured-h" data-sky-stop="0.08">
      <Container>
        <div className="page-k reveal grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <a href={href(lang, routes.collection("indigo"))} className="group mx-auto block w-full max-w-[22rem] lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <div className="frame bg-navy p-3">
              <img
                src={cover.cover.src}
                alt={t.featured.coverAlt}
                width={cover.cover.width}
                height={cover.cover.height}
                loading="lazy"
                className="h-auto w-full transition-transform duration-700 group-hover:-translate-y-1"
              />
            </div>
          </a>

          <div className="flex min-w-0 flex-col gap-9">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">{t.featured.eyebrow}</p>
              <h2 id="featured-h" className="display-1 tracking-[0.12em]">
                INDIGO
              </h2>
              <p className="lede italic text-moon">{cover.subtitle}</p>
              <p className="measure text-ivory/85">{t.featured.p}</p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="eyebrow">{t.featured.choose}</h3>
              <ul className="flex flex-col" role="list">
                {formats.map((p) => {
                  const url = buyUrl(p);
                  const where = p.status === "coming-soon" ? t.featured.comingSoon : p.store ? t.featured.onStore(p.store) : t.status.product[p.status];
                  const row = (
                    <>
                      <span className="font-display text-[1.04rem] tracking-[0.05em] text-ivory group-hover:text-gold">{p.format}</span>
                      <span className="font-display text-[1.04rem] text-moon">{p.priceLabel}</span>
                      <span className="text-[0.95rem] text-lavender">
                        {where}
                        {url ? <span className="sr-only"> {t.newTab}</span> : null}
                      </span>
                      <span aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  );
                  return (
                    <li key={p.slug} data-product={p.slug}>
                      {url ? (
                        <a href={url} className="format-row group" data-track={`${p.slug}:${p.store ?? "store"}`} {...external}>
                          {row}
                        </a>
                      ) : (
                        <a href={href(lang, routes.product(p.slug))} className="format-row group">
                          {row}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <OfferLine lang={lang} className="text-[0.98rem] text-gold" />
              <p className="text-[0.95rem] text-ivory/75">{t.featured.guarantee}</p>
            </div>

            <dl className="grid grid-cols-1 gap-x-10 gap-y-5 min-[480px]:grid-cols-2">
              {t.featured.facts.map((f) => (
                <div key={f.figure} className="flex flex-col gap-1 border-t border-gold/20 pt-4">
                  <dt className="font-display text-[1.35rem] tracking-[0.04em] text-gold">{f.figure}</dt>
                  <dd className="text-[0.98rem] text-ivory/80">{f.label}</dd>
                </div>
              ))}
            </dl>

            <div>
              <ButtonLink href={href(lang, routes.collection("indigo"))} variant="ghost">
                {t.featured.all}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The four collections, each with its own colour and subject, on one page over the sea. The heading sits in the horizon above. */
export function CollectionsPreview({ lang }: { lang: Lang }) {
  const catalog = useCatalog();
  const items = catalog.collections.map((c) => localizeCollection(c, lang));
  return (
    <section className="journey-sec journey-sec-tight" aria-labelledby="collections-h" data-sky-stop="0.64">
      <Container>
        <div className="page-k reveal">
          <CollectionGrid items={items} lang={lang} columns={items.length % 3 === 0 && items.length % 4 !== 0 ? 3 : 4} />
        </div>
      </Container>
    </section>
  );
}

/** 7 Nights, the free sample, low on the page: the soft option for people not ready to buy. */
export function FreeStart({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const seven = findProduct(catalog, "seven-nights", lang);
  if (!seven?.url) return null;
  return (
    <section className="journey-sec journey-sec-tight" aria-labelledby="free-h" data-sky-stop="0.85">
      <Container>
        <div className="page-k reveal grid items-center gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] md:gap-16">
          <div className="frame mx-auto w-full max-w-[15rem] bg-night p-2">
            <img src={seven.cover.src} alt={seven.cover.alt} width={seven.cover.width} height={seven.cover.height} loading="lazy" className="h-auto w-full" />
          </div>
          <div className="flex min-w-0 flex-col gap-5" data-product={seven.slug}>
            <p className="eyebrow">{t.free.eyebrow}</p>
            <h2 id="free-h" className="display-2">
              {t.free.h2}
            </h2>
            <p className="measure text-ivory/85">{t.free.p}</p>
            <p className="italic text-moon">{t.free.sample}</p>
            <div className="mt-2 flex flex-col items-start gap-4 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:gap-6">
              <ButtonLink href={seven.url} variant="ghost" external={t.newTab} track={`${seven.slug}:${seven.store ?? "store"}`}>
                {t.free.primary}
              </ButtonLink>
              <a href={href(lang, routes.product(seven.slug))} className="link-k text-[1rem]">
                {t.free.secondary}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Phones only: a slim bar at the bottom once the hero is gone. public/site.js shows it, and hides it while the buy block, the closing or the footer is on screen. */
export function BuyBar({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const { from } = useIndigo(lang);
  if (from === null) return null;
  return (
    <div className="buy-bar" data-buy-bar>
      <p className="min-w-0">
        <span className="font-display tracking-[0.12em] text-ivory">INDIGO</span>
        <span className="text-ivory/75"> · {t.buyBar.from(money(from))}</span>
      </p>
      <a href="#indigo" className="btn btn-primary btn-sm shrink-0">
        {t.buyBar.cta}
      </a>
    </div>
  );
}
