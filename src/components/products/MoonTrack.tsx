import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

/** INDIGO's 30-night moon tracker, as a strip: one crescent per night, the first `filled` coloured in. */
export function MoonTrack({ lang, filled = 4, total = 30, className }: { lang: Lang; filled?: number; total?: number; className?: string }) {
  const t = ui(lang).moon;
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="grid grid-cols-10 gap-x-2 gap-y-3 sm:grid-cols-15" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]">
            <path
              d="M15.5 3.2a9 9 0 1 0 5.3 15.2A8 8 0 0 1 15.5 3.2Z"
              fill={i < filled ? "#D9B584" : "none"}
              stroke={i < filled ? "#D9B584" : i % 2 ? "#A68DB6" : "#D6AD82"}
              strokeOpacity={i < filled ? 1 : 0.55}
              strokeWidth="1.1"
            />
          </svg>
        ))}
      </div>
      <figcaption className="text-[0.95rem] text-lavender">
        <span className="text-moon">{t.night(filled, total)}</span> {t.line}
      </figcaption>
    </figure>
  );
}
