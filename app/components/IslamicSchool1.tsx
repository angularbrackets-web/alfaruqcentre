"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';

const IslamicSchool1: React.FC = () => {
  // Video states
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Define media URLs as constants
  const posterUrl = "/AlFaruqIslamicSchoolPoster.March2025.jpeg";
const videoUrl = "/Amana.mp4";
  
  // Initialize video element when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(e => {
        console.log("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    }
  }, []);
  
  // Toggle video play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(e => console.log("Couldn't play video:", e));
      setIsPlaying(true);
    }
  };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-50 z-0" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-4 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            Alberta Education Accredited
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Safeguard Your Child&apos;s Future
            <span className="text-emerald-600 block mt-2">KG to Grade 9</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            with Al-Faruq Islamic School & Amana Academy
          </h2>
        </div>
        
        {/* First row: Content on left, Video on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-24">
          {/* Left column: Content */}
          <div>
            <p className="text-gray-700 mb-8 text-lg">
              As the public school system increasingly pushes agendas that conflict with our values, 
              parents are left with a critical decision: Who will shape your child&apos;s future?
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Academic Excellence with a strong Islamic foundation</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Small Class Sizes for personalized learning</p>
              </div>

              <div className="flex items-start mb-6">
              <CheckCircle className="h-6 w-6 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">A Safe Alternative to the shifting public school landscape</p>
            </div>
            </div>
          </div>
          
          {/* Right column: Video */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-w-16 aspect-h-9">
              {/* Video element */}
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                autoPlay
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex items-center">
                <button 
                  onClick={togglePlay}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-full p-3 mr-3 transition"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? 
                    <Pause className="h-6 w-6 text-white" /> : 
                    <Play className="h-6 w-6 text-white" />
                  }
                </button>
                
                <button 
                  onClick={toggleMute}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-full p-3 transition"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? 
                    <VolumeX className="h-6 w-6 text-white" /> : 
                    <Volume2 className="h-6 w-6 text-white" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second row: Poster on left, Content on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
          {/* Left column: Poster */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl order-2 lg:order-1">
          <Image src={posterUrl} alt="Al-Faruq Islamic School & Amana Academy" layout="responsive" width={600} height={800} priority />
          </div>
          
          {/* Right column: Content */}
          <div className="order-1 lg:order-2">
            
          
            
            <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-8 rounded">
              <p className="text-amber-800 font-medium">
                ⚡ Limited-Time Tuition Offer for the first 100 students! Secure your child&apos;s place today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="https://tinyurl.com/AFIS2025"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl"
              >
                Apply Now
              </Link>
              
              <Link 
                href="tel:7802438811"
                className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 px-6 py-3 rounded-lg font-medium text-center transition duration-200"
              >
                Call (780) 243-8811
              </Link>
            </div>
            {/* Campus locations */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2 text-center">Two Campus Locations in Edmonton</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-4">
              <p className="font-medium">North Campus</p>
              <p className="text-gray-600">12903 54 St</p>
            </div>
            <div className="p-4">
              <p className="font-medium">South Campus</p>
              <p className="text-gray-600">4410 127 St SW</p>
            </div>
          </div>
        </div>
          </div>
        </div>
        
        
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <Link 
            href="https://www.alfaruqislamicschool.com" 
            className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
          >
            www.alfaruqislamicschool.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IslamicSchool1;