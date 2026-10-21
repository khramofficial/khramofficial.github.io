import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { buildCatalog } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/config";
import { href, routes } from "@/lib/utils";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const list = [
    routes.home,
    routes.collections,
    ...buildCatalog.collections.map((c) => routes.collection(c.slug)),
    ...buildCatalog.products.map((p) => routes.product(p.slug)),
    routes.guides,
    routes.ourStory,
    routes.faq,
    routes.contact,
    routes.privacy,
  ];
  const pages: MetadataRoute.Sitemap = list.map((r) => ({
    url: `${SITE_ORIGIN}${href("en", r)}`,
    alternates: { languages: { en: `${SITE_ORIGIN}${href("en", r)}`, th: `${SITE_ORIGIN}${href("th", r)}` } },
  }));
  // Guides are English only.
  const articles: MetadataRoute.Sitemap = guides.map((g) => ({ url: `${SITE_ORIGIN}${routes.guide(g.slug)}`, lastModified: g.updated }));
  return [...pages, ...articles];
}
