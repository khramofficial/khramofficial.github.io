import type { Collection, Lang } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CollectionCard } from "./CollectionCard";

export function CollectionGrid({
  items,
  lang,
  headingLevel = 3,
  columns = 4,
}: {
  items: Collection[];
  lang: Lang;
  headingLevel?: 2 | 3;
  columns?: 3 | 4;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-12",
        columns === 4 ? "min-[520px]:grid-cols-2 lg:grid-cols-4" : "min-[600px]:grid-cols-3",
      )}
      role="list"
    >
      {items.map((c) => (
        <li key={c.slug} className="min-w-0">
          <CollectionCard collection={c} lang={lang} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
