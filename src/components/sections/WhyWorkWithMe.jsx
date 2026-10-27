'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Target, Smartphone, Sparkles, Layers } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { prefersReducedMotion } from '@/lib/animations';
import { useTheme } from '@/context/ThemeContext';

const AeroShards = dynamic(() => import('@/components/ui/AeroShards'), { ssr: false });
const FallingText = dynamic(() => import('@/components/ui/FallingText'), { ssr: false });

const VALUES = [
  {
    icon: Target,
    title: 'Practical Problem-Solving',
    description:
      'I focus on building useful digital solutions around real requirements, ensuring every feature serves a distinct purpose.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Development',
    description:
      'I aim to create interfaces that work smoothly across desktop, tablet, and mobile with fluid layouts and touch-friendly controls.',
  },
  {
    icon: Sparkles,
    title: 'Creative Experiences',
    description:
      'I combine development with interactive design, animation, and visual presentation to deliver distinctive web presences.',
  },
  {
    icon: Layers,
    title: 'Maintainable Structure',
    description:
      'I prefer reusable components and organized code that can be improved, extended, and maintained easily over time.',
  },
];

function InteractiveCard({ item }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const iconRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (prefersReducedMotion() || !iconRef.current) return;
    let tween;
    import('gsap').then(({ gsap }) => {
      if (!iconRef.current) return;
      tween = gsap.to(iconRef.current, {
        rotateY: 360,
        duration: 4,
        repeat: -1,
        ease: 'linear',
        transformOrigin: 'center center',
      });
    });

    return () => {
      if (tween && tween.kill) tween.kill();
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    const rotateX = Math.round(normalizedY * -20 * 100) / 100;
    const rotateY = Math.round(normalizedX * 20 * 100) / 100;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  const Icon = item.icon;

  // Soft rainbow colors that look good in both light and dark modes
  const rainbowBackground = isDark 
    ? 'linear-gradient(124deg, rgba(255,0,0,0.15), rgba(255,165,0,0.15), rgba(255,255,0,0.15), rgba(0,128,0,0.15), rgba(0,0,255,0.15), rgba(75,0,130,0.15), rgba(238,130,238,0.15))'
    : 'linear-gradient(124deg, rgba(255,0,0,0.1), rgba(255,165,0,0.1), rgba(255,255,0,0.1), rgba(0,128,0,0.1), rgba(0,0,255,0.1), rgba(75,0,130,0.1), rgba(238,130,238,0.1))';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
      }}
      className="group relative bg-[#E8DCCB] dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] rounded-lg p-7 flex flex-col overflow-hidden transition-transform duration-200 ease-out hover:shadow-card-hover dark:hover:shadow-black/70 hover:border-[#4B2E2B]/50 dark:hover:border-[#2563EB]/50"
    >
      {/* Rainbow Animated Background Effect on Hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage: rainbowBackground,
          backgroundSize: '400% 400%',
          animation: 'rainbowHoverCard 4s ease infinite',
        }}
      />
      
      <div
        ref={iconRef}
        className="relative z-10 w-12 h-12 rounded-xl bg-[#4B2E2B]/10 text-[#4B2E2B] dark:bg-[#2563EB]/15 dark:text-[#60A5FA] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#4B2E2B] dark:group-hover:bg-[#2563EB] group-hover:text-white dark:group-hover:text-white shadow-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Icon size={20} />
      </div>
      <h3 className="relative z-10 font-display text-base font-semibold text-[#241714] dark:text-[#FFFFFF] mb-3 leading-snug">
        {item.title}
      </h3>
      <p className="relative z-10 text-xs sm:text-sm text-[#5C4845] dark:text-[#94A3B8] leading-relaxed m-0">
        {item.description}
      </p>
    </div>
  );
}

export default function WhyWorkWithMe() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
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

  return (
    <section
      id="why-work-with-me"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative border-t border-[#E8DCCB] dark:border-[#1E293B] overflow-hidden transition-colors duration-300"
    >
      {/* Adding custom keyframes globally just for these effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rainbowTextWipe {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        @keyframes rainbowHoverCard {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />

      {/* AeroShards WebGPU Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <AeroShards
          count={isMobile ? 160 : 700}
          shardColor={isDark ? '#2563EB' : '#4B2E2B'}
          accentColor={isDark ? '#3B82F6' : '#784C47'}
          backgroundColor="transparent"
          material="glass"
          placement="full"
          spread={1.5}
          depthOfField={0.8}
          lightMode={!isDark}
          mouseInteraction={!isMobile}
          pulseOnClick={!isMobile}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <SectionHeading
          label="My Approach"
          title={
            <span 
              className="inline-block text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                backgroundSize: '200% auto',
                animation: 'rainbowTextWipe 4s linear infinite',
              }}
            >
              Why Work With Me.
            </span>
          }
          description="" 
          align="center"
        />

        {/* FallingText Integration replacing the static description */}
        <div className="w-full max-w-3xl mx-auto h-[120px] sm:h-[150px] flex items-center justify-center -mt-6 mb-12 relative z-20 cursor-pointer">
          <FallingText
            text="Clear communication, practical architectural decisions, and an eye for creative detail in every project."
            highlightWords={["communication,", "practical", "creative", "detail"]}
            trigger="hover" 
            backgroundColor="transparent"
            variant="text"
            fontSize="1.1rem"
            theme={isDark ? 'dark' : 'light'}
            accentColor={isDark ? '#2563EB' : '#4B2E2B'}
          />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((item, index) => (
            <InteractiveCard item={item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}