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
import { CheckCircle, ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import GlassmorphicPrayerTimes from "./GlassmorphicPrayerTimes";
import Card from "./Card";

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

const HeroSectionTable2 = () => {
  const contentBlocks = useMemo<ContentBlockType[]>(
    () => [
      
      // {
      //   type: "image",
      //   pretitle: "",
      //   title: "",
      //   introduction: null,
      //   description: (
      //     <Card title="" imageUrl="/EidAlFitrPrayer2025.1.jpeg" />
          
      //   ),
      //   imageSrc: "",
      //   duration: 15000,
      // },
      // {
      //   type: "image",
      //   pretitle: "Welcome to",
      //   title: "Al Faruq Islamic Centre",
      //   introduction: (
      //     <Card imageUrl="/AlFaruq.EidAlAdha.Prayer2025.jpeg">
          
      //     </Card>
      //   ),
      //   description: null, // or you can pass JSX here if needed
      //   duration: 20000,
      // }
      // ,
      {
        type: "image",
        title: "Support your Masjid",
        introduction: (
          <Card imageUrl="/SupportYourMasjid.jpeg">
          <h1 
          className="text-xl font-bold mb-6 text-sky-600"
        >
          Support your Masjid
        </h1>
        <p 
          className="text-lg mb-6 text-gray-900"
        >
          Other institutions may raise millions at once — But our strength is in consistent giving.
        </p>
        <p 
          
        >
          Be part of a movement of small, daily sacrifices that earn big rewards. The Prophet (peace be upon him) said that angels make duaa every morning for those who give. 
        </p>
        <p>
        Just $1 a day = $30/month
        </p>
        <p>Set up your monthly donation now and bring barakah into your sustenance.</p>
        <p>Click here to support your masjid</p>
        <div className="my-2">
          <Link 
                href="https://tinyurl.com/SupportYourMasjid" target="_blank"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Donate
              </Link>
        </div>
        
          </Card>
        ),
        description: null, // or you can pass JSX here if needed
        duration: 15000,
      },
      {
        type: "image",
        title: "Al-Faruq Summer Camp – Registration Now Open!",
        introduction: (
          <Card imageUrl="/AFIS.SummerCamp.2025.jpeg">
          <h1 
          className="text-xl font-bold mb-6 text-sky-600"
        >
          Al-Faruq Summer Camp – Registration Now Open!
        </h1>
        <p 
          className="text-lg mb-6 text-gray-900"
        >
          Get ready for a summer full of learning, fun, and unforgettable memories!
        </p>
        <p 
          
        >
          Al-Faruq Summer Camp is now accepting registrations.</p>
        <p>
        Our program includes engaging courses in Qur’an, Arabic, Islamic Studies, Language Arts, and Math—alongside exciting activities like sports, games, and field trips.
        </p>
        <p>Spaces are limited, so don’t wait!</p>
        <div className="my-2">
          <Link 
                href="https://forms.gle/eaNc7Wi7L2LRiApL9" target="_blank"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Register Now
              </Link>
        </div>
        
          </Card>
        ),
        description: null, // or you can pass JSX here if needed
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
      ,
      {
        type: "image",
        pretitle: "",
        title: "",
        introduction: null,
        description: (
          <div>
            <Card title="" imageUrl="/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.1.jpeg" >
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
          </div>
          </Card>
          </div>
          
        ),
        imageSrc: "",
        duration: 15000,
      },       
      
      {
        type: "image",
        pretitle: "",
        title: "",
        introduction: null,
        description: (
          <Card title="" imageUrl="/AlFaruq.Weekend.Quran.School.March2025.jpeg">
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
          </Card>
        )
        ,
        duration: 15000,
      },
      {
        type: "image",
        pretitle: "Welcome to",
        title: "Al Faruq Islamic Centre",
        introduction: (
          <Card imageUrl="/Al.FaruqPrayerHall.jpeg">
          <h1 
          className="text-xl font-bold mb-6 text-sky-600"
        >
          Welcome to Al Faruq Islamic Centre
        </h1>
        <p 
          className="text-lg mb-6 text-gray-900"
        >
          A Place of Worship, Learning, and Community in South Edmonton.
        </p>
        <p 
          
        >
          Located in the heart of South Edmonton, Al Faruq Islamic Centre is a welcoming space dedicated to fostering faith, education, and unity. 
        </p>
        <p>
        Whether you&apos;re here for daily prayers, Islamic education, or community programs, we are committed to serving and supporting you. Join us in strengthening our connection with Allah and each other.
        </p>
          </Card>
        ),
        description: null, // or you can pass JSX here if needed
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contentBlocks.length);
  }, [contentBlocks.length]);

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

  // Effect for reloading the page periodically to get fresh data
  useEffect(() => {
    if (!isAutoPlaying) return;

    // Reload the page every hour to get fresh data
    const reloadInterval = setInterval(() => {
      window.location.reload();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(reloadInterval);
  }, [isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        previousSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === ' ') { // Space bar
        event.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nextSlide, previousSlide]);

  useEffect(() => {
    const currentBlock = contentBlocks[currentIndex];

    const cleanupCurrentMedia = () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    cleanupCurrentMedia();

    if (!isAutoPlaying) return;

    // Instead of fetching the JSON file, we'll use the imported data
    // since it's already available and updated on each page load
    if (currentBlock.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
        nextSlide(); // Skip to next slide if video fails
      });
    } else if (currentBlock.type === "image" && currentBlock.duration) {
      startTimer(currentBlock.duration);
    }

    return cleanupCurrentMedia;
  }, [currentIndex, contentBlocks, startTimer, isAutoPlaying, nextSlide]);

  return (
    <section className="min-h-[70vh] w-full px-4 sm:px-6 lg:px-8 bg-white">
  <div className="mx-auto max-w-7xl">
    {/* Two-column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left Column: Carousel with stacked content */}
      <div className="relative">
        {/* Navigation Buttons spaced out on either side */}
        <div className="mt-4 mb-2 flex justify-between items-center w-full z-10">
          <div className="flex gap-2">
            <button
              onClick={previousSlide}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center gap-2 group"
              aria-label="Previous Slide"
            >
              <ArrowLeftCircleIcon size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">Previous</span>
            </button>
            <button
              onClick={nextSlide}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 group"
              aria-label="Next Slide"
            >
              <span className="font-medium">Next</span>
              <ArrowRightCircleIcon size={20} className="text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <button
            onClick={() => setIsAutoPlaying(prev => !prev)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${isAutoPlaying 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            aria-label={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isAutoPlaying ? 'Auto' : 'Paused'}
          </button>
        </div>

        <div className="py-8 z-0 mt-[-30px]">
          <div key={currentIndex} className="animate-fade-slide">
            <ContentBlock
              block={contentBlocks[currentIndex]}
              videoRef={videoRef}
              nextSlide={nextSlide}
            />
          </div>
        </div>

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

      {/* Right Column: Prayer Times */}
      <div className="mt-1 md:mt-4">
        <GlassmorphicPrayerTimes />
      </div>
      
    </div>
  </div>
</section>


  );
};

export default HeroSectionTable2;
