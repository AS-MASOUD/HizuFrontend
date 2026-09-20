"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft, Play, Pause, Maximize2 } from "lucide-react";

export interface SlideItem {
  src: string;
  title: string;
  subtitle: string;
  badge: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    src: "/slideshow/slide-1.jpg",
    title: "کارگاه ماشین‌کاری پیشرفته ۵ محوره CNC",
    subtitle: "CAM 01 // CNC MILLING & PROTOTYPING",
    badge: "TOLERANCE ±0.01mm",
  },
  {
    src: "/slideshow/slide-2.jpg",
    title: "پرینت ۳بعدی صنعتی ابعاد بزرگ",
    subtitle: "ADDITIVE 02 // INDUSTRIAL SLS & FDM",
    badge: "PA12 CARBON / RESIN",
  },
  {
    src: "/slideshow/slide-3.jpg",
    title: "برش و حکاکی فوق دقیق لیزر فایبر",
    subtitle: "OPTICS 03 // FIBER LASER 1064nm",
    badge: "METALS & ACRYLIC",
  },
  {
    src: "/slideshow/slide-4.jpg",
    title: "توسعه مکاترونیک و ساخت خط تولید",
    subtitle: "SYSTEMS 04 // INDUSTRIAL AUTOMATION",
    badge: "DFM & ASSEMBLY",
  },
];

const AUTOPLAY_INTERVAL = 5500; // ms per slide

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<boolean[]>(
    new Array(DEFAULT_SLIDES.length).fill(false)
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleImageLoad = (idx: number) => {
    setLoadedSlides((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const currentSlide = DEFAULT_SLIDES[currentIndex];

  return (
    <div
      className="relative w-full rounded-2xl p-2.5 card-popup border border-[#1c211b]/12 shadow-[0_18px_45px_-10px_rgba(28,33,27,0.15)] group/slideshow overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="نمایشگاه کارگاه هیزو"
    >
      {/* Precision corner calipers */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slideshow:scale-110" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slideshow:scale-110" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slideshow:scale-110" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slideshow:scale-110" />

      {/* Technical vertical ruler tickmarks */}
      <div className="hidden sm:block absolute top-8 bottom-8 -left-3.5 w-2 technical-ruler-v z-30 opacity-75 pointer-events-none" />

      {/* Main viewport */}
      <div className="relative w-full h-[360px] sm:h-[480px] rounded-xl overflow-hidden bg-[#16191d] select-none">
        {/* Images with Ken Burns zoom & crossfade */}
        {DEFAULT_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.title}
                onLoad={() => handleImageLoad(idx)}
                className={`w-full h-full object-cover filter contrast-[1.08] brightness-[0.93] saturate-[0.92] transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
              {/* Cinematic Vignette & Ambient Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101416]/90 via-[#101416]/20 to-[#101416]/40 pointer-events-none" />
            </div>
          );
        })}

        {/* Ambient Subtle Scanlines */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-20 opacity-60" />

        {/* Top Floating Telemetry Badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-[#082719]/80 backdrop-blur-md border border-[#dfc79b]/30 rounded-full px-3 py-1 text-[10px] font-mono font-semibold text-[#f2e3c6] shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="tracking-wider">{currentSlide.subtitle}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 bg-[#161A1D]/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono text-emerald-400">
            <span>{currentSlide.badge}</span>
          </div>
        </div>

        {/* Bottom Slide Info & Live Caption */}
        <div className="absolute bottom-16 inset-x-4 sm:inset-x-6 z-20 flex flex-col gap-1.5 text-right pointer-events-none">
          <div className="inline-block self-end">
            <span className="bg-[#dfc79b]/20 text-[#dfc79b] border border-[#dfc79b]/40 font-mono text-[9px] px-2 py-0.5 rounded-full tracking-wider">
              HIZU LAB // WORKSHOP CAPABILITY
            </span>
          </div>
          <h3 className="text-white text-lg sm:text-2xl font-black drop-shadow-md transition-all duration-300">
            {currentSlide.title}
          </h3>
        </div>

        {/* Next / Prev Navigation Buttons */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#161A1D]/60 hover:bg-[#082719] border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/slideshow:opacity-100 hover:scale-105 transition-all shadow-lg backdrop-blur-md"
          aria-label="تصویر بعدی"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#161A1D]/60 hover:bg-[#082719] border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/slideshow:opacity-100 hover:scale-105 transition-all shadow-lg backdrop-blur-md"
          aria-label="تصویر قبلی"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Bottom Machined Indicator Bar */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-30 flex items-center justify-between gap-3 bg-[#121417]/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2">
          {/* Slide Numbers & Progress Bars */}
          <div className="flex items-center gap-2 sm:gap-3">
            {DEFAULT_SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="group/btn relative flex items-center gap-1.5 py-1 focus:outline-none"
                  aria-label={`رفتن به اسلاید ${idx + 1}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-8 sm:w-10 bg-[#dfc79b]"
                        : "w-3 sm:w-4 bg-white/30 group-hover/btn:bg-white/60"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] hidden sm:inline ${
                      isActive ? "text-[#dfc79b] font-bold" : "text-white/40"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Autoplay status / Pause indication */}
          <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono">
            <span className="hidden sm:inline">
              {isPaused ? "PAUSED (HOVER)" : "AUTO ROTATING"}
            </span>
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[#dfc79b]">
              {isPaused ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 ml-0.5" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
