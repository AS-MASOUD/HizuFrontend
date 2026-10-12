"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import {
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils/formatters";
import { OtpInput } from "@/components/ui/OtpInput";

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

  const { register, sendOtp } = useAuth();
  const { error, success } = useToast();

  // 1. User Information Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2. OTP Verification Fields & State
  const [otpCode, setOtpCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianDigits(mins.toString().padStart(2, "0"))}:${toPersianDigits(
      secs.toString().padStart(2, "0")
    )}`;
  };

  // Send OTP
  const handleSendCode = async () => {
    const phone = phoneNumber.trim();
    if (!firstName.trim() || !lastName.trim()) {
      error("لطفاً ابتدا نام و نام خانوادگی خود را وارد فرمایید.");
      return;
    }
    if (!phone) {
      error("لطفاً شماره موبایل خود را وارد نمایید.");
      return;
    }
    if (password.trim() && password.trim().length < 6) {
      error("کلمه عبور در صورت تعیین باید حداقل 6 کاراکتر باشد.");
      return;
    }

    try {
      setSendingCode(true);
      const res = await sendOtp(phone, "register");
      if (res.success) {
        success(res.message || "کد تایید پیامکی با موفقیت ارسال گردید.");
        setCodeSent(true);
        setCountdown(res.resendCooldownSeconds || 60);
      } else {
        error(res.message || "خطا در ارسال کد تایید.");
        if (res.resendCooldownSeconds && res.resendCooldownSeconds > 0) {
          setCodeSent(true);
          setCountdown(res.resendCooldownSeconds);
        }
      }
    } catch (err: any) {
      error(err.message || "خطا در ارسال کد تایید. لطفاً بررسی کنید.");
    } finally {
      setSendingCode(false);
    }
  };

  const isVerifyingRef = useRef(false);

  // 3. Final Register Submission
  const handleRegisterSubmit = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      error("لطفاً نام و نام خانوادگی خود را کامل وارد نمایید.");
      isVerifyingRef.current = false;
      return;
    }

    if (!phoneNumber.trim()) {
      error("لطفاً شماره موبایل خود را وارد نمایید.");
      isVerifyingRef.current = false;
      return;
    }

    if (!codeSent) {
      error("لطفاً ابتدا دکمه «دریافت کد تایید» را انتخاب کنید.");
      isVerifyingRef.current = false;
      return;
    }

    const codeToVerify = (customCode !== undefined ? customCode : otpCode).trim();
    if (!codeToVerify || codeToVerify.length < 5) {
      error("لطفاً کد تایید 5 رقمی دریافتی را وارد فرمایید.");
      isVerifyingRef.current = false;
      return;
    }

    if (password.trim() && password.trim().length < 6) {
      error("کلمه عبور در صورت تعیین باید حداقل 6 کاراکتر باشد.");
      isVerifyingRef.current = false;
      return;
    }

    try {
      setSubmitting(true);
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        password: password.trim() || undefined,
        otpCode: codeToVerify,
      });
      success("حساب کاربری شما با موفقیت ایجاد گردید و وارد شدید.");
      router.push(redirectUrl);
    } catch (err: any) {
      error(err.message || "کد تایید اشتباه یا منقضی شده است.");
    } finally {
      setSubmitting(false);
      isVerifyingRef.current = false;
    }
  };

  const handleAutoRegister = (code: string) => {
    if (submitting || isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    handleRegisterSubmit(undefined, code);
  };

  const handleSubmit = handleRegisterSubmit;

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
            ثبت‌نام سریع با پیامک تایید • بدون نیاز اجباری به رمز عبور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ================= SECTION 1: USERS INFORMATION ================= */}
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
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    // If phone number changes after code was sent, allow getting new code
                    if (codeSent) {
                      setCodeSent(false);
                      setOtpCode("");
                    }
                  }}
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

            {/* Password (Optional) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#161A1D]">
                  کلمه عبور
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  اختیاری
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (در صورت تمایل حداقل 6 کاراکتر)"
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
                تعیین رمز عبور اختیاری است؛ شما همیشه می‌توانید با کد پیامکی یک‌بار مصرف وارد شوید.
              </p>
            </div>
          </div>

          {/* ================= SECTION 2: GET THE CODE BUTTON ================= */}
          <div className="pt-2 border-t border-[#1c211b]/10 flex flex-col gap-3">
            {!codeSent ? (
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || !phoneNumber.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4 text-[#dfc79b]" />
                <span>{sendingCode ? "در حال ارسال کد تایید..." : "دریافت کد تایید پیامکی"}</span>
              </button>
            ) : (
              <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#1c211b]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#161A1D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    کد تایید به <strong className="font-mono">{phoneNumber}</strong> ارسال شد.
                  </span>
                </div>
                {countdown > 0 ? (
                  <span className="font-mono text-[11px] text-[#5A626A] bg-white px-2 py-1 rounded-lg border border-[#1c211b]/10">
                    {formatTimer(countdown)}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={sendingCode}
                    onClick={handleSendCode}
                    className="inline-flex items-center gap-1 text-[#082719] font-bold hover:underline text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ارسال مجدد</span>
                  </button>
                )}
              </div>
            )}

            {/* ================= SECTION 3: RECIEVED CODE INPUT ================= */}
            {codeSent && (
              <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#161A1D] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#082719]" />
                      <span>کد تایید 5 رقمی دریافتی *</span>
                    </label>
                    <span className="text-[11px] text-[#5A626A] font-mono">
                      5 رقم
                    </span>
                  </div>
                  <OtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={handleAutoRegister}
                    length={5}
                    disabled={submitting}
                    autoFocus
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || otpCode.trim().length < 5}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3.5 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50 interactive-bump"
                >
                  <span>{submitting ? "در حال فعال‌سازی حساب..." : "تکمیل ثبت‌نام و ورود به هیزو"}</span>
                  <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
                </button>
              </div>
            )}
          </div>
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
