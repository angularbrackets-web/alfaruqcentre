"use client";

import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";
import { useJummahTimes } from "@/app/hooks/useJummahTimes";
import QuoteTickerStrip from "./QuoteTickerStrip";

interface PrayerSlot {
  name: string;
  adhan: string;
  iqamah: string | null;
}


const SOCIAL = [
  { Icon: Facebook,  href: "https://www.facebook.com/alfaruqcentre",       label: "Facebook"  },
  { Icon: Instagram, href: "https://www.instagram.com/alfaruqcentre/",      label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@alfaruqislamiccentre", label: "YouTube"   },
];

const NAV_LINKS = [
  { href: "/",              label: "Home"           },
  { href: "/prayertimes",   label: "Prayer Times"   },
  { href: "/programs",      label: "Programs"       },
  { href: "/events",        label: "Events"         },
  { href: "/weekendschool", label: "Weekend School" },
  { href: "/volunteer",     label: "Volunteer"      },
  { href: "/nowhiring",     label: "Now Hiring", isHighlighted: true },
] as const;

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function toHijri(date: Date): { day: number; month: number; year: number } {
  const JD = Math.floor(date.getTime() / 86400000 + 2440587.5);
  let l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l -= 10631 * n - 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l -=
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) +
    Math.floor(j / 16) * Math.floor((15238 * j) / 43);
  const year = 30 * n + j - 30;
  const month = Math.ceil(l / 29.5);
  const day = l - Math.floor(29.5 * (month - 1));
  return { day, month, year };
}

function formatGregorian(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatHijri(date: Date): string {
  const { day, month, year } = toHijri(date);
  return `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH`;
}

function parseTime(timeStr: string): Date {
  const [timePart, meridiem] = timeStr.trim().split(" ");
  const [hoursStr, minutesStr] = timePart.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function computeNextPrayer(slots: PrayerSlot[]): { name: string; secsLeft: number } {
  const MAIN = slots.filter(
    (pt) => pt.iqamah && pt.name !== "Sunrise" && !pt.name.startsWith("Jummah")
  );
  if (MAIN.length === 0) return { name: "", secsLeft: 0 };
  const now = new Date();
  for (const p of MAIN) {
    const t = parseTime(p.iqamah!);
    if (now < t) {
      return { name: p.name, secsLeft: Math.floor((t.getTime() - now.getTime()) / 1000) };
    }
  }
  const fajrToday = parseTime(MAIN[0].iqamah!);
  const fajrTomorrow = new Date(fajrToday);
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  return { name: MAIN[0].name, secsLeft: Math.floor((fajrTomorrow.getTime() - now.getTime()) / 1000) };
}

// ─── Animated iqamah (strikethrough old → slide in new) ───────────────────────
// Self-contained: tracks previous value internally so it animates automatically
// whenever the iqamah string changes (today→tomorrow switch, or any API update).

type IqamahPhase = "idle" | "striking" | "entering";

const AnimatedIqamah = memo(function AnimatedIqamah({
  current,
  className,
}: {
  current: string | null;
  className: string;
}) {
  const prevRef = React.useRef<string | null>(null);
  const [phase, setPhase] = useState<IqamahPhase>("idle");
  const [prevValue, setPrevValue] = useState<string | null>(null);

  // useLayoutEffect so the phase change fires before the browser paints,
  // preventing a single-frame flash of the new value before animation starts.
  React.useLayoutEffect(() => {
    if (!current) { prevRef.current = null; return; }
    if (prevRef.current !== null && prevRef.current !== current) {
      const old = prevRef.current;
      prevRef.current = current;
      setPrevValue(old);
      setPhase("striking");
      const t1 = setTimeout(() => setPhase("entering"), 800);
      const t2 = setTimeout(() => setPhase("idle"), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevRef.current = current;
  }, [current]);

  if (!current) return <p className="text-[#0A0A0A]/20 text-[14px] leading-tight">—</p>;

  if (phase === "striking") {
    return (
      <div className="relative overflow-hidden" style={{ height: "1.4em" }}>
        <motion.span
          className={`${className} relative inline-flex items-center justify-center w-full`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.48, duration: 0.28 }}
        >
          {prevValue ?? current}
          <motion.span
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
        </motion.span>
      </div>
    );
  }

  if (phase === "entering") {
    return (
      <div className="relative overflow-hidden" style={{ height: "1.4em" }}>
        <motion.p
          className={`${className} absolute inset-x-0 text-center m-0`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {current}
        </motion.p>
      </div>
    );
  }

  return <p className={className}>{current}</p>;
});

// ─── Utility Bar ────────────────────────────────────────────────────────────────

const UtilityBar = memo(function UtilityBar({
  prayerSlots,
  tomorrowSummary,
  nextPrayerName,
  showingTomorrow,
}: {
  prayerSlots: PrayerSlot[];
  tomorrowSummary: string;
  nextPrayerName: string;
  showingTomorrow: boolean;
}) {
  const MAIN_PRAYERS = prayerSlots.filter(
    (pt) => pt.name !== "Sunrise" && !pt.name.startsWith("Jummah")
  );
  const SECONDARY = prayerSlots.filter(
    (pt) => pt.name === "Sunrise" || pt.name.startsWith("Jummah")
  );

  return (
    <div className="bg-[#E8E4DC] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Mobile layout ── */}
        <div className="lg:hidden">
          {showingTomorrow && (
            <div className="flex items-center gap-1.5 pt-1.5 pb-0.5">
              <span className="text-[#C9A84C] text-[8px] font-black uppercase tracking-[0.2em] border border-[#C9A84C]/50 px-1.5 py-0.5 rounded-sm">
                Tomorrow
              </span>
            </div>
          )}
          <div className="py-2.5 overflow-x-auto hide-scrollbar -mx-1 px-1">
            <div className="flex divide-x divide-[#0A0A0A]/10 min-w-max">
              {MAIN_PRAYERS.map((pt) => {
                const isNext = !showingTomorrow
                  ? pt.name === nextPrayerName
                  : pt.name === "Fajr";
                return (
                  <div
                    key={pt.name}
                    className={`px-3 first:pl-0 text-center relative ${isNext ? "bg-[#0A0A0A] rounded-md py-0.5" : ""}`}
                  >
                    {isNext && (
                      <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                    )}
                    <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5 whitespace-nowrap">
                      {pt.name}
                    </p>
                    <p className={`text-[12px] font-normal leading-tight whitespace-nowrap ${isNext ? "text-white/50" : "text-[#0A0A0A]/50"}`}>
                      {pt.adhan}
                    </p>
                    <AnimatedIqamah
                      current={pt.iqamah}
                      className={`text-[12px] font-bold leading-tight whitespace-nowrap ${isNext ? "text-white" : "text-[#0A0A0A]"}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {!showingTomorrow && (
            <div className="bg-[#0A0A0A]/[0.05] -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5">
              <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
                <div className="flex divide-x divide-[#0A0A0A]/10 min-w-max">
                  {SECONDARY.map((pt) => (
                    <div key={pt.name} className="px-3 first:pl-0 text-center">
                      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5 whitespace-nowrap">
                        {pt.name}
                      </p>
                      <p className="text-[#0A0A0A]/50 text-[12px] font-normal leading-tight whitespace-nowrap">
                        {pt.adhan}
                      </p>
                      {pt.iqamah && (
                        <p className="text-[#0A0A0A] text-[12px] font-bold leading-tight whitespace-nowrap">
                          {pt.iqamah}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {tomorrowSummary && (
                <div className="mt-2 pt-2 border-t border-[#0A0A0A]/10 flex items-center gap-2 flex-wrap">
                  <span className="text-[#C9A84C] text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap flex-shrink-0 border border-[#C9A84C]/40 px-1.5 py-0.5 rounded-sm">
                    Tomorrow
                  </span>
                  <span className="text-[#0A0A0A] text-[11px] font-semibold whitespace-nowrap">
                    {tomorrowSummary}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop: prayer columns + contact + social ── */}
        <div className="hidden lg:flex items-center justify-between gap-2 py-2">
          <div className="flex items-stretch">
            {/* Regular prayers */}
            <div className="flex items-stretch divide-x divide-[#0A0A0A]/10">
              {prayerSlots.filter((pt) => !pt.name.startsWith("Jummah")).map((pt) => {
                const isNext = !showingTomorrow
                  ? pt.name === nextPrayerName
                  : pt.name === "Fajr";
                return (
                  <div
                    key={pt.name}
                    className={`px-3.5 first:pl-0 text-center relative ${isNext ? "bg-[#0A0A0A] rounded-md py-0.5" : ""}`}
                  >
                    {isNext && (
                      <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                    )}
                    <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em] mb-1 whitespace-nowrap">
                      {pt.name}
                    </p>
                    <p className={`text-[14px] font-normal leading-tight whitespace-nowrap ${isNext ? "text-white/50" : "text-[#0A0A0A]/50"}`}>
                      {pt.adhan}
                    </p>
                    <AnimatedIqamah
                      current={pt.iqamah}
                      className={`text-[14px] font-bold leading-tight whitespace-nowrap ${isNext ? "text-white" : "text-[#0A0A0A]"}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Jummah separator + columns — only shown when displaying today's times */}
            {!showingTomorrow && prayerSlots.some((pt) => pt.name.startsWith("Jummah")) && (
              <div className="flex items-stretch ml-1 pl-1 border-l-2 border-[#C9A84C]/40">
                <div className="flex items-stretch divide-x divide-[#C9A84C]/20 bg-[#C9A84C]/[0.06] rounded-md overflow-hidden">
                  {prayerSlots.filter((pt) => pt.name.startsWith("Jummah")).map((pt) => (
                    <div key={pt.name} className="px-3.5 text-center py-0.5">
                      <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em] mb-1 whitespace-nowrap">
                        {pt.name}
                      </p>
                      <p className="text-[#C9A84C] text-[14px] font-bold leading-tight whitespace-nowrap">
                        {pt.adhan}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* "Tomorrow" badge — shown when displaying tomorrow's prayer times */}
            {showingTomorrow && (
              <div className="flex items-center ml-3">
                <span className="text-[#C9A84C] text-[9px] font-black uppercase tracking-[0.2em] border border-[#C9A84C]/60 px-2 py-1 rounded-sm">
                  Tomorrow
                </span>
              </div>
            )}
          </div>

          {/* Right: contact + social */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-4">
              <a
                href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#0A0A0A]/50 text-[11px] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
              >
                <MapPin size={11} className="text-[#C9A84C] flex-shrink-0" />
                4410 127 St SW, Edmonton
              </a>
              <span className="text-[#0A0A0A]/20 select-none">|</span>
              <a
                href="tel:+17802438811"
                className="flex items-center gap-1.5 text-[#0A0A0A]/50 text-[11px] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
              >
                <Phone size={11} className="text-[#C9A84C] flex-shrink-0" />
                (780) 243-8811
              </a>
            </div>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors duration-200"
                >
                  <Icon size={13} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

// ─── Flip Clock ────────────────────────────────────────────────────────────────

const FlipDigit = memo(function FlipDigit({ digit }: { digit: string }) {
  return (
    <div
      className="relative inline-flex items-center justify-center overflow-hidden rounded-[2px]"
      style={{
        width: "0.72em",
        height: "1.3em",
        backgroundColor: "#6B7280",
        perspective: "300px",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={digit}
          className="absolute inset-0 flex items-center justify-center font-[inherit] text-white"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
      {/* Center seam — mimics split-flap card joint */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.12] z-10 pointer-events-none" />
    </div>
  );
});

function FlipClock({ timeStr, className }: { timeStr: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[1px] ${className ?? ""}`}>
      {timeStr.split("").map((char, i) =>
        char === ":" ? (
          <span key={i} className="mx-[2px] font-bold opacity-40 select-none" style={{ lineHeight: 1 }}>
            :
          </span>
        ) : (
          <FlipDigit key={i} digit={char} />
        )
      )}
    </span>
  );
}

// ─── Tomorrow Change Ticker (cycles one change at a time, 5 s each) ─────────────

type ChangeItem = { label: string; todayTime: string; tomorrowTime: string };

function TomorrowChangeTicker({ changes }: { changes: ChangeItem[] }) {
  const items = changes.filter((c) => c.todayTime !== c.tomorrowTime);
  const [idx, setIdx] = useState(0);
  const [strikeDrawn, setStrikeDrawn] = useState(false);

  // Advance every 5 s when there are multiple changes
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIdx((prev) => (prev + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  // Re-play strike animation fresh on each new item
  useEffect(() => {
    setStrikeDrawn(false);
    const t = setTimeout(() => setStrikeDrawn(true), 600);
    return () => clearTimeout(t);
  }, [idx]);

  if (items.length === 0) return null;
  const current = items[idx % items.length];

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-[#C9A84C] text-[9px] font-black uppercase tracking-[0.2em] border border-[#C9A84C]/50 px-2 py-0.5 rounded-sm">
        Tomorrow
      </span>

      {/* Single row — cycles through items with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Prayer label */}
          <span className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.12em] flex-shrink-0">
            {current.label}
          </span>
          {/* Today — dimmed, struck */}
          <div className="relative inline-block">
            <span className="text-[11px] font-semibold whitespace-nowrap text-[#0A0A0A]/35">
              {current.todayTime}
            </span>
            <motion.span
              className="absolute inset-x-0 top-[50%] h-px bg-[#0A0A0A]/35"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: strikeDrawn ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
          {/* Arrow */}
          <motion.span
            className="text-[#0A0A0A]/25 text-[8px] select-none"
            animate={{ opacity: strikeDrawn ? 1 : 0 }}
            transition={{ duration: 0.15, delay: strikeDrawn ? 0.22 : 0 }}
          >
            →
          </motion.span>
          {/* Tomorrow — bold */}
          <motion.span
            className="text-[12px] font-bold whitespace-nowrap text-[#0A0A0A]"
            animate={{ opacity: strikeDrawn ? 1 : 0 }}
            transition={{ duration: 0.22, delay: strikeDrawn ? 0.4 : 0 }}
          >
            {current.tomorrowTime}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots — only when >1 change */}
      {items.length > 1 && (
        <div className="flex gap-1">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                i === idx % items.length ? "bg-[#C9A84C]" : "bg-[#0A0A0A]/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Countdown Bar ─────────────────────────────────────────────────────────────

const CountdownBar = memo(function CountdownBar({
  nextName,
  secsLeft,
  todayFajr,
  todayMaghrib,
  tomorrowFajr,
  tomorrowMaghrib,
}: {
  nextName: string;
  secsLeft: number;
  todayFajr?: string;
  todayMaghrib?: string;
  tomorrowFajr?: string;
  tomorrowMaghrib?: string;
}) {
  const [dateInfo, setDateInfo] = useState<{ gregorian: string; hijri: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    setDateInfo({ gregorian: formatGregorian(now), hijri: formatHijri(now) });
  }, []);

  const hours = Math.floor(secsLeft / 3600);
  const mins = Math.floor((secsLeft % 3600) / 60);
  const secs = secsLeft % 60;
  // Always HH:MM:SS so digit positions stay stable as time changes
  const timeStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const hasTomorrow = !!(tomorrowFajr || tomorrowMaghrib);

  return (
    <div className="bg-white border-t border-b border-black/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="flex items-center justify-between gap-4">

          {/* Left — next prayer countdown */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <motion.span
              className="hidden sm:inline text-[#0A0A0A]/65 text-[13px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              Next Prayer
            </motion.span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={nextName}
                className="text-[#C9A84C] text-[15px] lg:text-[17px] font-bold whitespace-nowrap"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.25 }}
              >
                {nextName || "—"}
              </motion.span>
            </AnimatePresence>
            {secsLeft > 0 && (
              <>
                <span className="text-black/20 select-none leading-none">·</span>
                <FlipClock
                  timeStr={timeStr}
                  className="text-[#0A0A0A] text-[15px] lg:text-[17px] font-bold"
                />
              </>
            )}
          </div>

          {/* Center — date */}
          {dateInfo && (
            <div className="hidden md:flex flex-col items-center flex-1 min-w-0">
              <p className="text-[#0A0A0A] text-[13px] font-semibold whitespace-nowrap">
                {dateInfo.gregorian}
              </p>
              <p className="text-[#C9A84C] text-[11px] font-medium whitespace-nowrap">
                {dateInfo.hijri}
              </p>
            </div>
          )}

          {/* Right — tomorrow changes ticker */}
          {hasTomorrow && (
            <div className="hidden md:block flex-shrink-0">
              <TomorrowChangeTicker
                changes={[
                  { label: "Fajr",    todayTime: todayFajr    ?? "", tomorrowTime: tomorrowFajr    ?? "" },
                  { label: "Maghrib", todayTime: todayMaghrib ?? "", tomorrowTime: tomorrowMaghrib ?? "" },
                ].filter((c) => c.todayTime && c.tomorrowTime)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
});

// ─── Desktop nav link ──────────────────────────────────────────────────────────

const DesktopNavLink = memo(function DesktopNavLink({
  href,
  label,
  isHighlighted,
}: {
  href: string;
  label: string;
  isHighlighted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative text-[12px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 group py-1 ${
        isHighlighted ? "text-[#C9A84C]" : "text-[#0A0A0A] hover:text-[#0A0A0A]/50"
      }`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 w-full h-[2px] ${
          isHighlighted ? "bg-[#C9A84C]" : "bg-[#0A0A0A]"
        } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
      />
    </Link>
  );
});

// ─── Mobile nav link ──────────────────────────────────────────────────────────

const MobileNavLink = memo(function MobileNavLink({
  href,
  label,
  isHighlighted,
  onClick,
}: {
  href: string;
  label: string;
  isHighlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-xl font-bold uppercase tracking-[0.06em] py-4 border-b border-white/10 block transition-colors ${
        isHighlighted ? "text-[#C9A84C]" : "text-white hover:text-white/70"
      }`}
    >
      {label}
    </Link>
  );
});

// ─── NavbarV3 ─────────────────────────────────────────────────────────────────

export default function NavbarV3() {
  const donateUrl = useDonateUrl();
  const jummahTimes = useJummahTimes();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dailySlots, setDailySlots] = useState<PrayerSlot[]>([]);
  const [tomorrowSlots, setTomorrowSlots] = useState<PrayerSlot[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; secsLeft: number }>({ name: "", secsLeft: 0 });
  const [tomorrowSummary, setTomorrowSummary] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);
  const lastFetchDateRef = React.useRef<string>("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.showNextPrayerBar === "false") setShowCountdown(false);
      })
      .catch(() => {});
  }, []);

  // Combine daily prayer slots with Jummah (each Jummah has a single time, like Sunrise)
  const prayerSlots = useMemo<PrayerSlot[]>(() => [
    ...dailySlots,
    ...jummahTimes.map((j) => ({ name: j.name, adhan: j.time, iqamah: null })),
  ], [dailySlots, jummahTimes]);

  // True once all of today's iqamah times have passed — updated in real time via the 1s ticker
  const [isAfterIshaToday, setIsAfterIshaToday] = useState(false);

  // Which slots to show in the utility bar — tomorrow's if we're past today's Isha
  const utilitySlots = useMemo<PrayerSlot[]>(() =>
    isAfterIshaToday && tomorrowSlots.length > 0
      ? tomorrowSlots
      : prayerSlots,
    [isAfterIshaToday, tomorrowSlots, prayerSlots]
  );

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Fetch today's + tomorrow's prayer times from the API
  const fetchPrayerTimes = useCallback(() => {
    fetch("/api/prayerTimes")
      .then((r) => r.json())
      .then(
        (data: Array<{
          date: string; month: string; year: string;
          fajr: { azzan: string; iqamah: string; sunrise?: string };
          zuhr: { azzan: string; iqamah: string };
          asr:  { azzan: string; iqamah: string };
          maghrib: { azzan: string; iqamah: string };
          isha: { azzan: string; iqamah: string };
        }>) => {
          const now = new Date();
          lastFetchDateRef.current = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

          const today = data.find(
            (t) =>
              t.date  === String(now.getDate()) &&
              t.month === String(now.getMonth() + 1) &&
              t.year  === String(now.getFullYear())
          );
          if (today) {
            setDailySlots([
              { name: "Fajr",    adhan: today.fajr.azzan,    iqamah: today.fajr.iqamah    },
              { name: "Sunrise", adhan: today.fajr.sunrise ?? "—", iqamah: null            },
              { name: "Dhuhr",   adhan: today.zuhr.azzan,    iqamah: today.zuhr.iqamah    },
              { name: "Asr",     adhan: today.asr.azzan,     iqamah: today.asr.iqamah     },
              { name: "Maghrib", adhan: today.maghrib.azzan, iqamah: today.maghrib.iqamah },
              { name: "Isha",    adhan: today.isha.azzan,    iqamah: today.isha.iqamah    },
            ]);
          }

          const tomorrowDate = new Date(now);
          tomorrowDate.setDate(tomorrowDate.getDate() + 1);
          const tom = data.find(
            (t) =>
              t.date  === String(tomorrowDate.getDate()) &&
              t.month === String(tomorrowDate.getMonth() + 1) &&
              t.year  === String(tomorrowDate.getFullYear())
          );
          if (tom) {
            setTomorrowSummary(`Fajr ${tom.fajr.azzan} · Maghrib ${tom.maghrib.azzan}`);
            setTomorrowSlots([
              { name: "Fajr",    adhan: tom.fajr.azzan,    iqamah: tom.fajr.iqamah    },
              { name: "Sunrise", adhan: tom.fajr.sunrise ?? "—", iqamah: null          },
              { name: "Dhuhr",   adhan: tom.zuhr.azzan,    iqamah: tom.zuhr.iqamah    },
              { name: "Asr",     adhan: tom.asr.azzan,     iqamah: tom.asr.iqamah     },
              { name: "Maghrib", adhan: tom.maghrib.azzan, iqamah: tom.maghrib.iqamah },
              { name: "Isha",    adhan: tom.isha.azzan,    iqamah: tom.isha.iqamah    },
            ]);
          }
        }
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Auto-refresh at midnight: check every minute if the date has changed
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      if (lastFetchDateRef.current && lastFetchDateRef.current !== todayKey) {
        fetchPrayerTimes();
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [fetchPrayerTimes]);

  // Countdown ticker — re-runs whenever prayerSlots / dailySlots change
  useEffect(() => {
    if (prayerSlots.length === 0) return;
    const tick = () => {
      setNextPrayer(computeNextPrayer(prayerSlots));
      // Recompute isAfterIshaToday in real time (useMemo alone won't re-run on time changes)
      const MAIN = dailySlots.filter((s) => s.iqamah && s.name !== "Sunrise");
      const now = new Date();
      setIsAfterIshaToday(MAIN.length > 0 && MAIN.every((s) => now >= parseTime(s.iqamah!)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerSlots, dailySlots]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* 1. Utility bar — prayer times */}
        <UtilityBar
          prayerSlots={utilitySlots}
          tomorrowSummary={tomorrowSummary}
          nextPrayerName={nextPrayer.name}
          showingTomorrow={isAfterIshaToday && tomorrowSlots.length > 0}
        />

        {/* 2. Countdown bar (admin-toggleable) */}
        {showCountdown && (
          <CountdownBar
            nextName={nextPrayer.name}
            secsLeft={nextPrayer.secsLeft}
            todayFajr={dailySlots.find((s) => s.name === "Fajr")?.iqamah ?? undefined}
            todayMaghrib={dailySlots.find((s) => s.name === "Maghrib")?.iqamah ?? undefined}
            tomorrowFajr={tomorrowSlots.find((s) => s.name === "Fajr")?.iqamah ?? undefined}
            tomorrowMaghrib={tomorrowSlots.find((s) => s.name === "Maghrib")?.iqamah ?? undefined}
          />
        )}

        {/* 3. Main navbar */}
        <div className="bg-white border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-2 gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/AlFaruqLogo.png"
                width={130}
                height={48}
                alt="Al-Faruq Islamic Centre"
                className="object-contain h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1">
              {NAV_LINKS.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isHighlighted={"isHighlighted" in link ? link.isHighlighted : false}
                />
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-3">
              <a
                href={donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-block bg-[#0A0A0A] text-white font-bold rounded-full
                  px-5 py-2 text-[12px] uppercase tracking-[0.08em]
                  hover:bg-[#0A0A0A]/75 transition-all duration-200 flex-shrink-0"
              >
                Donate
              </a>
              <button
                className="lg:hidden focus:outline-none p-1"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={24} strokeWidth={2} className="text-[#0A0A0A]" />
              </button>
            </div>

          </div>
        </div>

        {/* 4. Quote ticker strip — below main navbar */}
        <QuoteTickerStrip />

      </header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/70 z-[100] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="drawer"
            className="fixed top-0 right-0 h-full w-80 bg-[#0A0A0A] z-[110] flex flex-col shadow-2xl overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link href="/" onClick={closeMobile}>
                <Image
                  src="/AlFaruqLogo.png"
                  width={110}
                  height={40}
                  alt="Al-Faruq Islamic Centre"
                  className="object-contain h-10 w-auto"
                  style={{ width: "auto" }}
                />
              </Link>
              <button onClick={closeMobile} aria-label="Close menu" className="focus:outline-none">
                <X size={24} className="text-white/70 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Mosque illustration — decorative background */}
            <div className="absolute inset-0 flex items-start justify-center pointer-events-none overflow-hidden">
              <svg
                viewBox="0 0 320 340"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full opacity-[0.07]"
              >
                {/* Left minaret */}
                <rect x="28" y="100" width="22" height="240" stroke="white" strokeWidth="1.5" />
                <rect x="22" y="94" width="34" height="12" stroke="white" strokeWidth="1.5" />
                <rect x="26" y="82" width="26" height="16" stroke="white" strokeWidth="1.5" />
                <rect x="30" y="68" width="18" height="18" stroke="white" strokeWidth="1.5" />
                {/* Left minaret dome */}
                <path d="M30 68 Q39 50 48 68" stroke="white" strokeWidth="1.5" />
                {/* Left minaret crescent */}
                <path d="M36 54 Q39 48 43 54 Q40 51 36 54Z" stroke="white" strokeWidth="1" />
                {/* Left minaret windows */}
                <path d="M33 120 Q39 113 45 120 L45 138 L33 138 Z" stroke="white" strokeWidth="1" />
                <path d="M33 155 Q39 148 45 155 L45 173 L33 173 Z" stroke="white" strokeWidth="1" />
                <path d="M33 190 Q39 183 45 190 L45 208 L33 208 Z" stroke="white" strokeWidth="1" />

                {/* Right minaret */}
                <rect x="270" y="100" width="22" height="240" stroke="white" strokeWidth="1.5" />
                <rect x="264" y="94" width="34" height="12" stroke="white" strokeWidth="1.5" />
                <rect x="268" y="82" width="26" height="16" stroke="white" strokeWidth="1.5" />
                <rect x="272" y="68" width="18" height="18" stroke="white" strokeWidth="1.5" />
                {/* Right minaret dome */}
                <path d="M272 68 Q281 50 290 68" stroke="white" strokeWidth="1.5" />
                {/* Right minaret crescent */}
                <path d="M277 54 Q281 48 285 54 Q282 51 277 54Z" stroke="white" strokeWidth="1" />
                {/* Right minaret windows */}
                <path d="M275 120 Q281 113 287 120 L287 138 L275 138 Z" stroke="white" strokeWidth="1" />
                <path d="M275 155 Q281 148 287 155 L287 173 L275 173 Z" stroke="white" strokeWidth="1" />
                <path d="M275 190 Q281 183 287 190 L287 208 L275 208 Z" stroke="white" strokeWidth="1" />

                {/* Main building base */}
                <rect x="60" y="190" width="200" height="150" stroke="white" strokeWidth="1.5" />

                {/* Shoulder domes (small) */}
                <path d="M60 190 Q85 155 110 190" stroke="white" strokeWidth="1.5" />
                <path d="M210 190 Q235 155 260 190" stroke="white" strokeWidth="1.5" />

                {/* Main central dome */}
                <path d="M95 190 Q160 90 225 190" stroke="white" strokeWidth="2" />

                {/* Dome finial + crescent */}
                <line x1="160" y1="90" x2="160" y2="70" stroke="white" strokeWidth="1.5" />
                <path d="M153 70 Q160 58 168 70 Q163 65 153 70Z" stroke="white" strokeWidth="1.2" />

                {/* Main entrance arch */}
                <path d="M135 340 L135 255 Q160 228 185 255 L185 340" stroke="white" strokeWidth="1.5" />

                {/* Side arched windows */}
                <path d="M75 280 Q90 262 105 280 L105 310 L75 310 Z" stroke="white" strokeWidth="1" />
                <path d="M215 280 Q230 262 245 280 L245 310 L215 310 Z" stroke="white" strokeWidth="1" />

                {/* Upper arched windows */}
                <path d="M80 220 Q92 207 104 220 L104 242 L80 242 Z" stroke="white" strokeWidth="1" />
                <path d="M216 220 Q228 207 240 220 L240 242 L216 242 Z" stroke="white" strokeWidth="1" />

                {/* Decorative band below dome */}
                <line x1="95" y1="190" x2="225" y2="190" stroke="white" strokeWidth="1" strokeDasharray="4 4" />

                {/* Ground line */}
                <line x1="0" y1="340" x2="320" y2="340" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            <div className="relative flex flex-col px-6 pt-4 pb-6 overflow-y-auto flex-1">
              {NAV_LINKS.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isHighlighted={"isHighlighted" in link ? link.isHighlighted : false}
                  onClick={closeMobile}
                />
              ))}
              <div className="pt-6">
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="w-full text-center bg-[#C9A84C] text-[#0A0A0A] font-bold rounded-full py-4 text-base uppercase tracking-[0.08em] block"
                >
                  Donate
                </a>
              </div>
            </div>


            <div className="px-6 py-4 border-t border-white/10">
              <a
                href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors"
              >
                <MapPin size={14} className="text-[#C9A84C]" />
                4410 127 St SW, Edmonton
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
