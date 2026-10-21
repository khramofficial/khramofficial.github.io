"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/config";
import type { CollectionStatus, ProductStatus, QA, Spec, Store } from "@/lib/types";

let client: SupabaseClient | null = null;

/** One Supabase client for the admin, signed in through an email link. */
export function sb(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseConfig.url, supabaseConfig.key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "khram-admin" },
    });
  }
  return client;
}

/* ---------- text <-> list helpers for simple textareas ---------- */

export const toLines = (a: string[] | null | undefined) => (a ?? []).join("\n");
export const fromLines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export const toParas = (a: string[] | null | undefined) => (a ?? []).join("\n\n");
export const fromParas = (s: string) =>
  s
    .split(/\n\s*\n/)
    .map((x) => x.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

export const toSpecs = (a: Spec[] | null | undefined) => (a ?? []).map((s) => `${s.label}: ${s.value}`).join("\n");
export const fromSpecs = (s: string): Spec[] =>
  fromLines(s).map((line) => {
    const i = line.indexOf(":");
    return i === -1 ? { label: line, value: "" } : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  });

export const toPairs = (a: { a: string; b: string }[]) => a.map((p) => `${p.a} | ${p.b}`).join("\n");
export const fromPairs = (s: string) =>
  fromLines(s).map((line) => {
    const i = line.indexOf("|");
    return i === -1 ? { a: line, b: "" } : { a: line.slice(0, i).trim(), b: line.slice(i + 1).trim() };
  });

export const toFaq = (a: QA[] | null | undefined) => toPairs((a ?? []).map((x) => ({ a: x.q, b: x.a })));
export const fromFaq = (s: string): QA[] | null => {
  const v = fromPairs(s).map((p) => ({ q: p.a, a: p.b }));
  return v.length ? v : null;
};

export const slugOk = (s: string) => /^[a-z0-9-]{2,60}$/.test(s);

export const productStatusTh: Record<ProductStatus, string> = {
  available: "พร้อมขาย (มีลิงก์ซื้อ)",
  free: "ฟรี (มีลิงก์รับ)",
  "coming-soon": "เร็วๆ นี้ (ยังไม่มีลิงก์)",
  "in-progress": "กำลังทำ (ยังไม่ขาย)",
};

export const collectionStatusTh: Record<CollectionStatus, string> = {
  available: "พร้อมขาย",
  "in-progress": "กำลังทำ",
  planned: "อยู่ในแผน",
};

export const stores: Store[] = ["Gumroad", "Amazon", "Etsy", "Lulu", "Other"];

/** Resize an image in the browser and turn it into WebP before upload (keeps the site fast). */
export async function toWebp(file: File, max = 1800): Promise<{ blob: Blob; width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ไม่สามารถประมวลผลรูปได้");
  ctx.drawImage(bmp, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("แปลงรูปไม่สำเร็จ"))), "image/webp", 0.86),
  );
  return { blob, width, height };
}

export async function uploadImage(file: File, folder: string): Promise<{ src: string; width: number; height: number }> {
  const { blob, width, height } = await toWebp(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
  const { error } = await sb().storage.from("media").upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(`อัปโหลดไม่สำเร็จ: ${error.message}`);
  const { data } = sb().storage.from("media").getPublicUrl(path);
  return { src: data.publicUrl, width, height };
}

export function errText(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return String(e);
}
