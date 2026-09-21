"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/types";
import { articlesApi } from "@/lib/api/articles";
import ArticleCard from "@/components/articles/ArticleCard";
import { Search, Sparkles, BookOpen, Layers, Filter, ArrowLeft, Wrench } from "lucide-react";

export default function ArticlesHubPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");

  const categories = [
    "همه",
    "پرینت 3بعدی",
    "متریال و فیلامنت",
    "طراحی محصول",
    "تکنولوژی و اخبار",
  ];

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getArticles({
        category: selectedCategory === "همه" ? undefined : selectedCategory,
        onlyPublished: true,
      });
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const regularArticles = filteredArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#082719] via-[#103825] to-[#162b20] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-[#082719]/40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#dfc79b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-[#dfc79b] self-start">
            <BookOpen className="w-3.5 h-3.5" />
            <span>HIZU DIGITAL FABRICATION JOURNAL // مرکز دانش و تکنولوژی</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            مقالات تخصصی، تکنولوژی پرینت 3بعدی و مهندسی ساخت
          </h1>

          <p className="text-sm sm:text-base text-[#FCF9F1]/85 leading-relaxed">
            راهنماهای جامع متریال‌ها، مقایسه فیلامنت‌های صنعتی، استانداردهای DFM و تحلیل‌های مهندسی بر پایه تجربیات عملی کارگاه ساخت و آتلیه هیزو.
          </p>

          {/* Quick Search */}
          <div className="pt-4 max-w-xl">
            <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-sm text-white shadow-inner focus-within:bg-white focus-within:text-[#161A1D] transition-all">
              <Search className="w-5 h-5 ml-3 shrink-0 text-[#dfc79b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در مقالات (مثال: فیلامنت PLA، DFM، فرزکاری CNC، تلورانس)..."
                className="bg-transparent border-0 p-0 text-xs sm:text-sm text-inherit placeholder:text-white/60 focus:outline-none focus:ring-0 w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white"
                >
                  پاکسازی
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 pl-2 text-xs font-bold text-[#5A626A] shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#082719]" />
          <span>دسته‌بندی:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#082719] text-white shadow-sm border border-[#082719]"
                : "bg-white text-[#5A626A] hover:text-[#161A1D] hover:bg-[#EDE8DC] border border-[#1c211b]/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#082719] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-mono text-[#5A626A]">در حال فراخوانی مقالات تخصصی هیزو...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        /* Empty State */
        <div className="card-popup rounded-3xl p-12 text-center bg-white border border-[#1c211b]/10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] flex items-center justify-center text-[#8f6d2f]">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#161A1D]">مقاله‌ای با این مشخصات یافت نشد</h3>
          <p className="text-xs text-[#5A626A] max-w-md">
            عبارت جستجو شده یا فیلتر دسته‌بندی با مقالات موجود همخوانی نداشت. می‌توانید عبارت دیگری را امتحان کنید یا فیلترها را ریست نمایید.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("همه");
            }}
            className="px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-colors shadow-xs"
          >
            نمایش تمامی مقالات
          </button>
        </div>
      ) : (
        /* Articles Presentation */
        <div className="flex flex-col gap-10">
          {/* Featured Article */}
          {featuredArticle && !searchQuery && (
            <div className="flex flex-col gap-4">
              <ArticleCard article={featuredArticle} featured={true} />
            </div>
          )}

          {/* Grid of Other Articles */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-3">
              <h2 className="text-xl font-black text-[#161A1D]">
                {searchQuery ? `نتایج جستجو (${filteredArticles.length} مورد)` : "آخرین مقالات و یادداشت‌های فنی"}
              </h2>
              <span className="text-xs font-mono text-[#5A626A]">
                HIZU TECH ARTICLES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery ? filteredArticles : regularArticles).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workshop Prototyping CTA Banner */}
      <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#FAF7F0] via-[#F3EFE6] to-[#EDE8DC] border-2 border-[#1c211b]/10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold shadow-md shrink-0">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-black text-[#161A1D]">
              ایده یا پروژه‌ای برای ساخت دارید؟
            </h3>
            <p className="text-xs text-[#5A626A] mt-1 leading-relaxed">
              فایل‌های CAD یا طرح‌های صنعتی خود را ارسال کنید تا فرآیند بهینه ساخت (پرینت 3بعدی، CNC یا برش لیزر) و هزینه دقیق استعلام شود.
            </p>
          </div>
        </div>

        <Link
          href="/special-orders"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#082719] text-[#FCF9F1] text-xs font-bold hover:bg-[#162b20] transition-colors shadow-md interactive-bump glaze-shimmer"
        >
          <span>ثبت سفارش و استعلام فوری</span>
          <ArrowLeft className="w-4 h-4 text-[#dfc79b]" />
        </Link>
      </div>
    </div>
  );
}
