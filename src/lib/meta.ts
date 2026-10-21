import type { Metadata } from "next";
import { ui } from "@/i18n/ui";
import { buildCatalog, findCollection, findProduct } from "./catalog";
import type { Lang } from "./types";
import { alternatesFor, routes } from "./utils";

type Page = "home" | "collections" | "story" | "faq" | "contact" | "privacy";

const routeOf: Record<Page, string> = {
  home: routes.home,
  collections: routes.collections,
  story: routes.ourStory,
  faq: routes.faq,
  contact: routes.contact,
  privacy: routes.privacy,
};

const ogLocale = (lang: Lang) => (lang === "th" ? "th_TH" : "en_US");

export function pageMeta(page: Page, lang: Lang): Metadata {
  const t = ui(lang);
  const map: Record<Page, { title?: string; description: string }> = {
    home: { description: t.meta.description },
    collections: { title: t.collectionsPage.title, description: t.collectionsPage.description },
    story: { title: t.storyPage.title, description: t.storyPage.description },
    faq: { title: t.faqPage.title, description: t.faqPage.description },
    contact: { title: t.contactPage.title, description: t.contactPage.description },
    privacy: { title: t.privacyPage.title, description: t.privacyPage.description },
  };
  const m = map[page];
  const title = m.title ?? { absolute: t.meta.homeTitle };
  return {
    title,
    description: m.description,
    alternates: alternatesFor(routeOf[page], lang),
    openGraph: { title: m.title ? `${m.title} · Khram` : t.meta.homeTitle, description: m.description, locale: ogLocale(lang) },
  };
}

export function collectionMeta(slug: string, lang: Lang): Metadata {
  const c = findCollection(buildCatalog, slug, lang);
  if (!c) return {};
  const title = `${c.name} · ${c.theme}`;
  return {
    title,
    description: c.summary,
    alternates: alternatesFor(routes.collection(slug), lang),
    openGraph: {
      title: `${title} · Khram`,
      description: c.summary,
      locale: ogLocale(lang),
      images: [
        ["indigo", "crimson", "saffron", "ebony"].includes(slug)
          ? { url: `/images/og/${slug}.jpg`, width: 1200, height: 630, alt: c.swatch.alt }
          : { url: c.swatch.src || "/opengraph-image.jpg", alt: c.swatch.alt },
      ],
    },
  };
}

export function productMeta(slug: string, lang: Lang): Metadata {
  const p = findProduct(buildCatalog, slug, lang);
  if (!p) return {};
  const title = `${p.name} · ${p.format}`;
  return {
    title,
    description: `${p.summary} ${p.subtitle}.`,
    alternates: alternatesFor(routes.product(slug), lang),
    openGraph: {
      title: `${title} · Khram`,
      description: p.summary,
      locale: ogLocale(lang),
      images: [{ url: p.ogImage ?? "/opengraph-image.jpg", width: 1200, height: 630, alt: p.cover.alt }],
    },
  };
}

export const collectionParams = () => buildCatalog.collections.map((c) => ({ slug: c.slug }));
export const productParams = () => buildCatalog.products.map((p) => ({ slug: p.slug }));
