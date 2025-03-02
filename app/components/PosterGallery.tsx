// components/PosterGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Poster = {
  id: string;
  src: string;
  alt: string;
};

type PosterWithDimensions = Poster & {
    width: number;
    height: number;
    aspectRatio: number;
    orientationType: 'portrait' | 'landscape' | 'square';
  };

const posters: Poster[] = [
    {
      id: '1',
      src: '/AlFaruqRamadanPrograms2025.jpeg', // Replace with your actual image paths
      alt: 'Ramadan Programs 2025',
    },
    {
      id: '2',
      src: '/AlFaruqIslamicSchool.Approved.July2024.jpeg',
      alt: 'Islamic School',
    },
    {
      id: '3',
      src: '/AlFaruqWeekendQuranSchool.jpg',
      alt: 'Weekend Quran School',
    },
    {
      id: '4',
      src: '/AlFaruq.ClassicalArabicProgram.jpeg',
      alt: 'Classical Arabic Program',
    }
    // Add more posters as needed
  ];


  export default function PosterGallery() {
    const [processedPosters, setProcessedPosters] = useState<PosterWithDimensions[]>([]);
    const [selectedPoster, setSelectedPoster] = useState<PosterWithDimensions | null>(null);
    const [loading, setLoading] = useState(true);
  
    // Process poster dimensions on component mount
    useEffect(() => {
      const loadImageDimensions = async () => {
        setLoading(true);
        
        const postersWithDimensions = await Promise.all(
          posters.map(async (poster: Poster) => {
            return new Promise<PosterWithDimensions>((resolve) => {
              const img = new window.Image();
              img.onload = () => {
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;
                
                let orientationType: 'portrait' | 'landscape' | 'square';
                if (aspectRatio < 0.8) {
                  orientationType = 'portrait';
                } else if (aspectRatio > 1.2) {
                  orientationType = 'landscape';
                } else {
                  orientationType = 'square';
                }
                
                resolve({
                  ...poster,
                  width,
                  height,
                  aspectRatio,
                  orientationType
                });
              };
              
              // Fallback in case image fails to load
              img.onerror = () => {
                resolve({
                  ...poster,
                  width: 800,
                  height: 1200,
                  aspectRatio: 0.67,
                  orientationType: 'portrait'
                });
              };
              
              img.src = poster.src;
            });
          })
        );
        
        setProcessedPosters(postersWithDimensions);
        setLoading(false);
      };
      
      loadImageDimensions();
    }, []);
  
    // Close modal when clicking escape key
    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setSelectedPoster(null);
        }
      };
  
      window.addEventListener('keydown', handleEscKey);
      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    }, []);
  
    // Close modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedPoster(null);
      }
    };
  
    // Get CSS class based on poster orientation
    const getPosterOrientationClass = (orientationType: string) => {
      switch (orientationType) {
        case 'portrait':
          return 'poster-portrait';
        case 'landscape':
          return 'poster-landscape';
        case 'square':
          return 'poster-square';
        default:
          return 'poster-portrait';
      }
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-32">
          <div className="animate-pulse text-gray-500">Loading posters...</div>
        </div>
      );
    }
  
    return (
      <>
        <h2 className="text-3xl font-bold text-blue-600 mb-6 px-5">Our Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {processedPosters.map((poster) => (
            <div
              key={poster.id}
              className={`${getPosterOrientationClass(poster.orientationType)} cursor-pointer transform transition-all duration-300 hover:scale-105`}
              onClick={() => setSelectedPoster(poster)}
            >
              <div className="h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="relative w-full h-full">
                  <Image
                    src={poster.src}
                    alt={poster.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Modal Popup */}
        {selectedPoster && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
          >
            <div className="relative bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
              <button
                className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                onClick={() => setSelectedPoster(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-1">
                <div className="relative">
                  <Image
                    src={selectedPoster.src}
                    alt={selectedPoster.alt}
                    width={selectedPoster.width}
                    height={selectedPoster.height}
                    className="max-h-[85vh] w-auto h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Custom CSS for different aspect ratios */}
        <style jsx global>{`
          .poster-portrait {
            aspect-ratio: 2/3;
          }
          .poster-landscape {
            aspect-ratio: 16/9;
          }
          .poster-square {
            aspect-ratio: 1/1;
          }
        `}</style>
      </>
    );
  }
  