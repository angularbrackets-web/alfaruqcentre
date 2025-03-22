"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';

const IslamicSchool: React.FC = () => {
  // Video states
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Define media URLs as constants
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
    
    // Add event listener to handle play/pause state
    const handleVisibilityChange = () => {
      if (document.hidden && video && isPlaying) {
        video.pause();
      } else if (!document.hidden && video && isPlaying) {
        video.play().catch(e => console.log("Couldn't resume playback:", e));
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);
  
  // Toggle video play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.log("Couldn't play video:", e));
    }
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950 to-sky-600 z-0" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className="max-w-xl">
            <div className="inline-block px-4 py-1 mb-4 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Alberta Education Accredited
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Safeguard Your Child&apos;s Future
              <span className="text-emerald-400 block mt-2">KG to Grade 9</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              with Al-Faruq Islamic School & Amana Academy
            </h2>
            
            <p className="mb-8 text-lg">
              As the public school system increasingly pushes agendas that conflict with our values, 
              parents are left with a critical decision: Who will shape your child&apos;s future?
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-emerald-300 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-100">Academic Excellence with a strong Islamic foundation</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-emerald-300 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-100">Small Class Sizes for personalized learning</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-emerald-300 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-100">A Safe Alternative to the shifting public school landscape</p>
              </div>
            </div>
            
            <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-8 rounded">
              <p className="text-amber-800 font-medium">
                ⚡ Limited-Time Tuition Offer for the first 100 students! Secure your child&apos;s place today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="https://tinyurl.com/AFIS2025" target='_blank'
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-center transition duration-200 shadow-lg hover:shadow-xl"
              >
                Apply Now
              </Link>
              
              <Link 
                href="tel:7802438811"
                className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-300 px-6 py-3 rounded-lg font-medium text-center transition duration-200"
              >
                Call (780) 243-8811
              </Link>
            </div>
          </div>
          
          {/* Media Column - Split view with poster and video */}
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <div className="relative aspect-w-16 aspect-h-9">
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
            
            {/* Locations Overlay */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 z-20">
              <p className="text-sm mb-1 font-medium">Two Campus Locations in Edmonton:</p>
              <p className="text-xs">North: 12903 54 St | South: 4410 127 St SW</p>
            </div> */}
          </div>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <Link 
            href="https://www.alfaruqislamicschool.com" target='_blank'
            className="text-emerald-300 hover:text-emerald-100 font-medium hover:underline"
          >
            www.alfaruqislamicschool.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IslamicSchool;