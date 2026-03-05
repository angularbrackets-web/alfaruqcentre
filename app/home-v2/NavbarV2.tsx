"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavbarV2Props {
  isHeroPage?: boolean;
}

interface PrayerTimeEntry {
  name: string;
  iqamah: string;
}

const PRAYER_TIMES: PrayerTimeEntry[] = [
  { name: "Fajr", iqamah: "5:41" },
  { name: "Dhuhr", iqamah: "1:00" },
  { name: "Asr", iqamah: "4:00" },
  { name: "Maghrib", iqamah: "6:18" },
  { name: "Isha", iqamah: "8:12" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prayertimes", label: "Prayer Times" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/weekendschool", label: "Weekend School" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/nowhiring", label: "Now Hiring", isHighlighted: true },
] as const;

const HIJRI_DATE = "4 Sha\u2019ban 1447";

// ---------------------------------------------------------------------------
// Utility Top Bar
// ---------------------------------------------------------------------------

const UtilityBar = memo(function UtilityBar() {
  return (
    <div className="bg-[#0F1E3D] py-2 px-4 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Prayer times — scrollable horizontally on mobile */}
        <div className="flex items-center overflow-x-auto hide-scrollbar flex-shrink-0 min-w-0">
          {PRAYER_TIMES.map((pt, idx) => (
            <React.Fragment key={pt.name}>
              <span className="text-white/80 text-xs font-medium whitespace-nowrap">
                {pt.name}{" "}
                <span className="text-white font-semibold">{pt.iqamah}</span>
              </span>
              {idx < PRAYER_TIMES.length - 1 && (
                <span className="text-white/40 mx-2 text-xs select-none">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Hijri date — center, desktop only */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <span className="text-white/70 text-xs tracking-wide">{HIJRI_DATE}</span>
        </div>

        {/* Contact info — desktop only */}
        <div className="hidden md:flex items-center gap-4 text-white/80 text-xs flex-shrink-0">
          <a
            href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <MapPin size={12} className="flex-shrink-0" />
            <span>4410 127 St SW, Edmonton</span>
          </a>
          <span className="text-white/40 select-none">|</span>
          <a href="tel:+17802438811" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone size={12} className="flex-shrink-0" />
            <span>(780) 243-8811</span>
          </a>
          <span className="text-white/40 select-none">|</span>
          <a
            href="mailto:info@alfaruqcentre.com"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Mail size={12} className="flex-shrink-0" />
            <span>info@alfaruqcentre.com</span>
          </a>
        </div>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Desktop NavLink
// ---------------------------------------------------------------------------

interface DesktopNavLinkProps {
  href: string;
  label: string;
  isHighlighted?: boolean;
  isScrolled: boolean;
}

const DesktopNavLink = memo(function DesktopNavLink({
  href,
  label,
  isHighlighted,
  isScrolled,
}: DesktopNavLinkProps) {
  const baseText = isScrolled ? "text-gray-700" : "text-white";
  const highlightText = "text-[#C9A84C]";
  const underlineColor = isHighlighted
    ? "bg-[#C9A84C]"
    : isScrolled
    ? "bg-gray-700"
    : "bg-white";

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors duration-300 group py-1 ${
        isHighlighted ? highlightText : baseText
      }`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 w-full h-[2px] ${underlineColor}
          transform scale-x-0 group-hover:scale-x-100
          transition-transform duration-300 origin-left`}
      />
    </Link>
  );
});

// ---------------------------------------------------------------------------
// Mobile Drawer NavLink
// ---------------------------------------------------------------------------

interface MobileNavLinkProps {
  href: string;
  label: string;
  isHighlighted?: boolean;
  onClick: () => void;
}

const MobileNavLink = memo(function MobileNavLink({
  href,
  label,
  isHighlighted,
  onClick,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-lg font-medium transition-colors py-3 border-b border-white/10 block ${
        isHighlighted ? "text-[#C9A84C]" : "text-white/90 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
});

// ---------------------------------------------------------------------------
// Donate Button
// ---------------------------------------------------------------------------

const DonateButton = memo(function DonateButton({ mobile }: { mobile?: boolean }) {
  return (
    <Link
      href="https://donorchoice.ca/dia"
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-[#C9A84C] text-white font-semibold rounded-full
        transition-all duration-200 hover:brightness-110 hover:scale-105
        ${mobile ? "w-full text-center py-3 text-base block" : "px-5 py-2 text-sm"}`}
    >
      Donate
    </Link>
  );
});

// ---------------------------------------------------------------------------
// NavbarV2
// ---------------------------------------------------------------------------

export default function NavbarV2({ isHeroPage = false }: NavbarV2Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const startTransparent = isHeroPage;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navBg =
    startTransparent && !isScrolled
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-md shadow-sm";

  return (
    <>
      <UtilityBar />

      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <Image
              src="/AlFaruqLogo.png"
              width={140}
              height={50}
              alt="Al-Faruq Islamic Centre"
              className="object-contain h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isHighlighted={"isHighlighted" in link ? link.isHighlighted : false}
                isScrolled={!startTransparent || isScrolled}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <DonateButton />
            </div>
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu
                size={24}
                className={startTransparent && !isScrolled ? "text-white" : "text-gray-700"}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="drawer"
            className="fixed top-0 right-0 h-full w-72 bg-[#0F1E3D] z-[110] md:hidden flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <Link href="/" onClick={closeMobile}>
                <Image
                  src="/AlFaruqLogo.png"
                  width={100}
                  height={36}
                  alt="Al-Faruq Islamic Centre"
                  className="object-contain h-10 w-auto"
                />
              </Link>
              <button
                onClick={closeMobile}
                className="focus:outline-none"
                aria-label="Close menu"
              >
                <X size={24} className="text-white/80 hover:text-white transition-colors" />
              </button>
            </div>

            <div className="flex flex-col px-6 pt-4 pb-8 overflow-y-auto flex-1">
              {NAV_LINKS.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isHighlighted={"isHighlighted" in link ? link.isHighlighted : false}
                  onClick={closeMobile}
                />
              ))}
              <div className="pt-6">
                <DonateButton mobile />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10">
              <a
                href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 text-sm hover:text-white/90 transition-colors"
              >
                <MapPin size={14} />
                <span>4410 127 St SW, Edmonton</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
