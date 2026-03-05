"use client";

import Image from "next/image";
import { FC, useState } from "react";

const weekendSchoolUrl = "/AlFaruqWeekendSchool.mp4";

const programs = [
  {
    key: "arabic",
    title: "Arabic Reading Skills",
    body: [
      "To effectively learn the Quran, students must be able to read fluently from the Mushaf with Tajweed. We assess each student's reading ability and provide targeted instruction to strengthen their skills. Our Arabic reading program consists of 12 progressive levels.",
      "While students are in the reading program, they collectively memorize Surah An-Nas to Surah Al-Asr, along with Surah Al-Fatiha, through repetition. Once they complete the reading course, they begin individual Quran lessons.",
    ],
  },
  {
    key: "quran",
    title: "Quran Studies",
    body: [
      "Our Quran Studies program emphasizes fluency in recitation with Tajweed, ensuring proper pronunciation and application of recitation rules. To support learning, we use an online Quran platform, enabling students to practice and memorize easily at home with parental guidance.",
    ],
    bullets: [
      { label: "Recitation Session", detail: "Students practice reading from the Mushaf with proper Tajweed and without mistakes." },
      { label: "Memorization Session", detail: "Once students can recite fluently, they begin memorizing the Quran." },
    ],
  },
  {
    key: "islamic",
    title: "Islamic Studies",
    intro: "Al-Faruq Weekend School provides essential Islamic education, including:",
    bullets: [
      { label: "", detail: "Performing acts of worship (prayer, zakat, fasting, Hajj, etc.)." },
      { label: "", detail: "Strengthening faith and understanding core Islamic beliefs." },
      { label: "", detail: "Developing good character and manners through interactive lessons." },
    ],
  },
  {
    key: "seerah",
    title: "Seerah of the Prophet (S.A.W)",
    body: [
      "Children naturally learn through imitation. Our Seerah sessions introduce students to the life of Prophet Muhammad (peace be upon him) and his companions, offering them strong role models to follow in their daily lives.",
    ],
  },
];

const faqs = [
  {
    q: "What age groups do you accept?",
    a: "We accept students from ages 5 to 16 years old. If your child is older than 12 years, we have Al-Tarteel Quran Institute available. Please feel free to reach out for more information.",
  },
  {
    q: "Do you provide textbooks?",
    a: "Yes, textbooks are available for purchase at the school. The cost is not included in the monthly fee.",
  },
  {
    q: "What if my child misses a class?",
    a: "We understand that absences sometimes happen. Please notify the school administration in advance. Teachers can provide materials to help catch up on missed lessons.",
  },
  {
    q: "Is there homework assigned?",
    a: "Yes, students receive homework to practice their reading and memorization skills. Parental support at home is crucial for students' progress.",
  },
];

const WeekendSchool: FC = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    arabic: true,
    quran: false,
    islamic: false,
    seerah: false,
  });

  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-[260px] sm:pt-[220px] lg:pt-[160px] pb-20 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-6">
                Al-Faruq Islamic Centre
              </p>
              <h1 className="font-black tracking-tight leading-none mb-6"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
                WEEKEND{" "}
                <span className="inline-block bg-white text-[#0A0A0A] px-3 py-1.5 rounded-sm uppercase tracking-[0.08em] align-middle"
                      style={{ fontSize: "clamp(1.75rem, 4.5vw, 4rem)" }}>
                  QURAN SCHOOL
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-md mb-8">
                Nurturing young minds with Quranic education and Islamic values.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#0A0A0A] text-xs uppercase tracking-widest font-semibold px-7 py-3 rounded-full hover:bg-white/90 transition-colors"
              >
                Register Your Child
              </a>
            </div>

            {/* Video */}
            <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <div className="relative w-full" style={{ aspectRatio: "1600/837" }}>
                <video
                  src={weekendSchoolUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                  poster="/AlFaruqWeekendQuranSchool.jpeg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Posters ──────────────────────────────────────────── */}
      <section className="bg-[#F5F3EE] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-md">
              <Image
                src="/AlFaruqWeekendQuranSchool.jpeg"
                alt="Al-Faruq Weekend Quran School Poster"
                width={400}
                height={209}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-md">
              <Image
                src="/AlFaruq.Weekend.Quran.School.March2025.jpeg"
                alt="Al-Faruq Weekend Quran School March 2025"
                width={400}
                height={209}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Our Mission</p>
          <h2 className="font-black text-4xl md:text-5xl tracking-tight text-[#0A0A0A] mb-8 leading-tight">
            A focused curriculum<br />
            <span className="text-[#C9A84C]">four pillars</span> of education
          </h2>
          <p className="text-black/60 text-lg leading-relaxed mb-10">
            Al-Faruq Weekend Quran School is dedicated to providing students with Quranic education
            and fundamental Islamic values. Due to limited teaching time, our curriculum focuses on
            four key areas:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Arabic Reading Skills", "Quran Studies", "Islamic Studies", "Seerah of the Prophet"].map((item, i) => (
              <div key={i} className="bg-[#F5F3EE] p-5 border-t-2 border-[#0A0A0A]">
                <span className="block text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-2">
                  0{i + 1}
                </span>
                <p className="font-semibold text-[#0A0A0A] text-sm leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs Accordion ───────────────────────────────── */}
      <section className="bg-[#F5F3EE] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Curriculum</p>
          <h2 className="font-black text-4xl md:text-5xl tracking-tight text-[#0A0A0A] mb-10 leading-tight">
            Our Programs
          </h2>
          <div className="space-y-2">
            {programs.map((prog) => (
              <div key={prog.key} className="bg-white border border-black/8">
                <button
                  onClick={() => toggle(prog.key)}
                  className="w-full flex items-center justify-between px-6 py-5 focus:outline-none"
                  aria-expanded={open[prog.key]}
                >
                  <h3 className="font-black text-lg tracking-tight text-[#0A0A0A] text-left">{prog.title}</h3>
                  <svg
                    className={`w-5 h-5 text-black/40 flex-shrink-0 ml-4 transition-transform duration-200 ${open[prog.key] ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open[prog.key] && (
                  <div className="px-6 pb-6 text-black/60 space-y-3 text-sm leading-relaxed border-t border-black/5 pt-4">
                    {"intro" in prog && prog.intro && <p>{prog.intro}</p>}
                    {"body" in prog && prog.body?.map((text, i) => <p key={i}>{text}</p>)}
                    {"bullets" in prog && prog.bullets && (
                      <ul className="space-y-2 mt-3">
                        {prog.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-2 flex-shrink-0" />
                            <span>{b.label ? <><strong className="text-[#0A0A0A]">{b.label}:</strong> {b.detail}</> : b.detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location + Timing ────────────────────────────────── */}
      <section className="bg-[#0A0A0A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-4">Where & When</p>
          <h2 className="font-black text-4xl md:text-5xl tracking-tight mb-12 leading-tight">
            Location &{" "}
            <span className="text-[#C9A84C]">Schedule</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <p className="text-white/40 text-sm uppercase tracking-widest font-medium mb-4">Address</p>
              <address className="not-italic text-white/70 text-sm mb-6 leading-relaxed">
                Al-Faruq Islamic Centre<br />
                4410 127 St SW<br />
                Edmonton, AB T6W 1A2
              </address>
              <div className="rounded-lg overflow-hidden w-full h-72 border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2379.2586477432274!2d-113.54445322326558!3d53.39231297230264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01d10fe5dfb53%3A0xc7f45b21bddbfb4a!2sAl%20Faruq%20Mosque%20and%20Islamic%20School%20(Southside)!5e0!3m2!1sen!2sca!4v1742368108390!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Al-Faruq Islamic Centre Location"
                />
              </div>
            </div>

            {/* Timing & Fees */}
            <div className="space-y-8">
              <div>
                <p className="text-white/40 text-sm uppercase tracking-widest font-medium mb-4">Class Schedule</p>
                <div className="space-y-3">
                  {[
                    { day: "Saturday", time: "11:00 AM – 2:00 PM" },
                    { day: "Sunday", time: "11:00 AM – 2:00 PM" },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between border-b border-white/8 pb-3">
                      <span className="font-semibold text-white text-sm">{day}</span>
                      <span className="text-white/60 text-sm">{time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-3 italic">Schedule subject to change due to daylight saving time.</p>
              </div>
              <div>
                <p className="text-white/40 text-sm uppercase tracking-widest font-medium mb-4">Fees</p>
                <div className="bg-white/5 border border-white/10 p-5 rounded-sm">
                  <p className="text-white font-black text-3xl tracking-tight">$65</p>
                  <p className="text-white/50 text-sm mt-1">per month, per child</p>
                  <p className="text-white/35 text-xs mt-2">+ cost of books (purchased at school)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Registration CTA ─────────────────────────────────── */}
      <section className="bg-[#F5F3EE] py-20 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Enroll Today</p>
          <h2 className="font-black text-4xl md:text-5xl tracking-tight text-[#0A0A0A] mb-6 leading-tight">
            Ready to enroll<br />your child?
          </h2>
          <p className="text-black/55 text-lg leading-relaxed mb-10">
            Provide your child with quality education in Quranic studies, Arabic reading,
            Islamic knowledge, and character development.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full hover:bg-black/80 transition-colors"
          >
            Register Now
          </a>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">FAQ</p>
          <h2 className="font-black text-4xl tracking-tight text-[#0A0A0A] mb-10 leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-black/8 py-6 last:border-b">
                <h3 className="font-bold text-[#0A0A0A] mb-3">{faq.q}</h3>
                <p className="text-black/55 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeekendSchool;
