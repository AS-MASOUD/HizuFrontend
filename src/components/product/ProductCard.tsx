"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductListDto } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/providers/CartProvider";
import { ShoppingBag, ArrowLeft } from "lucide-react";

interface ProductCardProps {
  product: ProductListDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading } = useCart();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  return (
    <div className="card-popup card-popup-hover rounded-2xl overflow-hidden group flex flex-col justify-between relative border border-[#1c211b]/10 bg-white shadow-[0_14px_34px_-6px_rgba(28,33,27,0.08)]">
      <div>
        {/* Image Container with Badges */}
        <Link href={`/product/${product.slug}`} className="relative block w-full h-56 overflow-hidden bg-[#16191d]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EDE8DC] text-[#5A626A] font-mono text-sm">
              HIZU STUDIO
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16191d]/80 via-transparent to-transparent pointer-events-none" />

          {/* Material / Sku Tag */}
          <div className="absolute top-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#1c211b]/15 text-[#161A1D] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm">
            {product.material || product.sku}
          </div>

          {/* Tolerance Badge */}
          {product.tolerance && (
            <div className="absolute bottom-2 left-3 font-mono text-[10px] text-[#dfc79b] dir-ltr">
              TOL: {product.tolerance}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#5A626A]">
            <span>{product.categoryName}</span>
            <span className="font-mono text-[10px] text-[#0284c7]">{product.technique || "FABRICATED"}</span>
          </div>

          <Link href={`/product/${product.slug}`} className="group-hover:text-[#082719] transition-colors">
            <h3 className="font-bold text-base text-[#161A1D] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-[#5A626A] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="p-5 pt-0 mt-auto flex items-center justify-between gap-4 border-t border-[#1c211b]/05 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#5A626A]">قیمت قطعه:</span>
          <span className="font-bold text-sm text-[#082719] font-mono">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={loading || product.stockQuantity === 0}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
            product.stockQuantity === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#EDE8DC] hover:bg-[#082719] text-[#161A1D] hover:text-[#FFFFFF] border border-[#1c211b]/10"
          }`}
          title={product.stockQuantity === 0 ? "ناموجود" : "افزودن به سبد خرید"}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.stockQuantity === 0 ? "ناموجود" : "خرید"}</span>
        </button>
      </div>
    </div>
  );
}
