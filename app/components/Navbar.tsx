"use client";
import React, { useState } from 'react';
import logoImage from '../../public/AlFaruqLogo.png';
import Link from "next/link";
import Image from "next/image";


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-blue-600 text-white backdrop-blur-sm z-10">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      {/* Desktop Logo */}
      <Link href="/">
  <div className="relative h-16 w-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
    <Image
      src={logoImage}
      alt="Al-Faruq Islamic Centre Logo"
      fill
      className="object-cover"
    />
  </div>
</Link>
      <div className="hidden md:flex space-x-6 text-xl">
        <a className="px-4 py-2 hover:text-gray-900" href="#">Home</a>
        <a className="px-4 py-2 hover:text-gray-900" href="#">About</a>
        <a className="px-4 py-2 hover:text-gray-900" href="#">Services</a>
        <a className="px-4 py-2 hover:text-gray-900" href="#">Contact</a>
      </div>
      {/* Mobile menu icon (hamburger) */}
      <div className="md:hidden">
        <button className="text-gray-50 hover:text-gray-300 focus:outline-none focus:text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.859a1 1 0 0 1-1.414 1.414l-4.586-4.585-4.586 4.585a1 1 0 0 1-1.414-1.414l4.585-4.586-4.585-4.586a1 1 0 1 1 1.414-1.414l4.586 4.586 4.586-4.586a1 1 0 1 1 1.414 1.414l-4.586 4.586 4.586 4.586z" />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
            )}
          </svg>
        </button>
      </div>
    </div>
    {/* Mobile Menu */}
    <div className={`md:hidden ${mobileMenuOpen ? 'fixed top-0 left-0 w-full h-screen bg-gray-50 z-20 flex flex-col items-center pt-8' : 'hidden'}`}>
      {/* Close Button - Top Right */}
      <div className="absolute top-6 right-6">
        <button className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.859a1 1 0 0 1-1.414 1.414l-4.586-4.585-4.586 4.585a1 1 0 0 1-1.414-1.414l4.585-4.586-4.585-4.586a1 1 0 1 1 1.414-1.414l4.586 4.586 4.586-4.586a1 1 0 1 1 1.414 1.414l-4.586 4.586 4.586 4.586z" />
          </svg>
        </button>
      </div>
      {/* Mobile Logo - Centered */}
      <div className="mb-12">
        <Link className="text-2xl font-bold text-gray-800" href="/">
          <Image src={logoImage.src} alt="Al-Faruq Islamic Centre Logo" className="h-16" />
        </Link>
      </div>
      {/* Mobile Menu Links - Vertically Centered */}
      <div className="space-y-4 text-center">
        <a className="block text-xl text-gray-700 hover:text-gray-900 font-medium" href="#">Home</a>
        <a className="block text-xl text-gray-700 hover:text-gray-900 font-medium" href="#">About</a>
        <a className="block text-xl text-gray-700 hover:text-gray-900 font-medium" href="#">Services</a>
        <a className="block text-xl text-gray-700 hover:text-gray-900 font-medium" href="#">Contact</a>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;