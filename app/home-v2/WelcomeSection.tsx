"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

function useCountUp(target: number | string, duration = 1500, active = false): string {
  const [value, setValue] = useState<string>(
    typeof target === "number" ? "0" : String(target)
  );

  useEffect(() => {
    if (!active || typeof target !== "number") {
      setValue(String(target));
      return;
    }
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    setValue("0");
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(String(target));
        clearInterval(timer);
      } else {
        setValue(String(Math.floor(current)));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [active, target, duration]);

  return value;
}

interface StatItemProps {
  value: number | string;
  label: string;
  suffix?: string;
  active: boolean;
}

function StatItem({ value, label, suffix = "", active }: StatItemProps) {
  const displayValue = useCountUp(value, 1500, active);

  return (
    <div className="flex flex-col items-start pt-3 border-t-2 border-[#C9A84C]">
      <span className="text-3xl font-bold text-[#1E3A6E] leading-tight">
        {typeof value === "number" ? displayValue + suffix : String(value)}
      </span>
      <span className="text-sm text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

export default function WelcomeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const leftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
  const rightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.15 },
    },
  };

  const stats: { value: number | string; label: string; suffix?: string }[] = [
    { value: 200, label: "Families Served", suffix: "+" },
    { value: 5, label: "Daily Prayers" },
    { value: 4, label: "Programs" },
    { value: "Est. 2018", label: "Established" },
  ];

  return (
    <section ref={sectionRef} className="bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column: Text */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <span className="w-1 h-5 bg-[#C9A84C] rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Our Mission
              </span>
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#1E3A6E] leading-tight">
                More Than a Mosque.
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-[#1E3A6E] leading-tight mt-1">
                A Home for Every Muslim.
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Al-Faruq Islamic Centre is the spiritual and educational hub for
              the Muslim community in southwest Edmonton. Whether you&apos;re
              joining us for daily prayers, enrolling your children in our
              school, or supporting our community through charitable giving —
              you are always welcome here.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-[#1E3A6E] text-[#1E3A6E] font-semibold text-sm hover:bg-[#1E3A6E] hover:text-white transition-all duration-200"
              >
                Learn More About Us
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#1E3A6E] text-white font-semibold text-sm hover:bg-[#162d58] transition-all duration-200 shadow-md shadow-[#1E3A6E]/20"
              >
                Our Programs →
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Quran verse + stats */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            className="flex flex-col gap-8"
          >
            {/* Quran Verse Card */}
            <div className="bg-[#1E3A6E] text-white rounded-3xl p-8 shadow-xl shadow-[#1E3A6E]/20">
              <p
                className="text-2xl sm:text-3xl font-semibold text-right leading-relaxed mb-4"
                dir="rtl"
                lang="ar"
              >
                إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ
              </p>
              <div className="w-12 h-px bg-[#C9A84C]/60 my-4 ml-auto" />
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                &ldquo;The mosques of Allah are only to be maintained by those
                who believe in Allah and the Last Day, establish prayer, give
                zakah, and do not fear except Allah.&rdquo;
              </p>
              <p className="mt-3 text-[#C9A84C] text-sm font-semibold tracking-wide">
                — Quran 9:18
              </p>
            </div>

            {/* Stats 2×2 grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <StatItem
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    active={isStatsInView}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
