"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const DONATE_URL = "https://donorchoice.ca/dia/1183";

export default function EidSalahPosterPage() {
  return (
    <>
      <style>{`
        @media screen {
          body {
            background: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 2rem;
          }
        }
        @media print {
          @page { size: 4in 6in; margin: 0; }
          body { background: white !important; display: block; padding: 0; margin: 0; }
          .print-hidden { display: none !important; }
        }
      `}</style>

      <button
        onClick={() => window.print()}
        className="print-hidden fixed top-4 right-4 z-50 bg-[#0A0A0A] text-white text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-[#C9A84C] transition-colors duration-200"
      >
        Print Card
      </button>

      {/* Card — 384×600px = 4×6in at 96dpi */}
      <div
        className="relative overflow-hidden shadow-2xl flex flex-col"
        style={{ width: "384px", height: "600px", fontFamily: "Inter, system-ui, sans-serif" }}
      >

        {/* ── WHITE HEADER (95px) ── */}
        <div
          className="bg-white flex-shrink-0 px-5 pt-3 pb-4 border-b border-[#0A0A0A]/8"
          style={{ height: "112px" }}
        >
          {/* Logos row */}
          <div className="flex items-center justify-between gap-2 mb-2.5" style={{ height: "58px" }}>
            <div className="flex items-center h-full">
              <Image
                src="/AlFaruqLogo-2.png"
                alt="Al-Faruq Islamic Centre"
                width={155}
                height={56}
                className="object-contain h-full w-auto"
                style={{ maxHeight: "56px" }}
              />
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-px h-4 bg-[#C9A84C]/40" />
              <span className="text-[#C9A84C] text-[9px] font-black">×</span>
              <div className="w-px h-4 bg-[#C9A84C]/40" />
            </div>
            <div className="flex items-center h-full">
              <Image
                src="/SahAbaMosqueLogo.png"
                alt="Sahaba Mosque — Downtown Islamic Association"
                width={125}
                height={52}
                className="object-contain h-full w-auto"
                style={{ maxHeight: "52px" }}
              />
            </div>
          </div>

          {/* Single unified event badge */}
          <div className="flex justify-center">
            <span className="bg-[#0A0A0A] text-white text-[8.5px] font-black uppercase tracking-[0.2em] px-6 py-1.5 rounded-sm">
              United Ummah Eid Salah
            </span>
          </div>
        </div>

        {/* ── CREAM EVENT INFO (180px) ── */}
        <div
          className="bg-[#F5F3EE] flex-shrink-0 px-6 py-5"
          style={{ height: "180px" }}
        >
          {/* Date */}
          <p
            className="text-[#0A0A0A] font-black text-[17px] text-center mb-3 leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Wednesday, 27 May 2026
          </p>

          {/* Gold divider */}
          <div
            className="w-full h-px mb-3"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C60, #C9A84C, #C9A84C60, transparent)" }}
          />

          {/* NORTH location */}
          <div className="flex gap-2 items-start mb-2">
            <span className="bg-[#0A0A0A] text-white text-[5.5px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm flex-shrink-0 mt-0.5">
              NORTH
            </span>
            <div>
              <span className="text-[#C9A84C] text-[9px] font-black">8:00 AM</span>
              <span className="text-[#0A0A0A]/40 text-[9px] mx-1.5">·</span>
              <span className="text-[#0A0A0A] font-black text-[9px]">Edmonton EXPO Centre — Hall B</span>
              <p className="text-[#0A0A0A]/45 text-[8px] leading-tight mt-0.5">7515 118 Ave NW, Edmonton</p>
            </div>
          </div>

          {/* Subtle separator */}
          <div className="ml-9 h-px bg-[#0A0A0A]/8 mb-2" />

          {/* SOUTH location */}
          <div className="flex gap-2 items-start">
            <span className="bg-[#0A0A0A] text-white text-[5.5px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm flex-shrink-0 mt-0.5">
              SOUTH
            </span>
            <div>
              <span className="text-[#C9A84C] text-[9px] font-black">7:30 AM</span>
              <span className="text-[#0A0A0A]/40 text-[9px] mx-1.5">·</span>
              <span className="text-[#0A0A0A] font-black text-[9px]">Turf Training Centre 4</span>
              <p className="text-[#0A0A0A]/45 text-[8px] leading-tight mt-0.5">1030 34 Ave, Nisku</p>
            </div>
          </div>
        </div>

        {/* ── WHITE DONATION (flex-1 = 325px) ── */}
        <div className="bg-[#F5F3EE] flex-1 flex flex-col items-center justify-center px-6 relative">

          {/* Top rule */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, #C9A84C50, #C9A84C70, #C9A84C50, transparent)" }}
          />

          <p className="text-[#C9A84C] text-[7.5px] font-black uppercase tracking-[0.28em] mb-5 text-center">
            Please donate towards a noble cause
          </p>

          {/* QR code with gold gradient border */}
          <div
            className="p-[3px] rounded-lg mb-5"
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

          <p className="text-[#0A0A0A]/25 text-[7.5px] uppercase tracking-[0.18em]">
            donorchoice.ca/dia/1183
          </p>
        </div>

      </div>
    </>
  );
}
