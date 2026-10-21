"use client";

import { useId, useState, type ReactNode } from "react";
import type { ImageAsset } from "@/lib/types";
import { errText, uploadImage } from "./lib";

export function Field({ label, hint, children, wide }: { label: string; hint?: string; children: (id: string) => ReactNode; wide?: boolean }) {
  const id = useId();
  return (
    <div className={`adm-field ${wide ? "md:col-span-2" : ""}`}>
      <label htmlFor={id} className="adm-label">
        {label}
      </label>
      {children(id)}
      {hint ? <p className="adm-hint">{hint}</p> : null}
    </div>
  );
}

export function Text({
  label,
  value,
  onChange,
  hint,
  wide,
  type = "text",
  placeholder,
  disabled,
  lang,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  wide?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  lang?: string;
}) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      {(id) => (
        <input
          id={id}
          className="adm-input"
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          lang={lang}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function Area({
  label,
  value,
  onChange,
  hint,
  rows = 4,
  lang,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
  lang?: string;
}) {
  return (
    <Field label={label} hint={hint} wide>
      {(id) => <textarea id={id} className="adm-input" rows={rows} value={value} lang={lang} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <select id={id} className="adm-input" value={value} onChange={(e) => onChange(e.target.value as T)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function Check({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3">
        <input id={id} type="checkbox" className="h-5 w-5 accent-[#d6ad82]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-ivory/85">{checked ? "เปิด" : "ปิด"}</span>
      </label>
      {hint ? <p className="adm-hint">{hint}</p> : null}
    </div>
  );
}

/** Image list with upload, alt text, reorder and remove. The first image is used where one image is needed. */
export function ImageList({
  label,
  images,
  onChange,
  folder,
  single = false,
  hint,
}: {
  label: string;
  images: ImageAsset[];
  onChange: (v: ImageAsset[]) => void;
  folder: string;
  single?: boolean;
  hint?: string;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const added: ImageAsset[] = [];
      for (const f of Array.from(files).slice(0, single ? 1 : 10)) {
        const up = await uploadImage(f, folder);
        added.push({ ...up, alt: "" });
      }
      onChange(single ? added : [...images, ...added]);
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  }

  const move = (i: number, d: number) => {
    const next = [...images];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    const a = next[i];
    const b = next[j];
    if (!a || !b) return;
    next[i] = b;
    next[j] = a;
    onChange(next);
  };

  return (
    <div className="adm-field md:col-span-2">
      <span className="adm-label">{label}</span>
      {hint ? <p className="adm-hint -mt-1 mb-2">{hint}</p> : null}
      <ul className="flex flex-col gap-3" role="list">
        {images.map((im, i) => (
          <li key={`${im.src}-${i}`} className="adm-card flex flex-col gap-3 p-3 sm:flex-row sm:items-start">
            <img src={im.src} alt="" className="h-28 w-28 shrink-0 bg-night object-contain" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-xs text-lavender" title={im.src}>
                {i === 0 && !single ? "รูปแรก · " : ""}
                {im.width}×{im.height}
              </p>
              <label className="adm-label" htmlFor={`${id}-alt-${i}`}>
                คำอธิบายรูป (สำหรับคนที่มองไม่เห็นรูป และ Google)
              </label>
              <input
                id={`${id}-alt-${i}`}
                className="adm-input"
                value={im.alt}
                onChange={(e) => onChange(images.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
              />
              <div className="flex flex-wrap gap-2">
                {!single ? (
                  <>
                    <button type="button" className="adm-btn-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                      ↑ ขึ้น
                    </button>
                    <button type="button" className="adm-btn-sm" onClick={() => move(i, 1)} disabled={i === images.length - 1}>
                      ↓ ลง
                    </button>
                  </>
                ) : null}
                <button type="button" className="adm-btn-sm adm-danger" onClick={() => onChange(images.filter((_, k) => k !== i))}>
                  เอาออก
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={id} className={`adm-btn ${busy ? "opacity-60" : ""}`}>
          {busy ? "กำลังอัปโหลด…" : single ? "อัปโหลดรูป" : "+ เพิ่มรูป"}
        </label>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple={!single}
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="adm-hint">ย่อเป็นไม่เกิน 1800px และแปลงเป็น WebP ให้อัตโนมัติ</span>
      </div>
      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LangTabs({ value, onChange }: { value: "en" | "th"; onChange: (v: "en" | "th") => void }) {
  return (
    <div className="flex gap-2" role="tablist" aria-label="ภาษาของข้อความ">
      {(["en", "th"] as const).map((l) => (
        <button key={l} type="button" role="tab" aria-selected={value === l} className={`adm-tab ${value === l ? "is-active" : ""}`} onClick={() => onChange(l)}>
          {l === "en" ? "English (หลัก)" : "ไทย"}
        </button>
      ))}
    </div>
  );
}
