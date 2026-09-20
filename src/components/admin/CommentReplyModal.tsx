"use client";

import React, { useState, useEffect } from "react";
import { ProductComment } from "@/types";
import { X, Send, MessageSquare, Star, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";

interface CommentReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: ProductComment | null;
  onReply: (commentId: string, replyText: string) => Promise<void>;
}

export default function CommentReplyModal({
  isOpen,
  onClose,
  comment,
  onReply,
}: CommentReplyModalProps) {
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (comment) {
      setReplyText(comment.adminReply || "");
    } else {
      setReplyText("");
    }
  }, [comment, isOpen]);

  if (!isOpen || !comment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await onReply(comment.id, replyText.trim());
      onClose();
    } catch (err) {
      // Error handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="card-popup relative w-full max-w-lg rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#161A1D]">پاسخ رسمی ادمین به دیدگاه مشتری</h3>
              <p className="text-[11px] text-[#5A626A]">
                محصول: {comment.productName || "محصول فروشگاه"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#5A626A] hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment Preview */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#161A1D]">{comment.authorName}</span>
                {comment.authorEmail && (
                  <span className="font-mono text-gray-500 text-[11px]">({comment.authorEmail})</span>
                )}
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < comment.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[#161A1D] text-xs leading-relaxed whitespace-pre-line">
              {comment.content}
            </p>
            <span className="text-[10px] text-[#5A626A] text-left dir-ltr">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 font-bold text-[#082719]">
              <ShieldCheck className="w-4 h-4" />
              <span>پاسخ رسمی کارگاه / استودیو هیزو:</span>
            </div>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="پاسخ کارشناسی و فنی خود را برای این دیدگاه بنویسید..."
              className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-gray-300 text-[#5A626A] hover:bg-gray-100 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-6 py-2 rounded-full font-bold shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#dfc79b]" />
                <span>{submitting ? "در حال ثبت..." : "ثبت و انتشار پاسخ"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
