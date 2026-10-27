'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import { prefersReducedMotion } from '@/lib/animations';
import { KineticText } from '@/registry/magicui/kinetic-text';
import { useTheme } from '@/context/ThemeContext';

const AboutVisual = dynamic(() => import('@/components/three/AboutVisual'), { ssr: false });
const PaperCrumple = dynamic(() => import('./PaperCrumple'), { ssr: false });

import paperLight from '@/img/paper1.png';
import paperDark from '@/img/paper2.png';

const CORE_TECH = [
  'React.js',
  'JavaScript',
  'PHP',
  'MySQL',
  'GSAP',
  'Three.js',
  'Bootstrap',
  'Node.js',
];

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function About() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const { isDark } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default true

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            contentRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            }
          );
        }, sectionRef);
      });
    });

    return () => {
      if (ctx && ctx.revert) ctx.revert();
    };
  }, []);
  
  const currentPaperSrc = isDark ? paperDark.src : paperLight.src;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative overflow-hidden transition-colors duration-300 border-t border-[#E8DCCB]/60 dark:border-[#1E293B]"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 flex justify-center">
            <AboutVisual />
          </div>

          <div ref={contentRef} className="lg:col-span-7 flex flex-col relative z-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B2E2B] dark:text-[#2563EB] mb-3">
              About Me
            </span>
            <div className="relative cursor-pointer">
              <KineticText
                text="Bridging Clean Code & Creative Web Experiences."
                as="h2"
                baseWeight={500}
                maxWeight={900}
                proximityRadius={100}
                className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#241714] dark:text-[#FFFFFF] leading-tight tracking-[-1%] [font-optical-sizing:auto]"
              />
            </div>

            <div className="relative z-20 w-full lg:w-[90%] lg:-ml-[8%] h-[400px] sm:h-[450px] lg:h-[550px] pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing">
              {/* Mobile Block: Render 3D only on Desktop, Static Image on Mobile */}
              {mounted && !isMobile ? (
                <PaperCrumple
                  src={currentPaperSrc}
                  alt="Kartik Chauhan Description"
                  width={500}        
                  height={500}       
                  sceneHeight="100%"
                  imageFit="contain" 
                  paperColor={isDark ? '#0B0F19' : '#FFFFFF'}
                  shadow={false}
                  draggable={true}
                  crumpleAmount={0.85}
                  foldCount={8}      
                  releaseBehavior="restore" 
                />
              ) : (
                <img 
                  src={currentPaperSrc} 
                  alt="Kartik Chauhan Description" 
                  className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                />
              )}
            </div>

            <div className="relative z-30 mb-0 border-t border-[#E8DCCB] dark:border-[#1E293B] pt-6 pointer-events-auto">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#241714] dark:text-[#94A3B8] mb-3">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {CORE_TECH.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] bg-[#E8DCCB] dark:bg-[#111827] px-3.5 py-1.5 rounded-full border border-[#D8C7B3] dark:border-[#1E293B] hover:border-[#4B2E2B] dark:hover:border-[#2563EB] hover:text-[#4B2E2B] dark:hover:text-[#2563EB] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}