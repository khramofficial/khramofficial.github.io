import type { CSSProperties } from "react";
import { ui } from "@/i18n/ui";
import type { Collection, Lang } from "@/lib/types";
import { href, routes } from "@/lib/utils";
import { Swatch } from "./Swatch";

export function CollectionCard({
  collection,
  lang,
  headingLevel = 3,
}: {
  collection: Collection;
  lang: Lang;
  headingLevel?: 2 | 3;
}) {
  const t = ui(lang);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <a
      href={href(lang, routes.collection(collection.slug))}
      className="swatch-card group flex h-full flex-col gap-5 text-inherit no-underline"
      style={{ "--accent": collection.accent.text } as CSSProperties}
    >
      <div className="relative">
        <Swatch collection={collection} compactOnPhone sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        <span className="chip absolute left-3 top-3" data-status={collection.status}>
          {t.status.collection[collection.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Heading className="display-3 tracking-[0.12em] text-ivory transition-colors group-hover:text-gold">
          {collection.name}
        </Heading>
        <p className="eyebrow" style={{ color: "var(--accent)" }}>
          {collection.theme}
        </p>
        <p className="text-[1rem] leading-relaxed text-ivory/85">{collection.summary}</p>
      </div>
    </a>
  );
}
