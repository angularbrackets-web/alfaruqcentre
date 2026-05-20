"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WeeklyClass } from "@/app/types/weeklyClass";
import {
  DAYS_ORDERED,
  DAY_TO_JS_INDEX,
  DAY_FULL_LABELS,
  type DayOfWeek,
} from "@/app/data/weeklySchedule";

function WeeklyGridIllustration() {
  return (
    <svg
      viewBox="0 0 560 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="558" height="158" rx="8" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="0" y1="36" x2="560" y2="36" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="80"  y1="0" x2="80"  y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="160" y1="0" x2="160" y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="240" y1="0" x2="240" y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="320" y1="0" x2="320" y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="400" y1="0" x2="400" y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="480" y1="0" x2="480" y2="160" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <polygon
        points="280,62 293,80 316,80 303,98 316,116 293,116 280,134 267,116 244,116 257,98 244,80 267,80"
        stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1"
      />
      <polygon points="280,70 308,98 280,126 252,98" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="280" cy="98" r="16" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="40"  cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="120" cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="200" cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="360" cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="440" cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
      <circle cx="520" cy="98" r="2.5" stroke="#0A0A0A" strokeOpacity="0.06" strokeWidth="1" />
    </svg>
  );
}

function AudienceBadge({ label }: { label: string }) {
  const isSisters = label.toLowerCase() === "sisters";
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm leading-none flex-shrink-0 ${
        isSisters
          ? "bg-[#C9A84C]/15 text-[#C9A84C]"
          : "bg-[#0A0A0A]/6 text-[#0A0A0A]/40"
      }`}
    >
      {label}
    </span>
  );
}

/* ── Desktop card (7-column grid, all days including empty) ── */
function DesktopDayCard({
  day,
  classes,
  isToday,
}: {
  day: DayOfWeek;
  classes: WeeklyClass[];
  isToday: boolean;
}) {
  const hasClasses = classes.length > 0;
  return (
    <div
      className={`relative flex flex-col rounded-xl border transition-all duration-200 ${
        isToday
          ? "border-[#C9A84C] shadow-[0_0_0_1px_#C9A84C]"
          : hasClasses
          ? "border-[#0A0A0A]/10 hover:border-[#0A0A0A]/20"
          : "border-[#0A0A0A]/6"
      } ${hasClasses ? "bg-white" : "bg-[#0A0A0A]/[0.018]"}`}
    >
      {isToday && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C] rounded-t-xl" />}

      <div className={`px-3 pt-3 pb-2 border-b ${isToday ? "border-[#C9A84C]/20" : "border-[#0A0A0A]/6"}`}>
        <div className="flex items-center justify-between gap-1">
          <p className={`text-[11px] font-bold uppercase tracking-[0.18em] leading-none ${hasClasses ? "text-[#0A0A0A]" : "text-[#0A0A0A]/22"}`}>
            {DAY_FULL_LABELS[day]}
          </p>
          {isToday && (
            <span className="bg-[#0A0A0A] text-white text-[8px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-sm leading-none">
              Today
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1 min-h-[90px]">
        {hasClasses ? (
          classes.map((cls) => (
            <div key={cls.id} className="flex flex-col gap-1">
              <p className="text-[13px] font-bold text-[#0A0A0A] leading-tight">{cls.name}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[11px] text-[#0A0A0A]/50 font-medium leading-none">
                  {cls.endTime ? `${cls.startTime} – ${cls.endTime}` : cls.startTime}
                </p>
                {cls.audience && <AudienceBadge label={cls.audience} />}
              </div>
            </div>
          ))
        ) : (
          <span className="text-[#0A0A0A]/18 text-sm font-medium self-center my-auto">—</span>
        )}
      </div>
    </div>
  );
}

/* ── Mobile row (vertical stack, only days with classes) ── */
function MobileDayRow({
  day,
  classes,
  isToday,
}: {
  day: DayOfWeek;
  classes: WeeklyClass[];
  isToday: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border ${
        isToday ? "border-[#C9A84C] shadow-[0_0_0_1px_#C9A84C]" : "border-[#0A0A0A]/10"
      } bg-white overflow-hidden`}
    >
      {isToday && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />}

      {/* Day header row */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isToday ? "border-[#C9A84C]/20" : "border-[#0A0A0A]/8"}`}>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
          {DAY_FULL_LABELS[day]}
        </p>
        {isToday && (
          <span className="bg-[#0A0A0A] text-white text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-sm leading-none">
            Today
          </span>
        )}
      </div>

      {/* Classes */}
      <div className="divide-y divide-[#0A0A0A]/6">
        {classes.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[15px] font-bold text-[#0A0A0A] leading-snug">{cls.name}</p>
              <p className="text-sm text-[#0A0A0A]/50 font-medium">
                {cls.endTime ? `${cls.startTime} – ${cls.endTime}` : cls.startTime}
              </p>
            </div>
            {cls.audience && <AudienceBadge label={cls.audience} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeeklyScheduleSection() {
  const [todayIndex, setTodayIndex] = useState<number>(-1);
  const [classes, setClasses] = useState<WeeklyClass[]>([]);

  useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  useEffect(() => {
    fetch("/api/weekly-schedule")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setClasses(data.data);
      })
      .catch(() => {});
  }, []);

  const classesByDay = Object.fromEntries(
    DAYS_ORDERED.map((day) => [
      day,
      classes.filter((cls) => cls.days.includes(day)),
    ])
  ) as Record<DayOfWeek, WeeklyClass[]>;

  const hasAnyClasses = classes.length > 0;

  if (!hasAnyClasses) return null;

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="relative mb-10 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[480px] h-[140px] pointer-events-none select-none hidden md:block">
            <WeeklyGridIllustration />
          </div>

          <div className="relative z-10">
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
              Regular Classes
            </p>
            <h2
              className="text-[#0A0A0A] font-black leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.02em" }}
            >
              <span className="block">Weekly</span>
              <span className="flex items-center gap-3 flex-wrap mt-1">
                <span>Programs</span>
                <span
                  className="inline-block bg-[#0A0A0A] text-white font-black uppercase px-3 py-1.5 rounded-sm align-middle"
                  style={{ fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "0.15em" }}
                >
                  Recurring Classes
                </span>
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Mobile: vertical stack, only days with classes */}
        <motion.div
          className="md:hidden flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {DAYS_ORDERED.filter((day) => classesByDay[day].length > 0).map((day, i) => {
            const isToday = todayIndex === DAY_TO_JS_INDEX[day];
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <MobileDayRow day={day} classes={classesByDay[day]} isToday={isToday} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Desktop: 7-column grid, all days */}
        <motion.div
          className="hidden md:grid md:grid-cols-7 md:gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {DAYS_ORDERED.map((day, i) => {
            const isToday = todayIndex === DAY_TO_JS_INDEX[day];
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
              >
                <DesktopDayCard day={day} classes={classesByDay[day]} isToday={isToday} />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-6 text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.2em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          Times subject to change — check with the centre for updates.
        </motion.p>
      </div>
    </section>
  );
}
