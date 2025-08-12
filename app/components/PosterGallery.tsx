// components/PosterGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Program } from '@/app/types/program';
import { getPrograms } from '@/app/utils/programs';

type ProgramWithDimensions = Program & {
  width: number;
  height: number;
  aspectRatio: number;
  orientationType: 'portrait' | 'landscape' | 'square';
};

export default function PosterGallery() {
  const [processedPrograms, setProcessedPrograms] = useState<ProgramWithDimensions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImageDimensions = async () => {
      setLoading(true);
      
      // Get programs from API
      let programs;
      try {
        const response = await fetch('/api/programs');
        const data = await response.json();
        if (data.success) {
          programs = data.data;
        } else {
          // Fallback to local data if API fails
          console.warn('API failed, using local data:', data.message);
          programs = getPrograms();
        }
      } catch (error) {
        // Fallback to local data if fetch fails
        console.warn('Fetch failed, using local data:', error);
        programs = getPrograms();
      }
      
      const programsWithDimensions = await Promise.all(
        programs.map(async (program: Program) => {
          return new Promise<ProgramWithDimensions>((resolve) => {
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
                ...program,
                width,
                height,
                aspectRatio,
                orientationType
              });
            };
            
            img.onerror = () => {
              resolve({
                ...program,
                width: 800,
                height: 1200,
                aspectRatio: 0.67,
                orientationType: 'portrait'
              });
            };
            
            img.src = program.imageUrl;
          });
        })
      );
      
      setProcessedPrograms(programsWithDimensions);
      setLoading(false);
    };
    
    loadImageDimensions();
  }, []);

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
        <div className="animate-pulse text-gray-500">Loading programs...</div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-sky-900 mb-6 px-5">Our Programs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {processedPrograms.map((program) => (
          <div key={program.id} className='flex flex-col'>
            <div className={`${getPosterOrientationClass(program.orientationType)} max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-gray-200`}>
              <div className="h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-200 p-1">
                <div className="relative w-full h-full">
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
            {program.linkUrl && (
              <div>
                <Link 
                  href={program.linkUrl} 
                  target="_blank" 
                  className="inline-block rounded-lg bg-blue-500 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-blue-700 px-4 py-1 my-2"
                >
                  {program.linkText || 'Learn More'}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
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
