"use client";

import React, { useState, useEffect, useRef } from "react";
import { Course, CourseLevel, CourseSection, CourseEpisode } from "@/types";
import { productsApi } from "@/lib/api/products";
import { optimizeProductImage } from "@/lib/utils/imageOptimizer";
import { useToast } from "@/providers/ToastProvider";
import {
  X,
  Check,
  Upload,
  Image as ImageIcon,
  GraduationCap,
  Sparkles,
  Loader2,
  Video,
  Server,
  DollarSign,
  User,
  BookOpen,
  Settings,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  PlayCircle,
  FileText,
  Clock,
  Paperclip,
} from "lucide-react";
import { formatPrice, toPersianDigits } from "@/lib/utils/formatters";
import { getImageUrl } from "@/lib/utils/imageUrl";

interface CourseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: any) => Promise<void>;
  courseToEdit: Course | null;
}

export default function CourseEditorModal({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
}: CourseEditorModalProps) {
  const { error: toastError, success: toastSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "general" | "curriculum" | "pricing" | "media" | "instructor" | "syllabus" | "settings"
  >("general");

  // Form State - General
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  // Pricing & Reservation
  const [isReservationOnly, setIsReservationOnly] = useState(false);
  const [price, setPrice] = useState<number | "">("");
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">("");

  // Course Duration & Metadata
  const [level, setLevel] = useState<CourseLevel>(4);
  const [language, setLanguage] = useState("فارسی");
  const [courseHours, setCourseHours] = useState<number>(0);
  const [courseMinutes, setCourseMinutes] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [durationText, setDurationText] = useState("");
  const [totalEpisodesCount, setTotalEpisodesCount] = useState<number>(0);
  const [downloadableResourcesCount, setDownloadableResourcesCount] = useState<number>(0);
  const [includesCertificate, setIncludesCertificate] = useState(true);
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(true);

  // Sections & Episodes (Curriculum)
  const [sections, setSections] = useState<CourseSection[]>([]);

  // Media & File Server Links
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [fileServerBaseUrl, setFileServerBaseUrl] = useState("https://files.hizu.ir");
  const [storagePath, setStoragePath] = useState("");
  const [downloadableFilesUrl, setDownloadableFilesUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Instructor
  const [instructorName, setInstructorName] = useState("تیم فنی مهندسی هیزو");
  const [instructorTitle, setInstructorTitle] = useState("استودیو طراحی و ساخت دیجیتال هیزو");
  const [instructorBio, setInstructorBio] = useState("");
  const [instructorAvatarUrl, setInstructorAvatarUrl] = useState("");

  // Syllabus & Outcomes
  const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
  const [requirements, setRequirements] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  // Publication & Display
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title || "");
      setSlug(courseToEdit.slug || "");
      setSubtitle(courseToEdit.subtitle || "");
      setDescription(courseToEdit.description || "");

      const isRes =
        courseToEdit.isReservationOnly ||
        courseToEdit.price === null ||
        courseToEdit.price === undefined ||
        courseToEdit.price === 0;
      setIsReservationOnly(isRes);
      setPrice(courseToEdit.price ?? "");
      setCompareAtPrice(courseToEdit.compareAtPrice ?? "");

      setLevel(courseToEdit.level || 4);
      setLanguage(courseToEdit.language || "فارسی");

      const totalMin = courseToEdit.durationMinutes || 0;
      setDurationMinutes(totalMin);
      setCourseHours(Math.floor(totalMin / 60));
      setCourseMinutes(totalMin % 60);
      setDurationText(courseToEdit.durationText || "");

      setTotalEpisodesCount(courseToEdit.totalEpisodesCount || 0);
      setDownloadableResourcesCount(courseToEdit.downloadableResourcesCount || 0);
      setIncludesCertificate(courseToEdit.includesCertificate ?? true);
      setHasLifetimeAccess(courseToEdit.hasLifetimeAccess ?? true);

      // Deep copy sections and episodes
      if (courseToEdit.sections && courseToEdit.sections.length > 0) {
        setSections(
          courseToEdit.sections.map((s) => ({
            id: s.id,
            title: s.title || "",
            description: s.description || "",
            displayOrder: s.displayOrder || 1,
            episodes: (s.episodes || []).map((e) => ({
              id: e.id,
              sectionId: e.sectionId || s.id,
              title: e.title || "",
              description: e.description || "",
              durationMinutes: e.durationMinutes || 0,
              durationText: e.durationText || "",
              videoUrl: e.videoUrl || "",
              fileServerUrl: e.fileServerUrl || "",
              attachmentUrl: e.attachmentUrl || "",
              attachmentName: e.attachmentName || "",
              attachmentSizeBytes: e.attachmentSizeBytes,
              isFreePreview: !!e.isFreePreview,
              displayOrder: e.displayOrder || 1,
            })),
          }))
        );
      } else {
        setSections([]);
      }

      setCoverImageUrl(courseToEdit.coverImageUrl || "");
      setIntroVideoUrl(courseToEdit.introVideoUrl || "");
      setFileServerBaseUrl(courseToEdit.fileServerBaseUrl || "https://files.hizu.ir");
      setStoragePath(courseToEdit.storagePath || "");
      setDownloadableFilesUrl(courseToEdit.downloadableFilesUrl || "");

      setInstructorName(courseToEdit.instructorName || "تیم فنی مهندسی هیزو");
      setInstructorTitle(courseToEdit.instructorTitle || "");
      setInstructorBio(courseToEdit.instructorBio || "");
      setInstructorAvatarUrl(courseToEdit.instructorAvatarUrl || "");

      setWhatYouWillLearn(
        courseToEdit.whatYouWillLearn ||
          courseToEdit.whatYouWillLearnList?.join("\n") ||
          ""
      );
      setRequirements(
        courseToEdit.requirements ||
          courseToEdit.requirementsList?.join("\n") ||
          ""
      );
      setTargetAudience(
        courseToEdit.targetAudience ||
          courseToEdit.targetAudienceList?.join("\n") ||
          ""
      );

      setIsPublished(courseToEdit.isPublished ?? true);
      setIsFeatured(courseToEdit.isFeatured ?? false);
      setDisplayOrder(courseToEdit.displayOrder ?? 0);
    } else {
      setTitle("");
      setSlug("");
      setSubtitle("");
      setDescription("");

      setIsReservationOnly(true);
      setPrice("");
      setCompareAtPrice("");

      setLevel(4);
      setLanguage("فارسی");
      setCourseHours(0);
      setCourseMinutes(0);
      setDurationMinutes(0);
      setDurationText("");
      setTotalEpisodesCount(0);
      setDownloadableResourcesCount(0);
      setIncludesCertificate(true);
      setHasLifetimeAccess(true);
      setSections([]);

      setCoverImageUrl("");
      setIntroVideoUrl("");
      setFileServerBaseUrl("https://files.hizu.ir");
      setStoragePath("");
      setDownloadableFilesUrl("");

      setInstructorName("تیم فنی مهندسی هیزو");
      setInstructorTitle("استودیو طراحی و ساخت دیجیتال هیزو");
      setInstructorBio("");
      setInstructorAvatarUrl("");

      setWhatYouWillLearn("");
      setRequirements("");
      setTargetAudience("");

      setIsPublished(true);
      setIsFeatured(false);
      setDisplayOrder(0);
    }
    setActiveTab("general");
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle duration change on course level
  const handleCourseDurationChange = (hours: number, minutes: number) => {
    const h = Math.max(0, hours);
    const m = Math.max(0, Math.min(59, minutes));
    setCourseHours(h);
    setCourseMinutes(m);
    const totalMin = h * 60 + m;
    setDurationMinutes(totalMin);

    if (totalMin > 0) {
      if (h > 0 && m > 0) {
        setDurationText(`${h} ساعت و ${m} دقیقه`);
      } else if (h > 0) {
        setDurationText(`${h} ساعت`);
      } else {
        setDurationText(`${m} دقیقه`);
      }
    } else {
      setDurationText("");
    }
  };

  // Section Handlers
  const handleAddSection = () => {
    const newSection: CourseSection = {
      id: `temp-sec-${Date.now()}`,
      title: `فصل ${sections.length + 1}: `,
      description: "",
      displayOrder: sections.length + 1,
      episodes: [],
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (index: number, field: "title" | "description", value: string) => {
    const next = [...sections];
    next[index] = { ...next[index], [field]: value };
    setSections(next);
  };

  const handleDeleteSection = (index: number) => {
    const secTitle = sections[index].title || `فصل ${index + 1}`;
    if (confirm(`آیا از حذف «${secTitle}» و تمام جلسات درون آن اطمینان دارید؟`)) {
      const next = sections.filter((_, i) => i !== index);
      setSections(next);
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setSections(next);
  };

  // Episode Handlers
  const handleAddEpisode = (sectionIndex: number) => {
    const next = [...sections];
    const episodes = next[sectionIndex].episodes || [];
    const newEp: CourseEpisode = {
      id: `temp-ep-${Date.now()}`,
      sectionId: next[sectionIndex].id,
      title: `جلسه ${episodes.length + 1}: `,
      description: "",
      durationMinutes: 0,
      durationText: "",
      videoUrl: "",
      attachmentUrl: "",
      attachmentName: "",
      isFreePreview: false,
      displayOrder: episodes.length + 1,
    };
    next[sectionIndex] = {
      ...next[sectionIndex],
      episodes: [...episodes, newEp],
    };
    setSections(next);
  };

  const handleUpdateEpisode = (
    sectionIndex: number,
    episodeIndex: number,
    fields: Partial<CourseEpisode>
  ) => {
    const next = [...sections];
    const episodes = [...next[sectionIndex].episodes];
    episodes[episodeIndex] = { ...episodes[episodeIndex], ...fields };
    next[sectionIndex] = { ...next[sectionIndex], episodes };
    setSections(next);
  };

  const handleEpisodeTimeChange = (
    sectionIndex: number,
    episodeIndex: number,
    hours: number,
    minutes: number
  ) => {
    const h = Math.max(0, hours);
    const m = Math.max(0, Math.min(59, minutes));
    const totalMin = h * 60 + m;
    let text = "";
    if (totalMin > 0) {
      if (h > 0 && m > 0) {
        text = `${h} ساعت و ${m} دقیقه`;
      } else if (h > 0) {
        text = `${h} ساعت`;
      } else {
        text = `${m} دقیقه`;
      }
    }

    handleUpdateEpisode(sectionIndex, episodeIndex, {
      durationMinutes: totalMin,
      durationText: text,
    });
  };

  const handleDeleteEpisode = (sectionIndex: number, episodeIndex: number) => {
    const next = [...sections];
    const episodes = next[sectionIndex].episodes.filter((_, i) => i !== episodeIndex);
    next[sectionIndex] = { ...next[sectionIndex], episodes };
    setSections(next);
  };

  const handleMoveEpisode = (
    sectionIndex: number,
    episodeIndex: number,
    direction: "up" | "down"
  ) => {
    const targetIndex = direction === "up" ? episodeIndex - 1 : episodeIndex + 1;
    const episodes = sections[sectionIndex].episodes || [];
    if (targetIndex < 0 || targetIndex >= episodes.length) return;
    const nextEpisodes = [...episodes];
    const [moved] = nextEpisodes.splice(episodeIndex, 1);
    nextEpisodes.splice(targetIndex, 0, moved);

    const nextSections = [...sections];
    nextSections[sectionIndex] = { ...nextSections[sectionIndex], episodes: nextEpisodes };
    setSections(nextSections);
  };

  // Auto calculate total duration & episode count from all added episodes
  const handleAutoCalculateFromEpisodes = () => {
    const allEps = sections.flatMap((s) => s.episodes || []);
    const totalMin = allEps.reduce((acc, ep) => acc + (Number(ep.durationMinutes) || 0), 0);
    const totalCount = allEps.length;

    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;

    setCourseHours(h);
    setCourseMinutes(m);
    setDurationMinutes(totalMin);
    setTotalEpisodesCount(totalCount);

    if (totalMin > 0) {
      if (h > 0 && m > 0) {
        setDurationText(`${h} ساعت و ${m} دقیقه`);
      } else if (h > 0) {
        setDurationText(`${h} ساعت`);
      } else {
        setDurationText(`${m} دقیقه`);
      }
    }

    toastSuccess(
      `محاسبه انجام شد: ${toPersianDigits(totalCount)} جلسه، مجموعاً ${toPersianDigits(totalMin)} دقیقه (${h > 0 ? `${toPersianDigits(h)} ساعت و ` : ""}${toPersianDigits(m)} دقیقه)`
    );
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const file = files[0];
      const optimizedFile = await optimizeProductImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });

      const res = await productsApi.uploadImage(optimizedFile);
      if (res.imageUrl) {
        setCoverImageUrl(res.imageUrl);
        toastSuccess("تصویر کاور دوره با موفقیت بارگذاری شد.");
      }
    } catch (err: any) {
      toastError(err.message || "خطا در بارگذاری تصویر کاور.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError("لطفاً عنوان دوره را وارد کنید.");
      setActiveTab("general");
      return;
    }
    if (!description.trim()) {
      toastError("لطفاً توضیحات دوره را وارد کنید.");
      setActiveTab("general");
      return;
    }

    try {
      setSubmitting(true);

      const finalPrice =
        isReservationOnly || price === "" || Number(price) <= 0 ? null : Number(price);

      const finalComparePrice =
        isReservationOnly || compareAtPrice === "" ? null : Number(compareAtPrice);

      // Prepare sanitized sections & episodes
      const finalSections = sections.map((sec, secIdx) => ({
        id: sec.id && !sec.id.startsWith("temp-") ? sec.id : undefined,
        title: sec.title.trim() || `فصل ${secIdx + 1}`,
        description: sec.description?.trim() || undefined,
        displayOrder: secIdx + 1,
        episodes: (sec.episodes || []).map((ep, epIdx) => ({
          id: ep.id && !ep.id.startsWith("temp-") ? ep.id : undefined,
          sectionId: sec.id && !sec.id.startsWith("temp-") ? sec.id : undefined,
          title: ep.title.trim() || `جلسه ${epIdx + 1}`,
          description: ep.description?.trim() || undefined,
          durationMinutes: Number(ep.durationMinutes) || 0,
          durationText: ep.durationText?.trim() || undefined,
          videoUrl: ep.videoUrl?.trim() || undefined,
          fileServerUrl: ep.fileServerUrl?.trim() || undefined,
          attachmentUrl: ep.attachmentUrl?.trim() || undefined,
          attachmentName: ep.attachmentName?.trim() || undefined,
          attachmentSizeBytes: ep.attachmentSizeBytes
            ? Number(ep.attachmentSizeBytes)
            : undefined,
          isFreePreview: !!ep.isFreePreview,
          displayOrder: epIdx + 1,
        })),
      }));

      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        price: finalPrice,
        compareAtPrice: finalComparePrice,
        isReservationOnly,
        coverImageUrl: coverImageUrl.trim() || undefined,
        introVideoUrl: introVideoUrl.trim() || undefined,
        fileServerBaseUrl: fileServerBaseUrl.trim() || undefined,
        storagePath: storagePath.trim() || undefined,
        downloadableFilesUrl: downloadableFilesUrl.trim() || undefined,
        durationMinutes: Number(durationMinutes) || 0,
        durationText: durationText.trim() || undefined,
        level: Number(level) as CourseLevel,
        language: language.trim() || "فارسی",
        totalEpisodesCount: Number(totalEpisodesCount) || 0,
        downloadableResourcesCount: Number(downloadableResourcesCount) || 0,
        includesCertificate,
        hasLifetimeAccess,
        instructorName: instructorName.trim() || "تیم فنی مهندسی هیزو",
        instructorTitle: instructorTitle.trim() || undefined,
        instructorBio: instructorBio.trim() || undefined,
        instructorAvatarUrl: instructorAvatarUrl.trim() || undefined,
        whatYouWillLearn: whatYouWillLearn.trim() || undefined,
        requirements: requirements.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        isPublished,
        isFeatured,
        displayOrder: Number(displayOrder) || 0,
        sections: finalSections,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      toastError(err.message || "خطا در ذخیره اطلاعات دوره آموزشی.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCurriculumEpisodes = sections.reduce(
    (acc, s) => acc + (s.episodes?.length || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="card-popup relative w-full max-w-5xl rounded-2xl bg-white border border-[#1c211b]/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c211b]/10 bg-[#FAF7F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-mono font-bold shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#161A1D]">
                {courseToEdit ? `ویرایش دوره: ${courseToEdit.title}` : "افزودن دوره آموزشی جدید"}
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                تعریف مشخصات، سرفصل‌ها و جلسات، وضعیت پیش‌ثبت‌نام، لینک‌های دانلود و مدرس
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5A626A] hover:text-[#161A1D] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[#1c211b]/10 bg-[#FAF7F0]/50 overflow-x-auto shrink-0 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "general"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مشخصات پایه</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "curriculum"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>سرفصل‌ها و جلسات</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "curriculum"
                  ? "bg-[#dfc79b] text-[#082719]"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {toPersianDigits(totalCurriculumEpisodes)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "pricing"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>شهریه و پیش‌ثبت‌نام</span>
            {isReservationOnly && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "media"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>فایل‌سرور و ویدیوها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("instructor")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "instructor"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>کاور و مدرس</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("syllabus")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "syllabus"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>اهداف و پیش‌نیازها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === "settings"
                ? "bg-[#082719] text-white shadow-xs"
                : "text-[#5A626A] hover:bg-[#EDE8DC]"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>تنظیمات انتشار</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-xs text-[#161A1D]">
            {/* 1. GENERAL TAB */}
            {activeTab === "general" && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold flex items-center justify-between">
                      <span>عنوان دوره آموزشی *</span>
                      <span className="text-[10px] text-gray-400 font-normal">نمایش در سایت</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: آموزش پیشرفته طراحی صنعتی و CAD با Fusion 360"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold flex items-center justify-between">
                      <span>نامک آدرس یکتا (Slug)</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        اختیاری (خودکار ساخته می‌شود)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="fusion360-advanced-cad"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr text-[#161A1D] focus:outline-none focus:border-[#082719]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold">عنوان فرعی / معرفی اجمالی</label>
                  <input
                    type="text"
                    placeholder="مثال: از مدلسازی پارامتریک و مهندسی معکوس قطعات تا خروجی مستقیم ساخت"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                  />
                </div>

                {/* Level, Language & Duration Controls */}
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10 flex flex-col gap-4">
                  <span className="font-bold text-xs text-[#082719] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>سطح و مدت زمان دوره (ساعت و دقیقه)</span>
                    </span>
                    {sections.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAutoCalculateFromEpisodes}
                        className="text-[11px] font-bold text-[#082719] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#dfc79b]" />
                        <span>محاسبه خودکار از سرفصل‌ها</span>
                      </button>
                    )}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">سطح دوره</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value) as CourseLevel)}
                        className="bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs text-[#161A1D] cursor-pointer"
                      >
                        <option value={1}>مقدماتی (Beginner)</option>
                        <option value={2}>متوسط (Intermediate)</option>
                        <option value={3}>پیشرفته (Advanced)</option>
                        <option value={4}>از مقدماتی تا پیشرفته (All Levels)</option>
                      </select>
                    </div>

                    {/* Dual Hours and Minutes Inputs */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">مدت زمان (ساعت و دقیقه)</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-1 bg-white border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5">
                          <input
                            type="number"
                            min={0}
                            placeholder="۰"
                            value={courseHours === 0 ? "" : courseHours}
                            onChange={(e) =>
                              handleCourseDurationChange(
                                Number(e.target.value) || 0,
                                courseMinutes
                              )
                            }
                            className="w-full text-center font-mono text-xs focus:outline-none"
                          />
                          <span className="text-[10px] text-gray-500 shrink-0">ساعت</span>
                        </div>

                        <div className="flex-1 flex items-center gap-1 bg-white border border-[#1c211b]/15 rounded-xl px-2.5 py-1.5">
                          <input
                            type="number"
                            min={0}
                            max={59}
                            placeholder="۰"
                            value={courseMinutes === 0 ? "" : courseMinutes}
                            onChange={(e) =>
                              handleCourseDurationChange(
                                courseHours,
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full text-center font-mono text-xs focus:outline-none"
                          />
                          <span className="text-[10px] text-gray-500 shrink-0">دقیقه</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">متن نمایش زمان (Duration Text)</label>
                      <input
                        type="text"
                        placeholder="مثال: ۴۵ دقیقه یا ۱۸ ساعت و ۳۰ دقیقه"
                        value={durationText}
                        onChange={(e) => setDurationText(e.target.value)}
                        className="bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold">تعداد کل جلسات / ویدیوها</label>
                      <input
                        type="number"
                        min={0}
                        value={totalEpisodesCount}
                        onChange={(e) => setTotalEpisodesCount(Number(e.target.value))}
                        className="bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono dir-ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold">توضیحات و معرفی کامل دوره *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="شرح اهداف، ساختار دوره، اهمیت مهارت‌های تدریس شده و جزئیات مباحث کارگاهی..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-4 text-xs leading-relaxed text-[#161A1D] focus:outline-none focus:border-[#082719]"
                  />
                </div>
              </div>
            )}

            {/* 2. CURRICULUM (SEASONS & EPISODES) TAB */}
            {activeTab === "curriculum" && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {/* Curriculum Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF7F0] border border-[#1c211b]/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-xs text-[#082719] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#8f6d2f]" />
                      <span>مدیریت فصول و جلسات آموزشی دوره</span>
                    </span>
                    <p className="text-[11px] text-[#5A626A] leading-relaxed">
                      فصل‌ها و جلسات دوره را تعریف کنید. برای هر جلسه می‌توانید عنوان، شرح درس، زمان به ساعت و دقیقه، لینک ویدیو و فایل‌های تمرینی را وارد کنید.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleAutoCalculateFromEpisodes}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#1c211b]/15 text-[#082719] hover:bg-[#EDE8DC] font-bold text-xs transition-colors cursor-pointer"
                      title="محاسبه خودکار کل زمان دوره بر اساس جمع دقایق جلسات"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8f6d2f]" />
                      <span>محاسبه خودکار زمان کل</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#082719] text-white hover:bg-[#162b20] font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#dfc79b]" />
                      <span>+ افزودن فصل جدید</span>
                    </button>
                  </div>
                </div>

                {/* Empty State */}
                {sections.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-[#1c211b]/20 bg-[#FAF7F0]/40 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#EDE8DC] text-[#082719] flex items-center justify-center">
                      <Layers className="w-6 h-6 opacity-60" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-sm text-[#161A1D]">هنوز فصلی برای این دوره تعریف نشده است</h4>
                      <p className="text-xs text-[#5A626A]">
                        برای افزودن سرفصل‌ها و جلسات آموزشی، بر روی دکمه زیر کلیک نمایید.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#082719] text-[#dfc79b] text-xs font-bold hover:bg-[#162b20] transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن اولین فصل دوره</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {sections.map((sec, secIdx) => {
                      const secTotalMinutes = (sec.episodes || []).reduce(
                        (sum, ep) => sum + (Number(ep.durationMinutes) || 0),
                        0
                      );
                      const secHours = Math.floor(secTotalMinutes / 60);
                      const secMins = secTotalMinutes % 60;

                      return (
                        <div
                          key={sec.id || `sec-${secIdx}`}
                          className="rounded-2xl border border-[#1c211b]/15 bg-white overflow-hidden shadow-xs"
                        >
                          {/* Section Card Header */}
                          <div className="p-4 bg-[#FAF7F0] border-b border-[#1c211b]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#082719] text-[#dfc79b] shrink-0">
                                فصل {toPersianDigits(secIdx + 1)}
                              </span>

                              <input
                                type="text"
                                placeholder={`عنوان فصل ${secIdx + 1} (مثال: مبانی و آشنایی با نرم‌افزار)`}
                                value={sec.title}
                                onChange={(e) =>
                                  handleUpdateSection(secIdx, "title", e.target.value)
                                }
                                className="bg-white border border-[#1c211b]/15 rounded-xl px-3 py-1.5 text-xs font-bold text-[#161A1D] flex-1 focus:outline-none focus:border-[#082719]"
                              />
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <span className="text-[11px] text-[#5A626A] font-mono px-2 py-1 rounded bg-[#EDE8DC]">
                                {toPersianDigits(sec.episodes?.length || 0)} جلسه •{" "}
                                {secHours > 0 ? `${toPersianDigits(secHours)}h ` : ""}
                                {toPersianDigits(secMins)}m
                              </span>

                              {/* Move buttons */}
                              <button
                                type="button"
                                disabled={secIdx === 0}
                                onClick={() => handleMoveSection(secIdx, "up")}
                                className="p-1.5 rounded-lg border border-[#1c211b]/10 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="انتقال فصل به بالا"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={secIdx === sections.length - 1}
                                onClick={() => handleMoveSection(secIdx, "down")}
                                className="p-1.5 rounded-lg border border-[#1c211b]/10 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="انتقال فصل به پایین"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Section */}
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(secIdx)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                                title="حذف فصل"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Section Description */}
                          <div className="p-4 border-b border-[#1c211b]/08 bg-[#FAF7F0]/30">
                            <input
                              type="text"
                              placeholder="توضیحات و خلاصه مباحث این فصل (اختیاری)"
                              value={sec.description || ""}
                              onChange={(e) =>
                                handleUpdateSection(secIdx, "description", e.target.value)
                              }
                              className="w-full bg-white border border-[#1c211b]/12 rounded-lg px-3 py-1.5 text-xs text-[#5A626A] focus:outline-none focus:border-[#082719]"
                            />
                          </div>

                          {/* Section Episodes */}
                          <div className="p-4 flex flex-col gap-4">
                            {(sec.episodes || []).length === 0 ? (
                              <div className="p-6 text-center rounded-xl border border-dashed border-[#1c211b]/15 bg-[#FAF7F0]/20 flex flex-col items-center gap-2">
                                <p className="text-xs text-[#5A626A]">
                                  هنوز هیچ جلسه‌ای برای این فصل ثبت نشده است.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleAddEpisode(secIdx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#1c211b]/15 hover:bg-[#EDE8DC] text-xs font-bold text-[#082719] transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ افزودن اولین جلسه</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-3">
                                {(sec.episodes || []).map((ep, epIdx) => {
                                  const epHours = Math.floor((ep.durationMinutes || 0) / 60);
                                  const epMins = (ep.durationMinutes || 0) % 60;

                                  return (
                                    <div
                                      key={ep.id || `ep-${secIdx}-${epIdx}`}
                                      className="p-3.5 rounded-xl border border-[#1c211b]/12 bg-[#FAF7F0]/40 flex flex-col gap-3"
                                    >
                                      {/* Episode Header Line */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                            جلسه {toPersianDigits(epIdx + 1)}
                                          </span>

                                          <input
                                            type="text"
                                            required
                                            placeholder={`عنوان جلسه (مثال: جلسه ${epIdx + 1}: آشنایی با Sketch و قیود)`}
                                            value={ep.title}
                                            onChange={(e) =>
                                              handleUpdateEpisode(secIdx, epIdx, {
                                                title: e.target.value,
                                              })
                                            }
                                            className="bg-white border border-[#1c211b]/15 rounded-lg px-3 py-1.5 text-xs font-bold text-[#161A1D] flex-1 focus:outline-none focus:border-[#082719]"
                                          />
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                          {/* Free Preview Toggle */}
                                          <label className="flex items-center gap-1.5 text-[11px] text-[#082719] font-bold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#1c211b]/10">
                                            <input
                                              type="checkbox"
                                              checked={ep.isFreePreview}
                                              onChange={(e) =>
                                                handleUpdateEpisode(secIdx, epIdx, {
                                                  isFreePreview: e.target.checked,
                                                })
                                              }
                                              className="w-3.5 h-3.5 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                                            />
                                            <span>پیش‌نمایش رایگان</span>
                                          </label>

                                          {/* Move episode */}
                                          <button
                                            type="button"
                                            disabled={epIdx === 0}
                                            onClick={() => handleMoveEpisode(secIdx, epIdx, "up")}
                                            className="p-1 rounded-md border border-[#1c211b]/10 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                            title="انتقال جلسه به بالا"
                                          >
                                            <ArrowUp className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={epIdx === (sec.episodes?.length || 0) - 1}
                                            onClick={() => handleMoveEpisode(secIdx, epIdx, "down")}
                                            className="p-1 rounded-md border border-[#1c211b]/10 bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                            title="انتقال جلسه به پایین"
                                          >
                                            <ArrowDown className="w-3 h-3" />
                                          </button>

                                          {/* Delete Episode */}
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteEpisode(secIdx, epIdx)}
                                            className="p-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                                            title="حذف جلسه"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Episode Description */}
                                      <input
                                        type="text"
                                        placeholder="توضیحات و شرح مباحث کلیدی این جلسه (اختیاری)"
                                        value={ep.description || ""}
                                        onChange={(e) =>
                                          handleUpdateEpisode(secIdx, epIdx, {
                                            description: e.target.value,
                                          })
                                        }
                                        className="w-full bg-white border border-[#1c211b]/12 rounded-lg px-3 py-1.5 text-xs text-[#5A626A] focus:outline-none focus:border-[#082719]"
                                      />

                                      {/* Episode Duration & Links Grid */}
                                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        {/* Hours & Minutes */}
                                        <div className="sm:col-span-4 flex items-center gap-1.5">
                                          <span className="text-[11px] font-bold text-[#5A626A] shrink-0">
                                            زمان جلسه:
                                          </span>
                                          <div className="flex items-center gap-1 flex-1">
                                            <div className="flex items-center gap-1 bg-white border border-[#1c211b]/15 rounded-lg px-2 py-1 flex-1">
                                              <input
                                                type="number"
                                                min={0}
                                                placeholder="۰"
                                                value={epHours === 0 ? "" : epHours}
                                                onChange={(e) =>
                                                  handleEpisodeTimeChange(
                                                    secIdx,
                                                    epIdx,
                                                    Number(e.target.value) || 0,
                                                    epMins
                                                  )
                                                }
                                                className="w-full text-center font-mono text-xs focus:outline-none"
                                              />
                                              <span className="text-[10px] text-gray-500">ساعت</span>
                                            </div>

                                            <div className="flex items-center gap-1 bg-white border border-[#1c211b]/15 rounded-lg px-2 py-1 flex-1">
                                              <input
                                                type="number"
                                                min={0}
                                                max={59}
                                                placeholder="۰"
                                                value={epMins === 0 ? "" : epMins}
                                                onChange={(e) =>
                                                  handleEpisodeTimeChange(
                                                    secIdx,
                                                    epIdx,
                                                    epHours,
                                                    Number(e.target.value) || 0
                                                  )
                                                }
                                                className="w-full text-center font-mono text-xs focus:outline-none"
                                              />
                                              <span className="text-[10px] text-gray-500">دقیقه</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Video URL */}
                                        <div className="sm:col-span-4 flex items-center gap-1.5">
                                          <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                          <input
                                            type="url"
                                            placeholder="لینک مستقیم ویدیو (https://...)"
                                            value={ep.videoUrl || ""}
                                            onChange={(e) =>
                                              handleUpdateEpisode(secIdx, epIdx, {
                                                videoUrl: e.target.value,
                                              })
                                            }
                                            className="w-full bg-white border border-[#1c211b]/15 rounded-lg px-2.5 py-1 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                                          />
                                        </div>

                                        {/* Attachment URL & Name */}
                                        <div className="sm:col-span-4 flex items-center gap-1.5">
                                          <Paperclip className="w-3.5 h-3.5 text-[#8f6d2f] shrink-0" />
                                          <input
                                            type="url"
                                            placeholder="لینک فایل ضمیمه / پروژه"
                                            value={ep.attachmentUrl || ""}
                                            onChange={(e) =>
                                              handleUpdateEpisode(secIdx, epIdx, {
                                                attachmentUrl: e.target.value,
                                              })
                                            }
                                            className="w-full bg-white border border-[#1c211b]/15 rounded-lg px-2.5 py-1 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Add Episode Button */}
                            <button
                              type="button"
                              onClick={() => handleAddEpisode(secIdx)}
                              className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#1c211b]/15 text-[#082719] hover:bg-[#EDE8DC] font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#082719]" />
                              <span>+ افزودن جلسه به این فصل</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="inline-flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-[#1c211b]/20 bg-[#FAF7F0] hover:bg-[#EDE8DC] text-[#082719] font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#8f6d2f]" />
                      <span>+ افزودن فصل جدید به دوره آموزشی</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. PRICING & RESERVATION TAB */}
            {activeTab === "pricing" && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                {/* Reservation Banner / Mode Box */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isReservationOnly
                      ? "bg-amber-50/80 border-amber-300"
                      : "bg-[#FAF7F0] border-[#1c211b]/10"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isReservationOnly}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsReservationOnly(checked);
                        if (checked) {
                          setPrice("");
                          setCompareAtPrice("");
                        }
                      }}
                      className="w-4 h-4 mt-0.5 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-sm text-[#161A1D] flex items-center gap-2">
                        <span>پیش‌ثبت‌نام دوره (امکان رزرو توسط کاربران بدون پرداخت شهریه)</span>
                        {isReservationOnly && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                            حالت پیش‌ثبت‌نام فعال
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-[#5A626A] leading-relaxed">
                        با فعال‌سازی این گزینه، فیلد شهریه خالی می‌ماند و کاربران در سایت به جای دکمه «خرید و پرداخت»، دکمه «پیش‌ثبت‌نام و رزرو» را مشاهده می‌کنند. پس از آماده‌سازی و شروع دوره، می‌توانید این گزینه را غیرفعال کرده و قیمت نهایی دوره را درج کنید تا فروش آغاز گردد.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Price Inputs */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity ${
                    isReservationOnly ? "opacity-40 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold flex items-center justify-between">
                      <span>شهریه فروش دوره (تومان)</span>
                      {price !== "" && Number(price) > 0 && (
                        <span className="text-[11px] font-mono text-[#082719] font-bold">
                          {formatPrice(Number(price))}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      disabled={isReservationOnly}
                      placeholder={isReservationOnly ? "خالی (پیش‌ثبت‌نام بدون شهریه)" : "مثال: ۷۵۰۰۰۰"}
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold flex items-center justify-between">
                      <span>قیمت قبل از تخفیف (تومان)</span>
                      {compareAtPrice !== "" && Number(compareAtPrice) > 0 && (
                        <span className="text-[11px] font-mono text-gray-500 line-through">
                          {formatPrice(Number(compareAtPrice))}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      disabled={isReservationOnly}
                      placeholder={isReservationOnly ? "خالی" : "مثال: ۹۵۰۰۰۰"}
                      value={compareAtPrice}
                      onChange={(e) =>
                        setCompareAtPrice(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <Sparkles className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>
                    <strong>نکته:</strong> در صورتی که دوره در مرحله پیش‌ثبت‌نام است، گزینه بالا را علامت بزنید یا فیلد قیمت را خالی بگذارید. هر زمان ویدیوها در سرور فایل قرار گرفت، قیمت را به تومان وارد کنید.
                  </span>
                </div>
              </div>
            )}

            {/* 4. MEDIA & FILE SERVER TAB */}
            {activeTab === "media" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-4 bg-[#EDE8DC]/50 rounded-xl border border-[#1c211b]/10 flex flex-col gap-1">
                  <span className="font-bold text-xs text-[#082719] flex items-center gap-1.5">
                    <Server className="w-4 h-4" />
                    <span>یکپارچه‌سازی فایل‌سرور و لینک‌های مستقیم</span>
                  </span>
                  <p className="text-[11px] text-[#5A626A] leading-relaxed">
                    ویدیوها و پکیج‌های حجیم روی فایل‌سرور اختصاصی شما میزبانی می‌شوند. نیازی به بارگذاری دستی فایل‌های سنگین نیست؛ کافیست لینک سرور دانلود یا پوشه مربوطه را در اینجا مشخص کنید.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold flex items-center justify-between">
                    <span>لینک مستقیم ویدیوی معرفی / تیزر دوره (Intro Video URL)</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      نمایش در پلیر پیش‌نمایش سایت
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://files.hizu.ir/courses/cad-fusion360/intro.mp4"
                    value={introVideoUrl}
                    onChange={(e) => setIntroVideoUrl(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">آدرس پایه سرور فایل (File Server Base URL)</label>
                    <input
                      type="url"
                      placeholder="https://files.hizu.ir"
                      value={fileServerBaseUrl}
                      onChange={(e) => setFileServerBaseUrl(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">مسیر پوشه روی سرور فایل (Storage Path)</label>
                    <input
                      type="text"
                      placeholder="/courses/cad-fusion360/"
                      value={storagePath}
                      onChange={(e) => setStoragePath(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="font-bold">لینک دانلود فایل‌های تمرینی و آرشیو پروژه</label>
                    <input
                      type="url"
                      placeholder="https://files.hizu.ir/courses/cad-fusion360/exercise-files.zip"
                      value={downloadableFilesUrl}
                      onChange={(e) => setDownloadableFilesUrl(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">تعداد فایل‌های دانلودی</label>
                    <input
                      type="number"
                      min={0}
                      value={downloadableResourcesCount}
                      onChange={(e) => setDownloadableResourcesCount(Number(e.target.value))}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. COVER & INSTRUCTOR TAB */}
            {activeTab === "instructor" && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                {/* Cover Image Upload & Preview */}
                <div className="p-4 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#161A1D] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>تصویر پوستر و کاور دوره آموزشی</span>
                    </span>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#082719] text-white text-[11px] font-bold shadow-xs hover:bg-[#162b20] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>آپلود تصویر کاور</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    {coverImageUrl ? (
                      <div className="relative w-36 aspect-[16/10] rounded-xl overflow-hidden border border-[#1c211b]/15 bg-[#16191d] shrink-0">
                        <img
                          src={getImageUrl(coverImageUrl)}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-36 aspect-[16/10] rounded-xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 shrink-0 text-[10px]">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                        <span>بدون کاور</span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[11px] text-[#5A626A]">یا درج مستقیم آدرس تصویر (URL):</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... یا /uploads/..."
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="bg-white border border-[#1c211b]/15 rounded-xl px-3 py-2 text-xs font-mono dir-ltr focus:outline-none focus:border-[#082719]"
                      />
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">نام مدرس دوره *</label>
                    <input
                      type="text"
                      required
                      placeholder="تیم فنی مهندسی هیزو"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">سمت و تخصص مدرس</label>
                    <input
                      type="text"
                      placeholder="استودیو طراحی و ساخت دیجیتال هیزو"
                      value={instructorTitle}
                      onChange={(e) => setInstructorTitle(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs text-[#161A1D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">آدرس تصویر آواتار مدرس</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={instructorAvatarUrl}
                      onChange={(e) => setInstructorAvatarUrl(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs font-mono dir-ltr"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold">بیوگرافی و سوابق مدرس</label>
                    <input
                      type="text"
                      placeholder="سوابق صنعتی و تجربیات..."
                      value={instructorBio}
                      onChange={(e) => setInstructorBio(e.target.value)}
                      className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. SYLLABUS & OUTCOMES TAB */}
            {activeTab === "syllabus" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold flex items-center justify-between">
                    <span>آنچه در این دوره می‌آموزید (اهداف کلیدی)</span>
                    <span className="text-[10px] text-gray-400 font-normal">هر مورد در یک سطر جدید</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`مدلسازی سه‌بعدی قطعات مکانیکی پیچیده\nتلورانس‌گذاری ابعادی و هندسی دقیق\nآماده‌سازی خروجی استاندارد STEP و STL برای ساخت`}
                    value={whatYouWillLearn}
                    onChange={(e) => setWhatYouWillLearn(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold flex items-center justify-between">
                    <span>پیش‌نیازهای ورود به دوره</span>
                    <span className="text-[10px] text-gray-400 font-normal">هر مورد در یک سطر جدید</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`آشنایی مقدماتی با رایانه و نقشه‌کشی فنی\nعلاقه‌مندی به طراحی مهندسی`}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold flex items-center justify-between">
                    <span>مخاطبان هدف دوره</span>
                    <span className="text-[10px] text-gray-400 font-normal">هر مورد در یک سطر جدید</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`دانشجویان مهندسی مکانیک، مواد و هوافضا\nطراحان صنعتی و ماکرباکس‌ها\nعلاقه‌مندان به ساخت دیجیتال و CNC`}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl p-3 text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-4 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs block text-[#161A1D]">انتشار عمومی در سایت</span>
                      <span className="text-[10px] text-[#5A626A]">دوره برای عموم کاربران و موتورهای جستجو قابل مشاهده خواهد بود</span>
                    </div>
                  </label>

                  <label className="p-4 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs block text-[#161A1D]">دوره ویژه / برگزیده کارگاه</span>
                      <span className="text-[10px] text-[#5A626A]">نمایش نشان ویژه و اولویت در صفحه اصلی و آکادمی</span>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="p-4 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesCertificate}
                      onChange={(e) => setIncludesCertificate(e.target.checked)}
                      className="w-4 h-4 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs block text-[#161A1D]">اعطای گواهی پایان دوره</span>
                      <span className="text-[10px] text-[#5A626A]">صدور مدرک رسمی هیزو</span>
                    </div>
                  </label>

                  <label className="p-4 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasLifetimeAccess}
                      onChange={(e) => setHasLifetimeAccess(e.target.checked)}
                      className="w-4 h-4 rounded text-[#082719] focus:ring-[#082719] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs block text-[#161A1D]">دسترسی نامحدود</span>
                      <span className="text-[10px] text-[#5A626A]">دسترسی دائمی به سرفصل‌ها</span>
                    </div>
                  </label>

                  <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[#1c211b]/10 bg-[#FAF7F0]">
                    <label className="font-bold text-xs">ترتیب نمایش (Display Order)</label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="bg-white border border-[#1c211b]/15 rounded-lg px-3 py-1.5 text-xs font-mono dir-ltr"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#FAF7F0] border-t border-[#1c211b]/10 flex items-center justify-between shrink-0">
            <span className="text-xs text-[#5A626A]">
              {isReservationOnly ? (
                <span className="text-amber-700 font-bold">
                  ★ وضعیت: آماده برای پیش‌ثبت‌نام و رزرو کاربران (بدون شهریه)
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  ✓ وضعیت: دوره عادی با شهریه {price ? formatPrice(Number(price)) : "رایگان"}
                </span>
              )}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#1c211b]/15 text-[#5A626A] hover:bg-[#EDE8DC] text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-[#082719] hover:bg-[#162b20] text-white px-7 py-2.5 rounded-full text-xs font-bold shadow-md transition-all hover:scale-105 disabled:opacity-50 interactive-bump cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#dfc79b]" />
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#dfc79b]" />
                    <span>ذخیره دوره آموزشی</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
