"use client";

import { motion } from "framer-motion";

export default function MissionQuoteBlock() {
  return (
    <section className="bg-[#0A0A0A] py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white font-black leading-tight"
          style={{ fontSize: "clamp(32px, 5.5vw, 72px)", letterSpacing: "-0.02em" }}
        >
          {/* Line 1 */}
          <span className="block">A place to</span>
          {/* Line 2 — highlighted words */}
          <span className="block">
            {["pray", "learn", "grow"].map((word) => (
              <span
                key={word}
                className="inline-block px-3 py-1 border-2 border-white text-white
                  text-[0.75em] align-middle mx-1 rounded-sm font-black uppercase tracking-wide"
                style={{ lineHeight: 1.2 }}
              >
                {word}
              </span>
            ))}
            <span className="mx-2 text-white/40">&amp;</span>
            <span
              className="inline-block px-3 py-1 border-2 border-[#C9A84C] text-[#C9A84C]
                text-[0.75em] align-middle mx-1 rounded-sm font-black uppercase tracking-wide"
              style={{ lineHeight: 1.2 }}
            >
              belong
            </span>
          </span>
        </motion.blockquote>

        {/* Attribution */}
        <motion.p
          className="mt-10 text-white/25 text-xs uppercase tracking-[0.35em] font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Al-Faruq Islamic Centre · Edmonton, Alberta
        </motion.p>
      </div>
    </section>
  );
}
