'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

const CardSwap = dynamic(() => import('./CardSwap'), { ssr: false }); 

export default function AboutVisual() {
  const { isDark } = useTheme();
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const swapItems = [
    { 
      title: 'Web Interface', 
      image: '/self1.jpg' 
    },
    { 
      title: 'Interactive 3D', 
      image: '/self2.jpg' 
    },
    { 
      title: 'App Dashboard', 
      image: '/self3.jpg' 
    },
    { 
      title: 'Digital Art', 
      image: '/self4.jpg' 
    }
  ];

  const cardWidth = windowWidth < 480 ? 300 : windowWidth < 768 ? 350 : windowWidth < 1024 ? 440 : 540;
  const cardHeight = windowWidth < 480 ? 320 : windowWidth < 768 ? 360 : windowWidth < 1024 ? 440 : 520;
  const cardGap = windowWidth < 640 ? 32 : 55;

  return (
    <div className="relative w-full max-w-[460px] mx-auto h-[400px] sm:h-[450px] lg:h-[480px] mb-8 lg:mb-0 flex items-center justify-center">
      
      {/* Floating Pill */}
      <div className="absolute top-0 -left-2 sm:-left-5 z-50 bg-[#FFFFFF]/95 dark:bg-[#111827]/95 border border-[#E8DCCB] dark:border-[#1E293B] rounded-full py-1.5 px-3.5 flex items-center gap-2 shadow-sm dark:shadow-black/60 transition-colors">
        <span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/25 animate-pulse" />
        <span className="text-xs font-semibold text-[#241714] dark:text-[#FFFFFF] tracking-wide">
          Featured Gallery
        </span>
      </div>

      {/* CardSwap Animation Component */}
      <div className="w-full h-full pt-8 flex items-center justify-center">
        <CardSwap
          items={swapItems}
          width={cardWidth}
          height={cardHeight}
          skewAmount={0}
          cardDistance={cardGap}
          verticalDistance={cardGap}
          theme={isDark ? 'dark' : 'light'} 
          delay={3500}       
        />
      </div>
      
    </div>
  );
}