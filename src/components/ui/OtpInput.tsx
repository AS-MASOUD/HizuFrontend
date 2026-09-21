"use client";

import React, { useRef, useState, useEffect } from "react";
import { toEnglishDigits } from "@/lib/utils/formatters";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 5,
  disabled = false,
  autoFocus = true,
  className = "",
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = toEnglishDigits(raw).replace(/\D/g, "").slice(0, length);
    onChange(cleaned);

    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const cleaned = toEnglishDigits(pastedData).replace(/\D/g, "").slice(0, length);
    onChange(cleaned);

    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center justify-center gap-2 sm:gap-3 py-1 dir-ltr cursor-pointer select-none ${className}`}
      dir="ltr"
    >
      {/* Invisible actual input handling all native typing, SMS autofill & keyboard actions */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={length}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        aria-label={`کد تایید ${length} رقمی`}
      />

      {/* 5 Distinct architectural slot boxes */}
      {Array.from({ length }).map((_, idx) => {
        const digit = value[idx] || "";
        const isCurrent =
          isFocused &&
          (idx === value.length || (idx === length - 1 && value.length === length));

        return (
          <div
            key={idx}
            className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-mono font-bold transition-all duration-200 ${
              isCurrent
                ? "border-[#082719] bg-white ring-4 ring-[#082719]/10 shadow-sm scale-102"
                : digit
                ? "border-[#082719]/30 bg-white text-[#161A1D] shadow-xs"
                : "border-[#1c211b]/15 bg-[#FAF7F0] text-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
          >
            {digit ? (
              <span className="text-[#161A1D] animate-in zoom-in-75 duration-150">
                {digit}
              </span>
            ) : isCurrent ? (
              <span className="w-0.5 h-6 bg-[#082719] animate-pulse rounded-full" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#1c211b]/20" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OtpInput;
