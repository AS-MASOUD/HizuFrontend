import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Award,
  ShieldCheck,
  Wrench,
  Sparkles,
  Compass,
  CheckCircle2,
  Users,
  Target,
  Clock,
  Layers,
  FileCheck,
  Send,
  Linkedin,
  Mail,
  GraduationCap,
  Briefcase,
} from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "مهندس علیرضا رادمنش",
      role: "بنیان‌گذار و مدیر ارشد مهندسی ساخت",
      enRole: "CHIEF FABRICATION ENGINEER & CO-FOUNDER",
      education: "کارشناسی ارشد مهندسی مکانیک - ساخت و تولید",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "با بیش از ۱۰ سال سابقه تخصصی در برنامه‌نویسی پیشرفته CAM، راه‌اندازی مراکز فرزکاری ۵ محوره همزمان و طراحی سازه‌های دقیق هوافضا و رباتیک. علیرضا با هدف پل زدن میان ایده‌های بلندپروازانه مهندسی و واقعیت ماشین‌کاری صلب، استودیو هیزو را پایه‌گذاری کرد.",
      specialties: ["فرزکاری همزمان ۵ محوره", "برنامه‌نویسی Mastercam & Hypermill", "تلورانس‌گذاری هندسی (GD&T)", "متالورژی آلومینیوم ۷۰۷۵"],
      email: "a.radmanesh@hizustudio.ir",
    },
    {
      name: "مهندس سارا نیک‌پیام",
      role: "مدیر طراحی محاسباتی و تحلیل DFM",
      enRole: "COMPUTATIONAL DESIGN LEAD & DFM SPECIALIST",
      education: "کارشناسی ارشد معماری دیجیتال و الگوریتم‌های ساخت",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      bio: "متخصص فرم‌یابی پارامتریک، شبیه‌سازی تنش المان محدود (FEA) و تبدیل طرح‌های آزاد مفهومی به مدل‌های بهینه‌سازی‌شده برای تولید صنعتی (DFM). سارا مسئول بازطراحی ساختاری قطعات با متد بهینه‌سازی توپولوژی جهت کاهش وزن و هزینه در کارگاه هیزو است.",
      specialties: ["طراحی الگوریتمیک Rhino/Grasshopper", "بهینه‌سازی توپولوژی (Topology Opt)", "اسکن نوری سه‌بعدی و مهندسی معکوس", "پلیمرهای پیشرفته و SLS"],
      email: "s.nikpayam@hizustudio.ir",
    },
    {
      name: "مهندس پویا داوودی",
      role: "سرپرست تحقیق و توسعه مکاترونیک و اتوماسیون",
      enRole: "MECHATRONICS & EMBEDDED SYSTEMS LEAD",
      education: "کارشناسی ارشد مهندسی مکاترونیک و کنترل صنعتی",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "طراح و معمار سیستم‌های حرکتی خودکار، استیج‌های تست لرزش و کنترلرهای فیدبک‌دار کارگاهی. پویا رهبری پروژه‌های ساخت ماشین‌آلات خاص، درایورهای سروموتور دقیق و سیستم‌های کنترل تعبیه‌شده (Embedded ARM) را در هیزو بر عهده دارد.",
      specialties: ["کنترلرهای حرکت صنعتی (Motion Control)", "برنامه‌نویسی PLC زیمنس و دلتا", "طراحی بردهای صنعتی STM32", "طراحی مکانیزم‌های رباتیک"],
      email: "p.davoodi@hizustudio.ir",
    },
    {
      name: "مهندس کیان مهرداد",
      role: "مدیر کنترل کیفیت (QC) و متریال صنعتی",
      enRole: "QUALITY ASSURANCE & MATERIALS SPECIALIST",
      education: "کارشناسی ارشد مهندسی مواد و متالورژی صنعتی",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      bio: "مسئول اعتبارسنجی ابعادی قطعات با ابزارهای دقیق متولوژی، آزمون‌های سایش، مقاومت کششی و نظارت مستقیم بر کنترل کیفیت تلورانسی ISO 2768-Fine. کیان با وسواس مهندسی تضمین می‌کند که هیچ قطعه‌ای بدون تاییدیه تست متالورژی از هیزو خارج نشود.",
      specialties: ["کنترل ابعادی اپتیکال و CMM", "استاندارد تلورانس ISO 2768", "آنالیز ساختار پلیمرهای کربنی", "صدور گواهینامه‌های کیفی ساخت"],
      email: "k.mehrdad@hizustudio.ir",
    },
  ];

  const goals = [
    {
      id: "01",
      title: "بومی‌سازی قطعات های‌تک و دقیق",
      subtitle: "PRECISION LOCALIZATION",
      desc: "تامین و ساخت قطعات فوق‌حساس مکانیکی با تلورانس‌های میکرونی در داخل کشور، بی‌نیاز کردن شرکت‌های دانش‌بنیان، تجهیزات پزشکی و رباتیک از واردات گران‌قیمت.",
      icon: Cpu,
    },
    {
      id: "02",
      title: "نهادینه‌سازی فرهنگ DFM",
      subtitle: "DESIGN FOR MANUFACTURING",
      desc: "اصلاح و بهینه‌سازی مدل‌های سه‌بعدی پیش از برش یا فرزکاری، با هدف به صفر رساندن خطاهای تولیدی، کاهش وزن سازه و پایین آوردن هزینه‌های تمام‌شده.",
      icon: Target,
    },
    {
      id: "03",
      title: "تولید با متریال ناب و اصیل",
      subtitle: "MATERIAL INTEGRITY",
      desc: "پرهیز قطعی از آلیاژهای ضایعاتی یا پلیمرهای بازیافتی؛ استفاده انحصاری از آلومینیوم ۷۰۷۵ گواهی‌دار، برنج شمش، فولادهای استاندارد و نایلون کربن مقاوم.",
      icon: ShieldCheck,
    },
    {
      id: "04",
      title: "ترویج ساخت دیجیتال و آزمایشگاه باز",
      subtitle: "OPEN FABRICATION LAB",
      desc: "برگزاری دوره‌های تخصصی، انتقال تجربه ساخت به طراحان و مهندسان جوان و انتشار مقالات فنی برای ارتقای دانش ساخت در اکوسیستم سخت‌افزاری کشور.",
      icon: Sparkles,
    },
  ];

  const milestones = [
    {
      year: "۱۴۰۰",
      title: "تاسیس استودیو ساخت هیزو",
      desc: "تجهیز کارگاه اولیه در تهران با اولین ماشین‌های ۳ محوره فرزکاری و پرینترهای ابعاد متوسط FDM.",
    },
    {
      year: "۱۴۰۱",
      title: "ورود تکنولوژی SLS و فیبر کربن",
      desc: "راه‌اندازی خط پرینت پیشرفته با نایلون کربن PA12-CF و ثبت اولین قراردادهای تامین قطعات رباتیک صنعتی.",
    },
    {
      year: "۱۴۰۲",
      title: "ارتقا به ماشین‌کاری ۵ محوره همزمان",
      desc: "نصب سنتر ۵ محوره همزمان CNC، اسکنر نوری ۳بعدی متولوژی و دریافت گواهی انطباق استاندارد ISO 2768-Fine.",
    },
    {
      year: "۱۴۰۳",
      title: "توسعه دپارتمان مکاترونیک و پلتفرم آنلاین",
      desc: "راه‌اندازی آزمایشگاه تست مکاترونیک، سامانه آنلاین استعلام فایل CAD و راه‌اندازی فروشگاه قطعات پیش‌ساخته هیزو.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-4 py-1.5 rounded-full uppercase tracking-wider self-center shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-[#082719]" />
          <span>[ ABOUT HIZU FABRICATION LAB &amp; ATELIER ]</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#161A1D] leading-tight tracking-tight">
          پیوند طراحی دیجیتال، الگوریتم و کارگاه ساخت فیزیکی
        </h1>
        <p className="text-sm sm:text-base text-[#5A626A] leading-relaxed max-w-3xl mx-auto text-justify sm:text-center">
          هیزو یک استودیو و آزمایشگاه ساخت دیجیتال (Fabrication Lab) مستقر در تهران است که با تکیه بر ماشین‌آلات پیشرفته ۵ محوره، پرینترهای ابعاد صنعتی و برش لیزر دقیق، مرز میان طراحی مفهومی و تولید صنعتی را برمی‌دارد.
        </p>
      </div>

      {/* Origin Story & Manifesto */}
      <div className="card-popup rounded-3xl p-8 sm:p-12 bg-white border border-[#1c211b]/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#8f6d2f] uppercase tracking-wider">
            <span>[ THE HIZU MANIFESTO ]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D]">
            چرا هیزو متولد شد؟ از کد تا کالبد فیزیکی
          </h2>
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#5A626A] leading-relaxed text-justify">
            <p>
              در سال ۱۴۰۰، شکافی عمیق میان توانمندی طراحان صنعتی و مهندسان ایرانی با ظرفیت کارگاه‌های سنتی احساس می‌شد. مدل‌های سه‌بعدی پیچیده، سازه‌های ارگانیک با فرم‌های آزاد و قطعاتی که نیاز به تلورانس‌های میکرونی داشتند، در کارگاه‌های سنتی به دلیل نبود ماشین‌آلات چندمحوره یا دانش CAM پیشرفته رد می‌شدند.
            </p>
            <p>
              هیزو با هدف از میان برداشتن این مانع متولد شد. نام <strong>«هیزو»</strong> برگرفته از مفهوم فرم‌یابی و پویایی در ساخت است؛ ما معتقدیم هر ایده جسورانه مهندسی باید دقیقا همان‌طور که در نرم‌افزار CAD شبیه‌سازی شده، در دنیای واقعی با همان متریال و مقاومت فیزیکی خلق شود.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1c211b]/08 text-center font-mono">
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/08">
              <span className="text-2xl font-black text-[#082719]">۴+</span>
              <p className="text-[11px] text-[#5A626A] mt-0.5">سال تجربه مداوم</p>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/08">
              <span className="text-2xl font-black text-[#082719]">۱,۲۰۰+</span>
              <p className="text-[11px] text-[#5A626A] mt-0.5">قطعه تولید شده</p>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/08">
              <span className="text-2xl font-black text-[#082719]">±۰.۰۱</span>
              <p className="text-[11px] text-[#5A626A] mt-0.5">میلی‌متر دقت ساخت</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#1c211b]/10 bg-[#082719]">
          <img
            src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
            alt="کارگاه و آتلیه ساخت دیجیتال هیزو"
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#082719] via-[#082719]/40 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <span className="text-[10px] font-mono text-[#dfc79b] uppercase tracking-wider block">
              TEHRAN ATELIER &amp; WORKSHOP
            </span>
            <span className="text-sm font-bold text-white drop-shadow-sm">
              آتلیه طراحی و ماشین‌آلات ساخت دیجیتال هیزو
            </span>
          </div>
        </div>
      </div>

      {/* Core Goals & Vision */}
      <div className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
            [ VISION &amp; CORE OBJECTIVES ]
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#161A1D]">
            اهداف، رسالت و چشم‌انداز هیزو
          </h2>
          <p className="text-xs sm:text-sm text-[#5A626A]">
            چهار اصل بنیادین که مسیر تصمیم‌گیری، سرمایه‌گذاری بر ماشین‌آلات و فرهنگ کاری آتلیه هیزو را مشخص می‌کنند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col justify-between gap-4 group hover:border-[#082719]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] group-hover:bg-[#082719] group-hover:text-[#dfc79b] text-[#082719] flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#8f6d2f]">{g.id}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#8f6d2f] font-bold uppercase tracking-wider block">
                      {g.subtitle}
                    </span>
                    <h3 className="font-bold text-base text-[#161A1D] mt-0.5 group-hover:text-[#082719] transition-colors">
                      {g.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5A626A] leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1c211b]/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5 text-[#082719]" />
              <span>[ CORE ENGINEERING TEAM &amp; FOUNDERS ]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D]">
              تیم مهندسی و بنیان‌گذاران استودیو هیزو
            </h2>
            <p className="text-xs sm:text-sm text-[#5A626A] mt-1 max-w-2xl">
              تیمی متشکل از متخصصان ساخت و تولید، طراحان الگوریتمیک، مهندسان مکاترونیک و کارشناسان متالورژی با سال‌ها تجربه میدانی در کارگاه‌های صنعتی.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#162b20] text-[#FCF9F1] px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm glaze-shimmer interactive-bump self-start sm:self-auto"
          >
            <span>مشاهده خدمات کارگاه</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </Link>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="card-popup card-popup-hover rounded-2xl overflow-hidden border border-[#1c211b]/10 bg-white flex flex-col sm:flex-row gap-6 p-6 sm:p-7 group shadow-sm"
            >
              {/* Photo & Badge */}
              <div className="flex flex-col items-center sm:items-start shrink-0">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#1c211b]/15 bg-[#082719] shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082719]/60 to-transparent" />
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#5A626A]">
                  <Mail className="w-3.5 h-3.5 text-[#8f6d2f]" />
                  <span className="font-mono text-[10px] dir-ltr">{member.email.split("@")[0]}</span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex flex-col justify-between gap-3 flex-1 text-right">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-bold text-[#8f6d2f] uppercase tracking-wider">
                    {member.enRole}
                  </span>
                  <h3 className="text-lg font-black text-[#161A1D] group-hover:text-[#082719] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-[#082719] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#8f6d2f] shrink-0" />
                    <span>{member.role}</span>
                  </p>
                  <p className="text-[11px] text-[#5A626A] flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-[#5A626A] shrink-0" />
                    <span>{member.education}</span>
                  </p>
                </div>

                <p className="text-xs text-[#5A626A] leading-relaxed text-justify">
                  {member.bio}
                </p>

                {/* Specialties Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#1c211b]/08">
                  {member.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-[#FAF7F0] text-[#161A1D] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#1c211b]/08"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Standards & Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#8f6d2f]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">استاندارد تلورانس ISO 2768</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            کلیه قطعات و محصولات تولید شده مطابق با تلورانس‌های هندسی و ابعادی استاندارد ISO 2768-M و ISO 2768-Fine کنترل کیفیت می‌شوند.
          </p>
        </div>

        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#0284c7]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">تحلیل DFM قبل از برشکاری</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            قبل از هرگونه برش یا تراشکاری، هندسه قطعه از نظر صرفه اقتصادی و پایداری فیزیکی توسط مهندسان هیزو ارزیابی و رفع اشکال می‌شود.
          </p>
        </div>

        <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#10b981]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#161A1D]">قرارداد محرمانگی اسناد (NDA)</h3>
          <p className="text-xs text-[#5A626A] leading-relaxed">
            تمامی نقشه‌ها، کانسپت‌ها و فایل‌های CAD مشتریان به عنوان دارایی فکری محرمانه ثبت شده و از سرقت معنوی محافظت می‌گردد.
          </p>
        </div>
      </div>

      {/* Atelier Milestones Timeline */}
      <div className="card-popup rounded-3xl p-8 sm:p-12 bg-white border border-[#1c211b]/10 flex flex-col gap-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
            [ HIZU EVOLUTION &amp; MILESTONES ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D]">
            گاه‌شمار مسیر توسعه و دستاوردهای هیزو
          </h2>
          <p className="text-xs sm:text-sm text-[#5A626A]">
            گام‌های پیوسته در ارتقای توان ماشین‌آلات و ارائه راهکارهای نوین ساخت دیجیتال در کشور.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-2 relative group hover:border-[#082719]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-[#082719] bg-[#EDE8DC] px-2.5 py-0.5 rounded-lg border border-[#1c211b]/10">
                  {m.year}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#8f6d2f]" />
              </div>
              <h3 className="font-bold text-sm text-[#161A1D] mt-2 group-hover:text-[#082719] transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-[#5A626A] leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Address & Visit Banner */}
      <div className="card-popup rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#FAF7F0] via-[#F3EFE6] to-[#EDE8DC] border-2 border-[#1c211b]/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#082719] text-[#dfc79b] flex items-center justify-center shrink-0 shadow-lg">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#8f6d2f] font-bold uppercase tracking-wider">
              VISIT &amp; CONSULTATION
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#161A1D]">
              بازدید حضوری از آتلیه هیزو و مشاوره فنی پروژه‌ها
            </h3>
            <p className="text-xs sm:text-sm text-[#5A626A] mt-1">
              کارگاه مرکزی: تهران، شهرک صنعتی | هماهنگی پیش از مراجعه، بررسی حضوری فایل CAD و مشاهده نمونه قطعات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#162b20] text-white px-7 py-3.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all whitespace-nowrap"
          >
            <span>تماس و نشانی کارگاه</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
