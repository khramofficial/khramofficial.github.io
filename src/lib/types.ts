export type Lang = "en" | "th";

export type CollectionSlug = string;

/** available = can be bought now · in-progress = being made · planned = on the roadmap, no date */
export type CollectionStatus = "available" | "in-progress" | "planned";

/**
 * available = buy link is live
 * free = live, pay-what-you-want from $0
 * coming-soon = finished, waiting on the store (no link yet)
 * in-progress = still being made, nothing to buy
 */
export type ProductStatus = "available" | "free" | "coming-soon" | "in-progress";

export type MotifName = "butterfly-moon" | "thread-moon" | "dawn-ripples" | "new-moon-flower";

export type Store = "Gumroad" | "Amazon" | "Etsy" | "Lulu" | "Other";

export interface ImageAsset {
  /** /images/... (bundled with the site) or a full https URL (uploaded in the admin) */
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Text fields of a collection that have a Thai version */
export interface CollectionText {
  dyeNote: string;
  theme: string;
  summary: string;
  description: string[];
  art: string;
  statusNote: string;
}

export interface Collection extends CollectionText {
  slug: CollectionSlug;
  name: string;
  dyeThai: string;
  dyeEnglish: string;
  accent: { base: string; text: string };
  status: CollectionStatus;
  swatch: ImageAsset;
  motif: MotifName | null;
  sort: number;
  i18n?: { th?: Partial<CollectionText> };
}

export interface Spec {
  label: string;
  value: string;
}

export interface QA {
  q: string;
  a: string;
}

export interface Outline {
  heading: string;
  items: { title: string; text: string }[];
}

/** Text fields of a product that have a Thai version */
export interface ProductText {
  format: string;
  subtitle: string;
  summary: string;
  description: string[];
  included: string[];
  includedHeading: string | null;
  specs: Spec[];
  howItWorks: string[] | null;
  outline: Outline | null;
  faq: QA[] | null;
  priceLabel: string;
  ctaLabel: string;
  notes: string[];
}

export interface Product extends ProductText {
  slug: string;
  collection: CollectionSlug;
  name: string;
  status: ProductStatus;
  /** USD. null = not set yet */
  price: number | null;
  store: Store | null;
  url: string | null;
  samplePrompts: string[] | null;
  cover: ImageAsset;
  gallery: ImageAsset[];
  ogImage: string | null;
  published: boolean;
  sort: number;
  i18n?: { th?: Partial<ProductText> };
}

export interface SiteSettings {
  email: string;
  gumroadStore: string;
  amazonAuthor: string;
  tiktok: string;
  instagram: string;
  pinterest: string;
}

export interface Catalog {
  collections: Collection[];
  products: Product[];
  settings: SiteSettings;
  /** ISO time the data was read */
  fetchedAt: string;
}
