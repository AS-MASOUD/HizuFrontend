"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { adminApi } from "@/lib/api/admin";
import { AdminDashboardStats, Order, SpecialOrder, AdminUser } from "@/types";
import { formatPrice, formatDate, toPersianDigits } from "@/lib/utils/formatters";
import { ShieldCheck, Package, Wrench, Users, DollarSign, Check, Send } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [specialOrders, setSpecialOrders] = useState<SpecialOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "special" | "users">("orders");
  const [loading, setLoading] = useState(true);

  // Reply modal / state for special orders
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login?redirect=/admin");
    }
  }, [authLoading, user, isAdmin, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, o, so, u] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOrders(1, 30),
        adminApi.getSpecialOrders(1, 30),
        adminApi.getUsers(1, 30),
      ]);
      setStats(s);
      setOrders(o.items);
      setSpecialOrders(so.items);
      setUsers(u.items);
    } catch (err: any) {
      error(err.message || "خطا در بارگذاری اطلاعات پنل مدیریت.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleUpdateOrderStatus = async (orderId: string, status: number) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      success("وضعیت سفارش بروزرسانی شد.");
      loadData();
    } catch (err: any) {
      error(err.message || "خطا در تغییر وضعیت.");
    }
  };

  const handleReplySpecialOrder = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await adminApi.replySpecialOrder(
        id,
        replyText.trim(),
        quotedPrice ? parseFloat(quotedPrice) : undefined,
        2 // Approved / Reviewed
      );
      success("پاسخ و استعلام برای مشتری ارسال گردید.");
      setReplyingId(null);
      setReplyText("");
      setQuotedPrice("");
      loadData();
    } catch (err: any) {
      error(err.message || "خطا در ارسال پاسخ.");
    }
  };

  if (authLoading || !isAdmin) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center font-mono">CHECKING ADMIN CREDENTIALS...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HIZU CONTROL PANEL // ROOT</span>
          </div>
          <h1 className="text-3xl font-black text-[#161A1D]">پنل مدیریت و کارگاه هیزو</h1>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">کل درآمد حاصله:</span>
              <span className="font-mono font-black text-lg text-[#082719] mt-1">
                {formatPrice(stats.totalRevenue)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">سفارش‌های در حال انجام:</span>
              <span className="font-mono font-black text-xl text-[#082719] mt-1">
                {toPersianDigits(stats.pendingOrders)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0284c7] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">استعلام‌های جدید ساخت:</span>
              <span className="font-mono font-black text-xl text-[#8f6d2f] mt-1">
                {toPersianDigits(stats.pendingSpecialOrders)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8f6d2f] flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">کاربران ثبت‌نامی:</span>
              <span className="font-mono font-black text-xl text-[#161A1D] mt-1">
                {toPersianDigits(stats.totalUsers)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#5A626A] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c211b]/10 pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "orders" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          سفارش‌های خرید کاتالوگ ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("special")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "special" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          استعلام‌های ساخت سفارشی ({specialOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "users" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          کاربران سیستم ({users.length})
        </button>
      </div>

      {/* Content 1: Orders */}
      {activeTab === "orders" && (
        <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                <tr>
                  <th className="p-4">شماره فاکتور</th>
                  <th className="p-4">نام مشتری</th>
                  <th className="p-4">اقلام</th>
                  <th className="p-4">مبلغ فاکتور</th>
                  <th className="p-4">تاریخ ثبت</th>
                  <th className="p-4">وضعیت جاری</th>
                  <th className="p-4">تغییر وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c211b]/08">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF7F0] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#082719]">{o.orderNumber}</td>
                    <td className="p-4">{o.customerName} ({o.customerEmail})</td>
                    <td className="p-4">
                      {o.items.map((i) => (
                        <div key={i.id} className="font-mono text-[10px] text-[#5A626A]">
                          {i.productName} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-mono font-bold">{formatPrice(o.total)}</td>
                    <td className="p-4 text-[#5A626A]">{formatDate(o.createdAt)}</td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        {o.statusText}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, parseInt(e.target.value, 10))}
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      >
                        <option value={0}>در انتظار پرداخت</option>
                        <option value={1}>در حال ساخت / آماده‌سازی</option>
                        <option value={2}>ارسال شده</option>
                        <option value={3}>تحویل شده</option>
                        <option value={4}>لغو شده</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 2: Special Orders */}
      {activeTab === "special" && (
        <div className="flex flex-col gap-4">
          {specialOrders.map((so) => (
            <div
              key={so.id}
              className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c211b]/10 pb-3">
                <div>
                  <span className="font-mono text-[11px] text-[#0284c7] font-bold">{so.orderNumber}</span>
                  <h3 className="font-bold text-base text-[#161A1D]">{so.title}</h3>
                  <span className="text-xs text-[#5A626A]">
                    مشتری: {so.customerName} ({so.customerPhone}) • تاریخ: {formatDate(so.createdAt)}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-3 py-1 rounded-full self-start sm:self-auto">
                  {so.statusText}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAF7F0] p-4 rounded-xl">
                <div>
                  <span className="text-[#5A626A]">فرآیند درخواستی:</span>
                  <p className="font-bold text-[#161A1D]">{so.category}</p>
                </div>
                <div>
                  <span className="text-[#5A626A]">متریال:</span>
                  <p className="font-bold text-[#161A1D]">{so.materialPreference || "نامشخص"}</p>
                </div>
                <div>
                  <span className="text-[#5A626A]">بودجه تقریبی:</span>
                  <p className="font-mono font-bold text-[#082719]">
                    {so.estimatedBudget ? formatPrice(so.estimatedBudget) : "مشخص نشده"}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#5A626A] leading-relaxed">
                <span className="font-bold text-[#161A1D]">توضیحات و شرح فنی: </span>
                {so.description}
              </div>

              {so.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-bold text-[#161A1D] w-full">فایل‌های ارسالی مشتری:</span>
                  {so.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE8DC] rounded-lg text-xs font-mono text-[#082719] hover:bg-[#dfc79b]"
                    >
                      <span>{img.originalFileName || "Technical-Drawing"}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Reply / Quote Box */}
              {replyingId === so.id ? (
                <div className="p-4 bg-gray-50 border rounded-xl flex flex-col gap-3 text-xs mt-2">
                  <span className="font-bold text-[#161A1D]">پاسخ کارشناسی و اعلام قیمت:</span>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="تحلیل DFM، زمان تحویل و شرایط فنی..."
                    className="w-full bg-white border p-3 rounded-lg text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="قیمت کارشناسی نهایی (تومان)"
                      className="bg-white border px-3 py-2 rounded-lg text-xs font-mono dir-ltr"
                    />
                    <button
                      onClick={() => handleReplySpecialOrder(so.id)}
                      className="bg-[#082719] text-white px-5 py-2 rounded-lg font-bold"
                    >
                      ثبت و ارسال به مشتری
                    </button>
                    <button
                      onClick={() => setReplyingId(null)}
                      className="text-gray-500 px-3 py-2"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t">
                  {so.adminReply ? (
                    <div className="text-xs text-emerald-800">
                      <span className="font-bold">پاسخ ثبت شده: </span>
                      {so.adminReply}
                      {so.quotedPrice && ` (${formatPrice(so.quotedPrice)})`}
                    </div>
                  ) : (
                    <span className="text-xs text-amber-700">هنوز پاسخی ثبت نشده است.</span>
                  )}
                  <button
                    onClick={() => {
                      setReplyingId(so.id);
                      setReplyText(so.adminReply || "");
                      setQuotedPrice(so.quotedPrice ? so.quotedPrice.toString() : "");
                    }}
                    className="text-xs font-bold text-[#082719] bg-[#EDE8DC] hover:bg-[#dfc79b] px-4 py-1.5 rounded-full transition-colors"
                  >
                    {so.adminReply ? "ویرایش پاسخ" : "ثبت پاسخ و قیمت"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content 3: Users */}
      {activeTab === "users" && (
        <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                <tr>
                  <th className="p-4">نام کاربر</th>
                  <th className="p-4">ایمیل</th>
                  <th className="p-4">تلفن</th>
                  <th className="p-4">نقش‌ها</th>
                  <th className="p-4">تعداد سفارشات</th>
                  <th className="p-4">تاریخ ثبت‌نام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c211b]/08">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF7F0] transition-colors">
                    <td className="p-4 font-bold text-[#161A1D]">{u.fullName}</td>
                    <td className="p-4 font-mono dir-ltr text-right">{u.email}</td>
                    <td className="p-4 font-mono dir-ltr text-right">{u.phoneNumber || "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {u.roles.map((r) => (
                          <span key={r} className="bg-[#EDE8DC] px-2 py-0.5 rounded text-[10px] font-bold">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold">{toPersianDigits(u.ordersCount)}</td>
                    <td className="p-4 text-[#5A626A]">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
