"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  createdAt: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Intelligent English-to-Persian translator & sanitizer for toast notifications.
 * Ensures that network errors, backend exceptions, or generic status texts
 * are always presented to the user in fluent Persian.
 */
function toPersianMessage(message?: string, type: ToastType = "info"): string {
  if (!message || !message.trim()) {
    switch (type) {
      case "success":
        return "عملیات مورد نظر با موفقیت انجام گردید.";
      case "error":
        return "خطایی در انجام عملیات رخ داد. لطفاً مجدداً تلاش کنید.";
      case "warning":
        return "لطفاً به پیام و موارد خواسته شده توجه فرمایید.";
      case "info":
        return "پیام جدیدی از سیستم ثبت گردید.";
    }
  }

  const trimmed = message.trim();

  // Common network & HTTP errors
  if (/failed to fetch|network\s*error|load failed/i.test(trimmed)) {
    return "خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی نمایید.";
  }
  if (/timeout|timed out/i.test(trimmed)) {
    return "مهلت زمان پاسخ‌گویی به پایان رسید. لطفاً مجدداً تلاش فرمایید.";
  }
  if (/unauthorized|status code 401/i.test(trimmed)) {
    return "نشست کاربری شما پایان یافته است. لطفاً مجدداً وارد حساب شوید.";
  }
  if (/forbidden|status code 403/i.test(trimmed)) {
    return "شما دسترسی مجاز برای انجام این عملیات را ندارید.";
  }
  if (/not found|status code 404/i.test(trimmed)) {
    return "مورد درخواستی در سرور یافت نشد.";
  }
  if (/internal server error|status code 500/i.test(trimmed)) {
    return "خطای داخلی سرور رخ داد. تیم فنی در حال بررسی مشکل است.";
  }
  if (/bad request|status code 400/i.test(trimmed)) {
    return "اطلاعات ارسالی نامعتبر است. لطفاً مقادیر وارد شده را بررسی فرمایید.";
  }

  // Common ASP.NET & domain messages
  if (/one or more validation (errors|failures) have occurred/i.test(trimmed)) {
    return "یک یا چند مورد از اطلاعات ارسالی نامعتبر است. لطفاً فرم را بررسی کنید.";
  }
  if (/cannot add .* available stock/i.test(trimmed)) {
    return "تعداد درخواستی بیشتر از موجودی انبار است.";
  }
  if (/requested quantity .* exceeds available stock/i.test(trimmed)) {
    return "تعداد درخواستی فراتر از موجودی انبار این محصول است.";
  }
  if (/insufficient stock/i.test(trimmed)) {
    return "موجودی انبار برای این محصول کافی نیست.";
  }
  if (/cannot delete category that contains products/i.test(trimmed)) {
    return "امکان حذف دسته‌بندی دارای محصول وجود ندارد.";
  }
  if (/entity .* was not found/i.test(trimmed)) {
    return "مورد درخواستی در سامانه یافت نشد.";
  }

  return trimmed;
}

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: "موفقیت‌آمیز",
  error: "خطا در عملیات",
  warning: "توجه و هشدار",
  info: "اطلاعیه استودیو هیزو",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const persianMsg = toPersianMessage(message, type);
      const displayTitle = title?.trim() || DEFAULT_TITLES[type];
      const duration = type === "error" ? 5000 : 4000;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title: displayTitle,
          message: persianMsg,
          duration,
          createdAt: Date.now(),
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string, title?: string) => showToast(msg, "success", title),
    [showToast]
  );
  const error = useCallback(
    (msg: string, title?: string) => showToast(msg, "error", title),
    [showToast]
  );
  const warning = useCallback(
    (msg: string, title?: string) => showToast(msg, "warning", title),
    [showToast]
  );
  const info = useCallback(
    (msg: string, title?: string) => showToast(msg, "info", title),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Notification Container */}
      <aside
        aria-live="polite"
        aria-label="اعلان‌های سیستم"
        className="fixed bottom-5 left-4 sm:left-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";

          return (
            <div
              key={toast.id}
              role="alert"
              dir="rtl"
              className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border-2 transition-all duration-300 transform translate-y-0 ${
                isSuccess
                  ? "bg-gradient-to-br from-[#062c19]/95 via-[#0b3d24]/95 to-[#052615]/95 text-white border-emerald-500/80 shadow-[0_12px_36px_-4px_rgba(16,185,129,0.38)]"
                  : isError
                  ? "bg-gradient-to-br from-[#2f0b10]/95 via-[#4a1219]/95 to-[#24080c]/95 text-white border-rose-500/85 shadow-[0_12px_36px_-4px_rgba(244,63,94,0.42)]"
                  : isWarning
                  ? "bg-gradient-to-br from-[#2c1906]/95 via-[#42260a]/95 to-[#221304]/95 text-amber-50 border-amber-500/80 shadow-[0_12px_36px_-4px_rgba(245,158,11,0.35)]"
                  : "bg-gradient-to-br from-[#081f38]/95 via-[#0e2f54]/95 to-[#07192d]/95 text-sky-50 border-sky-500/80 shadow-[0_12px_36px_-4px_rgba(14,165,233,0.35)]"
              }`}
            >
              {/* Colored Side Bar Accent */}
              <div
                className={`absolute top-0 right-0 bottom-0 w-1.5 ${
                  isSuccess
                    ? "bg-emerald-400"
                    : isError
                    ? "bg-rose-500"
                    : isWarning
                    ? "bg-amber-400"
                    : "bg-sky-400"
                }`}
              />

              <div className="flex items-start justify-between gap-3 pr-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Colored Icon Badge */}
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 border shadow-inner ${
                      isSuccess
                        ? "bg-emerald-500/25 border-emerald-400/40 text-emerald-300"
                        : isError
                        ? "bg-rose-500/25 border-rose-400/40 text-rose-300"
                        : isWarning
                        ? "bg-amber-500/25 border-amber-400/40 text-amber-300"
                        : "bg-sky-500/25 border-sky-400/40 text-sky-300"
                    }`}
                  >
                    {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                    {isError && <XCircle className="w-5 h-5 text-rose-300" />}
                    {isWarning && <AlertTriangle className="w-5 h-5 text-amber-300" />}
                    {toast.type === "info" && <Info className="w-5 h-5 text-sky-300" />}
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isSuccess
                          ? "text-emerald-300"
                          : isError
                          ? "text-rose-300"
                          : isWarning
                          ? "text-amber-300"
                          : "text-sky-300"
                      }`}
                    >
                      {toast.title}
                    </span>
                    <p className="text-xs sm:text-[13px] font-medium leading-relaxed text-white/95 break-words">
                      {toast.message}
                    </p>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  title="بستن اعلان"
                  aria-label="بستن اعلان"
                  className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Duration Countdown Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                <div
                  className={`h-full origin-right transition-all linear ${
                    isSuccess
                      ? "bg-emerald-400"
                      : isError
                      ? "bg-rose-400"
                      : isWarning
                      ? "bg-amber-400"
                      : "bg-sky-400"
                  }`}
                  style={{
                    animation: `toast-progress ${toast.duration || 4000}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
