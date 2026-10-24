"use client";

import { useEffect, useState } from "react";
import type { CollectionRow } from "@/lib/catalog";
import type { CollectionStatus, CollectionText, ImageAsset, MotifName } from "@/lib/types";
import { Area, ImageList, LangTabs, Select, Text } from "./fields";
import { collectionStatusTh, errText, fromParas, sb, slugOk, toParas } from "./lib";

interface TextForm {
  dyeNote: string;
  theme: string;
  summary: string;
  description: string;
  art: string;
  statusNote: string;
}

interface Form {
  isNew: boolean;
  slug: string;
  name: string;
  dyeThai: string;
  dyeEnglish: string;
  status: CollectionStatus;
  sort: string;
  accentBase: string;
  accentText: string;
  motif: MotifName | "";
  swatch: ImageAsset[];
  en: TextForm;
  th: TextForm;
}

const motifs: { value: MotifName | ""; label: string }[] = [
  { value: "", label: "ไม่มีลายปัก" },
  { value: "butterfly-moon", label: "ผีเสื้อ + พระจันทร์ (INDIGO)" },
  { value: "thread-moon", label: "ด้าย + จันทร์ครึ่งดวง (CRIMSON)" },
  { value: "dawn-ripples", label: "รุ่งเช้า + ระลอกน้ำ (SAFFRON)" },
  { value: "new-moon-flower", label: "จันทร์ดับ + ดอกไม้ (EBONY)" },
];

const textFrom = (t: Partial<CollectionText> | undefined): TextForm => ({
  dyeNote: t?.dyeNote ?? "",
  theme: t?.theme ?? "",
  summary: t?.summary ?? "",
  description: toParas(t?.description),
  art: t?.art ?? "",
  statusNote: t?.statusNote ?? "",
});

const textTo = (f: TextForm): CollectionText => ({
  dyeNote: f.dyeNote.trim(),
  theme: f.theme.trim(),
  summary: f.summary.trim(),
  description: fromParas(f.description),
  art: f.art.trim(),
  statusNote: f.statusNote.trim(),
});

function toForm(r: CollectionRow): Form {
  return {
    isNew: false,
    slug: r.slug,
    name: r.name,
    dyeThai: r.dye_thai,
    dyeEnglish: r.dye_english,
    status: r.status,
    sort: String(r.sort ?? 0),
    accentBase: r.accent_base,
    accentText: r.accent_text,
    motif: r.motif ?? "",
    swatch: r.swatch?.src
      ? [{ src: r.swatch.src, alt: r.swatch.alt ?? "", width: Number(r.swatch.width) || 900, height: Number(r.swatch.height) || 1125 }]
      : [],
    en: textFrom({
      dyeNote: r.dye_note,
      theme: r.theme,
      summary: r.summary,
      description: r.description,
      art: r.art,
      statusNote: r.status_note,
    }),
    th: textFrom(r.i18n?.th),
  };
}

const blank = (sort: number): Form => ({
  isNew: true,
  slug: "",
  name: "",
  dyeThai: "",
  dyeEnglish: "",
  status: "planned",
  sort: String(sort),
  accentBase: "#80B2DB",
  accentText: "#80B2DB",
  motif: "",
  swatch: [],
  en: textFrom(undefined),
  th: textFrom(undefined),
});

function toRow(f: Form): CollectionRow {
  const en = textTo(f.en);
  return {
    slug: f.slug.trim(),
    name: f.name.trim().toUpperCase(),
    dye_thai: f.dyeThai.trim(),
    dye_english: f.dyeEnglish.trim(),
    dye_note: en.dyeNote,
    theme: en.theme,
    summary: en.summary,
    description: en.description,
    art: en.art,
    accent_base: f.accentBase,
    accent_text: f.accentText,
    status: f.status,
    status_note: en.statusNote,
    swatch: f.swatch[0] ?? {},
    motif: f.motif || null,
    i18n: { th: textTo(f.th) },
    sort: Number(f.sort) || 0,
  };
}

export function CollectionsAdmin({ siteUrl }: { siteUrl: string }) {
  const [rows, setRows] = useState<CollectionRow[] | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const r = await sb().from("collections").select("*").order("sort");
    if (r.error) setError(r.error.message);
    else setRows(r.data as CollectionRow[]);
  }
  useEffect(() => {
    void load();
  }, []);

  if (form)
    return (
      <Editor
        initial={form}
        siteUrl={siteUrl}
        onClose={(msg) => {
          setForm(null);
          if (msg) setNotice(msg);
          void load();
        }}
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="adm-h2">คอลเลกชัน</h2>
          <p className="adm-hint">สมุดแต่ละสี เปลี่ยนสถานะ (เช่น CRIMSON พร้อมขาย) หรือแก้ข้อความได้ที่นี่</p>
        </div>
        <button type="button" className="adm-btn adm-primary" onClick={() => setForm(blank(rows ? rows.length + 1 : 1))}>
          + เพิ่มคอลเลกชัน
        </button>
      </div>
      {notice ? (
        <p className="adm-notice" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}
      {!rows ? (
        <p className="text-lavender">กำลังโหลด…</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {rows.map((r) => (
            <li key={r.slug} className="adm-card flex items-center gap-4 p-3">
              {r.swatch?.src ? <img src={r.swatch.src} alt="" className="h-16 w-14 shrink-0 object-cover" /> : <div className="h-16 w-14 shrink-0 bg-night" />}
              <div className="min-w-0 flex-1">
                <p className="font-display tracking-[0.1em]" style={{ color: r.accent_text }}>
                  {r.name}
                </p>
                <p className="text-sm text-ivory/70">{collectionStatusTh[r.status]}</p>
              </div>
              <button type="button" className="adm-btn-sm adm-primary" onClick={() => setForm(toForm(r))}>
                แก้ไข
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({ initial, siteUrl, onClose }: { initial: Form; siteUrl: string; onClose: (msg?: string) => void }) {
  const [f, setF] = useState(initial);
  const [lang, setLang] = useState<"en" | "th">("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const setT = (k: keyof TextForm, v: string) => setF((x) => ({ ...x, [lang]: { ...x[lang], [k]: v } }));
  const t = f[lang];

  async function save() {
    if (!slugOk(f.slug.trim())) return setError("ชื่อในลิงก์ใช้ได้แค่ a-z 0-9 และ -");
    if (!f.name.trim()) return setError("ใส่ชื่อคอลเลกชัน");
    if (!/^#[0-9a-fA-F]{6}$/.test(f.accentBase) || !/^#[0-9a-fA-F]{6}$/.test(f.accentText)) return setError("สีต้องเป็นรหัสแบบ #RRGGBB");
    setSaving(true);
    setError("");
    const row = toRow(f);
    const res = f.isNew ? await sb().from("collections").insert(row) : await sb().from("collections").update(row).eq("slug", initial.slug);
    setSaving(false);
    if (res.error) return setError(res.error.code === "23505" ? "ชื่อในลิงก์นี้มีแล้ว" : errText(res.error));
    onClose(`บันทึก ${row.name} แล้ว`);
  }

  async function remove() {
    setSaving(true);
    const res = await sb().from("collections").delete().eq("slug", initial.slug);
    setSaving(false);
    if (res.error) return setError(res.error.code === "23503" ? "ลบไม่ได้: ยังมีสินค้าอยู่ในคอลเลกชันนี้ ย้ายหรือลบสินค้าก่อน" : errText(res.error));
    onClose(`ลบ ${initial.name} แล้ว`);
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button type="button" className="adm-link" onClick={() => onClose()}>
            ← กลับไปรายการคอลเลกชัน
          </button>
          <h2 className="adm-h2 mt-2">{f.isNew ? "เพิ่มคอลเลกชัน" : `แก้ไข ${initial.name}`}</h2>
        </div>
        {!f.isNew ? (
          <a className="adm-btn-sm" href={`${siteUrl}/collections/${initial.slug}/`} target="_blank" rel="noopener noreferrer">
            ดูหน้าเว็บ ↗
          </a>
        ) : null}
      </div>

      <section className="adm-section">
        <h3 className="adm-h3">ข้อมูลหลัก</h3>
        <div className="adm-grid">
          <Text label="ชื่อ (ตัวพิมพ์ใหญ่)" value={f.name} onChange={(v) => set("name", v)} placeholder="เช่น CRIMSON" />
          <Text
            label="ชื่อในลิงก์ (slug)"
            value={f.slug}
            onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            disabled={!f.isNew}
            hint={f.isNew ? undefined : "เปลี่ยนไม่ได้หลังสร้าง"}
          />
          <Select
            label="สถานะ"
            value={f.status}
            options={(Object.keys(collectionStatusTh) as CollectionStatus[]).map((s) => ({ value: s, label: collectionStatusTh[s] }))}
            onChange={(v) => set("status", v)}
          />
          <Text label="ลำดับ" type="number" value={f.sort} onChange={(v) => set("sort", v)} />
          <Text label="สีหลัก" type="color" value={f.accentBase} onChange={(v) => set("accentBase", v)} hint={f.accentBase} />
          <Text label="สีตัวอักษรบนพื้นมืด" type="color" value={f.accentText} onChange={(v) => set("accentText", v)} hint={`${f.accentText} · ต้องอ่านออกบนพื้นกรมท่า`} />
          <Select label="ลายเส้นบนภาพ" value={f.motif} options={motifs} onChange={(v) => set("motif", v)} />
        </div>
      </section>

      <section className="adm-section">
        <h3 className="adm-h3">ภาพประจำคอลเลกชัน</h3>
        <div className="adm-grid">
          <ImageList label="ภาพ (แนวตั้ง 4:5)" images={f.swatch} onChange={(v) => set("swatch", v)} folder={`collections/${f.slug || "new"}`} single />
        </div>
      </section>

      <section className="adm-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="adm-h3">ข้อความ</h3>
          <LangTabs value={lang} onChange={setLang} />
        </div>
        <div className="adm-grid">
          <Text label="หัวข้อ (theme)" value={t.theme} onChange={(v) => setT("theme", v)} lang={lang} />
          <Text label="ข้อความสถานะ" value={t.statusNote} onChange={(v) => setT("statusNote", v)} lang={lang} />
          <Area label="สรุปสั้น" value={t.summary} onChange={(v) => setT("summary", v)} rows={2} lang={lang} />
          <Area label="คำอธิบาย" value={t.description} onChange={(v) => setT("description", v)} rows={5} lang={lang} hint="เว้นบรรทัดว่างระหว่างย่อหน้า" />
          <Area label="ภาพประจำคอลเลกชัน (อธิบาย)" value={t.art} onChange={(v) => setT("art", v)} rows={2} lang={lang} />
        </div>
      </section>

      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-gold/20 bg-night px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="adm-btn adm-primary" disabled={saving}>
            {saving ? "กำลังบันทึก…" : "บันทึก"}
          </button>
          <button type="button" className="adm-btn" onClick={() => onClose()}>
            ยกเลิก
          </button>
        </div>
        {!f.isNew ? (
          confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-rose">ลบถาวร แน่ใจไหม?</span>
              <button type="button" className="adm-btn adm-danger" onClick={() => void remove()} disabled={saving}>
                ลบเลย
              </button>
              <button type="button" className="adm-btn" onClick={() => setConfirmDelete(false)}>
                ไม่ลบ
              </button>
            </div>
          ) : (
            <button type="button" className="adm-btn adm-danger" onClick={() => setConfirmDelete(true)}>
              ลบคอลเลกชัน
            </button>
          )
        ) : null}
      </div>
    </form>
  );
}
