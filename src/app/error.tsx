"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">ระบบขัดข้อง</h1>
      <p className="text-sm opacity-70">ลองใหม่อีกครั้ง ถ้ายังไม่หายแปลว่าฝั่งเซิร์ฟเวอร์มีปัญหา</p>
      <button
        type="button"
        onClick={reset}
        className="mx-auto w-fit rounded border px-4 py-2 text-sm"
      >
        ลองใหม่
      </button>
    </main>
  );
}
