/** Small line icons for the home page (inline SVG, so no icon font or extra request). Decorative: always aria-hidden. */
const paths = {
  moon: "M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z",
  arrow: "M4 12h15M13 6l6 6-6 6",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  shield: "M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Zm0 12.8-3.1-3a1.9 1.9 0 0 1 2.7-2.7l.4.4.4-.4a1.9 1.9 0 0 1 2.7 2.7L12 15.8Z",
  tablet: "M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3ZM11 18h2",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  gift: "M4 10h16v3H4zM5.5 13h13v7h-13zM12 10v10M12 10c-1.5-3.5-5.5-4-5.5-1.5S10 10 12 10Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 10 12 10Z",
  bolt: "M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z",
  plus: "M12 5v14M5 12h14",
  menu: "M4 8h16M8 16h12",
  tiktok: "M15 3c.3 2.3 1.8 3.9 4 4.1v3.1c-1.5 0-2.8-.4-4-1.2V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.2a2.4 2.4 0 1 0 1.5 2.2V3h3.1Z",
} as const;

export type IconName = keyof typeof paths;

const filled: IconName[] = ["shield", "bolt", "tiktok"];

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const fill = filled.includes(name);
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className ?? "h-[1em] w-[1em] shrink-0"}
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} fillRule={name === "shield" ? "evenodd" : undefined} />
    </svg>
  );
}
