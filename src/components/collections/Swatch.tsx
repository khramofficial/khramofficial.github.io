import type { Collection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Motif } from "./Motif";

/** Thread colour per cloth: gold reads on the dark dyes, indigo thread on the light saffron cloth. */
const threads: Record<string, { thread: string; accent: string }> = {
  indigo: { thread: "#D6AD82", accent: "#80B2DB" },
  crimson: { thread: "#EDE6D8", accent: "#D6AD82" },
  saffron: { thread: "#1B2547", accent: "#1B2547" },
  ebony: { thread: "#B9B4AC", accent: "#EDE6D8" },
};

export function Swatch({
  collection,
  className,
  priority = false,
  sizes,
  compactOnPhone = false,
}: {
  collection: Collection;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Shorter 5:4 crop on phones so a column of cards isn't endless */
  compactOnPhone?: boolean;
}) {
  const t = threads[collection.slug] ?? { thread: "#D6AD82", accent: collection.accent.text };
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-navy",
        compactOnPhone ? "aspect-[5/4] min-[520px]:aspect-[4/5]" : "aspect-[4/5]",
        className,
      )}
    >
      {collection.swatch.src ? (
        <img
          src={collection.swatch.src}
          alt={collection.swatch.alt}
          width={collection.swatch.width}
          height={collection.swatch.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {collection.motif ? (
        <div className="pointer-events-none absolute inset-[12%]">
          <Motif name={collection.motif} thread={t.thread} accent={t.accent} />
        </div>
      ) : null}
    </div>
  );
}
