"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, RefObject, ReactNode } from "react";
import Image from "next/image";
import {
  //BadgeDollarSign,
  // PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
          <h2 className="text-2xl md:text-4xl font-black mb-6 text-blue-900">{videoBlock.title}</h2>
          {videoBlock.description && (
            <div
              className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
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
            <h6 className="text-2xl font-thin tracking-tight text-sky-500 mb-2">
              {imageBlock.pretitle}
            </h6>
          )}
          <h2 className="text-2xl md:text-4xl font-black mb-6 text-sky-900">{imageBlock.title}</h2>
          {imageBlock.description && (
            <div
              className="text-sm md:text-md text-gray-500 max-w-2xl mb-8"
              dangerouslySetInnerHTML={{ __html: imageBlock.description }}
            />
          )}
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
          {imageBlock.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mb-8">{imageBlock.subtitle}</p>
          )}
        </>
      );
    default:
      return null;
  }
};


const HeroSectionTable = () => {
  const contentBlocks = useMemo<ContentBlockType[]>(() => [
    // {
    //   type: "image",
    //   pretitle: "",
    //   title: "Ramadan Fundraiser 2025",
    //   description: `
    //   <p class='mb-3 text-sky-600'>Join us for a delicious iftar at Sahaba Mosque / Al Faruq Mosque - it's going to be a feast to remember!</p>
    //   <div class="grid grid-cols-12 gap-1 font-semibold text-sky-600">
    //     <span class='col-span-3 text-sky-800 bg-sky-100 px-2 rounded-xl text-center mr-2'>Date  </span>
    //     <span class='col-span-9'>Friday, March 14, 2025</span>
    //     <span class='col-span-3 text-sky-800 bg-sky-100 px-2 rounded-xl text-center mr-2'>Time  </span>
    //     <span class='col-span-9'>Maghreb - Isha</span>
    //     <span class='col-span-3 text-sky-800 bg-sky-100 px-2 rounded-xl text-center mr-2'>Venue  </span>
    //     <div class='col-span-9'>
    //       <p>ARCA BANQUET HALL</p>            
    //     </div>
    //     <span class='col-span-3 text-sky-800 bg-sky-100 px-2 rounded-xl text-center my-auto mr-2'>Address  </span>
    //     <span class='col-span-9'>
    //       <a href="https://maps.app.goo.gl/zJUBdmnnPmSmojUbA" target="_blank" class="text-xs underline w-full block">
    //       <p class='underline w-full'>14525 127 St</p> 
    //       <p class='underline w-full'>Edmonton, AB T6V 0B3</p>
    //       </a>
    //     </span>
    //   </div>
    //   <div class="mt-4">
    //       <a href="https://www.eventbrite.ca/e/sahaba-mosque-al-faruq-mosque-iftar-tickets-1278199141039" target="_blank" class="items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          
    //       <span>Buy Tickets (CAD20.00)</span>
    //       </a>    
    //   </div>
    //   `,
    //   imageSrc: "/RamadanFundraiser2025.jpeg",
    //   duration: 60000,
    // },
    {
      type: "image",
      pretitle: "Welcome to",
      title: "Al Faruq Islamic Centre",
      description: "",
      imageSrc: "/Al.FaruqPrayerHall.jpeg",
      duration: 15000,
    },
    {
      type: "video",
      title: "Al Faruq Islamic School",
      description: "<p class='text-blue-600 text-sm md:text-lg'>Empowering Minds and Enriching Souls</p>",
      videoUrl: "/Amana.mp4",
      // cta: (
      //   <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-600">
      //     <PlayCircle size={24} /> Register
      //   </button>
      // ),
    },
  ], []); // Empty dependency array because contentBlocks is static




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
    <section className="min-h-[70vh] w-full px-4 sm:px-6 lg:px-8 mt-16 bg-white">
  <div className="mx-auto max-w-7xl">
    {/* Use a one-column grid on md screens and switch to 4 columns on lg screens */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
      {/* Left Column - Mixed Content */}
      <div className="lg:col-span-3 py-12">
        <div className="relative min-h-[400px] lg:min-h-[800px]">
          {/* Content */}
          <div key={currentIndex} className="animate-fade-slide">
            <ContentBlock
              block={contentBlocks[currentIndex]}
              videoRef={videoRef}
              nextSlide={nextSlide} // Pass nextSlide to ContentBlock
            />
          </div>

          {contentBlocks[currentIndex].type === "video" && contentBlocks[currentIndex].cta && (
            <div className="mt-4">
              {contentBlocks[currentIndex].cta as ReactNode}
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
      <div className="lg:col-span-1">
        {/* A wrapper with overflow-hidden prevents horizontal scroll if iframe content overflows */}
        <div className="overflow-hidden">
          <iframe
            src="https://timing.athanplus.com/masjid/widgets/embed?theme=1&masjid_id=nL1Zq8Aa"
            width="100%"
            height="560"
            frameBorder="0"
            className="block"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default HeroSectionTable;