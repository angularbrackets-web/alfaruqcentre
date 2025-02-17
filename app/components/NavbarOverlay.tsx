"use client";
// Navbar Component (NavbarOverlay.tsx)
import { useState, useEffect } from 'react';

export default function NavbarOverlay() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50); // Adjust scroll threshold as needed
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-20 ${
        isSticky ? 'bg-white text-gray-800 shadow-md' : 'bg-transparent text-white'
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a className="text-2xl font-bold" href="/">Logo</a>
        <div className="hidden md:flex space-x-6">
          <a className="px-4 py-2 font-medium hover:underline" href="#">Home</a>
          <a className="px-4 py-2 font-medium hover:underline" href="#">About</a>
          <a className="px-4 py-2 font-medium hover:underline" href="#">Services</a>
          <a className="px-4 py-2 font-medium hover:underline" href="#">Contact</a>
        </div>
        {/* Mobile menu icon */}
      </div>
    </nav>
  );
}