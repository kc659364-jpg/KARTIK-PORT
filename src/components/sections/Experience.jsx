'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Briefcase, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import TextType from '@/components/ui/TextType';
import experience from '@/data/experience';
import { prefersReducedMotion } from '@/lib/animations';
import { useTheme } from '@/context/ThemeContext';

const CurvedLoop = dynamic(() => import('@/components/ui/CurvedLoop'), { ssr: false });

const ICON_MAP = {
  internship: Briefcase,
  'self-learning': BookOpen,
  bca: GraduationCap,
};

export default function Experience() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (prefersReducedMotion() || !timelineRef.current) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            timelineRef.current.children,
            { opacity: 0, x: 150 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 1,
                toggleActions: 'play none none reverse',
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

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative border-t border-[#E8DCCB] dark:border-[#1E293B] overflow-hidden transition-colors duration-300"
    >
      <div className="container mx-auto">
        <SectionHeading
          label="Journey &amp; Education"
          title="Practical Experience &amp; Academic Background."
          description={
            <div className="w-full max-w-4xl mx-auto py-1">
              <CurvedLoop
                marqueeText="A timeline of my hands-on internships, continuous independent project development, and academic foundations in computer applications."
                shape="wave"
                speed={1.6}
                curveAmount={45}
                direction="left"
                fontSize={32}
                fontWeight={600}
                separator="✦"
                separatorColor={isDark ? '#2563EB' : '#4B2E2B'}
                color={isDark ? '#94A3B8' : '#5C4845'}
                edgeFade={0.15}
                interactive={true}
                pauseOnHover={true}
                scrollBoost={0.4}
              />
            </div>
          }
          align="center"
        />

        <div
          ref={timelineRef}
          className="relative max-w-3xl mx-auto py-6 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-5 sm:before:left-7 before:w-0.5 before:bg-[#E8DCCB] dark:before:bg-[#1E293B]"
        >
          {experience.map((item) => {
            const IconComponent = ICON_MAP[item.id] || Briefcase;
            return (
              <div key={item.id} className="relative pl-14 sm:pl-20 mb-10 last:mb-0">
                <div className="absolute left-5 sm:left-7 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#FFFFFF] dark:bg-[#0B0F19] border-2 border-[#4B2E2B] dark:border-[#2563EB] text-[#4B2E2B] dark:text-[#2563EB] flex items-center justify-center z-10 shadow-[0_0_0_4px_#E8DCCB] dark:shadow-[0_0_0_4px_#0B0F19]">
                  <IconComponent size={15} />
                </div>

                <div className="bg-[#E8DCCB] dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] rounded-lg p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:hover:shadow-black/70 hover:border-[#4B2E2B]/50 dark:hover:border-[#2563EB]/50">
                  <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[#241714] dark:text-[#FFFFFF] tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#4B2E2B] dark:text-[#60A5FA] bg-[#4B2E2B]/10 dark:bg-[#2563EB]/15 px-3 py-1 rounded-full whitespace-nowrap">
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-[#5C4845] dark:text-[#94A3B8] mb-3">
                    <strong className="text-[#241714] dark:text-[#FFFFFF]">{item.organization}</strong>
                    {item.location && (
                      <span className="opacity-80 text-xs flex items-center gap-1">
                        &bull; <MapPin size={11} className="inline" /> {item.location}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-sm leading-relaxed text-[#5C4845] dark:text-[#94A3B8] min-h-[60px]">
                    <TextType
                      text={[item.description]}
                      typingSpeed={30}
                      deletingSpeed={50}
                      pauseDuration={1500}
                      showCursor
                      cursorCharacter="_"
                      cursorStyle="underscore"
                      cursorBlinkDuration={0.5}
                      cursorColor="currentColor"
                      cursorGlide
                      deleteMode="none"
                      mistakes={0}
                      loop={false}
                      typeEffect="none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
