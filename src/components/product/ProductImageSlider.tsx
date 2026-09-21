"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Image as ImageIcon, Maximize2 } from "lucide-react";
import { ProductImage } from "@/types";
import { getImageUrl } from "@/lib/utils/imageUrl";
import ProductFullscreenSlideshow from "./ProductFullscreenSlideshow";

interface ProductImageSliderProps {
  images: ProductImage[];
  primaryImageUrl?: string;
  productName: string;
  tolerance?: string;
}

export default function ProductImageSlider({
  images,
  primaryImageUrl,
  productName,
  tolerance,
}: ProductImageSliderProps) {
  // Consolidate all unique image URLs
  const allImageUrls: string[] = [];
  if (primaryImageUrl) {
    allImageUrls.push(primaryImageUrl);
  }
  images.forEach((img) => {
    if (img.imageUrl && !allImageUrls.includes(img.imageUrl)) {
      allImageUrls.push(img.imageUrl);
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? allImageUrls.length - 1 : prev - 1,
    );
  }, [allImageUrls.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === allImageUrls.length - 1 ? 0 : prev + 1,
    );
  }, [allImageUrls.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (allImageUrls.length === 0) {
    return (
      <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden card-popup border border-[#1c211b]/12 bg-[#16191d] flex flex-col items-center justify-center text-gray-500 gap-2">
        <ImageIcon className="w-10 h-10 opacity-30" />
        <span className="font-mono text-xs">NO IMAGE AVAILABLE</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Viewport Container */}
      <div className="relative w-full rounded-2xl p-2.5 card-popup border border-[#1c211b]/12 shadow-[0_18px_45px_-10px_rgba(28,33,27,0.15)] group/slider">
        {/* Precision corner frame square calipers */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slider:scale-125"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slider:scale-125 flex justify-end"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slider:scale-125 flex items-end"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#b5924d] z-30 pointer-events-none transition-transform duration-300 group-hover/slider:scale-125 flex items-end justify-end"></div>

        {/* Viewport inner */}
        <div
          onClick={() => setIsFullscreenOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsFullscreenOpen(true);
            }
          }}
          aria-label="کلیک برای نمایش تمام‌صفحه و بزرگنمایی تصویر محصول"
          className="relative w-full h-[400px] sm:h-[480px] rounded-xl overflow-hidden bg-[#16191d] cursor-zoom-in select-none group/viewport"
        >
          {allImageUrls.map((url, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={getImageUrl(url)}
                  alt={`${productName} - نمای ${index + 1}`}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-500 group-hover/viewport:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retried) {
                      target.dataset.retried = "true";
                      target.src = getImageUrl(url);
                    }
                  }}
                />
              </div>
            );
          })}

          {/* Fullscreen Hint Badge on Top-Right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 hover:bg-[#082719] border border-white/20 hover:border-[#dfc79b]/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 transition-all opacity-85 group-hover/viewport:opacity-100 shadow-md">
            <Maximize2 className="w-3.5 h-3.5 text-[#dfc79b]" />
            <span className="text-[11px] font-sans">نمایش تمام‌صفحه</span>
          </div>

          {/* Tolerance Badge */}
          {tolerance && (
            <div className="absolute bottom-3 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[#dfc79b] dir-ltr border border-[#dfc79b]/30">
              TOLERANCE: {tolerance}
            </div>
          )}

          {/* Slide Counter Badge */}
          {allImageUrls.length > 1 && (
            <div className="absolute top-3 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-mono text-white/90">
              {currentIndex + 1} / {allImageUrls.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {allImageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="تصویر قبلی"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="تصویر بعدی"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails Navigation Strip */}
      {allImageUrls.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImageUrls.map((url, index) => {
            const isSelected = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                  isSelected
                    ? "border-[#082719] shadow-md ring-2 ring-[#082719]/20"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageUrl(url)}
                  alt={`${productName} thumbnail ${index + 1}`}
                  loading="lazy"
                  fetchPriority="low"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retried) {
                      target.dataset.retried = "true";
                      target.src = getImageUrl(url);
                    }
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Slideshow Modal */}
      <ProductFullscreenSlideshow
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        images={allImageUrls}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        productName={productName}
        tolerance={tolerance}
      />
    </div>
  );
}
