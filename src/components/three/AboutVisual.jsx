'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

const CardSwap = dynamic(() => import('./CardSwap'), { ssr: false }); 

export default function AboutVisual() {
  const { isDark } = useTheme();

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
      <div className="w-full h-full pt-8">
        <CardSwap
          items={swapItems}
          width={560}            // Size bada kar diya red line tak match karne ke liye
          height={540}           // Height badha di hai
          skewAmount={0}         // Tilt hata diya, ab ekdum straight (face to face) dikhega
          cardDistance={55}      // Stacked cards ke beech ka horizontal gap adjust kiya
          verticalDistance={55}  // Stacked cards ke beech ka vertical gap adjust kiya
          theme={isDark ? 'dark' : 'light'} 
          delay={3500}       
        />
      </div>
      
    </div>
  );
}