"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DonationQuote {
  type: "quran" | "hadith";
  arabic?: string;
  translation: string;
  reference: string;
}

const FALLBACK_QUOTES: DonationQuote[] = [
  {
    type: "quran",
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

export default function QuoteTickerStrip() {
  const [quotes, setQuotes] = useState<DonationQuote[]>(FALLBACK_QUOTES);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 7000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const current = quotes[index];

  return (
    <div className="hidden md:block bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4 py-2 min-h-[44px]">

          {/* Label pill */}
          <span className="flex-shrink-0 text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap border border-[#C9A84C]/50 px-2 py-1 rounded-sm">
            {current.type === "quran" ? "Quran" : "Hadith"}
          </span>

          {/* Rotating quote */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="flex items-baseline gap-2 sm:gap-3 flex-wrap sm:flex-nowrap"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-[#0F2347] text-[15px] sm:text-[16px] font-semibold leading-snug flex-1 min-w-0">
                  &ldquo;{current.translation}&rdquo;
                </p>
                <span className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap flex-shrink-0">
                  {current.reference}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          {quotes.length > 1 && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Quote ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "bg-[#C9A84C] w-3 h-1"
                      : "bg-[#0A0A0A]/20 w-1 h-1 hover:bg-[#0A0A0A]/40"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
