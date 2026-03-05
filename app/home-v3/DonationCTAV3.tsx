"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";

// ── Types ──────────────────────────────────────────────────────────────────────
interface DonationQuote {
  type: "quran" | "hadith";
  arabic?: string;
  translation: string;
  reference: string;
}

const FALLBACK_QUOTES: DonationQuote[] = [
  {
    type: "quran",
    arabic: "وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ",
    translation: "And spend in the way of Allah and do not throw yourselves into destruction\u2026",
    reference: "Al-Quran 2:195",
  },
  {
    type: "hadith",
    translation:
      "Whoever builds a mosque for the sake of Allah \u2014 even if it is as small as a bird\u2019s nest \u2014 Allah will build for him a house in Paradise.",
    reference: "Sahih al-Bukhari & Muslim",
  },
];

// ── Hook ───────────────────────────────────────────────────────────────────────
function useDonationQuotes(): DonationQuote[] {
  const [quotes, setQuotes] = useState<DonationQuote[]>(FALLBACK_QUOTES);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.donationQuotes) {
          const parsed: DonationQuote[] = JSON.parse(data.donationQuotes);
          if (Array.isArray(parsed) && parsed.length > 0) setQuotes(parsed);
        }
      })
      .catch(() => {});
  }, []);

  return quotes;
}

// Mosque silhouette — dome, minarets, arched entrance
function MosqueIllustration() {
  return (
    <svg
      viewBox="0 0 500 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#0A0A0A" strokeOpacity="0.10" strokeWidth="1.3" strokeLinejoin="round">

        {/* Ground line */}
        <line x1="10" y1="318" x2="490" y2="318" />

        {/* ── Left minaret ── */}
        <rect x="62" y="88" width="30" height="142" />
        {/* Minaret cap (pointed dome) */}
        <path d="M 62,88 Q 77,62 92,88 Z" />
        {/* Minaret horizontal bands */}
        <line x1="62" y1="148" x2="92" y2="148" />
        <line x1="62" y1="185" x2="92" y2="185" />
        {/* Minaret finial staff */}
        <line x1="77" y1="45" x2="77" y2="62" />
        {/* Crescent on left minaret */}
        <path d="M 72,43 A 7,7 0 1,1 82,43 A 5,5 0 1,0 72,43 Z" />

        {/* ── Right minaret ── */}
        <rect x="408" y="88" width="30" height="142" />
        {/* Minaret cap */}
        <path d="M 408,88 Q 423,62 438,88 Z" />
        {/* Minaret horizontal bands */}
        <line x1="408" y1="148" x2="438" y2="148" />
        <line x1="408" y1="185" x2="438" y2="185" />
        {/* Minaret finial staff */}
        <line x1="423" y1="45" x2="423" y2="62" />
        {/* Crescent on right minaret */}
        <path d="M 418,43 A 7,7 0 1,1 428,43 A 5,5 0 1,0 418,43 Z" />

        {/* ── Main building base ── */}
        <rect x="92" y="208" width="316" height="110" />
        {/* Decorative horizontal band */}
        <line x1="92" y1="245" x2="408" y2="245" />

        {/* ── Main dome ── */}
        {/* Outer dome arc */}
        <path d="M 105,208 A 145,145 0 0,1 395,208" />
        {/* Inner dome ring */}
        <path d="M 148,208 A 102,102 0 0,1 352,208" strokeOpacity="0.06" />
        {/* Second inner ring */}
        <path d="M 180,208 A 70,70 0 0,1 320,208" strokeOpacity="0.04" />

        {/* Dome finial staff */}
        <line x1="250" y1="45" x2="250" y2="65" />
        {/* Crescent on main dome */}
        <path d="M 244,43 A 9,9 0 1,1 256,43 A 6,6 0 1,0 244,43 Z" />

        {/* ── Central pointed arch doorway ── */}
        <path d="M 218,318 L 218,272 Q 250,242 282,272 L 282,318" />

        {/* ── Arched windows — left side ── */}
        <path d="M 118,300 L 118,268 Q 134,252 150,268 L 150,300" />
        {/* ── Arched windows — right side ── */}
        <path d="M 350,300 L 350,268 Q 366,252 382,268 L 382,300" />

        {/* ── Small arched windows above band ── */}
        <path d="M 130,240 L 130,218 Q 142,207 154,218 L 154,240" />
        <path d="M 346,240 L 346,218 Q 358,207 370,218 L 370,240" />

      </g>
    </svg>
  );
}

export default function DonationCTAV3() {
  const donateUrl = useDonateUrl();
  const quotes = useDonationQuotes();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const current = quotes[activeIndex];

  return (
    <section className="relative bg-[#E8E4DC] overflow-hidden">

      {/* Mosque illustration — large, centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[560px] pointer-events-none select-none">
        <MosqueIllustration />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">

        {/* Rotating quote */}
        <div className="mb-16 min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="text-center w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {current.arabic && (
                <p
                  className="text-[#0A0A0A]/80 text-3xl md:text-4xl leading-loose font-light mb-4"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif", direction: "rtl" }}
                >
                  {current.arabic}
                </p>
              )}
              <p className="text-[#0A0A0A]/60 text-base md:text-lg italic font-light leading-relaxed max-w-2xl mx-auto">
                &ldquo;{current.translation}&rdquo;
              </p>
              <p className="text-[#C9A84C] text-xs font-medium uppercase tracking-[0.3em] mt-3">
                {current.reference}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          {quotes.length > 1 && (
            <div className="flex gap-2 mt-8">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Quote ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-[#C9A84C] w-4" : "bg-[#0A0A0A]/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#0A0A0A]/15 to-transparent mb-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-[#0A0A0A]/35 text-xs uppercase tracking-[0.35em] font-medium mb-4">
            Support Your Masjid
          </p>
          <h2
            className="text-[#0A0A0A] font-black leading-none mb-4"
            style={{ fontSize: "clamp(32px, 5vw, 64px)", letterSpacing: "-0.02em" }}
          >
            Your generosity<br />keeps us running.
          </h2>
          <p className="text-[#0A0A0A]/50 text-base mb-10 max-w-xl mx-auto">
            Every contribution — large or small — sustains Al-Faruq Islamic Centre
            for the entire Edmonton Muslim community.
          </p>

          <div className="flex justify-center">
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A84C] text-white font-bold rounded-full px-10 py-4 text-sm uppercase
                tracking-[0.1em] hover:bg-[#C9A84C]/80 transition-all duration-200 inline-block text-center"
            >
              Donate Now →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
