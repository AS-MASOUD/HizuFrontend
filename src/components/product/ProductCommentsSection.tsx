"use client";

import React, { useState, useEffect } from "react";
import { ProductComment } from "@/types";
import { productsApi } from "@/lib/api/products";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import {
  MessageSquare,
  Star,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatDate, toPersianDigits } from "@/lib/utils/formatters";

interface ProductCommentsSectionProps {
  productId: string;
  productName: string;
}

export default function ProductCommentsSection({
  productId,
  productName,
}: ProductCommentsSectionProps) {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [comments, setComments] = useState<ProductComment[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setAuthorName(user.fullName || `${user.firstName} ${user.lastName}`.trim());
      setAuthorEmail(user.email || "");
    }
  }, [user]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await productsApi.getComments(productId);
      setComments(res.comments || []);
      setAvgRating(res.averageRating || 5);
      setTotalComments(res.totalComments || 0);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      toastError("لطفاً نام و متن نظر را وارد فرمایید.");
      return;
    }

    try {
      setSubmitting(true);
      await productsApi.submitComment(productId, {
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        content: content.trim(),
        rating,
      });

      setSubmittedNotice(true);
      setContent("");
      toastSuccess("نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیر در سایت نمایش داده خواهد شد.");
    } catch (err: any) {
      toastError(err.message || "خطا در ثبت نظر.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-popup rounded-2xl p-6 sm:p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c211b]/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="font-black text-xl text-[#161A1D]">
              نظرات و بازخورد مشتریان
            </h2>
          </div>
          <p className="text-xs text-[#5A626A] mt-1">
            دیدگاه‌های تایید شده توسط کارشناسان استودیو هیزو پیرامون {productName}
          </p>
        </div>

        {totalComments > 0 && (
          <div className="flex items-center gap-3 bg-[#FAF7F0] px-4 py-2 rounded-xl border border-[#1c211b]/10">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono font-bold text-sm text-[#082719]">
              {toPersianDigits(avgRating)} از ۵
            </span>
            <span className="text-[11px] text-[#5A626A]">
              ({toPersianDigits(totalComments)} دیدگاه ثبت‌شده)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Comments List (Approved only) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {loading ? (
            <div className="py-12 text-center font-mono text-xs text-[#5A626A] animate-pulse">
              LOADING REVIEWS...
            </div>
          ) : comments.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3 bg-[#FAF7F0] rounded-2xl border border-[#1c211b]/08 p-6">
              <MessageSquare className="w-8 h-8 text-gray-300" />
              <p className="text-xs text-[#5A626A] font-medium">
                هنوز دیدگاه تایید شده‌ای برای این قطعه ثبت نشده است.
              </p>
              <span className="text-[11px] text-[#8f6d2f]">
                اولین کاربری باشید که نظر خود را درباره این محصول ثبت می‌کند!
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl p-5 bg-[#FAF7F0]/60 border border-[#1c211b]/10 flex flex-col gap-3"
                >
                  {/* Author & Rating */}
                  <div className="flex items-center justify-between border-b border-[#1c211b]/08 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold text-xs">
                        {c.authorName.charAt(0)}
                      </div>
                      <span className="font-bold text-xs text-[#161A1D]">{c.authorName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < c.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#5A626A]">{formatDate(c.createdAt)}</span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-[#161A1D] leading-relaxed whitespace-pre-line">
                    {c.content}
                  </p>

                  {/* Official Admin Reply (Strictly Admin only, no user-to-user replies) */}
                  {c.adminReply && (
                    <div className="mt-2 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col gap-1.5 mr-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>پاسخ استودیو هیزو (ادمین فنی)</span>
                        </div>
                        {c.adminRepliedAt && (
                          <span className="text-[10px] text-emerald-700/80">
                            {formatDate(c.adminRepliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-line">
                        {c.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Submission Form */}
        <div className="lg:col-span-5 bg-[#FAF7F0] p-6 rounded-2xl border border-[#1c211b]/10 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#161A1D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8f6d2f]" />
              <span>ثبت دیدگاه و تجربه کاربری</span>
            </h3>
            <p className="text-[11px] text-[#5A626A] mt-1">
              تجربه استفاده و بازخورد فنی خود را درباره این محصول با دیگران به اشتراک بگذارید.
            </p>
          </div>

          {submittedNotice && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                دیدگاه شما دریافت شد و پس از بررسی و تایید مدیریت در این بخش منتشر خواهد شد.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
            {/* Rating Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">امتیاز شما به کیفیت قطعه:</label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          starVal <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="font-mono font-bold text-xs text-[#082719] mr-2">
                  {toPersianDigits(rating)} ستاره
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="مثلاً: مهندس رضایی"
                  className="w-full bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">ایمیل (اختیاری)</label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">متن دیدگاه یا پرسش شما *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="در مورد کیفیت متریال، صلبیت، دقت ابعادی یا کاربرد مد نظرتان بنویسید..."
                className="w-full bg-white border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#5A626A] pt-1">
              <Clock className="w-3.5 h-3.5 text-[#8f6d2f] shrink-0" />
              <span>دیدگاه‌ها پس از تایید توسط ادمین در سایت نمایش داده می‌شوند.</span>
            </div>

            <button
              type="submit"
              disabled={submitting || !content.trim() || !authorName.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full font-bold shadow-md transition-all mt-1 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#dfc79b]" />
              <span>{submitting ? "در حال ارسال..." : "ثبت دیدگاه برای بررسی"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
