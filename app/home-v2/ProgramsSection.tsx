"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    id: 1,
    title: "Al-Faruq Islamic School",
    subtitle: "Full-Time Islamic Education",
    description:
      "Alberta-accredited full-time Islamic school offering Kindergarten through Grade 9. A rigorous academic curriculum combined with deep Islamic education and values.",
    image: "/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.jpeg",
    href: "https://www.alfaruqislamicschool.com",
    tag: "KG – Grade 9",
    cta: "Learn More",
    external: true,
  },
  {
    id: 2,
    title: "Weekend Quran School",
    subtitle: "Saturdays & Sundays",
    description:
      "Quran memorization, Arabic language, and Islamic Studies for children ages 5–12. Classes run 11 AM – 2 PM every Saturday and Sunday.",
    image: "/AlFaruqWeekendQuranSchool.March2025.jpeg",
    href: "/weekendschool",
    tag: "Ages 5–12",
    cta: "Register Now",
    external: false,
  },
  {
    id: 3,
    title: "Classical Arabic Program",
    subtitle: "Deep Quranic Understanding",
    description:
      "Study the Arabic language as it appears in the Quran and classical Islamic texts. Open to all ages and levels.",
    image: "/AlFaruq.ClassicalArabicProgram.jpeg",
    href: "/programs",
    tag: "All Ages",
    cta: "Explore",
    external: false,
  },
  {
    id: 4,
    title: "Summer Camp",
    subtitle: "Summer 2025",
    description:
      "An immersive summer experience combining Quran, Arabic, Islamic Studies, Language Arts, and Math in a fun and engaging environment.",
    image: "/AFIS.SummerCamp.2025.jpeg",
    href: "/programs",
    tag: "Summer 2025",
    cta: "Register",
    external: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function ProgramsSection() {
  return (
    <section className="bg-[#F8F9FC] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <hr className="flex-1 max-w-[80px] border-t border-[#C9A84C]/40" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              What We Offer
            </span>
            <hr className="flex-1 max-w-[80px] border-t border-[#C9A84C]/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A6E] mb-4">
            Education &amp; Programs
          </h2>
          <p className="text-gray-500 text-lg">
            Building the next generation through faith and knowledge.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={cardVariants}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {program.external ? (
                <a
                  href={program.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <ProgramCardContent program={program} />
                </a>
              ) : (
                <Link href={program.href} className="block group">
                  <ProgramCardContent program={program} />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/programs"
            className="inline-block bg-[#1E3A6E] text-white font-semibold rounded-full px-8 py-3 hover:bg-[#162d58] transition-colors duration-300 shadow-md"
          >
            Explore All Programs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface Program {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  cta: string;
}

function ProgramCardContent({ program }: { program: Program }) {
  return (
    <>
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <span className="absolute top-4 left-4 bg-[#C9A84C] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10">
          {program.tag}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-1 font-medium">
          {program.subtitle}
        </p>
        <h3 className="text-xl font-bold text-[#1E3A6E] mb-2">{program.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{program.description}</p>
        <span className="text-[#1E3A6E] font-semibold text-sm flex items-center gap-1 group-hover:gap-3 transition-all duration-300">
          {program.cta}
          <ArrowRight size={15} strokeWidth={2.5} />
        </span>
      </div>
    </>
  );
}
