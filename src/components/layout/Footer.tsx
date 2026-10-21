"use client";

import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { external, href, routes } from "@/lib/utils";

export function Footer({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const { collections, settings } = useCatalog();
  const find = [
    { label: t.footer.gumroad, url: settings.gumroadStore },
    { label: t.footer.amazon, url: settings.amazonAuthor },
    { label: "TikTok @khram.journals", url: settings.tiktok },
    { label: "Instagram", url: settings.instagram },
    { label: "Pinterest", url: settings.pinterest },
  ].filter((l) => l.url);

  return (
    <footer className="border-t border-gold/15 bg-night">
      <div className="container-k grid gap-12 py-16 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] md:gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <img
              src="/images/brand/khram-badge.webp"
              alt={t.footer.logoAlt}
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 rounded-full"
            />
            <a href={href(lang, routes.home)} className="wordmark">
              KHRAM
            </a>
          </div>
          <p className="max-w-xs text-[1rem] italic text-moon">{t.tagline}</p>
          <p className="max-w-xs text-[0.95rem] text-ivory/75">{t.footer.about}</p>
        </div>

        <FooterList
          heading={t.footer.journals}
          items={collections.map((c) => ({ label: c.name, url: href(lang, routes.collection(c.slug)) }))}
        />
        <FooterList
          heading={t.footer.khram}
          items={[
            { label: t.nav.story, url: href(lang, routes.ourStory) },
            { label: t.nav.guides, url: href(lang, routes.guides) },
            { label: t.nav.faq, url: href(lang, routes.faq) },
            { label: t.nav.contact, url: href(lang, routes.contact) },
            { label: t.footer.privacy, url: href(lang, routes.privacy) },
          ]}
        />
        <FooterList heading={t.footer.findUs} items={find.map((f) => ({ ...f, external: t.newTab }))} />
      </div>
      <div className="container-k">
        <div className="flex flex-col gap-3 border-t border-gold/10 py-8 text-[0.875rem] leading-relaxed text-ivory/65 md:flex-row md:justify-between md:gap-10">
          <p>
            © 2026 Khram. {t.notTherapy}
          </p>
          <p className="md:max-w-sm md:text-right">
            {t.footer.crisis}{" "}
            <a href="https://findahelpline.com" className="link-k" {...external}>
              findahelpline.com
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ heading, items }: { heading: string; items: { label: string; url: string; external?: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow mb-4">{heading}</h2>
      <ul className="flex flex-col gap-2.5" role="list">
        {items.map((item) => (
          <li key={item.url}>
            <a href={item.url} className="text-[1rem] text-ivory/85 no-underline transition-colors hover:text-gold" {...(item.external ? external : {})}>
              {item.label}
              {item.external ? <span className="sr-only"> {item.external}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
