"use client";

import { ui } from "@/i18n/ui";
import { localizeProduct } from "@/lib/catalog";
import type { Lang, Product } from "@/lib/types";
import { useCatalog } from "@/lib/useCatalog";
import { href, routes } from "@/lib/utils";

/*
 * Product categories menu (Bank, 27 Oct: Khram is an umbrella, not only a journal brand).
 * Categories come from the live catalog, so a new product lands in the right group without code:
 * still being made → "In the making", sold on Amazon → "Paperbacks", everything else with a link → "Digital".
 * When another kind of product arrives (tees, bags…), add its category to `kinds` and to `kindOf`.
 */
type Kind = "digital" | "paperback" | "making";
const kinds: Kind[] = ["digital", "paperback", "making"];

const words = {
  en: {
    shop: "Shop",
    digital: { title: "Digital PDFs", note: "Instant download" },
    paperback: { title: "Paperbacks", note: "Printed & shipped by Amazon" },
    making: { title: "In the making", note: "Not for sale yet" },
    all: "All collections",
  },
  th: {
    shop: "ร้านค้า",
    digital: { title: "PDF ดิจิทัล", note: "ดาวน์โหลดได้ทันที" },
    paperback: { title: "เล่มกระดาษ", note: "Amazon พิมพ์และจัดส่ง" },
    making: { title: "กำลังทำ", note: "ยังไม่เปิดขาย" },
    all: "ดูทุกคอลเลกชัน",
  },
} satisfies Record<Lang, unknown>;

function kindOf(p: Product): Kind {
  if (p.status === "in-progress" || p.status === "coming-soon") return "making";
  if (p.store === "Amazon") return "paperback";
  return "digital";
}

function useShop(lang: Lang) {
  const catalog = useCatalog();
  const t = ui(lang);
  const products = catalog.products
    .filter((p) => p.published)
    .sort((a, b) => a.sort - b.sort)
    .map((p) => localizeProduct(p, lang));
  return kinds
    .map((k) => ({
      kind: k,
      items: products
        .filter((p) => kindOf(p) === k)
        .map((p) => {
          const edition = k === "paperback" ? p.format.split("·").pop()?.trim() : k === "making" || p.status !== "free" ? p.format : null;
          const price = p.status === "free" ? t.status.product.free : p.status === "available" ? p.priceLabel : "";
          return { slug: p.slug, name: p.name, edition, price };
        }),
    }))
    .filter((g) => g.items.length > 0);
}

/** Desktop: a "Shop" dropdown in the header. A <details> element, so it opens without JavaScript; site.js closes it on outside clicks. */
export function ShopDropdown({ lang }: { lang: Lang }) {
  const w = words[lang];
  const groups = useShop(lang);
  return (
    <details className="shop-menu relative" data-shop-menu>
      <summary className="nav-link flex cursor-pointer items-center gap-1.5">
        {w.shop}
        <svg aria-hidden="true" viewBox="0 0 12 12" className="shop-caret h-2.5 w-2.5 transition-transform">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </summary>
      <div className="shop-panel">
        <div className="grid grid-cols-3 gap-8">
          {groups.map((g) => (
            <div key={g.kind} className="min-w-0">
              <p className="eyebrow text-[0.68rem] text-moon">{w[g.kind].title}</p>
              <p className="mt-1 text-[0.85rem] italic text-ivory/50">{w[g.kind].note}</p>
              <ul className="mt-4 flex flex-col gap-1" role="list">
                {g.items.map((it) => (
                  <li key={it.slug}>
                    <a href={href(lang, routes.product(it.slug))} className="shop-item">
                      <span className="min-w-0">
                        <span className="block font-display text-[0.92rem] tracking-[0.06em] text-ivory">{it.name}</span>
                        {it.edition ? <span className="block text-[0.85rem] text-ivory/60">{it.edition}</span> : null}
                      </span>
                      {it.price ? <span className="shrink-0 font-display text-[0.85rem] text-gold">{it.price}</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a href={href(lang, routes.collections)} className="link-k mt-6 inline-block text-[0.95rem]">
          {w.all}
        </a>
      </div>
    </details>
  );
}

/** Phones: the same categories at the top of the menu panel. */
export function ShopList({ lang }: { lang: Lang }) {
  const w = words[lang];
  const groups = useShop(lang);
  return (
    <div className="border-b border-gold/12 pb-5 pt-3">
      <p className="eyebrow text-moon">{w.shop}</p>
      {groups.map((g) => (
        <div key={g.kind} className="mt-4">
          <p className="text-[0.8rem] text-lavender">{w[g.kind].title}</p>
          <ul className="mt-1" role="list">
            {g.items.map((it) => (
              <li key={it.slug}>
                <a href={href(lang, routes.product(it.slug))} className="flex items-baseline justify-between gap-4 py-1.5 text-ivory no-underline">
                  <span className="font-display text-[1rem] tracking-[0.05em]">
                    {it.name}
                    {it.edition ? <span className="font-body text-[0.9rem] tracking-normal text-ivory/60"> · {it.edition}</span> : null}
                  </span>
                  {it.price ? <span className="shrink-0 font-display text-[0.85rem] text-gold">{it.price}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
