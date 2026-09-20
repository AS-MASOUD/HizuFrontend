import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/providers/ToastProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";

export const metadata: Metadata = {
  title: "هیزو | استودیو طراحی و ساخت دیجیتال",
  description: "طراحی، مهندسی دیجیتال، پرینت سه‌بعدی صنعتی، ماشین‌کاری ۵ محوره CNC و برش لیزر در قلب کارگاه تهران.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#F7F5EE] text-[#161A1D] antialiased min-h-screen flex flex-col justify-between selection:bg-[#dfc79b] selection:text-[#082719]">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="pt-20 flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
