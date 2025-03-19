"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeDollarSign, MapPin, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (e.target.closest('[data-menu-container]')) return;
      setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-gray-50/95 py-4"
        } backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/AlFaruqLogo.png"
                  alt="Al-Faruq Islamic Centre Logo"
                  width={96}
                  height={96}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain"
                  priority
                />
              </Link>
              <div className="ml-2 flex flex-col">
                <Link href="/">
                  <h1 className="text-lg md:text-xl font-bold text-sky-800 hidden sm:block">
                    Al-Faruq Islamic Centre
                  </h1>
                </Link>
                <div className="flex items-center text-xs text-gray-600 hover:text-sky-700 transition-colors">
                  <Link 
                    href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    aria-label="View our location on Google Maps"
                  >
                    <MapPin className="h-3 w-3" />
                    <span className="inline">4410 127 Street SW, Edmonton, AB</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-4">
            <NavLink href="/">HOME</NavLink>
            <NavLink href="/monthlyprayertimes">PRAYER TIMES</NavLink>
            <NavLink href="/programs">PROGRAMS</NavLink>
            <NavLink href="/weekendschool">WEEKEND SCHOOL</NavLink>
            <DonateButton />
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-[100] lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation Slide-in Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white shadow-xl z-[110] transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        data-menu-container
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/AlFaruqLogo.png"
                alt="Al-Faruq Islamic Centre Logo"
                width={64}
                height={64}
                className="w-12 h-12 object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="focus:outline-none"
              aria-label="Close navigation menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col pt-6 pb-8 px-6 space-y-6">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/monthlyprayertimes" onClick={() => setMobileMenuOpen(false)}>
              Prayer Times
            </MobileNavLink>
            <MobileNavLink href="/programs" onClick={() => setMobileMenuOpen(false)}>
              Programs
            </MobileNavLink>
            <MobileNavLink href="/weekendschool" onClick={() => setMobileMenuOpen(false)}>
              Weekend School
            </MobileNavLink>
            <div className="pt-4">
              <DonateButton mobile />
            </div>
          </div>

          <div className="mt-auto p-6 border-t">
            <Link 
              href="https://maps.app.goo.gl/KfLGQr2edcRhsGqu5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-600 hover:text-sky-800"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="inline">4410 127 Street SW, Edmonton, AB</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable components
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link 
    href={href}
    className="px-3 py-2 text-sm text-sky-800 font-medium hover:text-sky-500 hover:font-black transition-colors relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
  </Link>
);

interface MobileNavLinkProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ href, onClick, children }: MobileNavLinkProps) => (
  <Link 
    href={href}
    onClick={onClick}
    className="text-lg font-medium text-gray-800 hover:text-sky-800 transition-colors"
  >
    {children}
  </Link>
);

interface DonateButtonProps {
  mobile?: boolean;
}

const DonateButton = ({ mobile }: DonateButtonProps) => (
  <Link
    href="https://www.canadahelps.org/en/dn/103035"
    target="_blank"
    rel="noopener noreferrer"
    className={`
      flex items-center justify-center gap-2 
      bg-emerald-600 hover:bg-emerald-700 
      text-white font-medium 
      rounded-lg transition-colors 
      ${mobile ? "w-full py-3 text-base" : "px-4 py-2 text-sm"}
    `}
    aria-label="Donate to Al-Faruq Islamic Centre"
  >
    <BadgeDollarSign className={mobile ? "h-5 w-5" : "h-4 w-4"} />
    <span>Donate</span>
  </Link>
);

export default Navbar;
