"use client";

import React, { useState, useEffect, useRef } from "react";
import { Article, CreateArticleDto, UpdateArticleDto } from "@/types";
import { useToast } from "@/providers/ToastProvider";
import {
  X,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Sparkles,
  Eye,
  Edit3,
  Save,
  CheckCircle,
  Clock,
  Layers,
  FileText,
} from "lucide-react";

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: any) => Promise<void>;
  articleToEdit?: Article | null;
}

const PRESET_IMAGES = [
  {
    label: "پرینتر 3بعدی صنعتی",
    url: "/images/workshop-1.jpg",
  },
  {
    label: "ماشین‌کاری CNC",
    url: "/images/cnc-facility.jpg",
  },
  {
    label: "طراحی محصول و مکاترونیک",
    url: "/images/workshop-2.jpg",
  },
  {
    label: "متریال و رول‌های فیلامنت",
    url: "/images/workshop-3.jpg",
  },
];

export default function ArticleEditorModal({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
}: ArticleEditorModalProps) {
  const { error } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("پرینت 3بعدی");
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [author, setAuthor] = useState("تیم مهندسی هیزو");
  const [authorRole, setAuthorRole] = useState("استودیو طراحی و ساخت هیزو");
  const [tagsText, setTagsText] = useState("پرینت 3بعدی, تکنولوژی, متریال");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [saving, setSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setSlug(articleToEdit.slug);
      setCategory(articleToEdit.category);
      setCoverImage(articleToEdit.coverImage);
      setReadTimeMinutes(articleToEdit.readTimeMinutes);
      setAuthor(articleToEdit.author);
      setAuthorRole(articleToEdit.authorRole || "استودیو طراحی و ساخت هیزو");
      setTagsText(articleToEdit.tags?.join(", ") || "");
      setSummary(articleToEdit.summary);
      setContent(articleToEdit.content);
      setIsPublished(articleToEdit.isPublished);
    } else {
      // Reset defaults for new article
      setTitle("");
      setSlug("");
      setCategory("پرینت 3بعدی");
      setCoverImage(PRESET_IMAGES[0].url);
      setReadTimeMinutes(5);
      setAuthor("تیم مهندسی هیزو");
      setAuthorRole("استودیو طراحی و ساخت هیزو");
      setTagsText("پرینت 3بعدی, تکنولوژی, متریال");
      setSummary("");
      setContent(
        "## مقدمه مقاله\n\nتوضیحات آغازین پیرامون موضوع...\n\n### بررسی فنی\n\nنکات و مشخصات کلیدی محصول یا تکنولوژی...\n\n> [!NOTE]\n> نکته مهم درباره این فرآیند صنعتی در کارگاه هیزو."
      );
      setIsPublished(true);
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGenerateSlug = () => {
    if (!title.trim()) return;
    const generated = title
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const insertTextAtCursor = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "متن نمونه"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText || "متن نمونه").length);
    }, 50);
  };

  const handleInsertTable = () => {
    const sampleTable = `\n| مشخصه فنی | PLA+ | PETG | ABS | PA12-CF |\n| :--- | :--- | :--- | :--- | :--- |\n| **دمای نازل** | 210°C | 240°C | 250°C | 280°C |\n| **دمای بستر** | 60°C | 80°C | 100°C | 100°C |\n| **مقاومت ضربه‌ای** | متوسط | خوب | عالی | فوق‌العاده |\n| **جمع‌شدگی** | اندک | کم | زیاد | متوسط |\n\n`;
    insertTextAtCursor(sampleTable, "");
  };

  const handleInsertImage = () => {
    const imageUrl = prompt("آدرس تصویر (URL) را وارد نمایید:", PRESET_IMAGES[1].url);
    if (!imageUrl) return;
    const caption = prompt("توضیح زیر عکس (کپشن):", "قطعه تولید شده با ماشین‌کاری CNC در هیزو");
    insertTextAtCursor(`\n![${caption || ""}](${imageUrl})\n`, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      error("لطفاً عنوان، چکیده و متن اصلی مقاله را تکمیل فرمایید.");
      return;
    }

    try {
      setSaving(true);
      const tags = tagsText
        .split(/[,،]/)
        .map((t) => t.trim())
        .filter(Boolean);

      const finalSlug = slug.trim() || title.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-");

      const payload = {
        ...(articleToEdit ? { id: articleToEdit.id } : {}),
        title: title.trim(),
        slug: finalSlug,
        category,
        coverImage,
        readTimeMinutes: Number(readTimeMinutes) || 5,
        author: author.trim() || "تیم مهندسی هیزو",
        authorRole: authorRole.trim() || "استودیو هیزو",
        tags,
        summary: summary.trim(),
        content,
        isPublished,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      error(err.message || "خطا در ذخیره‌سازی مقاله");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#1c211b]/15 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#161A1D]">
                {articleToEdit ? "ویرایش و اصلاح مقاله" : "نگارش و انتشار مقاله جدید"}
              </h2>
              <p className="text-[11px] text-[#5A626A]">
                کنترل انتشارات، ویرایشگر متنی با عکس و جدول، و تنظیمات سئو
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EDE8DC] text-[#5A626A] hover:text-[#161A1D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#161A1D]">
                عنوان مقاله <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مقایسه جامع فیلامنت‌های PLA و PETG در پرینت صنعتی"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:border-[#082719] focus:outline-none"
              />
            </div>

            <div className="md:col-span-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#161A1D]">پیوند یکتا (Slug)</label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-[10px] text-[#0284c7] hover:underline font-medium"
                >
                  تولید از عنوان
                </button>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="filament-pla-vs-petg-guide"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono dir-ltr text-right focus:border-[#082719] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category, Read Time, Publish Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#161A1D]">دسته‌بندی موضوعی</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:border-[#082719] focus:outline-none"
              >
                <option value="پرینت 3بعدی">پرینت 3بعدی صنعتی</option>
                <option value="متریال و فیلامنت">متریال و فیلامنت</option>
                <option value="طراحی محصول">طراحی محصول و CAD</option>
                <option value="تکنولوژی و اخبار">تکنولوژی و اخبار کارگاه</option>
                <option value="ماشین‌کاری CNC">ماشین‌کاری CNC</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#161A1D]">زمان تقریبی مطالعه (دقیقه)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(parseInt(e.target.value, 10) || 5)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:border-[#082719] focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-[#FAF7F0] cursor-pointer hover:bg-[#EDE8DC] transition-colors">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-[#082719] focus:ring-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#161A1D]">
                    {isPublished ? "منتشر شده (عمومی)" : "پیش‌نویس (فقط ادمین)"}
                  </span>
                  <span className="text-[10px] text-[#5A626A]">
                    {isPublished ? "در سایت برای همه قابل مشاهده است" : "در سایت نمایش داده نخواهد شد"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Row 3: Cover Image URL & Presets */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#FAF7F0] border border-[#1c211b]/08">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#161A1D]">تصویر شاخص کاور (Cover Image)</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#5A626A]">پیش‌فرض‌های پیشنهادی:</span>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#1c211b]/10 text-[10px] text-[#082719] hover:bg-[#EDE8DC]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono dir-ltr text-right focus:border-[#082719] focus:outline-none bg-white"
              />
              {coverImage && (
                <div className="w-12 h-10 rounded-lg overflow-hidden border shrink-0 bg-gray-100">
                  <img src={coverImage} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Summary & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#161A1D]">
                چکیده / خلاصه مقاله <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="توضیح دو الی سه خطی جذاب برای نمایش در کارت‌ها و سئو..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#082719] focus:outline-none"
              />
            </div>

            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#161A1D]">برچسب‌ها (با کاما جدا کنید)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="پرینت 3بعدی, PLA, متریال"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#082719] focus:outline-none"
              />
              <div className="flex gap-2 text-[11px] text-[#5A626A] mt-1">
                <span>نویسنده:</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="نام نویسنده"
                  className="px-2 py-0.5 border rounded text-[11px] flex-1"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Rich Content Editor & Live Preview */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1c211b]/10">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-xl border border-[#1c211b]/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("editor")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === "editor" ? "bg-[#082719] text-white shadow-xs" : "text-[#5A626A] hover:bg-[#EDE8DC]"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ویرایشگر متنی</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === "preview" ? "bg-[#082719] text-white shadow-xs" : "text-[#5A626A] hover:bg-[#EDE8DC]"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>پیش‌نمایش زنده مقاله</span>
                </button>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === "editor" && (
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    title="تیتر اصلی H2"
                    onClick={() => insertTextAtCursor("\n## ", "\n")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="زیرتیتر H3"
                    onClick={() => insertTextAtCursor("\n### ", "\n")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="متن پررنگ (Bold)"
                    onClick={() => insertTextAtCursor("**", "**")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="متن کج (Italic)"
                    onClick={() => insertTextAtCursor("*", "*")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="لیست نقطه‌ای"
                    onClick={() => insertTextAtCursor("\n- ", "\n")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="لیست شماره‌دار"
                    onClick={() => insertTextAtCursor("\n1. ", "\n")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="باکس نکته و نقل‌قول"
                    onClick={() => insertTextAtCursor("\n> [!NOTE]\n> ", "\n")}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="درج تصویر با آدرس و کپشن"
                    onClick={handleInsertImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ درج عکس</span>
                  </button>
                  <button
                    type="button"
                    title="درج جدول مشخصات فنی"
                    onClick={handleInsertTable}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0284c7] border border-blue-200 hover:bg-blue-100 text-xs font-bold transition-colors"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>+ درج جدول</span>
                  </button>
                </div>
              )}
            </div>

            {/* Editor Area */}
            {activeTab === "editor" ? (
              <textarea
                ref={textareaRef}
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن مقاله را بنویسید یا از نوار ابزار بالا برای ساختاربندی، درج عکس و جدول مقایسه استفاده کنید..."
                className="w-full p-4 rounded-2xl border border-gray-300 text-xs sm:text-sm font-sans leading-relaxed focus:border-[#082719] focus:outline-none"
              />
            ) : (
              /* Live Preview */
              <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAF7F0]/60 min-h-[300px] overflow-y-auto max-h-[400px]">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                  <span className="px-3 py-1 rounded-full bg-[#EDE8DC] text-[#082719] text-xs font-bold self-start">
                    {category}
                  </span>
                  <h1 className="text-2xl font-black text-[#161A1D]">{title || "عنوان پیش‌نمایش مقاله"}</h1>
                  <p className="text-xs text-[#5A626A]">{summary}</p>
                  {coverImage && (
                    <img src={coverImage} alt="کاور" className="rounded-xl max-h-60 object-cover w-full" />
                  )}
                  <div className="bg-white p-5 rounded-xl border border-[#1c211b]/10 text-xs leading-relaxed whitespace-pre-line">
                    {content}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1c211b]/10">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              <span className="text-xs font-bold text-[#5A626A]">
                وضعیت: {isPublished ? "آماده انتشار عمومی" : "ذخیره در حالت پیش‌نویس"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#082719] hover:bg-[#162b20] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#dfc79b]" />
                <span>{saving ? "در حال ذخیره‌سازی..." : isPublished ? "ذخیره و انتشار مقاله" : "ذخیره پیش‌نویس"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
