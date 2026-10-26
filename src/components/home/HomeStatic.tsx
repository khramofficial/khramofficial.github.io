import { homeText } from "@/i18n/home";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { cn, href, routes } from "@/lib/utils";
import { HeroActions, OfferLine } from "./HomeLive";
import { Icon } from "./Icon";

/*
 * Home page layout from Bank's UX Pilot design (27 Oct 2026): desktop and phone screens, section order and links as drawn,
 * with Khram's real data. The old design lives on in Bank's sky-to-sea painting (night sky in the hero, dawn in Why Khram,
 * the sea under the free sample and the last question) and in the moon phases.
 * Desktop = lg (1024px) and up. Below that the phone layout runs, a little wider on tablets.
 */

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

const phases = [0, 0.35, 0.75];

/** Desktop only: one line above the header pointing to the free sample. Rendered by the header on the home page. */
export function Announcement({ lang }: { lang: Lang }) {
  const t = homeText(lang).announce;
  return (
    <div className="hidden border-b border-gold/10 bg-navy px-4 py-2.5 text-center text-sm text-ivory/80 lg:block">
      <Icon name="moon" className="mr-2 inline h-3.5 w-3.5 align-[-2px] text-moon" />
      {t.lead}{" "}
      <a href="#free-sample" className="text-moon underline decoration-moon/50 underline-offset-4 hover:decoration-moon">
        {t.link}
      </a>
    </div>
  );
}

export function Hero({ lang }: { lang: Lang }) {
  const t = homeText(lang).hero;
  const tu = ui(lang);
  return (
    <section id="hero" className="hero relative overflow-hidden" aria-labelledby="hero-h">
      {/* Desktop: Bank's night sky behind everything, darkened from the left where the words are */}
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        <img src="/images/home/night-sky-d.webp" alt="" width={1920} height={1125} fetchPriority="high" className="hero-sky h-full w-full object-cover object-[60%_0%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-night/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>
      {/* Phones: a soft indigo glow instead */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(83,97,199,0.4),transparent_55%)] lg:hidden" />

      <div className="relative mx-auto grid max-w-7xl gap-0 px-5 pb-10 pt-6 sm:px-8 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10 lg:py-16">
        <div className="min-w-0">
          <p className="eyebrow hidden text-[0.8rem] text-moon lg:block">{tu.tagline}</p>
          <p className="mt-11 inline-flex items-center gap-2 rounded-full border border-ivory/10 bg-ivory/5 px-3 py-1 text-[0.75rem] text-ivory/70 lg:hidden">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-moon" />
            {t.tag}
          </p>
          <h1 id="hero-h" className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-[0.02em] text-ivory sm:text-6xl lg:mt-6 lg:text-[4.1rem] lg:leading-[1.08] lg:tracking-[0.04em]">
            {t.h1[0]}
            <span className="text-gold">{t.h1[1]}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ivory/75 lg:mt-6 lg:text-xl lg:text-ivory/80">
            {t.lede[0]}
            <span className="text-ivory">{t.lede[1]}</span>
            {t.lede[2]}
          </p>
          <p className="mt-3 hidden text-lg italic text-lavender lg:block">{t.small}</p>
          <HeroActions lang={lang} />
          <OfferLine lang={lang} className="mt-4 text-center text-[0.95rem] text-moon sm:text-left" />
          <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[0.8rem] text-ivory/65 lg:hidden" role="list">
            {t.trustShort.map((item, i) => (
              <li key={item} className="flex items-center gap-1.5">
                <Icon name={(["shield", "bolt", "book"] as const)[i] ?? "check"} className="h-3.5 w-3.5 text-moon" />
                {item}
              </li>
            ))}
          </ul>
          <ul className="mt-8 hidden flex-wrap gap-x-7 gap-y-3 text-[0.95rem] text-ivory/75 lg:flex" role="list">
            {t.trust.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                <Icon name={(["shield", "tablet", "book"] as const)[i] ?? "check"} className="h-4 w-4 text-moon" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden max-w-lg items-center gap-4 border-t border-gold/15 pt-7 lg:flex">
            <img src="/images/brand/khram-badge.webp" alt="" width={56} height={56} className="h-11 w-11 rounded-full ring-2 ring-night" />
            <div>
              <div className="font-display text-[0.8rem] tracking-[0.18em] text-gold uppercase">{t.maker}</div>
              <div className="text-[0.95rem] text-ivory/70">{t.makerSub}</div>
            </div>
          </div>
        </div>

        <figure className="relative order-first lg:order-none">
          <div className="hero-art relative overflow-hidden rounded-3xl ring-1 ring-ivory/10 lg:overflow-visible lg:rounded-none lg:ring-0">
            <picture className="lg:hidden">
              <img src="/images/home/night-sky-m.webp" alt="" width={960} height={720} className="absolute inset-0 h-full w-full object-cover" />
            </picture>
            <img
              src="/images/products/indigo-hero-books.webp"
              alt={t.artAlt}
              width={1500}
              height={1300}
              fetchPriority="high"
              className="hero-books relative mx-auto h-auto w-[78%] py-5 lg:w-full lg:py-0"
            />
          </div>
          <figcaption className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-ivory/10 bg-night/95 px-4 py-3 backdrop-blur lg:-bottom-2 lg:left-auto lg:right-0 lg:max-w-[22rem]">
            <Icon name="moon" className="h-4 w-4 shrink-0 text-moon" />
            <span className="text-[1.05rem] italic leading-tight">{t.quote}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Phones: who makes it and where you buy, in one strip under the hero (desktop has this inside the hero and the platform bar). */
export function ProofStrip({ lang }: { lang: Lang }) {
  const t = homeText(lang).hero;
  return (
    <div className="mx-5 flex items-center gap-3 rounded-2xl border border-ivory/5 bg-navy/70 px-4 py-4 sm:mx-8 lg:hidden">
      <img src="/images/brand/khram-badge.webp" alt="" width={56} height={56} className="h-9 w-9 shrink-0 rounded-full" />
      <div className="min-w-0 text-[0.8rem] leading-snug">
        <div className="font-display tracking-[0.12em] text-gold uppercase">{t.maker}</div>
        <div className="text-ivory/65">{t.makerSub}</div>
      </div>
      <div className="ml-auto flex shrink-0 flex-col items-end text-[0.75rem] leading-tight text-ivory/70">
        <span>Gumroad</span>
        <span>Amazon</span>
      </div>
    </div>
  );
}

/** Desktop: where checkout happens. */
export function Platforms({ lang }: { lang: Lang }) {
  const t = homeText(lang).platforms;
  return (
    <section aria-label={t.label} className="hidden border-y border-gold/10 bg-navy/60 lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-8 py-6 text-[0.95rem] text-ivory/70">
        <span className="eyebrow text-[0.7rem] text-gold">{t.label}</span>
        <div className="flex items-center gap-12 font-display text-xl tracking-[0.06em] text-ivory/85">
          <span>Gumroad</span>
          <span>Amazon</span>
        </div>
        <span className="flex items-center gap-2">
          <Icon name="lock" className="h-3.5 w-3.5 text-moon" />
          {t.note}
        </span>
      </div>
    </section>
  );
}

export function Pain({ lang }: { lang: Lang }) {
  const t = homeText(lang).pain;
  return (
    <section id="pain" className="pt-16 pb-4 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-28" aria-labelledby="pain-h">
      <div className="max-w-2xl px-5 sm:px-8 lg:px-0">
        <p className="eyebrow mb-3 text-moon lg:mb-4">{t.eyebrow}</p>
        <h2 id="pain-h" className="h-sec">
          {t.h2[0]}
          <em className="font-body font-normal text-ivory/60 lg:font-display lg:font-semibold lg:not-italic lg:text-gold">{t.h2[1]}</em>
        </h2>
      </div>
      <ul className="no-scrollbar mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0" role="list">
        {t.cards.map((c) => (
          <li key={c.label} className="w-[78%] shrink-0 snap-start rounded-2xl border border-gold/10 bg-navy p-6 transition hover:border-gold/40 sm:w-[46%] lg:w-auto lg:p-7">
            <span className="font-display text-[0.8rem] tracking-[0.2em] text-moon uppercase lg:text-lavender">{c.label}</span>
            <p className="mt-3 text-[1.45rem] leading-snug lg:mt-4 lg:text-[1.35rem]">
              {c.text.map((part, i) =>
                i % 2 === 1 ? (
                  <em key={part} className="text-gold">
                    {part}
                  </em>
                ) : (
                  <span key={part}>{part}</span>
                ),
              )}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 px-5 text-xl text-ivory/90 sm:px-8 lg:mt-10 lg:px-0 lg:text-center lg:text-2xl lg:italic lg:text-ivory/85">{t.close}</p>
    </section>
  );
}

/** Desktop: why the name. Bank's painting (night opening into dawn) instead of a stock picture. */
export function WhyKhram({ lang }: { lang: Lang }) {
  const t = homeText(lang).why;
  return (
    <section id="story" className="relative hidden border-y border-gold/10 bg-navy/50 lg:block" aria-labelledby="why-h">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-16 px-8 py-28">
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] ring-1 ring-gold/20">
            <img src="/images/home/dawn-sky.webp" alt={t.artAlt} width={1200} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/90 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">{t.art}</div>
              <div aria-hidden="true" className="mt-2 h-2 rounded-full bg-gradient-to-r from-night via-[#3b4f8f] to-moon" />
            </div>
          </div>
          <div className="absolute -bottom-5 right-6 flex items-center gap-3 rounded-full border border-gold/20 bg-night px-5 py-2.5">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-navy ring-1 ring-gold/50" />
            <Icon name="arrow" className="h-3 w-3 text-ivory/50" />
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-moon" />
            <span className="text-sm italic text-ivory/80">{t.chip}</span>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-moon">{t.eyebrow}</p>
          <h2 id="why-h" className="font-deco text-5xl leading-[1.15] text-gold">
            {t.h2}
          </h2>
          {t.p.map((p) => (
            <p key={p} className="mt-6 text-lg leading-relaxed text-ivory/80 first-of-type:mt-7">
              {p}
            </p>
          ))}
          <ol className="mt-8 grid grid-cols-3 gap-3 text-center" role="list">
            {t.steps.map((s, i) => (
              <li key={s.a} className="flex flex-col items-center rounded-xl border border-gold/15 px-2 py-4">
                <MoonPhase lit={phases[i] ?? 0} className="mb-2 h-8 w-8" />
                <span className="font-display text-sm tracking-[0.15em] text-gold uppercase">{s.a}</span>
                <span className="mt-1 text-[0.85rem] italic text-ivory/60">{s.b}</span>
              </li>
            ))}
          </ol>
          <a href={href(lang, routes.ourStory)} className="mt-8 inline-flex items-center gap-2 border-b border-moon/40 pb-1 font-display text-[12px] tracking-[0.2em] text-moon uppercase no-underline transition hover:border-moon">
            {t.link}
            <Icon name="arrow" className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

/** INDIGO itself: what it is, the numbers, real pages, the three Acts. */
export function Product({ lang, subtitle }: { lang: Lang; subtitle: string }) {
  const t = homeText(lang);
  const p = t.product;
  const ins = t.inside;
  return (
    <section id="product" className="mt-12 scroll-mt-16 border-y border-ivory/5 bg-navy/60 px-5 py-14 sm:px-8 lg:mx-auto lg:mt-0 lg:max-w-7xl lg:border-0 lg:bg-transparent lg:px-8 lg:py-28" aria-labelledby="product-h">
      <div className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-3 text-moon lg:mb-4">{p.eyebrow}</p>
          <h2 id="product-h" className="font-deco text-6xl tracking-[0.06em] text-ivory lg:text-8xl lg:text-gold">
            INDIGO
          </h2>
          <p className="mt-2 text-xl italic text-lavender lg:mt-3 lg:text-2xl">{subtitle}</p>
        </div>
        <p className="hidden text-lg leading-relaxed text-ivory/80 lg:col-span-5 lg:block">{p.p}</p>
      </div>

      <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/15 bg-night/40 lg:mt-14 lg:grid-cols-4 lg:bg-navy/40">
        {p.stats.map((s, i) => (
          <div key={s.label} className={cn("flex flex-col-reverse justify-end p-5 sm:p-8", i % 2 === 0 && "border-r border-gold/15", i < 2 && "border-b border-gold/15 lg:border-b-0", i === 1 && "lg:border-r")}>
            <dt className="mt-1 text-[0.8rem] text-ivory/65 lg:mt-2 lg:text-base lg:text-ivory/70">{s.label}</dt>
            <dd className="font-display text-4xl text-moon lg:text-5xl lg:text-gold">
              {s.fig}
              {s.small ? <span className="text-xl text-ivory/50 lg:text-2xl">{s.small}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div id="inside" className="scroll-mt-20">
        <img src="/images/products/indigo-inside.webp" alt={ins.overviewAlt} width={1280} height={720} loading="lazy" className="mt-8 aspect-video w-full rounded-2xl object-cover ring-1 ring-ivory/10 lg:hidden" />
        <div className="mt-20 hidden lg:block">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3 text-moon">{ins.eyebrow}</p>
              <h3 className="font-display text-4xl font-semibold tracking-[0.03em]">{ins.h2}</h3>
            </div>
            <p className="max-w-md text-ivory/70">{ins.p}</p>
          </div>
          <ul className="mt-10 grid grid-cols-3 gap-6" role="list">
            {ins.pages.map((pg) => (
              <li key={pg.src}>
                <figure>
                  <img src={pg.src} alt={pg.alt} width={640} height={967} loading="lazy" className="mx-auto h-auto w-full max-w-[19rem] rounded-xl shadow-2xl ring-1 ring-gold/25" />
                  <figcaption className="mt-4 text-center">
                    <span className="font-display text-[11px] tracking-[0.25em] text-gold uppercase">{pg.title}</span>
                    <span className="block text-sm italic text-ivory/60">{pg.note}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ol id="acts" className="mt-6 space-y-3 lg:mt-20 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0" role="list">
        {t.acts.map((a, i) => (
          <li key={a.n} className="flex gap-4 rounded-2xl border border-ivory/5 bg-night/60 p-5 lg:block lg:border-gold/10 lg:bg-navy lg:p-7">
            <span className={cn("w-8 shrink-0 font-deco text-2xl lg:text-3xl", i === 2 ? "text-moon" : "text-butterfly")}>{a.n}</span>
            <div>
              <h3 className="font-display text-xl lg:mt-3 lg:font-semibold lg:tracking-[0.12em] lg:text-gold lg:uppercase">{a.title}</h3>
              <p className="mt-0.5 text-[0.9rem] text-ivory/65 lg:mt-2 lg:text-base lg:leading-relaxed lg:text-ivory/75">{a.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Real questions from the book, in the slot the design kept for reviews (there are no reviews yet). */
export function FromThePages({ lang }: { lang: Lang }) {
  const t = homeText(lang).pages;
  return (
    <section id="from-the-pages" className="border-y border-ivory/5 bg-navy/60 py-14 lg:mx-auto lg:max-w-7xl lg:border-0 lg:bg-transparent lg:px-8 lg:py-28" aria-labelledby="pages-h">
      <div className="flex items-end justify-between gap-6 px-5 sm:px-8 lg:px-0">
        <div>
          <p className="eyebrow mb-3 text-moon lg:mb-4">{t.eyebrow}</p>
          <h2 id="pages-h" className="h-sec">
            {t.h2[0]}
            <em className="font-body font-normal text-ivory/60 lg:font-display lg:font-semibold lg:not-italic lg:text-gold">{t.h2[1]}</em>
          </h2>
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <div className="font-display text-6xl text-gold">{t.fig}</div>
          <div className="max-w-[12rem] leading-snug text-ivory/65">{t.figLabel}</div>
        </div>
      </div>
      <ul className="no-scrollbar mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:scroll-px-8 sm:px-8 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0" role="list">
        {t.items.map((it, i) => (
          <li key={it.q} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto">
            <figure className="flex h-full flex-col rounded-2xl border border-gold/10 bg-night/70 p-6 lg:bg-navy lg:p-7">
              <MoonPhase lit={phases[i] ?? 0.5} className="h-7 w-7" />
              <blockquote className="mt-4 flex-1 text-xl italic leading-relaxed">{it.q}</blockquote>
              <figcaption className="mt-6 border-t border-gold/10 pt-5">
                <div className="font-display text-sm tracking-[0.1em]">{it.tag}</div>
                <div className="text-sm italic text-ivory/55">{t.source}</div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Phones: what Khram believes (desktop has the Why Khram band higher up instead). */
export function Believe({ lang }: { lang: Lang }) {
  const t = homeText(lang).believe;
  return (
    <section id="believe" className="px-5 py-14 sm:px-8 lg:hidden" aria-labelledby="believe-h">
      <p className="eyebrow mb-3 text-moon">{t.eyebrow}</p>
      <h2 id="believe-h" className="font-display text-[2.2rem] font-semibold leading-[1.08]">
        {t.h2[0]}
        <em className="font-body text-moon">{t.h2[1]}</em>
      </h2>
      <p className="mt-4 text-[1rem] leading-relaxed text-ivory/70">{t.p}</p>
      <ol className="mt-6" role="list">
        {t.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-4 border-b border-ivory/5 py-3">
            <MoonPhase lit={phases[i] ?? 0} className="h-7 w-7 shrink-0" />
            <span className="font-display text-sm text-moon">0{i + 1}</span>
            <strong className="font-body text-lg font-normal">{s}</strong>
          </li>
        ))}
      </ol>
      <a href={href(lang, routes.ourStory)} className="mt-6 inline-flex items-center gap-2 border-b border-moon/50 pb-1 text-[0.95rem] text-ivory no-underline">
        {t.link}
        <Icon name="arrow" className="h-3 w-3" />
      </a>
    </section>
  );
}

export function Faq({ lang }: { lang: Lang }) {
  const t = homeText(lang).faq;
  return (
    <section id="faq" className="scroll-mt-16 lg:border-y lg:border-gold/10 lg:bg-navy/40" aria-labelledby="faq-h">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-28">
        <p className="eyebrow mb-4 hidden text-center text-moon lg:block">{t.eyebrow}</p>
        <h2 id="faq-h" className="h-sec lg:text-center">
          {t.h2}
        </h2>
        <div className="mt-6 divide-y divide-ivory/10 border-y border-ivory/10 lg:mt-12 lg:divide-gold/15 lg:border-gold/15">
          {t.items.map((it, i) => (
            <details key={it.q} className="home-qa py-5 lg:py-6" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-xl lg:text-2xl">
                {it.q}
                <Icon name="plus" className="qa-icon h-3.5 w-3.5 shrink-0 text-moon transition-transform" />
              </summary>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/70 lg:mt-3 lg:text-lg">{it.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center">
          <a href={href(lang, routes.faq)} className="link-k text-[1rem]">
            {t.more}
          </a>
        </p>
      </div>
    </section>
  );
}
