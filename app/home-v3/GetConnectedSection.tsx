"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";

// Hub-and-spoke network — central masjid hub connecting to 4 community nodes
function CommunityNetwork() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#0A0A0A" strokeOpacity="0.09" strokeWidth="1.2">

        {/* Outer bounding circle */}
        <circle cx="250" cy="250" r="228" />

        {/* Spoke lines: center → each outer node */}
        <line x1="250" y1="250" x2="250" y2="82" />
        <line x1="250" y1="250" x2="418" y2="250" />
        <line x1="250" y1="250" x2="250" y2="418" />
        <line x1="250" y1="250" x2="82"  y2="250" />

        {/* Ring: outer nodes connected to each other */}
        <line x1="250" y1="82"  x2="418" y2="250" />
        <line x1="418" y1="250" x2="250" y2="418" />
        <line x1="250" y1="418" x2="82"  y2="250" />
        <line x1="82"  y1="250" x2="250" y2="82"  />

        {/* Center hub: triple concentric rings */}
        <circle cx="250" cy="250" r="56" />
        <circle cx="250" cy="250" r="38" />
        <circle cx="250" cy="250" r="20" />

        {/* Center hub: 8-point star */}
        <polygon points="250,194 259,241 306,250 259,259 250,306 241,259 194,250 241,241" />

        {/* Outer node — top (Community Programs) */}
        <circle cx="250" cy="82"  r="30" />
        <circle cx="250" cy="82"  r="13" />

        {/* Outer node — right (Islamic School) */}
        <circle cx="418" cy="250" r="30" />
        <circle cx="418" cy="250" r="13" />

        {/* Outer node — bottom (Weekend School) */}
        <circle cx="250" cy="418" r="30" />
        <circle cx="250" cy="418" r="13" />

        {/* Outer node — left (Support Masjid) */}
        <circle cx="82"  cy="250" r="30" />
        <circle cx="82"  cy="250" r="13" />

        {/* Midpoint dots on spokes */}
        <circle cx="250" cy="166" r="5" />
        <circle cx="334" cy="250" r="5" />
        <circle cx="250" cy="334" r="5" />
        <circle cx="166" cy="250" r="5" />

        {/* Midpoint dots on ring */}
        <circle cx="334" cy="166" r="4" />
        <circle cx="334" cy="334" r="4" />
        <circle cx="166" cy="334" r="4" />
        <circle cx="166" cy="166" r="4" />

        {/* Faint diagonal cross for depth */}
        <line x1="108" y1="108" x2="392" y2="392" strokeOpacity="0.04" />
        <line x1="392" y1="108" x2="108" y2="392" strokeOpacity="0.04" />

      </g>
    </svg>
  );
}

export default function GetConnectedSection() {
  const donateUrl = useDonateUrl();

  const links = [
    {
      title: "Community Programs",
      desc: "Halaqas, youth groups, sisters' circle, and community events throughout the year.",
      href: "/programs",
      external: false,
    },
    {
      title: "Islamic School",
      desc: "Alberta-accredited K–Grade 9 education rooted in Islamic values at Al-Faruq & Amana Academy.",
      href: "https://www.alfaruqislamicschool.com",
      external: true,
    },
    {
      title: "Weekend Quran School",
      desc: "Quran memorisation, Arabic language and Islamic studies for children and adults.",
      href: "/weekendschool",
      external: false,
    },
    {
      title: "Support the Masjid",
      desc: "Your generosity — large or small — sustains the centre for all of Edmonton.",
      href: donateUrl,
      external: true,
    },
  ];

  return (
    <section className="bg-[#F5F3EE] overflow-hidden py-16 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center">

          {/* Left — illustration + headline */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {/* SVG — sits behind text, overflows slightly */}
            <div className="absolute -left-20 -top-20 w-[560px] h-[560px] pointer-events-none select-none">
              <CommunityNetwork />
            </div>

            {/* Headline on top */}
            <div className="relative z-10">
              <p className="text-[#0A0A0A]/30 text-[11px] font-medium uppercase tracking-[0.3em] mb-5">
                Al-Faruq Islamic Centre
              </p>
              <h2
                className="font-black text-[#0A0A0A] leading-[0.92]"
                style={{ fontSize: "clamp(64px, 9vw, 128px)", letterSpacing: "-0.03em" }}
              >
                <span className="block">Get</span>
                <span className="flex items-center gap-3 flex-wrap">
                  <span>Connected</span>
                  <span
                    className="inline-block bg-[#0A0A0A] text-white font-black uppercase
                      px-3 py-1.5 rounded-sm align-middle"
                    style={{ fontSize: "clamp(11px, 1.4vw, 18px)", letterSpacing: "0.15em" }}
                  >
                    with us
                  </span>
                </span>
              </h2>
            </div>
          </motion.div>

          {/* Right — arrow links */}
          <motion.div
            className="divide-y divide-[#0A0A0A]/10"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4 py-5 -mx-3 px-3
                      rounded-lg hover:bg-[#0A0A0A]/4 transition-colors duration-200"
                  >
                    <div>
                      <p className="text-[#0A0A0A] font-bold text-base mb-1">{link.title}</p>
                      <p className="text-[#0A0A0A]/45 text-sm leading-relaxed">{link.desc}</p>
                    </div>
                    <span className="text-[#0A0A0A]/25 text-lg mt-0.5 flex-shrink-0
                      group-hover:text-[#0A0A0A] group-hover:translate-x-1 transition-all duration-200">
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="group flex items-start justify-between gap-4 py-5 -mx-3 px-3
                      rounded-lg hover:bg-[#0A0A0A]/4 transition-colors duration-200"
                  >
                    <div>
                      <p className="text-[#0A0A0A] font-bold text-base mb-1">{link.title}</p>
                      <p className="text-[#0A0A0A]/45 text-sm leading-relaxed">{link.desc}</p>
                    </div>
                    <span className="text-[#0A0A0A]/25 text-lg mt-0.5 flex-shrink-0
                      group-hover:text-[#0A0A0A] group-hover:translate-x-1 transition-all duration-200">
                      →
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
