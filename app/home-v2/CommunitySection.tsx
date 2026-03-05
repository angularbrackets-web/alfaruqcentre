"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PhotoItem {
  src: string;
  alt: string;
  colSpan?: number;
  rowSpan?: number;
}

const photos: PhotoItem[] = [
  {
    src: "/Al.FaruqPrayerHall.jpeg",
    alt: "Al-Faruq Prayer Hall",
    colSpan: 1,
    rowSpan: 2,
  },
  {
    src: "/AlFaruq.EidAlAdha.Prayer2025.jpeg",
    alt: "Eid Al-Adha Prayer 2025",
  },
  {
    src: "/AlFaruq.KhatimalQuran.jpeg",
    alt: "Khatimal Quran Ceremony",
  },
  {
    src: "/AFIS.SummerCamp.2025.jpeg",
    alt: "AFIS Summer Camp 2025",
  },
  {
    src: "/EidAlFitrPrayer2025.jpeg",
    alt: "Eid Al-Fitr Prayer 2025",
  },
  {
    src: "/AlFaruqRamadanPrograms2025.jpeg",
    alt: "Ramadan Programs 2025",
  },
  {
    src: "/AlFaruq.Weekend.Quran.School.March2025.jpeg",
    alt: "Weekend Quran School",
    colSpan: 2,
  },
  {
    src: "/RamadanFundraiser2025.jpeg",
    alt: "Ramadan Fundraiser 2025",
  },
];

interface PhotoCardProps {
  photo: PhotoItem;
  index: number;
}

function PhotoCard({ photo, index }: PhotoCardProps) {
  const colSpanClass = photo.colSpan === 2 ? "md:col-span-2" : "";
  const rowSpanClass = photo.rowSpan === 2 ? "row-span-2" : "";
  const heightClass =
    photo.rowSpan === 2 ? "h-80 md:h-full min-h-[400px]" : "h-52 md:h-56";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.07 }}
      className={`${colSpanClass} ${rowSpanClass} group relative ${heightClass} overflow-hidden rounded-2xl cursor-pointer`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#0F1E3D]/0 group-hover:bg-[#0F1E3D]/50 transition-all duration-400 rounded-2xl flex items-end p-4">
        <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md leading-snug">
          {photo.alt}
        </p>
      </div>
    </motion.div>
  );
}

export default function CommunitySection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A6E]">Our Community</h2>
          <div className="mx-auto mt-3 w-16 h-1 rounded-full bg-[#C9A84C]" />
          <p className="mt-5 text-gray-500 text-base sm:text-lg">
            Moments from the Al-Faruq family
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <PhotoCard key={photo.src} photo={photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
