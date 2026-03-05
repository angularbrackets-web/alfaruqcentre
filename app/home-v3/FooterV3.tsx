"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useJummahTimes } from "@/app/hooks/useJummahTimes";

const programLinks = [
  { label: "Islamic School",      href: "https://www.alfaruqislamicschool.com", external: true  },
  { label: "Weekend Quran School",href: "/weekendschool",                        external: false },
  { label: "Classical Arabic",    href: "/programs",                             external: false },
  { label: "Summer Camp",         href: "/programs",                             external: false },
  { label: "Ramadan Programs",    href: "/programs",                             external: false },
];

const social = [
  { Icon: Facebook,  href: "https://www.facebook.com/alfaruqcentre",       label: "Facebook"  },
  { Icon: Instagram, href: "https://www.instagram.com/alfaruqcentre/",     label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@alfaruqislamiccentre",label: "YouTube"   },
];

export default function FooterV3() {
  const jummahTimes = useJummahTimes();
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top — logo + tagline + social */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-16 pb-10 border-b border-white/8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div>
            <Link href="/home-v3" className="inline-block mb-4">
              <Image
                src="/AlFaruqLogo.png"
                width={140}
                height={50}
                alt="Al-Faruq Islamic Centre"
                className="object-contain"
              />
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              A place to pray, learn, grow and belong.<br />
              Southwest Edmonton&apos;s Muslim community centre.
            </p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium mr-2">
              Follow
            </span>
            {social.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/35 hover:text-white transition-colors duration-200"
              >
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Mid — 3-col links + contact */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-10 py-12 border-b border-white/8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {/* Programs */}
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-medium mb-5">
              Programs
            </p>
            <ul className="flex flex-col gap-3">
              {programLinks.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white text-sm transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-medium mb-5">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/50">
              <p>4410 127 Street SW</p>
              <p>Edmonton, AB T6W 1A7</p>
              <a href="tel:+17802438811" className="hover:text-white transition-colors duration-200">
                (780) 243-8811
              </a>
              <a
                href="mailto:info@alfaruqcentre.com"
                className="hover:text-white transition-colors duration-200"
              >
                info@alfaruqcentre.com
              </a>
            </div>
          </div>

          {/* Jummah */}
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-medium mb-5">
              Friday Jummah
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {jummahTimes.map((j) => (
                <div key={j.name} className="flex items-center gap-3 text-white/50">
                  <span className="w-6 text-white/30">{j.label.split(" ")[0]}</span>
                  <span className="text-white font-semibold">{j.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="py-6 flex flex-col sm:flex-row justify-between items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-white/20 text-xs">
            &copy; 2026 Al-Faruq Islamic Centre. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Edmonton, Alberta, Canada
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
