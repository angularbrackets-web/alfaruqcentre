"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  nextPrayerName?: string;
  nextPrayerTime?: string;
  minutesUntil?: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

export default function HeroSection({
  nextPrayerName = "Asr",
  nextPrayerTime = "4:00 PM",
  minutesUntil = 135,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 600], ["0%", "20%"]);
  const backgroundScale = useTransform(scrollY, [0, 600], [1.0, 1.08]);

  const formatTime = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex flex-col items-center justify-center"
      aria-label="Hero section"
    >
      {/* Background media with zoom-in settle + parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        {/* Video — desktop only */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          aria-hidden="true"
        >
          <source src="/Classrooms.Funding.mp4" type="video/mp4" />
        </video>

        {/* Fallback image — always visible as base, video overlays on desktop */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/Al.FaruqPrayerHall.jpeg"
            alt="Al-Faruq Prayer Hall"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20 z-[1]"
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto w-full gap-5">
        {/* 1. Top badge */}
        <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeInUp}>
          <span className="inline-block border border-[#C9A84C]/70 text-[#C9A84C] text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            ✦ Serving Edmonton Since 2018 ✦
          </span>
        </motion.div>

        {/* 2. Main heading */}
        <motion.div
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col items-center gap-2"
        >
          <p
            className="text-[#C9A84C] text-2xl md:text-3xl"
            style={{ direction: "rtl", fontFamily: "Georgia, serif" }}
            aria-hidden="true"
          >
            الحمد لله
          </p>
          <h1 className="text-white font-bold text-5xl md:text-7xl lg:text-8xl leading-tight">
            <span className="font-extrabold">Al-Faruq</span>{" "}
            <span className="font-semibold">Islamic Centre</span>
          </h1>
        </motion.div>

        {/* 3. Subtitle */}
        <motion.p
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl"
        >
          A Place of Faith, Learning &amp; Community
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"
        >
          <Link
            href="/prayertimes"
            className="bg-white text-[#1E3A6E] rounded-full px-8 py-3 font-semibold
              transition-all duration-200 hover:bg-white/90 hover:scale-105 inline-block"
          >
            Plan Your Visit
          </Link>
          <Link
            href="https://donorchoice.ca/dia"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white text-white rounded-full px-8 py-3 font-semibold
              transition-all duration-200 hover:bg-white/10 inline-block"
          >
            Support Our Masjid →
          </Link>
        </motion.div>

        {/* 5. Prayer countdown badge */}
        <motion.div custom={1.0} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-white/90 text-sm font-medium">
              Next Prayer:{" "}
              <span className="text-white font-semibold">{nextPrayerName}</span>{" "}
              in{" "}
              <span className="text-[#C9A84C] font-semibold">
                {formatTime(minutesUntil)}
              </span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
