import { faqGroups } from "@/data/faq";
import { findGuide } from "@/data/guides";
import { ui } from "@/i18n/ui";
import { buildCatalog, findCollection, findProduct } from "./catalog";
import { SITE_ORIGIN } from "./config";
import type { Lang } from "./types";
import { href, routes } from "./utils";

/*
 * schema.org data for search engines, built at export time from the same catalog the pages use.
 * Google shows product snippets (price, availability) from `Product`; FAQ rich results were retired
 * by Google in 2026, but the FAQ markup is still valid schema.org and other engines read it.
 */

type Json = Record<string, unknown>;

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`);

/** Renders one JSON-LD block. `<` is escaped so text can never close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const organizationId = `${SITE_ORIGIN}/#organization`;

export function siteLd(lang: Lang): Json[] {
  const s = buildCatalog.settings;
  const t = ui(lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "Khram",
      url: `${SITE_ORIGIN}/`,
      logo: abs("/images/brand/khram-badge.webp"),
      description: t.meta.description,
      email: s.email || undefined,
      sameAs: [s.gumroadStore, s.amazonAuthor, s.tiktok, s.instagram, s.pinterest].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "Khram",
      url: `${SITE_ORIGIN}/`,
      inLanguage: ["en", "th"],
      publisher: { "@id": organizationId },
    },
  ];
}

/** Countries Gumroad sells the PDFs to that matter most to Khram (Search Console wants a list, not "worldwide"). */
const DIGITAL_COUNTRIES = ["US", "GB", "CA", "AU", "TH"];
const days = (min: number, max: number) => ({ "@type": "QuantitativeValue", minValue: min, maxValue: max, unitCode: "DAY" });

/**
 * Shipping and returns for merchant listings, only what is true:
 * - Gumroad PDFs: instant download, nothing to ship, 14-day money-back guarantee (refund policy ON in Gumroad); free items can't be refunded.
 * - Amazon paperbacks: sold and shipped by Amazon, so Amazon is the seller and Amazon's 30-day return policy applies.
 *   Amazon's shipping cost depends on the buyer's order, so no shipping rate is claimed for them.
 */
function offerPolicies(store: string | null, price: number): Json {
  if (store === "Gumroad") {
    return {
      seller: { "@id": organizationId },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
        shippingDestination: DIGITAL_COUNTRIES.map((addressCountry) => ({ "@type": "DefinedRegion", addressCountry })),
        deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: days(0, 0), transitTime: days(0, 0) },
      },
      hasMerchantReturnPolicy:
        price > 0
          ? {
              "@type": "MerchantReturnPolicy",
              applicableCountry: DIGITAL_COUNTRIES,
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 14,
              returnFees: "https://schema.org/FreeReturn",
              refundType: "https://schema.org/FullRefund",
            }
          : {
              "@type": "MerchantReturnPolicy",
              applicableCountry: DIGITAL_COUNTRIES,
              returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
            },
    };
  }
  if (store === "Amazon") {
    return {
      seller: { "@type": "Organization", name: "Amazon" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        merchantReturnLink: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7",
      },
    };
  }
  return {};
}

export function productLd(slug: string, lang: Lang): Json[] {
  const p = findProduct(buildCatalog, slug, lang);
  if (!p) return [];
  const c = findCollection(buildCatalog, p.collection, lang);
  const page = `${SITE_ORIGIN}${href(lang, routes.product(slug))}`;
  const images = [p.cover, ...p.gallery].map((i) => i.src).filter(Boolean).map(abs);
  const sellable = p.price !== null && p.url && (p.status === "available" || p.status === "free");
  const product: Json = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${page}#product`,
    name: p.subtitle ? `${p.name}: ${p.subtitle} (${p.format})` : `${p.name} (${p.format})`,
    description: p.summary,
    image: [...new Set(images)],
    brand: { "@type": "Brand", name: "Khram" },
    sku: p.slug,
    url: page,
    inLanguage: "en",
    category: p.format,
  };
  // Google needs offers, reviews or ratings on a Product; items not on sale yet only get breadcrumbs.
  // No aggregateRating/review until real reviews exist (Search Console lists them as optional; we never invent them).
  if (sellable) {
    product.offers = {
      "@type": "Offer",
      url: p.url,
      price: Number(p.price).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      ...offerPolicies(p.store, Number(p.price)),
    };
  }
  const crumbs: Json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: ui(lang).nav.journals, item: `${SITE_ORIGIN}${href(lang, routes.collections)}` },
      ...(c ? [{ name: c.name, item: `${SITE_ORIGIN}${href(lang, routes.collection(c.slug))}` }] : []),
      { name: p.format, item: page },
    ].map((x, i) => ({ "@type": "ListItem", position: i + 1, ...x })),
  };
  return sellable ? [product, crumbs] : [crumbs];
}

export function faqLd(lang: Lang): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqGroups[lang].flatMap((g) =>
      g.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    ),
  };
}

export function guideLd(slug: string): Json[] {
  const g = findGuide(slug);
  if (!g) return [];
  const url = `${SITE_ORIGIN}${routes.guide(slug)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: g.title,
      description: g.description,
      image: [abs(g.image.src), abs(g.ogImage)],
      datePublished: g.published,
      dateModified: g.updated,
      inLanguage: "en",
      author: { "@type": "Organization", name: "Khram", url: `${SITE_ORIGIN}/` },
      publisher: { "@id": organizationId },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { name: "Guides", item: `${SITE_ORIGIN}${routes.guides}` },
        { name: g.metaTitle, item: url },
      ].map((x, i) => ({ "@type": "ListItem", position: i + 1, ...x })),
    },
  ];
}
