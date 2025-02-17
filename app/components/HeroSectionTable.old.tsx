"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  PlayCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeroSectionTable = () => {
  const contentBlocks = [
    // {
    //   type: "text",
      
    //   title: "Transform your data into actionable insights",
    //   subtitle:
    //     "Empower your business with our advanced analytics platform. Make better decisions faster with real-time visualization.",
    //   duration: 5000, // Duration for non-video blocks
    //   cta: (
    //     <div className="flex gap-4">
    //       <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600">
    //         Get Started <ArrowRight size={20} />
    //       </button>
    //       <button className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
    //         Learn More
    //       </button>
    //     </div>
    //   ),
    // },
    {
      type: "image",
      pretitle:"Welcome to",
      title: "Al Faruq Islamic Centre",
      description:"<p>4410 127 Street SW, Edmonton, Alberta T6W 1A7</p>",
      imageSrc: "/Al.FaruqPrayerHall.jpeg",
      duration: 5000, // Duration for image blocks - ADDED duration here
      // cta: (
      //   <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
      //     <PlayCircle size={24} /> Watch Demo
      //   </button>
      // ),
    },
    {
      type: "video",
      title: "Al Faruq Islamic School and Amana Academy",
      description:"<p>Empowering Minds and Enriching Souls</p>",
      videoUrl: "/Amana.mp4", // Replace with actual video URL
      cta: (
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600">
          <PlayCircle size={24} /> Register
        </button>
      ),
    },
    // {
    //   type: "text",
    //   title: "Start your free trial today",
    //   subtitle:
    //     "Join thousands of companies already using our platform to scale their business.",
    //   duration: 5000,
    //   cta: (
    //     <div className="flex gap-4">
    //       <button className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600">
    //         <Download size={20} /> Download Now
    //       </button>
    //       <button className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
    //         View Pricing
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (duration: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    }
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, duration);
  };

  const handleVideoEnded = () => {
    nextSlide();
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && contentBlocks[currentIndex].type === "video") {
      // Start the video from the beginning
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  useEffect(() => {
    // Clear any existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    }

    // Handle different content types
    if (contentBlocks[currentIndex].type === "video") {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else {
      // For non-video content, use the specified duration
      if (contentBlocks[currentIndex].duration !== undefined) {
        startTimer(contentBlocks[currentIndex].duration);
      }
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as NodeJS.Timeout);
      }
    };
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;

    // Stop video if it's playing
    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    }
    setCurrentIndex(index);
  };

  const previousSlide = () => {
    goToSlide(currentIndex === 0 ? contentBlocks.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % contentBlocks.length);
  };

  const renderContent = () => {
    const block = contentBlocks[currentIndex];

    switch (block.type) {
      case "text":
        return (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              {block.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              {block.subtitle}
            </p>
          </>
        );
      case "video":
        return (
          <>
            {/* Increased font size: text-3xl */}
            <h2 className="text-6xl font-semibold mb-6">{block.title}</h2>
            <div className="relative rounded-lg overflow-hidden mb-8">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full rounded-lg shadow-lg"
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoadedMetadata}
              >
                <source src={block.videoUrl} type="video/mp4" />
              </video>
            </div>
          </>
        );
      case "image":
        return (
          <>
          {/* Conditional rendering using && */}
          {block.pretitle && (
            <h6 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              {block.pretitle}
            </h6>
          )}
      
          <h2 className="text-6xl font-semibold mb-6">{block.title}</h2>
      
          {/* Correctly using dangerouslySetInnerHTML */}
          {block.description && (
            <div
              className="text-xl text-gray-600 max-w-2xl mb-8"
              dangerouslySetInnerHTML={{ __html: block.description }} // ✅ Removed extra {}
            />
          )}
      
          <div className="relative w-full h-[300px] mb-6">
            <Image
              src={block.imageSrc || "/fallback-image.png"}
              alt={block.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
      
          {block.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mb-8">{block.subtitle}</p>
          )}
        </>
        );
      default:
        return null;
    }
  };

  const prayerTimesData = [
    { name_en: "Fajr", name_ar: "الفجر", adhan: "6:30 AM", iqama: "7:00 AM" },
    { name_en: "Sunrise", name_ar: "الشروق", adhan: "7:45 AM", iqama: "-" },
    { name_en: "Dhuhr", name_ar: "الظهر", adhan: "1:15 PM", iqama: "1:30 PM" },
    { name_en: "Asr", name_ar: "العصر", adhan: "4:30 PM", iqama: "4:45 PM" },
    {
      name_en: "Maghrib",
      name_ar: "المغرب",
      adhan: "6:00 PM",
      iqama: "6:10 PM",
    },
    { name_en: "Isha", name_ar: "العشاء", adhan: "7:30 PM", iqama: "7:45 PM" },
  ];

  return (
    <section className="min-h-[70vh] w-full bg-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          {/* Left Column - Mixed Content */}
          <div className="space-y-8">
            <div className="relative h-[600px] overflow-hidden">
              {/* Content */}
              <div key={currentIndex} className="animate-fade-slide">
                {renderContent()}
                {contentBlocks[currentIndex].cta}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={previousSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>

              {/* Dot Navigation */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 mb-4">
                {contentBlocks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-blue-600 w-4"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Table */}
          <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-700 py-6 px-6">
              <h3 className="text-xl font-bold text-white text-center">
                Prayer Timetable{" "}
                <span className="text-sm text-gray-300">(مواقيت الصلاة)</span>
              </h3>
            </div>
            <table className="min-w-full divide-y divide-gray-700 bg-gray-100 text-xl">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-semibold text-white uppercase tracking-wider"
                  >
                    Prayer <span> (الصلاة)</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center font-semibold text-white uppercase tracking-wider"
                  >
                    Adhan <span> (الأذان)</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center font-semibold text-white uppercase tracking-wider"
                  >
                    Iqama <span> (إقامة)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prayerTimesData.map((prayer, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {prayer.name_en} <span>({prayer.name_ar})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-mono">
                      {prayer.adhan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-mono">
                      {prayer.iqama}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTable;