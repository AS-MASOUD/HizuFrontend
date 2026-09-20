"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductDto, Category } from "@/types";
import { productsApi } from "@/lib/api/products";
import { optimizeProductImage } from "@/lib/utils/imageOptimizer";
import { useToast } from "@/providers/ToastProvider";
import {
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  Layers,
  Wrench,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
  productToEdit: ProductDto | null;
  categories: Category[];
}

export default function ProductEditorModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}: ProductEditorModalProps) {
  const { error: toastError, success: toastSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">("");
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Technical Attributes
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [technique, setTechnique] = useState("");
  const [tolerance, setTolerance] = useState("");

  // Images state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setCategoryId(productToEdit.categoryId || (categories[0]?.id ?? 0));
      setSku(productToEdit.sku || "");
      setPrice(productToEdit.price ?? 0);
      setCompareAtPrice(productToEdit.compareAtPrice ?? "");
      setStockQuantity(productToEdit.stockQuantity ?? 0);
      setShortDescription(productToEdit.shortDescription || "");
      setDescription(productToEdit.description || "");
      setIsActive(productToEdit.isActive ?? true);
      setIsFeatured(productToEdit.isFeatured ?? false);

      setDimensions(productToEdit.dimensions || "");
      setMaterial(productToEdit.material || "");
      setColor(productToEdit.color || "");
      setWeight(productToEdit.weight || "");
      setTechnique(productToEdit.technique || "");
      setTolerance(productToEdit.tolerance || "");

      const existingImages = productToEdit.images?.map((i) => i.imageUrl) || [];
      if (productToEdit.imageUrl && !existingImages.includes(productToEdit.imageUrl)) {
        existingImages.unshift(productToEdit.imageUrl);
      }
      setImageUrls(existingImages);
      setPrimaryImageUrl(productToEdit.imageUrl || existingImages[0] || "");
    } else {
      setName("");
      setCategoryId(categories[0]?.id ?? 0);
      setSku("");
      setPrice("");
      setCompareAtPrice("");
      setStockQuantity(10);
      setShortDescription("");
      setDescription("");
      setIsActive(true);
      setIsFeatured(false);

      setDimensions("");
      setMaterial("");
      setColor("");
      setWeight("");
      setTechnique("");
      setTolerance("");

      setImageUrls([]);
      setPrimaryImageUrl("");
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  // Handle local file uploads with smart WebP compression
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Client-side canvas resize & WebP compression
        const optimizedFile = await optimizeProductImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
        });

        // 2. Upload optimized file
        const res = await productsApi.uploadImage(optimizedFile);
        if (res.imageUrl) {
          uploadedUrls.push(res.imageUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        if (!primaryImageUrl) {
          setPrimaryImageUrl(uploadedUrls[0]);
        }
        toastSuccess(`${uploadedUrls.length} تصویر با فشرده‌سازی خودکار وب‌پ بارگذاری شد.`);
      }
    } catch (err: any) {
      toastError(err.message || "خطا در بهینه‌سازی و بارگذاری تصاویر.");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = imageUrls[indexToRemove];
    const newUrls = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(newUrls);
    if (primaryImageUrl === removedUrl) {
      setPrimaryImageUrl(newUrls[0] || "");
    }
  };

  const handleSetPrimaryImage = (url: string) => {
    setPrimaryImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toastError("لطفاً نام قطعه را وارد کنید.");
      return;
    }
    if (price === "" || Number(price) < 0) {
      toastError("لطفاً قیمت معتبر وارد کنید.");
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        id: productToEdit ? productToEdit.id : undefined,
        name: name.trim(),
        categoryId: Number(categoryId),
        sku: sku.trim() || undefined, // Optional: backend generates automated SKU if empty!
        price: Number(price),
        compareAtPrice: compareAtPrice !== "" ? Number(compareAtPrice) : undefined,
        stockQuantity: Number(stockQuantity) || 0,
        imageUrl: primaryImageUrl || imageUrls[0] || undefined,
        imageUrls: imageUrls,
        isActive,
        isFeatured,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || "",
        dimensions: dimensions.trim() || undefined,
        material: material.trim() || undefined,
        color: color.trim() || undefined,
        weight: weight.trim() || undefined,
        technique: technique.trim() || undefined,
        tolerance: tolerance.trim() || undefined,
      });
      onClose();
    } catch (err) {
      // Error handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="card-popup relative w-full max-w-4xl rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#161A1D]">
                {productToEdit ? `ویرایش قطعه: ${productToEdit.name}` : "افزودن قطعه / محصول جدید"}
              </h3>
              <p className="text-[11px] text-[#5A626A]">
                مشخصات فنی، متریال، قیمت‌گذاری و بارگذاری بهینه تصاویر محصول
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5A626A] hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          {/* Main Info */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-[#161A1D] flex items-center gap-1.5 border-b pb-1.5">
              <span>اطلاعات عمومی و دسته‌بندی</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">نام کامل قطعه یا محصول *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: براکت هدایت کابل آلومینیومی CNC"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">دسته‌بندی ساخت *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  required
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (کد: {c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">
                  کد فنی SKU{" "}
                  <span className="text-[10px] text-[#0284c7] font-normal">
                    (اختیاری - خودکار)
                  </span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="در صورت خالی بودن خودکار تولید می‌شود"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">قیمت فروش (تومان) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="250000"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">قیمت قبل از تخفیف (اختیاری)</label>
                <input
                  type="number"
                  min={0}
                  value={compareAtPrice}
                  onChange={(e) =>
                    setCompareAtPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="300000"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">موجودی انبار (عدد) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-[#161A1D] flex items-center gap-1.5 border-b pb-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#8f6d2f]" />
              <span>مشخصات فنی و فیزیکی قطعه (ابعاد، رنگ، متریال و...)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">ابعاد (L×W×H)</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="120×85×40 mm"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs font-mono dir-ltr text-[#161A1D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">متریال ساخت</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="PLA-CF / Al 6061-T6"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#161A1D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">رنگ / پوشش</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="مشکی مات / آنودایز"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#161A1D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">وزن قطعه</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="145 gr"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs font-mono dir-ltr text-[#161A1D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">روش تولید</label>
                <input
                  type="text"
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  placeholder="FDM صنعتی / فرز CNC"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#161A1D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#161A1D]">تلرانس مجاز</label>
                <input
                  type="text"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                  placeholder="±0.1 mm"
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5 text-xs font-mono dir-ltr text-[#161A1D]"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">خلاصه کوتاه قطعه (در کارت محصول)</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="توضیح تک‌خطی کوتاه در مورد عملکرد قطعه..."
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">توضیحات و مشخصات فنی کامل</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="تحلیل استرس، کاربردهای پیشنهادی، شرایط نصب..."
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D]"
              />
            </div>
          </div>

          {/* Product Images & Attachment */}
          <div className="flex flex-col gap-3 p-4 bg-[#FAF7F0] rounded-2xl border border-[#1c211b]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#161A1D] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#082719]" />
                  <span>گالری تصاویر محصول (پیوست فایل محلی)</span>
                </h4>
                <p className="text-[11px] text-[#5A626A]">
                  تصاویر پیش از ارسال در مرورگر به ابعاد ۱۶۰۰ پیکسل و فرمت WebP فشرده می‌شوند تا حجم سرور و اینترنت بیهوده مصرف نشود.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImages}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#082719] text-white font-bold text-xs hover:bg-[#16191d] transition-all shadow-sm disabled:opacity-50"
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال بهینه‌سازی و آپلود...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-[#dfc79b]" />
                      <span>+ پیوست و آپلود تصاویر محلی</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Images Grid */}
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {imageUrls.map((url, idx) => {
                  const isPrimary = url === primaryImageUrl;
                  return (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 bg-white flex flex-col transition-all ${
                        isPrimary ? "border-[#082719] shadow-md" : "border-gray-200"
                      }`}
                    >
                      <div className="h-24 w-full overflow-hidden bg-gray-100 relative">
                        <img
                          src={url}
                          alt={`Product preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isPrimary && (
                          <span className="absolute top-1 right-1 bg-[#082719] text-[#dfc79b] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            شاخص
                          </span>
                        )}
                      </div>
                      <div className="p-1.5 flex items-center justify-between bg-white border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(url)}
                          className={`text-[10px] flex items-center gap-0.5 font-bold ${
                            isPrimary
                              ? "text-[#082719]"
                              : "text-gray-400 hover:text-[#082719]"
                          }`}
                          title="تنظیم به عنوان تصویر اصلی"
                        >
                          <Star className={`w-3 h-3 ${isPrimary ? "fill-[#082719]" : ""}`} />
                          <span>شاخص</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="حذف این تصویر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-400 border border-dashed border-gray-300 rounded-xl bg-white/50 text-[11px]">
                هنوز تصویری پیوست نشده است. بر روی دکمه «پیوست و آپلود تصاویر محلی» کلیک کنید.
              </div>
            )}
          </div>

          {/* Checkboxes: Active & Featured */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#161A1D]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#082719] focus:ring-0"
              />
              <span>نمایش در فروشگاه (فعال)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#161A1D]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#082719] focus:ring-0"
              />
              <span>محصول ویژه (نمایش در صفحه اول)</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c211b]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-gray-300 text-[#5A626A] hover:bg-gray-100 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImages || !name.trim()}
              className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-7 py-2.5 rounded-full font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#dfc79b]" />
              <span>{submitting ? "در حال ثبت اطلاعات..." : "ذخیره محصول"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
