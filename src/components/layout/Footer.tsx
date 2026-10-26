"use client";

import { Icon } from "@/components/home/Icon";
import { homeText } from "@/i18n/home";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { external, href, routes } from "@/lib/utils";

/** Footer in the UX Pilot layout: brand + line, one row of links, social buttons, then the small print. */
export function Footer({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const h = homeText(lang);
  const { settings } = useCatalog();
  const links = [
    { label: "INDIGO", url: href(lang, routes.collection("indigo")) },
    { label: t.nav.journals, url: href(lang, routes.collections) },
    { label: t.nav.story, url: href(lang, routes.ourStory) },
    { label: t.nav.guides, url: href(lang, routes.guides) },
    { label: t.nav.faq, url: href(lang, routes.faq) },
    { label: t.nav.contact, url: href(lang, routes.contact) },
    { label: h.footer.refunds, url: `${href(lang, routes.faq)}#orders` },
    { label: t.footer.privacy, url: href(lang, routes.privacy) },
  ];
  const social = [
    { label: "TikTok", url: settings.tiktok, icon: "tiktok" as const },
    { label: "Instagram", url: settings.instagram, icon: null },
    { label: "Pinterest", url: settings.pinterest, icon: null },
    { label: t.footer.gumroad, url: settings.gumroadStore, icon: null },
    { label: t.footer.amazon, url: settings.amazonAuthor, icon: null },
  ].filter((s) => s.url);

  return (
    <footer className="site-footer border-t border-gold/10 bg-night">
      <div className="container-k grid gap-8 py-12 text-center lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12 lg:text-left">
        <div className="flex flex-col items-center gap-3 lg:items-start">
          <a href={href(lang, routes.home)} className="flex items-center gap-3 no-underline">
            <img src="/images/brand/khram-badge.webp" alt={t.footer.logoAlt} width={56} height={56} loading="lazy" className="h-11 w-11 rounded-full" />
            <span className="wordmark text-[1.4rem]">KHRAM</span>
          </a>
          <p className="italic text-ivory/65">
            <span className="lg:hidden">{t.signoff}</span>
            <span className="hidden lg:inline">{t.tagline}</span>
          </p>
          <p className="hidden max-w-md text-[0.95rem] text-ivory/60 lg:block">{t.footer.about}</p>
        </div>
        <div className="flex flex-col items-center gap-6 lg:items-end">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 font-display text-[12px] tracking-[0.15em] text-ivory/65 uppercase lg:justify-end" role="list">
            {links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="no-underline transition-colors hover:text-moon">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap justify-center gap-3" role="list">
            {social.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  aria-label={s.icon ? s.label : undefined}
                  className="flex h-10 min-w-10 items-center justify-center rounded-full border border-gold/20 px-3 text-[0.85rem] text-ivory/80 no-underline transition hover:border-moon hover:text-moon"
                  {...external}
                >
                  {s.icon ? <Icon name={s.icon} className="h-4 w-4" /> : s.label}
                  <span className="sr-only"> {t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-k">
        <div className="flex flex-col gap-2 border-t border-gold/10 py-6 text-center text-[0.85rem] leading-relaxed text-ivory/55 lg:flex-row lg:justify-between lg:gap-10 lg:text-left">
          <p>
            © 2026 Khram. {t.notTherapy}{" "}
            {t.footer.crisis}{" "}
            <a href="https://findahelpline.com" className="link-k" {...external}>
              findahelpline.com
            </a>
            .
          </p>
          <p className="hidden shrink-0 italic lg:block">{h.footer.line}</p>
        </div>
      </div>
    </footer>
  );
}
