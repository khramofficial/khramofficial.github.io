import { ButtonLink, DisabledButton } from "@/components/ui/Button";
import { ui } from "@/i18n/ui";
import type { Lang, Product } from "@/lib/types";
import { external } from "@/lib/utils";

/**
 * Purchase happens on the store that sells the item (Gumroad, Amazon…).
 * Items without a live link show a clearly disabled button. Nothing here takes payment.
 */
export function BuyBox({ product, lang, amazonAuthor }: { product: Product; lang: Lang; amazonAuthor: string }) {
  const t = ui(lang);
  return (
    <div className="flex flex-col gap-5 border-y border-gold/20 py-6" data-product={product.slug}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-display text-[1.6rem] tracking-[0.04em] text-moon">
          {product.priceLabel}
          {product.status === "free" ? <span className="ml-2 text-base text-lavender">{t.productPage.payWhatYouWant}</span> : null}
        </p>
        <p className="eyebrow text-lavender">{t.status.product[product.status]}</p>
      </div>
      {product.url ? (
        <ButtonLink
          href={product.url}
          external={t.newTab}
          className="w-full sm:w-auto sm:self-start"
          track={`${product.slug}:${product.store ?? "store"}`}
        >
          {product.ctaLabel}
        </ButtonLink>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DisabledButton>{product.ctaLabel}</DisabledButton>
          {amazonAuthor ? (
            <a href={amazonAuthor} className="link-k text-[1rem]" {...external}>
              {t.productPage.followAmazon}
              <span className="sr-only"> {t.newTab}</span>
            </a>
          ) : null}
        </div>
      )}
      <ul className="flex flex-col gap-1.5 text-[0.95rem] text-ivory/80" role="list">
        {product.notes.map((n) => (
          <li key={n} className="flex gap-2.5">
            <span aria-hidden="true" className="text-gold">
              ·
            </span>
            {n}
          </li>
        ))}
        {t.inEnglish ? (
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="text-gold">
              ·
            </span>
            {t.inEnglish}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
