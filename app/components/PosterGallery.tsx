// components/PosterGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Poster = {
  id: string;
  src: string;
  alt: string;
  url?: string;
  linkText?: string;
  linkUrl?: string;
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
    src: '/AFIS.SummerCamp.2025.jpeg',
    alt: 'Summer Camp 2025',
    linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc6U1ur8QSSrfBBO-Ws7BxCBOCMh4RU_hwN7bvF9RfObB_xhg/viewform',
    linkText: 'Register',
  },
  {
    id: '2',
    src: '/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.1.jpeg',
    alt: 'Islamic School',
    linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScBGnya-MWf-d39tWtyDQNgEP_2Ft_86aslmSndZAY2BfRqwg/viewform',
    linkText: 'Register',
  },
  {
    id: '3',
    src: '/AlFaruq.Weekend.Quran.School.March2025.jpeg',
    alt: 'Weekend Quran School',
    linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform',
    linkText: 'Register',
    url: '/weekendschool'
  },
  {
    id: '4',
    src: '/AlFaruq.ClassicalArabicProgram.jpeg',
    alt: 'Classical Arabic Program',
  }
];

export default function PosterGallery() {
  const [processedPosters, setProcessedPosters] = useState<PosterWithDimensions[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h2 className="text-3xl font-bold text-sky-900 mb-6 px-5">Our Programs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {processedPosters.map((poster) => (
          <div key={poster.id} className='flex flex-col'>
            {poster.url ? (
              <a
                href={poster.url}
                rel="noopener noreferrer"
                className={`${getPosterOrientationClass(poster.orientationType)} transform transition-all duration-300 hover:scale-105 max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-gray-200`}
              >
                <div className="h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-200 p-1">
                  <div className="relative w-full h-full">
                    <Image
                      src={poster.src}
                      alt={poster.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </a>
            ) : (
              <div className={`${getPosterOrientationClass(poster.orientationType)} max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 bg-gray-200`}>
                <div className="h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-200 p-1">
                  <div className="relative w-full h-full">
                    <Image
                      src={poster.src}
                      alt={poster.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
            {poster.linkUrl && (
              <div>
                <Link 
                  href={poster.linkUrl} 
                  target="_blank" 
                  className="inline-block rounded-lg bg-blue-500 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-blue-700 px-4 py-1 my-2"
                >
                  {poster.linkText!}
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
