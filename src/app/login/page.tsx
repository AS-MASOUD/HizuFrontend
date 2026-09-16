"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { ArrowLeft, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const { error, success } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      success("با موفقیت وارد حساب کاربری شدید.");
      router.push(redirectUrl);
    } catch (err: any) {
      error(err.message || "ایمیل یا کلمه عبور اشتباه است.");
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
          <h1 className="text-2xl font-black text-[#161A1D]">ورود به حساب کاربری هیزو</h1>
          <p className="text-xs text-[#5A626A] mt-1">
            برای ثبت سفارش، مشاهده فاکتورها و پیگیری ساخت وارد شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">آدرس ایمیل</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">کلمه عبور</label>
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
            className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3 rounded-full text-xs font-bold shadow-md transition-all mt-2 disabled:opacity-50"
          >
            <span>{submitting ? "در حال ورود..." : "ورود به حساب"}</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1c211b]/10 text-center text-xs text-[#5A626A]">
          <span>حساب کاربری ندارید؟ </span>
          <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="font-bold text-[#082719] hover:underline">
            ثبت‌نام در هیزو
          </Link>
        </div>

        <div className="p-3 bg-[#FAF7F0] rounded-xl text-[11px] text-[#5A626A] text-center border border-[#1c211b]/08">
          حساب آزمایشی ادمین: <code className="font-mono text-[#082719] font-bold">admin@hizu.ir</code> / <code className="font-mono text-[#082719]">Admin123!</code>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-20 text-center text-xs text-[#5A626A]">در حال بارگذاری فرم ورود...</div>}>
      <LoginForm />
    </Suspense>
  );
}
