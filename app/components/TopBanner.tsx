"use client"; // Ensures this runs as a client component

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const TopBanner = ({ iconSize = 24, iconCount = 10 }) => {
  const [iconPositions, setIconPositions] = useState<{ top: number; left: number }[]>([]);

  useEffect(() => {
    // Only generate random positions on the client to avoid hydration mismatch
    const positions = Array.from({ length: iconCount }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setIconPositions(positions);
  }, [iconCount]);

  return (
    <div className="relative bg-[#f0f4f8] py-2 px-4 flex items-center justify-center text-sm md:text-[1.5rem] bg-yellow-400 mb-8 overflow-hidden">
      {/* Render icons only after they have been set to avoid hydration issues */}
      {iconPositions.length > 0 &&
        iconPositions.map(({ top, left }, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: "translate(-50%, -50%)",
              opacity: 0.15,
            }}
            animate={{
              x: [Math.random() * 20 - 10, Math.random() * 20 - 10],
              y: [Math.random() * 20 - 10, Math.random() * 20 - 10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <DollarSign size={iconSize} color="#0070f3" />
          </motion.div>
        ))}

      {/* External link */}
      <a
        href="https://donorchoice.ca/dia"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex flex-col md:flex-row items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105 hover:bg-gray-800 no-underline font-bold z-10"
        aria-label="External link: Pay Zakat Al Fitr"
      >
        {/* Left GIF */}
        <Image
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2h4YWFucWg4cjQ4ZjB5MnUzNmIxZmZjbGMxZDRrYTAxcGxldXNocSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/I90rL3aw7iwFNIu2qO/giphy.gif"
          alt="Banner gif"
          width={40}
          height={40}
          unoptimized
          className="w-10 h-10 mr-2 hidden md:block"
        />

        {/* Text & Icon */}
        <div className="flex items-center">
          <DollarSign className="mr-1 text-yellow-300" />
          <span>Support your Masjid</span>
        </div>

        {/* Right GIF */}
        <Image
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExam5tOHV0c3R1N2NsNDF1cXRiNmZnYng2MHF1c2J1Y3drcGtyc3NsOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cmZqA85yq6hhprM1Sq/giphy.gif"
          alt="Banner gif"
          width={40}
          height={40}
          unoptimized
          className="w-10 h-10 ml-2 hidden md:block"
        />

        {/* Price */}
        <span className="ml-3 bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded-lg">
          Donate here
        </span>
      </a>
    </div>
  );
};

export default TopBanner;
