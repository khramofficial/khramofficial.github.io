"use client";

import type { CSSProperties } from "react";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { Swatch } from "@/components/collections/Swatch";
import { BuyBox } from "@/components/products/BuyBox";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { ui } from "@/i18n/ui";
import { findCollection, findProduct, localizeCollection, localizeProduct, productsIn } from "@/lib/catalog";
import type { Lang } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { href, routes } from "@/lib/utils";

export function CollectionsView({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const collections = catalog.collections.map((c) => localizeCollection(c, lang));
  const onSale = catalog.products.filter((p) => p.status === "available" || p.status === "free").map((p) => localizeProduct(p, lang));
  return (
    <>
      <PageIntro eyebrow={t.collectionsPage.title} title={t.collectionsPage.h1}>
        <p>{t.collectionsPage.p}</p>
      </PageIntro>
      <section className="section" aria-label={t.collectionsPage.title}>
        <Container>
          <CollectionGrid items={collections} lang={lang} headingLevel={2} />
        </Container>
      </section>
      {onSale.length > 0 ? (
        <section className="band-navy section" aria-labelledby="now-h">
          <Container>
            <div className="mb-12 flex flex-col gap-4">
              <p className="eyebrow">{t.collectionsPage.readyEyebrow}</p>
              <h2 id="now-h" className="display-2">
                {t.collectionsPage.readyH2}
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3" role="list">
              {onSale.map((p) => (
                <li key={p.slug} className="min-w-0">
                  <ProductCard product={p} lang={lang} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}

export function CollectionView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const collection = findCollection(catalog, slug, lang);
  if (!collection) return <Missing lang={lang} />;
  const items = productsIn(catalog, collection.slug, lang);
  const others = catalog.collections.filter((c) => c.slug !== collection.slug).map((c) => localizeCollection(c, lang));
  const c = t.collectionPage;

  return (
    <div style={{ "--accent": collection.accent.text } as CSSProperties}>
      <section className="border-b border-gold/10" aria-labelledby="collection-h">
        <Container className="flex flex-col gap-8 pb-14 pt-10 md:pb-16 md:pt-12">
          <Breadcrumbs items={[{ label: t.productPage.journals, href: href(lang, routes.collections) }, { label: collection.name }]} />
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div className="frame mx-auto w-full max-w-[30rem] p-2">
              <Swatch collection={collection} priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <div className="flex min-w-0 flex-col gap-7">
              <div className="flex flex-col gap-4">
                <p className="text-[1rem] text-lavender">{c.collection}</p>
                <h1 id="collection-h" className="display-1 tracking-[0.12em]">
                  {collection.name}
                </h1>
                <p className="eyebrow" style={{ color: "var(--accent)" }}>
                  {collection.theme}
                </p>
              </div>
              <div>
                <span className="chip" data-status={collection.status}>
                  {t.status.collection[collection.status]}
                </span>
              </div>
              <div className="measure flex flex-col gap-4 text-ivory/90">
                <p className="lede">{collection.summary}</p>
                {collection.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
              <dl className="grid gap-5 border-t border-gold/15 pt-6">
                <div className="flex flex-col gap-1.5">
                  <dt className="eyebrow">{c.art}</dt>
                  <dd className="text-[0.98rem] text-ivory/85">{collection.art}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="section" aria-labelledby="items-h">
        <Container>
          <h2 id="items-h" className="display-2 mb-12">
            {items.length > 0 ? c.inCollection(collection.name) : c.empty}
          </h2>
          {items.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 min-[520px]:grid-cols-2 lg:grid-cols-4" role="list">
              {items.map((p) => (
                <li key={p.slug} className="min-w-0">
                  <ProductCard product={p} lang={lang} collection={collection} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="frame flex max-w-3xl flex-col gap-6 bg-navy/50 px-6 py-8 sm:px-10 sm:py-10">
              <p className="lede">{c.emptyLead(collection.name)}</p>
              <p className="text-ivory/80">{c.emptyP}</p>
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
                <ButtonLink href={href(lang, routes.collection("indigo"))}>{c.seeIndigo}</ButtonLink>
                {catalog.settings.amazonAuthor ? (
                  <ButtonLink href={catalog.settings.amazonAuthor} variant="ghost" external={t.newTab}>
                    {c.followAmazon}
                  </ButtonLink>
                ) : null}
                {catalog.settings.tiktok ? (
                  <ButtonLink href={catalog.settings.tiktok} variant="ghost" external={t.newTab}>
                    TikTok
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          )}
        </Container>
      </section>

      {collection.slug === "indigo" ? (
        <section className="band-navy section" aria-labelledby="inside-h">
          <Container className="flex flex-col gap-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div className="flex flex-col gap-4">
                <p className="eyebrow">{c.insideEyebrow}</p>
                <h2 id="inside-h" className="display-2">
                  {c.insideH2}
                </h2>
              </div>
              <p className="measure text-ivory/85">{c.insideP}</p>
            </div>
            <div className="frame bg-night p-2 sm:p-3">
              <img src="/images/products/indigo-inside.webp" alt={c.insideAlt} width={1280} height={720} loading="lazy" className="h-auto w-full" />
            </div>
          </Container>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section className="section border-t border-gold/10" aria-labelledby="others-h">
          <Container>
            <h2 id="others-h" className="eyebrow mb-10">
              {c.others}
            </h2>
            <CollectionGrid items={others} lang={lang} columns={others.length === 3 ? 3 : 4} />
          </Container>
        </section>
      ) : null}
    </div>
  );
}

export function ProductView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = ui(lang);
  const catalog = useCatalog();
  const product = findProduct(catalog, slug, lang);
  const collection = product ? findCollection(catalog, product.collection, lang) : undefined;
  if (!product || !collection) return <Missing lang={lang} />;

  const sameCollection = productsIn(catalog, product.collection, lang).filter((p) => p.slug !== product.slug);
  const related =
    sameCollection.length > 0
      ? sameCollection
      : productsIn(catalog, "indigo", lang).filter((p) => p.status === "available" || p.status === "free");
  const useSwatch = product.status === "in-progress" && (product.gallery.length === 0 || product.gallery.every((g) => g.src.includes("/swatches/")));

  return (
    <div style={{ "--accent": collection.accent.text } as CSSProperties}>
      <section className="border-b border-gold/10" aria-labelledby="product-h">
        <Container className="flex flex-col gap-8 pb-16 pt-10 md:pt-12">
          <Breadcrumbs
            items={[
              { label: t.productPage.journals, href: href(lang, routes.collections) },
              { label: collection.name, href: href(lang, routes.collection(collection.slug)) },
              { label: product.slug === "seven-nights" ? "7 Nights" : product.format },
            ]}
          />
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            {useSwatch ? (
              <div className="frame mx-auto w-full max-w-[30rem] p-2">
                <Swatch collection={collection} priority sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            ) : (
              <ProductGallery images={product.gallery.length ? product.gallery : [product.cover]} label={`${product.name}, ${product.format}`} lang={lang} />
            )}
            <div className="flex min-w-0 flex-col gap-7">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">
                  {collection.name} · {product.format}
                </p>
                <h1 id="product-h" className="display-1 tracking-[0.06em]">
                  {product.name}
                </h1>
                <p className="lede italic text-moon">{product.subtitle}</p>
              </div>
              <p className="text-[1.1rem] text-ivory/90">{product.summary}</p>
              <BuyBox product={product} lang={lang} amazonAuthor={catalog.settings.amazonAuthor} />
              <div className="flex flex-col gap-4 text-ivory/85">
                {product.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
              <p className="text-[0.92rem] italic text-lavender">{t.notTherapy}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section" aria-label={t.productPage.details}>
        <Container>
          <ProductDetails product={product} lang={lang} />
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="band-navy section" aria-labelledby="related-h">
          <Container>
            <h2 id="related-h" className="display-2 mb-12">
              {sameCollection.length > 0 ? t.productPage.moreFrom(collection.name) : t.productPage.availableNow}
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3" role="list">
              {related.slice(0, 3).map((p) => (
                <li key={p.slug} className="min-w-0">
                  <ProductCard product={p} lang={lang} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </div>
  );
}

export function Missing({ lang }: { lang: Lang }) {
  const t = ui(lang).notFound;
  return (
    <section className="section">
      <Container narrow className="flex flex-col items-start gap-6">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display-1">{t.h1}</h1>
        <p className="lede text-ivory/85">{t.p}</p>
        <div className="flex flex-col gap-3 min-[420px]:flex-row">
          <ButtonLink href={href(lang, routes.home)}>{t.home}</ButtonLink>
          <ButtonLink href={href(lang, routes.collections)} variant="ghost">
            {t.journals}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
