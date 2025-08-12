"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Link from 'next/link';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import GlassmorphicPrayerTimes from "./GlassmorphicPrayerTimes";
import Card from "./Card";
import { HeroSlide } from "@/app/types/heroSlide";


interface SlideContentProps {
  slide: HeroSlide;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide }) => {
  return (
    <Card imageUrl={slide.imageUrl}>
      <h1 className="text-xl font-bold mb-6 text-sky-600">
        {slide.title}
      </h1>
      
      {slide.subtitle && (
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {slide.subtitle}
        </h2>
      )}
      
      {slide.description && (
        <p className="text-lg mb-6 text-gray-900">
          {slide.description}
        </p>
      )}
      
      {slide.linkUrl && slide.linkText && (
        <div className="my-2">
          <Link 
            href={slide.linkUrl} 
            target="_blank"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            {slide.linkText}
          </Link>
        </div>
      )}
    </Card>
  );
};

const DynamicHeroSection = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/slides');
        if (!response.ok) {
          throw new Error('Failed to fetch slides');
        }
        const data = await response.json();
        // Filter only active slides
        const activeSlides = data.filter((slide: HeroSlide) => slide.status === 'ACTIVE');
        setSlides(activeSlides);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slides');
        console.error('Error fetching slides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const previousSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

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
    if (slides.length === 0 || !isAutoPlaying) return;

    const currentSlide = slides[currentIndex];
    if (currentSlide) {
      startTimer(currentSlide.duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, slides, startTimer, isAutoPlaying]);

  // Loading state
  if (loading) {
    return (
      <section className="min-h-[70vh] w-full px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
            <div className="mt-1 md:mt-4">
              <GlassmorphicPrayerTimes />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || slides.length === 0) {
    return (
      <section className="min-h-[70vh] w-full px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <div className="text-gray-500 mb-4">
                  {error ? 'Failed to load slides' : 'No active slides available'}
                </div>
                <p className="text-sm text-gray-400">
                  Please check back later or contact the administrator.
                </p>
              </div>
            </div>
            <div className="mt-1 md:mt-4">
              <GlassmorphicPrayerTimes />
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                <SlideContent
                  slide={slides[currentIndex]}
                />
              </div>
            </div>

            {/* Dot Navigation */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
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
            )}
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

export default DynamicHeroSection;