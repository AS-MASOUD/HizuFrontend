"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

function getSafeRedirect(target: string | null): string {
  if (!target) return "/";
  const trimmed = target.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("://") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }
  return "/";
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirect(searchParams.get("redirect"));

  const { register } = useAuth();
  const { error, success } = useToast();

  // User Information Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Submit Registration with static password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      error("لطفاً نام و نام خانوادگی خود را کامل وارد نمایید.");
      return;
    }

    if (!phoneNumber.trim()) {
      error("لطفاً شماره موبایل خود را وارد نمایید.");
      return;
    }

    if (!password.trim() || password.trim().length < 6) {
      error("کلمه عبور باید حداقل 6 کاراکتر باشد.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        password: password.trim(),
      });
      success("حساب کاربری شما با موفقیت ایجاد گردید و وارد شدید.");
      router.push(redirectUrl);
    } catch (err: any) {
      error(err.message || "خطا در ثبت‌نام. لطفاً اطلاعات را بررسی کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="card-popup rounded-2xl p-7 bg-white border border-[#1c211b]/10 flex flex-col gap-6 shadow-xl">
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#082719] flex items-center justify-center text-[#dfc79b] font-mono font-bold text-xl mx-auto mb-3 shadow-md">
            H
          </div>
          <h1 className="text-2xl font-black text-[#161A1D]">عضویت در پلتفرم هیزو</h1>
          <p className="text-xs text-[#5A626A] mt-1">
            ثبت‌نام مستقیم با کلمه عبور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5">
            {/* First Name & Last Name */}
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

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">
                شماره موبایل *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09123456789"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#161A1D]">
                  آدرس ایمیل
                </label>
                <span className="text-[10px] text-[#5A626A] bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  اختیاری
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sohrab@domain.com"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">
                کلمه عبور *
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (حداقل 6 کاراکتر)"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-gray-400 hover:text-[#161A1D] transition-colors p-1 flex items-center justify-center focus:outline-none"
                  title={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                  aria-label={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#5A626A] leading-relaxed">
                از این کلمه عبور برای ورود به حساب کاربری استفاده خواهید کرد.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3.5 rounded-full text-xs font-bold shadow-md transition-all mt-2 disabled:opacity-50 interactive-bump"
          >
            <UserCheck className="w-4 h-4 text-[#dfc79b]" />
            <span>{submitting ? "در حال ایجاد حساب..." : "ثبت‌نام و ورود به هیزو"}</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-[#1c211b]/10 text-center text-xs text-[#5A626A]">
          <span>قبلاً حساب کاربری ساخته‌اید؟ </span>
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-[#082719] hover:underline"
          >
            ورود به حساب
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-6 py-20 text-center text-xs text-[#5A626A]">
          در حال بارگذاری فرم ثبت‌نام...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
