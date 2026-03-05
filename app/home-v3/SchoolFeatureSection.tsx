"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "Students enrolled" },
  { value: "K–9",  label: "Grade range"       },
  { value: "2",    label: "Partner schools"   },
];

export default function SchoolFeatureSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-4">
            Islamic Education
          </p>

          <h2
            className="text-[#0A0A0A] font-black leading-none mb-6"
            style={{ fontSize: "clamp(40px, 5.5vw, 72px)", letterSpacing: "-0.03em" }}
          >
            <span className="block">Educating</span>
            <span className="block">the Next</span>
            <span className="flex items-center gap-3 flex-wrap">
              <span>Generation</span>
              <span
                className="inline-block bg-[#0A0A0A] text-white font-black uppercase
                  px-3 py-1.5 rounded-sm"
                style={{ fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "0.15em" }}
              >
                Grades K–9
              </span>
            </span>
          </h2>

          <p className="text-[#0A0A0A]/55 text-lg leading-relaxed mb-8 max-w-lg">
            Al-Faruq Islamic School and Amana Academy deliver an Alberta-accredited curriculum
            grounded in Islamic values — preparing students for both Deen and Dunya.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-7 border-t border-b border-[#0A0A0A]/8 mb-8">
            {stats.map((s) => (
              <div key={s.value}>
                <p
                  className="text-[#0A0A0A] font-black leading-none mb-1"
                  style={{ fontSize: "clamp(28px, 3vw, 44px)", letterSpacing: "-0.03em" }}
                >
                  {s.value}
                </p>
                <p className="text-[#0A0A0A]/35 text-[10px] uppercase tracking-[0.18em] font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.alfaruqislamicschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0A0A0A] text-white font-bold rounded-full px-8 py-3.5 text-sm uppercase
                tracking-[0.1em] hover:bg-[#0A0A0A]/80 transition-all duration-200 inline-block text-center"
            >
              Apply Now →
            </a>
            <Link
              href="/weekendschool"
              className="border border-[#0A0A0A]/20 text-[#0A0A0A] font-semibold rounded-full px-8 py-3.5
                text-sm uppercase tracking-[0.1em] hover:bg-[#0A0A0A]/5 hover:border-[#0A0A0A]/40
                transition-all duration-200 inline-block text-center"
            >
              Weekend School
            </Link>
          </div>
        </motion.div>

        {/* Right — image */}
        <motion.div
          className="relative h-[460px] lg:h-[560px] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
        >
          <Image
            src="/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.jpeg"
            alt="Al-Faruq Islamic School and Amana Academy"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </motion.div>

      </div>
      </div>
    </section>
  );
}
