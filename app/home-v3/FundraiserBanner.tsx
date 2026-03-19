"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, MapPin } from "lucide-react";
import { useDonateUrl } from "@/app/hooks/useDonateUrl";
import { CelebrationBackground } from "@/app/components/CelebrationBackground";

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const CONFIG = {
  eyebrow:     "Ramadan Fundraising Event — Al Faruq Islamic School",
  headlineTop: "Ramadan",
  headlineBot: "Fundraising",
  badge:       "This Friday",
  date:        "March 6, 2026  ·  Maghrib to Isha",
  venue:       "Palestine Culture Association",
  address:     "13312 142 St, Edmonton",
  speaker:     "Guest Speaker: Dr Reda Bedeir",
  description:
    "Join us for an inspiring evening of giving. Your donation sustains the school and every program we offer this community.",
  ctaText:  "Donate Now",
  ctaHref:  "https://donorchoice.ca/dia",
  videoSrc:  "/fundraiser-video.mp4",
  posterSrc: "/fundraiser-poster.jpg",
};
// ────────────────────────────────────────────────────────────────────────────

function StackedCoinsMotif() {
  // Each coin: flat ellipse top face (rx large, ry small) + two vertical side lines
  const rx = 42;   // wide face — clearly a disc, not a ring
  const ry = 8;    // very flat
  const th = 13;   // coin thickness (side wall height)

  // Three stacks: [centerX, coinCount]
  const stacks: [number, number][] = [
    [138, 3],
    [256, 6],
    [368, 4],
  ];
  const baseY = 368; // y of the bottom edge of the lowest coin

  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#C9A84C" strokeLinecap="round" strokeLinejoin="round">

        {/* Ground line */}
        <line x1="72" y1={baseY + ry} x2="430" y2={baseY + ry} strokeOpacity="0.09" strokeWidth="1" />

        {stacks.map(([cx, count], si) =>
          Array.from({ length: count }).map((_, ci) => {
            const botY = baseY - ci * th;
            const topY = botY - th;
            const op = 0.14 + (ci / count) * 0.18; // gets brighter toward top
            return (
              <g key={`${si}-${ci}`}>
                {/* Bottom face — only on the very lowest coin */}
                {ci === 0 && (
                  <ellipse cx={cx} cy={botY} rx={rx} ry={ry}
                    strokeOpacity={op * 0.55} strokeWidth="1.2" />
                )}
                {/* Left side wall */}
                <line x1={cx - rx} y1={topY} x2={cx - rx} y2={botY}
                  strokeOpacity={op} strokeWidth="1.3" />
                {/* Right side wall */}
                <line x1={cx + rx} y1={topY} x2={cx + rx} y2={botY}
                  strokeOpacity={op} strokeWidth="1.3" />
                {/* Top face */}
                <ellipse cx={cx} cy={topY} rx={rx} ry={ry}
                  strokeOpacity={op + 0.06} strokeWidth="1.4" />
              </g>
            );
          })
        )}

        {/* Sparkle dots above the tallest stack (cx=256, 6 coins) */}
        <circle cx="256" cy={baseY - 6 * th - 28} r="3"   strokeOpacity="0.24" strokeWidth="1.2" />
        <circle cx="228" cy={baseY - 6 * th - 14} r="2"   strokeOpacity="0.17" strokeWidth="1.1" />
        <circle cx="284" cy={baseY - 6 * th - 18} r="2.5" strokeOpacity="0.19" strokeWidth="1.1" />
        <circle cx="256" cy={baseY - 6 * th - 52} r="1.8" strokeOpacity="0.13" strokeWidth="1" />

      </g>
    </svg>
  );
}

interface FundraiserBannerProps {
  dismissed: boolean;
  animationStyle?: 'none' | 'particles' | 'fireworks';
  onDismiss: () => void;
}

export default function FundraiserBanner({ dismissed, animationStyle, onDismiss }: FundraiserBannerProps) {
  const donateUrl = useDonateUrl();
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMute() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.section
          className="bg-[#0A0A0A] overflow-hidden relative"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
        >
          {/* Background Effects */}
          {animationStyle && animationStyle !== 'none' && <CelebrationBackground type={animationStyle} />}

          {/* SVG background decoration */}
          <div className="absolute left-0 top-0 w-[560px] h-[560px] pointer-events-none select-none -translate-x-1/4 -translate-y-1/4">
            <StackedCoinsMotif />
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); onDismiss(); }}
            aria-label="Dismiss fundraiser banner"
            className="absolute right-5 top-4 z-20 text-white/20 hover:text-white/60 transition-colors duration-200"
          >
            <X size={15} strokeWidth={1.5} />
          </button>

          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] gap-10 lg:gap-16 items-start">

                {/* ── RIGHT — poster fully visible, video overlaps its right edge ── */}
                <motion.div
                  className="flex items-end justify-center lg:justify-end lg:order-last"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.25 }}
                >
                  {/* Poster — full portrait, slightly rotated, sits behind */}
                  <div
                    className="relative flex-shrink-0 w-[240px] rounded-xl overflow-hidden -rotate-[12deg] z-0
                      ring-1 ring-white/10 opacity-90"
                    style={{ aspectRatio: "9/16" }}
                  >
                    <Image
                      src={CONFIG.posterSrc}
                      alt="Fundraiser poster"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Video — overlaps poster right edge, sits in front */}
                  <div
                    className="relative flex-shrink-0 w-[260px] -ml-14 rounded-2xl overflow-hidden z-10
                      bg-[#111] ring-1 ring-white/15
                      shadow-[0_8px_48px_rgba(0,0,0,0.7),0_0_60px_rgba(201,168,76,0.12)]"
                    style={{ aspectRatio: "9/16" }}
                  >
                    <video
                      ref={videoRef}
                      src={CONFIG.videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Mute toggle */}
                    <button
                      onClick={toggleMute}
                      aria-label={muted ? "Unmute video" : "Mute video"}
                      className="absolute bottom-4 right-4 z-10 flex items-center justify-center
                        w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm
                        text-white/70 hover:text-white hover:bg-black/70
                        transition-colors duration-200"
                    >
                      {muted
                        ? <VolumeX size={15} strokeWidth={1.8} />
                        : <Volume2 size={15} strokeWidth={1.8} />
                      }
                    </button>
                  </div>
                </motion.div>

                {/* ── LEFT — editorial text ── */}
                <motion.div
                  className="relative z-10 lg:order-first"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
                >
                  {/* Eyebrow */}
                  <p className="text-white text-[11px] font-medium uppercase tracking-[0.3em] mb-5">
                    {CONFIG.eyebrow}
                  </p>

                  {/* Display headline */}
                  <h2
                    className="font-black text-white leading-[0.92] mb-5"
                    style={{ fontSize: "clamp(52px, 7vw, 104px)", letterSpacing: "-0.03em" }}
                  >
                    {/* "Ramadan" — curtain reveal then warm shimmer loop */}
                    <div className="overflow-hidden">
                      <motion.span
                        className="block"
                        initial={{ y: "105%" }}
                        animate={{ y: 0, color: ["#ffffff", "#F5E0A0", "#ffffff"] }}
                        transition={{
                          y:     { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                          color: { duration: 0.9, ease: "easeInOut", delay: 3.5, repeat: Infinity, repeatDelay: 4.1 },
                        }}
                      >
                        {CONFIG.headlineTop}
                      </motion.span>
                    </div>

                    {/* "Fundraising" + badge — curtain reveal then warm shimmer loop */}
                    <div className="overflow-hidden">
                      <motion.span
                        className="flex items-center gap-3 flex-wrap"
                        initial={{ y: "105%" }}
                        animate={{ y: 0, color: ["#ffffff", "#F5E0A0", "#ffffff"] }}
                        transition={{
                          y:     { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.48 },
                          color: { duration: 0.9, ease: "easeInOut", delay: 3.7, repeat: Infinity, repeatDelay: 4.1 },
                        }}
                      >
                        <span>{CONFIG.headlineBot}</span>

                        {/* "This Friday" badge — entry then glow pulse */}
                        <motion.span
                          className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black uppercase
                            px-3 py-1.5 rounded-sm align-middle"
                          style={{ fontSize: "clamp(10px, 1.3vw, 15px)", letterSpacing: "0.15em" }}
                          animate={{
                            scale:     [1, 1.06, 1],
                            boxShadow: [
                              "0 0 0px 0px rgba(201,168,76,0)",
                              "0 0 18px 4px rgba(201,168,76,0.55)",
                              "0 0 0px 0px rgba(201,168,76,0)",
                            ],
                          }}
                          transition={{
                            duration:    0.65,
                            ease:        "easeInOut",
                            delay:       2.2,
                            repeat:      Infinity,
                            repeatDelay: 2.2,
                          }}
                        >
                          {CONFIG.badge}
                        </motion.span>
                      </motion.span>
                    </div>
                  </h2>

                  {/* Date, venue, speaker */}
                  <div className="flex flex-col gap-2.5 mb-5">
                    <p className="text-white text-[13px] uppercase tracking-[0.18em] font-medium">
                      {CONFIG.date}
                    </p>
                    <p className="flex items-center gap-2 text-white text-[13px] uppercase tracking-[0.15em] font-medium">
                      <MapPin size={12} strokeWidth={1.8} className="flex-shrink-0 text-[#C9A84C]/70" />
                      {CONFIG.venue}  ·  {CONFIG.address}
                    </p>
                    <p className="text-white text-[13px] uppercase tracking-[0.15em] font-medium pl-[20px]">
                      {CONFIG.speaker}
                    </p>
                  </div>

                  {/* Rule */}
                  <div className="w-10 h-px bg-white/15 mb-6" />

                  {/* Description */}
                  <p className="text-white text-[15px] leading-relaxed max-w-md mb-8">
                    {CONFIG.description}
                  </p>

                  {/* CTA */}
                  <a
                    href={donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#C9A84C] text-white font-bold
                      text-[12px] uppercase tracking-[0.15em] px-7 py-3 rounded-full
                      hover:bg-[#C9A84C]/80 transition-colors duration-200"
                  >
                    {CONFIG.ctaText}
                    <span className="text-base leading-none">→</span>
                  </a>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
