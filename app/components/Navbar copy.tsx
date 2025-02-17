import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="relative w-full bg-blue-500 pb-16 min-h-[120px]">
      {/* Nav bar content centered, but header itself is full width */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-white text-2xl font-bold">MyLogo</div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" legacyBehavior>
              <a className="text-white hover:underline">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about" legacyBehavior>
              <a className="text-white hover:underline">About</a>
            </Link>
          </li>
          <li>
            <Link href="/services" legacyBehavior>
              <a className="text-white hover:underline">Services</a>
            </Link>
          </li>
          <li>
            <Link href="/contact" legacyBehavior>
              <a className="text-white hover:underline">Contact</a>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Full-width wavy bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20 sm:h-24 md:h-32"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFFFF"
            d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,234.7C840,256,960,256,1080,224C1200,192,1320,128,1380,96L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,920C840,620,620,620,30,620L0,620Z"
          />
        </svg>
      </div>
    </header>
  );
};

export default Navbar;
