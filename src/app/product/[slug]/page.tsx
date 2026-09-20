"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import { ProductDto } from "@/types";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import { useCart } from "@/providers/CartProvider";
import { useCompare } from "@/providers/CompareProvider";
import ProductSpecsTable from "@/components/product/ProductSpecsTable";
import ProductImageSlider from "@/components/product/ProductImageSlider";
import ProductCommentsSection from "@/components/product/ProductCommentsSection";
import {
  ShoppingBag,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Wrench,
  Scale,
  Ruler,
  Palette,
  Layers,
  Weight,
  Cpu,
  Target,
} from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const { toggleCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsApi
      .getProductBySlug(decodeURIComponent(slug))
      .then((res) => {
        setProduct(res);
      })
      .catch((err) => {
        setError(err.message || "محصول یافت نشد.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="text-center font-mono text-sm text-[#5A626A] animate-pulse">
          LOADING PRODUCT SPECIFICATIONS...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="card-popup rounded-2xl p-12 bg-white flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-[#161A1D]">محصول مورد نظر یافت نشد</h2>
          <p className="text-xs text-[#5A626A]">{error}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#082719] text-white text-xs font-bold px-6 py-3 rounded-full mt-2"
          >
            <span>بازگشت به کاتالوگ فروشگاه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#5A626A] border-b border-[#1c211b]/10 pb-4">
        <Link href="/" className="hover:text-[#082719]">خانه</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#082719]">فروشگاه</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-[#082719]">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#161A1D] font-bold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery Slider & Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery Slider */}
        <div className="lg:col-span-6">
          <ProductImageSlider
            images={product.images || []}
            primaryImageUrl={product.imageUrl}
            productName={product.name}
            tolerance={product.tolerance}
          />
        </div>

        {/* Product Details & Action Card */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#0284c7] bg-[#EDE8DC] px-2.5 py-0.5 rounded border border-[#1c211b]/10">
                {product.sku}
              </span>
              <span className="text-xs text-[#5A626A]">{product.categoryName}</span>
              {product.stockQuantity > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  <span>موجود در انبار ({toPersianDigits(product.stockQuantity)} عدد)</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  ناموجود / ساخت سفارشی
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#161A1D] leading-snug">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-[#5A626A] leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#082719]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm font-mono text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Quantity, Add to Cart & Compare */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="flex items-center border border-[#1c211b]/20 rounded-full bg-[#FAF7F0] p-1 self-stretch sm:self-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-base hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold w-10 text-center">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-base hover:bg-white transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stockQuantity === 0}
                className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#082719] hover:bg-[#16191d] text-white font-bold text-sm py-3.5 px-6 rounded-full transition-all shadow-md disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-[#dfc79b]" />
                <span>{product.stockQuantity === 0 ? "در حال حاضر ناموجود است" : "افزودن به سبد خرید"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleCompare({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    stockQuantity: product.stockQuantity,
                    imageUrl: product.imageUrl,
                    material: product.material,
                    technique: product.technique,
                    tolerance: product.tolerance,
                    dimensions: product.dimensions,
                    weight: product.weight,
                    color: product.color,
                    categoryName: product.categoryName,
                    description: product.description,
                  });
                }}
                className={`self-stretch sm:self-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
                  isInCompare(product.id)
                    ? "bg-[#082719] text-[#dfc79b] border-[#082719] shadow-sm"
                    : "bg-[#FAF7F0] hover:bg-[#EDE8DC] text-[#161A1D] border-[#1c211b]/15"
                }`}
                title={isInCompare(product.id) ? "حذف از لیست مقایسه" : "افزودن به لیست مقایسه"}
              >
                <Scale className="w-4 h-4" />
                <span>{isInCompare(product.id) ? "در لیست مقایسه" : "مقایسه قطعه"}</span>
              </button>
            </div>

            {/* Customization Callout */}
            <div className="pt-3 border-t border-[#1c211b]/10 flex items-center justify-between text-xs text-[#5A626A]">
              <span>نیاز به تغییر ابعاد، متریال یا تلرانس دارید؟</span>
              <Link
                href="/special-orders"
                className="font-bold text-[#082719] hover:underline inline-flex items-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>سفارش تغییرات</span>
              </Link>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white border border-[#1c211b]/08 rounded-xl flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-[#8f6d2f]" />
              <span className="text-[11px] font-bold text-[#161A1D]">تضمین تلرانس ساخت</span>
            </div>
            <div className="p-3 bg-white border border-[#1c211b]/08 rounded-xl flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-[#0284c7]" />
              <span className="text-[11px] font-bold text-[#161A1D]">ارسال مهندسی ایمن</span>
            </div>
            <div className="p-3 bg-white border border-[#1c211b]/08 rounded-xl flex flex-col items-center gap-1">
              <RefreshCw className="w-5 h-5 text-[#10b981]" />
              <span className="text-[11px] font-bold text-[#161A1D]">کنترل کیفیت ISO</span>
            </div>
          </div>

          {/* Quick Technical Specs Sheet */}
          <ProductSpecsTable product={product} />
        </div>
      </div>

      {/* SECTION 1: Detailed Physical & Manufacturing Specifications */}
      <div className="card-popup rounded-2xl p-6 sm:p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-6">
        <div className="border-b border-[#1c211b]/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="font-black text-xl text-[#161A1D]">
              مشخصات و ویژگی‌های فنی و مهندسی قطعه
            </h2>
          </div>
          <p className="text-xs text-[#5A626A] mt-1">
            پارامترهای ابعادی، خواص متریال و استاندارد فرآیند تولید
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Ruler className="w-3.5 h-3.5 text-[#082719]" />
              <span>ابعاد فیزیکی</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#161A1D] dir-ltr text-right">
              {product.dimensions || "استاندارد کاتالوگ"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span>متریال مهندسی</span>
            </div>
            <span className="font-bold text-xs text-[#161A1D]">
              {product.material || "پلیمر صنعتی"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Palette className="w-3.5 h-3.5 text-purple-700" />
              <span>رنگ و فینیشینگ</span>
            </div>
            <span className="font-bold text-xs text-[#161A1D]">
              {product.color || "مشکی مات کارگاهی"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Weight className="w-3.5 h-3.5 text-blue-700" />
              <span>وزن خالص</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#161A1D] dir-ltr text-right">
              {product.weight || "سبک‌وزن صنعتی"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-emerald-700" />
              <span>روش تولید</span>
            </div>
            <span className="font-bold text-xs text-[#161A1D]">
              {product.technique || "ساخت افزایشی / CNC"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/08 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#5A626A] text-[11px]">
              <Target className="w-3.5 h-3.5 text-rose-700" />
              <span>تلرانس ساخت</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#161A1D] dir-ltr text-right">
              {product.tolerance || "ISO 2768-m"}
            </span>
          </div>
        </div>

        {/* Detailed Long Description */}
        {product.description && (
          <div className="pt-2">
            <h3 className="font-bold text-sm text-[#161A1D] mb-2">
              شرح جزئیات فنی و کاربرد صنعتی:
            </h3>
            <div className="text-xs sm:text-sm text-[#5A626A] leading-loose whitespace-pre-line bg-[#FAF7F0]/50 p-5 rounded-xl border border-[#1c211b]/08">
              {product.description}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: User Comments & Customer Feedback */}
      <ProductCommentsSection productId={product.id} productName={product.name} />
    </div>
  );
}
