"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { toPersianDigits } from "@/lib/utils/formatters";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/shop", label: "فروشگاه و قطعات" },
    { href: "/special-orders", label: "سفارش ساخت فوری" },
    { href: "/about", label: "درباره هیزو" },
    { href: "/contact", label: "تماس با کارگاه" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#1c211b]/10 shadow-[0_4px_24px_rgba(28,33,27,0.06)]">
      <div className="max-w-7xl mx-auto h-20 px-6 sm:px-8 flex items-center justify-between gap-6">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#082719] flex items-center justify-center p-2 shadow-md border border-[#082719]/20 transition-transform group-hover:scale-105 text-[#dfc79b] font-mono font-bold text-lg">
              <img
                src="/Hizu-logo.svg"
                alt="هیزو"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#161A1D]">
                هیزو
              </span>
              <span className="font-mono text-[9px] text-[#5A626A] tracking-widest uppercase">
                FABRICATION LAB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 pr-6 border-r border-[#1c211b]/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    isActive
                      ? "text-[#082719] bg-[#EDE8DC] border border-[#1c211b]/10 shadow-sm"
                      : "text-[#5A626A] hover:text-[#161A1D] hover:bg-[#EDE8DC]/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>پنل ادمین</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Search, Cart, Account, CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-[#F3EFE6] border border-[#1c211b]/10 rounded-full px-3.5 py-1.5 text-xs text-[#5A626A] shadow-inner focus-within:border-[#0284c7] transition-colors"
          >
            <Search className="w-4 h-4 text-[#0284c7] ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی متریال یا سرویس..."
              className="bg-transparent border-0 p-0 text-xs text-[#161A1D] placeholder-[#5A626A]/70 focus:outline-none focus:ring-0 w-32 xl:w-44"
            />
          </form>

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full hover:bg-[#EDE8DC]/70 border border-transparent hover:border-[#1c211b]/10 transition-colors text-[#161A1D]"
            title="سبد خرید"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-[#dfc79b]/40">
                {toPersianDigits(itemCount)}
              </span>
            )}
          </Link>

          {/* Account Profile Link */}
          {isAuthenticated ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDE8DC] border border-[#1c211b]/10 text-xs font-bold text-[#161A1D] hover:bg-[#dfc79b]/40 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#082719]" />
              <span className="hidden sm:inline">
                {user?.firstName || "حساب من"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1c211b]/15 text-xs font-semibold text-[#161A1D] hover:bg-[#EDE8DC] transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#5A626A]" />
              <span>ورود / ثبت‌نام</span>
            </Link>
          )}

          {/* Custom Order CTA Button */}
          <Link
            href="/special-orders"
            className="hidden sm:inline-flex items-center gap-2 bg-[#1f3d2e] hover:bg-[#162b20] text-[#FCF9F1] px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-[1.02] shadow-sm border border-[#1f3d2e]/40"
          >
            <span>ثبت سفارش / استعلام قیمت</span>
            <ArrowLeft className="w-4 h-4 text-[#FCF9F1]" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#161A1D] hover:bg-[#EDE8DC] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1c211b]/10 bg-[#FFFFFF] px-6 py-6 flex flex-col gap-4 shadow-xl">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#F3EFE6] border border-[#1c211b]/10 rounded-full px-3.5 py-2 text-xs"
          >
            <Search className="w-4 h-4 text-[#0284c7] ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصول یا سرویس..."
              className="bg-transparent border-0 p-0 text-xs text-[#161A1D] focus:outline-none w-full"
            />
          </form>
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl"
              >
                پنل مدیریت ادمین
              </Link>
            )}
            <Link
              href="/special-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center bg-[#1f3d2e] text-[#FCF9F1] py-3 rounded-full text-xs font-bold shadow-md"
            >
              ثبت سفارش / شروع پروژه
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
