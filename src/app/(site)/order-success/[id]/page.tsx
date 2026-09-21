"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { CheckCircle2, ArrowLeft, PackageCheck, FileText } from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersApi
      .getOrderById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center">
      <div className="card-popup rounded-2xl p-8 sm:p-12 bg-white border border-[#1c211b]/10 w-full flex flex-col items-center text-center gap-6 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161A1D]">سفارش شما با موفقیت ثبت شد!</h1>
          <p className="text-xs sm:text-sm text-[#5A626A] mt-2">
            از خرید شما از استودیو ساخت هیزو سپاسگزاریم. فرآیند آماده‌سازی و ارسال قطعات آغاز گردید.
          </p>
        </div>

        {order && (
          <div className="w-full bg-[#FAF7F0] border border-[#1c211b]/10 rounded-xl p-5 text-right flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-2">
              <span className="text-[#5A626A]">شماره پیگیری فاکتور:</span>
              <span className="font-mono font-bold text-[#082719] text-sm">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">تاریخ ثبت:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">وضعیت سفارش:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                {order.statusText}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">آدرس تحویل:</span>
              <span className="text-left font-medium">{order.shippingAddress.state}، {order.shippingAddress.city}، {order.shippingAddress.street}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#1c211b]/10 pt-2 font-bold text-sm">
              <span className="text-[#161A1D]">مبلغ کل پرداختی:</span>
              <span className="font-mono text-[#082719]">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 bg-[#EDE8DC] hover:bg-[#dfc79b] text-[#161A1D] px-6 py-3 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            <PackageCheck className="w-4 h-4" />
            <span>مشاهده تاریخچه سفارش‌ها</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#082719] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
