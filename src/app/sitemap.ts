import type { MetadataRoute } from "next";
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
    routes.ourStory,
    routes.faq,
    routes.contact,
    routes.privacy,
  ];
  return list.map((r) => ({
    url: `${SITE_ORIGIN}${href("en", r)}`,
    alternates: { languages: { en: `${SITE_ORIGIN}${href("en", r)}`, th: `${SITE_ORIGIN}${href("th", r)}` } },
  }));
}
