// components/Footer.tsx
import React from 'react';
import Image from 'next/image';
import logoImage from "../../public/AlFaruqLogo.png";
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
          <Link href="/">
          <Image
            src={logoImage}
            alt="Al-Faruq Islamic Centre Logo"
            className="object-cover w-16 sm:w-24"
            width={128}
            height={128}
          />
          </Link>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Al Faruq Islamic Centre</h2>
            <ul>
              <li>Address:</li>
              <li>4410 127 Street SW, Edmonton, Alberta T6W 1A7</li>
              <li></li>
              <li>Email:</li>
              <li>info@alfaruqcentre.com</li>
              <li>Phone:</li>
              <li>(780) 243-8811</li>
            </ul>
          </div>
          <div className="flex space-x-6">
            {/* <Link href="/about" className="hover:text-gray-400">
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
            </Link> */}
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
