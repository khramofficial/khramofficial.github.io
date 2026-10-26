import { homeText } from "@/i18n/home";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { cn, href, routes } from "@/lib/utils";
import { HeroActions, OfferLine } from "./HomeLive";
import { Icon } from "./Icon";

/*
 * Home page layout from Bank's UX Pilot design (27 Oct 2026), with Khram's real data. The old design lives on in
 * Bank's sky-to-sea painting (night sky in the hero, dawn in Why Khram, the sea under the free sample and the last
 * question) and in the moon phases.
 * Rule (Bank, 27 Oct 05:36): phones show the same content as the desktop site, always. Only the layout changes
 * (stacked columns, swipe rows, the format toggle); every section, line and link is the same on both.
 * Desktop = lg (1024px) and up.
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

/** One line above the header pointing to the free sample. Rendered by the header on the home page. */
export function Announcement({ lang }: { lang: Lang }) {
  const t = homeText(lang).announce;
  return (
    <div className="border-b border-gold/10 bg-navy px-4 py-2.5 text-center text-[13px] leading-snug text-ivory/80 sm:text-sm">
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
      {/* Phones: the painting sits in the picture card, with a soft indigo glow behind the page */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(83,97,199,0.4),transparent_55%)] lg:hidden" />

      <div className="relative mx-auto grid max-w-7xl gap-0 px-5 pb-10 pt-6 sm:px-8 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10 lg:py-16">
        <div className="min-w-0">
          <p className="eyebrow mt-11 text-[0.8rem] text-moon lg:mt-0">{tu.tagline}</p>
          <h1 id="hero-h" className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-[0.02em] text-ivory sm:text-6xl lg:mt-6 lg:text-[4.1rem] lg:leading-[1.08] lg:tracking-[0.04em]">
            {t.h1[0]}
            <span className="text-gold">{t.h1[1]}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ivory/75 lg:mt-6 lg:text-xl lg:text-ivory/80">
            {t.lede[0]}
            <span className="text-ivory">{t.lede[1]}</span>
            {t.lede[2]}
          </p>
          <p className="mt-3 text-[1.05rem] italic text-lavender lg:text-lg">{t.small}</p>
          <HeroActions lang={lang} />
          <OfferLine lang={lang} className="mt-4 text-center text-[0.95rem] text-moon sm:text-left" />
          <ul className="mt-6 flex flex-col gap-2.5 text-[0.92rem] text-ivory/75 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3 lg:mt-8 lg:text-[0.95rem]" role="list">
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

export function Pain({ lang }: { lang: Lang }) {
  const t = homeText(lang).pain;
  return (
    <section id="pain" className="pt-16 pb-14 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-28" aria-labelledby="pain-h">
      <div className="max-w-2xl px-5 sm:px-8 lg:px-0">
        <p className="eyebrow mb-3 text-moon lg:mb-4">{t.eyebrow}</p>
        <h2 id="pain-h" className="h-sec">
          {t.h2[0]}
          <span className="text-gold">{t.h2[1]}</span>
        </h2>
      </div>
      <ul className="no-scrollbar mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0" role="list">
        {t.cards.map((c) => (
          <li key={c.label} className="w-[78%] shrink-0 snap-start rounded-2xl border border-gold/10 bg-navy p-6 transition hover:border-gold/40 sm:w-[46%] lg:w-auto lg:p-7">
            <span className="font-display text-[0.8rem] tracking-[0.2em] text-lavender uppercase">{c.label}</span>
            <p className="mt-3 text-[1.35rem] leading-snug lg:mt-4">
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
      <p className="mt-6 px-5 text-xl italic text-ivory/85 sm:px-8 lg:mt-10 lg:px-0 lg:text-center lg:text-2xl">{t.close}</p>
    </section>
  );
}

/** Why the name. Bank's painting (night opening into dawn) instead of a stock picture. */
export function WhyKhram({ lang }: { lang: Lang }) {
  const t = homeText(lang).why;
  return (
    <section id="story" className="relative scroll-mt-16 border-y border-gold/10 bg-navy/50" aria-labelledby="why-h">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-gold/20 lg:rounded-[28px]">
            <img src="/images/home/dawn-sky.webp" alt={t.artAlt} width={1200} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/90 to-transparent" />
            <div className="absolute bottom-7 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8">
              <div className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">{t.art}</div>
              <div aria-hidden="true" className="mt-2 h-2 rounded-full bg-gradient-to-r from-night via-[#3b4f8f] to-moon" />
            </div>
          </div>
          <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-full border border-gold/20 bg-night px-4 py-2.5 lg:right-6 lg:px-5">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-navy ring-1 ring-gold/50" />
            <Icon name="arrow" className="h-3 w-3 text-ivory/50" />
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-moon" />
            <span className="text-sm italic text-ivory/80">{t.chip}</span>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4 text-moon">{t.eyebrow}</p>
          <h2 id="why-h" className="font-deco text-[2.4rem] leading-[1.15] text-gold lg:text-5xl">
            {t.h2}
          </h2>
          {t.p.map((p) => (
            <p key={p} className="mt-5 text-[1.05rem] leading-relaxed text-ivory/80 first-of-type:mt-6 lg:mt-6 lg:text-lg lg:first-of-type:mt-7">
              {p}
            </p>
          ))}
          <ol className="mt-8 grid grid-cols-3 gap-2 text-center lg:gap-3" role="list">
            {t.steps.map((s, i) => (
              <li key={s.a} className="flex flex-col items-center rounded-xl border border-gold/15 px-1.5 py-4 lg:px-2">
                <MoonPhase lit={phases[i] ?? 0} className="mb-2 h-8 w-8" />
                <span className="font-display text-[0.78rem] tracking-[0.12em] text-gold uppercase lg:text-sm lg:tracking-[0.15em]">{s.a}</span>
                <span className="mt-1 text-[0.8rem] italic text-ivory/60 lg:text-[0.85rem]">{s.b}</span>
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
    <section id="product" className="scroll-mt-16 py-14 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-28" aria-labelledby="product-h">
      <div className="grid items-end gap-5 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-0">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-3 text-moon lg:mb-4">{p.eyebrow}</p>
          <h2 id="product-h" className="font-deco text-6xl tracking-[0.06em] text-gold lg:text-8xl">
            INDIGO
          </h2>
          <p className="mt-2 text-xl italic text-lavender lg:mt-3 lg:text-2xl">{subtitle}</p>
        </div>
        <p className="text-[1.05rem] leading-relaxed text-ivory/80 lg:col-span-5 lg:text-lg">{p.p}</p>
      </div>

      <div className="px-5 sm:px-8 lg:px-0">
        <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/15 bg-navy/40 lg:mt-14 lg:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={s.label} className={cn("flex flex-col-reverse justify-end p-5 sm:p-8", i % 2 === 0 && "border-r border-gold/15", i < 2 && "border-b border-gold/15 lg:border-b-0", i === 1 && "lg:border-r")}>
              <dt className="mt-1 text-[0.85rem] text-ivory/70 lg:mt-2 lg:text-base">{s.label}</dt>
              <dd className="font-display text-4xl text-gold lg:text-5xl">
                {s.fig}
                {s.small ? <span className="text-xl text-ivory/50 lg:text-2xl">{s.small}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div id="inside" className="mt-14 scroll-mt-20 lg:mt-20">
        <div className="flex flex-col gap-3 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-4 lg:px-0">
          <div>
            <p className="eyebrow mb-3 text-moon">{ins.eyebrow}</p>
            <h3 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[0.03em] lg:text-4xl">{ins.h2}</h3>
          </div>
          <p className="max-w-md text-[1rem] text-ivory/70">{ins.p}</p>
        </div>
        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0" role="list">
          {ins.pages.map((pg) => (
            <li key={pg.src} className="w-[62%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
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

      <ol id="acts" className="mt-12 space-y-3 px-5 sm:px-8 lg:mt-20 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0 lg:px-0" role="list">
        {t.acts.map((a, i) => (
          <li key={a.n} className="flex gap-4 rounded-2xl border border-gold/10 bg-navy p-5 lg:block lg:p-7">
            <span className={cn("w-8 shrink-0 font-deco text-2xl lg:text-3xl", i === 2 ? "text-moon" : "text-butterfly")}>{a.n}</span>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-[0.1em] text-gold uppercase lg:mt-3 lg:text-xl lg:tracking-[0.12em]">{a.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-ivory/75 lg:mt-2 lg:text-base">{a.text}</p>
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
    <section id="from-the-pages" className="py-14 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-28" aria-labelledby="pages-h">
      <div className="flex flex-col gap-5 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-0">
        <div>
          <p className="eyebrow mb-3 text-moon lg:mb-4">{t.eyebrow}</p>
          <h2 id="pages-h" className="h-sec">
            {t.h2[0]}
            <span className="text-gold">{t.h2[1]}</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-display text-5xl text-gold lg:text-6xl">{t.fig}</div>
          <div className="max-w-[12rem] leading-snug text-ivory/65">{t.figLabel}</div>
        </div>
      </div>
      <ul className="no-scrollbar mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:scroll-px-8 sm:px-8 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0" role="list">
        {t.items.map((it, i) => (
          <li key={it.q} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto">
            <figure className="flex h-full flex-col rounded-2xl border border-gold/10 bg-navy p-6 lg:p-7">
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

export function Faq({ lang }: { lang: Lang }) {
  const t = homeText(lang).faq;
  return (
    <section id="faq" className="scroll-mt-16 border-y border-gold/10 bg-navy/40" aria-labelledby="faq-h">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-28">
        <p className="eyebrow mb-4 text-center text-moon">{t.eyebrow}</p>
        <h2 id="faq-h" className="h-sec text-center">
          {t.h2}
        </h2>
        <div className="mt-8 divide-y divide-gold/15 border-y border-gold/15 lg:mt-12">
          {t.items.map((it, i) => (
            <details key={it.q} className="home-qa py-5 lg:py-6" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-xl lg:text-2xl">
                {it.q}
                <Icon name="plus" className="qa-icon h-3.5 w-3.5 shrink-0 text-moon transition-transform" />
              </summary>
              <p className="mt-2 text-[1rem] leading-relaxed text-ivory/70 lg:mt-3 lg:text-lg">{it.a}</p>
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
