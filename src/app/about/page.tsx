import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Award, ShieldCheck, Wrench, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-16">
      {/* Intro */}
      <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <span className="font-mono text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-3 py-1 rounded-full uppercase tracking-wider self-center">
          ABOUT HIZU DIGITAL FABRICATION
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#161A1D] leading-tight">
          پیوند طراحی دیجیتال، الگوریتم و کارگاه ساخت فیزیکی
        </h1>
        <p className="text-sm sm:text-base text-[#5A626A] leading-relaxed">
          هیزو یک استودیو و آزمایشگاه ساخت دیجیتال (Fabrication Lab) مستقر در تهران است که با تکیه بر ماشین‌آلات پیشرفته ۵ محوره، پرینترهای ابعاد صنعتی و برش لیزر دقیق، مرز میان طراحی مفهومی و تولید صنعتی را برمی‌دارد.
        </p>
      </div>

      {/* Machine Park Details */}
      <div className="card-popup rounded-2xl p-8 sm:p-10 bg-white border border-[#1c211b]/10 flex flex-col gap-6 shadow-md">
        <h2 className="text-xl font-black text-[#161A1D] border-b border-[#1c211b]/10 pb-4">
          پارک ماشین‌آلات و ظرفیت‌های کارگاه هیزو
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-2">
            <span className="font-mono font-bold text-[#082719] text-sm">CNC 5-AXIS MILLING</span>
            <p className="text-[#5A626A] leading-relaxed">
              ماشین‌کاری ۵ محوره همزمان فلزات هوایی (آلومینیوم 7075)، برنج شمش و چوب سخت با تلورانس ابعادی تا ±0.01 میلی‌متر.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-2">
            <span className="font-mono font-bold text-[#082719] text-sm">INDUSTRIAL SLS &amp; FDM</span>
            <p className="text-[#5A626A] leading-relaxed">
              پرینت سه‌بعدی ابعاد بزرگ با پلیمرهای تقویت‌شده با فیبر کربن (PA12-CF)، پلی‌کربنات نسوز و رزین‌های مهندسی با دقت میکرونی.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-2">
            <span className="font-mono font-bold text-[#082719] text-sm">FIBER LASER (1064nm)</span>
            <p className="text-[#5A626A] leading-relaxed">
              برش و حکاکی نوری فوق‌سریع روی ورق‌های فلزی سخت و قطعات الکترونیک بدون ایجاد تنش حرارتی و پلیسه.
            </p>
          </div>
        </div>
      </div>

      {/* Values & Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#8f6d2f]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">استاندارد تلورانس ISO</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            کلیه قطعات و محصولات تولید شده مطابق با تلورانس‌های هندسی و ابعادی استاندارد ISO 2768 کنترل کیفیت می‌شوند.
          </p>
        </div>

        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#0284c7]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">تحلیل DFM قبل از ساخت</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            قبل از هرگونه برش یا تراشکاری، هندسه قطعه از نظر صرفه اقتصادی و پایداری فیزیکی توسط مهندسان هیزو تحلیل می‌شود.
          </p>
        </div>

        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#10b981]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">تعهد به متریال ناب</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            استفاده انحصاری از چوب‌های عمل‌آوری شده، آلومینیوم استاندارد بدون تخلخل و رزین‌های مهندسی ضدسایش.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link
          href="/special-orders"
          className="inline-flex items-center gap-2 bg-[#082719] text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all"
        >
          <span>سفارش ساخت یا مشاوره فنی در آتلیه</span>
          <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
        </Link>
      </div>
    </div>
  );
}
