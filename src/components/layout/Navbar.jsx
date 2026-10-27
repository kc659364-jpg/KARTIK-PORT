'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggler from '@/components/ui/ThemeToggler';

const navLinks = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Skills', target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isDark } = useTheme();

  // Scroll state handle for background blur styling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extremely accurate scroll spy using IntersectionObserver
  const sectionIds = useMemo(() => navLinks.map((l) => l.target), []);

  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Updated rootMargin ensures accurate section highlighting
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-40% 0px -50% 0px' } 
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds]);

  // Smooth scroll handler
  const handleNavClick = useCallback((target) => {
    scrollToSection(target, 80);
    setIsMobileMenuOpen(false);
  }, []);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md shadow-sm dark:shadow-black/70 py-2.5 sm:py-3 border-b border-[#E8DCCB] dark:border-[#94A3B8]/20'
          : 'bg-transparent py-3 sm:py-4'
      }`}
      role="navigation"
      aria-label="Main navigation"
      suppressHydrationWarning
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16">
        
        {/* Logo & Brand Name */}
        <button
          type="button"
          className="inline-flex items-center gap-3 font-display hover:opacity-90 transition-opacity shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#4B2E2B]/50 dark:focus-visible:ring-[#2563EB]/50 rounded-lg"
          onClick={() => handleNavClick('hero')}
          aria-label="Scroll to top"
          suppressHydrationWarning
        >
          <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#4B2E2B]/20 dark:border-[#2563EB]/40 shrink-0 bg-[#E8DCCB]/40 dark:bg-[#2563EB]/10 shadow-sm">
            <Image
              alt="Kartik Chauhan Logo"
              className="object-cover"
              fill
              priority
              sizes="40px"
              src="/favicon.svg"
              unoptimized
            />
          </div>
          <span className="font-display font-bold text-[1.15rem] sm:text-xl text-[#241714] dark:text-[#FFFFFF] tracking-tight">
            Kartik Chauhan<span className="text-[#4B2E2B] dark:text-[#2563EB]">.</span>
          </span>
        </button>

        {/* New Smooth Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <ul className="flex items-center gap-1 bg-[#E8DCCB]/40 dark:bg-[#111827]/60 p-1.5 rounded-full border border-[#D8C7B3]/50 dark:border-[#1E293B]/50 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.target;
              return (
                <li key={link.target}>
                  <button
                    onClick={() => handleNavClick(link.target)}
                    className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-all duration-300 ease-out cursor-pointer ${
                      isActive
                        ? 'bg-[#4B2E2B] text-white dark:bg-[#2563EB] shadow-md scale-100'
                        : 'text-[#5C4845] dark:text-[#94A3B8] hover:text-[#241714] dark:hover:text-[#FFFFFF] hover:bg-[#D8C7B3]/40 dark:hover:bg-[#1E293B]/60 scale-95 hover:scale-100'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 border-l border-[#D8C7B3]/50 dark:border-[#1E293B]/50 pl-4 lg:pl-6">
            <ThemeToggler />
            <button
              type="button"
              className="font-body text-xs uppercase tracking-wider font-semibold text-white bg-[#4B2E2B] dark:bg-[#2563EB] hover:bg-[#38211E] dark:hover:bg-[#1D4ED8] px-5 py-2.5 rounded-full hover:-translate-y-0.5 transition-all duration-200 shadow-sm dark:shadow-lg dark:shadow-[#2563EB]/25 shrink-0"
              onClick={() => handleNavClick('contact')}
              suppressHydrationWarning
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>

        {/* Mobile Action Controls & Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggler />

          <button
            type="button"
            className="p-2 text-[#241714] dark:text-[#FFFFFF] hover:text-[#4B2E2B] dark:hover:text-[#2563EB] transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2E2B]/40 dark:focus:ring-[#2563EB]/40 bg-[#E8DCCB]/40 dark:bg-[#111827]/60 border border-[#D8C7B3]/50 dark:border-[#1E293B]/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            suppressHydrationWarning
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute top-0 right-0 w-[85vw] max-w-[320px] h-screen bg-[#FFFFFF] dark:bg-[#0B0F19] p-6 sm:p-8 pt-6 flex flex-col shadow-2xl border-l border-[#E8DCCB] dark:border-[#94A3B8]/20"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between pb-5 mb-4 border-b border-[#E8DCCB] dark:border-[#94A3B8]/20">
                <div className="flex items-center gap-2.5 font-display font-bold text-[#241714] dark:text-[#FFFFFF] text-base">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#4B2E2B]/30 dark:border-[#2563EB]/40 shrink-0 bg-[#E8DCCB]/30 dark:bg-[#2563EB]/10">
                    <Image
                      alt="Kartik Chauhan Logo"
                      className="object-cover"
                      fill
                      sizes="32px"
                      src="/favicon.svg"
                      unoptimized
                    />
                  </div>
                  <span>Kartik Chauhan</span>
                </div>
                <button
                  type="button"
                  className="p-1.5 text-[#241714]/70 dark:text-[#94A3B8] hover:text-[#241714] dark:hover:text-[#FFFFFF] rounded-lg hover:bg-[#E8DCCB]/40 dark:hover:bg-[#111827] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <ul className="flex flex-col gap-2 list-none m-0 p-0 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <li key={link.target}>
                    <button
                      type="button"
                      className={`w-full text-left font-body text-base font-medium p-3.5 rounded-xl transition-all duration-200 ${
                        activeSection === link.target
                          ? 'text-white bg-[#4B2E2B] dark:bg-[#2563EB] font-semibold shadow-sm translate-x-1'
                          : 'text-[#5C4845] dark:text-[#94A3B8] hover:text-[#241714] dark:hover:text-[#FFFFFF] hover:bg-[#E8DCCB]/40 dark:hover:bg-[#111827]'
                      }`}
                      onClick={() => handleNavClick(link.target)}
                      suppressHydrationWarning
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* CTA in mobile menu */}
              <button
                type="button"
                className="mt-6 w-full font-body text-sm uppercase tracking-wider font-semibold text-white bg-[#4B2E2B] dark:bg-[#2563EB] hover:bg-[#38211E] dark:hover:bg-[#1D4ED8] py-4 rounded-xl transition-all shadow-sm dark:shadow-[#2563EB]/25"
                onClick={() => handleNavClick('contact')}
                suppressHydrationWarning
              >
                Let&apos;s Talk
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}