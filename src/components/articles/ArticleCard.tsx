"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate, toPersianDigits } from "@/lib/utils/formatters";
import { Clock, ArrowLeft, Eye, Tag } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <div className="group relative card-popup rounded-3xl overflow-hidden bg-white border border-[#1c211b]/12 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Cover image */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden bg-[#FAF7F0]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#082719]/90 backdrop-blur-md text-[#dfc79b] text-xs font-bold shadow-md border border-[#dfc79b]/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                مقاله برگزیده کارگاه
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 flex-wrap text-xs text-[#5A626A]">
                <span className="px-3 py-1 rounded-full bg-[#EDE8DC] text-[#082719] font-bold border border-[#1c211b]/10">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#8f6d2f]" />
                  {toPersianDigits(article.readTimeMinutes)} دقیقه مطالعه
                </span>
                <span>•</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>

              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#161A1D] group-hover:text-[#082719] transition-colors leading-tight" style={{ textWrap: "balance" } as any}>
                  {article.title}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-[#5A626A] leading-relaxed line-clamp-3 sm:line-clamp-4">
                {article.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1c211b]/08">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold text-xs shadow-xs">
                  {article.author.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#161A1D]">{article.author}</span>
                  <span className="text-[10px] text-[#5A626A]">{article.authorRole || "استودیو هیزو"}</span>
                </div>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-colors shadow-sm interactive-bump"
              >
                <span>مطالعه مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5 text-[#dfc79b]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#FAF7F0]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md text-[#082719] text-[11px] font-bold shadow-xs border border-[#1c211b]/10">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-[#5A626A]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#8f6d2f]" />
              {toPersianDigits(article.readTimeMinutes)} دقیقه
            </span>
            <span>{formatDate(article.createdAt)}</span>
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h3 className="font-bold text-base text-[#161A1D] group-hover:text-[#082719] transition-colors line-clamp-2 leading-snug" style={{ textWrap: "balance" } as any}>
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-[#5A626A] line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Footer / Author info */}
      <div className="p-5 pt-3 border-t border-[#1c211b]/08 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#EDE8DC] text-[#082719] flex items-center justify-center font-bold text-[11px]">
            {article.author.charAt(0)}
          </div>
          <span className="text-xs text-[#5A626A] font-medium">{article.author}</span>
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#082719] group-hover:text-[#0284c7] transition-colors"
        >
          <span>ادامه</span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
