/**
 * ผลลัพธ์ที่ผิดพลาดได้เป็นค่าที่คืนกลับมา ไม่ใช่ exception (ADR 0001)
 *
 * ชั้น domain คืน Result เสมอเมื่อผลลัพธ์ผิดพลาดได้ตามกติกาทางธุรกิจ
 * เช่น เลื่อน Stage ไม่ได้เพราะยังไม่มี Survey Report
 * ส่วน exception ไว้สำหรับสิ่งที่ไม่ควรเกิดขึ้นเลย เช่น ฐานข้อมูลล่ม
 */
export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(
  result: Result<T, E>,
): result is { readonly ok: true; readonly value: T } {
  return result.ok;
}

export function isErr<T, E>(
  result: Result<T, E>,
): result is { readonly ok: false; readonly error: E } {
  return !result.ok;
}

/** ดึงค่าออกมาเมื่อรู้แน่ว่าสำเร็จ — ใช้ได้เฉพาะใน test และตอน seed */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw new Error(`unwrap() บน Result ที่ล้มเหลว: ${JSON.stringify(result.error)}`);
  }
  return result.value;
}
