"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { ProductListDto, Category, PagedResult } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, ArrowRight, ArrowLeft, X } from "lucide-react";
import { toPersianDigits } from "@/lib/utils/formatters";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<PagedResult<ProductListDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    categoriesApi
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productsApi.getProducts({
        page: currentPage,
        pageSize: 12,
        categorySlug: currentCategory || undefined,
        search: currentSearch || undefined,
        sort: currentSort,
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSort, currentSearch, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilters = (params: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, val]) => {
      if (val === null || val === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    // Reset page to 1 when filters change (unless page was explicitly updated)
    if (!("page" in params)) {
      nextParams.delete("page");
    }
    router.push(`/shop?${nextParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1c211b]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider mb-1">
            [ HIZU HARDWARE CATALOG ]
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#161A1D]">
            فروشگاه قطعات و محصولات مهندسی
          </h1>
          <p className="text-sm text-[#5A626A] mt-1">
            قطعات پیش‌ساخته، المان‌های معماری و اکسسوری‌های تولید شده با
            تکنولوژی دقیق کارگاهی.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-[#5A626A]" />
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-white border border-[#1c211b]/15 rounded-full px-4 py-2 text-xs font-semibold text-[#161A1D] focus:outline-none focus:border-[#082719] shadow-sm cursor-pointer"
          >
            <option value="newest">جدیدترین محصولات</option>
            <option value="featured">پیشنهادات ویژه هیزو</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
            <option value="name_asc">نام (الفبا)</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Horizontal Category Nav */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => updateFilters({ category: null })}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              !currentCategory
                ? "bg-[#082719] text-white shadow-sm"
                : "bg-white hover:bg-[#EDE8DC] border border-[#1c211b]/10 text-[#161A1D]"
            }`}
          >
            تمام محصولات
          </button>
          {currentCategory && (() => {
            const activeCategory = categories.find((c) => c.slug === currentCategory);
            const displayName = activeCategory?.name || currentCategory;
            const count = activeCategory?.productCount;
            return (
              <button
                onClick={() => updateFilters({ category: null })}
                className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-[#082719] text-white shadow-sm flex items-center gap-2 group cursor-pointer"
                title="برای حذف فیلتر کلیک کنید"
              >
                <span>{displayName}</span>
                {count !== undefined && (
                  <span className="text-[11px] text-[#dfc79b] font-mono">
                    ({toPersianDigits(count)})
                  </span>
                )}
                <X className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
              </button>
            );
          })()}
        </div>

        {/* Inline Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[260px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجوی نام، کد SKU یا متریال..."
            className="w-full bg-white border border-[#1c211b]/15 rounded-full pr-4 pl-10 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719] shadow-sm"
          />
          <button
            type="submit"
            className="absolute left-3 top-2.5 text-[#5A626A] hover:text-[#082719]"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="card-popup rounded-2xl h-80 animate-pulse bg-white/70"
            />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.items.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="card-popup rounded-2xl p-16 text-center bg-white flex flex-col items-center justify-center gap-3">
          <p className="font-bold text-base text-[#161A1D]">
            محصولی با مشخصات انتخابی یافت نشد.
          </p>
          <p className="text-xs text-[#5A626A]">
            می‌توانید فیلترها را حذف کرده یا ساخت قطعه مورد نظر خود را سفارش
            دهید.
          </p>
          <button
            onClick={() => {
              setSearchInput("");
              router.push("/shop");
            }}
            className="mt-2 text-xs font-bold text-[#082719] underline"
          >
            مشاهده تمام محصولات کاتالوگ
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <button
            disabled={!data.hasPreviousPage}
            onClick={() =>
              updateFilters({ page: (currentPage - 1).toString() })
            }
            className="p-2 rounded-full border border-[#1c211b]/15 bg-white disabled:opacity-30 hover:bg-[#EDE8DC] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs font-bold text-[#161A1D]">
            صفحه {toPersianDigits(data.page)} از{" "}
            {toPersianDigits(data.totalPages)}
          </span>

          <button
            disabled={!data.hasNextPage}
            onClick={() =>
              updateFilters({ page: (currentPage + 1).toString() })
            }
            className="p-2 rounded-full border border-[#1c211b]/15 bg-white disabled:opacity-30 hover:bg-[#EDE8DC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-xs text-[#5A626A]">
          در حال بارگذاری کاتالوگ قطعات...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
