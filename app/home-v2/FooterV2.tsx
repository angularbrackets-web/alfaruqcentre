"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Prayer Times", href: "/prayertimes" },
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Weekend School", href: "/weekendschool" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Now Hiring", href: "/nowhiring" },
];

const programLinks = [
  { label: "Islamic School", href: "https://www.alfaruqislamicschool.com", external: true },
  { label: "Weekend Quran School", href: "/weekendschool", external: false },
  { label: "Classical Arabic", href: "/programs", external: false },
  { label: "Summer Camp", href: "/programs", external: false },
  { label: "Ramadan Programs", href: "/programs", external: false },
];

const socialIcons = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Twitter, href: "#", label: "Twitter / X" },
];

export default function FooterV2() {
  return (
    <footer className="bg-[#0A1628] text-white">

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 – Brand */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/AlFaruqLogo.png"
                width={120}
                height={43}
                alt="Al-Faruq Islamic Centre"
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your community masjid in southwest Edmonton.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full bg-white/10 p-2 hover:bg-[#C9A84C] transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 – Quick Links */}
          <motion.div
            custom={0.1}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#C9A84C] font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul>
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors text-sm leading-8 block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 – Programs */}
          <motion.div
            custom={0.2}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#C9A84C] font-bold text-sm uppercase tracking-widest mb-4">
              Programs
            </h3>
            <ul>
              {programLinks.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm leading-8 block"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors text-sm leading-8 block"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 – Contact */}
          <motion.div
            custom={0.3}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-[#C9A84C] font-bold text-sm uppercase tracking-widest mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#C9A84C]" />
                <span>4410 127 Street SW, Edmonton, AB T6W 1A7</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-[#C9A84C]" />
                <a href="tel:+17802438811" className="hover:text-white transition-colors">
                  (780) 243-8811
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-[#C9A84C]" />
                <a
                  href="mailto:info@alfaruqcentre.com"
                  className="hover:text-white transition-colors"
                >
                  info@alfaruqcentre.com
                </a>
              </li>
            </ul>

            <div className="bg-white/5 rounded-xl p-4 mt-5">
              <p className="text-white font-semibold text-sm mb-1">🕌 Friday Jummah</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                1st: 12:30 PM &nbsp;&middot;&nbsp; 2nd: 1:30 PM &nbsp;&middot;&nbsp; 3rd: 2:30 PM
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <p className="text-gray-500 text-xs text-center sm:text-left">
            &copy; 2026 Al-Faruq Islamic Centre. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs text-center sm:text-right">
            Made with ❤️ for the Muslim community
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
