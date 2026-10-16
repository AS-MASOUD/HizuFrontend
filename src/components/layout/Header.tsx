"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Layers,
  Wrench,
  Sparkles,
  Cog,
  Scan,
  MapPin,
  LayoutGrid,
  GraduationCap,
  GitCompare,
  ChevronLeft,
  Printer,
  Cpu,
  Zap,
  Box,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { useCompare } from "@/providers/CompareProvider";
import { toPersianDigits } from "@/lib/utils/formatters";

import { categoriesApi } from "@/lib/api/categories";
import { Category } from "@/types";

function getCategoryIcon(slug: string, name = ""): React.ReactNode {
  const s = (slug + " " + name).toLowerCase();
  if (s.includes("3d") || s.includes("print") || s.includes("پرینت") || s.includes("اسکن")) {
    return <Layers className="w-4 h-4 text-[#0284c7]" />;
  }
  if (s.includes("cnc") || s.includes("machin") || s.includes("فرز") || s.includes("تراش") || s.includes("ماشین")) {
    return <Wrench className="w-4 h-4 text-[#8f6d2f]" />;
  }
  if (s.includes("laser") || s.includes("لیزر") || s.includes("برش") || s.includes("حکاکی")) {
    return <Sparkles className="w-4 h-4 text-[#0284c7]" />;
  }
  if (s.includes("tool") || s.includes("ابزار") || s.includes("تجهیز") || s.includes("لوازم")) {
    return <Package className="w-4 h-4 text-[#8f6d2f]" />;
  }
  if (s.includes("robot") || s.includes("مکاترونیک") || s.includes("ربات") || s.includes("الکترونیک")) {
    return <Cpu className="w-4 h-4 text-[#082719]" />;
  }
  if (s.includes("filam") || s.includes("فیلامنت") || s.includes("رزین") || s.includes("resin") || s.includes("مواد")) {
    return <Box className="w-4 h-4 text-[#0284c7]" />;
  }
  if (s.includes("سفارش") || s.includes("خدمات") || s.includes("service")) {
    return <Zap className="w-4 h-4 text-[#8f6d2f]" />;
  }
  return <Cog className="w-4 h-4 text-[#5A626A]" />;
}

interface SubCategoryItem {
  title: string;
  desc: string;
  slug?: string;
  href?: string;
  icon: React.ReactNode;
}

interface MainCategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  defaultSlug?: string;
  items: SubCategoryItem[];
}

const defaultCategoryGroups: MainCategoryGroup[] = [
  {
    id: "industrial-machines",
    title: "دستگاه‌های صنعتی",
    subtitle: "پرینترهای سه‌بعدی، برش لیزر و CNC کارگاهی",
    icon: <Printer className="w-4 h-4 text-[#0284c7]" />,
    badge: "تخصصی",
    defaultSlug: "3d-printing",
    items: [
      {
        title: "پرینتر سه بعدی",
        desc: "پرینترهای صنعتی دقیق FDM، رزینی SLA و نایلون کربن SLS",
        slug: "3d-printing",
        icon: <Layers className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "دستگاه برش لیزر",
        desc: "برش و حکاکی فایبر و CO2 انواع ورق‌های فلزی، استیل، چوب و پلکسی",
        slug: "laser-cutting",
        icon: <Sparkles className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "دستگاه فرز و CNC",
        desc: "ماشین‌کاری ۳ و ۵ محوره فلزات سبک، برنج، چوب و قالب‌های صنعتی",
        slug: "cnc-machining",
        icon: <Wrench className="w-4 h-4 text-[#8f6d2f]" />,
      },
      {
        title: "دستگاه اسکنر سه بعدی",
        desc: "اسکنرهای نوری و لیزری صنعتی با دقت بالا جهت مهندسی معکوس",
        slug: "3d-printing",
        icon: <Scan className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "تجهیزات و ابزار دقیق",
        desc: "واحدهای شستشو، کیورینگ اشعه UV، کالیبراسیون و کنترل ابعادی",
        slug: "tools-accessories",
        icon: <Cog className="w-4 h-4 text-[#5A626A]" />,
      },
    ],
  },
  {
    id: "workshop-services",
    title: "خدمات کارگاهی و ساخت",
    subtitle: "پرینت سفارشی، برش لیزر، فرزکاری و طراحی CAD",
    icon: <Cpu className="w-4 h-4 text-[#082719]" />,
    defaultSlug: "3d-printing",
    items: [
      {
        title: "خدمات پرینت سه‌بعدی صنعتی",
        desc: "نمونه‌سازی سریع و تولید قطعات نهایی با پلیمرهای مقاوم مهندسی",
        slug: "3d-printing",
        icon: <Layers className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "خدمات برش و حکاکی لیزری",
        desc: "برش فوق‌سریع ورق‌های فولادی، آلومینیوم، پلکسی و ام‌دی‌اف",
        slug: "laser-cutting",
        icon: <Sparkles className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "ماشین‌کاری قطعات CNC",
        desc: "فرزکاری قطعات آلومینیوم هوایی 7075 و شمش برنج با تلورانس دقیق",
        slug: "cnc-machining",
        icon: <Wrench className="w-4 h-4 text-[#8f6d2f]" />,
      },
      {
        title: "طراحی صنعتی و مهندسی معکوس",
        desc: "مدل‌سازی تخصصی CAD/CAM، بهینه‌سازی توپولوژی و محاسبات مکانیکی",
        href: "/services",
        icon: <Zap className="w-4 h-4 text-[#8f6d2f]" />,
      },
    ],
  },
  {
    id: "tools-accessories",
    title: "ابزارآلات و ملزومات",
    subtitle: "ابزارهای اندازه‌گیری، تجهیزات کارگاه و اکسسوری",
    icon: <Package className="w-4 h-4 text-[#8f6d2f]" />,
    defaultSlug: "tools-accessories",
    items: [
      {
        title: "اکسسوری و تجهیزات رومیزی",
        desc: "کیس‌های مکانیکال، پایه‌های ارگونومیک مانیتور و المان‌های کارگاهی",
        slug: "tools-accessories",
        icon: <Package className="w-4 h-4 text-[#8f6d2f]" />,
      },
      {
        title: "ابزارهای اندازه‌گیری دقیق",
        desc: "کولیس‌های دیجیتال، میکرومتر دقیق و گیج‌های تلورانس صنعتی",
        slug: "tools-accessories",
        icon: <SlidersHorizontal className="w-4 h-4 text-[#8f6d2f]" />,
      },
      {
        title: "تیغه‌ها و ابزار فرزکاری CNC",
        desc: "اندمیل‌های کاربایدی، تیغه‌های روکش‌دار تیتانیوم و متعلقات ابزارگیر",
        slug: "cnc-machining",
        icon: <Wrench className="w-4 h-4 text-[#5A626A]" />,
      },
    ],
  },
  {
    id: "custom-parts",
    title: "قطعات مکاترونیک و رباتیک",
    subtitle: "شاسی‌های ربات، گریپر، بازوهای مکانیکی و چرخ‌دنده",
    icon: <Cog className="w-4 h-4 text-[#5A626A]" />,
    defaultSlug: "custom-parts",
    items: [
      {
        title: "گریپرهای رباتیک و اتصالات",
        desc: "گریپرهای سبک‌سازی شده مهندسی، براکت‌ها و لینک‌های حرکتی",
        slug: "custom-parts",
        icon: <Cog className="w-4 h-4 text-[#5A626A]" />,
      },
      {
        title: "چرخ‌دنده‌ها و مکانیزم‌های حرکتی",
        desc: "طراحی و ساخت چرخ‌دنده‌های دقیق مدولار و پولی‌های تایمینگ",
        slug: "custom-parts",
        icon: <Box className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        title: "سفارش ساخت قطعات ویژه",
        desc: "تولید سفارشی انواع قطعات صنعتی نامتعارف طبق نقشه‌های شما",
        href: "/special-orders",
        icon: <Sparkles className="w-4 h-4 text-[#dfc79b]" />,
      },
    ],
  },
];

function buildCategoryGroups(categories: Category[]): MainCategoryGroup[] {
  if (!categories || categories.length === 0) {
    return defaultCategoryGroups;
  }

  // Filter root categories
  const rootCats = categories.filter((c) => !c.parentCategoryId || c.parentCategoryId === 0);
  const targetRoots = rootCats.length > 0 ? rootCats : categories;

  return targetRoots.map((cat) => {
    // Look for subcategories
    const subs =
      cat.subCategories && cat.subCategories.length > 0
        ? cat.subCategories
        : categories.filter((c) => c.parentCategoryId === cat.id);

    let items: SubCategoryItem[] = [];

    if (subs.length > 0) {
      items = subs.map((sub) => ({
        title: sub.name,
        desc:
          sub.description ||
          (sub.productCount > 0
            ? `${toPersianDigits(sub.productCount)} محصول موجود در فروشگاه`
            : "مشاهده محصولات این زیردسته"),
        slug: sub.slug,
        icon: getCategoryIcon(sub.slug, sub.name),
      }));
    } else {
      // Direct category entry
      items = [
        {
          title: `همه محصولات ${cat.name}`,
          desc: cat.description || `مشاهده تمام قطعات و تجهیزات کاتالوگ ${cat.name}`,
          slug: cat.slug,
          icon: getCategoryIcon(cat.slug, cat.name),
        },
        {
          title: "سفارش ساخت و ماشین‌کاری اختصاصی",
          desc: `تولید سفارشی انواع قطعات ${cat.name} طبق نقشه و فایل فنی`,
          href: "/special-orders",
          icon: <Sparkles className="w-4 h-4 text-[#dfc79b]" />,
        },
      ];
    }

    return {
      id: cat.slug || String(cat.id),
      title: cat.name,
      subtitle: cat.description || (cat.code ? `کد مهندسی: ${cat.code}` : ""),
      icon: getCategoryIcon(cat.slug, cat.name),
      badge:
        cat.productCount > 0
          ? `${toPersianDigits(cat.productCount)} کالا`
          : cat.code
          ? cat.code
          : undefined,
      defaultSlug: cat.slug,
      items,
    };
  });
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isSysManager, logout } = useAuth();
  const { itemCount } = useCart();
  const { compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const categoryGroups: MainCategoryGroup[] = React.useMemo(() => {
    return buildCategoryGroups(dynamicCategories);
  }, [dynamicCategories]);

  const [activeMainCatId, setActiveMainCatId] = useState<string>("industrial-machines");
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(
    "industrial-machines",
  );

  useEffect(() => {
    if (categoryGroups.length > 0 && !categoryGroups.some((g) => g.id === activeMainCatId)) {
      setActiveMainCatId(categoryGroups[0].id);
    }
  }, [categoryGroups, activeMainCatId]);

  useEffect(() => {
    if (categoryGroups.length > 0 && !categoryGroups.some((g) => g.id === mobileExpandedCat)) {
      setMobileExpandedCat(categoryGroups[0].id);
    }
  }, [categoryGroups, mobileExpandedCat]);

  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      try {
        const data = await categoriesApi.getCategories(true);
        if (mounted && Array.isArray(data) && data.length > 0) {
          setDynamicCategories(data);
        }
      } catch (err) {
        console.warn("Failed to load categories for header:", err);
      }
    }
    loadCats();

    const handleUpdate = () => {
      loadCats();
    };

    window.addEventListener("hizu:categories-updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("hizu:categories-updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileCategoriesOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const activeGroup =
    categoryGroups.find((g) => g.id === activeMainCatId) || categoryGroups[0];

  const standardNavLinks = [
    { href: "/", label: "خانه" },
    { href: "/courses", label: "دوره های آموزشی" },
    { href: "/services", label: "خدمات هیزو" },
    { href: "/articles", label: "مقالات و تکنولوژی" },
    { href: "/about", label: "درباره هیزو" },
    { href: "/contact", label: "تماس با ما" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#1c211b]/10 shadow-[0_4px_20px_rgba(28,33,27,0.05)]">
      {/* Row 1: Logo, Search Bar, Special Order Button, User Profile / Login, Cart */}
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
        {/* Right: Brand Logo & Search Bar */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 max-w-2xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 interactive-bump"
          >
            <div className="w-10 h-10 rounded-xl bg-[#082719] flex items-center justify-center p-2 shadow-md border border-[#082719]/20 transition-transform group-hover:scale-105 text-[#dfc79b] font-mono font-bold text-lg shrink-0">
              <img
                src="/images/Hizu-logo.svg"
                alt="هیزو"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-black text-xl tracking-tight text-[#161A1D]">
                هیزو
              </span>
              <span className="font-mono text-[9px] text-[#5A626A] tracking-widest uppercase">
                FABRICATION LAB
              </span>
            </div>
          </Link>

          {/* Search Bar on First Row (expanded like reference image) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md lg:max-w-xl bg-[#F0EEE6]/80 hover:bg-[#EDE8DC]/70 focus-within:bg-white border border-[#1c211b]/10 focus-within:border-[#082719]/40 focus-within:ring-2 focus-within:ring-[#082719]/10 rounded-xl px-3.5 py-2 text-xs transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-[#5A626A] ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی قطعات صنعتی، متریال، خدمات کارگاه..."
              className="bg-transparent border-0 p-0 text-xs text-[#161A1D] placeholder-[#5A626A]/75 focus:outline-none focus:ring-0 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#5A626A] hover:text-[#161A1D] p-0.5"
                aria-label="پاک کردن متن جستجو"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Left: Actions (Special Order, User / Login, Divider, Shopping Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Special Order Button */}
          <Link
            href="/special-orders"
            className="hidden sm:inline-flex items-center gap-2 bg-[#082719] hover:bg-[#162b20] text-[#FCF9F1] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-[#082719]/40 whitespace-nowrap shrink-0 glaze-shimmer interactive-bump"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfc79b] shrink-0" />
            <span className="whitespace-nowrap">سفارش اختصاصی</span>
          </Link>

          {/* User Profile / Login Button */}
          {isAuthenticated ? (
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-xs interactive-bump ${
                  userMenuOpen
                    ? "bg-[#EDE8DC] border-[#082719]/40 text-[#082719]"
                    : "bg-[#FAF7F0] hover:bg-[#EDE8DC] border-[#1c211b]/15 text-[#161A1D]"
                }`}
                aria-expanded={userMenuOpen}
              >
                <div className="w-6 h-6 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center text-xs shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="max-w-[110px] truncate hidden sm:inline">
                  {user?.firstName || user?.fullName || "حساب من"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#5A626A] transition-transform duration-300 shrink-0 ${
                    userMenuOpen ? "rotate-180 text-[#082719]" : ""
                  }`}
                />
              </button>

              {/* Accordion / Dropdown Content */}
              <div
                className={`absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#1c211b]/10 py-2 z-50 dropdown-menu-anim ${
                  userMenuOpen ? "open" : ""
                }`}
              >
                {/* User Profile Info Header */}
                <div className="px-4 py-3 border-b border-[#1c211b]/08 bg-[#FAF7F0]/80 rounded-t-xl">
                  <div className="text-xs font-bold text-[#161A1D] truncate">
                    {user?.fullName ||
                      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                      "کاربر گرامی"}
                  </div>
                  <div className="text-[11px] font-mono text-[#5A626A] truncate dir-ltr text-right">
                    {user?.email}
                  </div>
                  <div className="mt-2 flex items-center gap-1 flex-wrap">
                    {isSysManager ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        <ShieldCheck className="w-3 h-3" />
                        مدیر ارشد سیستم (SysManager)
                      </span>
                    ) : isAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        مدیر سیستم (Admin)
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EDE8DC] text-[#161A1D]">
                        مشتری هیزو
                      </span>
                    )}
                  </div>
                </div>

                {/* Navigation Links inside Dropdown */}
                <div className="py-1">
                  {(isAdmin || isSysManager) && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          پنل مدیریت {isSysManager ? "ارشد" : "ادمین"}
                        </span>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded">
                        {isSysManager ? "SYS" : "ADMIN"}
                      </span>
                    </Link>
                  )}

                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#161A1D] hover:bg-[#FAF7F0] font-medium transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#5A626A] shrink-0" />
                    <span>پروفایل و حساب کاربری</span>
                  </Link>

                  <Link
                    href="/courses?tab=my-courses"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#161A1D] hover:bg-[#FAF7F0] font-medium transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-[#8f6d2f] shrink-0" />
                    <span>دوره‌های من</span>
                  </Link>

                  <Link
                    href="/account?tab=orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#161A1D] hover:bg-[#FAF7F0] font-medium transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#5A626A] shrink-0" />
                    <span>سفارش‌ها و پروژه‌ها</span>
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-[#161A1D] hover:bg-[#FAF7F0] font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-[#5A626A] shrink-0" />
                      <span>سبد خرید</span>
                    </div>
                    {itemCount > 0 && (
                      <span className="bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {toPersianDigits(itemCount)}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/compare"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-[#161A1D] hover:bg-[#FAF7F0] font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <GitCompare className="w-4 h-4 text-[#5A626A] shrink-0" />
                      <span>میز مقایسه</span>
                    </div>
                    {compareCount > 0 && (
                      <span className="bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {toPersianDigits(compareCount)}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="pt-1 mt-1 border-t border-[#1c211b]/08">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-right"
                  >
                    <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>خروج از حساب</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border border-[#1c211b]/15 hover:border-[#082719]/40 bg-white hover:bg-[#EDE8DC]/50 text-xs font-bold text-[#161A1D] whitespace-nowrap shrink-0 interactive-bump shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#5A626A] shrink-0" />
              <span className="whitespace-nowrap">ورود | ثبت‌نام</span>
            </Link>
          )}

          {/* Vertical Separator */}
          <div className="h-6 w-[1.5px] bg-[#1c211b]/15 mx-0.5 sm:mx-1 shrink-0" />

          {/* Shopping Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl hover:bg-[#EDE8DC]/70 border border-transparent hover:border-[#1c211b]/10 text-[#161A1D] shrink-0 interactive-bump"
            title="سبد خرید"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-[#dfc79b]/40">
                {toPersianDigits(itemCount)}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] transition-colors shrink-0 mr-1"
            aria-label="منو"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Navigation Links (Desktop) */}
      <div className="hidden lg:block border-t border-[#1c211b]/08 bg-[#FAF7F0]/40">
        <div className="max-w-7xl mx-auto h-11 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Right: Categories Dropdown & Core Nav Links */}
          <nav className="flex items-center gap-1 xl:gap-2">
            {/* Shop Categories Mega Dropdown */}
            <div className="relative group/nav py-1.5">
              <button
                type="button"
                className={`px-3 py-1 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                  pathname.startsWith("/shop")
                    ? "text-[#082719] bg-[#EDE8DC] border border-[#1c211b]/10 shadow-xs"
                    : "text-[#161A1D] hover:bg-[#EDE8DC]/60"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#082719]" />
                <span>محصولات</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5A626A] transition-transform duration-300 group-hover/nav:rotate-180" />
              </button>

              {/* Shop Categories Mega Dropdown Menu - Extended Menu In Menu */}
              <div className="absolute right-0 top-full pt-1.5 w-[740px] max-w-[calc(100vw-2rem)] opacity-0 translate-y-2 scale-95 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:scale-100 group-hover/nav:pointer-events-auto transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-[#1c211b]/12 overflow-hidden card-popup">
                  {/* Top Header Bar */}
                  <div className="px-4 py-2.5 bg-[#FAF7F0] border-b border-[#1c211b]/08 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#082719]" />
                      <span className="font-mono text-[10px] text-[#8f6d2f] font-bold uppercase tracking-wider">
                        HIZU CATALOG & CATEGORIES
                      </span>
                    </div>
                    <Link
                      href="/shop"
                      className="text-[11px] text-[#0284c7] hover:text-[#082719] hover:underline font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>مشاهده همه محصولات کاتالوگ</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Body: Two columns (Right: Main categories list, Left: Extended Sub-menu) */}
                  <div className="flex divide-x divide-x-reverse divide-[#1c211b]/08 min-h-[320px]">
                    {/* Right Column: Main Categories List */}
                    <div className="w-60 shrink-0 p-2.5 flex flex-col gap-1.5 bg-[#FAF7F0]/40">
                      <span className="px-2.5 py-1 text-[10px] font-bold text-[#5A626A] uppercase tracking-wider">
                        دسته‌بندی‌های اصلی
                      </span>
                      {categoryGroups.map((group) => {
                        const isActive = group.id === activeGroup.id;
                        return (
                          <div
                            key={group.id}
                            onMouseEnter={() => setActiveMainCatId(group.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isActive
                                ? "bg-white text-[#082719] shadow-xs border border-[#1c211b]/08 font-bold"
                                : "text-[#161A1D] hover:bg-white/70 hover:text-[#082719] font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isActive
                                    ? "bg-[#082719] text-[#dfc79b]"
                                    : "bg-[#EDE8DC] text-[#5A626A]"
                                }`}
                              >
                                {group.icon}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs truncate">
                                    {group.title}
                                  </span>
                                  {group.badge && (
                                    <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1 rounded">
                                      {group.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronLeft
                              className={`w-4 h-4 transition-transform shrink-0 ${
                                isActive
                                  ? "text-[#082719] -translate-x-0.5"
                                  : "text-[#5A626A]/30"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Left Column: Extended Sub-Menu */}
                    <div className="flex-1 p-4 flex flex-col justify-between bg-white">
                      <div>
                        {/* Sub-menu Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c211b]/08">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#161A1D]">
                              {activeGroup.title}
                            </span>
                            <span className="text-xs text-[#5A626A]">
                              — {activeGroup.subtitle}
                            </span>
                          </div>
                          {activeGroup.defaultSlug && (
                            <Link
                              href={`/shop?category=${activeGroup.defaultSlug}`}
                              className="text-[11px] font-semibold text-[#8f6d2f] hover:underline flex items-center gap-1 shrink-0"
                            >
                              <span>مشاهده این بخش</span>
                              <ArrowLeft className="w-3 h-3" />
                            </Link>
                          )}
                        </div>

                        {/* Sub-menu Items Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {activeGroup.items.map((item, idx) => {
                            const linkHref =
                              item.href ||
                              (item.slug
                                ? `/shop?category=${item.slug}`
                                : "/shop");
                            const dynamicMatch = item.slug
                              ? dynamicCategories.find(
                                  (c) => c.slug === item.slug,
                                )
                              : null;
                            const count = dynamicMatch?.productCount;

                            return (
                              <Link
                                key={idx}
                                href={linkHref}
                                className="group/sub p-2.5 rounded-xl border border-[#1c211b]/06 hover:border-[#082719]/30 hover:bg-[#FAF7F0]/60 transition-all flex items-start gap-2.5 text-right interactive-bump"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#EDE8DC]/70 border border-[#1c211b]/08 flex items-center justify-center shrink-0 group-hover/sub:bg-[#082719] group-hover/sub:text-[#dfc79b] transition-colors mt-0.5">
                                  {item.icon}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-[#161A1D] group-hover/sub:text-[#082719] transition-colors">
                                      {item.title}
                                    </span>
                                    {count !== undefined && count > 0 && (
                                      <span className="text-[10px] text-[#8f6d2f] font-mono shrink-0">
                                        {toPersianDigits(count)}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[#5A626A] line-clamp-2 mt-0.5 leading-relaxed">
                                    {item.desc}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Extended Menu Quick Bottom Banner */}
                      <div className="mt-4 pt-3 border-t border-[#1c211b]/08 flex items-center justify-between text-xs bg-[#FAF7F0]/70 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 text-[#5A626A]">
                          <Sparkles className="w-3.5 h-3.5 text-[#dfc79b] shrink-0" />
                          <span className="text-[11px]">
                            سفارش ساخت قطعه یا دستگاه صنعتی اختصاصی
                          </span>
                        </div>
                        <Link
                          href="/special-orders"
                          className="text-[11px] font-bold text-[#082719] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>ثبت سفارش ویژه</span>
                          <ArrowLeft className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4 w-[1px] bg-[#1c211b]/10 mx-1 shrink-0" />

            {/* Core Nav Links */}
            {standardNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#082719] font-bold bg-[#EDE8DC] border border-[#1c211b]/10 shadow-xs"
                      : "text-[#5A626A] hover:text-[#161A1D] hover:bg-[#EDE8DC]/50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.href === "/compare" && compareCount > 0 && (
                    <span className="bg-[#082719] text-[#dfc79b] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {toPersianDigits(compareCount)}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu with Smooth Slide & Fade Transition */}
      <div
        className={`lg:hidden border-t border-[#1c211b]/10 bg-[#FFFFFF] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[85vh] opacity-100 py-6 px-6 overflow-y-auto"
            : "max-h-0 opacity-0 py-0 px-6 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4">
          {isAuthenticated && (
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#1c211b]/10 flex flex-col gap-1">
              <div className="text-xs font-bold text-[#161A1D]">
                {user?.fullName ||
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "کاربر گرامی"}
              </div>
              <div className="text-[11px] font-mono text-[#5A626A] dir-ltr text-right">
                {user?.email}
              </div>
              <div className="mt-1">
                {isSysManager ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    مدیر ارشد سیستم (SysManager)
                  </span>
                ) : isAdmin ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    مدیر سیستم (Admin)
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE8DC] text-[#161A1D]">
                    مشتری هیزو
                  </span>
                )}
              </div>
            </div>
          )}

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

          <div className="flex flex-col gap-1.5 pt-2">
            {(isAdmin || isSysManager) && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl whitespace-nowrap flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>پنل مدیریت {isSysManager ? "ارشد" : "ادمین"}</span>
              </Link>
            )}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] whitespace-nowrap"
            >
              خانه
            </Link>

            {/* Mobile Accordion for Shop Categories */}
            <div className="rounded-xl border border-[#1c211b]/08 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-semibold text-[#161A1D] bg-[#FAF7F0]/60 hover:bg-[#EDE8DC]"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#082719]" />
                  <span>فروشگاه و دسته‌بندی‌ها</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#5A626A] transition-transform duration-300 ${
                    mobileCategoriesOpen ? "rotate-180 text-[#082719]" : ""
                  }`}
                />
              </button>

              <div
                className={`accordion-grid ${mobileCategoriesOpen ? "open" : ""}`}
              >
                <div className="accordion-inner">
                  <div className="p-2 flex flex-col gap-1.5 bg-white">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-xs font-bold rounded-lg text-[#082719] bg-[#EDE8DC]/60 hover:bg-[#EDE8DC] flex items-center justify-between"
                    >
                      <span>همه محصولات کاتالوگ</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#082719]" />
                    </Link>

                    {categoryGroups.map((group) => {
                      const isExpanded = mobileExpandedCat === group.id;
                      return (
                        <div
                          key={group.id}
                          className="border border-[#1c211b]/08 rounded-xl overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpandedCat(isExpanded ? null : group.id)
                            }
                            className="w-full px-3 py-2 text-xs font-bold flex items-center justify-between bg-[#FAF7F0]/60 hover:bg-[#EDE8DC] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {group.icon}
                              <span>{group.title}</span>
                              {group.badge && (
                                <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1 rounded">
                                  {group.badge}
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-[#5A626A] transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-[#082719]" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="p-1.5 flex flex-col gap-1 bg-white border-t border-[#1c211b]/06">
                              {group.items.map((item, subIdx) => {
                                const linkHref =
                                  item.href ||
                                  (item.slug
                                    ? `/shop?category=${item.slug}`
                                    : "/shop");
                                return (
                                  <Link
                                    key={subIdx}
                                    href={linkHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-2.5 py-2 rounded-lg text-xs hover:bg-[#FAF7F0] flex items-center justify-between text-[#161A1D] transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded bg-[#EDE8DC]/60 flex items-center justify-center shrink-0">
                                        {item.icon}
                                      </div>
                                      <span className="font-semibold text-[11px]">
                                        {item.title}
                                      </span>
                                    </div>
                                    <ArrowLeft className="w-3 h-3 text-[#5A626A]" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {standardNavLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#5A626A]" />
                  <span>حساب کاربری من</span>
                </Link>
                <Link
                  href="/courses?tab=my-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#8f6d2f]" />
                  <span>دوره‌های من</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#5A626A]" />
                    <span>سبد خرید</span>
                  </div>
                  {itemCount > 0 && (
                    <span className="bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {toPersianDigits(itemCount)}
                    </span>
                  )}
                </Link>
                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl text-[#161A1D] hover:bg-[#EDE8DC] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-[#5A626A]" />
                    <span>میز مقایسه قطعات</span>
                  </div>
                  {compareCount > 0 && (
                    <span className="bg-[#082719] text-[#dfc79b] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {toPersianDigits(compareCount)}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-right px-4 py-2 text-sm font-medium rounded-xl text-rose-700 hover:bg-rose-50 flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-bold text-[#082719] bg-[#EDE8DC] rounded-xl flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </Link>
            )}

            <Link
              href="/special-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 text-center bg-[#1f3d2e] text-[#FCF9F1] py-3 rounded-full text-xs font-bold shadow-md glaze-shimmer"
            >
              ثبت سفارش / شروع پروژه
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
