"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { formatPrice, toPersianDigits, getImageUrl } from "@/lib/utils/formatters";
import { Trash2, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="card-popup rounded-2xl p-16 bg-white flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EDE8DC] flex items-center justify-center text-[#8f6d2f]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#161A1D]">سبد خرید شما خالی است</h1>
          <p className="text-sm text-[#5A626A] max-w-sm">
            شما هنوز قطعه یا محصولی را به سبد خرید خود اضافه نکرده‌اید.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#082719] text-white text-xs font-bold px-7 py-3.5 rounded-full mt-4 shadow-md"
          >
            <span>مشاهده کاتالوگ فروشگاه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#161A1D]">سبد خرید و قطعات انتخابی</h1>
          <p className="text-xs text-[#5A626A] mt-1 font-mono">
            COUNT: {toPersianDigits(cart.totalItemCount)} ITEMS
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-bold transition-colors"
        >
          پاک‌کردن کل سبد
        </button>
      </div>

      {/* Grid: Cart Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex flex-col sm:flex-row items-center gap-5 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#16191d] shrink-0">
                  {item.imageUrl ? (
                    <img src={getImageUrl(item.imageUrl)} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#5A626A]">
                      HIZU
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#0284c7] font-bold">{item.sku}</span>
                    {item.courseId && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        دوره آموزشی
                      </span>
                    )}
                  </div>
                  <Link
                    href={item.courseId ? `/courses/${item.productSlug}` : `/product/${item.productSlug}`}
                    className="font-bold text-sm text-[#161A1D] hover:text-[#082719] transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <span className="font-mono text-xs text-[#5A626A]">
                    واحد: {formatPrice(item.unitPrice)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1c211b]/10 pt-3 sm:pt-0">
                {item.courseId ? (
                  <span className="text-xs font-mono text-[#5A626A] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#1c211b]/10">
                    تعداد: 1 دوره
                  </span>
                ) : (
                  <div className="flex items-center border border-[#1c211b]/20 rounded-full bg-[#FAF7F0] p-1">
                    <button
                      disabled={loading}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-white transition-colors"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold w-8 text-center">
                      {toPersianDigits(item.quantity)}
                    </span>
                    <button
                      disabled={loading || item.quantity >= item.availableStock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-white transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="text-left font-mono font-bold text-sm text-[#082719] min-w-[120px]">
                  {formatPrice(item.totalPrice)}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="حذف از سبد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-6 sticky top-28">
          <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3">
            خلاصه فاکتور سفارش
          </h2>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">جمع قطعات:</span>
              <span className="font-mono font-bold text-[#161A1D]">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">هزینه بسته‌بندی و ارسال:</span>
              <span className="font-mono font-bold text-[#161A1D]">
                {cart.shippingCost === 0 ? "رایگان (سفارش بالای 1.5 میلیون)" : formatPrice(cart.shippingCost)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#1c211b]/10 flex items-center justify-between font-bold text-sm">
              <span className="text-[#161A1D]">مبلغ قابل پرداخت:</span>
              <span className="font-mono text-base text-[#082719]">{formatPrice(cart.total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-[#1f3d2e] hover:bg-[#162b20] text-white py-3.5 rounded-full text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
          >
            <span>تکمیل و ثبت نهایی سفارش</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Link
            href="/shop"
            className="text-center text-xs text-[#5A626A] hover:text-[#082719] transition-colors"
          >
            ادامه خرید از کاتالوگ
          </Link>
        </div>
      </div>
    </div>
  );
}
