"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import { prayerTimesData } from "../data/prayerTimes";
import { useJummahTimes } from "../hooks/useJummahTimes";

// ── Types ────────────────────────────────────────────────────────────────────

interface PrayerTime { azzan: string; iqamah: string; sunrise?: string; }
interface DayPrayerTimes {
  date: string; day: string; dst: boolean; month: string; year: string;
  fajr: PrayerTime; zuhr: PrayerTime; asr: PrayerTime; maghrib: PrayerTime; isha: PrayerTime;
}

// ── Constants ────────────────────────────────────────────────────────────────

const PRAYERS = [
  { key: "fajr"    as const, label: "Fajr"    },
  { key: "zuhr"    as const, label: "Dhuhr"   },
  { key: "asr"     as const, label: "Asr"     },
  { key: "maghrib" as const, label: "Maghrib" },
  { key: "isha"    as const, label: "Isha"    },
] as const;

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const HIJRI_MONTHS = [
  "Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani",
  "Jumada al-Awwal","Jumada al-Thani","Rajab","Sha'ban",
  "Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah",
];


// ── Helpers ──────────────────────────────────────────────────────────────────

function toHijri(date: Date) {
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

function parseTime(timeStr: string): Date {
  const [timePart, meridiem] = timeStr.trim().split(" ");
  const [h, m] = timePart.split(":");
  let hours = parseInt(h, 10);
  const minutes = parseInt(m, 10);
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Returns the index of the next upcoming prayer, or -1 if all prayers are done for today.
function getCurrentIndex(p: DayPrayerTimes): number {
  const now = new Date();
  for (let i = 0; i < PRAYERS.length; i++) {
    if (now < parseTime(p[PRAYERS[i].key].iqamah)) return i;
  }
  return -1;
}

function getNextInfo(p: DayPrayerTimes): { name: string; time: string; secsLeft: number } {
  const now = new Date();
  for (const { key, label } of PRAYERS) {
    const t = parseTime(p[key].iqamah);
    if (now < t) return { name: label, time: p[key].iqamah, secsLeft: Math.floor((t.getTime() - now.getTime()) / 1000) };
  }
  return { name: "Fajr", time: p.fajr.iqamah, secsLeft: 0 };
}

// ── Crescent illustration ────────────────────────────────────────────────────

function CrescentIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      <path d="M 375,120 A 180,180 0 1,0 375,380 A 155,155 0 0,1 375,120 Z" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
      <path d="M 390,105 A 200,200 0 1,0 390,395 A 172,172 0 0,1 390,105 Z" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
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

// ── Main component ───────────────────────────────────────────────────────────

export default function MonthlyPrayerTimes() {
  const jummahTimes = useJummahTimes();
  const [monthData, setMonthData]     = useState<DayPrayerTimes[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [next, setNext]               = useState<{ name: string; time: string; secsLeft: number }>({ name: "—", time: "", secsLeft: 0 });
  const [dateInfo, setDateInfo]       = useState<{ gregorian: string; hijri: string } | null>(null);

  const today         = useMemo(() => new Date(), []);
  const currentDate   = today.getDate().toString();
  const currentMonth  = (today.getMonth() + 1).toString();
  const currentYear   = today.getFullYear().toString();
  const fullMonthName = MONTH_NAMES[parseInt(currentMonth) - 1];
  const isFriday      = today.getDay() === 5;
  const showDST       = currentMonth === "3" && currentYear === "2026";

  // Date display
  useEffect(() => {
    const now = new Date();
    const gregorian = now.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
    const { day, month, year } = toHijri(now);
    setDateInfo({ gregorian, hijri: `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH` });
  }, []);

  // Fetch prayer times
  useEffect(() => {
    fetch("/api/prayerTimes")
      .then((r) => r.json())
      .then((data: DayPrayerTimes[]) => {
        const filtered = data.filter((d) => d.month === currentMonth && d.year === currentYear);
        if (filtered.length > 0) { setMonthData(filtered); return; }
        setMonthData((prayerTimesData as DayPrayerTimes[]).filter((d) => d.month === currentMonth && d.year === currentYear));
      })
      .catch(() => {
        setMonthData((prayerTimesData as DayPrayerTimes[]).filter((d) => d.month === currentMonth && d.year === currentYear));
      });
  }, [currentMonth, currentYear]);

  const todayPT = monthData.find((d) => d.date === currentDate);

  // Countdown
  useEffect(() => {
    if (!todayPT) return;
    setActiveIndex(getCurrentIndex(todayPT));
    setNext(getNextInfo(todayPT));
    const id = setInterval(() => {
      setActiveIndex(getCurrentIndex(todayPT));
      setNext(getNextInfo(todayPT));
    }, 1000);
    return () => clearInterval(id);
  }, [todayPT]);

  const timeStr = useMemo(() => {
    const h = Math.floor(next.secsLeft / 3600);
    const m = Math.floor((next.secsLeft % 3600) / 60);
    const s = next.secsLeft % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [next.secsLeft]);

  return (
    <>
      {/* ── Hero: dark ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] pt-[260px] sm:pt-[220px] lg:pt-[160px] pb-16 md:pb-24 overflow-hidden relative">
        <div className="absolute -right-24 -top-10 w-[500px] h-[500px] pointer-events-none select-none">
          <CrescentIllustration />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Headline */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-3">
              Al-Faruq Islamic Centre · Edmonton
            </p>
            <h1
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em" }}
            >
              <span className="block">Prayer</span>
              <span className="flex items-center gap-4 flex-wrap">
                <span>Times</span>
                <span
                  className="inline-block bg-white text-[#0A0A0A] font-black uppercase
                    px-3 py-1.5 rounded-sm align-middle"
                  style={{ fontSize: "clamp(11px, 1.4vw, 16px)", letterSpacing: "0.15em" }}
                >
                  {fullMonthName} {currentYear}
                </span>
              </span>
            </h1>
            {dateInfo && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-white/45 text-sm font-medium">{dateInfo.gregorian}</p>
                <span className="text-white/20">·</span>
                <p className="text-[#C9A84C] text-sm font-medium">{dateInfo.hijri}</p>
              </div>
            )}
          </motion.div>

          {/* Friday notice */}
          {isFriday && (
            <motion.div
              className="mb-8 flex items-center gap-3 border border-[#C9A84C]/30 bg-[#C9A84C]/[0.07] rounded-xl px-4 py-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
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

          {/* Next prayer countdown */}
          {todayPT && next.secsLeft > 0 && (
            <motion.div
              className="flex items-end justify-between mb-10 pb-8 border-b border-white/[0.07]"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div>
                <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-medium mb-1">
                  Next Prayer
                </p>
                <p
                  className="text-white font-black leading-none"
                  style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.03em" }}
                >
                  {next.name}
                </p>
                <p className="text-white/30 text-sm mt-2">{next.time} iqamah</p>
              </div>
              <div className="text-right pb-1">
                <p
                  className="text-[#C9A84C] font-black leading-none"
                  style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}
                >
                  {timeStr}
                </p>
                <p className="text-white/30 text-[11px] uppercase tracking-[0.25em] font-medium mt-1">
                  remaining
                </p>
              </div>
            </motion.div>
          )}

          {/* Today's 5-prayer grid */}
          {todayPT ? (
            <motion.div
              className="grid grid-cols-5 gap-px bg-white/[0.06] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {PRAYERS.map(({ key, label }, index) => {
                const pt = todayPT[key];
                const isActive = activeIndex === index;
                return (
                  <div
                    key={key}
                    className={`relative flex flex-col items-center gap-2 py-7 px-2 transition-colors duration-300 ${
                      isActive ? "bg-white/10" : "bg-[#111111]"
                    }`}
                  >
                    {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />}
                    {isActive && (
                      <span className="absolute top-3 right-3 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A84C]" />
                      </span>
                    )}
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? "text-[#C9A84C]" : "text-white/30"}`}>
                      {label}
                    </p>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-[8px] uppercase tracking-[0.2em] font-medium ${isActive ? "text-white/25" : "text-white/15"}`}>
                        Adhān
                      </span>
                      <p
                        className={`font-light leading-none text-center ${isActive ? "text-white/55" : "text-white/30"}`}
                        style={{ fontSize: "clamp(13px, 1.7vw, 22px)", letterSpacing: "-0.02em" }}
                      >
                        {pt.azzan}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-[8px] uppercase tracking-[0.2em] font-medium ${isActive ? "text-white/25" : "text-white/15"}`}>
                        Iqāmah
                      </span>
                      <p
                        className={`font-black leading-none text-center ${isActive ? "text-white" : "text-white/60"}`}
                        style={{ fontSize: "clamp(13px, 1.7vw, 22px)", letterSpacing: "-0.02em" }}
                      >
                        {pt.iqamah}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="grid grid-cols-5 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#111111] py-7 px-2 animate-pulse">
                  <div className="h-2 w-10 bg-white/10 rounded mx-auto mb-3" />
                  <div className="h-5 w-14 bg-white/10 rounded mx-auto mb-2" />
                  <div className="h-5 w-12 bg-white/10 rounded mx-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Monthly schedule: light ─────────────────────────────────────────── */}
      <section className="bg-[#F5F3EE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-2">
              Full Schedule
            </p>
            <h2
              className="text-[#0A0A0A] font-black leading-none"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.02em" }}
            >
              {fullMonthName} {currentYear}
            </h2>
          </motion.div>

          {/* DST notice */}
          {showDST && (
            <motion.div
              className="mb-8 flex items-start gap-3 border border-[#C9A84C]/40 bg-[#C9A84C]/[0.07] rounded-xl px-5 py-4"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Sun size={15} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
              <p className="text-[#0A0A0A]/70 text-sm leading-relaxed">
                <span className="font-bold text-[#0A0A0A]">Daylight Saving Time</span> begins March 8.
                Clocks move forward one hour — prayer times adjust accordingly.
              </p>
            </motion.div>
          )}

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
              <div className="min-w-[580px] px-4 sm:px-6 lg:px-0">

                {/* Header */}
                <div className="grid grid-cols-[72px_repeat(5,1fr)] mb-2">
                  <div className="pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A0A0A]/30">Date</span>
                  </div>
                  {PRAYERS.map(({ label }) => (
                    <div key={label} className="pb-2 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A0A0A]/30">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#0A0A0A]/10 mb-1" />

                {/* Rows */}
                {monthData.map((dayData, i) => {
                  const isToday = dayData.date === currentDate;
                  const isPast  = parseInt(dayData.date) < parseInt(currentDate);
                  return (
                    <motion.div
                      key={`${dayData.date}-${dayData.month}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-10px" }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.01, 0.25) }}
                      className={`grid grid-cols-[72px_repeat(5,1fr)] rounded-lg transition-colors ${
                        isToday ? "bg-[#0A0A0A]" : "hover:bg-[#0A0A0A]/4"
                      }`}
                    >
                      <div className="py-3 pl-3 flex flex-col justify-center">
                        <span className={`text-sm font-bold leading-none ${
                          isToday ? "text-[#C9A84C]" : isPast ? "text-[#0A0A0A]/25" : "text-[#0A0A0A]"
                        }`}>
                          {dayData.date}
                        </span>
                        <span className={`text-[10px] mt-0.5 ${
                          isToday ? "text-white/40" : "text-[#0A0A0A]/30"
                        }`}>
                          {dayData.day?.slice(0, 3)}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C9A84C] mt-1">
                            Today
                          </span>
                        )}
                      </div>

                      {PRAYERS.map(({ key }) => {
                        const pt = dayData[key];
                        return (
                          <div key={key} className="py-3 text-center flex flex-col items-center justify-center gap-0.5">
                            <span className={`text-[11px] font-light leading-tight ${
                              isToday ? "text-white/45" : isPast ? "text-[#0A0A0A]/20" : "text-[#0A0A0A]/40"
                            }`}>
                              {pt.azzan}
                            </span>
                            <span className={`text-xs font-bold leading-tight ${
                              isToday ? "text-white" : isPast ? "text-[#0A0A0A]/30" : "text-[#0A0A0A]/80"
                            }`}>
                              {pt.iqamah}
                            </span>
                          </div>
                        );
                      })}
                    </motion.div>
                  );
                })}

              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-[#0A0A0A]/10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded bg-[#0A0A0A]" />
              <span className="text-[11px] text-[#0A0A0A]/40 font-medium uppercase tracking-[0.12em]">Today</span>
            </div>
            <span className="text-[11px] text-[#0A0A0A]/35 uppercase tracking-[0.12em]">
              Adhan (light) · Iqamah (bold)
            </span>
          </div>

        </div>
      </section>

      {/* ── Jummah: dark ────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-3">
              Every Friday
            </p>
            <h2
              className="text-white font-black leading-none mb-10"
              style={{ fontSize: "clamp(32px, 5vw, 72px)", letterSpacing: "-0.03em" }}
            >
              <span className="flex items-center gap-4 flex-wrap">
                <span>Friday</span>
                <span
                  className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase
                    px-3 py-1.5 rounded-sm align-middle"
                  style={{ fontSize: "clamp(11px, 1.4vw, 16px)", letterSpacing: "0.15em" }}
                >
                  Jummah
                </span>
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-lg">
              {jummahTimes.map((slot) => (
                <div key={slot.name} className="relative bg-[#111111] flex flex-col items-center gap-3 py-10 px-6">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]/40" />
                  <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.2em]">
                    {slot.label}
                  </p>
                  <p
                    className="text-white font-black leading-none text-center"
                    style={{ fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.02em" }}
                  >
                    {slot.time}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
