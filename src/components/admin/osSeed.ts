/**
 * Khram OS starting data (state on 4 Nov 2026, Brand Guide v2.0). Written once, the first time the
 * OS tab opens on an empty os_items table. Facts only; no passwords, card or bank numbers.
 */
export type SeedItem = { kind: string; title: string; status: string; due?: string; data: Record<string, string>; sort?: number };

const amazon = (asin: string) => `https://www.amazon.com/dp/${asin}`;

export const osSeed: SeedItem[] = [
  // ---------- sales channels (one row per product per store) ----------
  { kind: "listing", title: "INDIGO · Digital PDF", status: "ต้องแก้", data: { channel: "Gumroad", price: "17.99", id: "shadow-work-journal", url: "https://khramofficial.gumroad.com/l/shadow-work-journal", note: "คำอธิบายยังมี Still here. Still walking. / ความหมายแบบเก่า → แก้เป็น v2.0" } },
  { kind: "listing", title: "7 Nights in INDIGO · Free PDF", status: "ต้องแก้", data: { channel: "Gumroad", price: "0", id: "7-nights", url: "https://khramofficial.gumroad.com/l/7-nights", note: "คำอธิบาย + ไฟล์ PDF ยังมี Still light inside. → แก้เป็น v2.0" } },
  { kind: "listing", title: "INDIGO · Paperback Full Color", status: "รอรีวิว", data: { channel: "Amazon KDP", price: "19.99", id: "B0HNKH2M57", url: amazon("B0HNKH2M57"), note: "4 พ.ย. ส่งคำอธิบาย v2.0 + From the Author ใหม่ (รีวิว 72 ชม. / 3–5 วัน)" } },
  { kind: "listing", title: "INDIGO · Paperback Black & White", status: "รอรีวิว", data: { channel: "Amazon KDP", price: "9.99", id: "B0HNPFV52H", url: amazon("B0HNPFV52H"), note: "4 พ.ย. ส่งคำอธิบาย v2.0 + From the Author ใหม่" } },
  { kind: "listing", title: "The Quiet Year · Paperback Full Color", status: "ขายอยู่", data: { channel: "Amazon KDP", price: "16.99", id: "B0HPSV8ZX9", url: amazon("B0HPSV8ZX9"), note: "" } },
  { kind: "listing", title: "The Quiet Year · Paperback Black & White", status: "ขายอยู่", data: { channel: "Amazon KDP", price: "11.99", id: "B0HPPG5411", url: amazon("B0HPPG5411"), note: "" } },
  { kind: "listing", title: "khram.co · เว็บหลัก", status: "ต้องแก้", data: { channel: "khram.co", price: "", id: "", url: "https://khram.co/", note: "v2.0 ขึ้นแล้ว 4 พ.ย. เหลือคำอธิบาย INDIGO ในหลังบ้าน (มีคำว่า for people who feel deeply)" } },

  // ---------- tasks (what's open right now) ----------
  { kind: "task", title: "แก้คำอธิบาย INDIGO ในหลังบ้านเว็บให้ตรง v2.0", status: "ต้องทำ", data: { owner: "Claude", area: "เว็บ", note: "ตัด for people who feel deeply / think too much" }, sort: 1 },
  { kind: "task", title: "แก้คำอธิบาย Gumroad (INDIGO + 7 Nights) ให้ตรง v2.0", status: "ต้องทำ", data: { owner: "Claude", area: "Gumroad", note: "" }, sort: 2 },
  { kind: "task", title: "แก้ไฟล์หนังสือ: INDIGO p120, ปกหลัง KDP, 7 Nights PDF", status: "ต้องทำ", data: { owner: "Claude + Bank", area: "สินค้า", note: "Claude แก้ไฟล์ Bank อัปโหลด" }, sort: 3 },
  { kind: "task", title: "อัปรูปโปรไฟล์ Author Central เป็นโลโก้ใหม่ (khram-logo-1024.png)", status: "ต้องทำ", data: { owner: "Bank", area: "Amazon", note: "author.amazon.com → Profile → ดินสอบนรูป" }, sort: 4 },
  { kind: "task", title: "เปลี่ยนรูปโปรไฟล์ TikTok / Pinterest / Gumroad เป็นโลโก้ใหม่", status: "ต้องทำ", data: { owner: "Bank", area: "แบรนด์", note: "TikTok 200 px, Gumroad 512 px" }, sort: 5 },
  { kind: "task", title: "เช็คว่า Amazon แสดงคำอธิบาย + From the Author ใหม่แล้ว", status: "รอคนอื่น", due: "2026-11-11", data: { owner: "Claude", area: "Amazon", note: "รอรีวิว KDP / Author Central" }, sort: 6 },
  { kind: "task", title: "อัปเดตคำสั่ง GPT project ให้ใช้ Brand Guide v2.0", status: "ต้องทำ", data: { owner: "Claude + Bank", area: "ระบบ", note: "" }, sort: 7 },
  { kind: "task", title: "เขียนสคริปต์คอนเทนต์ 4 pillar ที่เหลือในเสียง v2.0", status: "ต้องทำ", data: { owner: "Claude", area: "คอนเทนต์", note: "" }, sort: 8 },
  { kind: "task", title: "เริ่มโพสต์ Pinterest วันละ 1 pin + TikTok EN", status: "ต้องทำ", data: { owner: "Bank", area: "คอนเทนต์", note: "ติด ?utm_source= ทุกลิงก์" }, sort: 9 },
  { kind: "task", title: "ทำ Khram Continuity Manual (บัญชี เจ้าของ ผู้รับช่วง)", status: "ต้องทำ", data: { owner: "Bank + Claude", area: "ระบบ", note: "กรอกแท็บบัญชีให้ครบก่อน" }, sort: 10 },
  { kind: "task", title: "ตรวจเครื่องหมายการค้า Khram + Every day has its own sky.", status: "ต้องทำ", data: { owner: "Bank", area: "แบรนด์", note: "US / TH หมวดเครื่องเขียน" }, sort: 11 },
  { kind: "task", title: "ทำโลโก้เวอร์ชัน vector + เวอร์ชันย่อ (favicon)", status: "ต้องทำ", data: { owner: "Bank", area: "แบรนด์", note: "ก่อนพิมพ์ของ / จดเครื่องหมาย" }, sort: 12 },
  { kind: "task", title: "เทียบ buy click ต่อผู้เข้าชม กับ baseline 25 ต.ค.", status: "ต้องทำ", due: "2026-11-15", data: { owner: "Claude", area: "เว็บ", note: "baseline 30 วัน: 14 visitors, 0 buy clicks" }, sort: 13 },

  // ---------- content pipeline ----------
  { kind: "content", title: "It ended hours ago. You're still in it.", status: "เขียนบท", data: { platform: "TikTok", sky: "Indigo Sky", format: "The Thought", collection: "INDIGO", script: "สคริปต์ 30 วิ อยู่ใน 03_first_master_video.json (ต้องเปลี่ยน sign-off เป็น Leave it on the page.)", url: "", views: "", clicks: "" } },
  { kind: "content", title: "Good light, nowhere to be. That counts as a plan.", status: "ไอเดีย", data: { platform: "Pinterest", sky: "Golden Sky", format: "The Sky Today", collection: "", script: "", url: "", views: "", clicks: "" } },
  { kind: "content", title: "It's 1:14 AM. Your brain has opinions.", status: "ไอเดีย", data: { platform: "TikTok", sky: "Night Sky", format: "The Sky Today", collection: "INDIGO", script: "", url: "", views: "", clicks: "" } },
  { kind: "content", title: "One page before sleep: how INDIGO works", status: "ไอเดีย", data: { platform: "TikTok", sky: "Night Sky", format: "The Object", collection: "INDIGO", script: "", url: "", views: "", clicks: "" } },
  { kind: "content", title: "A year, one page at a time (The Quiet Year flip-through)", status: "ไอเดีย", data: { platform: "Pinterest", sky: "Clear Sky", format: "The Collection", collection: "The Quiet Year", script: "", url: "", views: "", clicks: "" } },

  // ---------- accounts register (NO passwords) ----------
  { kind: "account", title: "Gmail (อีเมลหลักของแบรนด์)", status: "ใช้งาน", data: { login: "khram.official@gmail.com", owner: "Bank", recovery: "", url: "https://mail.google.com", note: "ใช้ล็อกอิน KDP, Supabase, Search Console, หลังบ้านเว็บ" } },
  { kind: "account", title: "Amazon KDP + Author Central", status: "ใช้งาน", data: { login: "khram.official@gmail.com", owner: "Bank", recovery: "", url: "https://kdp.amazon.com", note: "ค่า royalty เข้าบัญชีธนาคารที่ตั้งไว้ใน KDP · ทายาทต้องติดต่อ KDP พร้อมใบมรณบัตร + เอกสารศาล" } },
  { kind: "account", title: "Gumroad (khramofficial)", status: "ใช้งาน", data: { login: "", owner: "Bank", recovery: "", url: "https://gumroad.com", note: "Payout → KBank (THB) · ขั้นต่ำ $100" } },
  { kind: "account", title: "khram.co โดเมน (GoDaddy)", status: "ใช้งาน", data: { login: "", owner: "Bank", recovery: "", url: "https://dcc.godaddy.com", note: "ตั้ง auto-renew · DNS ชี้ GitHub Pages" } },
  { kind: "account", title: "GitHub org khramofficial (โค้ดเว็บ)", status: "ใช้งาน", data: { login: "Ashborne-app (owner)", owner: "Bank", recovery: "Authenticator app (2FA)", url: "https://github.com/khramofficial", note: "repo khramofficial.github.io" } },
  { kind: "account", title: "Supabase (ฐานข้อมูลเว็บ)", status: "ใช้งาน", data: { login: "khram.official@gmail.com", owner: "Bank", recovery: "", url: "https://supabase.com/dashboard/project/hobwlswwwvmfqawdgjip", note: "แยกจาก Ashborne" } },
  { kind: "account", title: "Google Search Console", status: "ใช้งาน", data: { login: "khram.official@gmail.com", owner: "Bank", recovery: "", url: "https://search.google.com/search-console", note: "property https://khram.co/" } },
  { kind: "account", title: "Canva (ไฟล์ต้นฉบับสมุด)", status: "ใช้งาน", data: { login: "", owner: "Bank", recovery: "", url: "https://www.canva.com", note: "INDIGO master, 7 Nights, The Quiet Year" } },
  { kind: "account", title: "TikTok @khram.journals (EN)", status: "ใช้งาน", data: { login: "", owner: "Bank", recovery: "", url: "https://www.tiktok.com/@khram.journals", note: "" } },
  { kind: "account", title: "TikTok @khram.thai (TH)", status: "ใช้งาน", data: { login: "", owner: "Bank", recovery: "", url: "https://www.tiktok.com/@khram.thai", note: "พักไว้" } },
  { kind: "account", title: "Pinterest khramofficial", status: "ต้องตั้งค่า", data: { login: "", owner: "Bank", recovery: "", url: "https://www.pinterest.com", note: "เปลี่ยนชื่อโปรไฟล์เป็น Khram + business account" } },
];
