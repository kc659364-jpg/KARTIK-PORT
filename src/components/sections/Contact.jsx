'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import { getWhatsAppUrl } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/animations';
import { useTheme } from '@/context/ThemeContext';

const GridScan = dynamic(() => import('@/components/ui/GridScan'), { ssr: false });

export default function Contact() {
  const sectionRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);
  const { isDark } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const whatsappUrl = getWhatsAppUrl(
    '+91 9737275089',
    'Hello Kartik, I reviewed your portfolio and would like to inquire about your services.'
  );

  useEffect(() => {
    if (prefersReducedMotion() || !infoRef.current || !formRef.current) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            infoRef.current.children,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            }
          );

          gsap.fromTo(
            formRef.current,
            { opacity: 0, y: 30 },
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#E8DCCB] dark:bg-[#0B0F19] text-[#241714] dark:text-[#FFFFFF] py-24 sm:py-32 relative overflow-hidden transition-colors duration-300 border-t border-[#D8C7B3] dark:border-[#1E293B]"
    >
      {/* 3D GridScan bypassed on mobile */}
      {mounted && !isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <GridScan
            linesColor={isDark ? '#2563EB' : '#4B2E2B'}
            scanColor={isDark ? '#60A5FA' : '#FFFFFF'}
            cells={8}
            depth={3}
            scanDuration={2.4}
            scanDelay={1.6}
            lineThickness={1}
            depthFade={0.6}
            shading={0.7}
            reflection={0.35}
            points
            scanDirection="forward"
            scanWidth={1}
            trail={0.5}
            glow={0.8}
            parallax={1}
            autoScan
            interactive={false}
            lightMode={!isDark}
          />
        </div>
      )}

      <div className="container mx-auto relative z-10 pointer-events-auto drop-shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div ref={infoRef} className="lg:col-span-5 flex flex-col">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4B2E2B] dark:text-[#2563EB] mb-3">
              Get in Touch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241714] dark:text-[#FFFFFF] mb-5 leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="text-base text-[#5C4845] dark:text-[#94A3B8] leading-relaxed mb-8 max-w-md">
              Tell me a little about your idea, business, or project. I&apos;ll review your requirements and get back to you with insights and next steps.
            </p>

            <div className="flex flex-col gap-5 mb-9">
              <div className="group flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] text-[#4B2E2B] dark:text-[#2563EB] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-[#4B2E2B] dark:group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#4B2E2B] dark:group-hover:border-[#2563EB] shadow-sm">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5C4845] dark:text-[#94A3B8] mb-0.5">
                    Email Address
                  </span>
                  <a
                    href="mailto:kc659364@gmail.com"
                    className="text-sm sm:text-base text-[#241714] dark:text-[#FFFFFF] hover:text-[#4B2E2B] dark:hover:text-[#2563EB] transition-colors"
                  >
                    kc659364@gmail.com
                  </a>
                </div>
              </div>

              <div className="group flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] text-[#4B2E2B] dark:text-[#2563EB] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-[#4B2E2B] dark:group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#4B2E2B] dark:group-hover:border-[#2563EB] shadow-sm">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5C4845] dark:text-[#94A3B8] mb-0.5">
                    Phone / Mobile
                  </span>
                  <a
                    href="tel:+919737275089"
                    className="text-sm sm:text-base text-[#241714] dark:text-[#FFFFFF] hover:text-[#4B2E2B] dark:hover:text-[#2563EB] transition-colors"
                  >
                    +91 9737275089
                  </a>
                </div>
              </div>

              <div className="group flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] text-[#4B2E2B] dark:text-[#2563EB] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-[#4B2E2B] dark:group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#4B2E2B] dark:group-hover:border-[#2563EB] shadow-sm">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5C4845] dark:text-[#94A3B8] mb-0.5">
                    Location
                  </span>
                  <span className="text-sm sm:text-base text-[#241714] dark:text-[#FFFFFF]">
                    Jangipura, Surat, Gujarat, India
                  </span>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#20BA5A] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20 self-start mb-8"
            >
              <MessageSquare size={17} />
              <span>Message on WhatsApp</span>
            </a>

            <div className="flex items-center gap-3 pt-6 border-t border-[#D8C7B3] dark:border-[#1E293B]">
              <a
                href="https://github.com/kartik-chauhan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] text-[#241714] dark:text-[#FFFFFF] flex items-center justify-center hover:bg-[#4B2E2B] dark:hover:bg-[#2563EB] hover:text-white hover:border-[#4B2E2B] dark:hover:border-[#2563EB] hover:-translate-y-0.5 transition-all shadow-sm"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://linkedin.com/in/kartik-chauhan-136306343"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] text-[#241714] dark:text-[#FFFFFF] flex items-center justify-center hover:bg-[#4B2E2B] dark:hover:bg-[#2563EB] hover:text-white hover:border-[#4B2E2B] dark:hover:border-[#2563EB] hover:-translate-y-0.5 transition-all shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <div ref={formRef} className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] rounded-2xl p-7 sm:p-10 shadow-2xl backdrop-blur-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}