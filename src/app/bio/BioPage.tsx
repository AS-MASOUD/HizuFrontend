import React, { useState, useEffect } from "react";
import styles from "./bio.module.css";
import { useToast } from "@/providers/ToastProvider";
import {
  Globe,
  Mail,
  Phone,
  Send,
  Instagram,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";

// Official contact information for Hizu
const CONTACT_INFO = {
  email: "Hizu3dprint@gmail.com",
  phone: "09906135755",
  phoneFormatted: "+98 990 613 5755",
  whatsappUrl: "https://wa.me/989906135755",
  telegramUrl: "https://t.me/hizu3dprinter",
  telegramHandle: "hizu3dprinter",
  instagramUrl: "https://www.instagram.com/hizu3dprinter?igsh=cXA5b243OW5ibWU0",
  instagramHandle: "@hizu3dprinter",
  websiteUrl: "https://hizu.ir/",
};

export const BioPage: React.FC = () => {
  const { success } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showChannelsModal, setShowChannelsModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);

  useEffect(() => {
    // Set title and isolate page background color for seamless mobile overscroll
    const originalTitle = document.title;
    const originalBg = document.body.style.backgroundColor;

    document.title = "شرکت فناوری ساخت هیزو | لینک‌ها و ارتباط مستقیم";
    document.body.style.backgroundColor = "#121e17";

    return () => {
      document.title = originalTitle;
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    success(`${label} در کلیپ‌بورد کپی شد!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className={styles.bioContainer}>
      <div className={styles.bgCncLayer} aria-hidden="true" />

      <div className={styles.phoneWrapper}>
        {/* Left Non-uniform CAD Blueprint Ruler - Flipped horizontally, starting nearly 1/3 from top */}
        <div className={styles.rulerTrack} aria-hidden="true">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 36 650"
            preserveAspectRatio="none"
          >
            <defs>
              {/* 10mm repeating pattern: 40px height = 10 steps (4px per step), baseline at x=4, ticks pointing right */}
              <pattern
                id="cadRulerTicks"
                width="36"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <animateTransform
                  attributeName="patternTransform"
                  type="translate"
                  from="0 0"
                  to="0 40"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                {/* 0mm: Long tick (cm mark) extending right */}
                <line
                  x1="4"
                  y1="0"
                  x2="28"
                  y2="0"
                  stroke="rgba(232, 222, 200, 0.8)"
                  strokeWidth="1.3"
                />
                {/* 1mm */}
                <line
                  x1="4"
                  y1="4"
                  x2="12"
                  y2="4"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 2mm */}
                <line
                  x1="4"
                  y1="8"
                  x2="12"
                  y2="8"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 3mm */}
                <line
                  x1="4"
                  y1="12"
                  x2="12"
                  y2="12"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 4mm */}
                <line
                  x1="4"
                  y1="16"
                  x2="12"
                  y2="16"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 5mm: Medium tick (half-cm mark) extending right */}
                <line
                  x1="4"
                  y1="20"
                  x2="18"
                  y2="20"
                  stroke="rgba(232, 222, 200, 0.65)"
                  strokeWidth="1.2"
                />
                {/* 6mm */}
                <line
                  x1="4"
                  y1="24"
                  x2="12"
                  y2="24"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 7mm */}
                <line
                  x1="4"
                  y1="28"
                  x2="12"
                  y2="28"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 8mm */}
                <line
                  x1="4"
                  y1="32"
                  x2="12"
                  y2="32"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
                {/* 9mm */}
                <line
                  x1="4"
                  y1="36"
                  x2="12"
                  y2="36"
                  stroke="rgba(232, 222, 200, 0.45)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Continuous Vertical Baseline on Left */}
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="650"
              stroke="rgba(232, 222, 200, 0.55)"
              strokeWidth="1.2"
            />

            {/* Repeating mm and cm tick marks */}
            <rect
              x="0"
              y="0"
              width="36"
              height="650"
              fill="url(#cadRulerTicks)"
            />
          </svg>
        </div>

        {/* Top Header Controls */}
        <header className="flex items-center justify-between w-full mb-3 px-1">
          {/* Website Link (Globe) */}
          <a
            href={CONTACT_INFO.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#e8dec8]/30 flex items-center justify-center text-[#e8dec8] hover:bg-[#e8dec8]/15 hover:border-[#e8dec8]/50 transition-all"
            title="وب‌سایت رسمی هیزو"
          >
            <Globe className="w-4 h-4" />
          </a>

          {/* Right Minimalist Controls */}
          <div className="flex items-center gap-3 text-[#e8dec8]/70 text-xs">
            <button
              type="button"
              onClick={() => setShowChannelsModal(true)}
              className="hover:text-[#e8dec8] transition-colors cursor-pointer"
              title="راه‌های ارتباطی سریع"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Brand Logo & Header Titles */}
        <section className="flex flex-col items-center text-center my-2">
          {/* Official Hizu 3D-Printer Logo (tinted champagne gold) */}
          <div className="relative mb-2 flex justify-center">
            <img
              src="/bio/Hizu-logo.svg"
              alt="Hizu Logo"
              className="w-48 h-auto max-h-36 object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Persian Brand Name */}
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#e8dec8] mb-0.5"
            dir="rtl"
          >
            شرکت فناوری ساخت هیزو
          </h1>

          {/* Persian Tagline */}
          <div className="flex items-center justify-center gap-2">
            <p
              className="text-sm sm:text-base font-normal text-[#dfd4bd]"
              dir="rtl"
            >
              جایی که ایده رویش می‌کند
            </p>
          </div>
        </section>

        {/* Technical Dimension Line 1: Explore Services */}
        <div className={styles.dimensionLine} aria-hidden="true">
          <span>Explore Services</span>
        </div>

        {/* Primary Interactive Action Cards */}
        <main className="flex flex-col gap-4 my-1">
          {/* CARD 1: Explore Services / 3D PRINTING */}
          <div className={styles.cardContainer}>
            {/* Top dimension tag from image: A2B5A0 */}
            <div className="flex items-center gap-1.5 mb-1 opacity-65 text-[9px] font-mono text-[#baa988]">
              <span className="w-1.5 h-1.5 border-l border-t border-[#baa988]" />
              <span className="w-3.5 h-[1px] bg-[#baa988]" />
              <span>A2B5A0</span>
            </div>

            {/* Left Dimension Line: 15mm */}
            <div className={styles.measuringBarLeft} aria-hidden="true">
              <div className={styles.measuringBarTickTop} />
              <div className={styles.measuringBarLine}>
                <span className={styles.measuringBarLabelRotated}>15mm</span>
              </div>
              <div className={styles.measuringBarTickBottom} />
            </div>

            {/* Card 1 Framed Glass Slab */}
            <a
              href="/services"
              className={styles.cardFrame}
              aria-label="3D Printing - خدمات ما"
            >
              <div className={styles.cardGlassFace}>
                <div className="p-3.5 relative z-10">
                  {/* Header Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={styles.badgeDark}>
                      <span>Z-AXIS: +42.1mm</span>
                    </span>
                    <span className={styles.badgeSage}>Sage:</span>
                  </div>

                  {/* Card Content Row */}
                  <div className="flex items-center justify-between my-1">
                    {/* Left Technical Dot with Hairline */}
                    <div className="flex items-center gap-1.5 opacity-60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ded5c2]" />
                      <span className="w-2.5 h-[1px] bg-[#ded5c2]" />
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 px-3 text-center">
                      <div className="text-[25px] font-bold text-[#e8dec8] tracking-wider uppercase font-mono">
                        خدمات ما
                      </div>
                      <div
                        className="text-[15px] text-[#baa988] mt-0.5 font-medium"
                        dir="rtl"
                      >
                        پرینت سه بعدی | لیزر برش
                      </div>
                    </div>

                    {/* Right 3D Printer Icon & Arrow */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <img
                        src="/bio/printer-flat-copy.png"
                        className="w-7 h-7 object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                        alt="3D Printer"
                      />
                      <ChevronRight className="w-4 h-4 text-[#baa988] opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Measurement Bar on the Right of Card 1 spanning the height (from image 3) */}
            <div className={styles.measuringBarRight} aria-hidden="true">
              <div className={styles.measuringBarTickTop} />
              <div className={styles.measuringBarLine}>
                <span className={styles.measuringBarLabel}>15"</span>
              </div>
              <div className={styles.measuringBarTickBottom} />
            </div>
          </div>

          {/* CARD 2: Laser Cutting / Products */}
          <div className={styles.cardContainer}>
            {/* Left Dimension Line: 12mm */}
            <div className={styles.measuringBarLeft} aria-hidden="true">
              <div className={styles.measuringBarTickTop} />
              <div className={styles.measuringBarLine}>
                <span className={styles.measuringBarLabelRotated}>12mm</span>
              </div>
              <div className={styles.measuringBarTickBottom} />
            </div>

            {/* Card 2 Framed Glass Slab */}
            <a
              href="/shop"
              className={styles.cardFrame}
              aria-label="Laser Cutting - محصولات ما"
            >
              <div className={styles.cardGlassFace}>
                <div className="p-3.5 relative z-10">
                  {/* Header Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={styles.badgeDark}>
                      <span>X,Y GRID: 10x10mm</span>
                    </span>
                    <span className={styles.badgeUlocind}>
                      Ulocind: ±0.01mm
                    </span>
                  </div>

                  {/* Card Content Row */}
                  <div className="flex items-center justify-between my-1">
                    {/* Left Technical Dot with Hairline */}
                    <div className="flex items-center gap-1.5 opacity-60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ded5c2]" />
                      <span className="w-2.5 h-[1px] bg-[#ded5c2]" />
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 px-3 text-center">
                      <div className="text-[25px] font-bold text-[#e8dec8] tracking-wider uppercase font-mono">
                        محصولات ما
                      </div>
                      <div
                        className="text-[15] text-[#baa988] mt-0.5 font-medium"
                        dir="rtl"
                      >
                        دکوری | ابزار و قالب
                      </div>
                    </div>

                    {/* Right Tools Icon & Arrow */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <img
                        src="/bio/tools-copy.png"
                        className="w-7 h-7 object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                        alt="Tools"
                      />
                      <ChevronRight className="w-4 h-4 text-[#baa988] opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </main>

        {/* Technical Dimension Line 2 */}
        <div className={styles.dimensionLine} aria-hidden="true">
          <span>163.7mm</span>
        </div>

        {/* START A CUSTOM PROJECT Primary Button */}
        <div className="mt-2.5 mb-2.5">
          <button
            type="button"
            onClick={() => setShowPhoneModal(true)}
            className={styles.startProjectButton}
            title="شروع یا استعلام پروژه اختصاصی"
          >
            <span>شروع پروژه</span>
            <span className={styles.startProjectArrow} aria-hidden="true">
              →
            </span>
          </button>
        </div>

        {/* 4-Column Quick Contact Glass Card with 3D Framed Edge & Flare */}
        <div className="my-2">
          <div className={styles.cardFrame}>
            <div className={styles.cardGlassFace}>
              <div className="flex items-stretch justify-between p-1 relative z-10">
                {/* Column 1: Website */}
                <a
                  href={CONTACT_INFO.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactColumn}
                  title="وب‌سایت رسمی هیزو"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#e8dec8] mb-1">
                    <Globe className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#e8dec8]">
                    وبسایت
                  </span>
                </a>

                {/* Column 2: Telegram */}
                <a
                  href={CONTACT_INFO.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactColumn}
                  title="تلگرام هیزو"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#e8dec8] mb-1">
                    <Send className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#e8dec8]">
                    تلگرام
                  </span>
                </a>

                {/* Column 3: Instagram */}
                <a
                  href={CONTACT_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactColumn}
                  title="صفحه اینستاگرام هیزو"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#e8dec8] mb-1">
                    <Instagram className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#e8dec8]">
                    اینستاگرام
                  </span>
                </a>

                {/* Column 4: Phone */}
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(true)}
                  className={styles.contactColumn}
                  title="تماس تلفنی و واتس‌اپ"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#e8dec8] mb-1">
                    <Phone className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[12.5px] font-medium text-[#e8dec8]">
                    تماس
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Main Contact Channels Quick Selector */}
      {showChannelsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowChannelsModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 border border-[#e8dec8]/30 text-[#e8dec8] shadow-2xl relative"
            style={{
              backgroundColor: "#15241b",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8dec8]/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#edd8aa]" />
                <h3 className="font-bold text-base text-[#edd8aa]">
                  راه‌های ارتباط با هیزو
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChannelsModal(false)}
                className="w-7 h-7 rounded-full bg-[#e8dec8]/10 flex items-center justify-center text-[#e8dec8] hover:bg-[#e8dec8]/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Telegram */}
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 transition-all text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#229ED9]/20 flex items-center justify-center text-[#229ED9]">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#e8dec8]">
                      ارتباط در تلگرام
                    </div>
                    <div className="text-xs text-[#baa988] font-mono">
                      @{CONTACT_INFO.telegramHandle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#baa988]" />
              </a>

              {/* Instagram */}
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 transition-all text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#e8dec8]">
                      پیج اینستاگرام
                    </div>
                    <div className="text-xs text-[#baa988] font-mono">
                      {CONTACT_INFO.instagramHandle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#baa988]" />
              </a>

              {/* Website */}
              <a
                href={CONTACT_INFO.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 transition-all text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e8dec8]/15 flex items-center justify-center text-[#edd8aa]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#e8dec8]">
                      وب‌سایت رسمی هیزو
                    </div>
                    <div className="text-xs text-[#baa988] font-mono">
                      hizu.ir
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#baa988]" />
              </a>

              {/* Phone / WhatsApp */}
              <button
                type="button"
                onClick={() => {
                  setShowChannelsModal(false);
                  setShowPhoneModal(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 transition-all text-right cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#e8dec8]">
                      تماس تلفنی و واتس‌اپ
                    </div>
                    <div
                      className="text-xs text-[#baa988] font-mono"
                      style={{ direction: "ltr" }}
                    >
                      {CONTACT_INFO.phoneFormatted}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#baa988] rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Phone & WhatsApp Direct Actions */}
      {showPhoneModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 border border-[#e8dec8]/30 text-[#e8dec8] shadow-2xl relative"
            style={{
              backgroundColor: "#15241b",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8dec8]/20">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#edd8aa]" />
                <h3 className="font-bold text-base text-[#edd8aa]">
                  تماس و پیام مستقیم
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="w-7 h-7 rounded-full bg-[#e8dec8]/10 flex items-center justify-center text-[#e8dec8] hover:bg-[#e8dec8]/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-4 py-2 bg-[#e8dec8]/5 rounded-xl border border-[#e8dec8]/10">
              <div className="text-xs text-[#baa988] mb-1">
                شماره تماس هیزو:
              </div>
              <div
                className="font-mono text-lg font-bold text-[#e8dec8] tracking-widest"
                dir="ltr"
              >
                {CONTACT_INFO.phoneFormatted}
              </div>
            </div>

            <div className="space-y-2.5">
              {/* WhatsApp Direct Chat */}
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#e8dec8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span className="font-bold text-sm">گفتگو در واتس‌اپ</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#25D366]" />
              </a>

              {/* Direct Call */}
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 text-[#e8dec8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#edd8aa]" />
                  <span className="font-bold text-sm">برقراری تماس تلفنی</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#baa988]" />
              </a>

              {/* Copy Phone Number */}
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(CONTACT_INFO.phone, "شماره تماس")
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/10 hover:bg-[#e8dec8]/20 border border-[#e8dec8]/20 text-[#e8dec8] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {copiedField === "شماره تماس" ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-[#edd8aa]" />
                  )}
                  <span className="font-bold text-sm">کپی کردن شماره تلفن</span>
                </div>
                <span className="text-xs text-[#baa988] font-mono">
                  {copiedField === "شماره تماس" ? "کپی شد" : "کپی"}
                </span>
              </button>

              {/* Email Send / Copy */}
              <div className="pt-2 border-t border-[#e8dec8]/10">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(CONTACT_INFO.email, "ایمیل هیزو")
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#e8dec8]/5 hover:bg-[#e8dec8]/15 border border-[#e8dec8]/15 text-[#e8dec8] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {copiedField === "ایمیل هیزو" ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#edd8aa]" />
                    )}
                    <div className="text-right">
                      <div className="font-bold text-xs">کپی آدرس ایمیل</div>
                      <div
                        className="text-[11px] font-mono text-[#baa988]"
                        dir="ltr"
                      >
                        {CONTACT_INFO.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#baa988] font-mono">
                    {copiedField === "ایمیل هیزو" ? "کپی شد" : "کپی"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioPage;
