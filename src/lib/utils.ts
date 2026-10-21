import { SITE_ORIGIN } from "./config";
import type { Lang } from "./types";

/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Every internal route, without language prefix. Trailing slashes match `trailingSlash: true`. */
export const routes = {
  home: "/",
  collections: "/collections/",
  collection: (slug: string) => `/collections/${slug}/`,
  product: (slug: string) => `/products/${slug}/`,
  ourStory: "/our-story/",
  faq: "/faq/",
  guides: "/guides/",
  guide: (slug: string) => `/guides/${slug}/`,
  contact: "/contact/",
  privacy: "/privacy/",
} as const;

/** English lives at the root, Thai under /th/. */
export function href(lang: Lang, route: string): string {
  if (lang === "en") return route;
  return route === "/" ? "/th/" : `/th${route}`;
}

/** Same page in the other language. */
export function switchLang(pathname: string, to: Lang): string {
  const bare = pathname.replace(/^\/th(?=\/|$)/, "") || "/";
  // Guides are written in English only; the Thai side has the guides list.
  if (/^\/guides\/[^/]+/.test(bare)) return href(to, "/guides/");
  return href(to, bare.endsWith("/") ? bare : `${bare}/`);
}

export function langFromPath(pathname: string): Lang {
  return /^\/th(\/|$)/.test(pathname) ? "th" : "en";
}

/** Metadata alternates for both languages (absolute URLs, so they work without metadataBase quirks). */
export function alternatesFor(route: string, lang: Lang) {
  return {
    canonical: `${SITE_ORIGIN}${href(lang, route)}`,
    languages: {
      en: `${SITE_ORIGIN}${href("en", route)}`,
      th: `${SITE_ORIGIN}${href("th", route)}`,
      "x-default": `${SITE_ORIGIN}${href("en", route)}`,
    },
  };
}

/** Attributes for links that leave the site. */
export const external = { target: "_blank", rel: "noopener noreferrer" } as const;
