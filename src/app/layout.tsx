import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// ทั้งระบบเป็นภาษาไทย ฟอนต์หลักจึงต้องมี subset thai
// (shadcn init ตั้ง Geist มาให้ แต่ Geist ไม่มีตัวอักษรไทย ข้อความจะตกไปใช้ฟอนต์ระบบทั้งหมด)
const sans = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "SunPath",
    template: "%s · SunPath",
  },
  description: "ระบบจัดการงานขายและลูกค้าสำหรับผู้รับเหมาติดตั้งโซลาร์รูฟท็อป",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={cn("h-full font-sans antialiased", sans.variable, mono.variable)}>
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
