"use client";

import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { MoonTrack } from "@/components/products/MoonTrack";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ui } from "@/i18n/ui";
import { findProduct, localizeCollection, productsIn } from "@/lib/catalog";
import type { Lang } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { href, routes } from "@/lib/utils";

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

export function FeaturedJournal({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const formats = productsIn(catalog, "indigo", lang).filter((p) => p.status !== "free");
  const cover = formats.find((p) => p.slug === "indigo-paperback-color") ?? formats[0];
  if (!cover) return null;
  return (
    <section className="journey-sec journey-sec-tight" aria-labelledby="featured-h" data-sky-stop="0.8">
      <Container>
      <div className="page-k reveal grid items-start gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <a
          href={href(lang, routes.product(cover.slug))}
          className="group mx-auto block w-full max-w-[24rem] lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]"
        >
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

        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2 id="featured-h" className="display-1 tracking-[0.12em]">
              INDIGO
            </h2>
            <p className="lede italic text-moon">{cover.subtitle}</p>
            <p className="measure text-ivory/85">{t.featured.p}</p>
          </div>

          <dl className="grid grid-cols-1 gap-x-10 gap-y-6 min-[480px]:grid-cols-2">
            {t.featured.facts.map((f) => (
              <div key={f.figure} className="flex flex-col gap-1 border-t border-gold/20 pt-4">
                <dt className="font-display text-[1.45rem] tracking-[0.04em] text-gold">{f.figure}</dt>
                <dd className="text-[0.98rem] text-ivory/80">{f.label}</dd>
              </div>
            ))}
          </dl>

          <MoonTrack lang={lang} filled={4} />

          <div className="flex flex-col gap-5">
            <h3 className="eyebrow">{t.featured.choose}</h3>
            <ul className="flex flex-col" role="list">
              {formats.map((p) => (
                <li key={p.slug}>
                  <a
                    href={href(lang, routes.product(p.slug))}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-t border-gold/15 py-4 text-inherit no-underline last:border-b"
                  >
                    <span className="font-display text-[1.02rem] tracking-[0.05em] text-ivory group-hover:text-gold">{p.format}</span>
                    <span className="font-display text-[1.02rem] text-moon">{p.priceLabel}</span>
                    <span className="text-[0.95rem] text-lavender">
                      {p.status === "coming-soon" ? t.featured.comingSoon : p.store ? t.featured.onStore(p.store) : t.status.product[p.status]}
                    </span>
                    <span aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ButtonLink href={href(lang, routes.collection("indigo"))}>{t.featured.all}</ButtonLink>
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}

export function FreeStart({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const seven = findProduct(catalog, "seven-nights", lang);
  if (!seven?.url) return null;
  return (
    <section className="journey-sec journey-sec-tight" aria-labelledby="free-h" data-sky-stop="0.92">
      <Container>
      <div className="page-k reveal grid items-center gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] md:gap-16">
        <div className="frame mx-auto w-full max-w-[17rem] bg-night p-2">
          <img src={seven.cover.src} alt={seven.cover.alt} width={seven.cover.width} height={seven.cover.height} loading="lazy" className="h-auto w-full" />
        </div>
        <div className="flex min-w-0 flex-col gap-5" data-product={seven.slug}>
          <p className="eyebrow">{t.free.eyebrow}</p>
          <h2 id="free-h" className="display-2">
            {t.free.h2}
          </h2>
          <p className="measure text-ivory/85">{t.free.p}</p>
          <p className="italic text-moon">{t.free.sample}</p>
          <div className="mt-2 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <ButtonLink href={seven.url} external={t.newTab} track={`${seven.slug}:${seven.store ?? "store"}`}>
              {t.free.primary}
            </ButtonLink>
            <ButtonLink href={href(lang, routes.product(seven.slug))} variant="ghost">
              {t.free.secondary}
            </ButtonLink>
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}
