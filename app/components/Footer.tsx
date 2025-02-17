// components/Footer.tsx
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Al Faruq Islamic Centre</h2>
            <p className="text-sm">Uniting the community through faith and service.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-gray-400">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
            <Link href="/events" className="hover:text-gray-400">
              Events
            </Link>
            <Link href="/donate" className="hover:text-gray-400">
              Donate
            </Link>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Masjid Al-Faruq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
