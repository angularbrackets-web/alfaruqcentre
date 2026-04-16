"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, MapPin } from "lucide-react";
import FundraiserBanner from "./FundraiserBanner";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";
import { CelebrationBackground } from "@/app/components/CelebrationBackground";

const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

function GlowBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-[3px] rounded-2xl overflow-hidden group h-full w-full">
      {/* Rotating Background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#818cf8,#34d399,#c084fc,#a78bfa,#818cf8)] opacity-100"
      />
      {/* Soft Glow Shadow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#818cf8,#34d399,#c084fc,#a78bfa,#818cf8)] opacity-40 blur-3xl"
      />
      {/* Content Container */}
      <div className="relative z-10 bg-black rounded-[13px] overflow-hidden h-full w-full">
        {children}
      </div>
    </div>
  );
}


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
    <section 
      className="relative bg-[#0A0A0A] overflow-hidden"
    >
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
                  animate={{ 
                    backgroundPosition: ["0% center", "200% center"],
                    textShadow: active.animateHeading ? [
                      "0 0 20px rgba(129, 140, 248, 0.4)",
                      "0 0 20px rgba(52, 211, 153, 0.4)",
                      "0 0 20px rgba(192, 132, 252, 0.4)",
                      "0 0 20px rgba(167, 139, 250, 0.4)",
                      "0 0 20px rgba(129, 140, 248, 0.4)"
                    ] : "none"
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="font-black leading-none mb-6 whitespace-pre-line"
                  style={{ 
                    fontSize: "clamp(28px, 4vw, 64px)", 
                    letterSpacing: "-0.025em",
                    backgroundImage: active.animateHeading 
                      ? "linear-gradient(to right, #818cf8, #34d399, #c084fc, #a78bfa, #818cf8)"
                      : "linear-gradient(135deg, #fff 0%, #e5e5e5 25%, #fff 50%, #d1d1d1 75%, #fff 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    maskImage: noiseSvg,
                    WebkitMaskImage: noiseSvg,
                  }}
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
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.10 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlowBorder>
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
                </GlowBorder>
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
  const [isHovered, setIsHovered] = useState(false);
  const donateUrl = useDonateUrl();

  useEffect(() => {
    if (images.length <= 1) return;
    if (isHovered) return; // Pause on hover for better UX
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 8000); // 8 seconds per image
    
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  if (!images.length) return null;

  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden py-12 md:py-20">
      {/* Background blurred image of the active one */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={`img-bg-${activeIndex}`}
            src={images[activeIndex].src}
            className="absolute inset-0 w-full h-full object-cover scale-125"
            style={{ filter: "blur(80px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/92 via-[#0A0A0A]/85 to-[#0A0A0A]/95" />
      </div>

      {animationStyle !== 'none' && <CelebrationBackground type={animationStyle} />}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading indicating this is an events/campaigns section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-3">Featured Campaigns</h2>
          <p className="text-[#C9A84C] text-xs md:text-sm font-black uppercase tracking-[0.2em]">Explore our upcoming initiatives and events</p>
        </div>

        {/* The Accordion Container */}
        <div 
          className="flex flex-row gap-2 md:gap-4 h-[460px] sm:h-[550px] md:h-[650px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            const hasContent = !!(img.venue || img.heading || img.tagline || img.subheading || img.description || img.ctaText);
            const collapsedTitle = img.heading || img.tagline || img.subheading || "Featured Event";
            
            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => {
                  if(typeof window !== "undefined" && window.innerWidth >= 1024) setActiveIndex(i);
                }}
                className={`relative overflow-hidden rounded-[16px] md:rounded-[24px] cursor-pointer group transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
                  isActive 
                    ? 'flex-[3.5] lg:flex-[3] ring-1 ring-white/10 shadow-2xl shadow-[#C9A84C]/5' 
                    : 'flex-[1] lg:flex-[1.2] ring-1 ring-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Image filling the panel */}
                <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]">
                  {/* Blurred background map for the expanded state */}
                  <img src={img.src} className={`absolute inset-0 w-full h-full object-cover blur-[25px] scale-125 pointer-events-none transition-opacity duration-[800ms] ${isActive ? 'opacity-40' : 'opacity-0'}`} alt="" />
                  
                  {/* Collapsed Image (covers the narrow slice) */}
                  <img 
                    src={img.src}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.3,1)] pointer-events-none ${isActive ? 'opacity-0 scale-[1.05]' : 'opacity-40 group-hover:opacity-75 scale-100'}`}
                  />

                  {/* Expanded Image (shows full flyer without cropping) */}
                  <img 
                    src={img.src}
                    alt={img.heading || "Featured Event"}
                    className={`absolute inset-0 z-10 w-full h-full object-contain transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.95]'}`}
                  />
                  
                  {/* Subtle gradient so overlaid text (if any) is readable */}
                  {hasContent && (
                    <div className={`absolute z-20 inset-0 transition-opacity duration-700 pointer-events-none ${isActive ? 'bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-100' : 'bg-transparent opacity-0'}`} />
                  )}
                </div>

                {/* Content Overlay */}
                {hasContent && (
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        key={`content-${i}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="absolute z-30 inset-x-0 bottom-0 p-3 sm:p-4 md:p-6 flex flex-col justify-end pointer-events-none"
                      >
                        {/* Dark glassmorphic container to make sure poster text doesn't clash with overlaid text */}
                        <div className="max-w-xl bg-[#0A0A0A]/70 backdrop-blur-xl p-4 sm:p-5 md:p-7 rounded-[14px] md:rounded-[20px] border border-white/10 shadow-2xl pointer-events-auto">
                          {img.venue && (
                             <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-white text-[9px] md:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 md:mb-4 w-fit">
                               <MapPin size={10} className="md:w-3 md:h-3" strokeWidth={2.5} />
                               {img.venue}
                             </div>
                          )}
                          
                          {img.heading && (
                            <h2 className="text-lg sm:text-xl md:text-3xl font-black text-white leading-tight mb-1.5 md:mb-2 uppercase truncate md:whitespace-normal">
                              {img.heading}
                            </h2>
                          )}

                          {(img.subheading || img.tagline) && (
                            <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium max-w-lg mb-2 md:mb-3 line-clamp-1 md:line-clamp-2">
                              {img.tagline || img.subheading}
                            </p>
                          )}
                          
                          {img.description && (
                            <p className="hidden md:block text-white/60 text-xs md:text-sm max-w-lg mb-5 line-clamp-2 md:line-clamp-3 leading-relaxed">
                              {img.description}
                            </p>
                          )}

                          {img.ctaText && (
                            <a
                              href={img.ctaUrl || donateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center w-fit gap-1.5 md:gap-2 bg-[#C9A84C] text-[#0A0A0A] font-extrabold
                                text-[9px] md:text-[11px] uppercase tracking-[0.15em] px-4 md:px-6 py-2 md:py-3 rounded-full
                                hover:bg-[#D4B55E] transition-colors duration-200 mt-1 md:mt-0"
                            >
                              {img.ctaText}
                              <span className="text-xs md:text-sm leading-none">→</span>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Collapsed State Title */}
                <div 
                  className={`absolute z-30 inset-0 py-6 px-1 md:p-5 flex flex-col justify-end lg:justify-center items-center pointer-events-none transition-all duration-500 ${isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100 delay-300'}`}
                >
                  {/* Vertical text on everywhere */}
                  <span 
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
                    className="block text-white/50 group-hover:text-white/90 font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase transition-colors text-[10px] md:text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-h-full"
                  >
                     {collapsedTitle}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress Dots Indicator for mobile */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-[#C9A84C]" : "w-2 bg-white/20"
              }`}
            />
          ))}
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

  if (mode === "videos") {
    return <FeaturedVideoShowcase 
      videos={videos} 
      animationStyle={animationStyle} 
    />;
  }

  if (mode === "images") {
    return <FeaturedImageShowcase 
      images={images} 
      animationStyle={animationStyle} 
    />;
  }

  return <FundraiserBanner 
    dismissed={bannerDismissed}
    onDismiss={() => setBannerDismissed(true)}
    animationStyle={animationStyle} 
  />;
}
