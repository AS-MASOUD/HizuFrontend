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
  Smartphone,
  KeyRound,
  RotateCcw,
  Sparkles,
  ShieldCheck,
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirect(searchParams.get("redirect"));

  const { user, isAdmin, login, loginWithOtp, sendOtp } = useAuth();
  const { error, success } = useToast();

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  // Mode: 'otp' | 'password'
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");

  // OTP State
  const [otpStep, setOtpStep] = useState<"input" | "verify">("input");
  const [recipient, setRecipient] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  // Password State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianDigits(mins.toString().padStart(2, "0"))}:${toPersianDigits(
      secs.toString().padStart(2, "0")
    )}`;
  };

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = recipient.trim();
    if (!target) {
      error("لطفاً شماره موبایل یا ایمیل خود را وارد فرمایید.");
      return;
    }

    try {
      setOtpSubmitting(true);
      const res = await sendOtp(target, "login");
      if (res.success) {
        success(res.message || "کد تایید با موفقیت ارسال شد.");
        setCountdown(res.resendCooldownSeconds || 60);
        setOtpStep("verify");
      } else {
        error(res.message || "خطا در ارسال کد تایید.");
        if (res.resendCooldownSeconds && res.resendCooldownSeconds > 0) {
          setCountdown(res.resendCooldownSeconds);
          setOtpStep("verify");
        }
      }
    } catch (err: any) {
      error(err.message || "خطا در ارسال کد تایید. لطفاً بررسی کنید.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  // 2. Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      setOtpSubmitting(true);
      const res = await sendOtp(recipient.trim(), "login");
      if (res.success) {
        success("کد تایید جدید ارسال شد.");
        setCountdown(res.resendCooldownSeconds || 60);
      } else {
        error(res.message || "خطا در ارسال مجدد کد.");
      }
    } catch (err: any) {
      error(err.message || "خطا در ارسال مجدد کد تایید.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const isVerifyingRef = useRef(false);

  // 3. Verify OTP and login
  const handleVerifyOtp = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToVerify = (customCode !== undefined ? customCode : otpCode).trim();
    if (!codeToVerify || codeToVerify.length < 5) {
      error("لطفاً کد تایید 5 رقمی را کامل وارد نمایید.");
      isVerifyingRef.current = false;
      return;
    }

    try {
      setOtpSubmitting(true);
      const loggedUser = await loginWithOtp({
        recipient: recipient.trim(),
        code: codeToVerify,
      });
      success("با موفقیت وارد حساب کاربری شدید.");
      const isUserAdmin = loggedUser?.roles?.includes("Admin") || loggedUser?.roles?.includes("SysManager");
      if (isUserAdmin) {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      error(err.message || "کد تایید وارد شده نامعتبر است.");
    } finally {
      setOtpSubmitting(false);
      isVerifyingRef.current = false;
    }
  };

  const handleAutoVerify = (code: string) => {
    if (otpSubmitting || isVerifyingRef.current) return;
    isVerifyingRef.current = true;
    handleVerifyOtp(undefined, code);
  };

  // 4. Password login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPwdSubmitting(true);
      const loggedUser = await login({ email: identifier.trim(), password });
      success("با موفقیت وارد حساب کاربری شدید.");
      const isUserAdmin = loggedUser?.roles?.includes("Admin") || loggedUser?.roles?.includes("SysManager");
      if (isUserAdmin) {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      error(err.message || "ایمیل، شماره تماس یا کلمه عبور اشتباه است.");
    } finally {
      setPwdSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-16 pb-20">
      <div className="card-popup rounded-2xl p-7 bg-white border border-[#1c211b]/10 flex flex-col gap-6 shadow-xl">
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#082719] flex items-center justify-center text-[#dfc79b] font-mono font-bold text-xl mx-auto mb-3 shadow-md">
            H
          </div>
          <h1 className="text-2xl font-black text-[#161A1D]">ورود به حساب کاربری هیزو</h1>
          <p className="text-xs text-[#5A626A] mt-1">
            برای ثبت سفارش، مشاهده فاکتورها و پیگیری ساخت وارد شوید.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode("otp")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "otp"
                ? "bg-[#082719] text-[#dfc79b] shadow-sm"
                : "text-[#5A626A] hover:text-[#161A1D]"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>کد یک‌بار مصرف (پیامک)</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "password"
                ? "bg-[#082719] text-[#dfc79b] shadow-sm"
                : "text-[#5A626A] hover:text-[#161A1D]"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>کلمه عبور</span>
          </button>
        </div>

        {/* ---------------- OTP LOGIN TAB ---------------- */}
        {authMode === "otp" && (
          <div className="flex flex-col gap-4">
            {otpStep === "input" ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#161A1D]">
                    شماره موبایل یا ایمیل
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="09123456789 یا name@example.com"
                      className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-[#5A626A]">
                    کد تایید 5 رقمی به این شماره یا ایمیل ارسال خواهد شد.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={otpSubmitting || !recipient.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all mt-1 disabled:opacity-50"
                >
                  <span>{otpSubmitting ? "در حال ارسال کد..." : "دریافت کد تایید ورود"}</span>
                  <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#1c211b]/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#161A1D]">
                    <ShieldCheck className="w-4 h-4 text-[#082719]" />
                    <span>
                      کد به <strong className="font-mono">{recipient}</strong> ارسال شد.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep("input");
                      setOtpCode("");
                    }}
                    className="text-[#082719] font-bold underline hover:text-[#2d5a3e]"
                  >
                    ویرایش
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#161A1D]">
                      کد تایید 5 رقمی
                    </label>
                    <span className="text-[11px] text-[#5A626A] font-mono">
                      5 رقم
                    </span>
                  </div>
                  <OtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={handleAutoVerify}
                    length={5}
                    disabled={otpSubmitting}
                    autoFocus
                  />
                </div>

                {/* Resend OTP & Countdown */}
                <div className="flex items-center justify-between text-xs text-[#5A626A] mt-1">
                  {countdown > 0 ? (
                    <span className="flex items-center gap-1 font-mono">
                      ارسال مجدد تا {formatTimer(countdown)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={otpSubmitting}
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-1.5 text-[#082719] font-bold hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ارسال مجدد کد تایید</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otpSubmitting || otpCode.trim().length < 5}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all mt-1 disabled:opacity-50 interactive-bump"
                >
                  <span>{otpSubmitting ? "در حال اعتبارسنجی..." : "تایید و ورود به حساب"}</span>
                  <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ---------------- PASSWORD LOGIN TAB ---------------- */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">
                ایمیل یا شماره موبایل
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@hizu.ir یا 09123456789"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">کلمه عبور</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={pwdSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all mt-2 disabled:opacity-50"
            >
              <span>{pwdSubmitting ? "در حال ورود..." : "ورود به حساب"}</span>
              <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
            </button>

          </form>
        )}

        {/* Footer Navigation Link */}
        <div className="pt-4 border-t border-[#1c211b]/10 text-center text-xs text-[#5A626A]">
          <span>حساب کاربری ندارید؟ </span>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-bold text-[#082719] hover:underline"
          >
            ثبت‌نام
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-6 py-20 text-center text-xs text-[#5A626A]">
          در حال بارگذاری فرم ورود...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
