"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useJummahTimes } from "@/app/hooks/useJummahTimes";

interface PrayerTime {
  azzan: string;
  iqamah: string;
}

interface DayPrayerTimes {
  date: string;
  day: string;
  dst: boolean;
  month: string;
  year: string;
  fajr: PrayerTime;
  zuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

export interface PrayerTimesV3Props {
  prayerTimes: DayPrayerTimes | null;
  tomorrowPrayerTimes?: DayPrayerTimes | null;
}

function parseTimeToday(timeStr: string): Date {
  const parts = timeStr.trim().split(" ");
  const meridiem = parts[1];
  const [hoursStr, minutesStr] = parts[0].split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

const PRAYERS = [
  { key: "fajr"    as const, label: "Fajr"    },
  { key: "zuhr"    as const, label: "Dhuhr"   },
  { key: "asr"     as const, label: "Asr"     },
  { key: "maghrib" as const, label: "Maghrib" },
  { key: "isha"    as const, label: "Isha"    },
];

function getCurrentIndex(p: DayPrayerTimes): number {
  const now = new Date();
  for (let i = 0; i < PRAYERS.length; i++) {
    if (now < parseTimeToday(p[PRAYERS[i].key].iqamah)) return i;
  }
  return -1;
}

function getNextInfo(p: DayPrayerTimes): { name: string; time: string; minutes: number } {
  const now = new Date();
  for (const { key, label } of PRAYERS) {
    const t = parseTimeToday(p[key].iqamah);
    if (now < t) {
      return { name: label, time: p[key].iqamah, minutes: Math.floor((t.getTime() - now.getTime()) / 60000) };
    }
  }
  return { name: "Fajr", time: p.fajr.iqamah, minutes: 0 };
}

function CrescentIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      <path d="M 375,120 A 180,180 0 1,0 375,380 A 155,155 0 0,1 375,120 Z" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
      <path d="M 390,105 A 200,200 0 1,0 390,395 A 172,172 0 0,1 390,105 Z" stroke="white" strokeOpacity="0.04" strokeWidth="1" fill="none" />
      <circle cx="148" cy="95"  r="2.5" fill="white" fillOpacity="0.18" />
      <circle cx="200" cy="72"  r="1.5" fill="white" fillOpacity="0.12" />
      <circle cx="112" cy="165" r="1.5" fill="white" fillOpacity="0.14" />
      <circle cx="175" cy="148" r="2"   fill="white" fillOpacity="0.10" />
      <circle cx="95"  cy="118" r="1"   fill="white" fillOpacity="0.12" />
      <circle cx="238" cy="58"  r="2"   fill="white" fillOpacity="0.14" />
      <circle cx="78"  cy="215" r="1.5" fill="white" fillOpacity="0.08" />
      <circle cx="158" cy="228" r="1"   fill="white" fillOpacity="0.10" />
      <circle cx="60"  cy="155" r="2"   fill="white" fillOpacity="0.07" />
      <circle cx="130" cy="55"  r="1"   fill="white" fillOpacity="0.09" />
    </svg>
  );
}

// ─── Iqamah display: inline today (struck) → tomorrow (gold) ──────────────────

function IqamahDisplay({
  todayIqamah,
  tomorrowIqamah,
  isActive,
  colIndex,
}: {
  todayIqamah: string;
  tomorrowIqamah?: string;
  isActive: boolean;
  colIndex: number;
}) {
  const changed = !!tomorrowIqamah && tomorrowIqamah !== todayIqamah;
  const [strikeDrawn, setStrikeDrawn] = useState(false);
  const prevTomorrowRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const wasChanged = !!prevTomorrowRef.current && prevTomorrowRef.current !== todayIqamah;
    prevTomorrowRef.current = tomorrowIqamah;
    if (!changed) { setStrikeDrawn(false); return; }
    if (wasChanged) return;
    const t = setTimeout(() => setStrikeDrawn(true), 400 + colIndex * 160);
    return () => clearTimeout(t);
  }, [changed, colIndex, tomorrowIqamah, todayIqamah]);

  // Slightly smaller when showing two values side-by-side
  const normalSize: React.CSSProperties = { fontSize: "clamp(13px, 1.6vw, 22px)", letterSpacing: "-0.02em" };
  const compactSize: React.CSSProperties = { fontSize: "clamp(10px, 1.05vw, 15px)", letterSpacing: "-0.01em" };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[8px] uppercase tracking-[0.2em] font-medium ${isActive ? "text-white/25" : "text-white/15"}`}>
        Iqāmah
      </span>

      {changed ? (
        /* Inline: ~~today~~ → tomorrow — no extra height */
        <div className="flex items-center justify-center gap-[3px] flex-wrap">
          {/* Today — dimmed, strikethrough */}
          <div className="relative inline-block leading-none" style={compactSize}>
            <span className={`font-black ${isActive ? "text-white/25" : "text-white/20"}`}>
              {todayIqamah}
            </span>
            <motion.span
              className={`absolute inset-x-0 top-[50%] ${isActive ? "bg-white/25" : "bg-white/20"}`}
              style={{ height: "1.5px", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: strikeDrawn ? 1 : 0 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />
          </div>
          {/* Arrow */}
          <motion.span
            className="text-white/20 select-none leading-none"
            style={{ fontSize: "8px" }}
            animate={{ opacity: strikeDrawn ? 1 : 0 }}
            transition={{ duration: 0.15, delay: strikeDrawn ? 0.25 : 0 }}
          >
            →
          </motion.span>
          {/* Tomorrow — gold */}
          <motion.span
            className="font-black leading-none text-[#C9A84C]"
            style={compactSize}
            animate={{ opacity: strikeDrawn ? 1 : 0 }}
            transition={{ duration: 0.25, delay: strikeDrawn ? 0.42 : 0 }}
          >
            {tomorrowIqamah}
          </motion.span>
        </div>
      ) : (
        <p
          className={`font-black leading-none text-center ${isActive ? "text-white" : "text-white/60"}`}
          style={normalSize}
        >
          {todayIqamah}
        </p>
      )}
    </div>
  );
}

// ─── PrayerTimesV3 ─────────────────────────────────────────────────────────────

export default function PrayerTimesV3({ prayerTimes, tomorrowPrayerTimes }: PrayerTimesV3Props) {
  const jummahTimes = useJummahTimes();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [next, setNext] = useState<{ name: string; time: string; minutes: number }>({
    name: "—", time: "", minutes: 0,
  });

  useEffect(() => {
    if (!prayerTimes) return;
    setActiveIndex(getCurrentIndex(prayerTimes));
    setNext(getNextInfo(prayerTimes));
    const id = setInterval(() => {
      setActiveIndex(getCurrentIndex(prayerTimes));
      setNext(getNextInfo(prayerTimes));
    }, 60_000);
    return () => clearInterval(id);
  }, [prayerTimes]);

  const isFriday = new Date().getDay() === 5;

  return (
    <section className="bg-[#0A0A0A] py-8 md:py-10 overflow-hidden relative">

      {/* Crescent illustration */}
      <div className="absolute -right-20 -top-20 w-[420px] h-[420px] pointer-events-none select-none">
        <CrescentIllustration />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-2">
            Today&apos;s Schedule
          </p>
          <h2
            className="text-white font-black leading-none"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", letterSpacing: "-0.02em" }}
          >
            Prayer Times
          </h2>
        </motion.div>

        {/* Next prayer callout */}
        {prayerTimes && next.minutes > 0 && (
          <motion.div
            className="flex items-end justify-between mb-5 pb-5 border-b border-white/8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-medium mb-1">
                Next Prayer
              </p>
              <p
                className="text-white font-black leading-none"
                style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.03em" }}
              >
                {next.name}
              </p>
            </div>
            <div className="text-right pb-1">
              <p
                className="text-[#C9A84C] font-black leading-none"
                style={{ fontSize: "clamp(22px, 3.5vw, 44px)", letterSpacing: "-0.03em" }}
              >
                {next.minutes >= 60
                  ? `${Math.floor(next.minutes / 60)}h ${next.minutes % 60 > 0 ? `${next.minutes % 60}m` : ""}`
                  : `${next.minutes}m`}
              </p>
              <p className="text-white/30 text-[11px] uppercase tracking-[0.25em] font-medium mt-1">
                away
              </p>
            </div>
          </motion.div>
        )}

        {/* Friday Jummah banner */}
        {isFriday && (
          <motion.div
            className="mb-5 flex items-center gap-3 border border-[#C9A84C]/30 bg-[#C9A84C]/8 rounded-xl px-4 py-2.5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
            <p className="text-[#C9A84C] text-sm font-medium">
              Jummah today —{" "}
              {jummahTimes.map((j, i) => (
                <span key={j.name}>{i > 0 && " · "}{j.label}: {j.time}</span>
              ))}
            </p>
          </motion.div>
        )}

        {/* Prayer grid */}
        {prayerTimes ? (
          <motion.div
            className="grid grid-cols-5 gap-px bg-white/6 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {PRAYERS.map(({ key, label }, index) => {
              const pt = prayerTimes[key];
              const tomorrowPt = tomorrowPrayerTimes?.[key];
              const isActive = activeIndex === index;
              const adhanSize = { fontSize: "clamp(12px, 1.5vw, 20px)", letterSpacing: "-0.02em" };

              return (
                <div
                  key={key}
                  className={`relative flex flex-col items-center gap-1.5 py-4 sm:py-5 px-2 transition-colors duration-300 ${
                    isActive ? "bg-white/10" : "bg-[#111111]"
                  }`}
                >
                  {/* Gold top bar for active */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />
                  )}

                  {/* Pulsing dot */}
                  {isActive && (
                    <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A84C]" />
                    </span>
                  )}

                  {/* Prayer name */}
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    isActive ? "text-[#C9A84C]" : "text-white/30"
                  }`}>
                    {label}
                  </p>

                  {/* Adhan */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[8px] uppercase tracking-[0.2em] font-medium ${
                      isActive ? "text-white/25" : "text-white/15"
                    }`}>Adhān</span>
                    <p className={`font-light leading-none text-center ${
                      isActive ? "text-white/55" : "text-white/30"
                    }`} style={adhanSize}>
                      {pt.azzan}
                    </p>
                  </div>

                  {/* Iqamah — animated today→tomorrow */}
                  <IqamahDisplay
                    todayIqamah={pt.iqamah}
                    tomorrowIqamah={tomorrowPt?.iqamah}
                    isActive={isActive}
                    colIndex={index}
                  />
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div className="grid grid-cols-5 gap-px bg-white/6 rounded-2xl overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-[#111111] py-5 px-2 animate-pulse">
                <div className="h-2 w-10 bg-white/10 rounded mx-auto mb-3" />
                <div className="h-5 w-14 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-2 w-12 bg-white/10 rounded mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* View full schedule */}
        <motion.div
          className="mt-4 flex justify-end"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/prayertimes"
            className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em]
              hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            View Full Prayer Schedule →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
