"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Event } from "@/app/types/event";

const CARD_WIDTH = 320;
const CARD_GAP = 20;

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const sStr = s.toLocaleDateString("en-US", opts);
  const eStr = e.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  if (s.toDateString() === e.toDateString()) return eStr;
  return `${sStr} – ${eStr}`;
}

export default function EventsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const now = new Date();
          // Filter out expired events
          const active = (data.data as Event[]).filter(
            (e) => new Date(e.expiryDate) > now
          );
          setEvents(active);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Don't render if no non-expired active events
  if (!loading && events.length === 0) return null;

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
    <section className="bg-white py-16 md:py-24 overflow-hidden">

      {/* ── Content ── */}
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
              Upcoming
            </p>
            <h2
              className="text-[#0A0A0A] font-black leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Events
            </h2>
          </div>

          {events.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("left")}
                disabled={!canL}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-gray-200 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canR}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-gray-200 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          )}
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
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 animate-pulse"
                style={{ width: CARD_WIDTH, height: 420 }} />
            ))}
          </>
        ) : (
          events.map((event) => {
            const href = event.registrationLink || "/events";
            const isExternal = href.startsWith("http");

            return (
              <a
                key={event.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden group block bg-[#1a1a1a]"
                style={{ width: CARD_WIDTH, height: 420 }}
              >
                {event.poster ? (
                  <Image
                    src={event.poster}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="320px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />

                {/* Date badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                  <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end max-w-[140px]">
                    {event.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-white/10 backdrop-blur-sm text-white/80 text-[9px] font-medium
                        uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {event.description && (
                    <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1 font-medium line-clamp-1">
                      {event.description}
                    </p>
                  )}
                  <h3 className="text-white font-bold text-xl leading-tight mb-3">{event.title}</h3>
                  <span className="inline-flex items-center gap-1.5 bg-[#C9A84C] text-[#0A0A0A] text-[11px] font-bold
                    uppercase tracking-[0.15em] px-4 py-2 rounded-full
                    group-hover:bg-white group-hover:text-[#0A0A0A] transition-colors duration-200">
                    {event.registrationLink ? "Register Now" : "Learn More"}
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
            href="/events"
            className="inline-flex items-center gap-2 text-[#0A0A0A] font-bold text-sm uppercase tracking-[0.15em]
              border-b-2 border-[#C9A84C] pb-0.5 hover:text-[#C9A84C] transition-colors duration-200"
          >
            View All Events →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
