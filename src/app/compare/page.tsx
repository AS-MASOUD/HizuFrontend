"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/providers/CompareProvider";
import { useCart } from "@/providers/CartProvider";
import { productsApi } from "@/lib/api/products";
import { ProductListDto, CompareItem } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import RadarChart from "@/components/compare/RadarChart";
import {
  analyzeProduct,
  buildFeatureComparisons,
  determineOverallWinner,
} from "@/lib/utils/comparisonEngine";
import {
  Scale,
  ArrowLeft,
  X,
  Plus,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Trash2,
  Check,
  Award,
  Sparkles,
  Info,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const {
    compareItems,
    compareCount,
    removeFromCompare,
    clearCompare,
    addToCompare,
    maxItems,
  } = useCompare();
  const { addToCart, loading: cartLoading } = useCart();

  const [radarViewMode, setRadarViewMode] = useState<"individual" | "overlay">("individual");
  const [catalogProducts, setCatalogProducts] = useState<ProductListDto[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Load catalog products for quick add when slots are available
  useEffect(() => {
    setLoadingCatalog(true);
    productsApi
      .getProducts({ pageSize: 12 })
      .then((res) => {
        setCatalogProducts(res.items);
      })
      .catch(() => {
        setCatalogProducts([]);
      })
      .finally(() => {
        setLoadingCatalog(false);
      });
  }, []);

  // Sync products from URL query if present (e.g. ?ids=id1,id2)
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const ids = idsParam.split(",").filter(Boolean);
      ids.forEach((id) => {
        if (!compareItems.some((item) => item.id === id) && compareItems.length < maxItems) {
          productsApi
            .getProductById(id)
            .then((p) => {
              addToCompare({
                id: p.id,
                name: p.name,
                slug: p.slug,
                sku: p.sku,
                price: p.price,
                compareAtPrice: p.compareAtPrice,
                stockQuantity: p.stockQuantity,
                imageUrl: p.imageUrl,
                material: p.material,
                technique: p.technique,
                tolerance: p.tolerance,
                dimensions: p.dimensions,
                weight: p.weight,
                color: p.color,
                categoryName: p.categoryName,
                description: p.description,
              });
            })
            .catch(() => {
              // Ignore invalid ID
            });
        }
      });
    }
  }, [searchParams]);

  // Calculations
  const analyses = compareItems.map(analyzeProduct);
  const featureComparisons = buildFeatureComparisons(compareItems);
  const overallResult = determineOverallWinner(compareItems);

  // Handle Add to Cart
  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  // When 0 or 1 product is selected
  if (compareCount < 2) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5A626A] border-b border-[#1c211b]/10 pb-4">
          <Link href="/" className="hover:text-[#082719]">خانه</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#082719]">فروشگاه</Link>
          <span>/</span>
          <span className="text-[#161A1D] font-bold">میز مقایسه محصولات</span>
        </nav>

        {/* Empty / Prompt Card */}
        <div className="card-popup rounded-2xl p-8 sm:p-12 bg-white border border-[#1c211b]/10 text-center flex flex-col items-center gap-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#EDE8DC] border border-[#1c211b]/10 flex items-center justify-center text-[#082719]">
            <Scale className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2 max-w-lg">
            <h1 className="text-2xl font-black text-[#161A1D]">
              {compareCount === 0 ? "هیچ محصولی در لیست مقایسه نیست" : "یک محصول دیگر برای مقایسه اضافه کنید"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A626A] leading-relaxed">
              برای رسم نمودار چندضلعی، تحلیل نقاط قوت و ضعف و امتیازدهی بخش‌های فنی، لطفاً حداقل 2 محصول (و حداکثر 3 محصول) را انتخاب کنید.
            </p>
          </div>

          {/* If 1 product is selected, display it */}
          {compareCount === 1 && (
            <div className="mt-2 flex items-center gap-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#1c211b]/10 max-w-sm w-full">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#1c211b]/10 shrink-0">
                {compareItems[0].imageUrl ? (
                  <img src={compareItems[0].imageUrl} alt={compareItems[0].name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-mono">HIZU</div>
                )}
              </div>
              <div className="flex flex-col flex-1 text-right min-w-0">
                <span className="text-xs font-bold text-[#161A1D] truncate">{compareItems[0].name}</span>
                <span className="text-[11px] font-mono text-[#082719] font-semibold">{formatPrice(compareItems[0].price)}</span>
              </div>
              <button
                onClick={() => removeFromCompare(compareItems[0].id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                title="حذف"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <span>مشاهده محصولات کاتالوگ</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Add from Catalog Section */}
        {catalogProducts.length > 0 && (
          <div className="flex flex-col gap-5 pt-4">
            <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8f6d2f]" />
                <h2 className="font-bold text-sm text-[#161A1D]">انتخاب سریع از میان قطعات کارگاه</h2>
              </div>
              <span className="text-xs text-[#5A626A]">روی «افزودن به مقایسه» کلیک کنید</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 4).map((prod) => {
                const isSelected = compareItems.some((i) => i.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#16191d] shrink-0">
                        {prod.imageUrl && (
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono text-[#0284c7]">{prod.sku}</span>
                        <h3 className="text-xs font-bold text-[#161A1D] truncate">{prod.name}</h3>
                        <span className="text-xs font-mono font-bold text-[#082719] mt-0.5">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isSelected) {
                          removeFromCompare(prod.id);
                        } else {
                          addToCompare({
                            id: prod.id,
                            name: prod.name,
                            slug: prod.slug,
                            sku: prod.sku,
                            price: prod.price,
                            compareAtPrice: prod.compareAtPrice,
                            stockQuantity: prod.stockQuantity,
                            imageUrl: prod.imageUrl,
                            material: prod.material,
                            technique: prod.technique,
                            tolerance: prod.tolerance,
                            categoryName: prod.categoryName,
                          });
                        }
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-[#082719] text-white"
                          : "bg-[#EDE8DC] hover:bg-[#16191d] text-[#161A1D] hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>انتخاب شده</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن به مقایسه</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Comparison Layout (2 or 3 Products)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
      {/* Top Breadcrumbs and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c211b]/10 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#5A626A]">
          <Link href="/" className="hover:text-[#082719]">خانه</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#082719]">فروشگاه</Link>
          <span>/</span>
          <span className="text-[#161A1D] font-bold">میز مقایسه تخصصی ({toPersianDigits(compareCount)} محصول)</span>
        </nav>

        <div className="flex items-center gap-3">
          {compareCount < maxItems && (
            <button
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE8DC] hover:bg-[#FAF7F0] border border-[#1c211b]/15 text-xs font-bold text-[#161A1D] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#082719]" />
              <span>افزودن محصول سوم</span>
            </button>
          )}

          <button
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>خالی کردن لیست</span>
          </button>
        </div>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider">
          [ HIZU MULTI-AXIS COMPARISON ENGINE ]
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#161A1D]">
          مقایسه مهندسی و ارزیابی مشخصات محصولات
        </h1>
        <p className="text-xs sm:text-sm text-[#5A626A]">
          تحلیل چندضلعی، ارزیابی نقاط قوت و ضعف، مقایسه بخش‌به‌بخش ویژگی‌ها و تعیین قطعه برتر طبق داده‌های آزمایشگاهی هیزو.
        </p>
      </div>

      {/* 1. Top Product Header Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${compareCount === 2 ? "2" : "3"} gap-6`}>
        {compareItems.map((item, idx) => (
          <div
            key={item.id}
            className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-5 flex flex-col justify-between gap-4 shadow-sm relative group"
          >
            {/* Top Bar: SKU & Remove */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0284c7] bg-[#EDE8DC] px-2.5 py-0.5 rounded border border-[#1c211b]/10">
                  {item.sku}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#5A626A] border border-[#1c211b]/08">
                  محصول {idx === 0 ? "اول" : idx === 1 ? "دوم" : "سوم"}
                </span>
              </div>

              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-[#5A626A] hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors"
                title="حذف این محصول از مقایسه"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Image & Info */}
            <div className="flex gap-4 items-center">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#16191d] shrink-0 border border-[#1c211b]/10">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-gray-400">
                    HIZU
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-sm text-[#161A1D] hover:text-[#082719] line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <span className="text-[11px] text-[#5A626A] mt-1">{item.categoryName || "قطعات کارگاهی"}</span>
                <div className="text-base font-mono font-black text-[#082719] mt-2">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>

            {/* Actions: Add to Cart & View Detail */}
            <div className="pt-2 border-t border-[#1c211b]/08 flex items-center gap-2">
              <button
                onClick={() => handleAddToCart(item.id)}
                disabled={cartLoading || item.stockQuantity === 0}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#082719] hover:bg-[#16191d] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#dfc79b]" />
                <span>{item.stockQuantity === 0 ? "ناموجود" : "خرید مستقیم"}</span>
              </button>

              <Link
                href={`/product/${item.slug}`}
                className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EDE8DC] text-[#161A1D] border border-[#1c211b]/10 transition-colors"
                title="مشاهده صفحه کامل محصول"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {/* Third Slot Placeholder if only 2 products */}
        {compareCount === 2 && (
          <div
            onClick={() => setIsPickerOpen(true)}
            className="rounded-2xl border-2 border-dashed border-[#1c211b]/20 bg-[#FAF7F0]/60 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF7F0] hover:border-[#082719] transition-all text-center min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-[#1c211b]/15 flex items-center justify-center text-[#082719] shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-[#161A1D]">افزودن محصول سوم</span>
            <span className="text-[11px] text-[#5A626A] max-w-[200px]">
              می‌توانید یک قطعه دیگر را برای مقایسه سه جانبه انتخاب کنید.
            </span>
          </div>
        )}
      </div>

      {/* 2. Polygon Graph & Pros/Cons Section */}
      <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c211b]/10 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#082719]" />
              <h2 className="font-bold text-lg text-[#161A1D]">
                نمودار چندضلعی مشخصات فنی (Polygon Radar Chart)
              </h2>
            </div>
            <p className="text-xs text-[#5A626A]">
              تحلیل هندسی 6 بعدی شامل دقت ابعادی، استحکام، ارزش خرید، سبکی، فناوری تولید و موجودی آماده.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex bg-[#FAF7F0] border border-[#1c211b]/10 rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => setRadarViewMode("individual")}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-colors ${
                radarViewMode === "individual"
                  ? "bg-[#082719] text-white shadow-xs"
                  : "text-[#5A626A] hover:text-[#161A1D]"
              }`}
            >
              نمودار اختصاصی هر محصول
            </button>
            <button
              onClick={() => setRadarViewMode("overlay")}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-colors ${
                radarViewMode === "overlay"
                  ? "bg-[#082719] text-white shadow-xs"
                  : "text-[#5A626A] hover:text-[#161A1D]"
              }`}
            >
              نمودار همپوشان ترکیبی
            </button>
          </div>
        </div>

        {/* Radar View Rendering */}
        {radarViewMode === "overlay" ? (
          <div className="flex flex-col items-center gap-8 py-4">
            <div className="w-full max-w-md">
              <RadarChart products={compareItems} mode="overlay" />
            </div>

            {/* Pros & Cons Cards Grid below Overlay */}
            <div className={`w-full grid grid-cols-1 md:grid-cols-${compareCount === 2 ? "2" : "3"} gap-6 pt-4 border-t border-[#1c211b]/10`}>
              {compareItems.map((item) => {
                const a = analyses.find((an) => an.productId === item.id)!;
                return (
                  <div key={`analysis-${item.id}`} className="bg-[#FAF7F0] rounded-xl p-5 border border-[#1c211b]/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#1c211b]/08 pb-2">
                      <span className="font-bold text-xs text-[#161A1D] truncate">{item.name}</span>
                      <span className="font-mono text-xs font-bold text-[#082719]">
                        امتیاز کلی: {toPersianDigits(a.totalScore)} / 60
                      </span>
                    </div>

                    {/* Good points */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>نقاط قوت کلیدی:</span>
                      </span>
                      <ul className="text-xs text-[#161A1D] space-y-1.5 list-disc list-inside">
                        {a.goodPoints.map((pt, i) => (
                          <li key={i} className="leading-relaxed">{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Drawbacks */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#1c211b]/08">
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>محدودیت‌ها و چالش‌ها:</span>
                      </span>
                      <ul className="text-xs text-[#5A626A] space-y-1.5 list-disc list-inside">
                        {a.drawbacks.map((dr, i) => (
                          <li key={i} className="leading-relaxed">{dr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Individual Polygon Radar Charts side by side */
          <div className={`grid grid-cols-1 md:grid-cols-${compareCount === 2 ? "2" : "3"} gap-8`}>
            {compareItems.map((item) => {
              const a = analyses.find((an) => an.productId === item.id)!;
              return (
                <div
                  key={`single-radar-${item.id}`}
                  className="flex flex-col items-center gap-5 bg-[#FAF7F0]/60 rounded-2xl p-5 border border-[#1c211b]/10"
                >
                  <div className="w-full flex items-center justify-between border-b border-[#1c211b]/08 pb-2">
                    <span className="font-bold text-xs text-[#161A1D] truncate">{item.name}</span>
                    <span className="font-mono text-xs font-bold text-[#082719] bg-white px-2 py-0.5 rounded border border-[#1c211b]/10">
                      {toPersianDigits(a.totalScore)} / 60
                    </span>
                  </div>

                  {/* Polygon Graph */}
                  <div className="w-full max-w-[280px]">
                    <RadarChart products={[item]} mode="single" activeProductId={item.id} />
                  </div>

                  {/* Good points */}
                  <div className="w-full flex flex-col gap-2 bg-white p-3.5 rounded-xl border border-[#1c211b]/08">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>نقاط قوت فنی:</span>
                    </span>
                    <ul className="text-xs text-[#161A1D] space-y-1.5 list-disc list-inside">
                      {a.goodPoints.map((pt, i) => (
                        <li key={i} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Drawbacks */}
                  <div className="w-full flex flex-col gap-2 bg-white p-3.5 rounded-xl border border-[#1c211b]/08">
                    <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>محدودیت‌ها یا چالش‌ها:</span>
                    </span>
                    <ul className="text-xs text-[#5A626A] space-y-1.5 list-disc list-inside">
                      {a.drawbacks.map((dr, i) => (
                        <li key={i} className="leading-relaxed">{dr}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Section Comparing Different Features with Points & Winner Badges */}
      <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#1c211b]/10 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8f6d2f]" />
            <h2 className="font-bold text-lg text-[#161A1D]">
              مقایسه بخش‌به‌بخش ویژگی‌ها و امتیازدهی به برنده (Feature Scoring)
            </h2>
          </div>
          <p className="text-xs text-[#5A626A]">
            در هر بخش، مشخصات فنی مقایسه شده و امتیازی بین 1 تا 10 به هر محصول اختصاص یافته است. محصول حائز رتبه برتر با نشان طلایی برنده مشخص شده است.
          </p>
        </div>

        {/* Feature Sections Table / Cards */}
        <div className="divide-y divide-[#1c211b]/10">
          {featureComparisons.map((sec) => (
            <div key={sec.key} className="py-5 flex flex-col gap-3">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#161A1D]">{sec.title}</h3>
                  <p className="text-[11px] text-[#5A626A]">{sec.description}</p>
                </div>

                {/* Section Winner Callout */}
                {sec.winnerId ? (
                  <div className="inline-flex items-center gap-2 bg-[#FAF7F0] border border-[#dfc79b] text-[#8f6d2f] px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto">
                    <Trophy className="w-3.5 h-3.5 text-[#8f6d2f]" />
                    <span>
                      برنده بخش: {compareItems.find((i) => i.id === sec.winnerId)?.name}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#5A626A] bg-gray-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    امتیاز برابر
                  </div>
                )}
              </div>

              {/* Grid of Product Values & Points in this section */}
              <div className={`grid grid-cols-1 md:grid-cols-${compareCount === 2 ? "2" : "3"} gap-4 mt-1`}>
                {compareItems.map((item) => {
                  const isWinner = sec.winnerId === item.id;
                  const score = sec.scores[item.id];
                  const val = sec.values[item.id];

                  return (
                    <div
                      key={`sec-${sec.key}-${item.id}`}
                      className={`p-4 rounded-xl border transition-all ${
                        isWinner
                          ? "bg-[#FAF7F0] border-[#082719]/40 shadow-xs"
                          : "bg-white border-[#1c211b]/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-[#161A1D] truncate">{item.name}</span>
                        {/* Score Badge */}
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isWinner
                              ? "bg-[#082719] text-[#dfc79b]"
                              : "bg-gray-100 text-[#5A626A]"
                          }`}
                        >
                          امتیاز: {toPersianDigits(score)} / 10
                        </span>
                      </div>

                      <div className="text-xs text-[#161A1D] font-medium leading-relaxed">
                        {val}
                      </div>

                      {isWinner && (
                        <div className="mt-2 pt-2 border-t border-[#1c211b]/08 text-[11px] text-[#082719] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#10b981]" />
                          <span>{sec.winnerReason}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Overall Winner Banner */}
      <section className="rounded-2xl bg-gradient-to-br from-[#082719] to-[#16191d] text-white p-6 sm:p-8 border border-[#1c211b]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#dfc79b]/20 border border-[#dfc79b]/40 flex items-center justify-center text-[#dfc79b] shrink-0">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#dfc79b] tracking-wider uppercase">
              [ OVERALL COMPARISON WINNER // هیزو ]
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {overallResult.isTie
                ? "نتیجه مقایسه: عملکرد کلی برابر"
                : `قطعه منتخب: «${overallResult.winnerItem?.name}»`}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              {overallResult.summary}
            </p>

            {/* Total Scores Summary */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {compareItems.map((item) => {
                const a = analyses.find((an) => an.productId === item.id)!;
                const isTop = overallResult.winnerId === item.id;
                return (
                  <div
                    key={`total-${item.id}`}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-2 ${
                      isTop
                        ? "bg-[#dfc79b] text-[#082719] shadow-md"
                        : "bg-white/10 text-white/80 border border-white/10"
                    }`}
                  >
                    <span>{item.name}:</span>
                    <span>{toPersianDigits(a.totalScore)} / 60</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {overallResult.winnerItem && (
          <button
            onClick={() => handleAddToCart(overallResult.winnerItem!.id)}
            disabled={cartLoading || overallResult.winnerItem.stockQuantity === 0}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#dfc79b] hover:bg-[#c9b183] text-[#082719] font-black text-xs py-3 px-6 rounded-full transition-all shadow-lg hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>خرید محصول برنده</span>
          </button>
        )}
      </section>

      {/* 5. Complete Technical Datasheet Specification Table */}
      <section className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 overflow-hidden shadow-sm">
        <div className="bg-[#EFE9DC] px-6 py-4 border-b border-[#1c211b]/10 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#5A4A3A] tracking-wider uppercase">
            DETAILED TECHNICAL DATASHEET // جدول تفصیلی مشخصات
          </span>
          <span className="font-mono text-[10px] text-[#0284c7] font-bold">ISO 2768-M COMPLIANT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#1c211b]/10 bg-[#FAF7F0]">
                <th className="p-4 font-bold text-[#5A626A] w-1/4">مشخصه فنی</th>
                {compareItems.map((item) => (
                  <th key={`th-${item.id}`} className="p-4 font-bold text-[#161A1D]">
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c211b]/08">
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">کد فنی (SKU)</td>
                {compareItems.map((item) => (
                  <td key={`sku-${item.id}`} className="p-4 font-mono font-bold text-[#0284c7]">
                    {item.sku}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">متریال مهندسی</td>
                {compareItems.map((item) => (
                  <td key={`mat-${item.id}`} className="p-4 font-semibold text-[#161A1D]">
                    {item.material || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">فرآیند و شیوه تولید</td>
                {compareItems.map((item) => (
                  <td key={`tech-${item.id}`} className="p-4 font-semibold text-[#161A1D]">
                    {item.technique || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">تلرانس ابعادی مجاز</td>
                {compareItems.map((item) => (
                  <td key={`tol-${item.id}`} className="p-4 font-mono font-bold text-[#161A1D]">
                    {item.tolerance || "استاندارد کارگاهی"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">ابعاد هندسی (L×W×H)</td>
                {compareItems.map((item) => (
                  <td key={`dim-${item.id}`} className="p-4 font-mono text-[#161A1D]">
                    {item.dimensions || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">وزن قطعه</td>
                {compareItems.map((item) => (
                  <td key={`w-${item.id}`} className="p-4 font-mono font-semibold text-[#161A1D]">
                    {item.weight || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">رنگ و فینیشینگ سطحی</td>
                {compareItems.map((item) => (
                  <td key={`col-${item.id}`} className="p-4 text-[#161A1D]">
                    {item.color || "طبیعی متریال"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">قیمت قطعه</td>
                {compareItems.map((item) => (
                  <td key={`pr-${item.id}`} className="p-4 font-mono font-bold text-[#082719]">
                    {formatPrice(item.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">موجودی انبار</td>
                {compareItems.map((item) => (
                  <td key={`stk-${item.id}`} className="p-4 text-[#161A1D]">
                    {item.stockQuantity > 0 ? (
                      <span className="text-emerald-700 font-bold">
                        موجود ({toPersianDigits(item.stockQuantity)} عدد)
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold">ساخت سفارشی</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-[#5A626A] bg-[#FAF7F0]/40">اقدام خرید</td>
                {compareItems.map((item) => (
                  <td key={`act-${item.id}`} className="p-4">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      disabled={cartLoading || item.stockQuantity === 0}
                      className="inline-flex items-center gap-1.5 bg-[#082719] hover:bg-[#16191d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>خرید قطعه</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Add Modal/Drawer when picking a 3rd product */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-popup rounded-2xl bg-white border border-[#1c211b]/10 max-w-xl w-full p-6 flex flex-col gap-4 max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#082719]" />
                <h3 className="font-bold text-sm text-[#161A1D]">انتخاب قطعه برای افزودن به مقایسه</h3>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-lg text-[#5A626A] hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex flex-col gap-2.5 max-h-[60vh] pr-1">
              {catalogProducts.map((prod) => {
                const alreadyIn = compareItems.some((i) => i.id === prod.id);
                return (
                  <div
                    key={`pick-${prod.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      alreadyIn
                        ? "bg-gray-50 border-gray-200 opacity-60"
                        : "bg-white hover:bg-[#FAF7F0] border-[#1c211b]/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#16191d] shrink-0">
                        {prod.imageUrl && (
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono text-[#0284c7]">{prod.sku}</span>
                        <span className="text-xs font-bold text-[#161A1D] truncate">{prod.name}</span>
                        <span className="text-xs font-mono text-[#082719] font-semibold mt-0.5">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={alreadyIn}
                      onClick={() => {
                        addToCompare({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug,
                          sku: prod.sku,
                          price: prod.price,
                          compareAtPrice: prod.compareAtPrice,
                          stockQuantity: prod.stockQuantity,
                          imageUrl: prod.imageUrl,
                          material: prod.material,
                          technique: prod.technique,
                          tolerance: prod.tolerance,
                          categoryName: prod.categoryName,
                        });
                        setIsPickerOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        alreadyIn
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#082719] text-white hover:bg-[#16191d]"
                      }`}
                    >
                      {alreadyIn ? "در لیست است" : "انتخاب"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-24 text-center font-mono text-xs text-[#5A626A] animate-pulse">
          LOADING COMPARISON DATA...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
