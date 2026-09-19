import type { EmailSender } from "./email-sender";
import { LogEmailSender } from "./log-email-sender";

export type { EmailMessage, EmailSender } from "./email-sender";
export { LogEmailSender } from "./log-email-sender";

/**
 * เลือก implementation ตาม EMAIL_SENDER
 * ยังมีแต่ log — MailjetEmailSender จะถูกเพิ่มเมื่อทดสอบ provider จริงแล้ว
 */
export function createEmailSender(): EmailSender {
  return new LogEmailSender();
}
