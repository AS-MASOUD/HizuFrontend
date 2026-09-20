"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle2 } from "lucide-react";

interface CourseVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  durationText?: string;
}

export default function CourseVideoPlayer({
  videoUrl,
  posterUrl,
  title,
  durationText,
}: CourseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!videoUrl) {
    return (
      <div className="relative aspect-video rounded-2xl bg-[#16191d] border border-[#1c211b]/15 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#082719] text-[#dfc79b] flex items-center justify-center border border-[#dfc79b]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm text-white">{title}</span>
          <span className="text-xs text-[#dfc79b]/80">
            ویدیو پیش‌نمایش این دوره به زودی در سرور فایل بارگذاری خواهد شد.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-[#16191d] border border-[#1c211b]/20 overflow-hidden shadow-2xl group">
      {/* Video Element with Explicit Aspect Ratio & Poster */}
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          controls={hasStarted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
        >
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>

        {/* Initial Custom Play Overlay (before starting playback) */}
        {!hasStarted && (
          <div
            onClick={handlePlayToggle}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/30 z-10"
          >
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#082719]/90 border-2 border-[#dfc79b] text-[#dfc79b] flex items-center justify-center shadow-[0_0_30px_rgba(223,199,155,0.4)] group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-current" />
              </div>
              <span className="absolute -inset-2 rounded-full border border-[#dfc79b]/40 animate-ping pointer-events-none opacity-60" />
            </div>

            <div className="mt-4 flex flex-col items-center gap-1 text-center px-4">
              <span className="text-white font-black text-sm sm:text-base drop-shadow-md">
                مشاهده ویدیوی معرفی و تدریس نمونه دوره
              </span>
              {durationText && (
                <span className="text-xs font-mono text-[#dfc79b] bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  مدت پیش‌نمایش: {durationText}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Banner Bar */}
      <div className="p-3.5 bg-[#16191d] border-t border-white/10 flex items-center justify-between text-xs text-white/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
            نمونه ویدیوی تدریس: {title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#dfc79b] font-mono shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>پخش با کیفیت HD</span>
        </div>
      </div>
    </div>
  );
}
