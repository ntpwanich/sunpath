import type { EmailMessage, EmailSender } from "./email-sender";

/** ค่าตั้งต้นสำหรับเครื่องตัวเองและ test — ไม่ส่งออกนอกเครื่อง */
export class LogEmailSender implements EmailSender {
  private readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    console.info(`[email] ถึง ${message.to} · เรื่อง ${message.subject}`);
  }

  /** ให้ test ตรวจได้ว่าส่งอะไรออกไปบ้าง */
  sentMessages(): readonly EmailMessage[] {
    return this.sent;
  }
}
