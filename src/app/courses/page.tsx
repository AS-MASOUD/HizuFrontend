"use client";

import React, { useState, useEffect } from "react";
import { coursesApi } from "@/lib/api/courses";
import { CourseListDto, CourseLevel } from "@/types";
import CourseCard from "@/components/courses/CourseCard";
import {
  GraduationCap,
  Search,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  Award,
  Video,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(undefined);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await coursesApi.getCourses({
          search: search.trim() || undefined,
          level: selectedLevel,
          page: 1,
          pageSize: 20,
        });
        setCourses(data.items || []);
      } catch (err) {
        console.error("Failed to load courses", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCourses();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedLevel]);

  const levelOptions: { label: string; value?: CourseLevel }[] = [
    { label: "همه دوره‌ها", value: undefined },
    { label: "از مقدماتی تا پیشرفته", value: 4 },
    { label: "مقدماتی", value: 1 },
    { label: "متوسط", value: 2 },
    { label: "پیشرفته", value: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0]/40 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#082719] to-[#162b20] text-white pt-28 pb-16 px-6 sm:px-8 border-b border-[#082719]">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#dfc79b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#dfc79b] font-medium shadow-sm">
            <GraduationCap className="w-4 h-4 text-[#dfc79b]" />
            <span>آکادمی تخصصی ساخت دیجیتال هیزو</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            دوره‌های آموزشی تخصصی و کارگاهی
          </h1>

          <p className="text-sm sm:text-base text-[#EDE8DC]/85 max-w-2xl leading-relaxed font-light">
            یادگیری پروژه‌محور نرم‌افزارهای CAD/CAM، مسترینگ اسلایسر پرینترهای سه‌بعدی صنعتی و برنامه‌نویسی CNC با تدریس مستقیم مهندسان کارگاه هیزو.
          </p>

          {/* Value Propositions Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 w-full max-w-4xl text-right">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <Video className="w-4 h-4 text-[#dfc79b] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">ویدیوهای Full HD</span>
                <span className="text-[10px] text-white/60">همراه با پیش‌نمایش رایگان</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#dfc79b] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">فایل‌های تمرین کارگاهی</span>
                <span className="text-[10px] text-white/60">پروژه‌های CAD و G-code</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#dfc79b] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">دسترسی مادام‌العمر</span>
                <span className="text-[10px] text-white/60">بدون محدودیت زمانی</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-[#dfc79b] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">پشتیبانی مهندسی هیزو</span>
                <span className="text-[10px] text-white/60">پاسخ به سوالات فنی</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 -mt-6 relative z-20">
        {/* Search & Filter Bar */}
        <div className="card-popup p-4 sm:p-5 rounded-2xl bg-white border border-[#1c211b]/12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#5A626A] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی دوره (مثلاً Fusion 360، پرینت ۳بعدی، CNC)..."
              className="w-full pl-4 pr-10 py-2.5 bg-[#FAF7F0] border border-[#1c211b]/12 rounded-xl text-xs text-[#161A1D] placeholder-[#5A626A]/70 focus:outline-none focus:border-[#082719] focus:ring-1 focus:ring-[#082719]"
            />
          </div>

          {/* Level Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-[#5A626A] ml-2 shrink-0 hidden sm:inline" />
            {levelOptions.map((opt, idx) => {
              const isSelected = selectedLevel === opt.value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedLevel(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#082719] text-[#dfc79b] shadow-xs"
                      : "bg-[#FAF7F0] text-[#5A626A] hover:bg-[#EDE8DC] hover:text-[#161A1D]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Catalog Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-white border border-[#1c211b]/10 p-5 flex flex-col gap-4 animate-pulse h-96"
                >
                  <div className="aspect-[16/10] bg-gray-200 rounded-xl" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto" />
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#1c211b]/10 p-8 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#EDE8DC] flex items-center justify-center text-[#8f6d2f]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#161A1D]">دوره‌ای با این مشخصات یافت نشد</h3>
              <p className="text-xs text-[#5A626A] max-w-sm">
                می‌توانید عبارت جستجو یا فیلتر سطح دوره را تغییر دهید تا دوره‌های دیگر نمایش داده شوند.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLevel(undefined);
                }}
                className="mt-2 text-xs font-bold text-[#082719] hover:underline"
              >
                مشاهده تمام دوره‌ها
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
