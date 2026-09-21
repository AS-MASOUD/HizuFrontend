"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  Layers,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { toPersianDigits } from "@/lib/utils/formatters";

interface ProductFullscreenSlideshowProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  productName: string;
  tolerance?: string;
}

export default function ProductFullscreenSlideshow({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  productName,
  tolerance,
}: ProductFullscreenSlideshowProps) {
  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Portal mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onIndexChange]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handleNext();
      } else if (e.key === "ArrowRight") {
        handlePrev();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isZoomed, handleNext, handlePrev, onClose]);

  // Autoplay slideshow
  useEffect(() => {
    if (!isOpen || !isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, images.length, handleNext]);

  // Track native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleNativeFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Browser permissions or mobile may restrict fullscreen API
    }
  };

  // Touch swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Check if horizontal swipe is prominent
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swiped right -> in RTL, next or prev
        handlePrev();
      } else {
        // Swiped left
        handleNext();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !mounted || images.length === 0) return null;

  const currentImageUrl = images[currentIndex] || images[0];

  const modalContent = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 text-white backdrop-blur-md select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`نمایش اسلاید تصاویر ${productName}`}
      tabIndex={-1}
    >
      {/* Top Header Controls Bar */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-white/10 bg-[#0f1215]/80 backdrop-blur-md">
        {/* Left: Product title & counter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#082719]/80 border border-[#dfc79b]/30 rounded-full px-3 py-1 text-xs font-mono text-[#f2e3c6]">
            <Layers className="w-3.5 h-3.5 text-[#dfc79b]" />
            <span className="truncate max-w-[200px] md:max-w-xs font-sans font-bold">
              {productName}
            </span>
          </div>

          <div className="bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-mono text-[#dfc79b]">
            نمای {toPersianDigits(currentIndex + 1)} از{" "}
            {toPersianDigits(images.length)}
          </div>

          {tolerance && (
            <div className="hidden md:inline-flex bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-gray-300 dir-ltr">
              TOLERANCE: {tolerance}
            </div>
          )}
        </div>

        {/* Right: Actions (Autoplay, Zoom, Fullscreen, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Autoplay Slideshow Toggle */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                isPlaying
                  ? "bg-[#082719] border-[#dfc79b]/40 text-[#dfc79b] shadow-md"
                  : "bg-white/5 hover:bg-white/15 border-white/10 text-white/80"
              }`}
              title={isPlaying ? "توقف پخش خودکار (Space)" : "پخش خودکار اسلایدها (Space)"}
              aria-label={isPlaying ? "توقف پخش خودکار" : "پخش خودکار"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-[#dfc79b]" />
                  <span className="hidden sm:inline text-[11px] font-mono font-medium">
                    توقف
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px] font-mono font-medium">
                    پخش اسلاید
                  </span>
                </>
              )}
            </button>
          )}

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all ${
              isZoomed
                ? "bg-[#082719] border-[#dfc79b]/40 text-[#dfc79b]"
                : "bg-white/5 hover:bg-white/15 border-white/10 text-white/80"
            }`}
            title={isZoomed ? "کوچک‌نمایی (1x)" : "بزرگ‌نمایی تصویر (2x)"}
            aria-label={isZoomed ? "کوچک‌نمایی" : "بزرگ‌نمایی"}
          >
            {isZoomed ? (
              <ZoomOut className="w-4 h-4" />
            ) : (
              <ZoomIn className="w-4 h-4" />
            )}
          </button>

          {/* Browser Native Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all hidden sm:inline-flex"
            title={isNativeFullscreen ? "خروج از تمام‌صفحه مرورگر" : "تمام‌صفحه مرورگر"}
            aria-label="تغییر وضعیت تمام‌صفحه"
          >
            {isNativeFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 hover:text-white transition-all ml-1"
            title="بستن (Esc)"
            aria-label="بستن نمایش تمام‌صفحه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stage Viewport */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-6"
        onClick={(e) => {
          // If clicked directly on stage background (not on buttons or image), close modal
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="تصویر قبلی"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-[#082719] border border-white/20 hover:border-[#dfc79b]/40 text-white hover:text-[#dfc79b] backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="تصویر بعدی"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-[#082719] border border-white/20 hover:border-[#dfc79b]/40 text-white hover:text-[#dfc79b] backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </>
        )}

        {/* Central Display Image */}
        <div
          className={`relative max-w-full max-h-full transition-transform duration-300 ease-out select-none flex items-center justify-center ${
            isZoomed
              ? "scale-150 cursor-zoom-out overflow-auto"
              : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <img
            key={currentImageUrl}
            src={getImageUrl(currentImageUrl)}
            alt={`${productName} - اسلاید ${currentIndex + 1}`}
            className="max-h-[65vh] sm:max-h-[75vh] md:max-h-[78vh] w-auto max-w-[85vw] sm:max-w-[88vw] object-contain rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter contrast-[1.03]"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.retried) {
                target.dataset.retried = "true";
                target.src = getImageUrl(currentImageUrl);
              }
            }}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip & Information */}
      <div className="relative z-30 border-t border-white/10 bg-[#0f1215]/85 backdrop-blur-md px-4 py-3 flex flex-col gap-2">
        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none max-w-5xl mx-auto">
            {images.map((url, index) => {
              const isSelected = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    onIndexChange(index);
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#16191d] ${
                    isSelected
                      ? "border-[#dfc79b] ring-2 ring-[#dfc79b]/40 scale-105 shadow-lg"
                      : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                  }`}
                  aria-label={`رفتن به تصویر ${index + 1}`}
                >
                  <img
                    src={getImageUrl(url)}
                    alt={`${productName} کوچک ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-white/90 bg-black/60 px-1 rounded">
                    {index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between text-[11px] text-white/40 max-w-5xl mx-auto w-full px-2">
          <span className="hidden sm:inline">
            کلیدهای جهت‌نما: پیمایش تصاویر • کلید Space: پخش اسلاید • کلید Esc: خروج
          </span>
          <span className="text-[10px] font-mono text-[#dfc79b]/70 dir-ltr">
            HIZU ENGINEERING VISUALIZER
          </span>
          <span className="sm:hidden text-[10px]">
            برای تغییر تصویر بکشید (Swipe)
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
