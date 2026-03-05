"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const values = [
  {
    number: "01",
    title: "Tawheed",
    desc: "The oneness of Allah — the foundation of all belief.",
  },
  {
    number: "02",
    title: "Ilm",
    desc: "Seeking knowledge is an obligation upon every Muslim.",
  },
  {
    number: "03",
    title: "Taqwa",
    desc: "God-consciousness that guides every action and intention.",
  },
  {
    number: "04",
    title: "Ummah",
    desc: "Unity of the community — we rise and serve together.",
  },
  {
    number: "05",
    title: "Adab",
    desc: "Good character and manners in all dealings with others.",
  },
  {
    number: "06",
    title: "Ihsan",
    desc: "Excellence in worship — as if you see Allah, He sees you.",
  },
  {
    number: "07",
    title: "Sabr",
    desc: "Patience and steadfastness in the face of all trials.",
  },
];

const CARD_WIDTH = 280;
const CARD_GAP = 16;

export default function IslamicValuesCarousel() {
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
    <section className="bg-[#0A0A0A] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-3">
              Our Foundation
            </p>
            <h2
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
            >
              Our Values
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center
                hover:bg-white hover:text-[#0A0A0A] transition-all duration-200
                disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center
                hover:bg-white hover:text-[#0A0A0A] transition-all duration-200
                disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel track */}
      <motion.div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar cursor-grab active:cursor-grabbing pl-4 sm:pl-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-8"
        style={{ scrollbarWidth: "none" }}
        onScroll={updateScrollState}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {values.map((value, i) => (
          <div
            key={value.number}
            className="flex-shrink-0 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 hover:border-white/25 transition-colors duration-300"
            style={{ width: CARD_WIDTH }}
          >
            <span className="text-white/15 font-black text-5xl leading-none select-none">
              {value.number}
            </span>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">{value.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{value.desc}</p>
            </div>
            {/* Gold underline accent */}
            <div
              className="h-px bg-[#C9A84C] opacity-40"
              style={{ width: `${40 + (i % 4) * 15}px` }}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
