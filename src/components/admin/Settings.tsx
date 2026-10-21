"use client";

import { useEffect, useState } from "react";
import { seedSettings } from "@/data/seed";
import type { SiteSettings } from "@/lib/types";
import { Text } from "./fields";
import { errText, sb } from "./lib";

const fields: { key: keyof SiteSettings; label: string; hint?: string }[] = [
  { key: "email", label: "อีเมลติดต่อ (แสดงบนเว็บ)" },
  { key: "gumroadStore", label: "ลิงก์ร้าน Gumroad" },
  { key: "amazonAuthor", label: "ลิงก์หน้าผู้เขียน Amazon" },
  { key: "tiktok", label: "ลิงก์ TikTok" },
  { key: "instagram", label: "ลิงก์ Instagram", hint: "เว้นว่าง = ไม่แสดง" },
  { key: "pinterest", label: "ลิงก์ Pinterest", hint: "เว้นว่าง = ไม่แสดง" },
];

export function SettingsAdmin() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void sb()
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error: e }) => {
        if (e) setError(e.message);
        setS({ ...seedSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) });
      });
  }, []);

  async function save() {
    if (!s) return;
    for (const f of fields) {
      const v = s[f.key].trim();
      if (f.key === "email") {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return setError("อีเมลไม่ถูกต้อง");
      } else if (v && !/^https:\/\//.test(v)) return setError(`${f.label} ต้องขึ้นต้นด้วย https://`);
    }
    setSaving(true);
    setError("");
    const { error: e } = await sb().from("site_settings").upsert({ id: 1, data: s });
    setSaving(false);
    if (e) setError(errText(e));
    else setMsg("บันทึกแล้ว");
  }

  if (!s) return <p className="text-lavender">กำลังโหลด…</p>;
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div>
        <h2 className="adm-h2">ตั้งค่าเว็บ</h2>
        <p className="adm-hint">อีเมลและลิงก์ที่แสดงในหน้า Contact และท้ายเว็บ</p>
      </div>
      <section className="adm-section">
        <div className="adm-grid">
          {fields.map((f) => (
            <Text
              key={f.key}
              label={f.label}
              hint={f.hint}
              value={s[f.key]}
              onChange={(v) => {
                setMsg("");
                setS({ ...s, [f.key]: v });
              }}
              wide
            />
          ))}
        </div>
      </section>
      {error ? (
        <p className="adm-error" role="alert">
          {error}
        </p>
      ) : null}
      {msg ? (
        <p className="adm-notice" role="status">
          {msg}
        </p>
      ) : null}
      <div>
        <button type="submit" className="adm-btn adm-primary" disabled={saving}>
          {saving ? "กำลังบันทึก…" : "บันทึก"}
        </button>
      </div>
    </form>
  );
}
