"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronUp, ChevronDown, Facebook, Instagram, Youtube } from "lucide-react";
import type { HeroSlide } from "@/app/types/heroSlide";

// Scale title font down as character count grows so it always fits the fixed-height row
function getTitleFontSize(title: string): string {
  const chars = title.replace(/\n/g, " ").length;
  if (chars <= 10) return "clamp(60px, 8.5vw, 96px)";
  if (chars <= 16) return "clamp(48px, 7vw, 80px)";
  if (chars <= 24) return "clamp(38px, 5.5vw, 64px)";
  if (chars <= 34) return "clamp(30px, 4.2vw, 50px)";
  return "clamp(24px, 3.2vw, 38px)";
}

const SOCIAL = [
  { Icon: Facebook,  href: "https://www.facebook.com/alfaruqcentre",       label: "Facebook"  },
  { Icon: Instagram, href: "https://www.instagram.com/alfaruqcentre/",      label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@alfaruqislamiccentre", label: "YouTube"   },
];

interface HeroV3Props {
  nextPrayerName?: string;
  minutesUntil?: number;
}

// ─── Media box (shared between desktop and mobile) ────────────────────────────

function SlideMedia({
  slide,
  minutesUntil,
  nextPrayerName,
}: {
  slide: HeroSlide;
  minutesUntil: number;
  nextPrayerName: string;
}) {
  const isExternal = slide.linkUrl?.startsWith("http");

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Description + CTA — grouped at bottom-left */}
      {(slide.description || slide.linkText) && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`bottom-${slide.id}`}
            className="absolute bottom-5 left-5 right-5 lg:max-w-lg flex flex-col items-start gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {slide.description && (
              <p className="text-white/90 text-[15px] lg:text-[17px] font-normal leading-snug">
                {slide.description}
              </p>
            )}

            {slide.linkText && (
              slide.linkUrl ? (
                <Link
                  href={slide.linkUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <motion.span
                    className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold
                      text-[12px] lg:text-[13px] uppercase tracking-[0.15em] px-6 py-3 rounded-full
                      hover:bg-[#C9A84C] hover:text-white transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {slide.linkText}
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </motion.span>
                </Link>
              ) : (
                <span
                  className="inline-flex items-center gap-2 bg-white/20 text-white font-bold
                    text-[12px] lg:text-[13px] uppercase tracking-[0.15em] px-6 py-3 rounded-full border border-white/30"
                >
                  {slide.linkText}
                </span>
              )
            )}
          </motion.div>
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
          <div className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 backdrop-blur-sm bg-black/20">
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
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroV3Classic({ minutesUntil = 0, nextPrayerName = "" }: HeroV3Props) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    fetch("/api/slides")
      .then((r) => r.json())
      .then((data: HeroSlide[]) => {
        const active = data.filter((s) => s.status === "ACTIVE");
        setSlides(active);
      })
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

  // Per-slide duration
  useEffect(() => {
    if (slides.length < 2) return;
    const duration = slides[active]?.duration ?? 6000;
    const id = setInterval(() => navigate(1), duration);
    return () => clearInterval(id);
  }, [navigate, slides, active]);

  const item = slides[active];

  // Loading / empty skeleton
  if (!item) {
    return (
      <section
        className="relative"
        style={{ background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 60%, #111111 100%)" }}
      >
        <div className="pt-[236px] lg:pt-[176px] relative z-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-4 animate-pulse">
            <div className="flex items-start gap-6 pt-8 pb-6">
              <div className="w-48 lg:w-72 h-24 bg-gray-100 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-40 bg-gray-100 rounded mx-auto" />
                <div className="h-12 w-64 bg-gray-100 rounded mx-auto" />
              </div>
              <div className="w-48 lg:w-72" />
            </div>
            <div className="aspect-video bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  // Split title on newline for multi-line rendering
  const titleLines = item.title.split("\n").filter(Boolean);

  return (
    <section className="relative bg-white">
      <div className="pt-[236px] lg:pt-[176px] relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-4">

          {/* ── Row: Logo · Subtitle+Title · spacer — fixed height so media never shifts ── */}
          <div className="flex items-end gap-6 pt-4 pb-4 h-32 lg:h-44 overflow-hidden">

            {/* Logo — left */}
            <Link href="/home-v3" className="flex-shrink-0">
              <Image
                src="/AlFaruqLogo.png"
                width={416}
                height={150}
                alt="Al-Faruq Islamic Centre"
                className="object-contain w-28 lg:w-44"
                style={{ height: "auto" }}
                priority
              />
            </Link>

            {/* Centre: subtitle → title → description */}
            <div className="flex-1 min-w-0 text-center">

              {/* Subtitle (gold label above heading) */}
              {item.subtitle && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`subtitle-${item.id}`}
                    className="text-[#C9A84C] text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.25em] mb-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.subtitle}
                  </motion.p>
                </AnimatePresence>
              )}

              {/* Title — big heading */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${item.id}`}
                  className="text-[#0A0A0A] font-black leading-none uppercase"
                  style={{ fontSize: getTitleFontSize(item.title), letterSpacing: "-0.02em" }}
                  initial={{ opacity: 0, y: dir * 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: dir * -24 }}
                  transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {titleLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </motion.h1>
              </AnimatePresence>

            </div>

            {/* Phantom spacer — mirrors logo width to keep centre truly centred */}
            <div className="flex-shrink-0 w-28 lg:w-44" aria-hidden />

          </div>

          {/* ── Desktop: 3-column grid [social | media | nav] ── */}
          <div className="hidden lg:grid grid-cols-[48px_1fr_60px] items-start gap-4 xl:gap-6">

            {/* Left: social icons */}
            <div className="flex flex-col items-center gap-4 pt-2">
              <span
                className="text-[#0A0A0A]/45 text-[9px] uppercase tracking-[0.35em] select-none"
                style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
              >
                Connect
              </span>
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#0A0A0A]/55 hover:text-[#0A0A0A] transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
              <div className="w-px h-12 bg-[#0A0A0A]/10 mt-1" />
            </div>

            {/* Centre: media */}
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0A0A0A]">
              <SlideMedia slide={item} minutesUntil={minutesUntil} nextPrayerName={nextPrayerName} />
            </div>

            {/* Right: navigation */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={() => navigate(-1)}
                aria-label="Previous slide"
                className="text-[#0A0A0A]/55 hover:text-[#0A0A0A] transition-colors duration-200"
              >
                <ChevronUp size={20} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                    className={`w-[3px] rounded-full transition-all duration-300 ${
                      i === active ? "h-6 bg-[#0A0A0A]" : "h-2 bg-[#0A0A0A]/35 hover:bg-[#0A0A0A]/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate(1)}
                aria-label="Next slide"
                className="text-[#0A0A0A]/55 hover:text-[#0A0A0A] transition-colors duration-200"
              >
                <ChevronDown size={20} strokeWidth={1.5} />
              </button>

              <div className="w-px h-12 bg-[#0A0A0A]/20 mt-1" />
              <span
                className="text-[#0A0A0A]/45 text-[9px] uppercase tracking-[0.35em] select-none"
                style={{ writingMode: "vertical-lr" }}
              >
                Discover
              </span>
            </div>

          </div>

          {/* ── Mobile: media + controls ── */}
          <div className="lg:hidden">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0A0A0A]">
              <SlideMedia slide={item} minutesUntil={minutesUntil} nextPrayerName={nextPrayerName} />
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-4">
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors duration-200"
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous slide"
                  className="text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors"
                >
                  <ChevronUp size={18} strokeWidth={1.5} />
                </button>
                <div className="flex gap-1.5 items-center">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                      className={`rounded-full transition-all duration-300 ${
                        i === active ? "w-4 h-[3px] bg-[#0A0A0A]" : "w-[3px] h-[3px] bg-[#0A0A0A]/35"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigate(1)}
                  aria-label="Next slide"
                  className="text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors"
                >
                  <ChevronDown size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
