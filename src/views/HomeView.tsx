import { BuyBar, CollectionsPreview, FeaturedJournal, FreeStart } from "@/components/home/HomeLive";
import { Closing, Hero, Horizon, Inside, Philosophy, SkyJourney, Story, WhoFor } from "@/components/home/HomeStatic";
import type { Lang } from "@/lib/types";

/**
 * One continuous journey down the painting, ordered to sell: hero (what it is, price, one button) → INDIGO buy block →
 * real inside pages → who it's for → why Khram → our story → horizon (collections intro) → collections → 7 Nights free → close.
 * The phone buy bar sits outside the journey because .journey clips everything fixed inside it.
 */
export function HomeView({ lang }: { lang: Lang }) {
  return (
    <>
      <div className="journey" data-journey>
        <SkyJourney />
        <Hero lang={lang} />
        <FeaturedJournal lang={lang} />
        <Inside lang={lang} />
        <WhoFor lang={lang} />
        <Philosophy lang={lang} />
        <Story lang={lang} />
        <Horizon lang={lang} />
        <CollectionsPreview lang={lang} />
        <FreeStart lang={lang} />
        <Closing lang={lang} />
      </div>
      <BuyBar lang={lang} />
    </>
  );
}
