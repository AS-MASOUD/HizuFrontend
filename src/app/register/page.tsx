"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { ArrowLeft, Lock, Mail, User as UserIcon, Phone } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { register } = useAuth();
  const { error, success } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      error("کلمه عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        password,
      });
      success("حساب کاربری شما با موفقیت ایجاد گردید.");
      router.push(redirectUrl);
    } catch (err: any) {
      error(err.message || "خطا در ثبت‌نام.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card-popup rounded-2xl p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-6 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#082719] flex items-center justify-center text-[#dfc79b] font-mono font-bold text-lg mx-auto mb-3 shadow-md">
            H
          </div>
          <h1 className="text-2xl font-black text-[#161A1D]">عضویت در پلتفرم هیزو</h1>
          <p className="text-xs text-[#5A626A] mt-1">
            ایجاد حساب برای سفارش قطعات و پیگیری پروژه‌های مهندسی
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">نام *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="سهراب"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">نام خانوادگی *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="پارسا"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">آدرس ایمیل *</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sohrab@domain.com"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">شماره تماس</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09123456789"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">کلمه عبور (حداقل ۶ کاراکتر) *</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3.5 rounded-full text-xs font-bold shadow-md transition-all mt-2 disabled:opacity-50"
          >
            <span>{submitting ? "در حال ثبت اطلاعات..." : "تکمیل ثبت‌نام"}</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1c211b]/10 text-center text-xs text-[#5A626A]">
          <span>قبلاً حساب کاربری ساخته‌اید؟ </span>
          <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="font-bold text-[#082719] hover:underline">
            ورود به حساب
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-20 text-center text-xs text-[#5A626A]">در حال بارگذاری فرم ثبت‌نام...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
