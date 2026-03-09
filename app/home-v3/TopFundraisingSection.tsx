"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import FundraiserBanner from "./FundraiserBanner";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface FeaturedVideo {
  id: string;
  src: string;
  heading?: string;
  subheading?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
function useSectionSettings() {
  const [mode, setMode] = useState<"fundraising" | "videos">("fundraising");
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.donationSectionMode === "videos") setMode("videos");
        if (data.featuredVideos) {
          try {
            const parsed = JSON.parse(data.featuredVideos);
            if (Array.isArray(parsed)) setVideos(parsed);
          } catch {
            // ignore malformed JSON
          }
        }
      })
      .catch(() => {});
  }, []);

  return { mode, videos };
}

// ── Featured video showcase ────────────────────────────────────────────────────
function FeaturedVideoShowcase({ videos }: { videos: FeaturedVideo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const donateUrl = useDonateUrl();

  const safeIndex = Math.min(activeIndex, videos.length - 1);
  const active = videos[safeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index === safeIndex) return;
      setActiveIndex(index);
      setProgress(0);
    },
    [safeIndex]
  );

  function handleEnded() {
    if (videos.length <= 1) return;
    setActiveIndex((i) => (i + 1) % videos.length);
    setProgress(0);
  }

  if (!videos.length) return null;

  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Atmospheric blurred background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.video
            key={`bg-${safeIndex}`}
            src={active.src}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover scale-125"
            style={{ filter: "blur(80px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/92 via-[#0A0A0A]/78 to-[#0A0A0A]/92" />
      </div>

      {/* Foreground */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${safeIndex}`}
              className="lg:order-first"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {active.subheading && (
                <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.35em] mb-5">
                  {active.subheading}
                </p>
              )}

              {active.heading && (
                <h2
                  className="text-white font-black leading-none mb-6"
                  style={{ fontSize: "clamp(28px, 4vw, 64px)", letterSpacing: "-0.025em" }}
                >
                  {active.heading}
                </h2>
              )}

              {active.description && (
                <p className="text-white/45 text-[15px] leading-relaxed max-w-md mb-8 whitespace-pre-line">
                  {active.description}
                </p>
              )}

              {active.ctaText && (
                <a
                  href={active.ctaUrl || donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#C9A84C] text-white font-bold
                    text-[11px] uppercase tracking-[0.15em] px-8 py-3.5 rounded-full
                    hover:bg-[#C9A84C]/80 transition-colors duration-200"
                >
                  {active.ctaText}
                  <span className="text-sm leading-none">→</span>
                </a>
              )}

              {/* Story progress bars */}
              {videos.length > 1 && (
                <div className="flex gap-2 mt-10">
                  {videos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Video ${i + 1}`}
                      className="flex-1 max-w-[48px] h-[3px] rounded-full overflow-hidden bg-white/15
                        hover:bg-white/25 transition-colors duration-200"
                    >
                      {i < safeIndex && (
                        <div className="h-full w-full bg-[#C9A84C]/70 rounded-full" />
                      )}
                      {i === safeIndex && (
                        <div
                          className="h-full bg-[#C9A84C] rounded-full"
                          style={{ width: `${progress * 100}%`, transition: "none" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Right: video */}
          <div
            className="relative lg:order-last mx-auto w-full"
            style={{ maxWidth: "320px", aspectRatio: "9 / 16" }}
          >
            <AnimatePresence>
              <motion.div
                key={`vid-${safeIndex}`}
                className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10"
                style={{
                  boxShadow: "0 12px 80px rgba(0,0,0,0.85), 0 0 100px rgba(201,168,76,0.10)",
                }}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.10 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <video
                  src={active.src}
                  autoPlay
                  muted={muted}
                  playsInline
                  preload="auto"
                  loop={videos.length <= 1}
                  onEnded={handleEnded}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration) setProgress(v.currentTime / v.duration);
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                {/* Mute / unmute toggle */}
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className="absolute bottom-4 right-4 z-10 flex items-center justify-center
                    w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm
                    text-white/70 hover:text-white hover:bg-black/70
                    transition-colors duration-200"
                >
                  {muted
                    ? <VolumeX size={15} strokeWidth={1.8} />
                    : <Volume2 size={15} strokeWidth={1.8} />
                  }
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function TopFundraisingSection() {
  const { mode, videos } = useSectionSettings();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (mode === "videos" && videos.length > 0) {
    return <FeaturedVideoShowcase videos={videos} />;
  }

  return (
    <FundraiserBanner
      dismissed={bannerDismissed}
      onDismiss={() => setBannerDismissed(true)}
    />
  );
}
