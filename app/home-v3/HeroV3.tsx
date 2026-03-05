"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/app/types/heroSlide";

function MosqueIllustration() {
  return (
    <svg
      viewBox="0 0 500 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#0A0A0A" strokeOpacity="0.20" strokeWidth="1.3" strokeLinejoin="round">
        <line x1="10" y1="318" x2="490" y2="318" />
        <rect x="62" y="88" width="30" height="142" />
        <path d="M 62,88 Q 77,62 92,88 Z" />
        <line x1="62" y1="148" x2="92" y2="148" />
        <line x1="62" y1="185" x2="92" y2="185" />
        <line x1="77" y1="45" x2="77" y2="62" />
        <path d="M 72,43 A 7,7 0 1,1 82,43 A 5,5 0 1,0 72,43 Z" />
        <rect x="408" y="88" width="30" height="142" />
        <path d="M 408,88 Q 423,62 438,88 Z" />
        <line x1="408" y1="148" x2="438" y2="148" />
        <line x1="408" y1="185" x2="438" y2="185" />
        <line x1="423" y1="45" x2="423" y2="62" />
        <path d="M 418,43 A 7,7 0 1,1 428,43 A 5,5 0 1,0 418,43 Z" />
        <rect x="92" y="208" width="316" height="110" />
        <line x1="92" y1="245" x2="408" y2="245" />
        <path d="M 105,208 A 145,145 0 0,1 395,208" />
        <path d="M 148,208 A 102,102 0 0,1 352,208" strokeOpacity="0.10" />
        <path d="M 180,208 A 70,70 0 0,1 320,208" strokeOpacity="0.07" />
        <line x1="250" y1="45" x2="250" y2="65" />
        <path d="M 244,43 A 9,9 0 1,1 256,43 A 6,6 0 1,0 244,43 Z" />
        <path d="M 218,318 L 218,272 Q 250,242 282,272 L 282,318" />
        <path d="M 118,300 L 118,268 Q 134,252 150,268 L 150,300" />
        <path d="M 350,300 L 350,268 Q 366,252 382,268 L 382,300" />
        <path d="M 130,240 L 130,218 Q 142,207 154,218 L 154,240" />
        <path d="M 346,240 L 346,218 Q 358,207 370,218 L 370,240" />
      </g>
    </svg>
  );
}

function getTitleFontSize(title: string): string {
  const chars = title.replace(/\n/g, " ").length;
  if (chars <= 10) return "clamp(72px, 10vw, 128px)";
  if (chars <= 18) return "clamp(56px, 8vw, 104px)";
  if (chars <= 28) return "clamp(44px, 6.5vw, 88px)";
  if (chars <= 40) return "clamp(34px, 5vw, 68px)";
  return "clamp(28px, 4vw, 52px)";
}


interface HeroV3Props {
  nextPrayerName?: string;
  minutesUntil?: number;
  noTopPadding?: boolean;
}

export default function HeroV3({ minutesUntil = 0, nextPrayerName = "", noTopPadding = false }: HeroV3Props) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setNavHeight(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/slides")
      .then((r) => r.json())
      .then((data: HeroSlide[]) => setSlides(data.filter((s) => s.status === "ACTIVE")))
      .catch(() => {});
  }, []);

  const navigate = useCallback(
    (d: 1 | -1) => {
      if (slides.length < 2) return;
      setDir(d);
      setActive((prev) => (prev + d + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => navigate(1), slides[active]?.duration ?? 6000);
    return () => clearInterval(id);
  }, [navigate, slides, active]);

  const item = slides[active];

  // Loading skeleton
  if (!item) {
    return (
      <section className="relative bg-white overflow-hidden">
        <div style={noTopPadding ? {} : { paddingTop: navHeight || 200 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 animate-pulse">
            <div className="pt-10 pb-8 space-y-4">
              <div className="h-3 w-44 bg-[#0A0A0A]/8 rounded" />
              <div className="h-20 w-3/4 bg-[#0A0A0A]/8 rounded" />
            </div>
            <div className="aspect-video bg-[#0A0A0A]/8 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const titleLines = item.title.split("\n").filter(Boolean);
  const isExternal = item.linkUrl?.startsWith("http");

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Mosque illustration — top-left watermark */}
      <div className="absolute -left-[80px] top-0 w-[520px] h-[360px] pointer-events-none select-none">
        <MosqueIllustration />
      </div>

      <div className="relative z-10" style={noTopPadding ? {} : { paddingTop: navHeight || 200 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">

          {/* ── Headline area — fixed height so carousel never shifts ── */}
          <div className="relative">

            {/* Logo watermark — top-right, overflowing */}
            <div className="absolute -right-[120px] -top-4 w-[780px] h-[300px] pointer-events-none select-none">
              <Image
                src="/AlFaruqLogo.png"
                alt=""
                fill
                className="object-contain opacity-[0.15]"
              />
            </div>

            {/* Title row — fixed height, clips overflow so CTA row is never pushed */}
            <div className="relative z-10 max-w-4xl h-[220px] lg:h-[272px] pt-10 overflow-hidden">

              {/* Eyebrow */}
              <p className="text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
                Al-Faruq Islamic Centre
              </p>

              {/* Display headline */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${item.id}`}
                  className="text-[#0A0A0A] font-black leading-[0.92]"
                  style={{ fontSize: getTitleFontSize(item.title), letterSpacing: "-0.03em" }}
                  initial={{ opacity: 0, y: dir * 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: dir * -20 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {titleLines.map((line, i) => {
                    const isLast = i === titleLines.length - 1;
                    return (
                      <span
                        key={i}
                        className={isLast && item.subtitle ? "flex items-center gap-3 flex-wrap" : "block"}
                      >
                        {line}
                        {isLast && item.subtitle && (
                          <span
                            className="inline-block bg-[#0A0A0A] text-white font-black uppercase
                              px-3 py-1.5 rounded-sm align-middle"
                            style={{ fontSize: "clamp(11px, 1.4vw, 18px)", letterSpacing: "0.15em" }}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* CTA row — fixed height, always reserves space below title */}
            <div className="relative z-10 h-14 flex items-center">
              {item.linkText && item.linkUrl && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cta-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    {isExternal ? (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#C9A84C] text-white font-bold
                          text-[12px] uppercase tracking-[0.15em] px-7 py-3 rounded-full
                          hover:bg-[#C9A84C]/80 transition-colors duration-200"
                      >
                        {item.linkText}
                        <span className="text-base leading-none">→</span>
                      </a>
                    ) : (
                      <Link
                        href={item.linkUrl}
                        className="inline-flex items-center gap-2 bg-[#C9A84C] text-white font-bold
                          text-[12px] uppercase tracking-[0.15em] px-7 py-3 rounded-full
                          hover:bg-[#C9A84C]/80 transition-colors duration-200"
                      >
                        {item.linkText}
                        <span className="text-base leading-none">→</span>
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

          </div>

          {/* ── Carousel ── */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0A0A0A]">

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

            {/* Description — bottom-left */}
            {item.description && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${item.id}`}
                  className="absolute bottom-5 left-5 right-5 lg:max-w-lg text-white/90
                    text-[15px] lg:text-[17px] font-normal leading-snug"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  {item.description}
                </motion.p>
              </AnimatePresence>
            )}

            {/* Next prayer badge — bottom-right */}
            {minutesUntil > 0 && (
              <motion.div
                className="absolute bottom-4 right-4"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-2
                  backdrop-blur-sm bg-black/20">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-white/60 text-[10px] tracking-[0.15em] uppercase whitespace-nowrap">
                    Next: <span className="text-white font-semibold">{nextPrayerName}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Controls row ── */}
          {slides.length > 1 && (
            <div className="flex items-center justify-end mt-5 px-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous slide"
                  className="text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <div className="flex gap-1.5 items-center">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                      className={`rounded-full transition-all duration-300 ${
                        i === active
                          ? "w-4 h-[3px] bg-[#0A0A0A]"
                          : "w-[3px] h-[3px] bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/60"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigate(1)}
                  aria-label="Next slide"
                  className="text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
