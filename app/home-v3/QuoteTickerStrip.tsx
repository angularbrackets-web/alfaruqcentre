"use client";

import { useState, useEffect } from "react";


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

/** Scale font size so longer quotes don't overflow the bar height */
function getQuoteFontSize(text: string): number {
  const len = text.length;
  if (len < 100) return 15;
  if (len < 180) return 13;
  if (len < 270) return 12;
  return 11;
}

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
  const fontSize = getQuoteFontSize(current.translation);

  return (
    <div className="hidden md:block bg-white overflow-hidden border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 sm:gap-4 py-2.5 min-h-[44px]">
          
          {/* 
            Grid container renders all quotes invisibly stacked.
            This ensures the container height matches the tallest quote,
            preventing layout jumps across the rest of the page entirely!
          */}
          <div className="flex-1 min-w-0 grid items-start">
            {quotes.map((quote, i) => {
              const isActive = i === index;
              const fontSize = getQuoteFontSize(quote.translation);

              return (
                <div
                  key={i}
                  className="col-start-1 row-start-1 flex items-start gap-3 sm:gap-4 transition-all duration-500 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? "visible" : "hidden",
                    transform: isActive ? "translateY(0)" : "translateY(6px)",
                    pointerEvents: isActive ? "auto" : "none",
                    zIndex: isActive ? 10 : 0,
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Label pill — top-aligned so it doesn't shift when text wraps */}
                  <span className="flex-shrink-0 text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap border border-[#C9A84C]/50 px-2 py-1 rounded-sm mt-0.5">
                    {quote.type === "quran" ? "Quran" : "Hadith"}
                  </span>

                  {/* Rotating quote — full text, no truncation */}
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
                    <p
                      className="text-[#1E5BB4] font-semibold leading-snug flex-1 min-w-0"
                      style={{ fontSize }}
                    >
                      &ldquo;{quote.translation}&rdquo;
                    </p>
                    <span className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap flex-shrink-0 self-end">
                      {quote.reference}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          {quotes.length > 1 && (
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-1.5 z-10">
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
