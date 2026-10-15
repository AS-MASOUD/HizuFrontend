"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CourseListDto } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import { useCart } from "@/providers/CartProvider";
import {
  Clock,
  PlayCircle,
  Users,
  Star,
  ShoppingBag,
  ArrowLeft,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface CourseCardProps {
  course: CourseListDto;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { addCourseToCart, loading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsAdding(true);
      await addCourseToCart(course.id);
    } catch {
      // Handled in CartProvider toast
    } finally {
      setIsAdding(false);
    }
  };

  const levelColorMap: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" }, // Beginner
    2: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" }, // Intermediate
    3: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" }, // Advanced
    4: { bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-200" }, // AllLevels
  };

  const levelStyle = levelColorMap[course.level] || levelColorMap[4];

  return (
    <div className="group card-popup rounded-2xl bg-white border border-[#1c211b]/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#082719]/40 h-full">
      {/* Top Media & Badges */}
      <div>
        <Link href={`/courses/${course.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#16191d]">
          {course.coverImageUrl ? (
            <img
              src={course.coverImageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#dfc79b] bg-gradient-to-br from-[#082719] to-[#162b20]">
              <GraduationCap className="w-12 h-12 mb-2 opacity-80" />
              <span className="font-mono text-xs font-bold">HIZU ACADEMY</span>
            </div>
          )}

          {/* Dark gradient for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
            >
              {course.levelTitle}
            </span>
            {(course.isReservationOnly || course.price === null || course.price === undefined || course.price <= 0) && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-900" />
                <span>پیش‌ثبت‌نام و رزرو</span>
              </span>
            )}
            {course.isFeatured && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#082719] text-[#dfc79b] border border-[#dfc79b]/30 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>منتخب کارگاه</span>
              </span>
            )}
          </div>


          {/* Video Preview Pill Overlay */}
          {course.introVideoUrl && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-medium">
              <PlayCircle className="w-3.5 h-3.5 text-[#dfc79b]" />
              <span>ویدیو نمونه و معرفی</span>
            </div>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] text-[#5A626A]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span className="font-mono font-medium">{course.durationText || `${course.durationMinutes} دقیقه`}</span>
            </div>
            {course.totalEpisodesCount > 0 && (
              <div className="flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5 text-[#0284c7]" />
                <span className="font-mono font-medium">{toPersianDigits(course.totalEpisodesCount)} جلسه</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span className="font-mono">{toPersianDigits(course.averageRating.toFixed(1))}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="font-bold text-base text-[#161A1D] hover:text-[#082719] transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Subtitle / Description */}
          {course.subtitle && (
            <p className="text-xs text-[#5A626A] line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Instructor & Student Count */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1c211b]/08 text-xs text-[#5A626A]">
            <span className="text-[11px] font-semibold text-[#161A1D]">
              مدرس: {course.instructorName || "استودیو هیزو"}
            </span>
            {course.studentsCount > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                <Users className="w-3.5 h-3.5 text-[#5A626A]" />
                <span className="font-mono">{toPersianDigits(course.studentsCount)} دانشجو</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="p-5 pt-0 mt-2">
        <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/08 flex items-center justify-between gap-3">
          {/* Price */}
          {course.isReservationOnly || course.price === null || course.price === undefined || course.price <= 0 ? (
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-800 font-bold">دوره در حال ضبط</span>
              <span className="font-extrabold text-xs text-[#082719]">
                رزرو و پیش‌ثبت‌نام
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              {course.compareAtPrice && course.compareAtPrice > (course.price ?? 0) && (
                <span className="text-[11px] line-through text-gray-400 font-mono">
                  {formatPrice(course.compareAtPrice)}
                </span>
              )}
              <span className="font-mono font-extrabold text-sm text-[#082719]">
                {formatPrice(course.price)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {course.isReservationOnly || course.price === null || course.price === undefined || course.price <= 0 ? (
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center gap-1.5 bg-[#dfc79b] hover:bg-[#c9b287] text-[#082719] px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-all hover:scale-105 interactive-bump"
                title="رزرو و پیش‌ثبت‌نام دوره"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#082719]" />
                <span>رزرو دوره</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled={isAdding || cartLoading}
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1.5 bg-[#082719] hover:bg-[#162b20] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 disabled:opacity-50 interactive-bump"
                title="افزودن به سبد خرید"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#dfc79b]" />
                <span className="hidden sm:inline">افزودن به سبد</span>
              </button>
            )}

            <Link
              href={`/courses/${course.slug}`}
              className="p-2 rounded-lg bg-white border border-[#1c211b]/15 text-[#161A1D] hover:bg-[#EDE8DC] transition-colors"
              title="مشاهده جزئیات دوره"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
