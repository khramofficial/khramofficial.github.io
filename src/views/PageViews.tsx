"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { faqGroups } from "@/data/faq";
import { ui } from "@/i18n/ui";
import { localizeCollection } from "@/lib/catalog";
import type { Lang } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { external, href, routes } from "@/lib/utils";

export function StoryView({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const s = t.storyPage;
  const catalog = useCatalog();
  const collections = catalog.collections.map((c) => localizeCollection(c, lang));
  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/10" aria-labelledby="story-h">
        <Container className="flex flex-col gap-12 py-14 md:py-20">
          <div className="flex min-w-0 max-w-3xl flex-col gap-6">
            <p className="eyebrow">{s.eyebrow}</p>
            <h1 id="story-h" className="display-1">
              {s.h1}
            </h1>
            <p className="lede measure text-ivory/85">
              <span lang="th">คราม</span> {s.lede}
            </p>
          </div>
          <div className="frame bg-navy p-2">
            <img src="/images/art/indigo-lake.webp" alt={s.artAlt} width={1000} height={277} fetchPriority="high" className="reveal-art h-auto w-full" />
          </div>
        </Container>
      </section>

      <section className="section" aria-labelledby="meaning-h">
        <Container narrow className="flex flex-col gap-6">
          <h2 id="meaning-h" className="display-2 text-moon">
            {s.whyH2}
          </h2>
          <div className="flex flex-col gap-5 text-[1.1rem] leading-[1.8] text-ivory/90">
            {s.why.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="band-navy section" aria-labelledby="believe-h">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{s.believeEyebrow}</p>
            <h2 id="believe-h" className="display-2">
              {s.believeH2}
            </h2>
          </div>
          <ul className="star-list flex flex-col gap-4 text-[1.08rem]" role="list">
            {s.beliefs.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section" aria-labelledby="collections-h">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{s.tableEyebrow}</p>
            <h2 id="collections-h" className="display-2">
              {s.tableH2}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-left">
              <caption className="sr-only">{s.tableCaption}</caption>
              <thead>
                <tr className="border-b border-gold/30">
                  {s.cols.map((h) => (
                    <th key={h} scope="col" className="eyebrow py-3 pr-6 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collections.map((c) => (
                  <tr key={c.slug} className="border-b border-gold/12 align-top">
                    <th scope="row" className="py-4 pr-6 font-normal">
                      <a href={href(lang, routes.collection(c.slug))} className="font-display tracking-[0.1em] text-ivory no-underline hover:text-gold">
                        {c.name}
                      </a>
                    </th>
                    <td className="py-4 pr-6 text-ivory/85">{c.theme}</td>
                    <td className="py-4 text-lavender">{t.status.collection[c.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="on-paper section-tight" aria-labelledby="close-h">
        <Container className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end md:gap-16">
          <div className="flex flex-col gap-4">
            <h2 id="close-h" className="display-2">
              {s.closeH2}
            </h2>
            <p className="lede measure">{s.closeP}</p>
            <p className="font-display text-[1.25rem] tracking-[0.12em]">{t.signoff}</p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href={href(lang, routes.collection("indigo"))}>{s.seeIndigo}</ButtonLink>
            <ButtonLink href={href(lang, routes.product("seven-nights"))} variant="ghost">
              {s.tryFree}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

export function FaqView({ lang }: { lang: Lang }) {
  const t = ui(lang).faqPage;
  const groups = faqGroups[lang];
  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.h1}>
        <p>
          {t.cantFind}{" "}
          <a href={href(lang, routes.contact)} className="link-k">
            {t.writeUs}
          </a>
          .
        </p>
      </PageIntro>
      <section className="section">
        <Container className="grid gap-16 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:gap-20">
          <nav aria-label={t.topics} className="hidden lg:block">
            <ul className="sticky top-[calc(var(--header-h)+2rem)] flex flex-col gap-3" role="list">
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="nav-link">
                    {g.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex min-w-0 flex-col gap-16">
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`}>
                <h2 id={`${g.id}-h`} className="display-3 mb-2 text-gold">
                  {g.heading}
                </h2>
                <div>
                  {g.items.map((item) => (
                    <details key={item.q} className="qa">
                      <summary>{item.q}</summary>
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export function ContactView({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const c = t.contactPage;
  const { settings } = useCatalog();
  const links = [
    { label: "TikTok", detail: "@khram.journals", url: settings.tiktok },
    { label: "Amazon", detail: c.authorPage, url: settings.amazonAuthor },
    { label: "Gumroad", detail: settings.gumroadStore.replace(/^https:\/\//, ""), url: settings.gumroadStore },
    { label: "Instagram", detail: settings.instagram.replace(/^https:\/\/(www\.)?/, ""), url: settings.instagram },
    { label: "Pinterest", detail: settings.pinterest.replace(/^https:\/\/(www\.)?/, ""), url: settings.pinterest },
  ].filter((l) => l.url);
  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.h1}>
        <p>{c.lede}</p>
      </PageIntro>
      <section className="section">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="frame flex flex-col gap-4 bg-navy/60 px-6 py-8 sm:px-8">
              <h2 className="eyebrow">{c.email}</h2>
              <p className="select-all break-all font-body text-[clamp(1.2rem,1rem+0.9vw,1.6rem)] text-moon">{settings.email}</p>
              <div className="flex flex-wrap items-center gap-4">
                <a href={`mailto:${settings.email}`} className="btn btn-primary btn-sm">
                  {c.openMail}
                </a>
                <button type="button" className="btn btn-ghost btn-sm" data-copy={settings.email} data-copied={c.copied} data-selected={c.selected} hidden>
                  {c.copy}
                </button>
                <span className="text-[0.95rem] text-lavender" aria-live="polite" data-copy-status />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="display-3 text-gold">{c.orderHelp}</h2>
              <dl className="spec-list">
                <div className="contents">
                  <dt>Gumroad</dt>
                  <dd>{c.gumroadHelp}</dd>
                </div>
                <div className="contents">
                  <dt>Amazon</dt>
                  <dd>{c.amazonHelp}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="display-3 text-gold">{c.elsewhere}</h2>
              <ul className="flex flex-col" role="list">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      className="group grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-t border-gold/15 py-4 text-inherit no-underline last:border-b"
                      {...external}
                    >
                      <span className="eyebrow">{l.label}</span>
                      <span className="break-words text-ivory group-hover:text-gold">{l.detail}</span>
                      <span aria-hidden="true" className="text-gold">
                        ↗
                      </span>
                      <span className="sr-only">{t.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-lavender/50 pl-5 text-[0.98rem] text-ivory/80">
              <p>
                {c.crisis}{" "}
                <a href="https://findahelpline.com" className="link-k" {...external}>
                  findahelpline.com
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export function PrivacyView({ lang }: { lang: Lang }) {
  const p = ui(lang).privacyPage;
  return (
    <>
      <PageIntro eyebrow={p.eyebrow} title={p.h1}>
        <p>{p.lede}</p>
      </PageIntro>
      <section className="section">
        <Container narrow className="flex flex-col gap-10 text-[1.05rem] leading-[1.8] text-ivory/90">
          {p.blocks.map((b) => (
            <section key={b.title} className="flex flex-col gap-3">
              <h2 className="display-3 text-gold">{b.title}</h2>
              <p>{b.text}</p>
            </section>
          ))}
          <p className="text-[0.95rem]">
            <a href="https://policies.google.com/privacy" className="link-k" {...external}>
              {p.googlePolicy}
            </a>
          </p>
          <p className="text-[0.95rem] text-lavender">{p.updated}</p>
        </Container>
      </section>
    </>
  );
}
