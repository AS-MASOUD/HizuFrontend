import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowLeft, Info, PhoneCall } from "lucide-react";

const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/hizustudio";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/hizustudio";

function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.677c.459 0 .662-.21.919-.459l2.207-2.146 4.59 3.39c.846.467 1.455.227 1.666-.786l3.013-14.195c.309-1.239-.473-1.8-1.282-1.431z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#1c211b]/10 mt-24 text-[#5A626A] shadow-inner">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Popped & Bold Action Showcase for About Us and Contact Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-14 pb-12 border-b border-[#1c211b]/10">
          {/* About Us Card - Bold & Popped */}
          <Link
            href="/about"
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FAF7F0] via-[#F3EFE6] to-[#EDE8DC] border-2 border-[#1c211b]/15 shadow-[0_6px_20px_rgba(28,33,27,0.06)] hover:shadow-xl hover:border-[#082719] transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden interactive-bump"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#8f6d2f] tracking-wider">
                    ATELIER &amp; CAPACITIES
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8f6d2f] animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#161A1D] group-hover:text-[#082719] transition-colors">
                  درباره استودیو و آزمایشگاه هیزو
                </h3>
                <p className="text-xs text-[#5A626A] mt-0.5 line-clamp-1">
                  آشنایی با تاریخچه، پارک ماشین‌آلات 5 محوره CNC و پرینترهای ابعاد صنعتی
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#1c211b]/10 text-[#082719] group-hover:bg-[#082719] group-hover:text-[#dfc79b] transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>

          {/* Contact Us Card - Bold & Popped with High Contrast */}
          <Link
            href="/contact"
            className="group relative p-6 sm:p-7 rounded-2xl bg-[#082719] text-white border-2 border-[#082719] shadow-[0_6px_20px_rgba(8,39,25,0.2)] hover:shadow-2xl hover:border-[#dfc79b]/60 transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden interactive-bump"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-[#dfc79b] flex items-center justify-center font-bold border border-white/10 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#dfc79b] tracking-wider">
                    DIRECT CONTACT &amp; VISIT
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#dfc79b] transition-colors">
                  تماس با ما و مشاوره فنی کارگاه
                </h3>
                <p className="text-xs text-[#FCF9F1]/80 mt-0.5 line-clamp-1">
                  مشاوره مهندسی ساخت، بررسی نقشه‌های CAD، نشانی کارگاه و تماس تلفنی
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#dfc79b] text-[#082719] group-hover:bg-white group-hover:scale-110 transition-all shadow-md">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>
        </div>

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
              استودیو طراحی و ساخت دیجیتال هیزو؛ تخصص در ماشین‌کاری 5 محوره CNC، پرینت سه‌بعدی ابعاد صنعتی، برش لیزر دقیق و توسعه سیستم‌های مکاترونیک.
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
            <Link href="/services" className="text-xs font-bold text-[#082719] hover:underline transition-colors">خدمات و فرآیندهای ساخت</Link>
            <Link href="/shop" className="text-xs hover:text-[#082719] transition-colors">فروشگاه و کاتالوگ</Link>
            <Link href="/courses" className="text-xs font-bold text-[#082719] hover:underline transition-colors">دوره‌های آموزشی و وبینارها</Link>
            <Link href="/articles" className="text-xs font-bold text-[#082719] hover:text-[#0284c7] transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#082719]"></span>
              <span>مقالات و وبلاگ تخصصی</span>
            </Link>
            <Link href="/special-orders" className="text-xs hover:text-[#082719] transition-colors">سفارش ساخت فوری</Link>
            <Link href="/compare" className="text-xs hover:text-[#082719] transition-colors">میز مقایسه محصولات</Link>
            <Link href="/about" className="text-xs font-extrabold text-[#082719] hover:underline transition-all">درباره کارگاه هیزو</Link>
            <Link href="/contact" className="text-xs font-extrabold text-[#082719] hover:underline transition-all">تماس با ما</Link>
          </div>

          {/* Col 4: Capabilities */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm text-[#161A1D]">خدمات کارگاهی</span>
            <Link href="/services#3d-print" className="text-xs hover:text-[#082719] transition-colors">پرینت 3بعدی FDM / SLS صنعتی</Link>
            <Link href="/services#cnc" className="text-xs hover:text-[#082719] transition-colors">فرزکاری 5 محوره CNC</Link>
            <Link href="/services#laser" className="text-xs hover:text-[#082719] transition-colors">برش و حکاکی لیزر فایبر و CO2</Link>
            <Link href="/services#dfm" className="text-xs hover:text-[#082719] transition-colors">مهندسی معکوس و تحلیل DFM</Link>
            <Link href="/services#automation" className="text-xs hover:text-[#082719] transition-colors">ساخت و اسمبل مکاترونیک</Link>
          </div>

          {/* Col 5: Contact Info */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-sm text-[#161A1D]">ارتباط با کارگاه</span>
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="font-mono dir-ltr text-[#333C44]">Hizud3print@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="font-mono ![direction:ltr] text-[#333C44]">+98 990 613 5755</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
              <span className="text-[#333C44]">تهران، کارگاه ساخت و آتلیه هیزو</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-3 border-t border-[#1c211b]/10 flex flex-col gap-2.5 mt-1">
              <span className="text-xs font-bold text-[#161A1D]">شبکه‌های اجتماعی و پیام‌رسان</span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال تلگرام استودیو هیزو"
                  title="کانال تلگرام استودیو هیزو"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/12 text-[#161A1D] hover:bg-[#082719] hover:text-[#dfc79b] hover:border-[#082719] transition-all duration-200 text-xs shadow-sm interactive-bump focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#082719]"
                >
                  <TelegramIcon className="w-4 h-4 text-[#229ED9] group-hover:text-[#dfc79b] transition-colors shrink-0" />
                  <span className="font-mono text-[11px] dir-ltr font-semibold">Telegram</span>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="صفحه اینستاگرام استودیو هیزو"
                  title="صفحه اینستاگرام استودیو هیزو"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/12 text-[#161A1D] hover:bg-[#082719] hover:text-[#dfc79b] hover:border-[#082719] transition-all duration-200 text-xs shadow-sm interactive-bump focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#082719]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E1306C] group-hover:text-[#dfc79b] transition-colors shrink-0" />
                  <span className="font-mono text-[11px] dir-ltr font-semibold">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1c211b]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5A626A]">
          <span>HIZU STUDIO // FABRICATION &amp; DESIGN CO.</span>
          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="کانال تلگرام استودیو هیزو"
              className="flex items-center gap-1.5 text-[#5A626A] hover:text-[#082719] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#082719] rounded"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#229ED9] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-sans text-xs">تلگرام</span>
            </a>
            <span className="text-[#1c211b]/20 select-none">•</span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="صفحه اینستاگرام استودیو هیزو"
              className="flex items-center gap-1.5 text-[#5A626A] hover:text-[#082719] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#082719] rounded"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-sans text-xs">اینستاگرام</span>
            </a>
          </div>
          <span>© 2026 تمامی حقوق برای استودیو هیزو محفوظ است.</span>
        </div>
      </div>
    </footer>
  );
}
