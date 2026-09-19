import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-sm opacity-70">
        ลิงก์อาจถูกเปลี่ยนไปแล้ว หรือข้อมูลชิ้นนี้ถูกล้างไปตอนสร้างข้อมูลใหม่ประจำคืน
      </p>
      <Link href="/case-study" className="text-sm underline">
        กลับไปหน้าแรก
      </Link>
    </main>
  );
}
