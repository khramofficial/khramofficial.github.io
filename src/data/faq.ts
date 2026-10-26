import type { Lang, QA } from "@/lib/types";

export interface FaqGroup {
  id: string;
  heading: string;
  items: QA[];
}

const en: FaqGroup[] = [
  {
    id: "journals",
    heading: "The journals",
    items: [
      {
        q: "What does Khram mean?",
        a: "Khram (คราม) is the person who makes these journals: an ordinary person who has gotten a lot wrong, who nearly died once, and who decided that this time they won't give up, so their last day isn't spent regretting never doing what they wanted to do. The line the brand keeps coming back to is \"I did the best I could.\" The full story is on the Our Story page.",
      },
      {
        q: "What is shadow work?",
        a: "Shadow work means looking at the feelings, habits and parts of yourself you usually avoid: the anger you swallow, the fear behind people-pleasing, the old rules you still follow. INDIGO does this with one plain question at a time and a page to write on.",
      },
      {
        q: "I've never done this before. Is INDIGO for beginners?",
        a: "Yes. It starts gently and goes in order. If you want to try first, 7 Nights in INDIGO is free and uses fourteen prompts from the full journal.",
      },
      { q: "What if a prompt feels too heavy?", a: "Skip it. You can come back another night, or not at all. Act II (inner child work) says this on the page too." },
      { q: "How long does it take?", a: "Ten minutes a night is enough. There is no schedule to keep. Missed a night? Pick up where you left off." },
      {
        q: "Is this therapy?",
        a: "No. Khram journals are self-reflection tools, not a substitute for professional mental health care. If you're struggling, please reach out to a qualified professional. If you're in crisis, contact your local emergency number or find a helpline at findahelpline.com.",
      },
    ],
  },
  {
    id: "formats",
    heading: "Formats",
    items: [
      {
        q: "Digital or paperback?",
        a: "The digital PDF is for writing on a tablet with a stylus. The paperback is for writing by hand. Full Color keeps the night-sky art on every page (use a white, gold or silver gel pen). Black & White has a white panel you can write on with any pen.",
      },
      { q: "Which apps work with the PDF?", a: "GoodNotes, Notability, Noteshelf, Xodo, Samsung Notes and any app that lets you write on a PDF. It also opens on a computer." },
      { q: "Can I print the digital PDF?", a: "Yes, for personal use. The dark pages use a lot of ink, so the paperback is usually the better choice for paper." },
      { q: "Is the Black & White paperback available?", a: "Yes. It is on Amazon for $17.99, next to the Full Color edition ($24.99)." },
    ],
  },
  {
    id: "orders",
    heading: "Orders",
    items: [
      { q: "Where do I buy?", a: "Digital journals are sold on Gumroad. Paperbacks are printed, sold and shipped by Amazon." },
      { q: "How do I get the PDF after buying?", a: "Gumroad shows a download button right after checkout and emails you a copy of the link." },
      { q: "Can I get a refund?", a: "Digital journals on Gumroad have a 14-day money-back guarantee. Paperback orders, delivery and returns are handled by Amazon." },
      { q: "What languages are the journals in?", a: "English. This website is in English and Thai." },
    ],
  },
];

const th: FaqGroup[] = [
  {
    id: "journals",
    heading: "เกี่ยวกับสมุด",
    items: [
      {
        q: "คราม หมายถึงอะไร",
        a: "ครามคือคนที่ทำสมุดเหล่านี้ คนธรรมดาที่ผิดพลาดมาเยอะ เคยเกือบตาย และตัดสินใจว่าครั้งนี้จะไม่ยอมแพ้อีกแล้ว เพราะไม่อยากให้วันสุดท้ายต้องมานั่งเสียใจที่ไม่เคยได้ทำในสิ่งที่อยากทำ ประโยคที่แบรนด์กลับมาหาเสมอคือ “กูทำดีที่สุดแล้ว” อ่านเรื่องเต็มได้ที่หน้าเรื่องของเรา",
      },
      {
        q: "Shadow work คืออะไร",
        a: "Shadow work คือการมองเข้าไปในความรู้สึก นิสัย และส่วนในตัวเราที่มักหลีกเลี่ยง เช่น ความโกรธที่กลืนไว้ ความกลัวที่อยู่เบื้องหลังการเอาใจคนอื่น หรือกฎเก่าๆ ที่ยังทำตามอยู่ INDIGO ทำสิ่งนี้ทีละคำถาม พร้อมหน้าให้เขียน",
      },
      { q: "ไม่เคยทำแบบนี้มาก่อน INDIGO เหมาะกับมือใหม่ไหม", a: "เหมาะ เริ่มอย่างอ่อนโยนและไปตามลำดับ ถ้าอยากลองก่อน 7 Nights in INDIGO แจกฟรี ใช้คำถาม 14 ข้อจากเล่มเต็ม" },
      { q: "ถ้าคำถามไหนหนักเกินไปล่ะ", a: "ข้ามไปได้เลย จะกลับมาคืนอื่นหรือไม่กลับมาเลยก็ได้ องก์ที่ 2 (การดูแลเด็กในตัวเรา) ก็เขียนไว้บนหน้าแบบนี้เหมือนกัน" },
      { q: "ต้องใช้เวลานานไหม", a: "คืนละสิบนาทีก็พอ ไม่มีตารางที่ต้องทำตาม พลาดไปคืนหนึ่งก็กลับมาเขียนต่อจากตรงที่ค้างไว้" },
      {
        q: "นี่คือการบำบัดไหม",
        a: "ไม่ใช่ สมุดของ Khram เป็นเครื่องมือทบทวนตัวเอง ไม่ใช่สิ่งทดแทนการดูแลจากผู้เชี่ยวชาญด้านสุขภาพจิต ถ้ากำลังลำบาก ลองปรึกษาผู้เชี่ยวชาญ หากอยู่ในภาวะวิกฤต โทรสายด่วนสุขภาพจิต 1323 หรือเบอร์ฉุกเฉินในพื้นที่",
      },
      { q: "เนื้อหาในสมุดเป็นภาษาอะไร", a: "ภาษาอังกฤษ ตอนนี้ยังไม่มีฉบับภาษาไทย" },
    ],
  },
  {
    id: "formats",
    heading: "รูปแบบ",
    items: [
      {
        q: "ดิจิทัลหรือเล่มกระดาษดี",
        a: "PDF ดิจิทัลเหมาะกับการเขียนบนแท็บเล็ตด้วยปากกา เล่มกระดาษเหมาะกับการเขียนด้วยมือ ฉบับสีทั้งเล่มเก็บภาพท้องฟ้ากลางคืนไว้ทุกหน้า (ใช้ปากกาเจลสีขาว ทอง หรือเงิน) ฉบับขาวดำมีช่องสีขาวให้เขียนด้วยปากกาอะไรก็ได้",
      },
      { q: "ใช้กับแอปอะไรได้บ้าง", a: "GoodNotes, Notability, Noteshelf, Xodo, Samsung Notes และแอปที่เขียนบน PDF ได้ทุกตัว เปิดบนคอมพิวเตอร์ได้ด้วย" },
      { q: "พิมพ์ PDF ออกมาได้ไหม", a: "ได้ สำหรับใช้ส่วนตัว แต่หน้าสีเข้มเปลืองหมึกมาก ถ้าจะเขียนบนกระดาษ เล่มพิมพ์มักเหมาะกว่า" },
      { q: "ฉบับขาวดำวางขายแล้วหรือยัง", a: "วางขายแล้วบน Amazon ราคา $17.99 ส่วนฉบับสีทั้งเล่มราคา $24.99" },
    ],
  },
  {
    id: "orders",
    heading: "การสั่งซื้อ",
    items: [
      { q: "ซื้อได้ที่ไหน", a: "สมุดดิจิทัลขายบน Gumroad เล่มกระดาษ Amazon เป็นคนพิมพ์ ขาย และจัดส่ง" },
      { q: "ซื้อแล้วได้ PDF ยังไง", a: "Gumroad จะแสดงปุ่มดาวน์โหลดทันทีหลังจ่ายเงิน และส่งลิงก์ให้ทางอีเมลด้วย" },
      { q: "จ่ายเป็นเงินบาทได้ไหม", a: "ราคาตั้งเป็นดอลลาร์สหรัฐ แต่ Gumroad จะแสดงยอดเป็นเงินบาทให้ตอนจ่าย ช่องทางจ่ายเงินเป็นไปตามที่ Gumroad รองรับ" },
      { q: "ขอคืนเงินได้ไหม", a: "สมุดดิจิทัลบน Gumroad คืนเงินได้ภายใน 14 วัน ส่วนเล่มกระดาษ การจัดส่งและการคืนสินค้าดูแลโดย Amazon" },
    ],
  },
];

export const faqGroups: Record<Lang, FaqGroup[]> = { en, th };
