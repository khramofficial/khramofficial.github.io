import { ui } from "@/i18n/ui";
import type { ImageAsset, Lang } from "@/lib/types";

/**
 * Main image plus thumbnail buttons. public/site.js swaps the main image on click;
 * without JavaScript the first image still shows.
 */
export function ProductGallery({ images, label, lang }: { images: ImageAsset[]; label: string; lang: Lang }) {
  const t = ui(lang).productPage;
  const [first] = images;
  if (!first) return null;
  const tall = first.height > first.width;
  return (
    <section aria-label={t.images(label)} data-gallery className="flex flex-col gap-4">
      <div className={`frame flex items-center justify-center bg-navy ${tall ? "aspect-[4/5] p-[8%]" : "p-3"}`}>
        <img
          data-gallery-main
          src={first.src}
          alt={first.alt}
          width={first.width}
          height={first.height}
          fetchPriority="high"
          decoding="async"
          className={tall ? "max-h-full w-auto object-contain shadow-[0_22px_50px_-20px_rgba(0,0,0,0.9)]" : "h-auto w-full"}
        />
      </div>
      {images.length > 1 ? (
        <>
          <ul className="flex flex-wrap gap-3" role="list">
            {images.map((im, i) => (
              <li key={`${im.src}-${i}`}>
                <button
                  type="button"
                  className="gallery-thumb flex h-20 w-20 items-center justify-center overflow-hidden bg-navy p-1 sm:h-24 sm:w-24"
                  data-gallery-thumb
                  data-src={im.src}
                  data-alt={im.alt}
                  data-width={im.width}
                  data-height={im.height}
                  aria-pressed={i === 0 ? "true" : "false"}
                  aria-label={t.showImage(i + 1, images.length)}
                >
                  <img src={im.src} alt="" width={im.width} height={im.height} loading="lazy" className="max-h-full w-auto object-contain" />
                </button>
              </li>
            ))}
          </ul>
          <p className="sr-only" aria-live="polite" data-gallery-status />
        </>
      ) : null}
    </section>
  );
}
