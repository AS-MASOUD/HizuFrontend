import React from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import { contentApi, HomeContent } from "@/lib/api/content";
import ProductCard from "@/components/product/ProductCard";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import Accordion from "@/components/ui/Accordion";
import {
  ArrowLeft,
  Wrench,
  Layers,
  Sparkles,
  Cog,
  Scan,
  ShieldCheck,
  Award,
  Maximize2,
} from "lucide-react";

export const revalidate = 60; // ISR revalidation every 60 seconds

function getServiceIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "layers":
      return <Layers className="w-6 h-6 text-[#0284c7]" />;
    case "wrench":
      return <Wrench className="w-6 h-6 text-[#8f6d2f]" />;
    case "sparkles":
      return <Sparkles className="w-6 h-6 text-[#0284c7]" />;
    case "cog":
      return <Cog className="w-6 h-6 text-[#5A626A]" />;
    case "scan":
    default:
      return <Scan className="w-6 h-6 text-[#5A626A]" />;
  }
}

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let homeContent: HomeContent | null = null;

  try {
    const [productsRes, contentRes] = await Promise.allSettled([
      productsApi.getFeaturedProducts(6),
      contentApi.getHomeContent(),
    ]);
    if (productsRes.status === "fulfilled") {
      featuredProducts = productsRes.value;
    }
    if (contentRes.status === "fulfilled") {
      homeContent = contentRes.value;
    }
  } catch {
    // Graceful error handling
  }

  const processSteps =
    homeContent?.processSteps?.map((s) => ({
      num: s.stepNumber,
      title: s.title,
      desc: s.description,
    })) || [];

  const services =
    homeContent?.services?.map((s) => ({
      icon: getServiceIcon(s.iconName),
      badge: s.badge || "HIZU SPEC",
      coord: s.coord || "ISO CAD",
      title: s.shortTitle || s.title,
      desc: s.shortDescription || s.description,
    })) || [];

  const faqItems =
    homeContent?.faqs?.map((faq) => ({
      id: faq.id,
      title: faq.question,
      badge: faq.badge,
      content: (
        <p className="text-xs sm:text-sm text-[#5A626A] leading-relaxed">
          {faq.answer}
        </p>
      ),
    })) || [];

  const heroSlides = homeContent?.slides?.map((s) => ({
    src: s.imageUrl,
    title: s.title,
    subtitle: s.subtitle,
    badge: s.badge,
  }));

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-16">
      {/* 1. Hero Section with Auto-change Slideshow & Micro-Animations */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 pt-8 sm:pt-12 hero-glow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
            {/* High-tech protocol badge with glaze sheen and subtle float */}
            {/* <div className="inline-flex items-center gap-2.5 self-start bg-[#FFFFFF] border border-[#1c211b]/12 rounded-full px-4 py-1.5 text-xs font-mono font-semibold text-[#161A1D] shadow-[0_2px_10px_rgba(28,33,27,0.06)] glaze-shimmer animate-subtle-float">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="tracking-wide text-[#333C44]">
                HIZU FABRICATION LAB // PROTOCOL 2026
              </span>
              <span className="text-[#0284c7] text-[10px] pr-2 border-r border-[#1c211b]/15 dir-ltr font-mono">
                Z: +42.1mm
              </span>
            </div> */}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#161A1D] leading-[1.2] tracking-tight">
              <span className="text-[#1F3D2E]">ایده‌ت رو بساز.</span>
              <br />
              <span className="text-[#6B7F4E]">طراحی و ساخت</span>
              <br />
              <span className="text-[#1F3D2E]">دیجیتال برای آینده.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A626A] leading-relaxed max-w-xl font-normal">
              از یک قطعه ساده تا یک ماشین کامل؛ پیوند میان مهندسی دیجیتال،
              تلرانس دقیق و متریال ناب در قلب کارگاه تهران. ساخت بدون محدودیت در
              هیزو.
            </p>

            {/* Tactile bumping CTA buttons with glaze hover */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#082719] hover:bg-[#16191d] text-[#ffffff] font-bold text-sm px-7 py-3.5 rounded-full shadow-md border border-[#082719]/20 interactive-bump glaze-hover"
              >
                <span>مشاهده محصولات و کاتالوگ</span>
                <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
              </Link>
              <Link
                href="/special-orders"
                className="inline-flex items-center gap-2.5 glass-btn-machined text-[#161A1D] font-semibold text-sm px-7 py-3.5 rounded-full relative group shadow-md interactive-bump glaze-hover"
              >
                <Wrench className="w-4 h-4 text-[#0284c7]" />
                <span>سفارش ساخت فوری</span>
              </Link>
            </div>
          </div>

          {/* Hero Slideshow: Auto-advancing with Ken Burns zoom & public/slideshow folder */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <HeroSlideshow slides={heroSlides} />
          </div>
        </div>

        {/* Verified Metrics Bar with tactile micro-bumps */}
        <div className="mt-12 w-full card-popup rounded-2xl p-5 sm:p-6 shadow-[0_14px_34px_-6px_rgba(28,33,27,0.1),0_4px_12px_rgba(0,0,0,0.03)] relative border border-[#1c211b]/10 bg-white">
          <div className="absolute top-2 left-4 font-mono text-[9px] text-[#5A626A] uppercase tracking-widest hidden md:block">
            SPEC // VERIFIED METRICS
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#1c211b]/10">
            <div className="flex items-center gap-4 pt-4 md:pt-0 group/metric cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#EDE8DC] border border-[#1c211b]/10 flex items-center justify-center text-[#8f6d2f] shrink-0 group-hover/metric:scale-110 group-hover/metric:-rotate-3 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-black text-[#161A1D]">
                  +8 سال
                </span>
                <span className="text-xs text-[#5A626A] font-medium">
                  تجربه ساخت و مهندسی
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pr-6 group/metric cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#EDE8DC] border border-[#1c211b]/10 flex items-center justify-center text-[#0284c7] shrink-0 group-hover/metric:scale-110 group-hover/metric:-rotate-3 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-black text-[#161A1D]">
                  +250
                </span>
                <span className="text-xs text-[#5A626A] font-medium">
                  پروژه موفق و تحویلی
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pr-6 group/metric cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#EDE8DC] border border-[#1c211b]/10 flex items-center justify-center text-[#10b981] shrink-0 group-hover/metric:scale-110 group-hover/metric:-rotate-3 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-black text-[#161A1D]">
                  100%
                </span>
                <span className="text-xs text-[#5A626A] font-medium">
                  رضایت مشتریان صنعتی
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pr-6 group/metric cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#EDE8DC] border border-[#1c211b]/10 flex items-center justify-center text-[#8f6d2f] shrink-0 group-hover/metric:scale-110 group-hover/metric:-rotate-3 transition-transform">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-black text-[#161A1D] dir-ltr text-right">
                  ±0.05 mm
                </span>
                <span className="text-xs text-[#5A626A] font-medium">
                  دقت ابعادی استاندارد ISO
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Section with bumping and glaze cards */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* <span className="font-mono text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] border border-[#1c211b]/10 px-2.5 py-1 rounded-full uppercase tracking-wider self-start">
              [ SERVICES WE PROVIDE ]
            </span> */}
            <h2 className="text-3xl sm:text-4xl font-black text-[#161A1D] leading-tight">
              راهکارهای مهندسی.
              <br />
              خروجی دقیق و فیزیکی.
            </h2>
            <p className="text-sm sm:text-base text-[#5A626A] leading-relaxed">
              ما به طراحان و صنایع کمک می‌کنیم ایده‌ها را با فرآیندهای ادغام‌شده
              در کارگاه به نمونه‌های بادوام و آماده تولید تبدیل کنند.
            </p>
            <div className="pt-2">
              <Link
                href="/special-orders"
                className="inline-flex items-center gap-2 glass-btn-machined text-[#161A1D] hover:text-[#082719] px-5 py-2.5 rounded-full text-xs font-bold shadow-sm group interactive-bump glaze-hover"
              >
                <span>استعلام ساخت پروژه</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            {services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {services.map((s, idx) => (
                  <div
                    key={idx}
                    className="card-popup card-popup-hover rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden bg-white interactive-bump glaze-hover"
                  >
                    <div className="absolute top-2 left-2 text-[9px] font-mono text-[#0284c7]">
                      {s.coord}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F3EFE6] border border-[#1c211b]/10 flex items-center justify-center text-[#161A1D] group-hover:bg-[#082719] group-hover:text-[#FFFFFF] transition-all shadow-xs group-hover:scale-110 group-hover:-translate-y-1">
                        {s.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#161A1D]">
                          {s.title}
                        </h3>
                        <p className="text-xs text-[#5A626A] mt-1 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#1c211b]/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] bg-[#EDE8DC] text-[#333C44] px-1.5 py-0.5 rounded border border-[#1c211b]/15 font-bold">
                        {s.badge}
                      </span>
                      <ArrowLeft className="w-4 h-4 text-[#5A626A] group-hover:text-[#161A1D] group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-popup rounded-2xl p-12 text-center text-[#5A626A] bg-white">
                درحال بارگذاری خدمات کارگاه هیزو...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Featured Products / Selected Work */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#161A1D] mt-1">
              محصولات و پروژه‌های برتر
            </h2>
            {/* <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
              [ SELECTED WORK ]
            </span> */}
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 glass-btn-machined text-[#161A1D] hover:text-[#082719] px-5 py-2 rounded-full text-xs font-bold self-start sm:self-auto shadow-sm interactive-bump glaze-hover"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <FeaturedProductsSection initialProducts={featuredProducts} />
      </section>

      {/* 4. Engineering Process */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="card-popup rounded-2xl p-8 sm:p-10 shadow-[0_14px_34px_-6px_rgba(28,33,27,0.1),0_4px_12px_rgba(0,0,0,0.03)] relative border border-[#1c211b]/10 bg-white glaze-hover">
          <div className="mb-10 text-center sm:text-right">
            {/* <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
              [ OUR PROCESS ]
            </span> */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#161A1D] mt-1">
              ایده تا تحویل: فرآیند 5 مرحله‌ای مهندسی در هیزو
            </h2>
          </div>

          {processSteps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
              {processSteps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center sm:items-start text-center sm:text-right gap-3 group/step"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border-2 border-[#1c211b]/20 text-[#161A1D] flex items-center justify-center font-mono font-black text-sm shadow-sm group-hover/step:border-[#082719] group-hover/step:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0284c7] bg-[#EDE8DC] px-2 py-0.5 rounded border border-[#1c211b]/10">
                      STEP
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#161A1D]">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#5A626A] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#5A626A]">
              درحال دریافت مراحل فرآیند مهندسی...
            </div>
          )}
        </div>
      </section>

      {/* 5. Interactive Technical FAQ Accordion Section */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* <span className="font-mono text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] border border-[#1c211b]/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                [ TECHNICAL PROTOCOLS &amp; FAQ ]
              </span> */}
              <h2 className="text-3xl sm:text-4xl font-black text-[#161A1D]">
                پرسش‌های متداول و الزامات فنی ساخت
              </h2>
            </div>
            <span className="text-xs text-[#5A626A] font-mono">
              VERIFIED // FABRICATION FAQ
            </span>
          </div>

          <Accordion
            items={faqItems}
            defaultOpenId="faq-1"
            className="w-full"
          />
        </div>
      </section>

      {/* 6. Quote / Atelier Manifest */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden card-popup p-8 sm:p-12 shadow-[0_14px_34px_-6px_rgba(28,33,27,0.1)] border border-[#1c211b]/10 bg-white interactive-bump glaze-hover">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <span className="text-6xl text-[#b5924d]/40 font-serif leading-none select-none">
                “
              </span>
              <p className="text-xl sm:text-2xl font-bold text-[#161A1D] leading-relaxed -mt-6">
                هیزو پیوند میان تفکر طراح، مهندسی الگوریتمیک و کارگاه فیزیکی
                است؛ جایی که هیچ ایده‌ای روی مانیتور رها نمی‌شود و به واقعیت
                ملموس تبدیل خواهد شد.
              </p>
              <div className="flex items-center gap-1 text-[#b5924d] text-sm">
                ★★★★★
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <div className="flex items-center gap-4 bg-[#F8F6F1] border border-[#1c211b]/10 rounded-2xl p-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#082719] flex items-center justify-center text-[#dfc79b] shrink-0 font-mono font-black text-lg border border-[#082719]/20">
                  H
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-sm text-[#161A1D]">
                    شورای فنی و مهندسی هیزو
                  </span>
                  <span className="text-xs text-[#5A626A]">
                    استودیو طراحی و ساخت تهران
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. High-Impact Fabrication CTA with Glaze Sheen */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#082719] via-[#103825] to-[#1f3d2e] p-8 sm:p-12 text-[#ffffff] shadow-2xl border border-[#1f3d2e]/40 glaze-shimmer">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 text-center lg:text-right">
              {/* <span className="font-mono text-xs font-bold text-[#a7f3d0] uppercase tracking-wider">
                READY TO FABRICATE SOMETHING REAL?
              </span> */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#ffffff]">
                آماده‌اید ایده‌تان را به یک قطعه یا ماشین واقعی تبدیل کنید؟
              </h2>
              <p className="text-sm text-[#d1fae5]/80 max-w-xl">
                فایل‌های فنی (.STEP / .DXF / .STL) یا اسکچ‌های اولیه خود را
                ارسال کنید تا فرآیند بررسی و ساخت را آغاز کنیم.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/special-orders"
                className="inline-flex items-center gap-3 glass-btn-primary font-extrabold text-sm sm:text-base px-8 py-4 rounded-full shadow-xl text-[#121417] interactive-bump"
              >
                <span>شروع پروژه و استعلام قیمت</span>
                <ArrowLeft className="w-5 h-5 text-[#121417]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
