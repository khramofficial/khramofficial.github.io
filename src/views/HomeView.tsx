import { BuyBar, Collections, FinalCta, Formats, FreeSample } from "@/components/home/HomeLive";
import { Believe, Faq, FromThePages, Hero, Pain, Platforms, Product, ProofStrip, WhyKhram } from "@/components/home/HomeStatic";
import { buildCatalog, findProduct } from "@/lib/catalog";
import type { Lang } from "@/lib/types";

/**
 * Home, laid out like Bank's UX Pilot design (27 Oct 2026).
 * Desktop: hero → platforms → who it's for → why Khram → INDIGO (numbers, inside, Acts) → formats → from the pages
 *          → collections → 7 Nights free → FAQ → tonight's question.
 * Phones:  hero → proof strip → who it's for → INDIGO → formats → from the pages → what Khram believes → 7 Nights free
 *          → FAQ → tonight's question, with a slim buy bar. Sections that only exist on one layout hide themselves.
 */
export function HomeView({ lang }: { lang: Lang }) {
  const subtitle = findProduct(buildCatalog, "indigo-digital", lang)?.subtitle ?? "A Shadow Work & Emotional Healing Journal";
  return (
    <div className="home" data-home>
      <Hero lang={lang} />
      <ProofStrip lang={lang} />
      <Platforms lang={lang} />
      <Pain lang={lang} />
      <WhyKhram lang={lang} />
      <Product lang={lang} subtitle={subtitle} />
      <Formats lang={lang} />
      <FromThePages lang={lang} />
      <Believe lang={lang} />
      <Collections lang={lang} />
      <FreeSample lang={lang} />
      <Faq lang={lang} />
      <FinalCta lang={lang} />
      <BuyBar lang={lang} />
    </div>
  );
}
