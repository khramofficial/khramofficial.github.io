/**
 * Khram OS structure. Every section is a "kind" stored in public.os_items. To add a new section
 * later (a new channel, a new workflow), add one entry here: no database change is needed.
 */

export type FieldDef = { key: string; label: string; type?: "text" | "area" | "select" | "number" | "url" | "date"; options?: string[]; wide?: boolean };
export type KindDef = {
  group: GroupId;
  label: string;
  titleLabel: string;
  statuses: string[];
  /** Statuses that count as closed (hidden from "still open"). */
  done: string[];
  dueLabel?: string;
  fields: FieldDef[];
  listCols: string[];
  hint?: string;
  /** Title is chosen from a list instead of typed. */
  titleOptions?: string[];
};

export const GROUPS = [
  { id: "brand", label: "แบรนด์" },
  { id: "product", label: "สินค้า" },
  { id: "marketing", label: "การตลาด" },
  { id: "customers", label: "ลูกค้า" },
  { id: "money", label: "เงินและตัวเลข" },
  { id: "ops", label: "ระบบและงาน" },
  { id: "handover", label: "ส่งต่อ" },
] as const;
export type GroupId = (typeof GROUPS)[number]["id"];

const note: FieldDef = { key: "note", label: "โน้ต", type: "area", wide: true };
const url: FieldDef = { key: "url", label: "ลิงก์", type: "url", wide: true };
const collections = ["", "INDIGO", "7 Nights", "The Quiet Year", "CRIMSON", "SAFFRON", "EBONY", "ทั้งแบรนด์"];
const skies = ["", "Clear Sky", "Golden Sky", "Hot Sky", "Rainy Sky", "Indigo Sky", "Crimson Dusk", "Saffron Dawn", "Moonless Night", "Night Sky"];
const channels = ["khram.co", "Gumroad", "Amazon KDP", "Etsy", "Lulu", "TikTok Shop", "อื่นๆ"];
const social = ["TikTok", "Pinterest", "Instagram", "YouTube", "Facebook", "LINE", "อีเมล", "อื่นๆ"];

export const KINDS: Record<string, KindDef> = {
  /* ---------- แบรนด์ ---------- */
  decision: {
    group: "brand",
    label: "การตัดสินใจ",
    titleLabel: "ตัดสินใจอะไร",
    statuses: ["ล็อกแล้ว", "ทดลองอยู่", "เลิกใช้"],
    done: ["เลิกใช้"],
    dueLabel: "วันที่ตัดสินใจ",
    fields: [{ key: "area", label: "เรื่อง", type: "select", options: ["แบรนด์", "สินค้า", "ราคา", "ช่องทาง", "การตลาด", "ระบบ", "เงิน"] }, { key: "why", label: "เหตุผล / รายละเอียด", type: "area", wide: true }, url],
    listCols: ["area"],
    hint: "บันทึกทุกการตัดสินใจใหญ่ พร้อมเหตุผล คนที่มารับช่วงจะได้ไม่ต้องเดา",
  },
  asset: {
    group: "brand",
    label: "ไฟล์และเอกสารแบรนด์",
    titleLabel: "ชื่อไฟล์ / เอกสาร",
    statuses: ["ใช้อยู่", "ร่าง", "เลิกใช้"],
    done: ["เลิกใช้"],
    fields: [
      { key: "type", label: "ประเภท", type: "select", options: ["เอกสาร", "โลโก้", "สี", "ฟอนต์", "ภาพ", "ไฟล์ต้นฉบับสินค้า", "เทมเพลต", "โค้ด"] },
      { key: "where", label: "เก็บอยู่ที่ไหน", wide: true },
      url,
      note,
    ],
    listCols: ["type", "where"],
    hint: "ทุกไฟล์ต้นฉบับต้องรู้ว่าอยู่ที่ไหน และเปิดได้จากบัญชีของแบรนด์ (ไม่ใช่เครื่องส่วนตัวอย่างเดียว)",
  },

  /* ---------- สินค้า ---------- */
  roadmap: {
    group: "product",
    label: "แผนสินค้า",
    titleLabel: "สินค้า / ไอเดีย",
    statuses: ["ไอเดีย", "เช็คตลาด", "กำลังทำ", "เปิดขาย", "พัก"],
    done: ["เปิดขาย", "พัก"],
    dueLabel: "เป้าวันเปิดขาย",
    fields: [
      { key: "collection", label: "คอลเลกชัน", type: "select", options: collections },
      { key: "sky", label: "ฟ้า", type: "select", options: skies },
      { key: "format", label: "รูปแบบ", type: "select", options: ["Journal", "Planner", "PDF ฟรี", "Workbook", "การ์ด", "เสื้อ / กระเป๋า", "อื่นๆ"] },
      { key: "evidence", label: "หลักฐานว่าคนอยากได้", type: "area", wide: true },
      note,
    ],
    listCols: ["collection", "format"],
    hint: "ยังไม่เปิดสินค้าใหม่จนกว่า INDIGO จะมียอดขายซ้ำ · สินค้าใหม่ต้องมีฟ้า วันแบบไหน สี accent ภาพประจำ และประโยชน์ที่วัดได้",
  },
  listing: {
    group: "product",
    label: "ช่องทางขาย",
    titleLabel: "สินค้า · ฟอร์แมต",
    statuses: ["ขายอยู่", "รอรีวิว", "ต้องแก้", "ร่าง", "ปิด"],
    done: ["ขายอยู่", "ปิด"],
    dueLabel: "เช็คครั้งถัดไป",
    fields: [
      { key: "channel", label: "ร้าน", type: "select", options: channels },
      { key: "price", label: "ราคา (USD)", type: "number" },
      { key: "id", label: "รหัส (ASIN / slug)" },
      { key: "url", label: "ลิงก์หน้าร้าน", type: "url", wide: true },
      note,
    ],
    listCols: ["channel", "price", "id"],
    hint: "ราคาจริงยึดหน้า checkout ของร้าน · ข้อมูลสินค้าต้องเช็คกับไฟล์จริง · ไม่บอกว่าสินค้าเหมาะกับใคร",
  },

  /* ---------- การตลาด ---------- */
  content: {
    group: "marketing",
    label: "คอนเทนต์",
    titleLabel: "Hook / ชื่อชิ้นงาน",
    statuses: ["ไอเดีย", "เขียนบท", "พร้อมทำ", "โพสต์แล้ว", "พัก"],
    done: ["โพสต์แล้ว", "พัก"],
    dueLabel: "วันโพสต์",
    fields: [
      { key: "platform", label: "แพลตฟอร์ม", type: "select", options: social },
      { key: "sky", label: "ฟ้า (Brand Guide v2.0)", type: "select", options: skies },
      { key: "format", label: "รูปแบบ", type: "select", options: ["The Sky Today", "The Thought", "The Ritual", "The Object", "The Collection"] },
      { key: "collection", label: "สินค้าที่เกี่ยว", type: "select", options: collections },
      { key: "script", label: "สคริปต์ / แคปชัน", type: "area", wide: true },
      { key: "url", label: "ลิงก์โพสต์", type: "url", wide: true },
      { key: "views", label: "ยอดวิว", type: "number" },
      { key: "clicks", label: "คลิกลิงก์", type: "number" },
    ],
    listCols: ["platform", "sky", "format", "views"],
    hint: "ทุกชิ้นต้องผ่าน Brand Guide v2.0: ไม่มีเรื่องผู้ก่อตั้ง ไม่บอกว่าเหมาะกับใคร ไม่สัญญาว่ารักษา · โพสต์ขายของไม่เกิน 1 ใน 3",
  },
  campaign: {
    group: "marketing",
    label: "แคมเปญ",
    titleLabel: "ชื่อแคมเปญ",
    statuses: ["วางแผน", "กำลังรัน", "จบแล้ว", "ยกเลิก"],
    done: ["จบแล้ว", "ยกเลิก"],
    dueLabel: "วันจบ",
    fields: [
      { key: "channel", label: "ช่องทาง", type: "select", options: [...social, "Amazon Ads", "Gumroad"] },
      { key: "start", label: "วันเริ่ม", type: "date" },
      { key: "goal", label: "เป้าหมาย (วัดเป็นตัวเลข)", wide: true },
      { key: "budget", label: "งบ", type: "number" },
      { key: "result", label: "ผลลัพธ์", type: "area", wide: true },
      note,
    ],
    listCols: ["channel", "goal"],
  },
  creator: {
    group: "marketing",
    label: "ครีเอเตอร์ / Affiliate",
    titleLabel: "ชื่อ / @handle",
    statuses: ["รายชื่อ", "ติดต่อแล้ว", "ตกลง", "โพสต์แล้ว", "ไม่สนใจ"],
    done: ["โพสต์แล้ว", "ไม่สนใจ"],
    dueLabel: "ตามต่อวันที่",
    fields: [
      { key: "platform", label: "แพลตฟอร์ม", type: "select", options: social },
      { key: "followers", label: "ผู้ติดตาม", type: "number" },
      { key: "commission", label: "คอมมิชชัน / ข้อตกลง" },
      url,
      note,
    ],
    listCols: ["platform", "followers", "commission"],
    hint: "ใช้ Gumroad Affiliate กับสินค้าดิจิทัลก่อน · ครีเอเตอร์ต้องเปิดเผยว่าเป็น affiliate",
  },

  /* ---------- ลูกค้า ---------- */
  feedback: {
    group: "customers",
    label: "รีวิว / ฟีดแบ็ก / ซัพพอร์ต",
    titleLabel: "เรื่องสั้นๆ",
    statuses: ["ใหม่", "ตอบแล้ว", "ปิด"],
    done: ["ปิด"],
    dueLabel: "วันที่ได้รับ",
    fields: [
      { key: "source", label: "มาจาก", type: "select", options: ["Amazon รีวิว", "Gumroad", "อีเมล", "TikTok", "Pinterest", "Instagram", "อื่นๆ"] },
      { key: "type", label: "ประเภท", type: "select", options: ["รีวิว", "คำถาม", "ปัญหา / คืนเงิน", "ไอเดีย", "ชม"] },
      { key: "product", label: "สินค้า", type: "select", options: collections },
      { key: "rating", label: "ดาว (ถ้ามี)", type: "number" },
      { key: "text", label: "สิ่งที่ลูกค้าบอก (สรุป)", type: "area", wide: true },
      { key: "action", label: "เราทำอะไรต่อ", type: "area", wide: true },
    ],
    listCols: ["source", "type", "product"],
    hint: "ไม่เก็บชื่อ อีเมล หรือเรื่องส่วนตัวของลูกค้า · เรื่องวิกฤตส่งต่อสายด่วน ไม่ให้คำปรึกษาเอง",
  },

  /* ---------- เงินและตัวเลข ---------- */
  metric: {
    group: "money",
    label: "ตัวเลขรายสัปดาห์",
    titleLabel: "ช่องทาง",
    titleOptions: ["เว็บ", "Gumroad", "Amazon", "TikTok", "Pinterest", "Instagram", "อื่นๆ"],
    statuses: [""],
    done: [],
    dueLabel: "สัปดาห์ที่เริ่ม (วันจันทร์)",
    fields: [
      { key: "views", label: "วิว / ผู้เข้าชม", type: "number" },
      { key: "clicks", label: "คลิกลิงก์ / buy click", type: "number" },
      { key: "downloads", label: "ดาวน์โหลดฟรี", type: "number" },
      { key: "sales", label: "ยอดขาย (ชิ้น)", type: "number" },
      { key: "revenue", label: "รายได้", type: "number" },
      { key: "currency", label: "สกุลเงิน", type: "select", options: ["USD", "THB"] },
      note,
    ],
    listCols: ["views", "clicks", "downloads", "sales", "revenue"],
    hint: "กรอกทุกวันจันทร์ ช่องทางละแถว · รายได้คนละสกุลเงินไม่รวมกัน",
  },
  finance: {
    group: "money",
    label: "รายรับ-รายจ่าย",
    titleLabel: "รายการ",
    statuses: ["รายรับ", "รายจ่าย"],
    done: [],
    dueLabel: "วันที่",
    fields: [
      { key: "amount", label: "จำนวน", type: "number" },
      { key: "currency", label: "สกุลเงิน", type: "select", options: ["USD", "THB"] },
      { key: "category", label: "หมวด", type: "select", options: ["ยอดขาย / royalty", "payout เข้าบัญชี", "โดเมน / โฮสต์", "เครื่องมือ / subscription", "โฆษณา", "ตัวอย่างสินค้า", "ภาษี / ค่าธรรมเนียม", "อื่นๆ"] },
      { key: "channel", label: "จาก / ไปที่", type: "select", options: [...channels, "GoDaddy", "Canva", "Claude", "ChatGPT", "อื่นๆ"] },
      note,
    ],
    listCols: ["amount", "currency", "category"],
    hint: "ห้ามใส่เลขบัญชีหรือเลขบัตร · ใส่แค่จำนวน วันที่ และที่มา",
  },

  /* ---------- ระบบและงาน ---------- */
  task: {
    group: "ops",
    label: "งาน",
    titleLabel: "งาน",
    statuses: ["ต้องทำ", "กำลังทำ", "รอคนอื่น", "เสร็จ"],
    done: ["เสร็จ"],
    dueLabel: "กำหนดส่ง",
    fields: [
      { key: "owner", label: "ใครทำ", type: "select", options: ["Bank", "Claude", "Claude + Bank", "ครอบครัว", "อื่นๆ"] },
      { key: "area", label: "ส่วนไหน", type: "select", options: ["แบรนด์", "เว็บ", "Amazon", "Gumroad", "สินค้า", "คอนเทนต์", "ลูกค้า", "ระบบ", "เงิน"] },
      note,
    ],
    listCols: ["owner", "area"],
  },
  integration: {
    group: "ops",
    label: "ระบบเชื่อมต่อ",
    titleLabel: "ระบบ",
    statuses: ["ใช้งาน", "ยังไม่ตั้ง", "มีปัญหา", "ปิด"],
    done: ["ปิด"],
    dueLabel: "เช็คครั้งถัดไป",
    fields: [
      { key: "does", label: "ทำหน้าที่อะไร", wide: true },
      { key: "how", label: "เชื่อมยังไง / ต้องมีอะไร", type: "area", wide: true },
      url,
    ],
    listCols: ["does"],
    hint: "ใส่ระบบอัตโนมัติใหม่ที่นี่ก่อนเปิดใช้ (เช่น Make, Claude API, โพสต์อัตโนมัติ) · ห้ามใส่ API key",
  },

  /* ---------- ส่งต่อ ---------- */
  account: {
    group: "handover",
    label: "บัญชี",
    titleLabel: "บริการ",
    statuses: ["ใช้งาน", "ต้องตั้งค่า", "เลิกใช้"],
    done: ["เลิกใช้"],
    fields: [
      { key: "login", label: "อีเมล / ชื่อผู้ใช้ที่ล็อกอิน" },
      { key: "owner", label: "เจ้าของบัญชี" },
      { key: "recovery", label: "2FA / กู้คืนอยู่ที่ไหน", wide: true },
      url,
      { key: "note", label: "โน้ต (เงินเข้าที่ไหน ต้องทำอะไรทุกเดือน)", type: "area", wide: true },
    ],
    listCols: ["login", "owner"],
    hint: "ห้ามใส่รหัสผ่าน เลขบัตร หรือเลขบัญชีธนาคาร · เก็บรหัสไว้ใน password manager ที่ตั้ง emergency access ให้ครอบครัว",
  },
};

export const kindsOf = (g: GroupId) => Object.entries(KINDS).filter(([, d]) => d.group === g).map(([k]) => k);
