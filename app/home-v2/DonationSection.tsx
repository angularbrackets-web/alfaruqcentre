"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const impactStats = [
  {
    icon: "🕌",
    title: "Supporting Daily Operations",
    desc: "5 prayers daily, year-round",
  },
  {
    icon: "📚",
    title: "Educating 200+ Children",
    desc: "Islamic school & weekend programs",
  },
  {
    icon: "🤲",
    title: "Building Community",
    desc: "Events, programs, and support",
  },
];

const geometricPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")`;

export default function DonationSection() {
  return (
    <section
      className="relative bg-[#0F1E3D] overflow-hidden"
      style={{ backgroundImage: geometricPattern }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Part A: Quranic Verse */}
        <div className="pt-20 pb-10">
          <motion.p
            className="text-3xl md:text-4xl text-white leading-loose font-light"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              direction: "rtl",
              textAlign: "right",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ
          </motion.p>

          <motion.p
            className="text-white/70 text-lg md:text-xl text-center italic mt-6"
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            &ldquo;And spend in the way of Allah and do not throw yourselves with your own hands
            into destruction&hellip;&rdquo;
          </motion.p>

          <motion.p
            className="text-[#C9A84C] text-sm font-medium mt-2"
            custom={0.45}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            — Al-Quran 2:195
          </motion.p>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent mt-10"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Part B: Hadith Quote */}
        <motion.div
          className="bg-white/5 rounded-3xl mx-auto max-w-3xl p-8"
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <span
            className="text-[#C9A84C] text-6xl leading-none font-serif block mb-2"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="text-white text-lg md:text-xl font-light italic leading-relaxed text-center">
            Whoever builds a mosque for the sake of Allah — even if it is as small as a
            bird&apos;s nest — Allah will build for him a house in Paradise.
          </p>
          <p className="text-[#C9A84C] text-sm mt-4 text-center">
            — Sahih al-Bukhari &amp; Muslim
          </p>
        </motion.div>

        {/* Part C: Impact Stats */}
        <div className="mt-16">
          <motion.p
            className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-8"
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            Your Impact
          </motion.p>

          <div className="flex flex-col md:flex-row gap-6 mx-auto max-w-4xl">
            {impactStats.map((stat, i) => (
              <motion.div
                key={stat.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex-1"
                custom={0.1 * (i + 1)}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <span className="text-4xl block mb-3" aria-hidden="true">
                  {stat.icon}
                </span>
                <p className="text-white font-bold text-base mb-1">{stat.title}</p>
                <p className="text-white/60 text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part D: Donation CTA */}
        <div className="pb-20 mt-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            Support Your Masjid Today
          </motion.h2>

          <motion.p
            className="text-white/70 text-lg mb-10 max-w-2xl mx-auto"
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            Your generosity keeps Al-Faruq Islamic Centre running for the entire community.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.a
              href="https://donorchoice.ca/dia"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A84C] text-[#0F1E3D] font-bold rounded-full px-10 py-4 text-lg inline-block"
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Donate via CanadaHelps
            </motion.a>

            <motion.a
              href="/prayertimes"
              className="border border-white/40 text-white font-semibold rounded-full px-8 py-4 text-base inline-block hover:border-white hover:bg-white/10 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Tax Credit Calculator →
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
