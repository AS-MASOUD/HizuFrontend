"use client";

import React, { useState, useEffect } from "react";
import { ContactMessage } from "@/types";
import { formatDate } from "@/lib/utils/formatters";
import {
  X,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  Save,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

interface ContactMessageModalProps {
  isOpen: boolean;
  message: ContactMessage | null;
  onClose: () => void;
  onToggleRead: (message: ContactMessage) => Promise<void>;
  onSaveReply: (id: string, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ContactMessageModal({
  isOpen,
  message,
  onClose,
  onToggleRead,
  onSaveReply,
  onDelete,
}: ContactMessageModalProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingRead, setTogglingRead] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (message) {
      setAdminNotes(message.adminNotes || "");
    }
  }, [message]);

  if (!isOpen || !message) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingNotes(true);
      await onSaveReply(message.id, adminNotes);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleToggle = async () => {
    try {
      setTogglingRead(true);
      await onToggleRead(message);
    } finally {
      setTogglingRead(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا از حذف این پیام اطمینان دارید؟")) return;
    try {
      setDeleting(true);
      await onDelete(message.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="card-popup relative w-full max-w-2xl rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#161A1D]">
                جزئیات پیام کاربر
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    message.isRead
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {message.isRead ? "خوانده شده" : "جدید و بررسی‌نشده"}
                </span>
                <span className="text-[11px] text-[#5A626A] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#5A626A]" />
                  {formatDate(message.createdAt)}
                </span>
              </div>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          {/* Sender Information Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#5A626A]">نام فرستنده:</span>
              <span className="font-bold text-sm text-[#161A1D]">
                {message.name}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#5A626A]">ایمیل فرستنده:</span>
              <a
                href={`mailto:${message.email}`}
                className="font-mono text-xs text-[#0284c7] hover:underline flex items-center gap-1.5 dir-ltr text-right"
              >
                <Mail className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span>{message.email}</span>
              </a>
            </div>

            {message.phoneNumber && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-[11px] text-[#5A626A]">شماره تماس:</span>
                <a
                  href={`tel:${message.phoneNumber}`}
                  className="font-mono text-xs text-[#082719] font-bold hover:underline flex items-center gap-1.5 dir-ltr text-right"
                >
                  <Phone className="w-3.5 h-3.5 text-[#082719] shrink-0" />
                  <span>{message.phoneNumber}</span>
                </a>
              </div>
            )}
          </div>

          {/* Subject & Message Content */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-xs text-[#5A626A]">
              {message.subject ? `موضوع: ${message.subject}` : "متن پیام دریافتی:"}
            </span>
            <div className="p-4 rounded-xl bg-white border border-[#1c211b]/15 text-[#161A1D] text-xs leading-relaxed whitespace-pre-wrap shadow-inner font-sans">
              {message.message}
            </div>
          </div>

          {/* Quick Actions (Reply via email) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1c211b]/08">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(
                message.subject
                  ? `پاسخ هیزو: ${message.subject}`
                  : "پاسخ به پیام ارسالی شما در استودیو ساخت هیزو"
              )}`}
              className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-4 py-2 rounded-xl font-bold transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#dfc79b]" />
              <span>پاسخ مستقیم از طریق ایمیل</span>
            </a>

            <button
              type="button"
              onClick={handleToggle}
              disabled={togglingRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1c211b]/15 text-[#161A1D] hover:bg-gray-100 font-semibold transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5A626A]" />
              <span>
                {message.isRead
                  ? "علامت‌گذاری به عنوان خوانده نشده"
                  : "علامت‌گذاری به عنوان خوانده شده"}
              </span>
            </button>
          </div>

          {/* Admin Internal Notes / Follow-up */}
          <form onSubmit={handleSave} className="flex flex-col gap-2 pt-2 border-t border-[#1c211b]/08">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#161A1D] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#8f6d2f]" />
                <span>یادداشت پیگیری مدیر / خلاصه پاسخ ثبت‌شده</span>
              </label>
              {message.repliedAt && (
                <span className="text-[10px] text-[#5A626A]">
                  آخرین ثبت: {formatDate(message.repliedAt)}
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="در صورت تماس با کاربر یا ارسال پاسخ ایمیلی، یادداشت یا شماره پیگیری را اینجا ثبت کنید..."
              className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingNotes}
                className="inline-flex items-center gap-1.5 bg-[#8f6d2f] hover:bg-[#725624] text-white px-4 py-2 rounded-xl font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingNotes ? "در حال ذخیره..." : "ذخیره یادداشت"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#1c211b]/10 bg-[#FAF7F0]">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف پیام</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-gray-300 text-xs font-semibold text-[#5A626A] hover:bg-gray-100 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
