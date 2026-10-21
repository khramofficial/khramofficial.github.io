"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { errText, sb } from "./lib";

interface Day {
  day: string;
  views: number;
  visitors: number;
  clicks: number;
}
interface Stats {
  since: string;
  days: number;
  totals: { views: number; visitors: number; sessions: number; clicks: number };
  live: number;
  daily: Day[];
  pages: { path: string; views: number; visitors: number }[];
  referrers: { source: string; visits: number }[];
  clicks: { label: string; clicks: number }[];
  devices: { device: string; visitors: number }[];
  languages: { site_lang: string; views: number }[];
  timezones: { tz: string; visitors: number }[];
  campaigns?: { campaign: string; visitors: number }[];
}

/** Bar colour: Khram gold, stepped to pass the chart lightness, chroma and contrast checks on the navy card. */
const BAR = "#b8873a";
const nf = new Intl.NumberFormat("th-TH");
const n = (v: number) => nf.format(v);

const pageNames: [RegExp, string][] = [
  [/^\/$/, "หน้าแรก"],
  [/^\/collections\/$/, "รวมคอลเลกชัน"],
  [/^\/collections\/([^/]+)\/$/, "คอลเลกชัน $1"],
  [/^\/products\/([^/]+)\/$/, "สินค้า $1"],
  [/^\/our-story\/$/, "เรื่องของเรา"],
  [/^\/faq\/$/, "คำถามที่พบบ่อย"],
  [/^\/contact\/$/, "ติดต่อ"],
  [/^\/privacy\/$/, "ความเป็นส่วนตัว"],
];
function pageName(path: string) {
  const th = path === "/th" || path.startsWith("/th/");
  const p = th ? path.slice(3) || "/" : path;
  for (const [re, name] of pageNames) if (re.test(p)) return { name: p.replace(re, name), lang: th ? "ไทย" : "EN" };
  return { name: p, lang: th ? "ไทย" : "EN" };
}

const tzCountry: Record<string, string> = {
  "Asia/Bangkok": "ไทย",
  "Asia/Ho_Chi_Minh": "เวียดนาม",
  "Asia/Saigon": "เวียดนาม",
  "Asia/Singapore": "สิงคโปร์",
  "Asia/Kuala_Lumpur": "มาเลเซีย",
  "Asia/Jakarta": "อินโดนีเซีย",
  "Asia/Manila": "ฟิลิปปินส์",
  "Asia/Tokyo": "ญี่ปุ่น",
  "Asia/Seoul": "เกาหลีใต้",
  "Asia/Shanghai": "จีน",
  "Asia/Hong_Kong": "ฮ่องกง",
  "Asia/Taipei": "ไต้หวัน",
  "Asia/Kolkata": "อินเดีย",
  "Asia/Calcutta": "อินเดีย",
  "Asia/Dubai": "UAE",
  "Europe/London": "สหราชอาณาจักร",
  "Europe/Dublin": "ไอร์แลนด์",
  "Europe/Paris": "ฝรั่งเศส",
  "Europe/Berlin": "เยอรมนี",
  "Europe/Madrid": "สเปน",
  "Europe/Rome": "อิตาลี",
  "Europe/Amsterdam": "เนเธอร์แลนด์",
  "Europe/Stockholm": "สวีเดน",
  "Europe/Warsaw": "โปแลนด์",
  "Australia/Sydney": "ออสเตรเลีย",
  "Australia/Melbourne": "ออสเตรเลีย",
  "Australia/Brisbane": "ออสเตรเลีย",
  "Australia/Perth": "ออสเตรเลีย",
  "Pacific/Auckland": "นิวซีแลนด์",
  "America/Toronto": "แคนาดา",
  "America/Vancouver": "แคนาดา",
  "America/Mexico_City": "เม็กซิโก",
  "America/Sao_Paulo": "บราซิล",
};
function countryOf(tz: string) {
  if (tzCountry[tz]) return tzCountry[tz];
  if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana|Kentucky|Boise)/.test(tz) || tz === "Pacific/Honolulu") return "สหรัฐฯ";
  if (tz === "unknown") return "ไม่ทราบ";
  return tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
}

const deviceTh: Record<string, string> = { mobile: "มือถือ", tablet: "แท็บเล็ต", desktop: "คอมพิวเตอร์", unknown: "ไม่ทราบ" };

function clickName(label: string) {
  const [slug, store] = label.split(":");
  if (store) return `${slug} → ${store}`;
  return label;
}

export function StatsAdmin() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState<Date | null>(null);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    const r = await sb().rpc("admin_stats", { p_days: d });
    setLoading(false);
    if (r.error) return setError(errText(r.error));
    setError("");
    setData(r.data as Stats);
    setUpdated(new Date());
  }, []);

  useEffect(() => {
    void load(days);
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(days);
    }, 60_000);
    return () => window.clearInterval(t);
  }, [days, load]);

  const countries = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of data?.timezones ?? []) m.set(countryOf(t.tz), (m.get(countryOf(t.tz)) ?? 0) + t.visitors);
    return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="adm-h2">ภาพรวมการใช้งานเว็บ</h2>
          <p className="adm-hint">
            นับแบบไม่ระบุตัวตน ไม่เก็บ IP ไม่ใช้คุกกี้ · เวลาไทย
            {updated ? ` · อัปเดต ${updated.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="ช่วงเวลา">
          {[7, 30, 90].map((d) => (
            <button key={d} type="button" className={`adm-tab ${days === d ? "is-active" : ""}`} aria-pressed={days === d} onClick={() => setDays(d)}>
              {d} วัน
            </button>
          ))}
          <button type="button" className="adm-btn-sm" onClick={() => void load(days)} disabled={loading}>
            {loading ? "กำลังโหลด…" : "รีเฟรช"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="adm-error" role="alert">
          โหลดสถิติไม่สำเร็จ: {error}
        </p>
      ) : null}

      {!data ? (
        <p className="text-lavender">กำลังโหลด…</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="ผู้เข้าชม (คน)" value={data.totals.visitors} hint={`${data.days} วันล่าสุด`} />
            <Kpi label="เปิดหน้าเว็บ (ครั้ง)" value={data.totals.views} hint={data.totals.visitors ? `เฉลี่ย ${(data.totals.views / data.totals.visitors).toFixed(1)} หน้า/คน` : "—"} />
            <Kpi label="คลิกปุ่มซื้อ/รับฟรี" value={data.totals.clicks} hint={data.totals.visitors ? `${((data.totals.clicks / data.totals.visitors) * 100).toFixed(1)}% ของผู้เข้าชม` : "—"} />
            <Kpi label="กำลังดูอยู่ตอนนี้" value={data.live} hint="ใน 30 นาทีล่าสุด" live />
          </dl>

          <DailyChart daily={data.daily} />

          <div className="grid gap-6 lg:grid-cols-2">
            <BarList
              title="หน้าที่คนเปิดมากที่สุด"
              unit="ครั้ง"
              rows={data.pages.map((p) => {
                const pn = pageName(p.path);
                return { name: pn.name, tag: pn.lang, value: p.views, title: p.path };
              })}
            />
            <BarList
              title="คนมาจากไหน"
              unit="คน"
              hint="(direct) = พิมพ์ลิงก์เอง / เปิดจากแอปที่ไม่ส่งที่มา เช่น LINE, IG"
              rows={data.referrers.map((r) => ({ name: r.source, value: r.visits }))}
            />
            <BarList title="ปุ่มที่ถูกคลิก" unit="คลิก" hint="สินค้า → ร้านปลายทาง" rows={data.clicks.map((c) => ({ name: clickName(c.label), value: c.clicks }))} />
            <BarList title="ประเทศ (จากเขตเวลาของเครื่อง)" unit="คน" rows={countries} />
            <BarList title="อุปกรณ์" unit="คน" rows={data.devices.map((d) => ({ name: deviceTh[d.device] ?? d.device, value: d.visitors }))} />
            <BarList
              title="ภาษาของหน้าที่เปิด"
              unit="ครั้ง"
              rows={data.languages.map((l) => ({ name: l.site_lang === "th" ? "ไทย (/th)" : "English", value: l.views }))}
            />
            {data.campaigns ? (
              <BarList
                title="แคมเปญจากลิงก์ที่โพสต์"
                unit="คน"
                hint="ใส่ ?utm_source=pinterest ท้ายลิงก์ที่โพสต์ เพื่อแยกว่ามาจากโพสต์ไหน"
                rows={data.campaigns.map((c) => ({ name: c.campaign, value: c.visitors }))}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, hint, live }: { label: string; value: number; hint: string; live?: boolean }) {
  return (
    <div className="adm-card flex flex-col gap-1 p-4">
      <dt className="text-sm text-ivory/75">
        {live ? <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#7fc59a] align-middle" aria-hidden="true" /> : null}
        {label}
      </dt>
      <dd className="font-display text-3xl text-ivory tabular-nums">{n(value)}</dd>
      <dd className="text-xs text-lavender">{hint}</dd>
    </div>
  );
}

function DailyChart({ daily }: { daily: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const W = 720;
  const H = 200;
  const padL = 36;
  const padB = 24;
  const padT = 8;
  const max = Math.max(1, ...daily.map((d) => d.views));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const plotW = W - padL;
  const plotH = H - padB - padT;
  const col = plotW / Math.max(1, daily.length);
  const barW = Math.max(2, Math.min(22, col - 2));
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const fmtDay = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  const labelEvery = Math.ceil(daily.length / 8);
  const h = hover !== null ? daily[hover] : undefined;

  return (
    <section className="adm-card p-4 sm:p-5" aria-labelledby="daily-title">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="daily-title" className="adm-h3">
          เปิดหน้าเว็บต่อวัน
        </h3>
        <button type="button" className="adm-link text-sm" onClick={() => setTable((t) => !t)} aria-expanded={table}>
          {table ? "ดูเป็นกราฟ" : "ดูเป็นตาราง"}
        </button>
      </div>
      {table ? (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-left text-sm tabular-nums">
            <thead className="sticky top-0 bg-navy text-ivory/75">
              <tr>
                <th className="py-2 pr-3 font-normal">วันที่</th>
                <th className="py-2 pr-3 text-right font-normal">เปิดหน้า</th>
                <th className="py-2 pr-3 text-right font-normal">ผู้เข้าชม</th>
                <th className="py-2 text-right font-normal">คลิกซื้อ</th>
              </tr>
            </thead>
            <tbody>
              {[...daily].reverse().map((d) => (
                <tr key={d.day} className="border-t border-ivory/10">
                  <td className="py-1.5 pr-3">{fmtDay(d.day)}</td>
                  <td className="py-1.5 pr-3 text-right">{n(d.views)}</td>
                  <td className="py-1.5 pr-3 text-right">{n(d.visitors)}</td>
                  <td className="py-1.5 text-right">{n(d.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative" onPointerLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`กราฟจำนวนการเปิดหน้าเว็บ ${daily.length} วัน สูงสุด ${n(max)} ครั้งต่อวัน`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="rgba(237,230,216,0.1)" strokeWidth={1} />
                <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill="rgba(237,230,216,0.6)">
                  {n(t)}
                </text>
              </g>
            ))}
            {daily.map((d, i) => {
              const x = padL + i * col + (col - barW) / 2;
              const bh = (d.views / top) * plotH;
              const r = Math.min(4, barW / 2, bh);
              const yTop = padT + plotH - bh;
              return (
                <g key={d.day}>
                  {bh > 0 ? (
                    <path
                      d={`M${x},${padT + plotH} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + barW - r} Q${x + barW},${yTop} ${x + barW},${yTop + r} V${padT + plotH} Z`}
                      fill={BAR}
                      opacity={hover === null || hover === i ? 1 : 0.45}
                    />
                  ) : null}
                  {i % labelEvery === 0 ? (
                    <text x={padL + i * col + col / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="rgba(237,230,216,0.6)">
                      {fmtDay(d.day)}
                    </text>
                  ) : null}
                  <rect x={padL + i * col} y={padT} width={col} height={plotH} fill="transparent" onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} />
                </g>
              );
            })}
            <line x1={padL} x2={W} y1={padT + plotH} y2={padT + plotH} stroke="rgba(237,230,216,0.3)" strokeWidth={1} />
          </svg>
          {h && hover !== null ? (
            <div
              className="pointer-events-none absolute top-0 z-10 min-w-36 rounded border border-gold/30 bg-night px-3 py-2 text-sm shadow-lg"
              style={{
                left: `${((padL + hover * col + col / 2) / W) * 100}%`,
                transform: hover > daily.length / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
              }}
            >
              <p className="text-ivory">{fmtDay(h.day)}</p>
              <p className="tabular-nums text-ivory/85">
                <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: BAR }} aria-hidden="true" />
                เปิดหน้า {n(h.views)}
              </p>
              <p className="tabular-nums text-ivory/70">ผู้เข้าชม {n(h.visitors)} · คลิกซื้อ {n(h.clicks)}</p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function niceStep(max: number) {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  const f = raw / mag;
  return Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * mag);
}

function BarList({ title, rows, unit, hint }: { title: string; rows: { name: string; value: number; tag?: string; title?: string }[]; unit: string; hint?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="adm-card p-4 sm:p-5">
      <h3 className="adm-h3">{title}</h3>
      {hint ? <p className="adm-hint mt-1">{hint}</p> : null}
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-lavender">ยังไม่มีข้อมูล</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2.5" role="list">
          {rows.map((r) => (
            <li key={`${r.name}-${r.tag ?? ""}`} title={r.title} className="group">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-ivory/90">
                  {r.name}
                  {r.tag ? <span className="ml-2 text-xs text-lavender">{r.tag}</span> : null}
                </span>
                <span className="shrink-0 tabular-nums text-ivory/75">
                  {n(r.value)} {unit}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-ivory/[0.07]">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: BAR }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
