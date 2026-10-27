'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { scrollToSection, getWhatsAppUrl } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/animations';
import { InteractiveHoverButton } from '@/registry/magicui/interactive-hover-button';
import ThemeToggler from '@/components/ui/ThemeToggler';
import TrueFocus from '@/components/ui/TrueFocus';
import ScrambledText from '@/components/ui/ScrambledText';
import TextPressure from '@/components/ui/TextPressure';
import TextType from '@/components/ui/TextType';
import { GithubIcon, LinkedinIcon, WhatsAppIcon, FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';
import { useTheme } from '@/context/ThemeContext';

const Floating3DParticles = dynamic(
  () => import('@/registry/magicui/floating-3d-particles').then((m) => m.Floating3DParticles),
  { ssr: false }
);

const Lightning = dynamic(() => import('@/components/ui/Lightning'), { ssr: false });

export default function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const mentionRef = useRef(null);
  const ctaRef = useRef(null);
  const socialRef = useRef(null);
  
  const profileImageRef = useRef(null); 
  const scrollWrapperRef = useRef(null); 

  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.fromTo(
            badgeRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.1 }
          )
            .fromTo(
              titleRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8 },
              '-=0.3'
            )
            .fromTo(
              descRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6 },
              '-=0.4'
            )
            .fromTo(
              mentionRef.current,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5 },
              '-=0.3'
            )
            .fromTo(
              ctaRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6 },
              '-=0.3'
            )
            .fromTo(
              socialRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.5 },
              '-=0.3'
            )
            .fromTo(
              profileImageRef.current,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
              '-=0.8'
            );

          gsap.to(scrollWrapperRef.current, {
            x: 250,
            opacity: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: heroRef.current,
              start: '50% top',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        }, heroRef);
      });
    });

    return () => {
      if (ctx && ctx.revert) ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`relative min-h-screen flex items-center pt-32 pb-16 sm:pb-24 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19]' : 'bg-[#FFFFFF]'
      }`}
      suppressHydrationWarning
    >
      <Floating3DParticles
        color={isDark ? '#2563EB' : '#4B2E2B'}
        quantity={isMobile ? 30 : 90}
        size={4.5}
        opacity={0.4}
        drift={0.6}
        depth={0.75}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start relative z-10 pointer-events-auto">
            <div className="flex items-center gap-4 mb-6">
              <div
                ref={badgeRef}
                className={`inline-flex items-center gap-2.5 px-4 py-2 border rounded-full text-xs font-semibold tracking-widest uppercase transition-colors ${
                  isDark
                    ? 'bg-[#111827] border-[#1E293B] text-[#94A3B8] shadow-sm'
                    : 'bg-[#E8DCCB]/60 border-[#D8C7B3] text-[#241714]'
                }`}
                suppressHydrationWarning
              >
                <span
                  className={`w-2 h-2 rounded-full ring-4 animate-pulse ${
                    isDark ? 'bg-[#2563EB] ring-[#2563EB]/20' : 'bg-[#4B2E2B] ring-[#4B2E2B]/20'
                  }`}
                />
                <span>Web Developer &bull; Creative Technologist</span>
              </div>
              <ThemeToggler />
            </div>

            <h1 ref={titleRef} className="w-full mb-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight">
              <span className={`transition-colors block ${isDark ? 'text-[#FFFFFF]' : 'text-[#241714]'}`}>
                <TextType 
                  text="Turning Ideas Into" 
                  typingSpeed={60} 
                  loop={true}
                  pauseDuration={3000}
                  showCursor={false}
                  typeEffect="fade"
                />
              </span>
              
              <span className={`mt-2 block italic font-semibold transition-colors ${isDark ? 'text-[#2563EB]' : 'text-[#4B2E2B]'}`}>
                <TextType 
                  text="Digital Experiences." 
                  typingSpeed={75}
                  initialDelay={1200}
                  loop={true}
                  pauseDuration={3000}
                  cursorStyle="bar"
                  cursorColor={isDark ? '#2563EB' : '#4B2E2B'}
                  typeEffect="rise"
                />
              </span>
            </h1>

            <div
              ref={descRef}
              className={`font-body text-base sm:text-lg leading-relaxed mb-5 max-w-xl transition-colors ${
                isDark ? 'text-[#94A3B8]' : 'text-[#5C4845]'
              }`}
            >
              <ScrambledText effect="blur" trail={0.6} intro={true} scrambleChars=".:/=">
                I&apos;m Kartik Chauhan, a developer and creative problem-solver focused
                on building responsive websites, practical web applications, interactive
                experiences, and digital solutions for businesses.
              </ScrambledText>
            </div>

            <div
              ref={mentionRef}
              className={`text-sm leading-normal mb-8 max-w-lg pl-3.5 border-l-2 transition-colors ${
                isDark ? 'border-[#2563EB] text-[#94A3B8]' : 'border-[#4B2E2B] text-[#5C4845]'
              }`}
            >
              Specializing in <strong className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#241714]'}`}>Web Development</strong>,{' '}
              <strong className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#241714]'}`}>AI Workflow Automation</strong>,{' '}
              <strong className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#241714]'}`}>UI/Visual Design</strong>, and{' '}
              <strong className={`font-semibold ${isDark ? 'text-[#FFFFFF]' : 'text-[#241714]'}`}>Video Editing</strong>.
            </div>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-9 w-full sm:w-auto">
              <InteractiveHoverButton
                onClick={() => scrollToSection('projects', 80)}
                className={isDark ? 'bg-[#2563EB] border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8] text-white shadow-[#2563EB]/25' : ''}
              >
                View My Projects
              </InteractiveHoverButton>

              <button
                type="button"
                onClick={() => scrollToSection('contact', 80)}
                className={`inline-flex items-center justify-center px-6 py-3.5 rounded-full border bg-transparent text-sm font-medium hover:-translate-y-0.5 transition-all duration-200 ${
                  isDark
                    ? 'border-[#94A3B8]/40 text-[#94A3B8] hover:border-[#2563EB] hover:text-[#2563EB]'
                    : 'border-[#4B2E2B]/30 text-[#241714] hover:border-[#4B2E2B] hover:text-[#4B2E2B] hover:bg-[#E8DCCB]/30'
                }`}
                suppressHydrationWarning
              >
                <span>Let&apos;s Work Together</span>
              </button>
            </div>

            <div ref={socialRef} className="flex items-center gap-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#5C4845]'}`}>
                Connect:
              </span>
              <div className="flex items-center gap-3">
                {/* GitHub (Black/White depending on theme) */}
                <a
                  href="https://github.com/kartik-chauhan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className={`w-9 h-9 rounded-full border inline-flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#111827] border-[#1E293B] text-white hover:bg-white hover:text-black'
                      : 'bg-[#FFFFFF] border-[#D8C7B3] text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <GithubIcon size={17} />
                </a>
                
                {/* LinkedIn (#0A66C2) */}
                <a
                  href="https://linkedin.com/in/kartik-chauhan-136306343"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className={`w-9 h-9 rounded-full border inline-flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-sm ${
                    isDark ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#FFFFFF] border-[#D8C7B3]'
                  } text-[#0A66C2] hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white`}
                >
                  <LinkedinIcon size={17} />
                </a>
                
                {/* WhatsApp (#25D366) */}
                <a
                  href={getWhatsAppUrl('+91 9737275089', 'Hi Kartik, I saw your portfolio and would like to discuss a project!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact on WhatsApp"
                  className={`w-9 h-9 rounded-full border inline-flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-sm ${
                    isDark ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#FFFFFF] border-[#D8C7B3]'
                  } text-[#25D366] hover:bg-[#25D366] hover:border-[#25D366] hover:text-white`}
                >
                  <WhatsAppIcon size={17} />
                </a>
                
                {/* Facebook (#1877F2) */}
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  className={`w-9 h-9 rounded-full border inline-flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-sm ${
                    isDark ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#FFFFFF] border-[#D8C7B3]'
                  } text-[#1877F2] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white`}
                >
                  <FacebookIcon size={17} />
                </a>
                
                {/* Instagram (#E1306C) */}
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className={`w-9 h-9 rounded-full border inline-flex items-center justify-center hover:-translate-y-0.5 transition-all shadow-sm ${
                    isDark ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#FFFFFF] border-[#D8C7B3]'
                  } text-[#E1306C] hover:bg-[#E1306C] hover:border-[#E1306C] hover:text-white`}
                >
                  <InstagramIcon size={17} />
                </a>
              </div>
            </div>
          </div>

          <div 
            ref={scrollWrapperRef} 
            className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center order-first lg:order-last"
          >
            <div
              ref={profileImageRef}
              className="relative w-full max-w-[520px] sm:max-w-[620px] lg:max-w-[950px] aspect-square z-10 flex items-center justify-center"
            >
              <div 
                className="absolute inset-0 z-0 pointer-events-auto scale-125"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)',
                  maskImage: 'radial-gradient(circle, black 40%, transparent 75%)'
                }}
              >
                <Lightning
                  color={isDark ? '#2563EB' : '#4B2E2B'}
                  bolts={isMobile ? 1 : (isDark ? 4 : 3)}
                  spread={isMobile ? 0.6 : 0.9}
                  branches={isMobile ? 0.4 : 0.8}
                  xOffset={0}
                  angle={0}
                  size={isMobile ? 1.2 : 1.5}
                  thickness={isMobile ? 1.5 : 2}
                  glow={isMobile ? 1.5 : 2.5}
                  intensity={1.8}
                  speed={1.5}
                  flicker={isMobile ? 0.4 : 0.7}
                  mouseInteraction={!isMobile}
                  mouseStrength={1.8}
                  clickStrike={!isMobile}
                  intro={true}
                  fade={0.9}
                  opacity={isDark ? 1 : 0.85}
                  lightMode={!isDark}
                  dpr={isMobile ? 1 : 2}
                />
              </div>

              <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
                }}
              >
                <Image
                  src="/images/kk.png"
                  alt="Kartik Chauhan"
                  fill
                  priority
                  className="object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}