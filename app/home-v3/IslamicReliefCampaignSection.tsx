"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Target } from "lucide-react";
import { useCampaignStats } from "@/app/hooks/useCampaignStats";

// ─── Static campaign config ───────────────────────────────────────────────────
const CAMPAIGN_URL = "https://fundraise.islamicreliefcanada.org/en_US/campaign/support-sahaba-and-al-faruq-mosque-3952#attr=";
const CAMPAIGN_GOAL = 140_000;
// ─────────────────────────────────────────────────────────────────────────────

function StarGeometry() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#0A0A0A" strokeLinecap="round">
        <polygon
          points="200,48 222,178 340,200 222,222 200,352 178,222 60,200 178,178"
          strokeOpacity="0.055" strokeWidth="1.3"
        />
        <circle cx="200" cy="200" r="90"  strokeOpacity="0.04"  strokeWidth="1.2" />
        <circle cx="200" cy="200" r="140" strokeOpacity="0.03"  strokeWidth="1.1" />
        <circle cx="200" cy="200" r="186" strokeOpacity="0.025" strokeWidth="1"   />
        <line x1="200" y1="14"  x2="200" y2="34"  strokeOpacity="0.06" strokeWidth="1" />
        <line x1="200" y1="366" x2="200" y2="386" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="14"  y1="200" x2="34"  y2="200" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="366" y1="200" x2="386" y2="200" strokeOpacity="0.06" strokeWidth="1" />
      </g>
    </svg>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// Tile that pulses every 2s, staggered by index
function StatTile({
  icon: Icon,
  label,
  value,
  index,
  size = "base",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  index: number;
  size?: "base" | "sm";
}) {
  return (
    <motion.div
      className="bg-white rounded-lg px-3 py-2"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{
        duration: 0.45,
        ease: "easeInOut",
        delay: index * 0.65,
        repeat: Infinity,
        repeatDelay: 1.55,
      }}
    >
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={size === "sm" ? 8 : 9} strokeWidth={2} className="text-[#C9A84C] flex-shrink-0" />
        <span className={`font-semibold text-[#0A0A0A]/40 uppercase tracking-[0.08em] ${size === "sm" ? "text-[8px]" : "text-[9px]"}`}>
          {label}
        </span>
      </div>
      <p className={`font-black text-[#0A0A0A] leading-none ${size === "sm" ? "text-[15px]" : "text-lg"}`}>
        {value}
      </p>
    </motion.div>
  );
}

export default function IslamicReliefCampaignSection() {
  const [navHeight, setNavHeight] = useState(0);
  const { raised, donations, donationsLastHour } = useCampaignStats();

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setNavHeight(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  const pct = ((raised / CAMPAIGN_GOAL) * 100).toFixed(1);

  return (
    <section
      className="bg-white relative overflow-hidden"
      style={{ paddingTop: navHeight || 0 }}
    >
      {/* Background geometry — desktop only */}
      <div className="hidden lg:block absolute right-0 top-0 w-[360px] h-[360px] pointer-events-none select-none translate-x-1/3 -translate-y-1/3">
        <StarGeometry />
      </div>

      {/* ─── MOBILE layout (< lg) ─────────────────────────────────────────── */}
      <motion.div
        className="lg:hidden px-4 py-4 relative z-10"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Row 1: logo + badge + donate button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/IslamicReliefCanadaLogo.png"
              alt="Islamic Relief Canada"
              width={110}
              height={36}
              className="object-contain"
              priority
            />
            <span
              className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase
                px-2 py-0.5 rounded-sm text-[8px] tracking-[0.15em] whitespace-nowrap"
            >
              2:1 Match
            </span>
          </div>
          <a
            href={CAMPAIGN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1 bg-[#0A0A0A] text-white
              font-bold text-[10px] uppercase tracking-[0.12em] px-4 py-2 rounded-full
              hover:bg-[#0A0A0A]/75 transition-colors duration-200"
          >
            Donate →
          </a>
        </div>

        {/* Row 2: message */}
        <p className="text-[#0A0A0A]/60 text-[12px] leading-snug mb-3">
          <span className="font-semibold text-[#0A0A0A]/80">Ramadan Match:</span>{" "}
          For every $2 donated, IRC matches an additional $1.
        </p>

        {/* Row 3: progress card */}
        <div className="bg-[#F5F3EE] rounded-lg px-3.5 py-2.5">
          {/* Progress label */}
          <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.25em] mb-2">
            Campaign Progress
          </p>

          {/* Raised amount — prominent */}
          <div className="mb-1.5">
            <span className="font-black text-[#0A0A0A] text-2xl leading-none">{fmt(raised)}</span>
            <span className="text-[#0A0A0A]/45 text-[11px] font-medium ml-1.5">
              raised of <span className="text-[#0A0A0A]/65 font-semibold">{fmt(CAMPAIGN_GOAL)}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#0A0A0A]/10 rounded-full overflow-hidden mb-2.5">
            <motion.div
              className="h-full bg-[#0A0A0A] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            />
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-1.5">
            <StatTile icon={Heart}       label="Donations" value={donations}         index={0} size="sm" />
            <StatTile icon={Target}      label="Of Goal"   value={`${pct}%`}         index={1} size="sm" />
            <StatTile icon={TrendingUp}  label="Last Hour" value={donationsLastHour}  index={2} size="sm" />
          </div>
        </div>
      </motion.div>

      {/* ─── DESKTOP layout (lg+) ─────────────────────────────────────────── */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 lg:px-8 py-5 relative z-10">
        <div className="grid grid-cols-2 gap-12 items-center">

          {/* LEFT — logo + text */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="text-[#0A0A0A]/30 text-[10px] font-medium uppercase tracking-[0.3em]">
              Ramadan 2026  ·  Matching Donation Campaign
            </p>

            <Image
              src="/IslamicReliefCanadaLogo.png"
              alt="Islamic Relief Canada"
              width={140}
              height={46}
              className="object-contain"
              priority
            />

            <h2
              className="font-black text-[#0A0A0A] leading-[0.9]"
              style={{ fontSize: "clamp(22px, 2.4vw, 32px)", letterSpacing: "-0.02em" }}
            >
              <span className="block">Your donation,</span>
              <span className="flex items-center gap-2 flex-wrap">
                <span>multiplied.</span>
                <span
                  className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase
                    px-2 py-0.5 rounded-sm align-middle"
                  style={{ fontSize: "clamp(8px, 0.85vw, 10px)", letterSpacing: "0.15em" }}
                >
                  2:1 Match
                </span>
              </span>
            </h2>

            <p className="text-[#0A0A0A]/50 text-[12px] leading-snug max-w-sm">
              For every $2 donated, Islamic Relief Canada matches an additional $1.
            </p>

            <div>
              <a
                href={CAMPAIGN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#0A0A0A] text-white font-bold
                  text-[10px] uppercase tracking-[0.15em] px-5 py-2 rounded-full
                  hover:bg-[#0A0A0A]/75 transition-colors duration-200"
              >
                Donate Now →
              </a>
            </div>
          </motion.div>

          {/* RIGHT — campaign progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
          >
            <div className="bg-[#F5F3EE] rounded-xl p-4">
              <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
                Campaign Progress
              </p>

              <div className="mb-1.5">
                <span
                  className="font-black text-[#0A0A0A]"
                  style={{ fontSize: "clamp(20px, 2.4vw, 28px)", letterSpacing: "-0.02em" }}
                >
                  {fmt(raised)}
                </span>
                <span className="text-[#0A0A0A]/40 text-[12px] font-medium ml-1.5">
                  raised of{" "}
                  <span className="text-[#0A0A0A]/60 font-semibold">{fmt(CAMPAIGN_GOAL)}</span>
                </span>
              </div>

              <div className="h-1 bg-[#0A0A0A]/10 rounded-full mb-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-[#0A0A0A] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatTile icon={Heart}      label="Donations" value={donations}        index={0} />
                <StatTile icon={Target}     label="Of Goal"   value={`${pct}%`}        index={1} />
                <StatTile icon={TrendingUp} label="Last Hour" value={donationsLastHour} index={2} />
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#0A0A0A]/8 flex items-center justify-between">
                <p className="text-[#0A0A0A]/25 text-[9px] uppercase tracking-[0.15em]">
                  Raise For Relief · Islamic Relief Canada
                </p>
                <a
                  href={CAMPAIGN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]/40
                    hover:text-[#0A0A0A]/70 transition-colors duration-200"
                >
                  View Campaign →
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#0A0A0A]/8 to-transparent" />
    </section>
  );
}
