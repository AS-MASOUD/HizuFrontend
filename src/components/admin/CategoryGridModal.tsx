"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types";
import { X, Check, Hash } from "lucide-react";
import { toPersianDigits } from "@/lib/utils/formatters";

interface CategoryGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => Promise<void>;
  categoryToEdit: Category | null;
  parentCategories: Category[];
}

export default function CategoryGridModal({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
  parentCategories,
}: CategoryGridModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setCode(categoryToEdit.code || "");
      setDescription(categoryToEdit.description || "");
      setDisplayOrder(categoryToEdit.displayOrder ?? 0);
      setIsActive(categoryToEdit.isActive ?? true);
      setParentCategoryId(categoryToEdit.parentCategoryId);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setDisplayOrder(0);
      setIsActive(true);
      setParentCategoryId(undefined);
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await onSave({
        id: categoryToEdit ? categoryToEdit.id : undefined,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        displayOrder: Number(displayOrder) || 0,
        isActive,
        parentCategoryId: parentCategoryId ? Number(parentCategoryId) : undefined,
      });
      onClose();
    } catch (err) {
      // Error is handled by caller toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="card-popup relative w-full max-w-lg rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#082719] text-[#dfc79b] flex items-center justify-center font-mono font-bold text-sm">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#161A1D]">
                {categoryToEdit ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
              </h3>
              {categoryToEdit && (
                <span className="text-[11px] font-mono text-[#0284c7]">
                  شناسه ردیف: #{toPersianDigits(categoryToEdit.id)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#5A626A] hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
          {categoryToEdit && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="font-semibold">شناسه عددی دسته‌بندی (ID):</span>
              <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-md border border-emerald-300">
                {categoryToEdit.id}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">نام دسته‌بندی *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: پرینت سه‌بعدی صنعتی"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">
                کد اختصاری مهندسی *{" "}
                <span className="text-[10px] text-[#5A626A]">(برای پیش‌شماره SKU)</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثلاً: 3DP یا CNC"
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#161A1D]">توضیحات دسته‌بندی</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کوتاه فنی در مورد فرآیندها و کاربرد این دسته..."
              className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">دسته‌بندی والد (اختیاری)</label>
              <select
                value={parentCategoryId ?? ""}
                onChange={(e) =>
                  setParentCategoryId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
              >
                <option value="">دسته‌بندی اصلی (بدون والد)</option>
                {parentCategories
                  .filter((c) => !categoryToEdit || c.id !== categoryToEdit.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (کد: {c.code} / شناسه: {c.id})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#161A1D]">ترتیب نمایش در فهرست</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#161A1D] focus:outline-none focus:border-[#082719]"
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#082719]"></div>
            </label>
            <span className="text-xs font-semibold text-[#161A1D]">
              وضعیت انتشار دسته‌بندی در کاتالوگ فروشگاه (فعال)
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c211b]/10 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 text-[#5A626A] hover:bg-gray-100 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#16191d] text-white px-6 py-2 rounded-full font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#dfc79b]" />
              <span>{submitting ? "در حال ذخیره..." : "ذخیره دسته‌بندی"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
