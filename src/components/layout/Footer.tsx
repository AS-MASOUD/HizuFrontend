import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#1c211b]/10 mt-24 text-[#5A626A] shadow-inner">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#082719] flex items-center justify-center p-2 shadow-sm border border-[#082719]/20 text-[#dfc79b] font-mono font-bold">
                H
              </div>
              <span className="font-extrabold text-xl text-[#161A1D]">استودیو هیزو</span>
            </div>
            <p className="text-xs sm:text-sm text-[#5A626A] leading-relaxed max-w-sm">
              استودیو طراحی و ساخت دیجیتال هیزو؛ تخصص در ماشین‌کاری ۵ محوره CNC، پرینت سه‌بعدی ابعاد صنعتی، برش لیزر دقیق و توسعه سیستم‌های مکاترونیک.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-[11px] text-[#161A1D]">
              <span className="bg-[#EDE8DC] px-2.5 py-1 rounded border border-[#1c211b]/10">EST. 1400</span>
              <span className="bg-[#EDE8DC] px-2.5 py-1 rounded border border-[#1c211b]/10">TEHRAN, IR</span>
              <span className="bg-[#EDE8DC] px-2.5 py-1 rounded border border-[#1c211b]/10">ISO 2768-M</span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm text-[#161A1D]">دسترسی سریع</span>
            <Link href="/" className="text-xs hover:text-[#082719] transition-colors">خانه</Link>
            <Link href="/shop" className="text-xs hover:text-[#082719] transition-colors">فروشگاه و کاتالوگ</Link>
            <Link href="/special-orders" className="text-xs hover:text-[#082719] transition-colors">سفارش ساخت فوری</Link>
            <Link href="/about" className="text-xs hover:text-[#082719] transition-colors">درباره کارگاه هیزو</Link>
            <Link href="/contact" className="text-xs hover:text-[#082719] transition-colors">تماس با ما</Link>
          </div>

          {/* Col 4: Capabilities */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm text-[#161A1D]">خدمات کارگاهی</span>
            <span className="text-xs">پرینت ۳بعدی FDM / SLS صنعتی</span>
            <span className="text-xs">فرزکاری ۵ محوره CNC</span>
            <span className="text-xs">برش و حکاکی لیزر فایبر و CO2</span>
            <span className="text-xs">مهندسی معکوس و تحلیل DFM</span>
            <span className="text-xs">ساخت و اسمبل مکاترونیک</span>
          </div>

          {/* Col 5: Contact Info */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm text-[#161A1D]">ارتباط با کارگاه</span>
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="font-mono dir-ltr text-[#333C44]">cad@hizustudio.ir</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="font-mono dir-ltr text-[#333C44]">+98 (21) 8876 5432</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="text-[#333C44]">تهران، کارگاه ساخت و آتلیه هیزو</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1c211b]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5A626A]">
          <span>HIZU STUDIO // FABRICATION &amp; DESIGN CO.</span>
          <span>© 2026 تمامی حقوق برای استودیو هیزو محفوظ است.</span>
        </div>
      </div>
    </footer>
  );
}
