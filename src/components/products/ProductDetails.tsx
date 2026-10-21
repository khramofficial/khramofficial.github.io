import { ui } from "@/i18n/ui";
import type { Lang, Product } from "@/lib/types";

/** Everything below the fold on a product page, built only from the product's own data. */
export function ProductDetails({ product, lang }: { product: Product; lang: Lang }) {
  const t = ui(lang).productPage;
  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
      <div className="flex min-w-0 flex-col gap-14">
        {product.outline && product.outline.items.length > 0 ? (
          <section aria-labelledby="outline-h">
            <h2 id="outline-h" className="display-3 mb-6 text-gold">
              {product.outline.heading}
            </h2>
            <ol className="flex flex-col" role="list">
              {product.outline.items.map((item) => (
                <li key={item.title} className="grid gap-1 border-t border-gold/15 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
                  <span className="eyebrow pt-1">{item.title}</span>
                  <span className="text-ivory/90">{item.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {product.included.length > 0 ? (
          <section aria-labelledby="included-h">
            <h2 id="included-h" className="display-3 mb-6 text-gold">
              {product.includedHeading || t.whatsInside}
            </h2>
            <ul className="star-list flex flex-col gap-3" role="list">
              {product.included.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {product.howItWorks && product.howItWorks.length > 0 ? (
          <section aria-labelledby="how-h">
            <h2 id="how-h" className="display-3 mb-6 text-gold">
              {t.howItWorks}
            </h2>
            <ol className="flex flex-col gap-4" role="list">
              {product.howItWorks.map((step, i) => (
                <li key={step} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                  <span className="font-display text-lg text-moon" aria-hidden="true">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-14">
        {product.samplePrompts && product.samplePrompts.length > 0 ? (
          <section aria-labelledby="prompts-h" className="frame bg-navy/60 px-6 py-8 sm:px-8">
            <h2 id="prompts-h" className="eyebrow mb-5">
              {t.prompts}
            </h2>
            <ul className="flex flex-col gap-4" role="list" lang="en">
              {product.samplePrompts.map((p) => (
                <li key={p} className="text-[1.15rem] italic leading-snug text-ivory">
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {product.specs.length > 0 ? (
          <section aria-labelledby="specs-h">
            <h2 id="specs-h" className="display-3 mb-6 text-gold">
              {t.details}
            </h2>
            <dl className="spec-list">
              {product.specs.map((s) => (
                <div key={s.label} className="contents">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {product.faq && product.faq.length > 0 ? (
          <section aria-labelledby="pfaq-h">
            <h2 id="pfaq-h" className="display-3 mb-2 text-gold">
              {t.questions}
            </h2>
            <div>
              {product.faq.map((item) => (
                <details key={item.q} className="qa">
                  <summary>{item.q}</summary>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
