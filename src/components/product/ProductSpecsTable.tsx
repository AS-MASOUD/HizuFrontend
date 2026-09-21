import React from "react";
import { ProductDto } from "@/types";
import { toEnglishDigits } from "@/lib/utils/formatters";

interface ProductSpecsTableProps {
  product: ProductDto;
}

export default function ProductSpecsTable({ product }: ProductSpecsTableProps) {
  const specs = [
    { label: "کد فنی / SKU", value: product.sku, isMono: true },
    { label: "متریال مهندسی", value: product.material },
    { label: "فرآیند تولید", value: product.technique },
    { label: "تلرانس ابعادی", value: product.tolerance, isMono: true },
    { label: "ابعاد فیزیکی (L×W×H)", value: product.dimensions, isMono: true },
    { label: "وزن خالص", value: product.weight, isMono: true },
    { label: "رنگ / فینیشینگ", value: product.color },
    { label: "دسته‌بندی اصلی", value: product.categoryName },
  ].filter((s) => Boolean(s.value));

  return (
    <div className="card-popup rounded-2xl overflow-hidden border border-[#1c211b]/10 bg-white">
      <div className="bg-[#EFE9DC] px-5 py-3 border-b border-[#1c211b]/10 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-[#5A4A3A] tracking-wider uppercase">
          SPECIFICATION // TECHNICAL DATASHEET
        </span>
        <span className="font-mono text-[10px] text-[#0284c7] font-bold">ISO 2768-M</span>
      </div>
      <div className="divide-y divide-[#1c211b]/08">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-3 px-5 py-3 text-xs transition-colors ${
              idx % 2 === 0 ? "bg-[#FAF7F0]/50" : "bg-white"
            }`}
          >
            <span className="text-[#5A626A] font-medium col-span-1">{item.label}</span>
            <span
              className={`text-[#161A1D] font-semibold col-span-2 ${
                item.isMono ? "font-mono dir-ltr text-right" : ""
              }`}
            >
              {toEnglishDigits(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
