import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { href, routes } from "@/lib/utils";

/**
 * The home page is one journey down a single painting: night sky → light → horizon → sea.
 * `SkyJourney` is that painting, fixed behind the page. public/site.js tilts it down as you scroll,
 * using each section's `data-sky-stop` (0 = top of the sky, 1 = deep water) so every section always
 * sits on the same part of the painting, on any screen size. Art: Bank's sky-to-sea painting,
 * upscaled, sea extended, upper clouds cut to their own layer so they can drift (see docs/SKY-JOURNEY.md).
 */
export function SkyJourney() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-col" data-sky-col>
        <picture>
          <source media="(max-width: 820px)" srcSet="/images/sky/sky-top-m.webp" />
          <img className="sky-top" src="/images/sky/sky-top-d.webp" alt="" width={2048} height={2168} fetchPriority="high" decoding="async" />
        </picture>
        <picture>
          <source media="(max-width: 820px)" srcSet="/images/sky/sky-bottom-m.webp" />
          <img className="sky-bottom" src="/images/sky/sky-bottom-d.webp" alt="" width={2048} height={2168} loading="lazy" decoding="async" />
        </picture>
        <picture>
          <source media="(max-width: 820px)" srcSet="/images/sky/sky-clouds-m.webp" />
          <img className="sky-clouds" src="/images/sky/sky-clouds-d.webp" alt="" width={1600} height={1031} decoding="async" />
        </picture>
      </div>
    </div>
  );
}

/** A moon at a given phase (0 = dark, 1 = full), lit from the right like a waxing moon. Decorative. */
export function MoonPhase({ lit, className }: { lit: number; className?: string }) {
  const cx = 50;
  const cy = 50;
  const r = 34;
  const rx = Math.abs(1 - 2 * lit) * r;
  const sweep = lit > 0.5 ? 1 : 0;
  const litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      <circle cx={cx} cy={cy} r={r * 1.55} fill="#D9B584" opacity={0.05 + lit * 0.12} />
      <circle cx={cx} cy={cy} r={r} fill="#101C3D" stroke="#D6AD82" strokeOpacity="0.5" strokeWidth="1" />
      {lit > 0 ? <path d={litPath} fill="#D9B584" /> : null}
    </svg>
  );
}

const phases = [0, 0.3, 0.72];

export function Hero({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="hero-sky" aria-labelledby="hero-h" data-sky-stop="0">
      <Container className="hero-grid">
        <div className="hero-copy flex min-w-0 flex-col gap-7">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-h" className="display-hero">
            {t.hero.h1}
          </h1>
          <p className="lede measure text-ivory/90">{t.hero.lede}</p>
          <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <ButtonLink href={href(lang, routes.collections)}>{t.hero.primary}</ButtonLink>
            <ButtonLink href={href(lang, routes.product("seven-nights"))} variant="ghost">
              {t.hero.secondary}
            </ButtonLink>
          </div>
        </div>
        <figure className="hero-art flex min-w-0 flex-col gap-4">
          <div className="frame bg-night p-2 sm:p-3">
            <img src="/images/art/indigo-moon.webp" alt={t.hero.artAlt} width={1400} height={1120} fetchPriority="high" className="reveal-art h-auto w-full" />
          </div>
          <figcaption className="text-[0.9rem] italic text-ivory/80">{t.hero.caption}</figcaption>
        </figure>
      </Container>
      <span className="scroll-cue" aria-hidden="true" />
    </section>
  );
}

export function Philosophy({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="journey-sec" aria-labelledby="philosophy-h" data-sky-stop="0.08">
      <Container>
        <div className="page-k reveal grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="eyebrow">{t.storyPage.believeEyebrow}</p>
            <h2 id="philosophy-h" className="display-2 text-moon">
              {t.philosophy.h2}
            </h2>
            <p className="lede text-ivory/90">{t.storyPage.beliefs[1]}</p>
            <p className="text-[0.95rem] italic text-lavender">{t.notTherapy}</p>
          </div>
          <ol className="flex flex-col gap-8" role="list">
            {t.story.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[4.25rem_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[5rem_minmax(0,1fr)]">
                <MoonPhase lit={phases[i] ?? 0} className="h-auto w-full" />
                <div className="flex min-w-0 flex-col gap-2 border-t border-gold/20 pt-4">
                  <h3 className="font-display text-[1.1rem] tracking-[0.05em] text-gold">{s.title}</h3>
                  <p className="text-[1rem] leading-relaxed text-ivory/85">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export function Story({ lang }: { lang: Lang }) {
  const t = ui(lang);
  const [lead, ...rest] = t.storyPage.why.slice(0, 6);
  return (
    <section className="journey-sec" aria-labelledby="story-h" data-sky-stop="0.28">
      <Container>
        <article className="page-k page-story reveal grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <p className="eyebrow">{t.storyPage.eyebrow}</p>
            <h2 id="story-h" className="display-quote text-moon">
              {t.story.h2}
            </h2>
            <p className="font-display text-[1.35rem] tracking-[0.04em] text-ivory">{lead}</p>
          </div>
          <div className="flex flex-col gap-5 text-[1.08rem] leading-[1.85] text-ivory/90">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="pt-2">
              <a href={href(lang, routes.ourStory)} className="link-k">
                {t.story.link}
              </a>
            </p>
          </div>
        </article>
      </Container>
    </section>
  );
}

export function Horizon({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="horizon-sec" aria-labelledby="collections-h" data-sky-stop="0.5">
      <Container className="horizon-copy reveal flex flex-col items-center gap-5 text-center">
        <p className="eyebrow">{t.collectionsPreview.eyebrow}</p>
        <h2 id="collections-h" className="display-1">
          {t.collectionsPreview.h2}
        </h2>
        <p className="measure">{t.collectionsPreview.p}</p>
      </Container>
    </section>
  );
}

export function Closing({ lang }: { lang: Lang }) {
  const t = ui(lang);
  return (
    <section className="closing-sea" aria-labelledby="closing-h" data-sky-stop="1">
      <Container className="closing-copy reveal grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-end md:gap-16">
        <div className="flex min-w-0 flex-col gap-5">
          <h2 id="closing-h" className="eyebrow">
            {t.closing.eyebrow}
          </h2>
          <p className="font-body text-[clamp(1.65rem,1.2rem+1.9vw,2.7rem)] italic leading-[1.25] text-ivory">{t.closing.quote}</p>
          <p className="measure text-ivory/85">{t.closing.p}</p>
          <p className="font-display text-[1.15rem] tracking-[0.12em] text-moon">{t.signoff}</p>
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
