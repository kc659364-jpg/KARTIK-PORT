'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import { scrollToSection, getWhatsAppUrl } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const Ballpit = dynamic(() => import('@/components/ui/Ballpit'), { ssr: false });

const DARK_BALL_COLORS = ['#2563EB', '#1D4ED8', '#94A3B8', '#FFFFFF'];
const LIGHT_BALL_COLORS = ['#4B2E2B', '#E8DCCB', '#241714', '#FFFFFF'];

const NAV_LINKS = [
  { label: 'Home', target: 'hero' },
  { label: 'About Me', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Technical Skills', target: 'skills' },
  { label: 'Featured Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
];

export default function Footer() {
  const currentYear = 2026;
  const { isDark } = useTheme();
  
  const footerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // 🔥 THE FIX: Scroll-based lazy loading state for Ballpit
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🔥 THE FIX: Only load Ballpit when user scrolls near the Footer
  useEffect(() => {
    if (!footerRef.current || isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad3D(true);
          observer.disconnect(); // Stop observing once triggered
        }
      },
      // Trigger load when the footer is 600px away from the viewport
      { rootMargin: '600px 0px' }
    );
    
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const whatsappUrl = getWhatsAppUrl(
    '+91 9737275089',
    'Hi Kartik, I saw your portfolio and would like to discuss a project!'
  );

  const handleNavClick = (target) => {
    scrollToSection(target, 80);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#241714] dark:bg-[#0B0F19] text-[#FFFFFF] pt-20 pb-8 border-t border-[#4B2E2B] dark:border-[#1E293B] relative overflow-hidden transition-colors duration-300 min-h-[460px] z-10"
      role="contentinfo"
      suppressHydrationWarning
    >
      {/* 🔥 THE FIX: Strictly Scroll-Triggered on Desktop, Bypassed on Mobile */}
      {mounted && !isMobile && load3D && (
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none animate-fade-in transition-opacity duration-1000">
          <Ballpit
            count={130}
            gravity={0}
            friction={0.9975}
            wallBounce={0.95}
            followCursor={true}
            colors={isDark ? DARK_BALL_COLORS : LIGHT_BALL_COLORS}
            minSize={0.4}
            maxSize={1.2}
            shadows={0.6}
            lightIntensity={1}
            lightColor={isDark ? '#2563EB' : '#E8DCCB'}
            exposure={1}
            material="satin"
            depth={2}
            drift={0.4}
            bounce={0.85}
            clickEffect="burst"
            intro={true}
            grab={true}
            cursorSize={1}
          />
        </div>
      )}

      <div className="container mx-auto relative z-10 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-6 flex flex-col gap-4 max-w-sm">
            <button
              type="button"
              onClick={scrollToTop}
              className="font-display text-2xl font-bold text-white dark:text-[#FFFFFF] tracking-tight text-left hover:opacity-90 transition-opacity"
              aria-label="Scroll to top"
              suppressHydrationWarning
            >
              KC<span className="text-[#E8DCCB] dark:text-[#2563EB]">.</span>
            </button>

            <p className="text-[#E8DCCB]/80 dark:text-[#94A3B8] text-sm leading-relaxed">
              Kartik Chauhan — Web Developer &amp; Creative Technologist crafting responsive websites, practical web applications, and interactive digital experiences.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-base font-semibold text-white dark:text-[#FFFFFF] mb-4">Navigation</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {NAV_LINKS.map((link) => (
                <li key={link.target}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.target)}
                    className="text-[#E8DCCB]/75 dark:text-[#94A3B8] hover:text-white dark:hover:text-[#2563EB] text-sm transition-all duration-200 hover:translate-x-1 text-left"
                    suppressHydrationWarning
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-base font-semibold text-white dark:text-[#FFFFFF] mb-4">Connect</h4>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              <li>
                <a
                  href="https://github.com/kartik-chauhan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#E8DCCB]/75 dark:text-[#94A3B8] hover:text-white dark:hover:text-[#2563EB] text-sm transition-all duration-200 hover:translate-x-1"
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/kartik-chauhan-136306343"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#E8DCCB]/75 dark:text-[#94A3B8] hover:text-white dark:hover:text-[#2563EB] text-sm transition-all duration-200 hover:translate-x-1"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:kc659364@gmail.com"
                  className="inline-flex items-center gap-2.5 text-[#E8DCCB]/75 dark:text-[#94A3B8] hover:text-white dark:hover:text-[#2563EB] text-sm transition-all duration-200 hover:translate-x-1"
                >
                  <Mail size={16} />
                  <span>kc659364@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#E8DCCB]/75 dark:text-[#94A3B8] hover:text-white dark:hover:text-[#2563EB] text-sm transition-all duration-200 hover:translate-x-1"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#4B2E2B] dark:border-[#1E293B] text-xs text-[#E8DCCB]/70 dark:text-[#94A3B8]/70 gap-4">
          <p>&copy; {currentYear} Kartik Chauhan. Designed &amp; Developed with Next.js, Three.js &amp; GSAP.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 bg-[#4B2E2B] dark:bg-[#111827] border border-[#E8DCCB]/30 dark:border-[#1E293B] px-4 py-2 rounded-full text-xs text-[#E8DCCB] dark:text-[#94A3B8] hover:bg-[#38211E] dark:hover:bg-[#2563EB] hover:text-white dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            aria-label="Back to top of page"
            suppressHydrationWarning
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}