"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { ui } from "@/i18n/ui";
import { findCollection, findProduct } from "@/lib/catalog";
import { useCatalog, useCatalogReady } from "@/lib/useCatalog";
import { langFromPath } from "@/lib/utils";
import { CollectionView, Missing, ProductView } from "@/views/CatalogViews";

/*
 * GitHub Pages serves this page for any address it has no file for.
 * Products and collections added in the admin after the last build don't have a file yet,
 * so this page looks them up in the live catalog and shows them. The next build turns them into real pages.
 */
const noop = () => () => {};

export default function NotFound() {
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => null,
  );
  const catalog = useCatalog();
  const ready = useCatalogReady();
  const lang = path ? langFromPath(path) : "en";
  const match = path?.match(/^(?:\/th)?\/(products|collections)\/([a-z0-9-]+)\/?$/);
  const kind = match?.[1];
  const slug = match?.[2] ?? "";
  const product = kind === "products" ? findProduct(catalog, slug, lang) : undefined;
  const collection = kind === "collections" ? findCollection(catalog, slug, lang) : undefined;

  useEffect(() => {
    if (product) document.title = `${product.name} · ${product.format} · Khram`;
    else if (collection) document.title = `${collection.name} · ${collection.theme} · Khram`;
  }, [product, collection]);

  let body;
  if (product) body = <ProductView slug={slug} lang={lang} />;
  else if (collection) body = <CollectionView slug={slug} lang={lang} />;
  else if (match && !ready)
    body = (
      <section className="section">
        <Container narrow>
          <p className="lede text-lavender" role="status">
            {ui(lang).notFound.loading}
          </p>
        </Container>
      </section>
    );
  else body = <Missing lang={lang} />;

  return (
    <SiteShell lang={lang} path={path ?? "/"}>
      {body}
    </SiteShell>
  );
}
