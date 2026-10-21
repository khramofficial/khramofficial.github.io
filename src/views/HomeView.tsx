import { CollectionsPreview, FeaturedJournal, FreeStart } from "@/components/home/HomeLive";
import { BrandStory, Closing, Hero, Philosophy } from "@/components/home/HomeStatic";
import type { Lang } from "@/lib/types";

export function HomeView({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <Philosophy lang={lang} />
      <CollectionsPreview lang={lang} />
      <FeaturedJournal lang={lang} />
      <FreeStart lang={lang} />
      <BrandStory lang={lang} />
      <Closing lang={lang} />
    </>
  );
}
