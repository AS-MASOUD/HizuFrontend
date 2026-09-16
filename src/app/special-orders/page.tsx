"use client";

import React, { useState } from "react";
import { specialOrdersApi } from "@/lib/api/specialOrders";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { Upload, FileCode, CheckCircle2, ArrowLeft, ShieldCheck, Wrench, FileCheck } from "lucide-react";

export default function SpecialOrdersPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ماشین‌کاری CNC");
  const [materialPreference, setMaterialPreference] = useState("آلومینیوم 7075 (AL-7075-T6)");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ imageUrl: string; originalFileName?: string; fileSizeBytes: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await specialOrdersApi.uploadFile(file);
        setUploadedFiles((prev) => [...prev, res]);
      }
      success("فایل با موفقیت در سرور بارگذاری شد.");
    } catch (err: any) {
      error(err.message || "خطا در بارگذاری فایل.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !title.trim() || !description.trim()) {
      error("لطفاً تمامی فیلدهای الزامی (*) را تکمیل نمایید.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await specialOrdersApi.create({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        title: title.trim(),
        category,
        materialPreference: materialPreference.trim() || undefined,
        description: description.trim(),
        estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : undefined,
        uploadedFiles,
      });

      setSubmittedOrder(res);
      success("درخواست ساخت سفارشی شما با موفقیت ثبت شد.");
    } catch (err: any) {
      error(err.message || "خطا در ثبت درخواست ساخت.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="card-popup rounded-2xl p-10 sm:p-12 bg-white border border-[#1c211b]/10 flex flex-col items-center gap-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#161A1D]">درخواست ساخت با موفقیت ثبت گردید</h1>
            <p className="text-xs sm:text-sm text-[#5A626A] mt-2">
              تیم فنی و مهندسی هیزو فایل‌های شما را از نظر الزامات DFM، زمان ماشین‌کاری و هزینه ساخت بررسی کرده و به زودی با شما تماس خواهند گرفت.
            </p>
          </div>

          <div className="w-full bg-[#FAF7F0] border border-[#1c211b]/10 rounded-xl p-5 text-right flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">کد پیگیری پروژه:</span>
              <span className="font-mono font-bold text-[#082719] text-sm">{submittedOrder.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">عنوان سفارش:</span>
              <span className="font-bold text-[#161A1D]">{submittedOrder.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A626A]">سرویس انتخابی:</span>
              <span>{submittedOrder.category}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedOrder(null);
              setTitle("");
              setDescription("");
              setUploadedFiles([]);
            }}
            className="inline-flex items-center gap-2 bg-[#082719] text-white px-7 py-3 rounded-full text-xs font-bold shadow-md"
          >
            <span>ثبت پروژه یا قطعه جدید</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-[#1c211b]/10 pb-6">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8f6d2f] uppercase tracking-wider mb-1">
          [ CUSTOM FABRICATION // RFQ SERVICE ]
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#161A1D]">
          ثبت سفارش ساخت فوری و استعلام قیمت
        </h1>
        <p className="text-sm text-[#5A626A] mt-1 leading-relaxed max-w-2xl">
          فایل‌های سه‌بعدی (CAD)، فایل برش (DXF) یا مشخصات قطعه مورد نظر خود را بارگذاری کنید تا کارشناسان آتلیه هیزو پس از ارزیابی تلورانس و فرآیند ساخت، پیش‌فاکتور دقیق را ارسال نمایند.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-popup rounded-2xl p-6 sm:p-10 bg-white border border-[#1c211b]/10 flex flex-col gap-6 shadow-md">
        <h2 className="font-bold text-base text-[#161A1D] border-b border-[#1c211b]/10 pb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#0284c7]" />
          <span>مشخصات فنی و درخواست ساخت</span>
        </h2>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">نام و نام خانوادگی *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="مثال: مهندس رادین کیانی"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">شماره همراه (جهت تماس فنی) *</label>
            <input
              type="text"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="09121234567"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">ایمیل (جهت ارسال فایل فاکتور)</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="cad@company.com"
            />
          </div>
        </div>

        {/* Project Type & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">عنوان پروژه / نام قطعه *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="مثال: فلنج آلومینیومی موتور براشلس"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">تکنولوژی و فرآیند ساخت مورد نیاز *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719] cursor-pointer"
            >
              <option value="ماشین‌کاری CNC">فرزکاری و ماشین‌کاری ۵ محوره CNC</option>
              <option value="پرینت ۳بعدی صنعتی">پرینت ۳بعدی صنعتی (FDM / SLA / SLS)</option>
              <option value="برش و حکاکی لیزر">برش لیزر فایبر / CO2 دقیق</option>
              <option value="ساخت ماشین‌آلات">طراحی و ساخت مکاترونیک و ماشین‌آلات</option>
              <option value="مهندسی معکوس">مهندسی معکوس، اسکن نوری و مدلسازی DFM</option>
              <option value="سایر">سایر فرآیندهای ترکیبی</option>
            </select>
          </div>
        </div>

        {/* Material & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">متریال درخواستی (آلیاژ / چوب / پلیمر)</label>
            <input
              type="text"
              value={materialPreference}
              onChange={(e) => setMaterialPreference(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="مثال: برنج C360، آلومینیوم 7075، استیل 304، PA12 کربن..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#161A1D]">بودجه تقریبی (تومان) — اختیاری</label>
            <input
              type="number"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
              placeholder="مثال: 5000000"
            />
          </div>
        </div>

        {/* Detailed description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#161A1D]">
            شرح مشخصات فنی، تلورانس‌ها و تیراژ مورد نیاز *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
            placeholder="تلرانس ابعادی مورد نظر (مثلاً ±0.02)، نوع پرداخت سطحی (آنودایز، سندبلاست، پولیش)، تیراژ و زمان‌بندی تحویل مورد نیاز را یادداشت فرمایید..."
          />
        </div>

        {/* File Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#161A1D]">
            بارگذاری فایل‌های فنی (.STEP / .IGES / .DXF / .STL / PDF / عکس نقشه)
          </label>

          <label className="border-2 border-dashed border-[#1c211b]/20 hover:border-[#082719] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#FAF7F0] cursor-pointer transition-colors">
            <Upload className="w-6 h-6 text-[#0284c7]" />
            <span className="text-xs font-bold text-[#161A1D]">
              {uploading ? "در حال بارگذاری فایل روی سرور..." : "انتخاب یا کشیدن فایل به این قسمت"}
            </span>
            <span className="font-mono text-[10px] text-[#5A626A]">
              حداکثر حجم مجاز: ۵۰ مگابایت
            </span>
            <input
              type="file"
              multiple
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 bg-[#EDE8DC] border border-[#1c211b]/10 rounded-full px-3 py-1 text-xs text-[#161A1D]"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-mono text-[11px] truncate max-w-[200px]">
                    {file.originalFileName || "Technical-File"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#EDE8DC]/50 border border-[#1c211b]/10 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8f6d2f] shrink-0" />
          <span className="text-xs text-[#5A626A]">
            کلیه فایل‌ها و نقشه‌های فنی ارسالی تحت قرارداد عدم افشا (NDA) و مالکیت معنوی شما در سرورهای هیزو محفوظ می‌مانند.
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center justify-center gap-2.5 bg-[#082719] hover:bg-[#16191d] text-white py-4 px-8 rounded-full text-sm font-bold shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <span>{submitting ? "درحال ارسال درخواست..." : "ثبت نهایی درخواست ساخت و استعلام"}</span>
          <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
        </button>
      </form>
    </div>
  );
}
