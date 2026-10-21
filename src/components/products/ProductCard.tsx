import { Swatch } from "@/components/collections/Swatch";
import { ui } from "@/i18n/ui";
import type { Collection, Lang, Product } from "@/lib/types";
import { href, routes } from "@/lib/utils";

export function ProductCard({ product, lang, collection }: { product: Product; lang: Lang; collection?: Collection }) {
  const t = ui(lang);
  const useSwatch = product.status === "in-progress" && collection && (!product.cover.src || product.cover.src.includes("/swatches/"));
  return (
    <a href={href(lang, routes.product(product.slug))} className="group flex h-full flex-col gap-5 text-inherit no-underline">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-navy p-[9%]">
        {useSwatch && collection ? (
          <div className="absolute inset-0">
            <Swatch collection={collection} />
          </div>
        ) : product.cover.src ? (
          <img
            src={product.cover.src}
            alt={product.cover.alt}
            width={product.cover.width}
            height={product.cover.height}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto object-contain shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:-translate-y-1"
          />
        ) : null}
        {product.status !== "available" ? (
          <span className="chip absolute left-3 top-3" data-status={product.status === "free" ? "available" : "planned"}>
            {t.status.product[product.status]}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="eyebrow">{product.format}</p>
        <h3 className="display-3 tracking-[0.08em] text-ivory transition-colors group-hover:text-gold">{product.name}</h3>
        <p className="text-[0.98rem] text-ivory/80">{product.subtitle}</p>
        <p className="mt-auto pt-2 font-display text-[0.95rem] tracking-[0.08em] text-moon">
          {product.priceLabel}
          {product.store && product.url ? <span className="text-lavender"> · {product.store}</span> : null}
        </p>
      </div>
    </a>
  );
}
