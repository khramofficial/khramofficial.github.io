import { BuyBar, Collections, FinalCta, Formats, FreeSample, Platforms, ProofStrip } from "@/components/home/HomeLive";
import { Faq, FromThePages, Hero, Pain, Product, WhyKhram } from "@/components/home/HomeStatic";
import { buildCatalog, findProduct } from "@/lib/catalog";
import type { Lang } from "@/lib/types";

/**
 * Home, laid out like Bank's UX Pilot design (27 Oct 2026), same sections and content on every screen size
 * (Bank, 27 Oct 05:36: the phone version always matches the main site):
 * hero → stores (desktop bar / phone strip, same links) → who it's for → why Khram → INDIGO (numbers, inside, Acts)
 * → formats → from the pages → collections → 7 Nights free → FAQ → tonight's question; phones add a slim buy bar.
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
      <Collections lang={lang} />
      <FreeSample lang={lang} />
      <Faq lang={lang} />
      <FinalCta lang={lang} />
      <BuyBar lang={lang} />
    </div>
  );
}
