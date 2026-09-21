"use client";

import React, { useState } from "react";
import { Order } from "@/types";
import { formatPrice, formatDate, toPersianDigits, getImageUrl } from "@/lib/utils/formatters";
import {
  X,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Printer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  FileText,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/providers/ToastProvider";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: number) => Promise<void>;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const { success, error } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    success(`${fieldName} در کلیپ‌بورد کپی شد.`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleStatusChange = async (newStatus: number) => {
    try {
      setUpdatingStatus(true);
      await onUpdateStatus(order.id, newStatus);
    } catch (err: any) {
      // Error handled by parent
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          label: "در انتظار پرداخت / تایید",
        };
      case 1:
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-300",
          label: "در حال آماده‌سازی و ساخت",
        };
      case 2:
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-300",
          label: "ارسال شده با پست",
        };
      case 3:
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          label: "تحویل داده شده به مشتری",
        };
      case 4:
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          label: "لغو شده",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-700 border-gray-300",
          label: order.statusText,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="card-popup relative w-full max-w-4xl rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto print:max-w-none print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-mono font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[#161A1D]">جزئیات سفارش</h3>
                <span className="font-mono font-bold text-xs bg-[#EDE8DC] text-[#082719] px-2.5 py-0.5 rounded-full border border-[#1c211b]/10">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#5A626A] mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ثبت شده در: {formatDate(order.createdAt)}</span>
                </span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.bg}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1c211b]/15 text-xs text-[#161A1D] hover:bg-[#EDE8DC] transition-colors"
              title="چاپ فاکتور سفارش"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">چاپ فاکتور</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5A626A] hover:bg-gray-200 transition-colors"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          {/* Inventory / Stock Commitment Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              order.isStockDeducted
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                : "bg-amber-50/80 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-start sm:items-center gap-2.5">
              {order.isStockDeducted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {order.isStockDeducted
                    ? "موجودی انبار برای این سفارش قطعی و کسر شده است"
                    : "موجودی انبار هنوز کسر نشده است (سفارش در انتظار تایید نهایی ادمین)"}
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {order.isStockDeducted
                    ? "اقلام این سفارش از شمارش موجودی انبار کسر شده‌اند. در صورت لغو سفارش، موجودی به طور خودکار بازگردانده می‌شود."
                    : "برای نهایی‌سازی سفارش و اعمال کسر قطعی موجودی کالاها در انبار، وضعیت را به «در حال آماده‌سازی و ساخت» تغییر دهید."}
                </p>
              </div>
            </div>

            {/* Quick Commit Button if not deducted */}
            {!order.isStockDeducted && order.status !== 4 && (
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusChange(1)}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#082719] text-[#dfc79b] hover:bg-[#16191d] text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تایید سفارش و کسر از انبار</span>
              </button>
            )}
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details Card */}
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1c211b]/10">
                <User className="w-4 h-4 text-[#082719]" />
                <h4 className="font-bold text-sm text-[#161A1D]">اطلاعات خریدار و حساب کاربری</h4>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">نام و نام خانوادگی:</span>
                  <span className="font-bold text-[#161A1D]">{order.customerName || "کاربر مهمان"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">شماره تماس:</span>
                  <div className="flex items-center gap-1.5">
                    {order.customerPhone ? (
                      <>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="font-mono font-bold text-[#0284c7] hover:underline dir-ltr"
                        >
                          {order.customerPhone}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.customerPhone!, "شماره تماس")}
                          className="p-1 rounded text-gray-500 hover:text-black hover:bg-white"
                          title="کپی شماره تماس"
                        >
                          {copiedField === "شماره تماس" ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">ثبت‌نشده</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">پست الکترونیک:</span>
                  <div className="flex items-center gap-1.5">
                    {order.customerEmail ? (
                      <>
                        <a
                          href={`mailto:${order.customerEmail}`}
                          className="font-mono text-[#161A1D] hover:underline dir-ltr"
                        >
                          {order.customerEmail}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.customerEmail, "ایمیل")}
                          className="p-1 rounded text-gray-500 hover:text-black hover:bg-white"
                          title="کپی ایمیل"
                        >
                          {copiedField === "ایمیل" ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">شناسه کاربری سیستم:</span>
                  <span className="font-mono text-[10px] text-[#5A626A]">{order.userId}</span>
                </div>
              </div>
            </div>

            {/* Shipping Details Card */}
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#1c211b]/10">
                <MapPin className="w-4 h-4 text-[#082719]" />
                <h4 className="font-bold text-sm text-[#161A1D]">نشانی دقیق پستی و مقصد ارسال</h4>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">استان و شهر:</span>
                  <span className="font-bold text-[#161A1D]">
                    {order.shippingAddress.state}، {order.shippingAddress.city}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[#5A626A]">نشانی کامل:</span>
                  <p className="font-medium text-[#161A1D] bg-white p-2.5 rounded-lg border border-[#1c211b]/10 leading-relaxed">
                    {order.shippingAddress.street || "نشانی ثبت نشده است"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">کد پستی ۱۰ رقمی:</span>
                  <div className="flex items-center gap-1.5">
                    {order.shippingAddress.zipCode ? (
                      <>
                        <span className="font-mono font-bold text-[#082719] dir-ltr">
                          {order.shippingAddress.zipCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.shippingAddress.zipCode, "کد پستی")}
                          className="p-1 rounded text-gray-500 hover:text-black hover:bg-white"
                          title="کپی کد پستی"
                        >
                          {copiedField === "کد پستی" ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">ثبت نشده</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#5A626A]">کشور:</span>
                  <span>{order.shippingAddress.country || "ایران"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#161A1D] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#082719]" />
                <span>اقلام و محصولات خریداری شده ({toPersianDigits(order.items.length)} قلم)</span>
              </h4>
              <span className="text-xs text-[#5A626A]">
                مجموع تعداد قطعات: {toPersianDigits(order.items.reduce((acc, i) => acc + i.quantity, 0))} عدد
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#1c211b]/10 bg-white">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-3">ردیف</th>
                    <th className="p-3">تصویر</th>
                    <th className="p-3">شرح قطعه / دوره</th>
                    <th className="p-3">کد فنی (SKU)</th>
                    <th className="p-3">قیمت واحد</th>
                    <th className="p-3 text-center">تعداد</th>
                    <th className="p-3 text-left">مجموع ردیف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {order.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="p-3 font-mono text-[#5A626A]">{idx + 1}</td>
                      <td className="p-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-[9px]">
                              NO IMG
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#161A1D]">{item.productName}</div>
                        {item.productId && (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            قطعه فیزیکی (انبارداری هیزو)
                          </span>
                        )}
                        {item.courseId && (
                          <span className="text-[10px] text-purple-700 font-medium">
                            دوره دیجیتال آموزشی
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#0284c7]">
                        {item.sku || "—"}
                      </td>
                      <td className="p-3 font-mono text-[#161A1D]">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-[#082719]">
                        {toPersianDigits(item.quantity)}
                      </td>
                      <td className="p-3 text-left font-mono font-bold text-[#082719]">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing & Financial Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#161A1D]">وضعیت تسویه مالی:</span>
              <span className="text-xs text-[#5A626A]">
                صدور فاکتور رسمی استودیو هیزو • تمامی مبالغ به تومان می‌باشد.
              </span>
            </div>

            <div className="flex flex-col gap-1.5 sm:min-w-[280px]">
              <div className="flex items-center justify-between text-xs text-[#5A626A]">
                <span>جمع اقلام:</span>
                <span className="font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#5A626A]">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span className="font-mono">
                  {order.shippingCost === 0 ? "رایگان (پست پیشتاز)" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-[#161A1D] border-t border-[#1c211b]/10 pt-2 mt-1">
                <span>مبلغ نهایی فاکتور:</span>
                <span className="font-mono font-black text-base text-[#082719]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#1c211b]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#161A1D]">تغییر وضعیت مرحله‌ای سفارش:</span>
              <span className="text-[11px] text-[#5A626A]">
                با تغییر وضعیت، پیامک و ایمیل خودکار برای مشتری ارسال شده و موجودی انبار به طور هوشمند تنظیم می‌گردد.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                disabled={updatingStatus}
                value={order.status}
                onChange={(e) => handleStatusChange(parseInt(e.target.value, 10))}
                className="bg-[#FAF7F0] border border-[#1c211b]/20 rounded-xl px-4 py-2.5 text-xs font-bold text-[#161A1D] focus:outline-none focus:border-[#082719] disabled:opacity-50 cursor-pointer"
              >
                <option value={0}>در انتظار پرداخت / تایید (Pending)</option>
                <option value={1}>در حال آماده‌سازی و ساخت (Processing - کسر موجودی انبار)</option>
                <option value={2}>ارسال شده با پست (Shipped)</option>
                <option value={3}>تحویل داده شده به مشتری (Delivered)</option>
                <option value={4}>لغو شده (Cancelled - بازگشت موجودی به انبار)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1c211b]/10 bg-[#FAF7F0] flex items-center justify-between shrink-0 print:hidden">
          <div className="text-[11px] text-[#5A626A] font-mono">
            HIZU ORDER ID: #{order.id}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
