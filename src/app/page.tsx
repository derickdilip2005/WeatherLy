'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import WeatherDashboard from '@/components/WeatherDashboard';
import SearchBar from '@/components/SearchBar';
import GlitchText from '@/components/GlitchText';
import dynamic from 'next/dynamic';

// Change the WeatherMap import to dynamic import
const WeatherMap = dynamic(() => import('@/components/WeatherMap'), {
  ssr: false,
  loading: () => <div className="h-[40vh] sm:h-[60vh] w-full bg-gray-800 animate-pulse" />
});

// Remove the dynamic Map import since we're using WeatherMap
// const Map = dynamic(() => import('@/components/Map')...

export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    ).fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <main className="min-h-screen relative">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 bg-[#1c1917] p-2 sm:p-4 z-[1000] border-b border-red-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <GlitchText className="text-2xl sm:text-4xl font-extrabold text-red-500 tracking-wider">
            WeatherLy
          </GlitchText>
          <div className="w-full sm:w-auto bg-[#1c1917] p-2 rounded-lg shadow-lg border-2 border-red-500">
            <SearchBar onSearch={setCoordinates} />
          </div>
        </div>
      </div>
      <div ref={contentRef} className="pt-24 sm:pt-20">
        <div className="relative h-[40vh] sm:h-[60vh] w-full" style={{ zIndex: 1 }}>
          <WeatherMap coordinates={coordinates} />
        </div>
        <WeatherDashboard coordinates={coordinates} />
      </div>
    </main>
  );
}
