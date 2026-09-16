"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { ordersApi } from "@/lib/api/orders";
import { Address } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { error, success } = useToast();

  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: user?.address?.street || "",
    city: user?.address?.city || "تهران",
    state: user?.address?.state || "تهران",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "ایران",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.address) {
      setShippingAddress({
        street: user.address.street || "",
        city: user.address.city || "تهران",
        state: user.address.state || "تهران",
        zipCode: user.address.zipCode || "",
        country: user.address.country || "ایران",
      });
    }
  }, [user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-[#5A626A]">سبد خرید شما خالی است.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.street.trim() || !shippingAddress.city.trim()) {
      error("لطفاً آدرس پستی و شهر را کامل وارد کنید.");
      return;
    }

    try {
      setSubmitting(true);
      const order = await ordersApi.createOrder(shippingAddress);
      await refreshCart();
      success("سفارش شما با موفقیت ثبت شد.");
      router.push(`/order-success/${order.id}`);
    } catch (err: any) {
      error(err.message || "خطا در ثبت سفارش.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#161A1D]">تکمیل و ثبت نهایی سفارش</h1>
        <p className="text-xs text-[#5A626A] mt-1">
          مشخصات آدرس تحویلگیرنده را تایید کرده و سفارش خود را نهایی نمایید.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-7 card-popup rounded-2xl p-6 sm:p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-6">
          <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3">
            آدرس پستی و تحویل سفارش
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">استان *</label>
              <input
                type="text"
                required
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">شهر *</label>
              <input
                type="text"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد) *</label>
            <textarea
              required
              rows={3}
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="مثال: خیابان آزادی، ناحیه نوآوری شریف، ساختمان کارگاه هیزو، طبقه ۲"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">کد پستی ۱۰ رقمی</label>
            <input
              type="text"
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="1458888888"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EDE8DC]/50 border border-[#1c211b]/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#8f6d2f] shrink-0" />
            <span className="text-xs text-[#5A626A] leading-relaxed">
              پرداخت در درگاه بانکی شتاب یا صدور پیش‌فاکتور رسمی شرکتی با شناسه ملی هیزو انجام خواهد شد.
            </span>
          </div>
        </div>

        {/* Order Review Box */}
        <div className="lg:col-span-5 card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-5 sticky top-28">
          <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3">
            اقلام فاکتور ({cart.items.length} قلم)
          </h2>

          <div className="divide-y divide-[#1c211b]/08 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-[#161A1D] line-clamp-1">{item.productName}</span>
                  <span className="font-mono text-[10px] text-[#5A626A]">تعداد: {item.quantity} عدد</span>
                </div>
                <span className="font-mono font-bold text-[#082719]">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1c211b]/10 pt-3 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">مجموع قطعات:</span>
              <span className="font-mono font-bold text-[#161A1D]">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">هزینه ارسال:</span>
              <span className="font-mono font-bold text-[#161A1D]">
                {cart.shippingCost === 0 ? "رایگان" : formatPrice(cart.shippingCost)}
              </span>
            </div>
            <div className="border-t border-[#1c211b]/10 pt-2 flex items-center justify-between font-bold text-sm">
              <span className="text-[#161A1D]">مبلغ نهایی:</span>
              <span className="font-mono text-base text-[#082719]">{formatPrice(cart.total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white py-3.5 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <span>{submitting ? "درحال ثبت سفارش..." : "تایید و پرداخت سفارش"}</span>
            <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
          </button>
        </div>
      </form>
    </div>
  );
}
