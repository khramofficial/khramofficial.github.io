import type { MotifName } from "@/lib/types";

/**
 * Each collection's signature subject, drawn as a running stitch over its colour texture.
 * Pure vector, no text, so it stays sharp and replaceable when final artwork arrives.
 */
export function Motif({ name, thread, accent }: { name: MotifName; thread: string; accent: string }) {
  const stitch = {
    fill: "none",
    stroke: thread,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDasharray: "5 3.2",
  };
  const accentStitch = { ...stitch, stroke: accent };

  return (
    <svg viewBox="0 0 200 250" aria-hidden="true" focusable="false" className="h-full w-full">
      {name === "butterfly-moon" && (
        <g>
          <circle cx="128" cy="82" r="30" {...stitch} />
          <path d="M40 176H160M62 188H138M84 200H116" {...stitch} />
          <path d="M120 176h16M123 188h10" {...stitch} strokeDasharray="2 3" />
          <g transform="rotate(-14 84 122)">
            <path d="M84 122C72 98 50 98 52 113C54 126 72 128 84 122Z" {...accentStitch} />
            <path d="M84 124C74 130 65 143 73 146C79 148 84 136 84 124Z" {...accentStitch} />
            <path d="M84 122C96 98 118 98 116 113C114 126 96 128 84 122Z" {...accentStitch} />
            <path d="M84 124C94 130 103 143 95 146C89 148 84 136 84 124Z" {...accentStitch} />
            <path d="M84 115V133M84 115C82 109 80 106 76 104M84 115C86 109 88 106 92 104" {...accentStitch} strokeDasharray="none" strokeWidth="1.1" />
          </g>
        </g>
      )}
      {name === "thread-moon" && (
        <g>
          <circle cx="100" cy="80" r="30" {...stitch} />
          <path d="M100 50A30 30 0 0 0 100 110Z" fill={thread} fillOpacity="0.18" stroke="none" />
          <path d="M100 50V110" {...stitch} strokeDasharray="2 3" />
          <path
            d="M18 182C52 150 78 206 108 170C122 153 140 152 137 166C134 180 116 175 122 162C131 142 160 152 184 126"
            {...accentStitch}
          />
        </g>
      )}
      {name === "dawn-ripples" && (
        <g>
          <path d="M28 146H172" {...stitch} />
          <path d="M68 146A32 32 0 0 1 132 146" {...accentStitch} />
          <path d="M100 96V104M64 110L70 116M136 110L130 116M50 132H58M150 132H142" {...accentStitch} />
          <path d="M58 164Q100 157 142 164M72 178Q100 172 128 178M86 192Q100 188 114 192" {...stitch} />
        </g>
      )}
      {name === "new-moon-flower" && (
        <g>
          <circle cx="136" cy="66" r="22" {...stitch} strokeDasharray="2 4" />
          <path d="M26 182H174" {...stitch} />
          <path d="M56 154H86M56 154V116M56 154V180M86 154V180M56 116L61 113M56 128H62" {...stitch} />
          <g>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="128" cy="143" rx="3.6" ry="7.5" transform={`rotate(${deg} 128 150)`} {...accentStitch} strokeDasharray="3 2" />
            ))}
            <path d="M128 157V180M128 170C122 166 118 167 116 170" {...accentStitch} />
          </g>
        </g>
      )}
    </svg>
  );
}
