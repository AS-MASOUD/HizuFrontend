"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { ordersApi } from "@/lib/api/orders";
import { specialOrdersApi } from "@/lib/api/specialOrders";
import { OrderSummary, SpecialOrder } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { User, Package, Wrench, LogOut, Save, FileText, CheckCircle2, Clock } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "special">("orders");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [specialOrders, setSpecialOrders] = useState<SpecialOrder[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Profile Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhoneNumber(user.phoneNumber || "");
      if (user.address) {
        setStreet(user.address.street || "");
        setCity(user.address.city || "");
        setState(user.address.state || "");
        setZipCode(user.address.zipCode || "");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingData(true);
    Promise.all([ordersApi.getMyOrders(), specialOrdersApi.getMy()])
      .then(([ordersData, specialData]) => {
        setOrders(ordersData);
        setSpecialOrders(specialData);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: "ایران",
        },
      });
      success("مشخصات حساب شما با موفقیت بروزرسانی شد.");
    } catch (err: any) {
      error(err.message || "خطا در بروزرسانی پروفایل.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return <div className="max-w-7xl mx-auto px-6 py-20 text-center font-mono">LOADING PROFILE...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Account Header */}
      <div className="card-popup rounded-2xl p-6 sm:p-8 bg-white border border-[#1c211b]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#082719] flex items-center justify-center text-[#dfc79b] font-mono font-black text-2xl shadow-md">
            {user?.firstName ? user.firstName[0] : "H"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-[#161A1D]">{user?.fullName || "کاربر هیزو"}</h1>
            <span className="font-mono text-xs text-[#5A626A]">{user?.email}</span>
            <div className="flex items-center gap-2 mt-1">
              {user?.roles?.map((r) => (
                <span key={r} className="text-[10px] font-bold bg-[#EDE8DC] text-[#161A1D] px-2 py-0.5 rounded">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج از حساب</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c211b]/10 pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "orders"
              ? "bg-[#082719] text-white shadow-sm"
              : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>سفارش‌های خرید ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("special")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "special"
              ? "bg-[#082719] text-white shadow-sm"
              : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>پروژه‌های ساخت سفارشی ({specialOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "profile"
              ? "bg-[#082719] text-white shadow-sm"
              : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>اطلاعات فردی و نشانی</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-4">
          {loadingData ? (
            <div className="card-popup rounded-2xl p-10 text-center font-mono bg-white">بارگذاری سفارش‌ها...</div>
          ) : orders.length > 0 ? (
            orders.map((o) => (
              <div
                key={o.id}
                className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#161A1D]">{o.orderNumber}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {o.statusText}
                    </span>
                  </div>
                  <span className="text-xs text-[#5A626A]">
                    ثبت شده در: {formatDate(o.createdAt)} • تعداد: {o.itemCount} قلم
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-base text-[#082719]">{formatPrice(o.total)}</span>
                  <button
                    onClick={() => router.push(`/order-success/${o.id}`)}
                    className="text-xs font-bold text-[#082719] bg-[#EDE8DC] hover:bg-[#dfc79b] px-4 py-2 rounded-full transition-colors"
                  >
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card-popup rounded-2xl p-12 text-center bg-white text-[#5A626A]">
              شما تاکنون سفارشی ثبت نکرده‌اید.
            </div>
          )}
        </div>
      )}

      {activeTab === "special" && (
        <div className="flex flex-col gap-4">
          {loadingData ? (
            <div className="card-popup rounded-2xl p-10 text-center font-mono bg-white">بارگذاری پروژه‌ها...</div>
          ) : specialOrders.length > 0 ? (
            specialOrders.map((so) => (
              <div
                key={so.id}
                className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c211b]/10 pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-[#0284c7] font-bold">{so.orderNumber}</span>
                    <h3 className="font-bold text-base text-[#161A1D]">{so.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-3 py-1 rounded-full self-start sm:self-auto">
                    {so.statusText}
                  </span>
                </div>

                <div className="text-xs text-[#5A626A] leading-relaxed">
                  {so.description}
                </div>

                {so.materialPreference && (
                  <div className="text-xs">
                    <span className="text-[#5A626A]">متریال درخواستی: </span>
                    <span className="font-bold text-[#161A1D]">{so.materialPreference}</span>
                  </div>
                )}

                {so.adminReply && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>پاسخ کارگاه و برآورد هزینه:</span>
                    </span>
                    <p className="text-emerald-800 leading-relaxed">{so.adminReply}</p>
                    {so.quotedPrice && (
                      <span className="font-mono font-black text-emerald-900 pt-1">
                        قیمت کارشناسی: {formatPrice(so.quotedPrice)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card-popup rounded-2xl p-12 text-center bg-white text-[#5A626A]">
              شما تاکنون استعلام ساختی ثبت نکرده‌اید.
            </div>
          )}
        </div>
      )}

      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSubmit}
          className="card-popup rounded-2xl p-6 sm:p-8 bg-white border border-[#1c211b]/10 flex flex-col gap-6"
        >
          <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3">
            ویرایش مشخصات شخصی و آدرس پیش‌فرض
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">نام</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">نام خانوادگی</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">شماره همراه</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">استان</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">شهر</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#161A1D]">کد پستی</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">نشانی دقیق پستی</label>
            <textarea
              rows={3}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="self-start inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updating ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
