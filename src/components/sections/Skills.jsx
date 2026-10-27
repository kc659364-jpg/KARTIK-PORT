'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import SectionHeading from '@/components/ui/SectionHeading';
import SkillGroup from '@/components/ui/SkillGroup';
import skillGroups from '@/data/skills';
import { prefersReducedMotion } from '@/lib/animations';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/registry/magicui/scroll-based-velocity';
import { useTheme } from '@/context/ThemeContext';

const TechText = dynamic(() => import('@/components/ui/TechText'), { ssr: false });

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Skills() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const { isDark } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !marqueeRef.current) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            marqueeRef.current,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
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

  const isMobile = windowWidth < 768;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative border-t border-[#E8DCCB] dark:border-[#1E293B] overflow-hidden transition-colors duration-300"
    >
      <div className="container mx-auto relative z-20">
        
        <SectionHeading
          label="Technical Toolkit"
          title={
            mounted && !isMobile ? (
              <div className="w-full max-w-[800px] mx-auto h-[50px] sm:h-[70px] lg:h-[90px] relative mt-1 mb-3">
                <TechText
                  text="Skills & Frameworks." 
                  fontWeight={700}
                  fontSize={windowWidth < 1024 ? 60 : 80} 
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  specks={15}
                  intro="none"
                  introDuration={2}
                  clickKick
                  guides={false}
                  color={isDark ? '#FFFFFF' : '#241714'} 
                  accentColor={isDark ? '#2563EB' : '#4B2E2B'} 
                />
              </div>
            ) : (
              <span className="block text-3xl sm:text-4xl font-display font-bold text-[#241714] dark:text-[#FFFFFF] mt-2 mb-4">
                Skills & Frameworks.
              </span>
            )
          }
          description="A continuous velocity stream of my technical stack. Hover over any skill card to explore its interactive 3D rotating Icon Cloud."
          align="center"
        />
      </div>

      <div ref={marqueeRef} className="relative w-full max-w-full py-8 overflow-hidden z-10">
        <ScrollVelocityContainer className="w-full">
          <ScrollVelocityRow
            baseVelocity={4}
            direction={1}
            className="flex items-center py-4"
            numCopies={windowWidth < 768 ? 2 : 3}
            pauseOnHover={true}
          >
            {skillGroups.map((group) => (
              <SkillGroup key={group.id} group={group} />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 max-w-[220px] bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/80 dark:from-[#0B0F19] dark:via-[#0B0F19]/80 to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 max-w-[220px] bg-gradient-to-l from-[#FFFFFF] via-[#FFFFFF]/80 dark:from-[#0B0F19] dark:via-[#0B0F19]/80 to-transparent z-10" aria-hidden="true" />
      </div>

      <div className="container mx-auto">
        <p className="text-center mt-6 text-xs uppercase tracking-widest text-[#5C4845] dark:text-[#94A3B8]">
          &larr; Scroll to accelerate &bull; Hover card to explore 3D Icon Cloud &rarr;
        </p>
      </div>
    </section>
  );
}