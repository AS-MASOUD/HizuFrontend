"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Article } from "@/types";
import { articlesApi } from "@/lib/api/articles";
import { formatDate, toPersianDigits } from "@/lib/utils/formatters";
import { useToast } from "@/providers/ToastProvider";
import ArticleCard from "@/components/articles/ArticleCard";
import {
  Clock,
  Calendar,
  Share2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Tag,
  User,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

// Clean lightweight renderer for rich article content
function renderRichContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];
  let isNumberedList = false;

  const flushTable = (key: string) => {
    if (inTable && tableHeader.length > 0) {
      elements.push(
        <div key={key} className="overflow-x-auto my-6 rounded-2xl border border-[#1c211b]/12 shadow-xs bg-white">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF7F0] border-b border-[#1c211b]/10 text-[#082719] font-bold">
              <tr>
                {tableHeader.map((th, i) => (
                  <th key={i} className="p-3.5 sm:p-4 font-bold border-l last:border-l-0 border-[#1c211b]/08">
                    {th.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c211b]/08 font-mono">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3.5 sm:p-4 text-[#161A1D] border-l last:border-l-0 border-[#1c211b]/08">
                      {cell.trim().replace(/\*\*(.*?)\*\*/g, "$1")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={key} className="list-decimal list-inside my-4 space-y-2 text-xs sm:text-sm text-[#333C44] leading-relaxed pr-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="font-normal">
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key} className="space-y-2 my-4 text-xs sm:text-sm text-[#333C44] leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#082719] mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
      }
      inList = false;
      listItems = [];
      isNumberedList = false;
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#161A1D]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-[#5A626A]">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#FAF7F0] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#082719] border border-[#1c211b]/10">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Check if it's separator line |:---|:---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        flushList(`list-before-table-${i}`);
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    // List detection
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        inList = true;
        isNumberedList = false;
      }
      listItems.push(trimmed.slice(2));
      continue;
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        inList = true;
        isNumberedList = true;
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    } else if (inList) {
      flushList(`list-${i}`);
    }

    // Empty lines
    if (!trimmed) {
      continue;
    }

    // Dividers
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-t border-[#1c211b]/10" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-black text-[#161A1D] mt-8 mb-4 border-b border-[#1c211b]/10 pb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-[#082719]" />
          <span>{trimmed.slice(3)}</span>
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-[#161A1D] mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-base font-bold text-[#082719] mt-5 mb-2">
          {trimmed.slice(5)}
        </h4>
      );
      continue;
    }

    // Callout / Alert blockquotes
    if (trimmed.startsWith("> [!NOTE]") || trimmed.startsWith("> [!TIP]") || trimmed.startsWith("> [!IMPORTANT]") || trimmed.startsWith("> ")) {
      const isTip = trimmed.includes("[!TIP]");
      const isImportant = trimmed.includes("[!IMPORTANT]");
      const cleanText = trimmed
        .replace(/^>\s*(\[!NOTE\]|\[!TIP\]|\[!IMPORTANT\])?\s*/i, "")
        .trim();

      elements.push(
        <div
          key={`alert-${i}`}
          className={`my-6 p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 shadow-xs ${
            isTip
              ? "bg-amber-50/70 border-amber-200 text-amber-950"
              : isImportant
              ? "bg-rose-50/70 border-rose-200 text-rose-950"
              : "bg-[#EDE8DC]/50 border-[#1c211b]/15 text-[#161A1D]"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-[#082719] mt-2 shrink-0" />
          <div className="text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(cleanText) }} />
        </div>
      );
      continue;
    }

    // Image tag: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <div key={`img-${i}`} className="my-8 rounded-2xl overflow-hidden border border-[#1c211b]/10 bg-[#FAF7F0] shadow-md">
          <img src={src} alt={alt} className="w-full max-h-[500px] object-cover" />
          {alt && (
            <p className="p-3 text-center text-xs text-[#5A626A] bg-white border-t border-[#1c211b]/08 font-mono">
              {alt}
            </p>
          )}
        </div>
      );
      continue;
    }

    // Normal Paragraph with modern text-wrap: pretty
    elements.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm text-[#333C44] leading-relaxed sm:leading-loose my-3.5 font-normal"
        style={{ textWrap: "pretty" } as any}
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  }

  flushTable("table-end");
  flushList("list-end");

  return elements;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success } = useToast();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await articlesApi.getArticleBySlug(slug);
      setArticle(data);

      if (data) {
        // Load related articles
        const all = await articlesApi.getArticles({ onlyPublished: true });
        const related = all.filter((a) => a.id !== data.id && a.category === data.category);
        setRelatedArticles(related.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to load article:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      success("لینک مقاله در حافظه کپی شد.");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#082719] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-[#5A626A]">در حال بارگذاری مقاله...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#161A1D]">مقاله درخواستی یافت نشد</h1>
        <p className="text-xs sm:text-sm text-[#5A626A]">
          ممکن است نشانی اینترنتی تغییر کرده یا این مطلب به حالت پیش‌نویس بازگردانده شده باشد.
        </p>
        <Link
          href="/articles"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست مقالات</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-10">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#5A626A]">
        <Link href="/" className="hover:text-[#082719] transition-colors">خانه</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/articles" className="hover:text-[#082719] transition-colors">مقالات و تکنولوژی</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-[#161A1D] font-bold truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#EDE8DC] text-[#082719] text-xs font-bold border border-[#1c211b]/10">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5A626A] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#8f6d2f]" />
              {toPersianDigits(article.readTimeMinutes)} دقیقه زمان مطالعه
            </span>
            <span className="text-[#5A626A]">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5A626A]">
              <Calendar className="w-3.5 h-3.5 text-[#8f6d2f]" />
              {formatDate(article.createdAt)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1c211b]/15 bg-white hover:bg-[#EDE8DC] text-xs font-bold text-[#161A1D] transition-colors shadow-2xs interactive-bump"
            title="کپی لینک مقاله"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "کپی شد" : "اشتراک‌گذاری"}</span>
          </button>
        </div>

        {/* Article Title with text-wrap: balance */}
        <h1
          className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#161A1D] leading-tight"
          style={{ textWrap: "balance" } as any}
        >
          {article.title}
        </h1>

        {/* Summary Excerpt */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border-r-4 border-r-[#082719] border border-[#1c211b]/10 text-[#333C44] text-xs sm:text-base leading-relaxed font-medium">
          {article.summary}
        </div>

        {/* Author Card */}
        <div className="flex items-center gap-3.5 py-3 border-y border-[#1c211b]/10">
          <div className="w-11 h-11 rounded-full bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            {article.author.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#161A1D]">{article.author}</span>
            <span className="text-xs text-[#5A626A]">{article.authorRole || "استودیو طراحی و ساخت هیزو"}</span>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      {article.coverImage && (
        <div className="rounded-3xl overflow-hidden border border-[#1c211b]/12 shadow-lg bg-[#FAF7F0]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-[460px] object-cover object-center"
          />
        </div>
      )}

      {/* Main Body Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#1c211b]/10 shadow-sm leading-relaxed text-[#161A1D]">
        {renderRichContent(article.content)}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-bold text-[#5A626A] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#082719]" />
            برچسب‌ها:
          </span>
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-3 py-1 rounded-full bg-[#FAF7F0] text-[#161A1D] border border-[#1c211b]/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[#1c211b]/10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#161A1D]">مقالات مرتبط در همین حوزه</h3>
            <Link href="/articles" className="text-xs font-bold text-[#082719] hover:underline">
              مشاهده همه مقالات ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Back to hub */}
      <div className="pt-4 text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-colors shadow-md interactive-bump"
        >
          <ArrowRight className="w-4 h-4 text-[#dfc79b]" />
          <span>بازگشت به مرکز مقالات و تکنولوژی هیزو</span>
        </Link>
      </div>
    </article>
  );
}
