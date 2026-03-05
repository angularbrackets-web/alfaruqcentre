"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const SERVICES = [
  {
    id: 1,
    title: "Jummah Prayer",
    meta: "FRI · 12:30 · 1:30 · 2:30 PM",
    image: "/Al.FaruqPrayerHall.jpeg",
    hasVideo: true,
    href: "/prayertimes",
  },
  {
    id: 2,
    title: "Daily Prayers",
    meta: "5 DAILY CONGREGATIONAL PRAYERS",
    image: "/AlFaruq.KhatimalQuran.jpeg",
    hasVideo: false,
    href: "/prayertimes",
  },
  {
    id: 3,
    title: "Weekend Quran School",
    meta: "SAT & SUN · 11 AM – 2 PM",
    image: "/AlFaruqWeekendQuranSchool.March2025.jpeg",
    hasVideo: true,
    href: "/weekendschool",
  },
  {
    id: 4,
    title: "Islamic School",
    meta: "KINDERGARTEN – GRADE 9",
    image: "/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.jpeg",
    hasVideo: false,
    href: "https://www.alfaruqislamicschool.com",
  },
];

const CARD_W = 320;
const GAP = 16;

export default function VisitSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (d: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: d === "right" ? CARD_W + GAP : -(CARD_W + GAP),
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#0F2347] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white font-black leading-none mb-2"
              style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
              Visit Al-Faruq
            </h2>
            <p className="text-white/50 text-base mb-3">
              Join us for daily prayers, Jummah, and community programs.
            </p>
            <Link
              href="/prayertimes"
              className="text-white text-sm font-bold uppercase tracking-[0.12em] underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Learn More →
            </Link>
          </motion.div>

          {/* Arrow nav */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => scroll("left")}
              disabled={!canL}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center
                hover:bg-white hover:border-white hover:text-[#0A0A0A] transition-all duration-200
                disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canR}
              aria-label="Next"
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center
                hover:bg-white hover:border-white hover:text-[#0A0A0A] transition-all duration-200
                disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar
          pl-4 sm:pl-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-8"
        style={{ scrollbarWidth: "none" }}
        onScroll={sync}
      >
        {SERVICES.map((s, i) => (
          <motion.a
            key={s.id}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex-shrink-0 relative rounded-xl overflow-hidden group block"
            style={{ width: CARD_W, height: 420 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="320px"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Play overlay */}
            {s.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                  <Play size={18} fill="white" className="text-white ml-0.5" strokeWidth={0} />
                </div>
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white/50 text-[9px] uppercase tracking-[0.25em] font-medium mb-1.5">
                {s.meta}
              </p>
              <h3 className="text-white font-bold text-xl leading-tight">{s.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
