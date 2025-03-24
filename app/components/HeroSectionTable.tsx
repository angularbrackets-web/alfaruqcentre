"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  RefObject,
} from "react";
import Image from "next/image";
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface ImageBlock {
  type: "image";
  pretitle?: string;
  title: string;
  introduction?: React.ReactNode;
  description?: React.ReactNode; // Changed from string to ReactNode
  imageSrc?: string;
  duration?: number;
  subtitle?: string;
}

interface VideoBlock {
  type: "video";
  title: string;
  introduction?: React.ReactNode;
  description?: React.ReactNode; // Changed from string to ReactNode
  videoUrl?: string;
  cta?: React.ReactNode;
}

type ContentBlockType = ImageBlock | VideoBlock;

const ContentBlock: React.FC<{
  block: ContentBlockType;
  videoRef: RefObject<HTMLVideoElement | null>;
  nextSlide: () => void;
}> = ({ block, videoRef, nextSlide }) => {
  console.log("ContentBlock Render - Type:", block.type);

  switch (block.type) {
    case "video": {
      const videoBlock = block as VideoBlock;
      return (
        <>
          {/* <h2 className="text-2xl md:text-4xl font-black mb-6 text-blue-900">
            {videoBlock.title}
          </h2>
          {videoBlock.description && (
            <div className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
              {videoBlock.description}
            </div>
          )} */}
          {videoBlock.introduction && (
            <div>
              {videoBlock.introduction}
            </div>
          )}
          <div className="relative rounded-lg overflow-hidden mb-8">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full rounded-lg shadow-lg"
              onEnded={() => {
                console.log("Video Ended Event Triggered");
                if (videoRef.current) {
                  videoRef.current.pause();
                }
                nextSlide();
              }}
            >
              <source src={videoBlock.videoUrl} type="video/mp4" />
            </video>
          </div>
        </>
      );
    }
    case "image": {
      const imageBlock = block as ImageBlock;
      return (
        <>
          {/* {imageBlock.pretitle && (
            <h6 className="text-2xl font-thin tracking-tight text-sky-500 mb-2">
              {imageBlock.pretitle}
            </h6>
          )}
          <h2 className="text-2xl md:text-4xl font-black mb-6 text-sky-900">
            {imageBlock.title}
          </h2>         
          
          {imageBlock.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              {imageBlock.subtitle}
            </p>
          )} */}
          {imageBlock.introduction && (
            <div>
              {imageBlock.introduction}
            </div>
          )}
          {imageBlock.imageSrc && (
          <div className="relative w-full min-h-[500px] mb-6">
            <Image
              src={imageBlock.imageSrc || "/fallback-image.png"}
              alt={imageBlock.title}
              fill
              className="object-contain rounded-lg shadow-lg"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          )}
          {imageBlock.description && (
            <div>
              {imageBlock.description}
            </div>
          )}
        </>
      );
    }
    default:
      return null;
  }
};

const HeroSectionTable = () => {
  const contentBlocks = useMemo<ContentBlockType[]>(
    () => [
      
      {
        type: "image",
        pretitle: "",
        title: "",
        introduction: null,
        description: (
          <div className="mt-32">
            <Image src="/EidAlFitrPrayer2025.jpeg" alt="" className="w-full" width={400} height={400} />
          </div>
        ), // or you can pass JSX here if needed
        imageSrc: "",
        duration: 15000,
      },
      {
        type: "image",
        pretitle: "",
        title: "",
        introduction: (
          <div>
            <div className="inline-block px-4 py-1 mb-4 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Alberta Education Accredited
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              Safeguard Your Child&apos;s Future
              <span className="text-emerald-600 block mt-2">KG to Grade 9</span>
            </h1>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              with Al-Faruq Islamic School & Amana Academy
            </h2>

<div className="bg-amber-100 border-l-4 border-amber-500 p-2 mb-8 rounded">
              <p className="text-amber-800 font-medium text-xs">
                ⚡ Limited-Time Tuition Offer for the first 100 students! Secure your child&apos;s place today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="https://tinyurl.com/AFIS2025" target="_blank"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Apply Now
              </Link>
              
              <Link 
                href="tel:7802438811"
                className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 px-6 py-3 rounded-lg font-medium text-center transition duration-200 text-sm"
              >
                Call (780) 243-8811
              </Link>
            </div>
            <div className="mt-4 w-full">
              <Link href="https://tinyurl.com/AFIS2025" target="_blank">
                <Image src="/AlFaruqIslamicSchoolPoster.March2025.jpeg" alt="" className="w-full" width={400} height={400} />
              </Link>
            </div>
          </div>
        ),
        description: null
        ,
        duration: 15000,
      },
      {
        type: "image",
        pretitle: "",
        title: "",
        introduction: (
          <div>
            
            
            <h1 className="text-xl font-bold text-gray-900 mb-4">
            <span className="text-emerald-600">Al-Faruq Weekend Quran School</span>
              <span className="text-xs block mt-2">5 to 12 years</span>
            </h1>
            <div className="inline-block px-4 py-1 mb-4 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Saturday and Sunday, 11:00 AM - 02:00 PM
            </div>
            <h2 className="text-sm font-semibold text-gray-800 mb-6">
            Invest in your Child&apos;s Here and Hereafter 
            </h2>

            <div className="space-y-4 mb-8 text-gray-800 text-sm">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" />
                <p>Teaching how to read Arabic fluently</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" />
                <p>Quran Recitation and Memorization</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" />
                <p>Adhkar, Sheeran and Islamic Studies</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link 
                href="/weekendschool"
                className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 px-6 py-3 rounded-lg font-medium text-center transition duration-200 text-sm"
              >
                Learn More
              </Link>
              <Link 
                href="https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform" target="_blank"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Apply Now
              </Link>
            </div>
            <div>
              <Link href="/weekendschool">
                <Image src="/AlFaruqWeekendQuranSchool.March2025.jpeg" alt="" width={350} height={400} />
              </Link>
            </div>
          </div>
        ),
        description: null
        ,
        duration: 15000,
      },
      {
        type: "image",
        pretitle: "Welcome to",
        title: "Al Faruq Islamic Centre",
        introduction: (
          <div>
            <h6>Welcome to</h6>
            <h1 className="text-xl font-bold text-sky-600 mb-4">
            Al Faruq Islamic Centre
            </h1>
          </div>
        ),
        description: null, // or you can pass JSX here if needed
        imageSrc: "/Al.FaruqPrayerHall.jpeg",
        duration: 15000,
      }
      //,
      // {
      //   type: "video",
      //   title: "Al Faruq Islamic School",
      //   description: (
      //     <p className="text-blue-600 text-sm md:text-lg">
      //       Empowering Minds and Enriching Souls
      //     </p>
      //   ),
      //   videoUrl: "/Amana.mp4",
      //   // Uncomment and adjust the CTA if needed:
      //   // cta: (
      //   //   <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-600">
      //   //     <PlayCircle size={24} /> Register
      //   //   </button>
      //   // ),
      // },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    console.log("nextSlide called - Current Index:", currentIndex);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contentBlocks.length);
  }, [contentBlocks.length, currentIndex]);

  const previousSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? contentBlocks.length - 1 : prevIndex - 1
    );
  }, [contentBlocks.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const startTimer = useCallback(
    (duration: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, duration);
    },
    [nextSlide]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentBlock = contentBlocks[currentIndex];
    console.log(
      "useEffect triggered - Current Index:",
      currentIndex,
      "Block Type:",
      currentBlock.type
    );

    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentBlock.type === "video") {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .catch((error) =>
            console.error("Video play failed:", error)
          );
      }
    } else if (currentBlock.type === "image" && currentBlock.duration) {
      startTimer(currentBlock.duration);
    }
  }, [currentIndex, contentBlocks, startTimer]);

  return (
    <section className="min-h-[70vh] w-full px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Carousel with stacked content */}
          <div className="relative">
            {/* Fixed-height container for carousel */}
            <div className="h-[800px] overflow-y-auto hide-scrollbar p-8">
              <div key={currentIndex} className="animate-fade-slide">
                <ContentBlock
                  block={contentBlocks[currentIndex]}
                  videoRef={videoRef}
                  nextSlide={nextSlide}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={previousSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>

            {/* Dot Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {contentBlocks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-blue-600 w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Prayer Times Widget */}
          <div className="overflow-hidden h-[560px]">
            <iframe
              src="https://timing.athanplus.com/masjid/widgets/embed?theme=1&masjid_id=nL1Zq8Aa"
              width="100%"
              height="100%"
              frameBorder="0"
              className="block"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

  );
};

export default HeroSectionTable;
