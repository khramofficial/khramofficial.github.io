import snapshotRaw from "@/data/snapshot.json";
import { seedCollections, seedProducts, seedSettings } from "@/data/seed";
import { supabaseConfig } from "./config";
import type {
  Collection,
  CollectionStatus,
  CollectionText,
  ImageAsset,
  Lang,
  MotifName,
  Outline,
  Product,
  ProductStatus,
  ProductText,
  QA,
  SiteSettings,
  Spec,
  Store,
  Catalog,
} from "./types";

/* ---------- database rows (snake_case, as stored in Supabase) ---------- */

export interface CollectionRow {
  slug: string;
  name: string;
  dye_thai: string;
  dye_english: string;
  dye_note: string;
  theme: string;
  summary: string;
  description: string[];
  art: string;
  accent_base: string;
  accent_text: string;
  status: CollectionStatus;
  status_note: string;
  swatch: Partial<ImageAsset>;
  motif: MotifName | null;
  i18n: { th?: Partial<CollectionText> } | null;
  sort: number;
  updated_at?: string;
}

export interface ProductRow {
  slug: string;
  collection: string;
  name: string;
  format: string;
  subtitle: string;
  status: ProductStatus;
  price: number | string | null;
  price_label: string;
  store: Store | null;
  url: string | null;
  cta_label: string;
  notes: string[];
  summary: string;
  description: string[];
  included: string[];
  included_heading: string | null;
  specs: Spec[];
  how_it_works: string[] | null;
  outline: Outline | null;
  sample_prompts: string[] | null;
  faq: QA[] | null;
  cover: Partial<ImageAsset>;
  gallery: Partial<ImageAsset>[];
  og_image: string | null;
  i18n: { th?: Partial<ProductText> } | null;
  published: boolean;
  sort: number;
  updated_at?: string;
}

export interface RawCatalog {
  collections: CollectionRow[];
  products: ProductRow[];
  settings: Partial<SiteSettings> | null;
  fetchedAt: string;
}

const image = (i: Partial<ImageAsset> | null | undefined, fallbackAlt = ""): ImageAsset => ({
  src: i?.src ?? "",
  alt: i?.alt ?? fallbackAlt,
  width: Number(i?.width) || 1200,
  height: Number(i?.height) || 1200,
});

export function collectionFromRow(r: CollectionRow): Collection {
  return {
    slug: r.slug,
    name: r.name,
    dyeThai: r.dye_thai,
    dyeEnglish: r.dye_english,
    dyeNote: r.dye_note,
    theme: r.theme,
    summary: r.summary,
    description: r.description ?? [],
    art: r.art,
    accent: { base: r.accent_base, text: r.accent_text },
    status: r.status,
    statusNote: r.status_note,
    swatch: image(r.swatch, `${r.name} cloth swatch`),
    motif: r.motif,
    sort: r.sort ?? 0,
    i18n: r.i18n ?? {},
  };
}

export function collectionToRow(c: Collection): CollectionRow {
  return {
    slug: c.slug,
    name: c.name,
    dye_thai: c.dyeThai,
    dye_english: c.dyeEnglish,
    dye_note: c.dyeNote,
    theme: c.theme,
    summary: c.summary,
    description: c.description,
    art: c.art,
    accent_base: c.accent.base,
    accent_text: c.accent.text,
    status: c.status,
    status_note: c.statusNote,
    swatch: c.swatch,
    motif: c.motif,
    i18n: c.i18n ?? {},
    sort: c.sort,
  };
}

export function productFromRow(r: ProductRow): Product {
  const gallery = (r.gallery ?? []).map((g) => image(g, r.name)).filter((g) => g.src);
  return {
    slug: r.slug,
    collection: r.collection,
    name: r.name,
    format: r.format,
    subtitle: r.subtitle,
    status: r.status,
    price: r.price === null || r.price === undefined ? null : Number(r.price),
    priceLabel: r.price_label,
    store: r.store,
    url: r.url,
    ctaLabel: r.cta_label,
    notes: r.notes ?? [],
    summary: r.summary,
    description: r.description ?? [],
    included: r.included ?? [],
    includedHeading: r.included_heading,
    specs: r.specs ?? [],
    howItWorks: r.how_it_works,
    outline: r.outline,
    samplePrompts: r.sample_prompts,
    faq: r.faq,
    cover: r.cover?.src ? image(r.cover, r.name) : (gallery[0] ?? image(null, r.name)),
    gallery,
    ogImage: r.og_image,
    published: r.published,
    sort: r.sort ?? 0,
    i18n: r.i18n ?? {},
  };
}

export function productToRow(p: Product): ProductRow {
  return {
    slug: p.slug,
    collection: p.collection,
    name: p.name,
    format: p.format,
    subtitle: p.subtitle,
    status: p.status,
    price: p.price,
    price_label: p.priceLabel,
    store: p.store,
    url: p.url,
    cta_label: p.ctaLabel,
    notes: p.notes,
    summary: p.summary,
    description: p.description,
    included: p.included,
    included_heading: p.includedHeading,
    specs: p.specs,
    how_it_works: p.howItWorks,
    outline: p.outline,
    sample_prompts: p.samplePrompts,
    faq: p.faq,
    cover: p.cover,
    gallery: p.gallery,
    og_image: p.ogImage,
    i18n: p.i18n ?? {},
    published: p.published,
    sort: p.sort,
  };
}

const bySort = <T extends { sort: number }>(a: T, b: T) => a.sort - b.sort;

export const seedCatalog: Catalog = {
  collections: seedCollections,
  products: seedProducts,
  settings: seedSettings,
  fetchedAt: "seed",
};

export function catalogFromRaw(raw: RawCatalog | null | undefined): Catalog {
  if (!raw || !Array.isArray(raw.collections) || raw.collections.length === 0) return seedCatalog;
  return {
    collections: raw.collections.map(collectionFromRow).sort(bySort),
    products: (raw.products ?? []).map(productFromRow).filter((p) => p.published).sort(bySort),
    settings: { ...seedSettings, ...(raw.settings ?? {}) },
    fetchedAt: raw.fetchedAt,
  };
}

/** The catalog baked into this build (scripts/fetch-catalog.mjs writes src/data/snapshot.json before every build). */
export const buildCatalog: Catalog = catalogFromRaw(snapshotRaw as unknown as RawCatalog);

/** Reads the published catalog from Supabase with the public key. */
export async function fetchRawCatalog(signal?: AbortSignal): Promise<RawCatalog> {
  const headers = { apikey: supabaseConfig.key, Accept: "application/json" };
  const get = async <T,>(path: string): Promise<T> => {
    const res = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, { headers, signal, cache: "no-store" });
    if (!res.ok) throw new Error(`Supabase ${path}: ${res.status}`);
    return (await res.json()) as T;
  };
  const [collections, products, settings] = await Promise.all([
    get<CollectionRow[]>("collections?select=*&order=sort.asc"),
    get<ProductRow[]>("products?select=*&published=eq.true&order=sort.asc"),
    get<{ data: Partial<SiteSettings> }[]>("site_settings?select=data&id=eq.1"),
  ]);
  return { collections, products, settings: settings[0]?.data ?? null, fetchedAt: new Date().toISOString() };
}

/* ---------- language ---------- */

/** Thai text overrides English only where a Thai value is actually filled in. */
function filled<T extends object>(o: Partial<T> | undefined): Partial<T> {
  const out: Partial<T> = {};
  if (!o) return out;
  for (const [k, v] of Object.entries(o)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export function localizeCollection(c: Collection, lang: Lang): Collection {
  return lang === "th" ? { ...c, ...filled<CollectionText>(c.i18n?.th) } : c;
}

/** Labels a product gets when the admin leaves the price or button text empty. */
const autoLabels = {
  en: { free: "Free", buy: (s: string) => `Get it on ${s}`, getFree: "Get it free", soon: "Coming soon", progress: "In progress", store: "the store" },
  th: { free: "ฟรี", buy: (s: string) => `ซื้อที่ ${s}`, getFree: "รับฟรี", soon: "เร็วๆ นี้", progress: "กำลังทำ", store: "ร้าน" },
} as const;

export function localizeProduct(p: Product, lang: Lang): Product {
  const out = lang === "th" ? { ...p, ...filled<ProductText>(p.i18n?.th) } : { ...p };
  const a = autoLabels[lang];
  if (!out.priceLabel.trim()) {
    if (out.status === "free") out.priceLabel = a.free;
    else if (out.price !== null) out.priceLabel = `$${out.price.toFixed(2)}`;
  }
  if (!out.ctaLabel.trim()) {
    const store = out.store && out.store !== "Other" ? out.store : a.store;
    out.ctaLabel =
      out.status === "free" ? a.getFree : out.status === "available" && out.url ? a.buy(store) : out.status === "in-progress" ? a.progress : a.soon;
  }
  return out;
}

export function findCollection(cat: Catalog, slug: string, lang: Lang): Collection | undefined {
  const c = cat.collections.find((x) => x.slug === slug);
  return c ? localizeCollection(c, lang) : undefined;
}

export function findProduct(cat: Catalog, slug: string, lang: Lang): Product | undefined {
  const p = cat.products.find((x) => x.slug === slug);
  return p ? localizeProduct(p, lang) : undefined;
}

export function productsIn(cat: Catalog, collection: string, lang: Lang): Product[] {
  return cat.products.filter((p) => p.collection === collection).map((p) => localizeProduct(p, lang));
}

/** Resolve an image path: bundled files stay relative to the site, uploads are full URLs. */
export function imgSrc(src: string): string {
  return src;
}
