"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = "",
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`card-popup rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "border-[#082719]/30 shadow-md bg-white"
                : "border-[#1c211b]/10 hover:border-[#082719]/20 bg-white/90"
            }`}
          >
            {/* Accordion Trigger */}
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-right gap-4 focus:outline-none select-none group/acc"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-[#0284c7] shadow-[0_0_6px_#0284c7]" : "bg-[#1c211b]/20 group-hover/acc:bg-[#8f6d2f]"
                  }`}
                />
                <h3 className="font-bold text-sm sm:text-base text-[#161A1D] group-hover/acc:text-[#082719] transition-colors">
                  {item.title}
                </h3>
                {item.badge && (
                  <span className="hidden sm:inline-block font-mono text-[10px] bg-[#EDE8DC] text-[#333C44] px-2 py-0.5 rounded border border-[#1c211b]/10">
                    {item.badge}
                  </span>
                )}
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isOpen
                    ? "bg-[#082719] text-[#dfc79b] rotate-180"
                    : "bg-[#FAF7F0] group-hover/acc:bg-[#EDE8DC] text-[#5A626A]"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Accordion Smooth Grid Body */}
            <div className={`accordion-grid ${isOpen ? "open" : ""}`}>
              <div className="accordion-inner">
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5A626A] leading-relaxed border-t border-[#1c211b]/06">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
