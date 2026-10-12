"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

interface TickData {
  percent: number;
  isMajor: boolean;
  isMedium: boolean;
  label?: string;
}

export default function ScrollRuler() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Generate 51 tick positions (every 2%)
  const ticks: TickData[] = React.useMemo(() => {
    const list: TickData[] = [];
    for (let i = 0; i <= 50; i++) {
      const p = i * 2;
      const isMajor = p % 20 === 0;
      const isMedium = !isMajor && p % 10 === 0;
      let label: string | undefined;
      if (p === 0) label = "00";
      else if (p === 20) label = "20";
      else if (p === 40) label = "40";
      else if (p === 60) label = "60";
      else if (p === 80) label = "80";
      else if (p === 100) label = "Z+";

      list.push({ percent: p, isMajor, isMedium, label });
    }
    return list;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollPercent(0);
      } else {
        const pct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
        setScrollPercent(pct);
      }
    });
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isDesktop, handleScroll]);

  if (!isDesktop) return null;

  const scrollToPercent = useCallback((pct: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = (pct / 100) * maxScroll;
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const pct = Math.min(100, Math.max(0, (clickY / rect.height) * 100));
    scrollToPercent(pct);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const moveY = moveEvent.clientY - rect.top;
      const pct = Math.min(100, Math.max(0, (moveY / rect.height) * 100));
      scrollToPercent(pct);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <aside
      aria-label="CAD Coordinate Scroll Ruler"
      className="hidden xl:flex fixed left-3 top-32 bottom-10 z-40 flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Coordinate Header (inspired by hizu.ir/bio) */}
      <div className="flex flex-col items-center mb-2 pointer-events-none opacity-70">
        <span className="font-mono text-[8px] font-bold text-[#8f6d2f] tracking-widest">
          CAD // Z
        </span>
        <span className="font-mono text-[7px] text-[#5A626A]">
          ±0.01mm
        </span>
      </div>

      {/* Main Ruler Interactive Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        onMouseDown={handleMouseDown}
        className="relative w-12 flex-1 cursor-pointer flex justify-center py-2"
        title="اسکرول مستقیم با خط‌کش مهندسی"
      >
        {/* Subtle Background Spine Line */}
        <div className="absolute top-0 bottom-0 left-[14px] w-[1px] bg-[#1c211b]/15 pointer-events-none" />

        {/* Dynamic Ticks with Proximity Magnification */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
          {ticks.map((tick) => {
            // Distance in percent between glassy sphere and tick
            const distPct = Math.abs(tick.percent - scrollPercent);
            // Influence radius: 10% of total height
            const influence = Math.max(0, 1 - distPct / 10);
            // Magnification curve (quartic decay)
            const mag = Math.pow(influence, 2.5);

            // Dynamic lengths based on magnification
            let baseLength = tick.isMajor ? 18 : tick.isMedium ? 12 : 7;
            const expandedLength = baseLength + mag * 14;

            // Opacity & Bolding
            const opacity = 0.35 + mag * 0.65;
            const isBold = mag > 0.3;

            return (
              <div
                key={tick.percent}
                className="absolute left-[14px] flex items-center transition-all duration-75"
                style={{
                  top: `${tick.percent}%`,
                  transform: "translateY(-50%)",
                }}
              >
                {/* Horizontal Tick Bar */}
                <div
                  className="rounded-full transition-all duration-100"
                  style={{
                    width: `${expandedLength}px`,
                    height: isBold ? "2px" : tick.isMajor ? "1.5px" : "1px",
                    backgroundColor: isBold
                      ? "#b5924d"
                      : tick.isMajor
                      ? "#1c211b"
                      : "rgba(28, 33, 27, 0.4)",
                    opacity,
                    boxShadow: isBold
                      ? "0 0 6px rgba(181, 146, 77, 0.6)"
                      : "none",
                  }}
                />

                {/* Coordinate Label on Major Ticks */}
                {tick.label && (
                  <span
                    className={`font-mono text-[8px] mr-1.5 transition-all duration-100 ${
                      isBold
                        ? "text-[#8f6d2f] font-black scale-110"
                        : "text-[#5A626A] font-medium opacity-60"
                    }`}
                  >
                    {tick.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Glassy Sphere Reflection Cursor */}
        <div
          className="absolute left-[14px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out pointer-events-none"
          style={{
            top: `${scrollPercent}%`,
          }}
        >
          {/* Glass Orb Body */}
          {/*<div*/}
          {/*  className={`relative rounded-full transition-transform duration-300 flex items-center justify-center ${*/}
          {/*    isHovered || isDragging ? "w-8 h-8 scale-110" : "w-7 h-7"*/}
          {/*  }`}*/}
          {/*  style={{*/}
          {/*    background:*/}
          {/*      "radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 30%, rgba(223, 199, 155, 0.3) 65%, rgba(8, 39, 25, 0.75) 100%)",*/}
          {/*    backdropFilter: "blur(6px) saturate(140%)",*/}
          {/*    WebkitBackdropFilter: "blur(6px) saturate(140%)",*/}
          {/*    border: "1.5px solid rgba(255, 255, 255, 0.75)",*/}
          {/*    boxShadow:*/}
          {/*      "0 6px 16px -2px rgba(8, 39, 25, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15), inset 0 2px 3px rgba(255, 255, 255, 0.9), inset 0 -2px 3px rgba(0, 0, 0, 0.3)",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  /!* Glass Specular Flare Reflection *!/*/}
          {/*  <div className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full bg-white/90 blur-[0.4px] rotate-[-25deg]" />*/}

          {/*  /!* Inner Glowing Core Bead *!/*/}
          {/*  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981] animate-pulse" />*/}
          {/*</div>*/}

          {/* Floating Live Telemetry Tooltip */}
          <div
            className={`absolute left-9 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#082719]/90 backdrop-blur-md border border-[#dfc79b]/40 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-[#f2e3c6] shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none ${
              isHovered || isDragging
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-[#10b981]" />
            <span>Z: {Math.round(scrollPercent)}%</span>
            <span className="text-[#dfc79b]/70 border-r border-white/20 pr-1 mr-0.5">
              {(scrollPercent * 10).toFixed(0)}mm
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Dimension Indicator (inspired by 163.7mm caliper) */}
      <div className="flex flex-col items-center mt-2 pointer-events-none opacity-70">
        <span className="font-mono text-[7px] text-[#5A626A] tracking-wider">
          END // ISO
        </span>
        <div className="w-2.5 h-[1px] bg-[#1c211b]/30 my-0.5" />
      </div>
    </aside>
  );
}
