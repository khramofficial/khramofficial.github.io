"use client";

import { usePathname } from "next/navigation";
import { Announcement } from "@/components/home/HomeStatic";
import { Icon } from "@/components/home/Icon";
import { homeText } from "@/i18n/home";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { href, routes, switchLang } from "@/lib/utils";
import { ShopDropdown, ShopList } from "./ShopMenu";

export function navItems(lang: Lang) {
  const t = ui(lang).nav;
  return [
    { label: t.journals, route: routes.collections },
    { label: t.guides, route: routes.guides },
    { label: t.story, route: routes.ourStory },
    { label: t.faq, route: routes.faq },
    { label: t.contact, route: routes.contact },
  ];
}

/** On the home page the desktop menu jumps to its sections, as in the UX Pilot design. */
function homeItems(lang: Lang) {
  const t = homeText(lang).nav;
  return [
    { label: t.indigo, href: "#product" },
    { label: t.inside, href: "#inside" },
    { label: t.collections, href: "#collections" },
    { label: t.story, href: "#story" },
    { label: t.faq, href: "#faq" },
  ];
}

/** `path` overrides the router path: the not-found page (which also shows products added after the last build) passes the real address. */
export function Header({ lang, path }: { lang: Lang; path?: string | null }) {
  const routePath = usePathname() || "/";
  const pathname = path ?? routePath;
  const t = ui(lang).nav;
  const other: Lang = lang === "en" ? "th" : "en";
  const isHome = /^\/(th\/?)?$/.test(pathname);
  const items = navItems(lang);
  const current = (route: string) => {
    const full = href(lang, route);
    return pathname === full || pathname.startsWith(full) || (route === routes.collections && pathname.includes("/products/"));
  };
  const desktop: { label: string; href: string; route?: string }[] = isHome
    ? homeItems(lang)
    : items.map((item) => ({ label: item.label, href: href(lang, item.route), route: item.route }));
  const getIndigo = isHome ? "#formats" : `${href(lang, routes.home)}#formats`;

  return (
    <>
      {isHome ? <Announcement lang={lang} /> : null}
      <header className="site-header">
        <div className="container-k flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href={href(lang, routes.home)} className="flex items-center gap-2.5 no-underline" aria-label={t.home}>
            <img src="/images/brand/khram-badge.webp" alt="" width={56} height={56} className="h-8 w-8 rounded-full lg:hidden" />
            <span className="wordmark">KHRAM</span>
            <span className="hidden text-sm text-lavender sm:inline lg:hidden xl:inline" lang="th">
              คราม
            </span>
          </a>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8" role="list">
              <li>
                <ShopDropdown lang={lang} />
              </li>
              {desktop.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="nav-link" aria-current={item.route && current(item.route) ? "page" : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline">
              <a href={switchLang(pathname, other)} hrefLang={other} lang={other} className="lang-switch" aria-label={t.switchLabel} data-lang-switch>
                {t.switchTo}
              </a>
            </span>
            <a href={getIndigo} className="btn btn-primary btn-sm">
              {t.getIndigo}
              <Icon name="arrow" className="hidden h-3 w-3 lg:block" />
            </a>
            <button type="button" className="menu-button" aria-expanded="false" aria-controls="mobile-menu" aria-label={t.menu} data-menu-button>
              <span className="menu-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div id="mobile-menu" className="mobile-menu" data-menu-panel>
          <nav aria-label="Main" className="container-k pb-6 pt-2">
            <ShopList lang={lang} />
            <ul role="list">
              {items.map((item) => (
                <li key={item.route}>
                  <a href={href(lang, item.route)} className="mobile-link" aria-current={current(item.route) ? "page" : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={switchLang(pathname, other)} hrefLang={other} lang={other} className="mobile-link" data-lang-switch>
                  {t.switchTo}
                </a>
              </li>
            </ul>
            <a href={getIndigo} className="btn btn-primary mt-6 w-full">
              {t.getIndigo}
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
