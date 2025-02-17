"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, RefObject, ReactNode } from "react";
import Image from "next/image";
import {
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from './HeroSectionTable.module.css'; // Import CSS Module

// Define TypeScript interfaces for Content Blocks
interface ImageBlock {
  type: "image";
  pretitle?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  duration?: number;
  subtitle?: string;
}

interface VideoBlock {
  type: "video";
  title: string;
  description?: string;
  videoUrl?: string;
  cta?: React.ReactNode;
}

type ContentBlockType = ImageBlock | VideoBlock;


const ContentBlock: React.FC<{ block: ContentBlockType, videoRef: RefObject<HTMLVideoElement | null>, nextSlide: () => void }> = ({ block, videoRef, nextSlide }) => {
  console.log("ContentBlock Render - Type:", block.type); // Debugging log

  switch (block.type) {
    case "video":
      const videoBlock = block as VideoBlock; // Type assertion for video block
      return (
        <>
          <h2 className="text-6xl font-semibold mb-6">{videoBlock.title}</h2>
          {videoBlock.description && (
            <div
              className="text-xl text-gray-600 max-w-2xl mb-8"
              dangerouslySetInnerHTML={{ __html: videoBlock.description }}
            />
          )}
          <div className="relative rounded-lg overflow-hidden mb-8">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full rounded-lg shadow-lg"
              onEnded={() => {
                console.log("Video Ended Event Triggered"); // Debugging log
                if (videoRef.current) {
                  videoRef.current.pause(); // Pause video after it ends
                }
                nextSlide(); // CALLING nextSlide HERE
              }}
            >
              <source src={videoBlock.videoUrl} type="video/mp4" />
            </video>
          </div>
        </>
      );
    case "image":
      const imageBlock = block as ImageBlock; // Type assertion for image block
      return (
        <>
          {imageBlock.pretitle && (
            <h6 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              {imageBlock.pretitle}
            </h6>
          )}
          <h2 className="text-6xl font-semibold mb-6">{imageBlock.title}</h2>
          {imageBlock.description && (
            <div
              className="text-xl text-gray-600 max-w-2xl mb-8"
              dangerouslySetInnerHTML={{ __html: imageBlock.description }}
            />
          )}
          <div className="relative w-full h-[300px] mb-6">
            <Image
              src={imageBlock.imageSrc || "/fallback-image.png"}
              alt={imageBlock.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {imageBlock.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mb-8">{imageBlock.subtitle}</p>
          )}
        </>
      );
    default:
      return null;
  }
};

interface PrayerTime {
  name_en: string;
  name_ar: string;
  adhan: string;
  iqama: string;
}

const PrayerTimesTable: React.FC<{ prayerTimesData: PrayerTime[] }> = ({ prayerTimesData }) => {
  return (
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
  );
};


const HeroSectionTable = () => {
  const contentBlocks = useMemo<ContentBlockType[]>(() => [
    {
      type: "image",
      pretitle: "Welcome to",
      title: "Al Faruq Islamic Centre",
      description: "<p>4410 127 Street SW, Edmonton, Alberta T6W 1A7</p>",
      imageSrc: "/Al.FaruqPrayerHall.jpeg",
      duration: 5000,
    },
    {
      type: "video",
      title: "Al Faruq Islamic School and Amana Academy",
      description: "<p>Empowering Minds and Enriching Souls</p>",
      videoUrl: "/Amana.mp4",
      cta: (
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-600">
          <PlayCircle size={24} /> Register
        </button>
      ),
    },
  ], []); // Empty dependency array because contentBlocks is static

  const prayerTimesData = useMemo<PrayerTime[]>(() => [
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
  ], []); // Empty dependency array because prayerTimesData is static


  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null); // Initialize with null and type as nullable
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback for handler functions that are dependencies in useEffect
  const nextSlide = useCallback(() => {
    console.log("nextSlide called - Current Index:", currentIndex); // Debugging log
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contentBlocks.length);
  }, [contentBlocks.length, currentIndex]); // Added currentIndex to dependencies for debugging

  const previousSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? contentBlocks.length - 1 : prevIndex - 1
    );
  }, [contentBlocks.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
    },
    []
  );


  const startTimer = useCallback((duration: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, duration);
  }, [nextSlide]);


  useEffect(() => {
    // Clear timer on component unmount and when currentIndex changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Cleanup on unmount


  useEffect(() => {
    const currentBlock = contentBlocks[currentIndex];
    console.log("useEffect triggered - Current Index:", currentIndex, "Block Type:", currentBlock.type); // Debugging log


    // Pause video if it exists and is playing, before changing slide
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentBlock.type === "video") {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.error("Video play failed:", error);
          // Handle video play error, e.g., show a poster image or message
        });
      }
    } else if (currentBlock.type === "image" && currentBlock.duration) {
      startTimer(currentBlock.duration);
    }
  }, [currentIndex, contentBlocks, startTimer]);


  return (
    <section className={`${styles.heroSection} min-h-[70vh] w-full py-12 px-4 sm:px-6 lg:px-8 mt-16`}>
      <div className={`${styles.heroSectionContent} mx-auto max-w-7xl`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          {/* Left Column - Mixed Content */}
          <div className="space-y-8">
            <div className="relative h-[700px] overflow-hidden">
              {/* Content */}
              <div key={currentIndex} className="animate-fade-slide">
                <ContentBlock
                  block={contentBlocks[currentIndex]}
                  videoRef={videoRef}
                  nextSlide={nextSlide} // Pass nextSlide to ContentBlock
                />
              </div>
                 {/* Conditionally render cta only for video blocks, OUTSIDE ContentBlock */}
                 {contentBlocks[currentIndex].type === 'video' && contentBlocks[currentIndex].cta && (
                    <div className="mt-4"> {/* Added a div to wrap cta and provide margin */}
                        {contentBlocks[currentIndex].cta as ReactNode} {/* Type assertion here */}
                        {console.log("CTA Rendered - Index:", currentIndex)} {/* Debugging log */}
                    </div>
                 )}


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
          <PrayerTimesTable prayerTimesData={prayerTimesData} />
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTable;