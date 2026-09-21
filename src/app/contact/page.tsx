"use client";

import React, { useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    success("پیام شما دریافت شد. همکاران کارگاه در اسرع وقت پاسخ خواهند داد.");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-12">
      {/* Title */}
      <div className="border-b border-[#1c211b]/10 pb-6">
        <span className="font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider mb-1">
          [ CONTACT HIZU ]
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#161A1D]">
          ارتباط با هیزو
        </h1>
        <p className="text-sm text-[#5A626A] mt-1">
          جهت هماهنگی بازدید حضوری، بررسی نقشه‌های صنعتی یا پیگیری سفارش‌ها با
          ما در ارتباط باشید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#0284c7] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5A626A]">
                  ایمیل فنی و دریافت فایل‌:
                </span>
                <p className="font-mono font-bold text-sm text-[#161A1D] dir-ltr text-right mt-0.5">
                  Hizu3dprint@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-[#1c211b]/08 pt-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#0284c7] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5A626A]">تلفن تماس:</span>
                <p className="font-mono font-bold text-sm text-[#161A1D] ![direction:ltr] text-right mt-0.5">
                  +98 990 613 5755
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-[#1c211b]/08 pt-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#0284c7] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5A626A]">نشانی:</span>
                <p className="font-medium text-xs text-[#161A1D] mt-0.5 leading-relaxed">
                  تهران - اندیشه - فاز 3 - مجتمع تجاری بوستان - واحد 34
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-[#1c211b]/08 pt-4">
              <div className="w-10 h-10 rounded-xl bg-[#EDE8DC] flex items-center justify-center text-[#8f6d2f] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5A626A]">ساعات فعالیت:</span>
                <p className="text-xs font-semibold text-[#161A1D] mt-0.5">
                  شنبه تا چهارشنبه: 9:30 الی 20:00 • پنج‌شنبه: 9:00 الی 19:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 card-popup rounded-2xl p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-6">
          <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3">
            ارسال پیام مستقیم
          </h2>

          {sent ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                ✓
              </div>
              <p className="font-bold text-sm text-[#161A1D]">
                پیام شما با موفقیت ارسال شد.
              </p>
              <p className="text-xs text-[#5A626A]">
                سپاس از تماس شما، در اولین فرصت با شما تماس خواهیم گرفت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#161A1D]">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#161A1D]">
                    ایمیل جهت پاسخ *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#161A1D]">
                  متن پیام یا استعلام *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
                  placeholder="موضوع همکاری، سوال یا مشخصات مورد نظر را بنویسید..."
                />
              </div>

              <button
                type="submit"
                className="self-start inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-7 py-3 rounded-full text-xs font-bold shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>ارسال پیام</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
