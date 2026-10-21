"use client";

import { usePathname } from "next/navigation";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { href, routes, switchLang } from "@/lib/utils";

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

/** `path` overrides the router path: the not-found page (which also shows products added after the last build) passes the real address. */
export function Header({ lang, path }: { lang: Lang; path?: string | null }) {
  const routePath = usePathname() || "/";
  const pathname = path ?? routePath;
  const t = ui(lang).nav;
  const other: Lang = lang === "en" ? "th" : "en";
  const items = navItems(lang);
  const current = (route: string) => {
    const full = href(lang, route);
    return pathname === full || pathname.startsWith(full) || (route === routes.collections && pathname.includes("/products/"));
  };
  const langLink = (
    <a
      href={switchLang(pathname, other)}
      hrefLang={other}
      lang={other}
      className="lang-switch"
      aria-label={t.switchLabel}
      data-lang-switch
    >
      {t.switchTo}
    </a>
  );

  return (
    <header className="site-header">
      <div className="container-k flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href={href(lang, routes.home)} className="wordmark" aria-label={t.home}>
          KHRAM
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9" role="list">
            {items.map((item) => (
              <li key={item.route}>
                <a href={href(lang, item.route)} className="nav-link" aria-current={current(item.route) ? "page" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden lg:inline">{langLink}</span>
          <a href={href(lang, routes.collection("indigo"))} className="btn btn-primary btn-sm hidden sm:inline-flex">
            {t.getIndigo}
          </a>
          <button type="button" className="menu-button" aria-expanded="false" aria-controls="mobile-menu" data-menu-button>
            <span>{t.menu}</span>
            <span className="menu-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" data-menu-panel>
        <nav aria-label="Main" className="container-k pb-6 pt-2">
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
          <a href={href(lang, routes.collection("indigo"))} className="btn btn-primary mt-6 w-full">
            {t.getIndigo}
          </a>
        </nav>
      </div>
    </header>
  );
}
