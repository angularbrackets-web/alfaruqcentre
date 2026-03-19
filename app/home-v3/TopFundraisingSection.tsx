"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, MapPin } from "lucide-react";
import FundraiserBanner from "./FundraiserBanner";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";
import { CelebrationBackground } from "@/app/components/CelebrationBackground";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface FeaturedVideo {
  id: string;
  src: string;
  heading?: string;
  animateHeading?: boolean;
  subheading?: string;
  tagline?: string;
  description?: string;
  venue?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface FeaturedImage {
  id: string;
  src: string;
  heading?: string;
  animateHeading?: boolean;
  subheading?: string;
  tagline?: string;
  description?: string;
  venue?: string;
  ctaText?: string;
  ctaUrl?: string;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
function useSectionSettings() {
  const [showSection, setShowSection] = useState(true);
  const [animationStyle, setAnimationStyle] = useState<'none' | 'particles' | 'fireworks'>('none');
  const [mode, setMode] = useState<"fundraising" | "videos" | "images">("fundraising");
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [images, setImages] = useState<FeaturedImage[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.showFundraisingSection === "false") setShowSection(false);
        if (data.fundraisingAnimationStyle) {
          setAnimationStyle(data.fundraisingAnimationStyle as 'none' | 'particles' | 'fireworks');
        } else if (data.showFundraisingAnimation === "true") {
          setAnimationStyle('particles');
        }
        if (data.donationSectionMode === "videos") setMode("videos");
        if (data.donationSectionMode === "images") setMode("images");
        
        if (data.featuredVideos) {
          try {
            const parsed = JSON.parse(data.featuredVideos);
            if (Array.isArray(parsed)) setVideos(parsed);
          } catch {
            // ignore malformed JSON
          }
        }

        if (data.featuredImages) {
          try {
            const parsed = JSON.parse(data.featuredImages);
            if (Array.isArray(parsed)) setImages(parsed);
          } catch {
            // ignore malformed JSON
          }
        }
      })
      .catch(() => {});
  }, []);

  return { showSection, animationStyle, mode, videos, images };
}

// ── Featured video showcase ────────────────────────────────────────────────────
function FeaturedVideoShowcase({ videos, animationStyle }: { videos: FeaturedVideo[]; animationStyle: 'none' | 'particles' | 'fireworks' }) {
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

      {/* Background Effects */}
      {animationStyle !== 'none' && <CelebrationBackground type={animationStyle} />}

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
                <p className="text-white text-[11px] font-medium uppercase tracking-[0.35em] mb-5 whitespace-pre-line">
                  {active.subheading}
                </p>
              )}

              {active.heading && (
                <motion.h2
                  animate={active.animateHeading ? { 
                    color: ["#4F46E5", "#10B981", "#9333EA", "#7C3AED", "#4F46E5"],
                    textShadow: [
                      "0 0 20px rgba(79, 70, 229, 0.4)",
                      "0 0 20px rgba(16, 185, 129, 0.4)",
                      "0 0 20px rgba(147, 51, 234, 0.4)",
                      "0 0 20px rgba(124, 58, 237, 0.4)",
                      "0 0 20px rgba(79, 70, 229, 0.4)"
                    ]
                  } : { color: "#ffffff", textShadow: "none" }}
                  transition={active.animateHeading ? { 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  } : { duration: 0 }}
                  className="text-white font-black leading-none mb-6 whitespace-pre-line"
                  style={{ fontSize: "clamp(28px, 4vw, 64px)", letterSpacing: "-0.025em" }}
                >
                  {active.heading}
                </motion.h2>
              )}

              {active.tagline && (
                <h3 className="text-white/90 text-lg md:text-2xl font-light mb-6 whitespace-pre-line">
                  {active.tagline}
                </h3>
              )}

              {active.venue && (
                <div className="inline-flex items-center gap-1.5 bg-white text-black text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 relative z-10 w-fit">
                  <MapPin size={12} strokeWidth={2.5} />
                  {active.venue}
                </div>
              )}

              {active.description && (
                <p className="text-white text-[15px] leading-relaxed max-w-md mb-8 whitespace-pre-line">
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

// ── Featured image showcase ────────────────────────────────────────────────────
function FeaturedImageShowcase({ images, animationStyle }: { images: FeaturedImage[]; animationStyle: 'none' | 'particles' | 'fireworks' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const donateUrl = useDonateUrl();

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const active = images[safeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index === safeIndex) return;
      setActiveIndex(index);
      setProgress(0);
    },
    [safeIndex]
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const duration = 8000; // 8 seconds per image
    const intervalMs = 50;
    
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + intervalMs / duration;
        if (next >= 1) {
          setActiveIndex((i) => (i + 1) % images.length);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [images.length, activeIndex]);

  if (!images.length) return null;

  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Atmospheric blurred background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={`img-bg-${safeIndex}`}
            src={active.src}
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

      {/* Background Effects */}
      {animationStyle !== 'none' && <CelebrationBackground type={animationStyle} />}

      {/* Foreground */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-text-${safeIndex}`}
              className="lg:order-first"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {active.subheading && (
                <p className="text-white text-[11px] font-medium uppercase tracking-[0.35em] mb-5 whitespace-pre-line">
                  {active.subheading}
                </p>
              )}

              {active.heading && (
                <motion.h2
                  animate={active.animateHeading ? { 
                    color: ["#4F46E5", "#10B981", "#9333EA", "#7C3AED", "#4F46E5"],
                    textShadow: [
                      "0 0 20px rgba(79, 70, 229, 0.4)",
                      "0 0 20px rgba(16, 185, 129, 0.4)",
                      "0 0 20px rgba(147, 51, 234, 0.4)",
                      "0 0 20px rgba(124, 58, 237, 0.4)",
                      "0 0 20px rgba(79, 70, 229, 0.4)"
                    ]
                  } : { color: "#ffffff", textShadow: "none" }}
                  transition={active.animateHeading ? { 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  } : { duration: 0 }}
                  className="text-white font-black leading-none mb-6 whitespace-pre-line"
                  style={{ fontSize: "clamp(28px, 4vw, 64px)", letterSpacing: "-0.025em" }}
                >
                  {active.heading}
                </motion.h2>
              )}

              {active.tagline && (
                <h3 className="text-white/90 text-lg md:text-2xl font-light mb-6 whitespace-pre-line">
                  {active.tagline}
                </h3>
              )}

              {active.venue && (
                <div className="inline-flex items-center gap-1.5 bg-white text-black text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 relative z-10 w-fit">
                  <MapPin size={12} strokeWidth={2.5} />
                  {active.venue}
                </div>
              )}

              {active.description && (
                <p className="text-white text-[15px] leading-relaxed max-w-md mb-8 whitespace-pre-line">
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
              {images.length > 1 && (
                <div className="flex gap-2 mt-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Image ${i + 1}`}
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

          {/* Right: image */}
          <div
            className="relative lg:order-last mx-auto w-full"
            style={{ maxWidth: "320px", width: "100%", maxHeight: "600px" }}
          >
            <AnimatePresence>
              <motion.div
                key={`img-pic-${safeIndex}`}
                className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 flex items-center justify-center bg-black/40"
                style={{
                  boxShadow: "0 12px 80px rgba(0,0,0,0.85), 0 0 100px rgba(201,168,76,0.10)",
                  aspectRatio: "auto",
                  minHeight: "400px"
                }}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.10 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={active.src}
                  alt={active.heading || "Featured image"}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "600px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
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
  const { showSection, animationStyle, mode, videos, images } = useSectionSettings();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (!showSection) return null;

  if (mode === "videos" && videos.length > 0) {
    return <FeaturedVideoShowcase videos={videos} animationStyle={animationStyle} />;
  }
  
  if (mode === "images" && images.length > 0) {
    return <FeaturedImageShowcase images={images} animationStyle={animationStyle} />;
  }

  return (
    <FundraiserBanner
      dismissed={bannerDismissed}
      animationStyle={animationStyle}
      onDismiss={() => setBannerDismissed(true)}
    />
  );
}
