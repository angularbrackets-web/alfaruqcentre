"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const DONATE_URL =
  "https://fundraise.islamicreliefcanada.org/en_US/campaign/support-sahaba-and-al-faruq-mosque-3952#attr=";

// Subtle crescent + star illustration for the card body
function CrescentAccent() {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <g stroke="#C9A84C" strokeOpacity="0.12" strokeWidth="1">
        {/* Crescent moon */}
        <path d="M 150,60 A 80,80 0 1,1 150,220 A 55,55 0 1,0 150,60 Z" />
        {/* Stars */}
        <circle cx="210" cy="80" r="2.5" fill="#C9A84C" fillOpacity="0.15" stroke="none" />
        <circle cx="230" cy="130" r="1.8" fill="#C9A84C" fillOpacity="0.12" stroke="none" />
        <circle cx="80" cy="100" r="2" fill="#C9A84C" fillOpacity="0.1" stroke="none" />
        <circle cx="60" cy="160" r="1.5" fill="#C9A84C" fillOpacity="0.08" stroke="none" />
        <circle cx="240" cy="190" r="2" fill="#C9A84C" fillOpacity="0.1" stroke="none" />
        <circle cx="190" cy="230" r="1.5" fill="#C9A84C" fillOpacity="0.08" stroke="none" />
        <circle cx="100" cy="240" r="2.2" fill="#C9A84C" fillOpacity="0.1" stroke="none" />
        {/* Radiating arcs */}
        <path d="M 150,40 A 110,110 0 0,1 260,150" strokeOpacity="0.06" />
        <path d="M 150,20 A 130,130 0 0,1 280,150" strokeOpacity="0.04" />
      </g>
    </svg>
  );
}

export default function QRCardPage() {
  return (
    <>
      {/* Screen: center the card on a neutral background */}
      <style>{`
        @media screen {
          body { background: #e5e7eb; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 2rem; }
        }
        @media print {
          @page { size: 4in 6in; margin: 0; }
          body { background: white !important; display: block; padding: 0; margin: 0; }
          .print-hidden { display: none !important; }
        }
      `}</style>

      {/* Print button — hidden when printing */}
      <button
        onClick={() => window.print()}
        className="print-hidden fixed top-4 right-4 z-50 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-[#C9A84C] transition-colors duration-200"
      >
        Print Card
      </button>

      {/* THE CARD — 384×600px (4×6.25in) portrait */}
      <div
        className="relative overflow-hidden shadow-2xl flex flex-col"
        style={{
          width: "384px",
          height: "600px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >

        {/* ── WHITE HEADER ── */}
        <div className="bg-white px-6 pt-5 pb-4 relative overflow-hidden border-b border-[#0A0A0A]/8 flex-shrink-0">

          {/* Subtle geometric lines */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg viewBox="0 0 384 200" className="w-full h-full" fill="none">
              <line x1="0" y1="0" x2="384" y2="200" stroke="#0A0A0A" strokeWidth="0.5" />
              <line x1="384" y1="0" x2="0" y2="200" stroke="#0A0A0A" strokeWidth="0.5" />
              <circle cx="192" cy="100" r="90" stroke="#0A0A0A" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Logos row */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center" style={{ height: "72px" }}>
              <Image
                src="/AlFaruqLogo-2.png"
                alt="Al-Faruq Islamic Centre"
                width={180}
                height={72}
                className="object-contain h-full w-auto"
                style={{ maxHeight: "72px" }}
              />
            </div>

            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-px h-6 bg-[#0A0A0A]/15" />
              <span className="text-[#C9A84C] text-[7px] font-bold uppercase tracking-[0.18em] text-center leading-tight" style={{ whiteSpace: "nowrap" }}>
                in<br/>partnership
              </span>
              <div className="w-px h-6 bg-[#0A0A0A]/15" />
            </div>

            <div className="flex items-center" style={{ height: "44px" }}>
              <Image
                src="/IslamicReliefCanadaLogo.png"
                alt="Islamic Relief Canada"
                width={110}
                height={44}
                className="object-contain h-full w-auto"
                style={{ maxHeight: "44px" }}
              />
            </div>
          </div>

          {/* Campaign badge */}
          <div className="relative z-10 flex justify-center mb-3">
            <span className="bg-[#0A0A0A] text-white text-[8.5px] font-black uppercase tracking-[0.22em] px-3 py-1 rounded-sm">
              Matching Gift Campaign
            </span>
          </div>

          {/* Tagline */}
          <div className="relative z-10 border-t border-[#0A0A0A]/8 pt-3">
            <p className="text-[#0A0A0A]/65 text-[9.5px] leading-snug text-center mb-1">
              <span className="text-[#0A0A0A] font-black">Al-Faruq Islamic School</span> is expanding
              to build a new, state-of-the-art school complex to protect and educate the next
              generation, and they need your help.
            </p>
            <p className="text-[#0A0A0A] font-black text-center text-[10.5px]" style={{ letterSpacing: "-0.01em" }}>
              Be the reason a child learns their Deen.
            </p>
          </div>
        </div>

        {/* ── CREAM BODY ── */}
        <div className="bg-[#F5F3EE] flex-1 relative overflow-hidden">

          {/* Crescent illustration */}
          <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none select-none opacity-50">
            <CrescentAccent />
          </div>

          {/* Content: two groups pushed to top and bottom, with QR centered */}
          <div className="relative z-10 flex flex-col items-center h-full px-6 py-5">

            {/* Top group: scan label + QR */}
            <div className="flex flex-col items-center">
              <p className="text-[#C9A84C] text-[8.5px] font-black uppercase tracking-[0.3em] mb-3">
                Scan to Donate
              </p>

              <div
                className="p-[3px] rounded-lg"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)" }}
              >
                <div className="bg-white p-3 rounded-md">
                  <QRCodeSVG
                    value={DONATE_URL}
                    size={150}
                    bgColor="#FFFFFF"
                    fgColor="#0A0A0A"
                    level="M"
                    marginSize={0}
                  />
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom group: divider + text + button + URL */}
            <div className="flex flex-col items-center w-full">
              <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, transparent, #C9A84C50, #C9A84C90, #C9A84C50, transparent)" }} />

              <div className="border-2 border-[#0A0A0A] rounded-xl px-5 py-2 mb-1.5">
                <p className="text-[#0A0A0A] font-black text-center text-[13px] leading-tight" style={{ letterSpacing: "-0.01em" }}>
                  Your $2 becomes $3.
                </p>
              </div>

              <p className="text-[#0A0A0A]/60 text-center leading-snug mb-4 text-[10px]">
                For every $2 donated, Islamic Relief Canada will match an
                additional $1. Donate today and make an impact.
              </p>

              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A0A0A] text-white font-bold rounded-full px-7 py-2 text-[9px] uppercase tracking-[0.15em] hover:bg-[#C9A84C] transition-colors duration-200 inline-block text-center mb-4"
              >
                Donate Now →
              </a>

              <p className="text-[#0A0A0A]/25 text-[7.5px] uppercase tracking-[0.2em]">
                alfaruqcentre.com
              </p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
