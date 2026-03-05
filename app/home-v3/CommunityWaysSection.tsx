"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const WAYS_LINKS = [
  { label: "Daily Prayers", href: "/prayertimes" },
  { label: "Islamic School", href: "https://www.alfaruqislamicschool.com", external: true },
  { label: "Join a Team", href: "/volunteer" },
];

const EXPLORE_LINKS = [
  {
    label: "Weekend Quran School",
    desc: "Quran & Arabic for children ages 5–12. Every Saturday and Sunday, 11 AM to 2 PM at our masjid.",
    href: "/weekendschool",
  },
  {
    label: "Classical Arabic Program",
    desc: "Study the language of the Quran at all levels — beginner through advanced. Led by certified instructors.",
    href: "/programs",
  },
];

export default function CommunityWaysSection() {
  return (
    <section className="bg-white overflow-hidden">

      {/* ── Top two-column block ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — editorial display heading */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <h2
              className="text-[#0A0A0A] font-black leading-[0.92] uppercase"
              style={{ fontSize: "clamp(56px, 8vw, 112px)", letterSpacing: "-0.025em" }}
            >
              <span className="block">Ways</span>
              {/* Stamp box — "WE BUILD" */}
              <span
                className="inline-block border-[3px] border-[#0A0A0A] px-3 py-1 my-1 rounded-sm
                  text-[0.55em] leading-tight tracking-widest uppercase align-middle"
              >
                WE BUILD
              </span>
              <span className="block">Community</span>
            </h2>
          </motion.div>

          {/* Right — links + description */}
          <motion.div
            className="flex flex-col gap-8 lg:pt-4"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          >
            {/* Arrow links */}
            <div className="flex flex-col divide-y divide-gray-100">
              {WAYS_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-4 group"
                  >
                    <span className="text-[#0A0A0A] font-bold text-xl group-hover:opacity-60 transition-opacity">
                      {link.label}
                    </span>
                    <span className="text-[#0A0A0A] text-xl group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-4 group"
                  >
                    <span className="text-[#0A0A0A] font-bold text-xl group-hover:opacity-60 transition-opacity">
                      {link.label}
                    </span>
                    <span className="text-[#0A0A0A] text-xl group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                )
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed max-w-sm">
              Our gathering is always centered on strengthening Iman and connecting with others
              through prayer, learning, and service.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom full-bleed image + explore links ─────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — "Take me to" label + explore links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-gray-400 text-[11px] uppercase tracking-[0.3em] font-medium mb-6">
              Take me to:
            </p>
            <div className="flex flex-col gap-6">
              {EXPLORE_LINKS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#0A0A0A] font-bold text-lg flex items-center gap-2 group mb-1.5"
                  >
                    {item.label}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — community photo */}
          <motion.div
            className="relative h-72 lg:h-96 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Image
              src="/AlFaruq.EidAlAdha.Prayer2025.jpeg"
              alt="Al-Faruq Community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* VOUS brand watermark style */}
            <div className="absolute bottom-5 right-5 text-white/20 font-black uppercase text-4xl select-none leading-none">
              Al-Faruq
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
