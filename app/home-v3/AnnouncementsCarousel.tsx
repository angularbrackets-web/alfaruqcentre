"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Jummah Prayer",
    subtitle: "Every Friday",
    desc: "Three congregations: 12:30 PM · 1:30 PM · 2:30 PM",
    image: "/Al.FaruqPrayerHall.jpeg",
    tag: "WEEKLY",
    tagBg: "#16a34a",
  },
  {
    id: 2,
    title: "Weekend Quran School",
    subtitle: "Saturdays & Sundays",
    desc: "Ages 5–12 · Classes run 11 AM – 2 PM",
    image: "/AlFaruqWeekendQuranSchool.March2025.jpeg",
    tag: "ENROLL",
    tagBg: "#2563eb",
  },
  {
    id: 3,
    title: "Ramadan Programs",
    subtitle: "Coming Soon",
    desc: "Tarawih, Qiyam, Iftar gatherings and Quran completion",
    image: "/AlFaruqRamadanPrograms2025.jpeg",
    tag: "RAMADAN",
    tagBg: "#7c3aed",
  },
  {
    id: 4,
    title: "Summer Camp 2025",
    subtitle: "July & August",
    desc: "Quran, Arabic, Islamic Studies, Language Arts & Math",
    image: "/AFIS.SummerCamp.2025.jpeg",
    tag: "REGISTER",
    tagBg: "#ea580c",
  },
  {
    id: 5,
    title: "School Enrollment",
    subtitle: "Al-Faruq Islamic School",
    desc: "Alberta-accredited KG–Grade 9. Now accepting applications.",
    image: "/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.jpeg",
    tag: "APPLY",
    tagBg: "#0891b2",
  },
];

const CARD_WIDTH = 300;
const CARD_GAP = 20;

export default function AnnouncementsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP), behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-[0.25em] mb-3">
              The Latest at Al-Faruq
            </p>
            <h2
              className="text-[#0A0A0A] font-black leading-none"
              style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
            >
              What&apos;s Happening
            </h2>
          </div>

          {/* Arrow nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center
                hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center
                hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel track — full bleed */}
      <motion.div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scroll-smooth hide-scrollbar cursor-grab active:cursor-grabbing pl-4 sm:pl-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-8"
        style={{ scrollbarWidth: "none" }}
        onScroll={updateScrollState}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative flex-shrink-0 rounded-xl overflow-hidden group"
            style={{ width: CARD_WIDTH, height: 420 }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="300px"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Category tag — VOUS style */}
            <span
              className="absolute top-4 left-4 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm"
              style={{ backgroundColor: slide.tagBg }}
            >
              {slide.tag}
            </span>

            {/* Text at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white/50 text-[9px] uppercase tracking-[0.2em] mb-1.5 font-medium">
                {slide.subtitle}
              </p>
              <h3 className="text-white font-bold text-xl leading-tight mb-2">{slide.title}</h3>
              <p className="text-white/60 text-sm leading-snug mb-3">{slide.desc}</p>
              <span className="text-white/70 text-[11px] font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 group-hover:text-white transition-colors">
                ▶ Learn More
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
