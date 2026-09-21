"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { ProductListDto } from "@/types";
import { productsApi, DEFAULT_FEATURED_PRODUCTS } from "@/lib/api/products";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeft, PackageX, MoveHorizontal } from "lucide-react";
import { toPersianDigits } from "@/lib/utils/formatters";

interface FeaturedProductsSectionProps {
  initialProducts?: ProductListDto[];
}

const CLONE_SETS = 7;
const MIDDLE_SET = Math.floor(CLONE_SETS / 2); // 3

export default function FeaturedProductsSection({
  initialProducts = [],
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<ProductListDto[]>(
    initialProducts.length > 0 ? initialProducts : DEFAULT_FEATURED_PRODUCTS
  );
  const [loading, setLoading] = useState(false);

  // If initialProducts was empty at mount, fetch from backend API
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    let isMounted = true;
    productsApi
      .getFeaturedProducts(6)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_FEATURED_PRODUCTS);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setProducts(DEFAULT_FEATURED_PRODUCTS);
      });

    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  const N = products.length;

  // Initialize at middle set directly
  const [currentIndex, setCurrentIndex] = useState(
    () => MIDDLE_SET * (initialProducts.length || DEFAULT_FEATURED_PRODUCTS.length)
  );
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update currentIndex when product count changes
  useEffect(() => {
    if (N > 0) {
      setCurrentIndex(MIDDLE_SET * N);
    }
  }, [N]);

  // Repeated items array for seamless infinite looping
  const repeatedItems = useMemo(() => {
    if (N === 0) return [];
    return Array.from({ length: CLONE_SETS }).flatMap((_, setIdx) =>
      products.map((product, originalIdx) => ({
        product,
        uniqueKey: `${product.id}-set${setIdx}-p${originalIdx}`,
        originalIdx,
      }))
    );
  }, [products, N]);

  // Viewport and Card measurements
  const containerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.innerWidth - 48, 1200) : 1200
  );
  const [cardWidth, setCardWidth] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return Math.min(window.innerWidth - 64, 340);
      if (window.innerWidth < 768) return 340;
      if (window.innerWidth < 1024) return 370;
    }
    return 380;
  });

  const gap = 24; // 1.5rem (gap-6)

  const measure = useCallback(() => {
    if (containerRef.current) {
      const cW = containerRef.current.offsetWidth;
      if (cW > 0) setContainerWidth(cW);
    }
    if (firstCardRef.current) {
      const cardW = firstCardRef.current.offsetWidth;
      if (cardW > 0) setCardWidth(cardW);
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    if (firstCardRef.current) ro.observe(firstCardRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, products]);

  // Gesture Tracking Refs
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastDeltaXRef = useRef(0);

  const stride = cardWidth + gap;
  const centerOffset = Math.max(0, (containerWidth - cardWidth) / 2);
  const currentTranslateX = centerOffset - currentIndex * stride + dragOffset;

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startTimeRef.current = Date.now();
    hasDraggedRef.current = false;
    lastDeltaXRef.current = 0;

    setIsTransitioning(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    // Only initiate drag when moved past 6px threshold
    if (Math.abs(deltaX) > 6 || hasDraggedRef.current) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
      }
      setIsDragging(true);
      lastDeltaXRef.current = deltaX;
      setDragOffset(deltaX);
    }
  };

  const finishDrag = (pointerId?: number, currentTarget?: HTMLDivElement) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (currentTarget && pointerId !== undefined) {
      try {
        if (currentTarget.hasPointerCapture(pointerId)) {
          currentTarget.releasePointerCapture(pointerId);
        }
      } catch {
        // Ignore
      }
    }

    const deltaX = lastDeltaXRef.current;
    const elapsed = Math.max(1, Date.now() - startTimeRef.current);
    const velocity = deltaX / elapsed;

    const distanceThreshold = stride * 0.15;
    const velocityThreshold = 0.25;

    let steps = 0;
    if (Math.abs(deltaX) > distanceThreshold || Math.abs(velocity) > velocityThreshold) {
      // Dragging left (negative deltaX) advances to next card (+1)
      // Dragging right (positive deltaX) moves to previous card (-1)
      const dir = deltaX < 0 ? 1 : -1;
      const count = Math.max(1, Math.round(Math.abs(deltaX) / stride));
      steps = dir * count;
    }

    setDragOffset(0);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + steps);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e.pointerId, e.currentTarget);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e.pointerId, e.currentTarget);
  };

  // Suppress link clicks only when dragging occurred
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  // Seamless Modulo Loop Reset
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (N === 0) return;

    const minSafeIndex = 1 * N;
    const maxSafeIndex = 5 * N;

    if (currentIndex < minSafeIndex || currentIndex >= maxSafeIndex) {
      const activeIdx = ((currentIndex % N) + N) % N;
      const resetIndex = MIDDLE_SET * N + activeIdx;
      setCurrentIndex(resetIndex);
    }
  };

  // Pagination dot click: calculates shortest circular distance
  const handleDotClick = (targetOriginalIdx: number) => {
    if (N === 0 || isTransitioning) return;
    const currentOriginalIdx = ((currentIndex % N) + N) % N;
    let diff = targetOriginalIdx - currentOriginalIdx;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + diff);
  };

  const activeProductIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card-popup rounded-2xl overflow-hidden border border-[#1c211b]/10 bg-white flex flex-col justify-between animate-pulse"
          >
            <div className="w-full h-56 bg-[#EDE8DC]/50" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 bg-[#EDE8DC] rounded w-1/3" />
              <div className="h-5 bg-[#EDE8DC] rounded w-3/4" />
              <div className="h-3 bg-[#EDE8DC] rounded w-full" />
              <div className="pt-3 border-t border-[#1c211b]/10 flex items-center justify-between">
                <div className="h-5 bg-[#EDE8DC] rounded w-1/4" />
                <div className="w-8 h-8 rounded-xl bg-[#EDE8DC]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card-popup rounded-2xl p-12 text-center text-[#5A626A] bg-white border border-[#1c211b]/10 flex flex-col items-center justify-center gap-4 shadow-sm">
        <PackageX className="w-12 h-12 text-[#8f6d2f]/70" />
        <div>
          <h3 className="text-base font-bold text-[#161A1D]">
            محصول برگزیده‌ای برای نمایش یافت نشد
          </h3>
          <p className="text-xs text-[#5A626A] mt-1">
            می‌توانید کاتالوگ کامل محصولات و قطعات کارگاهی را در بخش فروشگاه مشاهده نمایید.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm"
        >
          <span>مشاهده همه محصولات</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col gap-6 select-none">
      {/* 
        CRITICAL: dir="ltr" on the draggable viewport guarantees 
        that flexbox coordinate 0 is at the physical LEFT, so that
        translateX(centerOffset - currentIndex * stride) mathematically 
        positions Card currentIndex in the exact visual center of the screen!
      */}
      <div
        dir="ltr"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
        className={`relative w-full overflow-hidden py-4 -my-4 touch-pan-y cursor-grab active:cursor-grabbing ${
          isDragging ? "select-none" : ""
        }`}
        style={{
          touchAction: "pan-y",
        }}
      >
        {/* Sliding Row Track in LTR coordinates with ghost-image drag prevention */}
        <div
          onTransitionEnd={handleTransitionEnd}
          className="flex flex-row items-stretch will-change-transform select-none [user-select:none] [-webkit-user-drag:none] [&_img]:pointer-events-none [&_img]:select-none"
          style={{
            transform: `translateX(${currentTranslateX}px)`,
            gap: `${gap}px`,
            transition: isTransitioning
              ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        >
          {repeatedItems.map((item, idx) => {
            const isCentered = idx === currentIndex;
            return (
              <div
                key={item.uniqueKey}
                ref={idx === 0 ? firstCardRef : undefined}
                dir="rtl"
                className="w-[82vw] max-w-[340px] sm:max-w-none sm:w-[340px] md:w-[370px] lg:w-[380px] shrink-0 transition-transform duration-300 pointer-events-auto"
                style={{
                  transform: isCentered ? "scale(1)" : "scale(0.965)",
                  opacity: isCentered ? 1 : 0.82,
                }}
              >
                <ProductCard product={item.product} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Drag Hint & Loop Pagination Dots (RTL presentation) */}
      <div
        dir="rtl"
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#1c211b]/08"
      >
        {/* Tactile Drag Hint Badge */}
        <div className="inline-flex items-center gap-2 bg-[#EDE8DC] border border-[#1c211b]/10 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold text-[#161A1D] shadow-2xs">
          <MoveHorizontal
            className={`w-3.5 h-3.5 text-[#0284c7] ${isDragging ? "animate-pulse" : ""}`}
          />
          <span>برای مشاهده بعدی بکشید</span>
          <span className="text-[#8f6d2f] text-[10px] dir-ltr font-mono font-bold border-r border-[#1c211b]/15 pr-2">
            DRAG TO LOOP
          </span>
        </div>

        {/* Dynamic Loop Pagination Pills */}
        <div className="flex items-center gap-2">
          {products.map((p, idx) => {
            const isActive = idx === activeProductIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`رفتن به محصول ${toPersianDigits(idx + 1)}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "bg-[#082719] w-8 h-2.5 shadow-xs"
                    : "bg-[#1c211b]/20 hover:bg-[#1c211b]/40 w-2.5 h-2.5"
                }`}
              />
            );
          })}
        </div>

        {/* Counter Pill */}
        <div className="font-mono text-xs font-bold text-[#5A626A] dir-ltr">
          <span className="text-[#161A1D]">{toPersianDigits(activeProductIndex + 1)}</span>
          <span className="mx-1 text-[#1c211b]/30">/</span>
          <span>{toPersianDigits(N)}</span>
        </div>
      </div>
    </div>
  );
}
