import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { href, routes } from "@/lib/utils";

export function Hero({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-h">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30%] -top-[20%] h-[70rem] w-[70rem] max-w-none rounded-full bg-[radial-gradient(closest-side,rgba(217,181,132,0.09),transparent)]"
      />
      <Container className="relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-col gap-7">
          <p className="eyebrow">{t.tagline}</p>
          <h1 id="hero-h" className="display-1 text-ivory">
            {t.hero.h1}
          </h1>
          <p className="lede measure text-ivory/85">{t.hero.lede}</p>
          <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <ButtonLink href={href(lang, routes.collections)}>{t.hero.primary}</ButtonLink>
            <ButtonLink href={href(lang, routes.product("seven-nights"))} variant="ghost">
              {t.hero.secondary}
            </ButtonLink>
          </div>
        </div>
        <figure className="flex min-w-0 flex-col gap-4">
          <div className="frame bg-navy p-2 sm:p-3">
            <img
              src="/images/art/indigo-night.webp"
              alt={t.hero.artAlt}
              width={1000}
              height={700}
              fetchPriority="high"
              className="reveal-art h-auto w-full"
            />
          </div>
          <figcaption className="text-[0.9rem] italic text-lavender">{t.hero.caption}</figcaption>
        </figure>
      </Container>
    </section>
  );
}

export function Philosophy({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="band-navy section" aria-labelledby="philosophy-h">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t.philosophy.eyebrow}</p>
          <h2 id="philosophy-h" className="display-2 text-moon">
            {t.philosophy.h2}
          </h2>
        </div>
        <div className="flex min-w-0 flex-col gap-10">
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-8" role="list">
            {t.philosophy.items.map((p) => (
              <li key={p.title} className="flex flex-col gap-3 border-t border-gold/25 pt-5">
                <h3 className="font-display text-[1.05rem] tracking-[0.06em] text-gold">{p.title}</h3>
                <p className="text-[1rem] leading-relaxed text-ivory/85">{p.text}</p>
              </li>
            ))}
          </ul>
          <p className="text-[0.95rem] italic text-lavender">{t.notTherapy}</p>
        </div>
      </Container>
    </section>
  );
}

const dyeImages = ["/images/dye/vat.webp", "/images/dye/air.webp", "/images/dye/deep.webp"];

export function BrandStory({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="on-paper section" aria-labelledby="story-h">
      <Container>
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t.story.eyebrow}</p>
            <h2 id="story-h" className="display-2">
              {t.story.h2}
            </h2>
          </div>
          <p className="measure text-[1.08rem]">
            <span lang="th">คราม</span> {t.story.p}
          </p>
        </div>

        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8" role="list">
          {t.story.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-5 sm:flex sm:flex-col sm:gap-4">
              <div className="frame p-1">
                <img src={dyeImages[i]} alt={s.alt} width={480} height={480} loading="lazy" className="aspect-square h-auto w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
                <h3 className="flex items-baseline gap-3 font-display text-[1.15rem] tracking-[0.05em]">
                  <span className="text-gold-ink">{i + 1}</span>
                  {s.title}
                </h3>
                <p className="text-[1rem] leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 border-t border-faded-gold/40 pt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:items-end">
          <p className="lede measure">{t.story.lede}</p>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="font-display text-[1.25rem] tracking-[0.12em]">{t.signoff}</p>
            <a href={href(lang, routes.ourStory)} className="link-k">
              {t.story.link}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Closing({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="on-paper section-tight border-t border-faded-gold/30" aria-labelledby="closing-h">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-end md:gap-16">
        <div className="flex min-w-0 flex-col gap-5">
          <h2 id="closing-h" className="eyebrow">
            {t.closing.eyebrow}
          </h2>
          <p className="font-body text-[clamp(1.65rem,1.2rem+1.9vw,2.7rem)] italic leading-[1.25]">{t.closing.quote}</p>
          <p className="measure muted">{t.closing.p}</p>
        </div>
        <div className="flex flex-col gap-3">
          <ButtonLink href={href(lang, routes.product("seven-nights"))}>{t.closing.primary}</ButtonLink>
          <ButtonLink href={href(lang, routes.collection("indigo"))} variant="ghost">
            {t.closing.secondary}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
