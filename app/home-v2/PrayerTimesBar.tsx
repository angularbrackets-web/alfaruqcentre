"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sunrise, Sun, Sunset, Moon, Star } from "lucide-react";

interface PrayerTime {
  azzan: string;
  iqamah: string;
  sunrise?: string;
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

export interface PrayerTimesBarProps {
  prayerTimes: DayPrayerTimes | null;
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

function getCurrentPrayerIndex(prayers: DayPrayerTimes): number {
  const now = new Date();
  const iqamahs = [
    parseTimeToday(prayers.fajr.iqamah),
    parseTimeToday(prayers.zuhr.iqamah),
    parseTimeToday(prayers.asr.iqamah),
    parseTimeToday(prayers.maghrib.iqamah),
    parseTimeToday(prayers.isha.iqamah),
  ];
  for (let i = iqamahs.length - 1; i >= 0; i--) {
    if (now >= iqamahs[i]) return i;
  }
  return 4;
}

function getTimeUntilNextAdhan(
  prayers: DayPrayerTimes
): { name: string; hours: number; minutes: number } | null {
  const now = new Date();
  const prayerList = [
    { name: "Fajr", time: parseTimeToday(prayers.fajr.azzan) },
    { name: "Dhuhr", time: parseTimeToday(prayers.zuhr.azzan) },
    { name: "Asr", time: parseTimeToday(prayers.asr.azzan) },
    { name: "Maghrib", time: parseTimeToday(prayers.maghrib.azzan) },
    { name: "Isha", time: parseTimeToday(prayers.isha.azzan) },
  ];
  for (const p of prayerList) {
    if (now < p.time) {
      const totalMinutes = Math.floor((p.time.getTime() - now.getTime()) / 60000);
      return {
        name: p.name,
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      };
    }
  }
  return null;
}

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof prayerNames)[number];

const prayerIcons: Record<PrayerName, React.ReactNode> = {
  Fajr: <Sunrise className="w-6 h-6" />,
  Dhuhr: <Sun className="w-6 h-6" />,
  Asr: <Sunset className="w-6 h-6" />,
  Maghrib: <Moon className="w-6 h-6" />,
  Isha: <Star className="w-6 h-6" />,
};

function getPrayerTimesMap(pt: DayPrayerTimes): Record<PrayerName, PrayerTime> {
  return {
    Fajr: pt.fajr,
    Dhuhr: pt.zuhr,
    Asr: pt.asr,
    Maghrib: pt.maghrib,
    Isha: pt.isha,
  };
}

function PrayerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4 py-5 flex flex-col items-center gap-2 animate-pulse">
      <div className="w-6 h-6 bg-gray-200 rounded-full" />
      <div className="h-3 w-12 bg-gray-200 rounded" />
      <div className="h-6 w-16 bg-gray-200 rounded" />
      <div className="h-2 w-8 bg-gray-100 rounded" />
      <div className="h-5 w-14 bg-gray-200 rounded" />
      <div className="h-2 w-8 bg-gray-100 rounded" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PrayerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PrayerTimesBar({ prayerTimes }: PrayerTimesBarProps) {
  const [activePrayerIndex, setActivePrayerIndex] = useState<number>(4);
  const [countdown, setCountdown] = useState<{
    name: string;
    hours: number;
    minutes: number;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      setActivePrayerIndex(getCurrentPrayerIndex(prayerTimes));
      setCountdown(getTimeUntilNextAdhan(prayerTimes));
    };
    update();
    intervalRef.current = setInterval(update, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prayerTimes]);

  if (!prayerTimes) return <LoadingSkeleton />;

  const now = new Date();
  const isToday =
    prayerTimes.date === String(now.getDate()) &&
    prayerTimes.month === String(now.getMonth() + 1) &&
    prayerTimes.year === String(now.getFullYear());

  const nextPrayerIndex = isToday ? (activePrayerIndex + 1) % 5 : -1;
  const isFriday = isToday && now.getDay() === 5;

  const times = getPrayerTimesMap(prayerTimes);

  const dateObj = new Date(
    parseInt(prayerTimes.year),
    parseInt(prayerTimes.month) - 1,
    parseInt(prayerTimes.date)
  );
  const displayDate = dateObj.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="bg-white border-b border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Today&apos;s Prayer Times
          </h2>
          <p className="text-sm text-gray-500 font-medium">{displayDate}</p>
        </div>

        {/* Cards */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          <motion.div
            className="flex gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {prayerNames.map((name, index) => {
              const prayerTime = times[name];
              const isActive = isToday && activePrayerIndex === index;
              const isNext = isToday && nextPrayerIndex === index;

              return (
                <motion.div
                  key={name}
                  variants={cardVariants}
                  className={[
                    "rounded-2xl px-4 py-5 text-center flex flex-col items-center gap-1 w-36 sm:w-auto relative shadow-sm",
                    isActive
                      ? "bg-[#1E3A6E] text-white shadow-lg shadow-[#1E3A6E]/20"
                      : isNext
                      ? "bg-white border-2 border-[#C9A84C]"
                      : "bg-white border border-gray-100",
                  ].join(" ")}
                >
                  <AnimatePresence>
                    {isNext && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      >
                        Next
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span
                    className={
                      isActive ? "text-[#C9A84C]" : isNext ? "text-[#C9A84C]" : "text-[#1E3A6E]"
                    }
                  >
                    {prayerIcons[name]}
                  </span>

                  <span
                    className={[
                      "text-xs font-medium uppercase tracking-wider",
                      isActive ? "text-blue-200" : "text-gray-500",
                    ].join(" ")}
                  >
                    {name}
                  </span>

                  <span
                    className={[
                      "text-[10px] uppercase tracking-widest mt-1",
                      isActive ? "text-blue-300" : "text-gray-400",
                    ].join(" ")}
                  >
                    Adhan
                  </span>

                  <span
                    className={[
                      "text-xl font-bold leading-tight",
                      isActive ? "text-white" : "text-[#1E3A6E]",
                    ].join(" ")}
                  >
                    {prayerTime.azzan}
                  </span>

                  {isActive && (
                    <span className="relative flex h-2 w-2 my-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]" />
                    </span>
                  )}

                  <span
                    className={[
                      "text-[10px] uppercase tracking-widest",
                      isActive ? "text-blue-300" : "text-gray-400",
                    ].join(" ")}
                  >
                    Iqamah
                  </span>

                  <span
                    className={[
                      "text-base font-semibold leading-tight",
                      isActive ? "text-blue-100" : "text-gray-700",
                    ].join(" ")}
                  >
                    {prayerTime.iqamah}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Countdown */}
        <div className="mt-5 flex justify-center">
          {countdown ? (
            <p className="text-gray-500 text-sm">
              Next prayer:{" "}
              <span className="font-semibold text-[#1E3A6E]">{countdown.name}</span> Adhan in{" "}
              <span className="font-semibold text-[#1E3A6E]">
                {countdown.hours > 0 && `${countdown.hours}h `}
                {countdown.minutes}m
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-sm italic">All prayers completed for today.</p>
          )}
        </div>

        {/* Jummah Banner */}
        <AnimatePresence>
          {isFriday && (
            <motion.div
              key="jummah-banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-4 text-center"
            >
              <p className="text-sm font-medium text-[#1E3A6E]">
                🕌{" "}
                <span className="font-semibold">Jummah Prayer Today</span>
                {" — "}1st:{" "}
                <span className="font-semibold">12:30 PM</span>
                {" · "}2nd:{" "}
                <span className="font-semibold">1:30 PM</span>
                {" · "}3rd:{" "}
                <span className="font-semibold">2:30 PM</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
