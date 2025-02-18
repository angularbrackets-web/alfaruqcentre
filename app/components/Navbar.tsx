"use client";
import React, { useState } from "react";
import logoImage from "../../public/AlFaruqLogo.png";
import Link from "next/link";
import Image from "next/image";
import { BadgeDollarSign } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-gray-100 text-gray-900 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Desktop Logo with Brand Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-4">
          <Image
            src={logoImage}
            alt="Al-Faruq Islamic Centre Logo"
            className="object-cover w-16 sm:w-24"
            width={96}
            height={96}
          />
          <span className="text-xl sm:text-2xl font-bold hidden lg:block">
            Al-Faruq Islamic Centre
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6 text-lg lg:text-xl">
          <Link className="px-2 lg:px-4 py-2 hover:text-gray-900" href="/">
            Home
          </Link>
          <Link
            className="px-2 lg:px-4 py-2 hover:text-gray-900 whitespace-nowrap"
            href="/monthlyprayertimes"
          >
            Prayer Times
          </Link>
          <Link
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-emerald-700 whitespace-nowrap"
            href="https://www.canadahelps.org/en/dn/103035"
            target="_blank"
          >
            <BadgeDollarSign className="h-4 w-4 lg:h-6 lg:w-6" />
            <span className="hidden sm:inline">Donate</span>
          </Link>
        </div>

        {/* Mobile menu icon (hamburger) */}
        <div className="md:hidden">
          <button
            className="text-gray-500 hover:text-gray-950 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.859a1 1 0 0 1-1.414 1.414l-4.586-4.585-4.586 4.585a1 1 0 0 1-1.414-1.414l4.585-4.586-4.585-4.586a1 1 0 1 1 1.414-1.414l4.586 4.586 4.586-4.586a1 1 0 1 1 1.414 1.414l-4.586 4.586 4.586 4.586z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Remains same */}
      {/* ... (keep existing mobile menu code) ... */}
    </nav>
  );
};

export default Navbar;