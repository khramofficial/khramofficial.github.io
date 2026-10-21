import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { type Block, type Guide, findGuide, guides } from "@/data/guides";
import { ui } from "@/i18n/ui";
import { buildCatalog, findProduct } from "@/lib/catalog";
import type { Lang } from "@/lib/types";
import { external, href, routes } from "@/lib/utils";

/** **bold** and [text](url) inside guide strings. Internal links stay in the tab; outside links open a new one. */
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++} className="font-semibold text-ivory">{m[1]}</strong>);
    else if (m[2] && m[3]) {
      const outside = /^https?:\/\//.test(m[3]);
      out.push(
        <a key={k++} href={m[3]} className="link-k" {...(outside ? external : {})}>
          {m[2]}
          {outside ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const dateFmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function ProductPlug({ slug }: { slug: string }) {
  const p = findProduct(buildCatalog, slug, "en");
  if (!p) return null;
  return (
    <aside className="frame my-4 flex flex-col gap-5 bg-navy p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6" aria-label={p.name}>
      {p.cover.src ? (
        <img src={p.cover.src} alt="" width={p.cover.width} height={p.cover.height} loading="lazy" decoding="async" className="h-auto w-28 shrink-0 self-start shadow-[0_14px_30px_-14px_rgba(0,0,0,0.9)] sm:w-32" />
      ) : null}
      <div className="flex min-w-0 flex-col gap-3">
        <p className="eyebrow">{p.format}</p>
        <p className="font-display text-[1.35rem] leading-snug tracking-[0.04em] text-ivory">{p.name}</p>
        <p className="text-[1rem] leading-relaxed text-ivory/80">{p.summary}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <ButtonLink href={routes.product(p.slug)} size="sm">
            {p.status === "free" ? "Get it free" : `See ${p.name}`}
          </ButtonLink>
          {p.priceLabel ? <span className="font-display text-moon">{p.priceLabel}</span> : null}
        </div>
      </div>
    </aside>
  );
}

function BlockView({ b }: { b: Block }) {
  if ("h2" in b)
    return (
      <h2 id={slugify(b.h2)} className="mt-6 font-display text-[1.5rem] leading-snug tracking-[0.03em] text-moon md:text-[1.75rem]">
        {b.h2}
      </h2>
    );
  if ("h3" in b) return <h3 className="mt-2 font-display text-[1.15rem] tracking-[0.04em] text-gold">{b.h3}</h3>;
  if ("p" in b) return <p>{rich(b.p)}</p>;
  if ("ul" in b)
    return (
      <ul className="star-list flex flex-col gap-3" role="list">
        {b.ul.map((x) => (
          <li key={x}>{rich(x)}</li>
        ))}
      </ul>
    );
  if ("ol" in b)
    return (
      <ol className="guide-ol flex flex-col gap-3">
        {b.ol.map((x) => (
          <li key={x}>{rich(x)}</li>
        ))}
      </ol>
    );
  if ("prompts" in b)
    return (
      <ol className="guide-prompts flex flex-col gap-0" start={b.start ?? 1}>
        {b.prompts.map((x) => (
          <li key={x}>{rich(x)}</li>
        ))}
      </ol>
    );
  if ("product" in b) return <ProductPlug slug={b.product} />;
  return <p className="border-l-2 border-gold/40 pl-4 text-[0.95rem] italic leading-relaxed text-lavender">{rich(b.note)}</p>;
}

function GuideCard({ g, headingLevel = "h2" }: { g: Guide; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const t = ui("en").guidesPage;
  return (
    <a href={routes.guide(g.slug)} className="group flex h-full flex-col gap-4 text-inherit no-underline" lang="en">
      <div className="frame overflow-hidden bg-navy p-1.5">
        <img src={g.image.src} alt="" width={g.image.width} height={g.image.height} loading="lazy" decoding="async" className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
      <p className="eyebrow">{g.eyebrow}</p>
      <H className="font-display text-[1.3rem] leading-snug tracking-[0.03em] text-ivory group-hover:text-moon">{g.metaTitle}</H>
      <p className="text-[1rem] leading-relaxed text-ivory/75">{g.description}</p>
      <p className="mt-auto text-[0.9rem] text-lavender">{t.minutes(g.minutes)}</p>
    </a>
  );
}

export function GuidesIndexView({ lang }: { lang: Lang }) {
  const t = ui(lang).guidesPage;
  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.h1}>
        <p>{t.intro}</p>
        {t.englishOnly ? <p className="text-[1rem] text-lavender">{t.englishOnly}</p> : null}
      </PageIntro>
      <section className="section">
        <Container>
          <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2" role="list">
            {guides.map((g) => (
              <li key={g.slug}>
                <GuideCard g={g} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

export function GuideView({ slug }: { slug: string }) {
  const g = findGuide(slug);
  if (!g) return null;
  const t = ui("en").guidesPage;
  const others = guides.filter((x) => x.slug !== slug);
  return (
    <article>
      <header className="border-b border-gold/10">
        <Container narrow className="flex flex-col gap-6 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] text-lavender">
            <a href={href("en", routes.guides)} className="link-k">
              {t.all}
            </a>
            <span aria-hidden="true" className="mx-2 text-ivory/40">
              /
            </span>
            <span>{g.eyebrow}</span>
          </nav>
          <h1 className="display-2 text-ivory">{g.title}</h1>
          <p className="text-[0.95rem] text-lavender">
            {t.minutes(g.minutes)} · {t.updated} <time dateTime={g.updated}>{dateFmt(g.updated)}</time> · Khram
          </p>
          <p className="lede text-ivory/85">{g.lede}</p>
        </Container>
        <Container narrow className="pb-12 md:pb-16">
          <div className="frame bg-navy p-2">
            <img src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height} fetchPriority="high" className="h-auto w-full" />
          </div>
        </Container>
      </header>

      <Container narrow className="guide-body flex flex-col gap-5 py-12 text-[1.1rem] leading-[1.8] text-ivory/90 md:py-16">
        {g.body.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}

        {g.sources.length ? (
          <section aria-labelledby="sources-h" className="mt-10 border-t border-gold/15 pt-8">
            <h2 id="sources-h" className="eyebrow mb-4">
              {t.sources}
            </h2>
            <ol className="flex flex-col gap-2 text-[0.9rem] leading-relaxed text-ivory/70">
              {g.sources.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} className="link-k" {...external}>
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </Container>

      <section className="band-navy section" aria-labelledby="more-h">
        <Container className="flex flex-col gap-10">
          <h2 id="more-h" className="display-2">
            {t.keepReading}
          </h2>
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-3" role="list">
            {others.map((o) => (
              <li key={o.slug}>
                <GuideCard g={o} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </article>
  );
}
