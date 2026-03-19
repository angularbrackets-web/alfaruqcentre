"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDonateUrl } from "../hooks/useDonateUrl";
import { Heart, TrendingUp, Target } from "lucide-react";

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

// Per-index accent colours: 0=green (donations), 1=dark-gold (% of goal), 2=green (last hour)
const TILE_COLORS = ["#155E3E", "#9E7A0E", "#155E3E"] as const;

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
  const color = TILE_COLORS[index % TILE_COLORS.length];
  return (
    <motion.div
      className="rounded-lg px-3 py-2 border border-[#0A0A0A]/10"
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
        <Icon size={size === "sm" ? 8 : 9} strokeWidth={2} style={{ color }} className="flex-shrink-0" />
        <span className={`font-semibold text-[#0A0A0A]/40 uppercase tracking-[0.08em] ${size === "sm" ? "text-[8px]" : "text-[9px]"}`}>
          {label}
        </span>
      </div>
      <p className={`font-black leading-none ${size === "sm" ? "text-[15px]" : "text-lg"}`} style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}

// ─── Animated gradient progress bar ──────────────────────────────────────────

function ProgressBar({ pct, delay = 0.4, height = "h-2" }: { pct: number; delay?: number; height?: string }) {
  return (
    <div className={`${height} bg-[#0A0A0A]/8 rounded-full overflow-hidden`}>
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #155E3E 0%, #1F8A57 45%, #C9A84C 100%)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay }}
      >
        {/* Shimmer sweep — starts after bar finishes animating */}
        <motion.div
          className="absolute inset-y-0"
          style={{
            width: "45%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
          }}
          animate={{ left: ["-45%", "145%"] }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3,
            delay: delay + 1.6,
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Compact Campaign Bar ─────────────────────────────────────────────────────

function CompactCampaignBar({
  raised,
  donations,
}: {
  raised: number;
  donations: number;
}) {
  const pct = Math.min((raised / CAMPAIGN_GOAL) * 100, 100);
  return (
    <section
      className="bg-white border-b border-[#0A0A0A]/5 relative z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 sm:gap-5">
        {/* IRC logo */}
        <Image
          src="/IslamicReliefCanadaLogo.png"
          alt="Islamic Relief Canada"
          width={90}
          height={30}
          className="object-contain flex-shrink-0 hidden sm:block"
          priority
        />
        {/* Badge */}
        <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase px-2 py-0.5 rounded-sm text-[8px] tracking-[0.15em] whitespace-nowrap flex-shrink-0">
          2:1 Match
        </span>
        {/* Progress info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-[#155E3E] text-sm whitespace-nowrap">{fmt(raised)}</span>
            <span className="text-[#0A0A0A]/40 text-[11px] whitespace-nowrap hidden sm:inline">
              of {fmt(CAMPAIGN_GOAL)} · {donations} donations
            </span>
            <span className="text-[#C9A84C] text-[10px] font-bold whitespace-nowrap">{pct.toFixed(0)}%</span>
          </div>
          <ProgressBar pct={pct} delay={0.3} height="h-1.5" />
        </div>
        {/* CTA */}
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
    </section>
  );
}

// ─── Medium Campaign Section ──────────────────────────────────────────────────

function MediumCampaignSection({
  raised,
  donations,
  donationsLastHour,
}: {
  raised: number;
  donations: number;
  donationsLastHour: number;
}) {
  const pct = ((raised / CAMPAIGN_GOAL) * 100).toFixed(1);
  return (
    <section
      className="bg-white relative overflow-hidden"
    >
      {/* Mobile */}
      <motion.div
        className="lg:hidden px-4 py-3 relative z-10"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Image src="/IslamicReliefCanadaLogo.png" alt="Islamic Relief Canada" width={100} height={32} className="object-contain" priority />
            <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase px-2 py-0.5 rounded-sm text-[8px] tracking-[0.15em] whitespace-nowrap">
              2:1 Match
            </span>
          </div>
          <a href={CAMPAIGN_URL} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1 bg-[#0A0A0A] text-white font-bold text-[10px] uppercase tracking-[0.12em] px-4 py-1.5 rounded-full hover:bg-[#0A0A0A]/75 transition-colors duration-200">
            Donate →
          </a>
        </div>
        <div className="bg-[#F5F3EE] rounded-lg px-3 py-2.5">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-black text-[#155E3E] text-xl leading-none">{fmt(raised)}</span>
            <span className="text-[#0A0A0A]/45 text-[11px] font-medium">of {fmt(CAMPAIGN_GOAL)}</span>
            <span className="text-[#C9A84C] text-[10px] font-bold ml-auto">{pct}%</span>
          </div>
          <div className="mb-2">
            <ProgressBar pct={Number(pct)} delay={0.4} height="h-1.5" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <StatTile icon={Heart} label="Donations" value={donations} index={0} size="sm" />
            <StatTile icon={Target} label="Of Goal" value={`${pct}%`} index={1} size="sm" />
            <StatTile icon={TrendingUp} label="Last Hour" value={donationsLastHour} index={2} size="sm" />
          </div>
        </div>
      </motion.div>

      {/* Desktop */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 lg:px-8 py-3 relative z-10">
        <div className="grid grid-cols-2 gap-10 items-center">
          <motion.div className="flex items-center gap-5" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}>
            <Image src="/IslamicReliefCanadaLogo.png" alt="Islamic Relief Canada" width={120} height={40} className="object-contain flex-shrink-0" priority />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-[#0A0A0A] leading-none" style={{ fontSize: "clamp(16px, 1.8vw, 22px)", letterSpacing: "-0.02em" }}>
                  Your donation, multiplied.
                </h2>
                <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase px-2 py-0.5 rounded-sm text-[8px] tracking-[0.15em] whitespace-nowrap">
                  2:1 Match
                </span>
              </div>
              <p className="text-[#0A0A0A]/45 text-[11px]">For every $2 donated, IRC matches an additional $1.</p>
              <a href={CAMPAIGN_URL} target="_blank" rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-1 bg-[#0A0A0A] text-white font-bold text-[10px] uppercase tracking-[0.12em] px-4 py-1.5 rounded-full hover:bg-[#0A0A0A]/75 transition-colors duration-200 mt-0.5">
                Donate Now →
              </a>
            </div>
          </motion.div>
          <motion.div className="bg-[#F5F3EE] rounded-xl px-4 py-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-black text-[#155E3E]" style={{ fontSize: "clamp(18px, 2vw, 24px)", letterSpacing: "-0.02em" }}>{fmt(raised)}</span>
              <span className="text-[#0A0A0A]/40 text-[11px]">raised of <span className="text-[#0A0A0A]/60 font-semibold">{fmt(CAMPAIGN_GOAL)}</span></span>
              <span className="text-[#C9A84C] text-[10px] font-bold ml-auto">{pct}%</span>
            </div>
            <div className="mb-2.5">
              <ProgressBar pct={Number(pct)} delay={0.4} height="h-1.5" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <StatTile icon={Heart} label="Donations" value={donations} index={0} size="sm" />
              <StatTile icon={Target} label="Of Goal" value={`${pct}%`} index={1} size="sm" />
              <StatTile icon={TrendingUp} label="Last Hour" value={donationsLastHour} index={2} size="sm" />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#0A0A0A]/8 to-transparent" />
    </section>
  );
}

// ─── Full Campaign Section ─────────────────────────────────────────────────────

export default function IslamicReliefCampaignSection() {
  const [displayMode, setDisplayMode] = useState<"default" | "compact" | "medium" | "hidden" | null>(null);
  const [raised, setRaised] = useState(0);
  const [donations, setDonations] = useState(0);
  const [donationsLastHour, setDonationsLastHour] = useState(0);

  // Single fetch for both display mode and stats — prevents flash of default/hardcoded values
  useEffect(() => {
    function loadSettings() {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((data: Record<string, string>) => {
          const mode =
            data.campaignDisplayMode === "compact" ? "compact" :
            data.campaignDisplayMode === "medium"  ? "medium"  :
            data.campaignDisplayMode === "hidden"  ? "hidden"  : "default";
          setDisplayMode(mode);
          setRaised(data.campaign_raised ? Number(data.campaign_raised) : 0);
          setDonations(data.campaign_donations ? Number(data.campaign_donations) : 0);
          setDonationsLastHour(data.campaign_donations_last_hour ? Number(data.campaign_donations_last_hour) : 0);
        })
        .catch(() => { setDisplayMode("default"); });
    }
    loadSettings();
    const id = setInterval(loadSettings, 60_000);
    return () => clearInterval(id);
  }, []);



  // Loading: show compact-shaped skeleton to reserve space and avoid layout pop
  if (displayMode === null) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4 h-[42px]">
            {/* IRC logo */}
            <div className="h-6 w-[88px] flex-shrink-0 rounded bg-[#0A0A0A]/6 animate-pulse" />
            {/* Badge */}
            <div className="h-4 w-14 flex-shrink-0 rounded bg-[#C9A84C]/20 animate-pulse" />
            {/* Progress area */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 rounded bg-[#0A0A0A]/8 animate-pulse" />
                <div className="h-2.5 w-28 rounded bg-[#0A0A0A]/5 animate-pulse hidden sm:block" />
              </div>
              <div className="h-1 w-full rounded-full bg-[#0A0A0A]/6 animate-pulse" />
            </div>
            {/* CTA */}
            <div className="h-7 w-20 flex-shrink-0 rounded-full bg-[#0A0A0A]/8 animate-pulse" />
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#0A0A0A]/8 to-transparent" />
      </div>
    );
  }

  if (displayMode === "hidden") {
    return null;
  }

  if (displayMode === "compact") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        <CompactCampaignBar raised={raised} donations={donations} />
      </motion.div>
    );
  }
  if (displayMode === "medium") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        <MediumCampaignSection raised={raised} donations={donations} donationsLastHour={donationsLastHour} />
      </motion.div>
    );
  }

  const pct = ((raised / CAMPAIGN_GOAL) * 100).toFixed(1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white relative overflow-hidden"
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
            <span className="font-black text-[#155E3E] text-2xl leading-none">{fmt(raised)}</span>
            <span className="text-[#0A0A0A]/45 text-[11px] font-medium ml-1.5">
              raised of <span className="text-[#0A0A0A]/65 font-semibold">{fmt(CAMPAIGN_GOAL)}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-2.5">
            <ProgressBar pct={Number(pct)} delay={0.4} height="h-2" />
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
                  className="font-black text-[#155E3E]"
                  style={{ fontSize: "clamp(20px, 2.4vw, 28px)", letterSpacing: "-0.02em" }}
                >
                  {fmt(raised)}
                </span>
                <span className="text-[#0A0A0A]/40 text-[12px] font-medium ml-1.5">
                  raised of{" "}
                  <span className="text-[#0A0A0A]/60 font-semibold">{fmt(CAMPAIGN_GOAL)}</span>
                </span>
              </div>

              <div className="mb-2.5">
                <ProgressBar pct={Number(pct)} delay={0.5} height="h-2" />
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
    </motion.section>
  );
}
