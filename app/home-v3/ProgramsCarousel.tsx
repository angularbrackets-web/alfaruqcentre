"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Program } from "@/app/types/program";

const CARD_WIDTH = 320;
const CARD_GAP = 20;

function MihrabArch() {
  return (
    <svg
      viewBox="0 0 500 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#0A0A0A" strokeOpacity="0.45" strokeWidth="2">
        {/* Outer arch */}
        <path d="M 70,600 L 70,310 Q 70,20 250,20 Q 430,20 430,310 L 430,600" />
        {/* Mid arch */}
        <path d="M 110,600 L 110,318 Q 110,75 250,75 Q 390,75 390,318 L 390,600" />
        {/* Inner arch */}
        <path d="M 150,600 L 150,326 Q 150,130 250,130 Q 350,130 350,326 L 350,600" />

        {/* Apex ornament — concentric circles at the top */}
        <circle cx="250" cy="130" r="28" />
        <circle cx="250" cy="130" r="16" />
        <circle cx="250" cy="130" r="6" />

        {/* Spring-line — horizontal rule at arch shoulder */}
        <line x1="70" y1="310" x2="430" y2="310" />
        <line x1="70" y1="310" x2="40" y2="310" />
        <line x1="430" y1="310" x2="460" y2="310" />

        {/* Base plinths */}
        <line x1="40" y1="520" x2="110" y2="520" />
        <line x1="390" y1="520" x2="460" y2="520" />
        <line x1="40" y1="540" x2="110" y2="540" />
        <line x1="390" y1="540" x2="460" y2="540" />

        {/* Decorative horizontals inside arch */}
        <line x1="150" y1="420" x2="350" y2="420" />
        <line x1="150" y1="480" x2="350" y2="480" />

        {/* Vertical dividers */}
        <line x1="210" y1="326" x2="210" y2="560" strokeOpacity="0.05" />
        <line x1="250" y1="158" x2="250" y2="560" strokeOpacity="0.05" />
        <line x1="290" y1="326" x2="290" y2="560" strokeOpacity="0.05" />
      </g>
    </svg>
  );
}

function SkeletonCards() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-2xl overflow-hidden bg-[#0A0A0A]/8 animate-pulse"
          style={{ width: CARD_WIDTH, height: 420 }}
        />
      ))}
    </>
  );
}

export default function ProgramsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data) => { if (data.success) setPrograms(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sync = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: dir === "right" ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #F0EBE0 0%, #C8BFA8 100%)" }}
    >

      {/* ── Content ── */}
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            {/* Islamic illustration — top-right, behind text */}
            <div className="absolute -right-20 -top-24 w-[340px] h-[340px] pointer-events-none select-none">
              <MihrabArch />
            </div>

            <div className="relative z-10">
              <p className="text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-3">
                What We Offer
              </p>
              <h2
                className="text-[#0A0A0A] font-black leading-none"
                style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.02em" }}
              >
                <span className="block">Education</span>
                <span className="flex items-center gap-3 flex-wrap">
                  <span>&amp; Programs</span>
                  <span
                    className="inline-block bg-[#0A0A0A] text-white font-black uppercase
                      px-3 py-1.5 rounded-sm"
                    style={{ fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "0.15em" }}
                  >
                    for all ages
                  </span>
                </span>
              </h2>
            </div>

            {/* Arrow controls */}
            <div className="flex items-center gap-3 relative z-10">
              <button
                onClick={() => scroll("left")}
                disabled={!canL}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-[#0A0A0A]/20 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canR}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-[#0A0A0A]/20 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel track */}
        <motion.div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth hide-scrollbar cursor-grab active:cursor-grabbing
            pl-4 sm:pl-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-8"
          style={{ scrollbarWidth: "none" }}
          onScroll={sync}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {loading ? (
            <SkeletonCards />
          ) : programs.length === 0 ? (
            <p className="text-white/40 text-sm py-12 pl-2">No programs available.</p>
          ) : (
            programs.map((program) => {
              const href = program.linkUrl || "/programs";
              const isExternal = href.startsWith("http");

              return (
                <a
                  key={program.id}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="relative flex-shrink-0 rounded-2xl overflow-hidden group block"
                  style={{ width: CARD_WIDTH, height: 420 }}
                >
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="320px"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />


                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {program.description && (
                      <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1 font-medium line-clamp-1">
                        {program.description}
                      </p>
                    )}
                    <h3 className="text-white font-bold text-xl leading-tight mb-3">{program.title}</h3>
                    <span className="inline-flex items-center gap-1.5 bg-[#C9A84C] text-[#0A0A0A] text-[11px] font-bold
                      uppercase tracking-[0.15em] px-4 py-2 rounded-full
                      group-hover:bg-white group-hover:text-[#0A0A0A] transition-colors duration-200">
                      {program.linkText || "Learn More"}
                      <ArrowUpRight size={12} strokeWidth={2.5} />
                    </span>
                  </div>
                </a>
              );
            })
          )}
        </motion.div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <a
              href="/programs"
              className="inline-flex items-center gap-2 text-[#0A0A0A] font-bold text-sm uppercase tracking-[0.15em]
                border-b-2 border-[#0A0A0A] pb-0.5 hover:text-[#0A0A0A]/50 hover:border-[#0A0A0A]/50 transition-colors duration-200"
            >
              Explore All Programs →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
