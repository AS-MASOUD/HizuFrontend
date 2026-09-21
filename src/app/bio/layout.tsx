import type { Metadata } from "next";
import "./bio-tailwind.css";
import { ToastProvider } from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "شرکت فناوری ساخت هیزو | لینک‌ها و ارتباط مستقیم",
  description: "استودیو طراحی و ساخت دیجیتال هیزو - پرینت سه‌بعدی صنعتی، ماشین‌کاری CNC و برش لیزر",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function BioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="m-0 p-0 antialiased" style={{ backgroundColor: "#121e17" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
