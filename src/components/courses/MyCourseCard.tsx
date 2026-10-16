"use client";

import React from "react";
import Link from "next/link";
import { CourseListDto } from "@/types";
import { toPersianDigits } from "@/lib/utils/formatters";
import {
  Clock,
  PlayCircle,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  User,
  BookOpen,
} from "lucide-react";

interface MyCourseCardProps {
  course: CourseListDto;
}

export default function MyCourseCard({ course }: MyCourseCardProps) {
  const isReservation =
    Boolean(course.isReservationOnly) ||
    course.price === null ||
    course.price === undefined ||
    course.price <= 0;

  const levelColorMap: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" }, // Beginner
    2: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" }, // Intermediate
    3: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" }, // Advanced
    4: { bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-200" }, // AllLevels
  };

  const levelStyle = levelColorMap[course.level] || levelColorMap[4];

  return (
    <div className="group card-popup rounded-2xl bg-white border border-[#1c211b]/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#082719]/35 h-full">
      {/* Top Media & Badges */}
      <div>
        <Link
          href={`/courses/${course.slug}`}
          className="block relative aspect-[16/10] overflow-hidden bg-[#16191d]"
        >
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

            {isReservation ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-900" />
                <span>پیش‌ثبت‌نام شده</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white border border-emerald-400 shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>ثبت‌نام شده (دسترسی دائم)</span>
              </span>
            )}
          </div>

          {/* Quick Play Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#082719] text-[#dfc79b] border-2 border-[#dfc79b] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <PlayCircle className="w-7 h-7 fill-current" />
            </div>
          </div>
        </Link>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] text-[#5A626A]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span className="font-mono font-medium">
                {course.durationText || (course.durationMinutes ? `${course.durationMinutes} دقیقه` : "دوره کارگاهی")}
              </span>
            </div>
            {course.totalEpisodesCount > 0 && (
              <div className="flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5 text-[#0284c7]" />
                <span className="font-mono font-medium">
                  {toPersianDigits(course.totalEpisodesCount)} جلسه
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="font-bold text-base text-[#161A1D] group-hover:text-[#082719] transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Subtitle / Description */}
          {course.subtitle && (
            <p className="text-xs text-[#5A626A] line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Instructor */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1c211b]/08 text-xs text-[#5A626A]">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span className="text-[11px] font-semibold text-[#161A1D]">
                مدرس: {course.instructorName || "استودیو هیزو"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Direct Access CTA */}
      <div className="p-5 pt-0 mt-2">
        <Link
          href={`/courses/${course.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#162b20] text-[#dfc79b] py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md interactive-bump glaze-shimmer"
        >
          <PlayCircle className="w-4 h-4 text-[#dfc79b]" />
          <span>ورود به دوره و مشاهده جلسات</span>
          <ArrowLeft className="w-3.5 h-3.5 mr-auto text-[#dfc79b]/70" />
        </Link>
      </div>
    </div>
  );
}
