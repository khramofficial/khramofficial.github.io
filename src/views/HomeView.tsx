import { CollectionsPreview, FeaturedJournal, FreeStart } from "@/components/home/HomeLive";
import { Closing, Hero, Horizon, Philosophy, SkyJourney, Story } from "@/components/home/HomeStatic";
import type { Lang } from "@/lib/types";

/** One continuous journey: sky (hero, philosophy, story) → horizon (collections intro) → sea (journals, close). */
export function HomeView({ lang }: { lang: Lang }) {
  return (
    <div className="journey" data-journey>
      <SkyJourney />
      <Hero lang={lang} />
      <Philosophy lang={lang} />
      <Story lang={lang} />
      <Horizon lang={lang} />
      <CollectionsPreview lang={lang} />
      <FeaturedJournal lang={lang} />
      <FreeStart lang={lang} />
      <Closing lang={lang} />
    </div>
  );
}
