"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/providers/CompareProvider";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import { Scale, X, Trash2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

export default function FloatingCompareBar() {
  const pathname = usePathname();
  const { compareItems, compareCount, removeFromCompare, clearCompare, maxItems } = useCompare();
  const [isMinimized, setIsMinimized] = useState(false);

  // Do not render if no items or if already on /compare page
  if (compareCount === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <aside
      aria-label="نوار مقایسه محصولات"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-2xl w-auto z-40 transition-all duration-300 pointer-events-auto"
    >
      <div className="card-popup rounded-2xl bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#1c211b]/15 shadow-[0_16px_40px_rgba(28,33,27,0.18)] overflow-hidden">
        {/* Header Bar with Toggle & Clear */}
        <div className="bg-[#EDE8DC] px-4 py-2 border-b border-[#1c211b]/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#082719]" />
            <span className="text-xs font-bold text-[#161A1D]">بخش مقایسه هوشمند</span>
            <span className="bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              {toPersianDigits(compareCount)} از {toPersianDigits(maxItems)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-[11px] text-[#5A626A] hover:text-rose-700 flex items-center gap-1 transition-colors px-2 py-0.5 rounded"
              title="خالی کردن لیست مقایسه"
            >
              <Trash2 className="w-3 h-3" />
              <span>پاک‌کردن</span>
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-[#5A626A] hover:text-[#161A1D] transition-colors rounded-full"
              title={isMinimized ? "باز کردن نوار" : "کوچک کردن"}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Body */}
        {!isMinimized && (
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Selected Products Thumbnails */}
            <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group shrink-0 flex items-center gap-2 bg-[#FAF7F0] border border-[#1c211b]/10 rounded-xl p-1.5 pr-2 max-w-[170px]"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-[#1c211b]/08">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-gray-400">
                        HIZU
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-[11px] font-bold text-[#161A1D] truncate">{item.name}</span>
                    <span className="text-[10px] font-mono text-[#082719] font-semibold">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute -top-1.5 -left-1.5 bg-white hover:bg-rose-600 text-[#5A626A] hover:text-white rounded-full p-0.5 border border-[#1c211b]/15 shadow-sm transition-colors"
                    title="حذف از مقایسه"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: maxItems - compareCount }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-28 h-12 rounded-xl border-2 border-dashed border-[#1c211b]/15 bg-[#FAF7F0]/40 flex items-center justify-center text-[10px] text-[#5A626A]/70 shrink-0 font-medium"
                >
                  + افزودن قطعه
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              {compareCount >= 2 ? (
                <Link
                  href="/compare"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
                >
                  <Scale className="w-4 h-4 text-[#dfc79b]" />
                  <span>مشاهده جدول و نمودار مقایسه</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-[11px] text-[#5A626A] font-medium text-center sm:text-right">
                  برای شروع مقایسه، یک محصول دیگر اضافه کنید.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
