'use client';

import { useEffect, useRef } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { NotchedProjectCard } from '@/components/ui/notched-project-card';
import { TextAnimate } from '@/registry/magicui/text-animate';
import { prefersReducedMotion } from '@/lib/animations';
import { scrollToSection } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function Services() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
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
        }, sectionRef);
      });
    });

    return () => {
      if (ctx && ctx.revert) ctx.revert();
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative transition-colors duration-300 border-t border-[#E8DCCB]/60 dark:border-[#1E293B]"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Services & Capabilities"
          title="Digital Solutions Tailored for Growth."
          description={
            <TextAnimate animation="blurInUp" by="character" once>
              From modern responsive websites to AI-assisted workflow automation, here is how I help startups, businesses, and creators build their digital presence.
            </TextAnimate>
          }
          align="center"
        />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-7 max-w-6xl mx-auto">
          {services.map((service) => {
            const handleServiceClick = (e) => {
              e.preventDefault(); // Prevent default anchor jump
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('select-service', { detail: service.formValue })
                );
              }
              scrollToSection('contact', 80);
            };

            return (
              <NotchedProjectCard
                key={service.id}
                accent={isDark ? '#2563EB' : '#4B2E2B'}
                accentForeground="#FFFFFF"
                description={service.description}
                href={service.href}
                image={service.image}
                monochrome={true} // Enables the black and white effect shown in image 2
                onClick={handleServiceClick}
                surface={isDark ? '#0B0F19' : '#FFFFFF'} // CRITICAL: Matches section bg for flawless notch
                tags={service.tags}
                title={service.title}
                // badge="2026" // Optional: Uncomment to add the pill badge at the top like image 2
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    id: "website-development",
    title: "Website Development",
    description: "Building responsive, modern websites for businesses, personal brands, and service providers.",
    icon: "Globe",
    formValue: "Website Development",
    image: "/img/photo1.avif",
    href: "#contact",
    tags: ["Responsive", "Business Websites"],
  },
  {
    id: "web-application",
    title: "Web Application Development",
    description: "Developing interactive web applications with structured components, API integrations, databases, and practical business functionality.",
    icon: "AppWindow",
    formValue: "Web Application Development",
    image: "/img/photo2.avif",
    href: "#contact",
    tags: ["Web Apps", "API Integrations"],
  },
  {
    id: "ai-automation",
    title: "AI Workflow Automation",
    description: "Helping businesses explore workflow automation, reduce repetitive work, and connect digital tools through suitable automation solutions.",
    icon: "Bot",
    formValue: "AI Workflow Automation",
    image: "/img/photo3.jpg",
    href: "#contact",
    tags: ["AI", "Automation"],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX and Visual Design",
    description: "Creating clean, user-friendly interfaces and polished digital visual experiences.",
    icon: "Palette",
    formValue: "UI/UX and Visual Design",
    image: "/img/photo4.jpg",
    href: "#contact",
    tags: ["UI/UX", "Visual Design"],
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Editing videos for websites, social media, promotional content, and digital presentations.",
    icon: "Video",
    formValue: "Video Editing",
    image: "/img/photo5.jpg",
    href: "#contact",
    tags: ["Social Media", "Promotional"],
  },
  {
    id: "interactive-3d",
    title: "Interactive 3D Websites",
    description: "Creating immersive website experiences using Three.js, GSAP, smooth transitions, and interactive visual elements.",
    icon: "Box",
    formValue: "Interactive 3D Website",
    image: "/img/photo6.jpg",
    href: "#contact",
    tags: ["Three.js", "GSAP"],
  },
];