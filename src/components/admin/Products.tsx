"use client";

import { useEffect, useMemo, useState } from "react";
import type { CollectionRow, ProductRow } from "@/lib/catalog";
import type { ImageAsset, ProductStatus, ProductText, Store } from "@/lib/types";
import { Area, Check, ImageList, LangTabs, Select, Text } from "./fields";
import {
  errText,
  fromFaq,
  fromLines,
  fromPairs,
  fromParas,
  fromSpecs,
  productStatusTh,
  sb,
  slugOk,
  stores,
  toFaq,
  toLines,
  toPairs,
  toParas,
  toSpecs,
} from "./lib";

interface TextForm {
  format: string;
  subtitle: string;
  summary: string;
  description: string;
  includedHeading: string;
  included: string;
  specs: string;
  howItWorks: string;
  outlineHeading: string;
  outlineItems: string;
  faq: string;
  priceLabel: string;
  ctaLabel: string;
  notes: string;
}

interface Form {
  isNew: boolean;
  slug: string;
  name: string;
  collection: string;
  status: ProductStatus;
  price: string;
  store: Store | "";
  url: string;
  published: boolean;
  sort: string;
  samplePrompts: string;
  cover: ImageAsset[];
  gallery: ImageAsset[];
  ogImage: string | null;
  en: TextForm;
  th: TextForm;
}

const emptyText = (): TextForm => ({
  format: "",
  subtitle: "",
  summary: "",
  description: "",
  includedHeading: "",
  included: "",
  specs: "",
  howItWorks: "",
  outlineHeading: "",
  outlineItems: "",
  faq: "",
  priceLabel: "",
  ctaLabel: "",
  notes: "",
});

function textFrom(t: Partial<ProductText> | undefined): TextForm {
  return {
    format: t?.format ?? "",
    subtitle: t?.subtitle ?? "",
    summary: t?.summary ?? "",
    description: toParas(t?.description),
    includedHeading: t?.includedHeading ?? "",
    included: toLines(t?.included),
    specs: toSpecs(t?.specs),
    howItWorks: toLines(t?.howItWorks),
    outlineHeading: t?.outline?.heading ?? "",
    outlineItems: toPairs((t?.outline?.items ?? []).map((i) => ({ a: i.title, b: i.text }))),
    faq: toFaq(t?.faq),
    priceLabel: t?.priceLabel ?? "",
    ctaLabel: t?.ctaLabel ?? "",
    notes: toLines(t?.notes),
  };
}

function textTo(f: TextForm): ProductText {
  const items = fromPairs(f.outlineItems).map((p) => ({ title: p.a, text: p.b }));
  const how = fromLines(f.howItWorks);
  return {
    format: f.format.trim(),
    subtitle: f.subtitle.trim(),
    summary: f.summary.trim(),
    description: fromParas(f.description),
    includedHeading: f.includedHeading.trim() || null,
    included: fromLines(f.included),
    specs: fromSpecs(f.specs),
    howItWorks: how.length ? how : null,
    outline: items.length ? { heading: f.outlineHeading.trim(), items } : null,
    faq: fromFaq(f.faq),
    priceLabel: f.priceLabel.trim(),
    ctaLabel: f.ctaLabel.trim(),
    notes: fromLines(f.notes),
  };
}

const img = (i: Partial<ImageAsset> | null | undefined): ImageAsset[] =>
  i?.src ? [{ src: i.src, alt: i.alt ?? "", width: Number(i.width) || 1200, height: Number(i.height) || 1200 }] : [];

function toForm(r: ProductRow): Form {
  const en: ProductText = {
    format: r.format,
    subtitle: r.subtitle,
    summary: r.summary,
    description: r.description,
    includedHeading: r.included_heading,
    included: r.included,
    specs: r.specs,
    howItWorks: r.how_it_works,
    outline: r.outline,
    faq: r.faq,
    priceLabel: r.price_label,
    ctaLabel: r.cta_label,
    notes: r.notes,
  };
  return {
    isNew: false,
    slug: r.slug,
    name: r.name,
    collection: r.collection,
    status: r.status,
    price: r.price === null || r.price === undefined ? "" : String(r.price),
    store: r.store ?? "",
    url: r.url ?? "",
    published: r.published,
    sort: String(r.sort ?? 0),
    samplePrompts: toLines(r.sample_prompts),
    cover: img(r.cover),
    gallery: (r.gallery ?? []).flatMap((g) => img(g)),
    ogImage: r.og_image,
    en: textFrom(en),
    th: textFrom(r.i18n?.th),
  };
}

function newForm(collection: string, sort: number): Form {
  return {
    isNew: true,
    slug: "",
    name: "",
    collection,
    status: "available",
    price: "",
    store: "Gumroad",
    url: "",
    published: false,
    sort: String(sort),
    samplePrompts: "",
    cover: [],
    gallery: [],
    ogImage: null,
    en: { ...emptyText(), ctaLabel: "Buy on Gumroad" },
    th: { ...emptyText(), ctaLabel: "ซื้อที่ Gumroad" },
  };
}

function toRow(f: Form): ProductRow {
  const en = textTo(f.en);
  const th = textTo(f.th);
  const prompts = fromLines(f.samplePrompts);
  const cover = f.cover[0] ?? f.gallery[0] ?? { src: "", alt: "", width: 1200, height: 1200 };
  return {
    slug: f.slug.trim(),
    collection: f.collection,
    name: f.name.trim(),
    format: en.format,
    subtitle: en.subtitle,
    status: f.status,
    price: f.price.trim() === "" ? null : Number(f.price),
    price_label: en.priceLabel,
    store: f.store || null,
    url: f.url.trim() || null,
    cta_label: en.ctaLabel,
    notes: en.notes,
    summary: en.summary,
    description: en.description,
    included: en.included,
    included_heading: en.includedHeading,
    specs: en.specs,
    how_it_works: en.howItWorks,
    outline: en.outline,
    sample_prompts: prompts.length ? prompts : null,
    faq: en.faq,
    cover,
    gallery: f.gallery.length ? f.gallery : f.cover,
    og_image: f.ogImage,
    i18n: { th },
    published: f.published,
    sort: Number(f.sort) || 0,
  };
}

function validate(f: Form): string | null {
  if (!slugOk(f.slug.trim())) return "ชื่อในลิงก์ (slug) ใช้ได้แค่ a-z 0-9 และ - ยาว 2-60 ตัว เช่น crimson-paperback";
  if (!f.name.trim()) return "ใส่ชื่อสินค้า";
  if (f.url.trim() && !/^https:\/\//.test(f.url.trim())) return "ลิงก์ซื้อต้องขึ้นต้นด้วย https://";
  if ((f.status === "available" || f.status === "free") && !f.url.trim()) return "สถานะพร้อมขาย/ฟรี ต้องมีลิงก์ซื้อ";
  if (f.price.trim() !== "" && (Number.isNaN(Number(f.price)) || Number(f.price) < 0)) return "ราคาต้องเป็นตัวเลข เช่น 17.99 (เว้นว่างถ้ายังไม่กำหนด)";
  if (f.cover.length === 0 && f.gallery.length === 0) return "เพิ่มรูปอย่างน้อย 1 รูป";
  return null;
}

export function ProductsAdmin({ siteUrl }: { siteUrl: string }) {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setError("");
    const [p, c] = await Promise.all([
      sb().from("products").select("*").order("sort"),
      sb().from("collections").select("*").order("sort"),
    ]);
    if (p.error) setError(p.error.message);
    else setRows(p.data as ProductRow[]);
    if (!c.error) setCollections(c.data as CollectionRow[]);
  }
  useEffect(() => {
    void load();
  }, []);

  const nextSort = useMemo(() => (rows ? Math.max(0, ...rows.map((r) => r.sort)) + 1 : 1), [rows]);

  if (form)
    return (
      <ProductEditor
        initial={form}
        collections={collections}
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
          <h2 className="adm-h2">สินค้า</h2>
          <p className="adm-hint">แก้แล้วกดบันทึก เว็บจะแสดงข้อมูลใหม่ทันทีที่มีคนเปิดหน้า</p>
        </div>
        <button type="button" className="adm-btn adm-primary" onClick={() => setForm(newForm(collections[0]?.slug ?? "indigo", nextSort))}>
          + เพิ่มสินค้า
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
      ) : rows.length === 0 ? (
        <p className="text-lavender">ยังไม่มีสินค้า กด “เพิ่มสินค้า”</p>
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {rows.map((r) => (
            <li key={r.slug} className="adm-card flex items-center gap-4 p-3">
              {r.cover?.src || r.gallery?.[0]?.src ? (
                <img src={r.cover?.src || r.gallery?.[0]?.src} alt="" className="h-16 w-16 shrink-0 bg-night object-contain" />
              ) : (
                <div className="h-16 w-16 shrink-0 bg-night" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display tracking-[0.06em] text-ivory">
                  {r.name} <span className="text-lavender">· {r.format}</span>
                </p>
                <p className="text-sm text-ivory/70">
                  {r.price_label || "—"} · {productStatusTh[r.status]} · {r.collection.toUpperCase()}
                  {!r.published ? <span className="ml-2 text-rose">ซ่อนอยู่</span> : null}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <a className="adm-btn-sm" href={`${siteUrl}/products/${r.slug}/`} target="_blank" rel="noopener noreferrer">
                  ดูหน้าเว็บ
                </a>
                <button type="button" className="adm-btn-sm adm-primary" onClick={() => setForm(toForm(r))}>
                  แก้ไข
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductEditor({
  initial,
  collections,
  siteUrl,
  onClose,
}: {
  initial: Form;
  collections: CollectionRow[];
  siteUrl: string;
  onClose: (msg?: string) => void;
}) {
  const [f, setF] = useState<Form>(initial);
  const [lang, setLang] = useState<"en" | "th">("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const setT = (k: keyof TextForm, v: string) => setF((x) => ({ ...x, [lang]: { ...x[lang], [k]: v } }));
  const t = f[lang];
  const L = lang === "en" ? "en" : "th";
  const folder = `products/${f.slug.trim() || "new"}`;

  async function save() {
    const problem = validate(f);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError("");
    const row = toRow(f);
    const res = f.isNew ? await sb().from("products").insert(row) : await sb().from("products").update(row).eq("slug", initial.slug);
    setSaving(false);
    if (res.error) {
      setError(res.error.code === "23505" ? "มีสินค้าที่ใช้ชื่อในลิงก์นี้แล้ว ลองชื่ออื่น" : errText(res.error));
      return;
    }
    onClose(`บันทึก “${row.name} · ${row.format}” แล้ว`);
  }

  async function remove() {
    setSaving(true);
    const res = await sb().from("products").delete().eq("slug", initial.slug);
    setSaving(false);
    if (res.error) {
      setError(errText(res.error));
      return;
    }
    onClose(`ลบ “${initial.name}” แล้ว`);
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
            ← กลับไปรายการสินค้า
          </button>
          <h2 className="adm-h2 mt-2">{f.isNew ? "เพิ่มสินค้าใหม่" : `แก้ไข ${initial.name} · ${initial.en.format}`}</h2>
        </div>
        {!f.isNew ? (
          <a className="adm-btn-sm" href={`${siteUrl}/products/${initial.slug}/`} target="_blank" rel="noopener noreferrer">
            ดูหน้าเว็บ ↗
          </a>
        ) : null}
      </div>

      <section className="adm-section">
        <h3 className="adm-h3">ข้อมูลหลัก</h3>
        <div className="adm-grid">
          <Text label="ชื่อสินค้า (แสดงทั้ง 2 ภาษา)" value={f.name} onChange={(v) => set("name", v)} placeholder="เช่น CRIMSON" />
          <Text
            label="ชื่อในลิงก์ (slug)"
            value={f.slug}
            onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            hint={f.isNew ? `ลิงก์จะเป็น ${siteUrl}/products/${f.slug || "..."}/` : "เปลี่ยนไม่ได้หลังสร้าง (ลิงก์เดิมจะเสีย)"}
            disabled={!f.isNew}
          />
          <Select
            label="คอลเลกชัน"
            value={f.collection}
            options={collections.map((c) => ({ value: c.slug, label: c.name }))}
            onChange={(v) => set("collection", v)}
          />
          <Select
            label="สถานะ"
            value={f.status}
            options={(Object.keys(productStatusTh) as ProductStatus[]).map((s) => ({ value: s, label: productStatusTh[s] }))}
            onChange={(v) => set("status", v)}
          />
          <Check label="แสดงบนเว็บ" checked={f.published} onChange={(v) => set("published", v)} hint="ปิดไว้ = ซ่อนจากคนทั่วไป (ร่าง)" />
          <Text label="ลำดับ (น้อยขึ้นก่อน)" type="number" value={f.sort} onChange={(v) => set("sort", v)} />
        </div>
      </section>

      <section className="adm-section">
        <h3 className="adm-h3">ราคาและลิงก์ซื้อ</h3>
        <div className="adm-grid">
          <Text label="ราคา (USD, ตัวเลข)" value={f.price} onChange={(v) => set("price", v)} placeholder="17.99 หรือเว้นว่าง" />
          <Select
            label="ขายที่ไหน"
            value={f.store}
            options={[{ value: "" as const, label: "— ยังไม่ขาย —" }, ...stores.map((s) => ({ value: s, label: s }))]}
            onChange={(v) => set("store", v)}
          />
          <Text label="ลิงก์ซื้อ (https://...)" value={f.url} onChange={(v) => set("url", v)} wide placeholder="https://khramofficial.gumroad.com/l/..." />
        </div>
      </section>

      <section className="adm-section">
        <h3 className="adm-h3">รูป</h3>
        <div className="adm-grid">
          <ImageList label="รูปปก (ใช้ในการ์ดสินค้า)" images={f.cover} onChange={(v) => set("cover", v)} folder={folder} single />
          <ImageList
            label="รูปในหน้าสินค้า (แกลเลอรี)"
            images={f.gallery}
            onChange={(v) => set("gallery", v)}
            folder={folder}
            hint="รูปแรกแสดงใหญ่ ถ้าไม่ใส่ จะใช้รูปปก"
          />
        </div>
      </section>

      <section className="adm-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="adm-h3">ข้อความ</h3>
          <LangTabs value={lang} onChange={setLang} />
        </div>
        <p className="adm-hint">
          {lang === "en"
            ? "ภาษาอังกฤษคือภาษาหลักของเว็บ ต้องกรอก"
            : "ภาษาไทยไม่บังคับ ช่องไหนว่าง หน้าภาษาไทยจะแสดงภาษาอังกฤษแทน"}
        </p>
        <div className="adm-grid">
          <Text label="รูปแบบ" value={t.format} onChange={(v) => setT("format", v)} lang={L} placeholder={lang === "en" ? "Paperback · Full color" : "เล่มกระดาษ · สีทั้งเล่ม"} />
          <Text label="คำโปรย (subtitle)" value={t.subtitle} onChange={(v) => setT("subtitle", v)} lang={L} />
          <Text label="ป้ายราคา" value={t.priceLabel} onChange={(v) => setT("priceLabel", v)} lang={L} placeholder={lang === "en" ? "$17.99 / Free" : "$17.99 / ฟรี"} />
          <Text label="ข้อความบนปุ่มซื้อ" value={t.ctaLabel} onChange={(v) => setT("ctaLabel", v)} lang={L} placeholder={lang === "en" ? "Buy on Gumroad" : "ซื้อที่ Gumroad"} />
          <Area label="สรุปสั้น (1-2 ประโยค)" value={t.summary} onChange={(v) => setT("summary", v)} rows={2} lang={L} />
          <Area label="คำอธิบาย" value={t.description} onChange={(v) => setT("description", v)} rows={6} lang={L} hint="เว้นบรรทัดว่าง 1 บรรทัดระหว่างย่อหน้า" />
          <Area label="หมายเหตุใต้ปุ่มซื้อ" value={t.notes} onChange={(v) => setT("notes", v)} rows={3} lang={L} hint="บรรทัดละข้อ" />
          <Text label="หัวข้อรายการ “ข้างในมีอะไร”" value={t.includedHeading} onChange={(v) => setT("includedHeading", v)} lang={L} hint="เว้นว่าง = What's inside / ข้างในมีอะไร" wide />
          <Area label="ข้างในมีอะไร" value={t.included} onChange={(v) => setT("included", v)} rows={6} lang={L} hint="บรรทัดละข้อ" />
          <Area label="รายละเอียด (สเปก)" value={t.specs} onChange={(v) => setT("specs", v)} rows={6} lang={L} hint="บรรทัดละข้อ แบบ  หัวข้อ: ค่า  เช่น  Pages: 122" />
          <Area label="วิธีใช้ (ถ้ามี)" value={t.howItWorks} onChange={(v) => setT("howItWorks", v)} rows={4} lang={L} hint="บรรทัดละขั้น" />
          <Text label="หัวข้อโครงเรื่อง (ถ้ามี)" value={t.outlineHeading} onChange={(v) => setT("outlineHeading", v)} lang={L} wide />
          <Area label="โครงเรื่อง" value={t.outlineItems} onChange={(v) => setT("outlineItems", v)} rows={4} lang={L} hint="บรรทัดละข้อ แบบ  ชื่อ | คำอธิบาย  เช่น  Act I · The Deep Night | ..." />
          <Area label="คำถามที่พบบ่อยของสินค้านี้ (ถ้ามี)" value={t.faq} onChange={(v) => setT("faq", v)} rows={4} lang={L} hint="บรรทัดละข้อ แบบ  คำถาม | คำตอบ" />
          {lang === "en" ? (
            <Area label="ตัวอย่างคำถามในเล่ม (ภาษาอังกฤษ ใช้ทั้ง 2 หน้า)" value={f.samplePrompts} onChange={(v) => set("samplePrompts", v)} rows={4} lang="en" hint="บรรทัดละคำถาม" />
          ) : null}
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
          <button type="button" className="adm-btn" onClick={() => onClose()} disabled={saving}>
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
              ลบสินค้า
            </button>
          )
        ) : null}
      </div>
    </form>
  );
}
