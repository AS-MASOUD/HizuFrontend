"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { coursesApi } from "@/lib/api/courses";
import { Course } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import CourseVideoPlayer from "@/components/courses/CourseVideoPlayer";
import CourseCurriculumAccordion from "@/components/courses/CourseCurriculumAccordion";
import {
  Clock,
  PlayCircle,
  Users,
  Star,
  ShoppingBag,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileDown,
  ShieldCheck,
  Award,
  BookOpen,
  Share2,
  BookmarkCheck,
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addCourseToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await coursesApi.getCourseBySlug(slug);
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course details", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!course) return;
    try {
      setIsAdding(true);
      await addCourseToCart(course.id);
    } catch {
      // Error handled in toast
    } finally {
      setIsAdding(false);
    }
  };

  const handleReserve = async () => {
    if (!course) return;
    if (!isAuthenticated) {
      info("جهت رزرو و پیش‌ثبت‌نام در این دوره، ابتدا وارد حساب کاربری خود شوید.");
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }

    try {
      setReserving(true);
      const res = await coursesApi.reserveCourse(course.id);
      success(res.message || "رزرو و پیش‌ثبت‌نام شما در این دوره با موفقیت ثبت شد.");
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              isEnrolled: true,
              studentsCount: (prev.studentsCount || 0) + 1,
            }
          : null
      );
    } catch (err: any) {
      error(err.message || "خطا در ثبت رزرو دوره. لطفاً مجدداً تلاش کنید.");
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 aspect-video bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="card-popup rounded-2xl p-12 bg-white border border-[#1c211b]/10 flex flex-col items-center gap-4">
          <GraduationCap className="w-16 h-16 text-[#8f6d2f]" />
          <h1 className="text-2xl font-bold text-[#161A1D]">دوره آموزشی مورد نظر یافت نشد</h1>
          <p className="text-xs text-[#5A626A] max-w-sm">
            این دوره ممکن است تغییر نام یافته یا در حال حاضر در دسترس نباشد.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-[#082719] text-white text-xs font-bold px-6 py-3 rounded-full mt-2"
          >
            <span>بازگشت به فهرست دوره‌ها</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isReservation =
    Boolean(course.isReservationOnly) ||
    course.price === null ||
    course.price === undefined ||
    course.price <= 0;

  const discountPercent =
    !isReservation &&
    course.compareAtPrice &&
    course.price != null &&
    course.compareAtPrice > course.price
      ? Math.round(((course.compareAtPrice - course.price) / course.compareAtPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#FAF7F0]/30 pb-24">
      {/* Breadcrumbs & Header Section */}
      <section className="bg-gradient-to-b from-[#082719] via-[#0e3322] to-[#162b20] text-white pt-24 pb-12 px-6 sm:px-8 border-b border-[#082719]">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#dfc79b]/80">
            <Link href="/" className="hover:text-white transition-colors">
              خانه
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-white transition-colors">
              دوره‌های آموزشی
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs sm:max-w-md">{course.title}</span>
          </nav>

          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#dfc79b]/20 text-[#dfc79b] border border-[#dfc79b]/30">
              {course.levelTitle}
            </span>
            {isReservation ? (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>پیش‌ثبت‌نام دوره</span>
              </span>
            ) : null}
            {course.isFeatured && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دوره ویژه کارگاهی</span>
              </span>
            )}
            <span className="text-[11px] font-mono text-white/70 bg-white/10 px-3 py-1 rounded-full">
              زبان: {course.language}
            </span>
          </div>

          {/* Course Main Title & Subtitle */}
          <div className="flex flex-col gap-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="text-sm sm:text-base text-[#EDE8DC]/85 leading-relaxed font-light">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Quick Stats Strip */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-white/80 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#dfc79b]" />
              <span className="font-mono">{course.durationText || `${course.durationMinutes} دقیقه`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-[#dfc79b]" />
              <span className="font-mono">{toPersianDigits(course.totalEpisodesCount)} جلسه آموزشی</span>
            </div>
            {course.studentsCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#dfc79b]" />
                <span className="font-mono">{toPersianDigits(course.studentsCount)} شرکت‌کننده</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span className="font-mono">{toPersianDigits(course.averageRating.toFixed(1))}</span>
              {course.ratingCount > 0 && (
                <span className="text-white/60 font-mono text-[11px]">
                  ({toPersianDigits(course.ratingCount)} نظر)
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Video, Details, Syllabus, Outcomes */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Sample Video Player */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#8f6d2f]" />
                  <h2 className="font-bold text-base sm:text-lg text-[#161A1D]">
                    ویدیوی معرفی و نمونه تدریس دوره
                  </h2>
                </div>
                <span className="text-xs text-[#5A626A] hidden sm:inline">
                  مشاهده رایگان قبل از خرید
                </span>
              </div>

              <CourseVideoPlayer
                videoUrl={course.introVideoUrl}
                posterUrl={course.coverImageUrl}
                title={course.title}
                durationText={course.durationText}
              />
            </section>

            {/* What You Will Learn Card */}
            {course.whatYouWillLearnList && course.whatYouWillLearnList.length > 0 && (
              <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-black text-lg text-[#161A1D]">
                    آنچه در این دوره می‌آموزید
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {course.whatYouWillLearnList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#333C44] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Course Description */}
            <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#8f6d2f]" />
                <h2 className="font-black text-lg text-[#161A1D]">
                  توضیحات و معرفی دوره
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[#5A626A] leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </section>

            {/* Curriculum Accordion */}
            {course.sections && course.sections.length > 0 && (
              <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-7 shadow-xs">
                <CourseCurriculumAccordion sections={course.sections} />
              </section>
            )}

            {/* Requirements & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {course.requirementsList && course.requirementsList.length > 0 && (
                <div className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 shadow-xs flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-[#161A1D] border-b border-[#1c211b]/10 pb-2.5">
                    پیش‌نیازهای ورود به دوره
                  </h3>
                  <ul className="flex flex-col gap-2 text-xs text-[#5A626A]">
                    {course.requirementsList.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8f6d2f] mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.targetAudienceList && course.targetAudienceList.length > 0 && (
                <div className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 shadow-xs flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-[#161A1D] border-b border-[#1c211b]/10 pb-2.5">
                    مخاطبان این دوره
                  </h3>
                  <ul className="flex flex-col gap-2 text-xs text-[#5A626A]">
                    {course.targetAudienceList.map((aud, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#082719] mt-1.5 shrink-0" />
                        <span>{aud}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructor Profile Card */}
            {course.instructorName && (
              <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[#EDE8DC] overflow-hidden border border-[#1c211b]/10 shrink-0">
                  {course.instructorAvatarUrl ? (
                    <img
                      src={course.instructorAvatarUrl}
                      alt={course.instructorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#082719]">
                      {course.instructorName[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 text-center sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8f6d2f] font-bold">
                    INSTRUCTOR / مدرس دوره
                  </span>
                  <h3 className="font-bold text-base text-[#161A1D]">
                    {course.instructorName}
                  </h3>
                  {course.instructorTitle && (
                    <span className="text-xs text-[#0284c7] font-medium">
                      {course.instructorTitle}
                    </span>
                  )}
                  {course.instructorBio && (
                    <p className="text-xs text-[#5A626A] mt-1 leading-relaxed">
                      {course.instructorBio}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar: Price & Cart Action */}
          <aside className="lg:col-span-4 sticky top-28 flex flex-col gap-4">
            <div className="card-popup rounded-2xl p-6 sm:p-7 bg-white border border-[#1c211b]/12 shadow-xl flex flex-col gap-6">
              {/* Cover Image Thumbnail in Sidebar */}
              {course.coverImageUrl && (
                <div className="rounded-xl overflow-hidden aspect-[16/10] bg-[#16191d] border border-[#1c211b]/10">
                  <img
                    src={course.coverImageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Price / Reservation Box */}
              {isReservation ? (
                <div className="flex flex-col gap-3 border-b border-[#1c211b]/10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#5A626A]">وضعیت دوره:</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      پیش‌ثبت‌نام
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-[#5A626A]">شهریه دوره:</span>
                    <span className="font-mono font-bold text-sm text-[#082719]">
                      پیش‌ثبت‌نام و رزرو رایگان
                    </span>
                  </div>
                  <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-[11px] text-amber-950 leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      این دوره در مرحله پیش‌ثبت‌نام است. می‌توانید با رزرو رایگان، صندلی خود را حفظ کرده و به محض آماده‌شدن جلسات و آغاز دوره مطلع شوید.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline justify-between border-b border-[#1c211b]/10 pb-4">
                  <span className="text-xs font-semibold text-[#5A626A]">شهریه دوره:</span>
                  <div className="flex flex-col items-end">
                    {course.compareAtPrice && course.price != null && course.compareAtPrice > course.price && (
                      <div className="flex items-center gap-2">
                        {discountPercent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            {toPersianDigits(discountPercent)}٪ تخفیف
                          </span>
                        )}
                        <span className="text-xs line-through text-gray-400 font-mono">
                          {formatPrice(course.compareAtPrice)}
                        </span>
                      </div>
                    )}
                    <span className="font-mono font-black text-2xl text-[#082719] mt-0.5">
                      {course.price === 0 || course.price == null ? "رایگان" : formatPrice(course.price)}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary Call to Action */}
              {course.isEnrolled ? (
                <div className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 text-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isReservation
                      ? "شما در این دوره پیش‌ثبت‌نام کرده‌اید (رزرو شده)"
                      : "شما قبلاً در این دوره ثبت‌نام کرده‌اید"}
                  </span>
                </div>
              ) : isReservation ? (
                <button
                  type="button"
                  disabled={reserving}
                  onClick={handleReserve}
                  className="w-full py-4 rounded-xl bg-[#082719] hover:bg-[#162b20] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] disabled:opacity-50 interactive-bump glaze-shimmer"
                >
                  <BookmarkCheck className="w-5 h-5 text-[#dfc79b]" />
                  <span>{reserving ? "در حال ثبت رزرو..." : "رزرو و پیش‌ثبت‌نام در دوره (رایگان)"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isAdding || cartLoading}
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl bg-[#082719] hover:bg-[#162b20] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] disabled:opacity-50 interactive-bump glaze-shimmer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#dfc79b]" />
                  <span>افزودن به سبد خرید و ثبت‌نام</span>
                </button>
              )}

              {/* Guarantee / Value Propositions List */}
              <div className="flex flex-col gap-3 text-xs text-[#5A626A] pt-2 border-t border-[#1c211b]/08">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>دسترسی دائمی و مادام‌العمر به ویدیوها</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>فایل‌ها و پروژه‌های تمرینی پیوست دوره</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8f6d2f] shrink-0" />
                  <span>پشتیبانی فنی توسط تیم کارگاهی هیزو</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>گواهی پایان دوره تخصصی استودیو هیزو</span>
                </div>
              </div>
            </div>

            {/* Back to Catalog Link */}
            <Link
              href="/courses"
              className="text-center text-xs font-semibold text-[#5A626A] hover:text-[#082719] transition-colors py-2"
            >
              ← بازگشت به مشاهده همه دوره‌های آموزشی
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
