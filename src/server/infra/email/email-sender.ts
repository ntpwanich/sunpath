/**
 * ช่องทางส่งอีเมลออกนอกระบบ
 *
 * Mailjet เป็นตัวเลือกจากข้อจำกัดของ free tier แต่ยังไม่ได้ทดสอบจริง
 * ระบบจึงคุยกับ interface นี้เท่านั้น และมีตัวเขียนลง log เป็นค่าตั้งต้น
 * ทุกเส้นทางเดินได้ครบแม้ไม่มี provider (spec §13)
 */
export interface EmailMessage {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}
