"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface MobileStickyBarProps {
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

interface NextPrayer {
  name: string;
  iqamah: string;
  minutesUntil: number;
}

function getNextPrayer(
  prayers: DayPrayerTimes,
  tomorrow?: DayPrayerTimes | null
): NextPrayer | null {
  const now = new Date();
  const prayerList = [
    { name: "Fajr", iqamah: prayers.fajr.iqamah, time: parseTimeToday(prayers.fajr.iqamah) },
    { name: "Dhuhr", iqamah: prayers.zuhr.iqamah, time: parseTimeToday(prayers.zuhr.iqamah) },
    { name: "Asr", iqamah: prayers.asr.iqamah, time: parseTimeToday(prayers.asr.iqamah) },
    { name: "Maghrib", iqamah: prayers.maghrib.iqamah, time: parseTimeToday(prayers.maghrib.iqamah) },
    { name: "Isha", iqamah: prayers.isha.iqamah, time: parseTimeToday(prayers.isha.iqamah) },
  ];
  for (const p of prayerList) {
    if (now < p.time) {
      const totalMinutes = Math.floor((p.time.getTime() - now.getTime()) / 60000);
      return { name: p.name, iqamah: p.iqamah, minutesUntil: totalMinutes };
    }
  }

  // If no more prayers today, show tomorrow's Fajr
  if (tomorrow) {
    const tomorrowFajr = parseTimeToday(tomorrow.fajr.iqamah);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    const totalMinutes = Math.floor((tomorrowFajr.getTime() - now.getTime()) / 60000);
    return { name: "Fajr", iqamah: tomorrow.fajr.iqamah, minutesUntil: totalMinutes };
  }

  return null;
}

export default function MobileStickyBar({ prayerTimes, tomorrowPrayerTimes }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => setNextPrayer(getNextPrayer(prayerTimes, tomorrowPrayerTimes));
    update();
    intervalRef.current = setInterval(update, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prayerTimes, tomorrowPrayerTimes]);

  if (!nextPrayer) return null;

  const h = Math.floor(nextPrayer.minutesUntil / 60);
  const m = nextPrayer.minutesUntil % 60;
  const countdown = h > 0 ? `${h}h ${m}m` : `${m}m`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-bar"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="bg-[#0F1E3D]/95 backdrop-blur-md border-t border-white/10 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Next Prayer</p>
                <p className="text-white font-semibold text-sm">
                  {nextPrayer.name} · {nextPrayer.iqamah}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase tracking-wider">Iqamah in</p>
              <p className="text-[#C9A84C] font-bold text-base">{countdown}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
