/**
 * Khram OS starting data (state on 4 Nov 2026, Brand Guide v2.0). Each section is written once, the first
 * time the OS tab opens and that section has no rows. Facts only; no passwords, card or bank numbers.
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

  // ---------- decisions (brand memory) ----------
  { kind: "decision", title: "Brand Guide v2.0: Every day has its own sky.", status: "ล็อกแล้ว", due: "2026-11-04", data: { area: "แบรนด์", why: "Khram ต้องยืนได้เองโดยไม่ผูกกับผู้ก่อตั้ง ครอบครัวรับช่วงต่อได้ · แกนคือชีวิตคนหลายเฉดเหมือนสีฟ้า · ไม่ใช้เรื่องผู้ก่อตั้ง ไม่ใช้เรื่องสีย้อม · sign-off: Leave it on the page.", url: "https://claude.ai/artifact/T8pDJaP3b3UZYPQq6YyV8h" } },
  { kind: "decision", title: "โลโก้ใหม่: รอยพู่กันครามเส้นเดียว สีต้นฉบับ บนพื้นขาว", status: "ล็อกแล้ว", due: "2026-11-04", data: { area: "แบรนด์", why: "แทนโลโก้วงแหวนเดิม · ห้ามเปลี่ยนสี (เวอร์ชันสีทองถูกปฏิเสธ)", url: "" } },
  { kind: "decision", title: "Night Studio ไม่ใช่ตัวตนหลัก (เป็นแค่ฟ้ากลางคืน)", status: "ล็อกแล้ว", due: "2026-11-04", data: { area: "แบรนด์", why: "ผูกแบรนด์กับเวลานอนแคบเกินไป", url: "" } },
  { kind: "decision", title: "ระบบอัตโนมัติ (Make + โพสต์อัตโนมัติ) ยังไม่เปิด · Khram OS เป็นที่เก็บข้อมูลหลัก", status: "ล็อกแล้ว", due: "2026-11-04", data: { area: "ระบบ", why: "ยังไม่มีคนดู ยังไม่มีช่องทางที่เชื่อม · เปิดเมื่อมีช่องทางที่มีคนดูจริง (ดูแท็บระบบเชื่อมต่อ)", url: "" } },
  { kind: "decision", title: "ลดราคา KDP ทั้ง 4 เล่ม (กำไร ~100 บาท/เล่ม)", status: "ล็อกแล้ว", due: "2026-11-03", data: { area: "ราคา", why: "ยังไม่มียอดขาย · INDIGO สี $19.99, ขาวดำ $9.99 · Quiet Year สี $16.99, ขาวดำ $11.99", url: "" } },
  { kind: "decision", title: "ย้ายเว็บไป khram.co", status: "ล็อกแล้ว", due: "2026-11-01", data: { area: "ช่องทาง", why: "โดเมนของแบรนด์เอง (GoDaddy) · GitHub Pages", url: "https://khram.co" } },
  { kind: "decision", title: "คำอธิบายสินค้า: เขียนแต่ข้อเท็จจริงจากไฟล์ และไม่บอกว่าเหมาะกับใคร", status: "ล็อกแล้ว", due: "2026-10-28", data: { area: "สินค้า", why: "ให้ลูกค้าตัดสินเอง · ห้ามแต่งข้อมูล", url: "" } },
  { kind: "decision", title: "INDIGO บน KDP มี 2 เล่ม: Full Color + Black & White", status: "ล็อกแล้ว", due: "2026-10-18", data: { area: "สินค้า", why: "ให้ลูกค้าเลือกได้ · ไม่ทำ Standard color", url: "" } },
  { kind: "decision", title: "ตลาดภาษาอังกฤษก่อน ไทยทีหลัง", status: "ล็อกแล้ว", due: "2026-10-16", data: { area: "ช่องทาง", why: "ยกเลิกเทส LINE OpenChat · สำเร็จต่างประเทศก่อนแล้วค่อยกลับไทย", url: "" } },
  { kind: "decision", title: "Amazon Merch on Demand ถูกปฏิเสธ → เสื้อไปทาง Printify/Etsy ทีหลัง", status: "ล็อกแล้ว", due: "2026-11-03", data: { area: "ช่องทาง", why: "Amazon ไม่ให้สมัครซ้ำ", url: "" } },

  // ---------- brand files ----------
  { kind: "asset", title: "KHRAM Brand Guide v2.0", status: "ใช้อยู่", data: { type: "เอกสาร", where: "Claude Docs (บัญชี Claude ของ Bank)", url: "https://claude.ai/artifact/T8pDJaP3b3UZYPQq6YyV8h", note: "source of truth ของทุกช่องทาง · ควร export เก็บใน Google Drive ของแบรนด์ด้วย" } },
  { kind: "asset", title: "ชุดโลโก้ (khram-logo-pack.zip)", status: "ใช้อยู่", data: { type: "โลโก้", where: "แชท Claude 4 พ.ย. → ควรเก็บใน Google Drive khram.official", url: "", note: "1024/800/512/400/320/200/180 px พื้นขาว + transparent + favicon · ต้องทำ vector" } },
  { kind: "asset", title: "พาเลตสี", status: "ใช้อยู่", data: { type: "สี", where: "Brand Guide v2.0 ส่วนที่ 5", url: "", note: "Night Indigo #060F24 · Deep Navy #101C3D · Antique Gold #D6AD82 · Moon Gold #D9B584 · Lavender Mist #A68DB6 · Soft Ivory #EDE6D8 · INDIGO Butterfly Blue #80B2DB" } },
  { kind: "asset", title: "ฟอนต์", status: "ใช้อยู่", data: { type: "ฟอนต์", where: "Google Fonts", url: "", note: "Cinzel (หัวข้อ) + Cormorant Garamond (เนื้อความ)" } },
  { kind: "asset", title: "Style block ภาพ (เทคนิค + ฟ้าแต่ละแบบ)", status: "ใช้อยู่", data: { type: "เอกสาร", where: "Brand Guide v2.0 ส่วนที่ 5", url: "", note: "painterly impasto · ห้ามมีตัวอักษร/โลโก้ในภาพที่ AI สร้าง" } },
  { kind: "asset", title: "Canva: INDIGO master (121 หน้า)", status: "ใช้อยู่", data: { type: "ไฟล์ต้นฉบับสินค้า", where: "Canva", url: "https://www.canva.com", note: "หลายดีไซน์ชื่อ INDIGO · ตัวหลัก 6.125×9.25 in" } },
  { kind: "asset", title: "Canva: 7 Nights (KHRAM_7NIGHTS_dark)", status: "ใช้อยู่", data: { type: "ไฟล์ต้นฉบับสินค้า", where: "Canva", url: "https://www.canva.com", note: "" } },
  { kind: "asset", title: "ไฟล์พิมพ์ KDP (interior + cover ทุกเล่ม)", status: "ใช้อยู่", data: { type: "ไฟล์ต้นฉบับสินค้า", where: "Mac ของ Bank: ~/Downloads/Amazon KDP/", url: "", note: "ควรสำรองขึ้น Google Drive ของแบรนด์" } },
  { kind: "asset", title: "โค้ดเว็บ khram.co", status: "ใช้อยู่", data: { type: "โค้ด", where: "GitHub khramofficial/khramofficial.github.io", url: "https://github.com/khramofficial/khramofficial.github.io", note: "deploy ผ่าน GitHub Actions" } },
  { kind: "asset", title: "เอกสารงานทั้งหมด (โปรเจกต์ Claude 'Khram')", status: "ใช้อยู่", data: { type: "เอกสาร", where: "claude.ai Project: Khram", url: "", note: "status, research, manuscripts, scripts" } },

  // ---------- product roadmap ----------
  { kind: "roadmap", title: "INDIGO · Shadow work journal", status: "เปิดขาย", data: { collection: "INDIGO", sky: "Indigo Sky", format: "Journal", evidence: "Gumroad PDF + KDP 2 เล่ม", note: "สินค้าหลัก 90 วันแรก" } },
  { kind: "roadmap", title: "7 Nights in INDIGO · ฟรี", status: "เปิดขาย", data: { collection: "7 Nights", sky: "Indigo Sky", format: "PDF ฟรี", evidence: "", note: "ทางเข้าหลักของ funnel" } },
  { kind: "roadmap", title: "The Quiet Year · Undated planner", status: "เปิดขาย", data: { collection: "The Quiet Year", sky: "", format: "Planner", evidence: "KDP 2 เล่ม", note: "ritual product ไม่ใช่คอลเลกชัน" } },
  { kind: "roadmap", title: "CRIMSON · Anxious attachment workbook", status: "กำลังทำ", data: { collection: "CRIMSON", sky: "Crimson Dusk", format: "Workbook", evidence: "เช็คตลาด 18 ต.ค. (claude/crimson-market-check.md)", note: "manuscript v1 เสร็จ 134 หน้า · ต้องแก้ประโยคเก่า (One more dip.) ให้เป็น v2.0 · ยังไม่เปิดจนกว่า INDIGO มียอดซ้ำ" } },
  { kind: "roadmap", title: "Unsent · จดหมายที่ไม่ได้ส่ง", status: "ไอเดีย", data: { collection: "CRIMSON", sky: "Crimson Dusk", format: "PDF ฟรี", evidence: "เทรนด์ no contact journal บน TikTok", note: "ทดสอบเป็น edition ของ CRIMSON ก่อน" } },
  { kind: "roadmap", title: "SAFFRON · กลับมาสงบ", status: "ไอเดีย", data: { collection: "SAFFRON", sky: "Saffron Dawn", format: "Journal", evidence: "", note: "วางแผนไว้ Q2 2027" } },
  { kind: "roadmap", title: "EBONY · อยู่กับการสูญเสีย", status: "ไอเดีย", data: { collection: "EBONY", sky: "Moonless Night", format: "Journal", evidence: "research 21 ต.ค. (claude/new-product-research-oct2026.md)", note: "สำรอง" } },
  { kind: "roadmap", title: "คอลเลกชันฟ้าสว่าง (ความฝัน / การเดินทาง / ของกิน)", status: "ไอเดีย", data: { collection: "ทั้งแบรนด์", sky: "Golden Sky", format: "Journal", evidence: "", note: "ตามแกน v2.0 ทุกแบบของวัน" } },
  { kind: "roadmap", title: "เสื้อ 'เรียบ สงบ สบาย' + กระเป๋าผ้า", status: "ไอเดีย", data: { collection: "ทั้งแบรนด์", sky: "", format: "เสื้อ / กระเป๋า", evidence: "", note: "ใช้โลโก้ vector · Printify/Etsy" } },
  { kind: "roadmap", title: "INDIGO บน Etsy / Lulu", status: "ไอเดีย", data: { collection: "INDIGO", sky: "Indigo Sky", format: "Journal", evidence: "", note: "ไฟล์ Lulu พร้อม แต่ปกหลังยังเป็นประโยคเก่า" } },

  // ---------- campaigns ----------
  { kind: "campaign", title: "Pinterest วันละ 1 pin", status: "วางแผน", data: { channel: "Pinterest", start: "", goal: "outbound click ไป 7 Nights / INDIGO", budget: "0", result: "", note: "10 pins พร้อมใน claude/pinterest-pins.md · ต้องปรับข้อความเป็น v2.0" } },
  { kind: "campaign", title: "TikTok EN @khram.journals (faceless)", status: "วางแผน", data: { channel: "TikTok", start: "", goal: "3 คลิปเกิน 10,000 วิว + 7 Nights 100 ดาวน์โหลด", budget: "0", result: "", note: "5 รูปแบบคอนเทนต์ตาม Brand Guide v2.0" } },
  { kind: "campaign", title: "Amazon Ads ทดสอบ INDIGO ขาวดำ", status: "วางแผน", data: { channel: "Amazon Ads", start: "", goal: "หา search term ที่ขายได้ · ACOS ไม่เกิน ~35%", budget: "", result: "", note: "รอ Bank ตัดสินใจงบ" } },
  { kind: "campaign", title: "อีเมล follow-up 3 ฉบับหลังโหลด 7 Nights", status: "วางแผน", data: { channel: "Gumroad", start: "", goal: "คนโหลดฟรีซื้อ INDIGO", budget: "0", result: "", note: "Gumroad ล็อกไว้จนยอดขายครบ $100 + payout ครั้งแรก · ต้องแก้ข้อความเป็น v2.0" } },

  // ---------- integrations ----------
  { kind: "integration", title: "สถิติเว็บ (ตัวนับของเราเอง)", status: "ใช้งาน", data: { does: "นับผู้เข้าชม + buy click แบบไม่ระบุตัวตน", how: "public/site.js → Supabase track() · ดูที่แท็บสถิติเว็บ", url: "https://khram.co/admin/" } },
  { kind: "integration", title: "Deploy เว็บ (GitHub Actions)", status: "ใช้งาน", data: { does: "สร้างเว็บใหม่ทุก push + ทุก 6 ชม.", how: "ถ้า push จาก Claude แล้วไม่ deploy ให้กด Run workflow เอง · หยุดเองถ้าไม่มี commit 60 วัน", url: "https://github.com/khramofficial/khramofficial.github.io/actions" } },
  { kind: "integration", title: "Google Search Console", status: "ใช้งาน", data: { does: "ดูว่า Google เห็นเว็บแค่ไหน", how: "บัญชี khram.official · property https://khram.co/", url: "https://search.google.com/search-console" } },
  { kind: "integration", title: "Gumroad → ตัวเลขขาย", status: "ยังไม่ตั้ง", data: { does: "ดึงยอดขาย/ดาวน์โหลดอัตโนมัติ", how: "ตอนนี้กรอกมือที่ตัวเลขรายสัปดาห์ · อนาคต: Gumroad webhook/API", url: "" } },
  { kind: "integration", title: "Amazon KDP → ตัวเลขขาย", status: "ยังไม่ตั้ง", data: { does: "ยอดขายเล่มกระดาษ", how: "KDP ไม่มี API ยอดขาย · ดู KDP Reports แล้วกรอกมือ", url: "https://kdp.amazon.com/reports" } },
  { kind: "integration", title: "Claude API → ร่างสคริปต์คอนเทนต์", status: "ยังไม่ตั้ง", data: { does: "ร่างสคริปต์จาก Brand Guide v2.0 แล้วรอคนอนุมัติ", how: "ต้องมี API key + งบ · ผูกกับแท็บคอนเทนต์", url: "" } },
  { kind: "integration", title: "Make.com → ระบบอัตโนมัติ", status: "ยังไม่ตั้ง", data: { does: "ต่อระบบต่างๆ เข้าหากัน (แผน GPT)", how: "เปิดเมื่อมีช่องทางที่มีคนดูจริง · ห้ามโพสต์อัตโนมัติโดยไม่มีคนอนุมัติ", url: "" } },
  { kind: "integration", title: "TikTok / Pinterest API → โพสต์ + ดึงตัวเลข", status: "ยังไม่ตั้ง", data: { does: "โพสต์และดึงยอดวิวอัตโนมัติ", how: "TikTok ต้องผ่าน audit ก่อนโพสต์สาธารณะ · Pinterest ต้องมี app ที่อนุมัติแล้ว", url: "" } },

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
