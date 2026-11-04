"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { errText, sb } from "./lib";
import { GROUPS, KINDS, kindsOf } from "./osConfig";
import { osSeed } from "./osSeed";

/**
 * Khram OS: the whole brand in one admin tab, stored in public.os_items (migration 004_khram_os.sql).
 * Sections live in osConfig.ts (brand, products, marketing, customers, money, ops, handover);
 * a new section is one config entry. Starting data per section comes from osSeed.ts.
 */

type Kind = string;
type Item = { id: string; kind: Kind; title: string; status: string; due: string | null; data: Record<string, string>; sort: number; updated_at?: string };
type View = "overview" | "people" | Kind;

const num = (s: string | undefined) => {
  const n = Number(String(s ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const monday = () => {
  const d = new Date(Date.now() + 7 * 3600e3);
  const wd = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - wd);
  return d.toISOString().slice(0, 10);
};

export function OsAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<View>("overview");
  const [missingTable, setMissingTable] = useState(false);

  const load = useCallback(async () => {
    const client = sb();
    const { data, error: e } = await client.from("os_items").select("*").order("sort").order("created_at");
    if (e) {
      if (/os_items|relation|schema cache/i.test(e.message)) setMissingTable(true);
      else setError(e.message);
      setItems([]);
      return;
    }
    const have = new Set((data ?? []).map((r) => (r as Item).kind));
    const missing = osSeed.filter((x) => !have.has(x.kind) && KINDS[x.kind]);
    if (missing.length) {
      const rows = missing.map((x, i) => ({ kind: x.kind, title: x.title, status: x.status, due: x.due ?? null, data: x.data, sort: x.sort ?? i }));
      const ins = await client.from("os_items").insert(rows).select("*");
      if (ins.error) setError(ins.error.message);
      setItems([...((data as Item[]) ?? []), ...((ins.data as Item[]) ?? [])]);
      return;
    }
    setItems(data as Item[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (missingTable)
    return (
      <div className="adm-card flex max-w-2xl flex-col gap-3 p-6">
        <h2 className="adm-h2">ยังไม่ได้สร้างตารางของ Khram OS</h2>
        <p className="text-ivory/80">เปิด Supabase (บัญชี khram.official) → SQL Editor → วางไฟล์ <code>supabase/migrations/004_khram_os.sql</code> แล้วกด Run ครั้งเดียว จากนั้นรีเฟรชหน้านี้</p>
      </div>
    );
  if (!items) return <p className="text-lavender">กำลังโหลด Khram OS…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="adm-h2">Khram OS</h2>
        <p className="adm-hint">ทุกอย่างของแบรนด์ในที่เดียว · Brand Guide v2.0 — Every day has its own sky.</p>
      </div>
      <nav className="flex flex-col gap-3" aria-label="ส่วนของ Khram OS">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`adm-btn-sm ${view === "overview" ? "adm-primary" : ""}`} onClick={() => setView("overview")}>
            ภาพรวมทั้งแบรนด์
          </button>
        </div>
        {GROUPS.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-2">
            <span className="w-28 shrink-0 text-sm text-gold">{g.label}</span>
            {kindsOf(g.id).map((k) => {
              const open = items.filter((i) => i.kind === k && !KINDS[k]!.done.includes(i.status)).length;
              return (
                <button key={k} type="button" className={`adm-btn-sm ${view === k ? "adm-primary" : ""}`} onClick={() => setView(k)}>
                  {KINDS[k]!.label} ({open})
                </button>
              );
            })}
            {g.id === "handover" ? (
              <button type="button" className={`adm-btn-sm ${view === "people" ? "adm-primary" : ""}`} onClick={() => setView("people")}>
                ผู้ดูแลหลังบ้าน
              </button>
            ) : null}
          </div>
        ))}
      </nav>
      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}
      {view === "overview" ? <Overview items={items} go={setView} /> : null}
      {KINDS[view] ? <KindList kind={view} items={items.filter((i) => i.kind === view)} reload={load} setError={setError} /> : null}
      {view === "people" ? <People /> : null}
    </div>
  );
}

/* ---------------- overview ---------------- */

function Overview({ items, go }: { items: Item[]; go: (v: View) => void }) {
  const t = today();
  const tasks = items.filter((i) => i.kind === "task" && i.status !== "เสร็จ").sort((a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999") || a.sort - b.sort);
  const overdue = tasks.filter((i) => i.due && i.due < t);
  const listingsFix = items.filter((i) => i.kind === "listing" && (i.status === "ต้องแก้" || i.status === "รอรีวิว"));
  const content = KINDS.content!.statuses.map((s) => ({ s, n: items.filter((i) => i.kind === "content" && i.status === s).length }));
  const roadmap = KINDS.roadmap!.statuses.map((st) => ({ s: st, n: items.filter((i) => i.kind === "roadmap" && i.status === st).length }));
  const feedbackNew = items.filter((i) => i.kind === "feedback" && i.status === "ใหม่");
  const decisions = items.filter((i) => i.kind === "decision" && i.status !== "เลิกใช้").sort((a, b) => (b.due ?? "").localeCompare(a.due ?? "")).slice(0, 4);
  const integrationsBad = items.filter((i) => i.kind === "integration" && i.status === "มีปัญหา");
  const month = t.slice(0, 7);
  const money = ["USD", "THB"].map((c) => {
    const rows = items.filter((i) => i.kind === "finance" && (i.due ?? "").startsWith(month) && (i.data.currency || "USD") === c);
    const inc = rows.filter((r) => r.status === "รายรับ").reduce((x, r) => x + num(r.data.amount), 0);
    const out = rows.filter((r) => r.status === "รายจ่าย").reduce((x, r) => x + num(r.data.amount), 0);
    return { c, inc, out };
  });
  const accountsTodo = items.filter((i) => i.kind === "account" && i.status === "ต้องตั้งค่า");
  const accountsBlank = items.filter((i) => i.kind === "account" && i.status === "ใช้งาน" && (!i.data.login || !i.data.recovery));

  const weeks = useMemo(() => {
    const m = items.filter((i) => i.kind === "metric" && i.due);
    const byWeek = new Map<string, Item[]>();
    for (const r of m) byWeek.set(r.due!, [...(byWeek.get(r.due!) ?? []), r]);
    return [...byWeek.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
  }, [items]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">งานที่ยังเปิด ({tasks.length}{overdue.length ? ` · เลยกำหนด ${overdue.length}` : ""})</h3>
        <ul className="flex flex-col gap-2 text-[0.95rem]">
          {tasks.slice(0, 8).map((i) => (
            <li key={i.id} className="flex justify-between gap-3 border-b border-ivory/10 pb-2">
              <span>
                {i.title}
                <span className="block text-sm text-ivory/55">
                  {i.data.owner} · {i.status}
                </span>
              </span>
              {i.due ? <span className={`shrink-0 text-sm ${i.due < t ? "text-[#f0a3a3]" : "text-ivory/60"}`}>{i.due}</span> : null}
            </li>
          ))}
        </ul>
        <button type="button" className="adm-link self-start" onClick={() => go("task")}>
          ดูงานทั้งหมด →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">ช่องทางขายที่ต้องดู ({listingsFix.length})</h3>
        <ul className="flex flex-col gap-2 text-[0.95rem]">
          {listingsFix.map((i) => (
            <li key={i.id} className="border-b border-ivory/10 pb-2">
              {i.title} <span className="text-sm text-gold">· {i.status}</span>
              {i.data.note ? <span className="block text-sm text-ivory/55">{i.data.note}</span> : null}
            </li>
          ))}
          {listingsFix.length === 0 ? <li className="text-ivory/60">ทุกช่องทางเรียบร้อย</li> : null}
        </ul>
        <button type="button" className="adm-link self-start" onClick={() => go("listing")}>
          ดูช่องทางขาย →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">คอนเทนต์</h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          {content.map((c) => (
            <div key={c.s} className="rounded-lg border border-gold/15 px-1 py-3">
              <div className="font-display text-2xl text-gold">{c.n}</div>
              <div className="text-xs text-ivory/65">{c.s}</div>
            </div>
          ))}
        </div>
        <button type="button" className="adm-link self-start" onClick={() => go("content")}>
          ดูคอนเทนต์ →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">ตัวเลขรายสัปดาห์</h3>
        {weeks.length === 0 ? (
          <p className="text-ivory/60">ยังไม่มีตัวเลข · กรอกทุกวันจันทร์ที่แท็บ “ตัวเลขรายสัปดาห์”</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-ivory/60">
                <tr>
                  <th className="py-1 pr-3">สัปดาห์</th>
                  <th className="pr-3">วิว</th>
                  <th className="pr-3">คลิก</th>
                  <th className="pr-3">ฟรี</th>
                  <th className="pr-3">ขาย</th>
                  <th>รายได้</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map(([w, rows]) => {
                  const sum = (k: string) => rows.reduce((s, r) => s + num(r.data[k]), 0);
                  const rev = ["USD", "THB"]
                    .map((c) => ({ c, v: rows.filter((r) => (r.data.currency || "USD") === c).reduce((s, r) => s + num(r.data.revenue), 0) }))
                    .filter((x) => x.v)
                    .map((x) => `${x.v.toLocaleString()} ${x.c}`)
                    .join(" + ");
                  return (
                    <tr key={w} className="border-t border-ivory/10">
                      <td className="py-1 pr-3">{w}</td>
                      <td className="pr-3">{sum("views").toLocaleString()}</td>
                      <td className="pr-3">{sum("clicks").toLocaleString()}</td>
                      <td className="pr-3">{sum("downloads").toLocaleString()}</td>
                      <td className="pr-3">{sum("sales").toLocaleString()}</td>
                      <td>{rev || "0"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <button type="button" className="adm-link self-start" onClick={() => go("metric")}>
          กรอก / ดูตัวเลข →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">แผนสินค้า</h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          {roadmap.map((c) => (
            <div key={c.s} className="rounded-lg border border-gold/15 px-1 py-3">
              <div className="font-display text-2xl text-gold">{c.n}</div>
              <div className="text-xs text-ivory/65">{c.s}</div>
            </div>
          ))}
        </div>
        <button type="button" className="adm-link self-start" onClick={() => go("roadmap")}>
          ดูแผนสินค้า →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">เงินเดือนนี้ ({month})</h3>
        {money.map((m) => (
          <p key={m.c} className="text-[0.95rem]">
            {m.c}: รับ {m.inc.toLocaleString()} · จ่าย {m.out.toLocaleString()} · <span className="text-gold">คงเหลือ {(m.inc - m.out).toLocaleString()}</span>
          </p>
        ))}
        <button type="button" className="adm-link self-start" onClick={() => go("finance")}>
          ดูรายรับ-รายจ่าย →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">ลูกค้า</h3>
        <p className="text-[0.95rem]">รีวิว / ข้อความใหม่ที่ยังไม่ตอบ: {feedbackNew.length}</p>
        {integrationsBad.length ? <p className="text-[0.95rem] text-[#f0a3a3]">ระบบที่มีปัญหา: {integrationsBad.map((i) => i.title).join(", ")}</p> : null}
        <button type="button" className="adm-link self-start" onClick={() => go("feedback")}>
          ดูฟีดแบ็ก →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5">
        <h3 className="adm-label">การตัดสินใจล่าสุด</h3>
        <ul className="flex flex-col gap-2 text-[0.95rem]">
          {decisions.map((i) => (
            <li key={i.id} className="border-b border-ivory/10 pb-2">
              {i.title}
              <span className="block text-sm text-ivory/55">{i.due}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="adm-link self-start" onClick={() => go("decision")}>
          ดูการตัดสินใจทั้งหมด →
        </button>
      </section>

      <section className="adm-card flex flex-col gap-3 p-5 md:col-span-2">
        <h3 className="adm-label">ความพร้อมส่งต่อ (บัญชี)</h3>
        <p className="text-[0.95rem] text-ivory/80">
          บัญชีทั้งหมด {items.filter((i) => i.kind === "account").length} · ต้องตั้งค่า {accountsTodo.length} · ยังกรอกอีเมลล็อกอินหรือที่กู้คืนไม่ครบ {accountsBlank.length}
        </p>
        <p className="adm-hint">ถ้าวันหนึ่งคนอื่นต้องรับช่วง Khram เขาต้องรู้ว่าทุกบัญชีล็อกอินด้วยอะไร และกู้คืนได้จากไหน (ไม่ใส่รหัสผ่านที่นี่)</p>
        <button type="button" className="adm-link self-start" onClick={() => go("account")}>
          ดูบัญชี →
        </button>
      </section>
    </div>
  );
}

/* ---------------- one list per kind ---------------- */

function KindList({ kind, items, reload, setError }: { kind: Kind; items: Item[]; reload: () => Promise<void>; setError: (s: string) => void }) {
  const def = KINDS[kind]!;
  const [filter, setFilter] = useState<string>("open");
  const [editing, setEditing] = useState<Item | null>(null);

  const shown = items
    .filter((i) => (filter === "all" ? true : filter === "open" ? !def.done.includes(i.status) : i.status === filter))
    .sort((a, b) => (kind === "metric" ? (b.due ?? "").localeCompare(a.due ?? "") : (a.due ?? "9999").localeCompare(b.due ?? "9999") || a.sort - b.sort));

  const blank = (): Item => ({
    id: "",
    kind,
    title: def.titleOptions?.[0] ?? "",
    status: def.statuses[0] ?? "",
    due: kind === "metric" ? monday() : null,
    data: Object.fromEntries(def.fields.map((f) => [f.key, f.type === "select" ? (f.options?.[0] ?? "") : ""])),
    sort: items.length,
  });

  return (
    <div className="flex flex-col gap-4">
      {def.hint ? <p className="adm-notice">{def.hint}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="adm-btn adm-primary" onClick={() => setEditing(blank())}>
          + เพิ่ม{def.label}
        </button>
        {def.statuses.length > 1 ? (
          <select className="adm-input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="กรองตามสถานะ">
            <option value="open">ที่ยังเปิด</option>
            <option value="all">ทั้งหมด</option>
            {def.statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      {editing ? <Editor kind={kind} item={editing} onClose={() => setEditing(null)} reload={reload} setError={setError} /> : null}
      <ul className="flex flex-col gap-2">
        {shown.map((i) => (
          <li key={i.id} className="adm-card flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-ivory">
                {kind === "metric" ? `${i.due} · ${i.title}` : i.title}
                {i.status && def.statuses.length > 1 ? <span className="ml-2 text-sm text-gold">· {i.status}</span> : null}
              </p>
              <p className="text-sm text-ivory/60">
                {def.listCols
                  .map((c) => {
                    const f = def.fields.find((x) => x.key === c);
                    const v = i.data[c];
                    return v ? `${f?.label ?? c}: ${v}` : "";
                  })
                  .filter(Boolean)
                  .join(" · ")}
                {i.due && kind !== "metric" ? ` · ${def.dueLabel}: ${i.due}` : ""}
              </p>
              {i.data.url ? (
                <a className="adm-link text-sm" href={i.data.url} target="_blank" rel="noopener noreferrer">
                  เปิดลิงก์ ↗
                </a>
              ) : null}
            </div>
            <div className="flex gap-2">
              {kind === "task" && i.status !== "เสร็จ" ? (
                <button
                  type="button"
                  className="adm-btn-sm"
                  onClick={async () => {
                    const { error } = await sb().from("os_items").update({ status: "เสร็จ" }).eq("id", i.id);
                    if (error) setError(errText(error));
                    await reload();
                  }}
                >
                  ✓ เสร็จ
                </button>
              ) : null}
              <button type="button" className="adm-btn-sm" onClick={() => setEditing(i)}>
                แก้ไข
              </button>
            </div>
          </li>
        ))}
        {shown.length === 0 ? <li className="text-ivory/60">ไม่มีรายการ</li> : null}
      </ul>
    </div>
  );
}

function Editor({ kind, item, onClose, reload, setError }: { kind: Kind; item: Item; onClose: () => void; reload: () => Promise<void>; setError: (s: string) => void }) {
  const def = KINDS[kind]!;
  const [it, setIt] = useState<Item>(item);
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setIt({ ...it, data: { ...it.data, [k]: v } });

  async function save() {
    if (!it.title.trim()) return setError(`ใส่${def.titleLabel}ก่อน`);
    if (/password|รหัสผ่าน|\b\d{12,19}\b/i.test(JSON.stringify(it.data)) && kind === "account") return setError("ห้ามเก็บรหัสผ่านหรือเลขบัตร/บัญชีไว้ที่นี่");
    setSaving(true);
    const row = { kind, title: it.title.trim(), status: it.status, due: it.due || null, data: it.data, sort: it.sort };
    const { error } = it.id ? await sb().from("os_items").update(row).eq("id", it.id) : await sb().from("os_items").insert(row);
    setSaving(false);
    if (error) return setError(errText(error));
    setError("");
    await reload();
    onClose();
  }

  async function remove() {
    if (!it.id || !window.confirm(`ลบ “${it.title}” ?`)) return;
    const { error } = await sb().from("os_items").delete().eq("id", it.id);
    if (error) return setError(errText(error));
    await reload();
    onClose();
  }

  return (
    <form
      className="adm-section flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="adm-grid">
        {def.titleOptions ? (
          <Select label={def.titleLabel} value={it.title} options={def.titleOptions} onChange={(v) => setIt({ ...it, title: v })} />
        ) : (
          <Input label={def.titleLabel} value={it.title} onChange={(v) => setIt({ ...it, title: v })} wide />
        )}
        {def.statuses.length > 1 ? <Select label="สถานะ" value={it.status} options={def.statuses} onChange={(v) => setIt({ ...it, status: v })} /> : null}
        {def.dueLabel ? <Input label={def.dueLabel} type="date" value={it.due ?? ""} onChange={(v) => setIt({ ...it, due: v })} /> : null}
        {def.fields.map((f) =>
          f.type === "select" ? (
            <Select key={f.key} label={f.label} value={it.data[f.key] ?? ""} options={f.options ?? []} onChange={(v) => set(f.key, v)} />
          ) : f.type === "area" ? (
            <div key={f.key} className="adm-field md:col-span-2">
              <label className="adm-label" htmlFor={`os-${f.key}`}>
                {f.label}
              </label>
              <textarea id={`os-${f.key}`} className="adm-input" rows={4} value={it.data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          ) : (
            <Input key={f.key} label={f.label} type={f.type === "url" ? "url" : f.type === "date" ? "date" : "text"} value={it.data[f.key] ?? ""} onChange={(v) => set(f.key, v)} wide={f.wide} />
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="adm-btn adm-primary" disabled={saving}>
          {saving ? "กำลังบันทึก…" : "บันทึก"}
        </button>
        <button type="button" className="adm-btn" onClick={onClose}>
          ยกเลิก
        </button>
        {it.id ? (
          <button type="button" className="adm-btn adm-danger ml-auto" onClick={() => void remove()}>
            ลบ
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Input({ label, value, onChange, type = "text", wide }: { label: string; value: string; onChange: (v: string) => void; type?: string; wide?: boolean }) {
  const id = `os-${label.replace(/\W+/g, "-")}`;
  return (
    <div className={`adm-field ${wide ? "md:col-span-2" : ""}`}>
      <label className="adm-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="adm-input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const id = `os-${label.replace(/\W+/g, "-")}`;
  const opts = options.includes(value) || !value ? options : [value, ...options];
  return (
    <div className="adm-field">
      <label className="adm-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="adm-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o || "—"}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- who can open the back office ---------------- */

function People() {
  const [list, setList] = useState<string[] | null>(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await sb().rpc("admin_list");
    if (error) setErr(error.message);
    setList(((data as string[] | null) ?? []).map(String));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    setMsg("");
    setErr("");
    const { error } = await sb().rpc("admin_add", { p_email: email });
    if (error) return setErr(errText(error));
    setEmail("");
    setMsg("เพิ่มแล้ว · ขั้นต่อไป: สร้างผู้ใช้อีเมลนี้ใน Supabase → Authentication → Add user (เว็บปิดการสมัครเองไว้)");
    await load();
  }
  async function remove(e: string) {
    if (!window.confirm(`เอา ${e} ออกจากผู้ดูแล?`)) return;
    const { error } = await sb().rpc("admin_remove", { p_email: e });
    if (error) return setErr(errText(error));
    await load();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <p className="adm-notice">คนที่อยู่ในรายชื่อนี้เปิดหลังบ้านและ Khram OS ได้ทั้งหมด ใส่คนในครอบครัวที่จะรับช่วงไว้อย่างน้อย 1 คน</p>
      <ul className="flex flex-col gap-2">
        {(list ?? []).map((e) => (
          <li key={e} className="adm-card flex items-center justify-between gap-3 p-3">
            <span>{e}</span>
            <button type="button" className="adm-btn-sm" onClick={() => void remove(e)}>
              เอาออก
            </button>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(ev) => {
          ev.preventDefault();
          void add();
        }}
      >
        <input className="adm-input max-w-sm" type="email" placeholder="อีเมลคนในครอบครัว" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="อีเมลผู้ดูแลใหม่" />
        <button type="submit" className="adm-btn adm-primary">
          เพิ่มผู้ดูแล
        </button>
      </form>
      {err ? (
        <p className="adm-error" role="alert">
          {err}
        </p>
      ) : null}
      {msg ? (
        <p className="adm-notice" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
