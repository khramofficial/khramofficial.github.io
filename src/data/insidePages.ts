import type { ImageAsset, Lang } from "@/lib/types";

/**
 * Sample pages shown on product pages ("A look inside") and on the home "New at Khram" card, per collection.
 * Kept in code (images are bundled with the site), so they show even when the database gallery has only the cover.
 * Pages are rendered from the print interior PDF Bank supplied (bleed trimmed).
 *
 * The Quiet Year: Planner_QuietYear_interior_6x9_bleed.pdf (234 pp), sent by Bank 1 Nov 2026.
 */
export interface InsidePage {
  img: ImageAsset;
  caption: Record<Lang, string>;
}

export interface InsideSet {
  /** A wide picture of the whole book (full cover wrap), used as the main image on the home card. */
  hero?: ImageAsset;
  pages: InsidePage[];
  note: Record<Lang, string>;
}

const qy = (name: string, alt: string, width = 900, height = 1351): ImageAsset => ({
  src: `/images/products/quiet-year-${name}.webp`,
  alt,
  width,
  height,
});

export const insidePages: Record<string, InsideSet> = {
  "quiet-year": {
    hero: {
      src: "/images/products/quiet-year-wrap.webp",
      alt: "The Quiet Year full cover: a white butterfly on the back, PLANNER on the spine, and PLANNER under a gold crescent moon over lavender wildflowers on the front.",
      width: 1600,
      height: 1153,
    },
    pages: [
      {
        img: qy("week", "Week 01 weekly spread: a top 3 for the week, Monday to Sunday with lines for each day, and a Looking Back box.", 1500, 1125),
        caption: { en: "Weekly spread · pages 16–17", th: "หน้ารายสัปดาห์ · หน้า 16–17" },
      },
      {
        img: qy("monthly-calendar", "Monthly calendar page: a blank Monday-to-Sunday grid with a month line, key dates and this month's focus."),
        caption: { en: "Monthly calendar · page 12", th: "ปฏิทินรายเดือน · หน้า 12" },
      },
      {
        img: qy("habit-tracker", "Habit tracker page: ten habit rows across 31 days of boxes."),
        caption: { en: "Habit tracker · page 14", th: "ติดตามนิสัย · หน้า 14" },
      },
      {
        img: qy("mood-energy", "Mood and energy page: one row for each of 31 days with circles rated 1 to 5 and a note line."),
        caption: { en: "Mood & energy · page 15", th: "อารมณ์และพลังงาน · หน้า 15" },
      },
      {
        img: qy("spending", "Spending overview page: income, essentials, flexible, savings and left over boxes above a purchase log."),
        caption: { en: "Spending overview · page 26", th: "สรุปการใช้เงิน · หน้า 26" },
      },
      {
        img: qy("monthly-review", "Monthly review page: what went okay, what was hard, what I learned and what to carry forward."),
        caption: { en: "Monthly review · page 27", th: "ทบทวนประจำเดือน · หน้า 27" },
      },
      {
        img: qy("month-divider", "Month 01 divider page: a painted night sea under a crescent moon, with lines for the month and year."),
        caption: { en: "Month divider · page 11", th: "หน้าคั่นเดือน · หน้า 11" },
      },
    ],
    note: {
      en: "Sample pages from the Full Color Edition. The Black & White Edition has the same pages, printed in black and white on cream paper.",
      th: "หน้าตัวอย่างจากฉบับสี ฉบับขาวดำมีหน้าเหมือนกันทุกหน้า พิมพ์ขาวดำบนกระดาษครีม",
    },
  },
};

export const insideFor = (collection: string): InsideSet | undefined => insidePages[collection];
