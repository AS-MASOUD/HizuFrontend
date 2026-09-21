"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Wrench,
  Sparkles,
  Scan,
  Cog,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Award,
  ChevronRight,
  Maximize2,
  FileCheck,
  Clock,
  Settings,
  Flame,
} from "lucide-react";
import { toEnglishDigits } from "@/lib/utils/formatters";

export default function ServicesPage() {
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-service-id");
            if (id) {
              setRevealedCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const servicesData = [
    {
      id: "3d-print",
      serviceParam: "3d-print",
      code: "PROTOCOL 01",
      badge: "FDM / SLS / SLA | PA12-CF",
      title: "پرینت 3بعدی صنعتی و نمونه‌سازی سریع",
      subtitle: "LARGE-FORMAT INDUSTRIAL 3D PRINTING & RAPID TOOLING",
      desc: "تولید نمونه‌های دقیق مهندسی، جیگ و فیکسچرهای سبک، پوسته‌های محافظ و قطعات تیراژ با مجهزترین پرینترهای ابعاد صنعتی. هیزو با تکیه بر تکنولوژی‌های FDM با محفظه حرارتی فعال و SLS نوری، قابلیت تزریق و پرینت پلیمرهای مقاوم در برابر ضربه، سایش و حرارت‌های بالا را فراهم کرده است.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      icon: Layers,
      specs: [
        { label: "تلورانس ابعادی", value: "±0.05 میلی‌متر مطابق استاندارد" },
        { label: "حداکثر ابعاد ساخت یکپارچه", value: "500×500×600 میلی‌متر" },
        { label: "رزولوشن لایه‌گذاری", value: "20 تا 200 میکرون قابل انتخاب" },
        { label: "مقاومت حرارتی پلیمرها", value: "تا 180 درجه سانتی‌گراد نسوز" },
      ],
      materials: ["نایلون فیبر کربن PA12-CF", "پلی‌کربنات نسوز (PC)", "رزین مهندسی Tough", "ABS-ESD آنتی‌استاتیک", "پلیمرهای انعطاف‌پذیر TPU"],
      applications: ["قطعات سبک پهپاد و هوافضا", "پوسته و فریم تجهیزات رباتیک", "قطعات تست کارگاهی و جایگزین آلومینیوم", "هوزینگ‌های ضدآب الکترونیک"],
      equipment: "پارک پرینترهای صنعتی Bambu Lab با محفظه محصور، سیستم لیزری SLS نوری و پرینترهای فرمت بزرگ FDM",
    },
    {
      id: "cnc",
      serviceParam: "cnc",
      code: "PROTOCOL 02",
      badge: "ISO 2768-FINE | ±0.01mm",
      title: "ماشین‌کاری 5 محوره همزمان CNC",
      subtitle: "SIMULTANEOUS 5-AXIS PRECISION CNC MILLING",
      desc: "فرزکاری فوق‌دقیق 5 محوره همزمان برای قطعات با هندسه‌های پیچیده سه‌بعدی و سطوح آزاد (Freeform) بدون نیاز به بستن‌های چندباره و حذف خطای زوایای متقاطع. کارگاه هیزو با تجهیزات تخصصی و ابزارگیرهای صلب، قطعات حساس هوافضا، هیدرولیک و قالب‌های دقیق را از شمش‌های یکپارچه فلزی فرزکاری می‌کند.",
      image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80",
      icon: Wrench,
      specs: [
        { label: "دقت موقعیت‌یابی و تکرارپذیری", value: "±0.008 میلی‌متر میکرونی" },
        { label: "محدوده کارگیر 5 محوره", value: "800×600×500 میلی‌متر" },
        { label: "زبری سطح پرداختی (Ra)", value: "تا 0.4 میکرومتر آینه‌ای" },
        { label: "سرعت چرخش اسپیندل", value: "24,000 دور در دقیقه با کولانت" },
      ],
      materials: ["آلومینیوم 7075-T6 و 6061", "برنج آلیاژی شمش", "استیل نگیر 316 و 304", "فولاد ابزار SPK سخت‌کاری شده", "چوب‌های سخت متراکم صنعتی"],
      applications: ["پره‌های توربین و ایمپلرهای دینامیک", "پوسته‌های هیدرولیک و پنوماتیک", "براکت‌های حساس رباتیک و اتوماسیون", "قالب‌های فرم‌دهی و کشش دقیق"],
      equipment: "مرکز فرزکاری 5 محوره همزمان، سیستم پروب لیزری Renishaw و خنک‌کاری پیشرفته مایع تحت فشار",
    },
    {
      id: "laser",
      serviceParam: "laser",
      code: "PROTOCOL 03",
      badge: "1064nm FIBER & CO2 HIGH-POWER",
      title: "برش فایبر نوری و حکاکی پرسرعت لیزر",
      subtitle: "ULTRA-FAST FIBER & CO2 LASER PROCESSING",
      desc: "برش نوری بی‌نقص انواع ورق‌های فلزی سخت و متریال‌های غیرفلزی با حداقل منطقه متاثر از حرارت (HAZ). استفاده از لیزر فایبر با طول موج 1064 نانومتر و گازهای خلوص بالای نیتروژن و اکسیژن، لبه‌هایی کاملاً صیقلی، عمود و بدون اکسیداسیون یا پلیسه را تضمین می‌کند.",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
      icon: Sparkles,
      specs: [
        { label: "حداکثر ضخامت برش فولاد", value: "تا 20 میلی‌متر با نیتروژن خلوص 99.99%" },
        { label: "دقت پرتو و نقطه فوکوس", value: "±0.03 میلی‌متر روی کانون" },
        { label: "توان سورس فایبر نوری", value: "6000 وات پیوسته صنعتی" },
        { label: "حکاکی نوری عمیق", value: "بارکد، شماره فنی، لوگو و درجه‌بندی" },
      ],
      materials: ["ورق آهن St37 و St52", "ورق استنلس استیل 304 و 316", "ورق مس خالص و برنج فنری", "آلومینیوم سری 5000 و 6000", "چوب طبیعی، MDF و پلکسی گلاس"],
      applications: ["شاسی‌های مدولار الکترونیک", "پنل‌های رک و جعبه‌های مخابراتی", "فلنج‌ها و دیسک‌های ترمز صنعتی", "المان‌های مدرن معماری و مشبک"],
      equipment: "میز برش فایبر 3000×1500 میلی‌متر با هد فوکوس اتوماتیک Precitec و سیستم تزریق گاز نیتروژن و اکسیژن",
    },
    {
      id: "dfm",
      serviceParam: "dfm",
      code: "PROTOCOL 04",
      badge: "METROLOGY GRADE | 5-MICRON SCAN",
      title: "اسکن نوری سه‌بعدی و بهینه‌سازی ساخت (DFM)",
      subtitle: "METROLOGY 3D SCANNING & DESIGN FOR MANUFACTURING",
      desc: "اسکن اپتیکال بدون تماس قطعات مستهلک، نایاب یا دست‌ساز با رزولوشن میکرونی، استخراج ابر نقاط متراکم و بازسازی مدل‌های پارامتریک CAD در نرم‌افزارهای مهندسی. در مرحله بعد، تحلیل جامع قابلیت ساخت (DFM) جهت سبک‌سازی سازه (Topology Optimization) و کاهش هزینه‌های تولید انجام می‌گیرد.",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
      icon: Scan,
      specs: [
        { label: "دقت اندازه‌گیری اسکنر", value: "5 میکرومتر (گواهی کالیبراسیون Metrology)" },
        { label: "فرمت فایل‌های خروجی", value: "STEP, IGES, Parasolid, Native SolidWorks/NX" },
        { label: "تحلیل المان محدود (FEA)", value: "استاتیک، خستگی و توزیع تنش فون مایسز" },
        { label: "گزارش بازرسی ابعادی (Inspection)", value: "نقشه انحراف رنگی با تلورانس GD&T" },
      ],
      materials: ["اسکن کلیه قطعات فلزی، پلیمری و کامپوزیتی", "اسکن قطعات ریخته‌گری با سطوح نامنظم", "قالب‌های قدیمی و قطعات از رده خارج"],
      applications: ["بازسازی قطعات نایاب خطوط تولید خارجی", "تحلیل عیوب و انحرافات ابعادی قطعه ساخته شده", "بهینه‌سازی توپولوژی و کاهش وزن تا 40%", "تبدیل نقشه‌های دوبعدی به مدل‌های سه‌بعدی"],
      equipment: "اسکنر نوری سه‌بعدی نور آبی (Blue Light Optical Scanner) و ایستگاه‌های پردازش محاسباتی Geomagic Control X",
    },
    {
      id: "automation",
      serviceParam: "automation",
      code: "PROTOCOL 05",
      badge: "EMBEDDED CONTROL & SERVO AUTOMATION",
      title: "توسعه مکاترونیک، رباتیک و ماشین‌آلات سفارشی",
      subtitle: "CUSTOM MECHATRONIC SYSTEMS & WORKSHOP AUTOMATION",
      desc: "مهندسی یکپارچه مکانیک، برق صنعتی و نرم‌افزار برای توسعه سیستم‌های خودکار خط تولید، ربات‌های کارتزین، استیج‌های تست لرزش و خستگی، و فیکسچرهای هوشمند مونتاژ. هیزو کلیه مراحل را از تحلیل فیزیکی و نقشه‌کشی تا مونتاژ قطعات، سیم‌کشی و برنامه‌نویسی میکروکنترلر به صورت درون‌سازمانی به اجرا درمی‌آورد.",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
      icon: Cog,
      specs: [
        { label: "سیستم‌های هدایت حرکتی", value: "بال‌اسکروهای پیش‌بارگذاری C3 و ریل‌های خطی" },
        { label: "محرک‌ها و موتورها", value: "سروموتورهای سنکرون AC و استپرهای حلقه بسته" },
        { label: "معماری کنترلر صنعتی", value: "PLC صنعتی زیمنس، دلتا و بردهای امبدد ARM" },
        { label: "رابط کاربری و مانیتورینگ", value: "HMI لمسی صنعتی و اتصال شبکه Modbus/CAN" },
      ],
      materials: ["شاسی‌های پروفیل آلومینیوم مهندسی سخت", "صفحات صلب فولادی تنش‌زدایی شده", "پوشش‌های محافظ شفاف پلی‌کربنات صنعتی"],
      applications: ["دستگاه‌های تست دوام و لرزش قطعات", "ربات‌های پیک اند پلیس و چیدمان کارگاهی", "فیکسچرهای تست عایق و ابعاد آنلاین", "تجهیزات مکانیزه بسته‌بندی و مونتاژ"],
      equipment: "آزمایشگاه مونتاژ مکاترونیک، دستگاه‌های جوشکاری دقیق TIG، اسیلوسکوپ‌های دیجیتال و تست‌بنچ کالیبراسیون سنسور",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-16 sm:gap-24">
      {/* Page Header / Hero Banner */}
      <div className="flex flex-col gap-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-4 py-1.5 rounded-full uppercase tracking-wider self-center shadow-2xs">
          <Settings className="w-3.5 h-3.5 text-[#082719]" />
          <span>[ HIZU INDUSTRIAL CAPABILITIES & DIGITAL FABRICATION ]</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#161A1D] leading-tight tracking-tight">
          فرآیندهای تولید دیجیتال، نمونه‌سازی و ماشین‌کاری دقیق
        </h1>
        <p className="text-sm sm:text-base text-[#5A626A] leading-relaxed max-w-2xl mx-auto">
          زنجیره یکپارچه ساخت سخت‌افزار در کارگاه هیزو؛ تلاقی طراحی دقیق CAD، فرزکاری 5 محوره CNC، پرینترهای ابعاد صنعتی و تست متولوژی با بالاترین استانداردهای مهندسی.
        </p>

        {/* Quick Anchor Navigation Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {servicesData.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#EDE8DC] border border-[#1c211b]/12 text-xs font-semibold text-[#161A1D] hover:text-[#082719] transition-all shadow-2xs flex items-center gap-1.5 interactive-bump"
            >
              <s.icon className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span>{s.title.split(" ")[0]} {s.title.split(" ")[1]}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Services List - Full Width Objects with Scroll Reveal Animations */}
      <div className="flex flex-col gap-12 sm:gap-16">
        {servicesData.map((service, index) => {
          const isEven = index % 2 === 0;
          const isRevealed = revealedCards[service.id];
          const IconComp = service.icon;

          return (
            <div
              key={service.id}
              id={service.id}
              data-service-id={service.id}
              ref={(el) => {
                cardRefs.current[service.id] = el;
              }}
              className={`scroll-reveal-card ${isRevealed ? "revealed" : ""} card-popup rounded-3xl overflow-hidden border-2 border-[#1c211b]/10 bg-white shadow-[0_8px_30px_rgba(28,33,27,0.06)] hover:shadow-2xl hover:border-[#082719]/40 transition-all duration-500`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
                {/* Visual / Media Column (5 cols) */}
                <div
                  className={`relative overflow-hidden bg-[#082719] lg:col-span-5 min-h-[320px] lg:min-h-full ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082719]/90 via-[#082719]/30 to-transparent lg:bg-gradient-to-r lg:from-[#082719]/80 lg:to-transparent" />

                  {/* Top Badges on Image */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold bg-[#082719]/90 text-[#dfc79b] px-3 py-1 rounded-full border border-[#dfc79b]/40 shadow-sm backdrop-blur-md">
                      {service.badge}
                    </span>
                  </div>

                  {/* Protocol Indicator on Bottom Image */}
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#dfc79b]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-[#dfc79b] uppercase">
                        {service.code}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/70 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      ISO 2768 VERIFIED
                    </span>
                  </div>
                </div>

                {/* Content Column (7 cols) */}
                <div
                  className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 lg:col-span-7 bg-white ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#8f6d2f] animate-pulse" />
                        <span className="font-mono text-xs font-bold text-[#8f6d2f] tracking-wider uppercase">
                          {service.subtitle}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D] tracking-tight">
                        {service.title}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#5A626A] leading-relaxed text-justify">
                      {service.desc}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#1c211b]/08">
                      {service.specs.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-0.5"
                        >
                          <span className="text-[11px] text-[#5A626A] font-medium">{item.label}</span>
                          <span className="text-xs font-bold text-[#161A1D] font-mono">{toEnglishDigits(item.value)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Materials & Applications Pills */}
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#161A1D] ml-1">متریال‌های پشتیبانی شده:</span>
                        {service.materials.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="bg-[#EDE8DC] text-[#161A1D] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#1c211b]/10"
                          >
                            {m}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-start gap-1.5 text-xs text-[#5A626A] pt-1">
                        <span className="font-bold text-[#161A1D] shrink-0">تجهیزات کارگاهی:</span>
                        <span className="text-[11px] leading-relaxed">{service.equipment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1c211b]/10 mt-2">
                    <Link
                      href={`/special-orders?service=${service.serviceParam}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#162b20] text-[#FCF9F1] px-6 py-3 rounded-xl text-xs font-bold shadow-md glaze-shimmer interactive-bump"
                    >
                      <span>ثبت سفارش / استعلام آنلاین قیمت</span>
                      <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
                    </Link>

                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF7F0] hover:bg-[#EDE8DC] text-[#161A1D] px-5 py-3 rounded-xl text-xs font-semibold border border-[#1c211b]/15 transition-all text-center"
                    >
                      <span>مشاوره فنی CAD و متریال</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workshop Workflow Steps */}
      <div className="card-popup rounded-3xl p-8 sm:p-12 bg-white border border-[#1c211b]/10 flex flex-col gap-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
            [ END-TO-END FABRICATION WORKFLOW ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D]">
            مراحل دریافت، تحلیل مهندسی و تحویل سفارش در هیزو
          </h2>
          <p className="text-xs sm:text-sm text-[#5A626A]">
            فرآیند شفاف و استاندارد ساخت دیجیتال؛ از بارگذاری فایل CAD تا کنترل کیفیت میکرونی و بسته‌بندی ایمن.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] font-mono font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-bold text-sm text-[#161A1D]">ارسال فایل CAD یا نقشه</h3>
            <p className="text-xs text-[#5A626A] leading-relaxed">
              بارگذاری فایل 3بعدی (STEP, IGES, STL) از طریق سامانه استعلام قیمت به همراه مشخصات متریال و تعداد.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] font-mono font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-bold text-sm text-[#161A1D]">تحلیل DFM و صدور پیش‌فاکتور</h3>
            <p className="text-xs text-[#5A626A] leading-relaxed">
              بررسی قابلیت ساخت توسط مهندسان هیزو، رفع خطاهای هندسی و ارائه قیمت و زمان‌بندی دقیق و شفاف.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] font-mono font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-bold text-sm text-[#161A1D]">ماشین‌کاری و ساخت در آتلیه</h3>
            <p className="text-xs text-[#5A626A] leading-relaxed">
              اجرای برنامه ساخت روی ماشین‌های 5 محوره CNC، پرینترهای SLS/FDM یا لیزر فایبر با نظارت مستمر مهندس فرآیند.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] font-mono font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-bold text-sm text-[#161A1D]">کنترل کیفیت QC و تحویل</h3>
            <p className="text-xs text-[#5A626A] leading-relaxed">
              سنجش ابعادی مطابق استاندارد ISO 2768، صدور گواهی کنترل کیفیت، بسته‌بندی ضدضربه و تحویل حضوری یا ارسال.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#061e13] via-[#082719] to-[#0f3825] text-white border border-[#1f4a34] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 glaze-shimmer">
        {/* Subtle decorative background ambient glow */}
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-[#dfc79b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-[#1f4a34]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3.5 max-w-xl text-center md:text-right">
          <div className="inline-flex items-center gap-2 self-center md:self-start px-3 py-1 rounded-full bg-[#dfc79b]/15 border border-[#dfc79b]/30 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#dfc79b] animate-pulse" />
            <span dir="ltr" className="font-mono text-xs font-bold text-[#dfc79b] tracking-wider uppercase">
              READY TO FABRICATE?
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            پروژه یا فایل CAD خود را برای ساخت در هیزو آماده کرده‌اید؟
          </h2>

          <p className="text-sm sm:text-base text-[#e5ddce] leading-relaxed">
            فایل خود را در سامانه بارگذاری کنید یا جهت مشاوره حضوری و مشاهده نمونه‌قطعات در آتلیه تهران با ما در تماس باشید.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3.5 flex-wrap justify-center shrink-0">
          <Link
            href="/special-orders"
            className="inline-flex items-center justify-center gap-2.5 bg-[#dfc79b] hover:bg-[#ebd8b3] text-[#082719] px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all interactive-bump"
          >
            <span>شروع استعلام ساخت</span>
            <ArrowLeft className="w-4 h-4 text-[#082719]" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-[#FCF9F1] hover:text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold border border-white/25 hover:border-white/40 backdrop-blur-xs transition-all"
          >
            <span>تماس با آتلیه تهران</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
