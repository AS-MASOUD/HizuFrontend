"use client";

import React, { useState } from "react";
import { CourseSection, CourseEpisode } from "@/types";
import { toPersianDigits } from "@/lib/utils/formatters";
import {
  ChevronDown,
  PlayCircle,
  Lock,
  FileDown,
  Clock,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

interface CourseCurriculumAccordionProps {
  sections: CourseSection[];
  onSelectSampleEpisode?: (episode: CourseEpisode) => void;
}

export default function CourseCurriculumAccordion({
  sections,
  onSelectSampleEpisode,
}: CourseCurriculumAccordionProps) {
  // Open first section by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      initial[sec.id] = idx === 0;
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    sections.forEach((sec) => {
      next[sec.id] = expand;
    });
    setOpenSections(next);
  };

  const totalEpisodes = sections.reduce((sum, s) => sum + s.episodes.length, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header with expand/collapse toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[#8f6d2f]" />
          <h3 className="font-bold text-lg text-[#161A1D]">
            سرفصل‌ها و جلسات آموزشی دوره
          </h3>
          <span className="text-xs font-mono text-[#5A626A] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#1c211b]/10">
            {toPersianDigits(sections.length)} فصل • {toPersianDigits(totalEpisodes)} جلسه
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="text-[#082719] hover:underline font-semibold"
          >
            گسترش همه
          </button>
          <span className="text-[#5A626A]">•</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="text-[#5A626A] hover:underline"
          >
            بستن همه
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex flex-col gap-3">
        {sections.map((section, sIdx) => {
          const isOpen = !!openSections[section.id];
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-[#1c211b]/12 overflow-hidden bg-white shadow-xs transition-all"
            >
              {/* Section Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full px-5 py-4 flex items-center justify-between text-right transition-colors ${
                  isOpen ? "bg-[#FAF7F0]" : "bg-white hover:bg-[#FAF7F0]/60"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-[#082719] text-[#dfc79b] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {toPersianDigits(sIdx + 1)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-[#161A1D] truncate">
                      {section.title}
                    </span>
                    {section.description && (
                      <span className="text-[11px] text-[#5A626A] truncate mt-0.5">
                        {section.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 mr-3">
                  <span className="text-xs font-mono text-[#5A626A] hidden sm:inline">
                    {toPersianDigits(section.episodes.length)} جلسه
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5A626A] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#082719]" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Section Episodes */}
              {isOpen && (
                <div className="border-t border-[#1c211b]/08 divide-y divide-[#1c211b]/06">
                  {section.episodes.map((episode, eIdx) => (
                    <div
                      key={episode.id}
                      className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF7F0]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {episode.isFreePreview ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <PlayCircle className="w-3.5 h-3.5 fill-current" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-[#EDE8DC] text-[#5A626A] flex items-center justify-center shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-[#161A1D] truncate">
                            {episode.title}
                          </span>
                          {episode.description && (
                            <span className="text-[10px] text-[#5A626A] truncate">
                              {episode.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Episode Meta & Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        {episode.attachmentUrl && (
                          <div
                            className="hidden sm:flex items-center gap-1 text-[10px] text-[#0284c7] font-medium bg-blue-50 px-2 py-0.5 rounded"
                            title="دارای فایل تمرین و پروژه"
                          >
                            <FileDown className="w-3 h-3" />
                            <span>فایل پیوست</span>
                          </div>
                        )}

                        {episode.isFreePreview ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            پیش‌نمایش رایگان
                          </span>
                        ) : null}

                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#5A626A]">
                          <Clock className="w-3 h-3 text-[#8f6d2f]" />
                          <span>{episode.durationText || `${episode.durationMinutes} دقیقه`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
