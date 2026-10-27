'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/context/ThemeContext';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let ctx = gsap.context(() => {
      // 4 second ka loading animation
      gsap.to({ val: 0 }, {
        val: 100,
        duration: 4, 
        ease: "power2.inOut",
        onUpdate: function() {
          setProgress(Math.round(this.targets()[0].val));
        },
        onComplete: () => {
          // 100% hone ke baad screen upar slide ho jayegi
          gsap.to(".preloader-container", {
            yPercent: -100,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: onComplete
          });
        }
      });
    });

    return () => ctx.revert();
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <div 
      className={`preloader-container fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-[#241714]'
      }`}
    >
      <div className="relative overflow-hidden">
        <div className="text-7xl sm:text-8xl md:text-9xl font-display font-bold tabular-nums">
          {progress}%
        </div>
      </div>
      <div className="mt-6 text-xs sm:text-sm tracking-[0.4em] uppercase font-semibold opacity-70">
        Loading Experience
      </div>
      
      {/* Sleek Progress Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-gray-500/20 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isDark ? 'bg-[#2563EB]' : 'bg-[#4B2E2B]'}`}
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        />
      </div>
    </div>
  );
}