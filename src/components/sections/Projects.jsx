'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import projects, { projectCategories } from '@/data/projects';
import { prefersReducedMotion } from '@/lib/animations';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [alertInfo, setAlertInfo] = useState({ show: false, title: '' }); 
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const ITEMS_PER_PAGE = 3;

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;

    let ctx;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
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
  }, [selectedCategory, currentPage]);

  const handleProjectClick = (e, project) => {
    if (project.underMaintenance) {
      e.preventDefault(); 
      setAlertInfo({ show: true, title: project.title });
    } else if (project.liveUrl !== '#') {
      e.preventDefault();
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else {
      e.preventDefault();
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-[#FFFFFF] dark:bg-[#0B0F19] py-24 sm:py-32 relative border-t border-[#E8DCCB] dark:border-[#1E293B] overflow-hidden transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Featured Work"
          title="Recent Projects &amp; Digital Products."
          description="A selection of independent web applications, management platforms, and interactive visual projects built with modern frontend and backend technologies."
          align="center"
        />

        {/* Filter Buttons */}
        <div className="flex justify-center items-center flex-wrap gap-2.5 mb-12" role="tablist" suppressHydrationWarning>
          {projectCategories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              suppressHydrationWarning
              className={`font-body text-xs sm:text-sm font-medium px-5 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4B2E2B] text-white border-[#4B2E2B] dark:bg-[#2563EB] dark:text-[#FFFFFF] dark:border-[#2563EB] shadow-sm'
                  : 'bg-[#E8DCCB] text-[#241714] border-[#D8C7B3] dark:bg-[#111827] dark:text-[#94A3B8] dark:border-[#1E293B] hover:text-[#4B2E2B] dark:hover:text-[#FFFFFF] hover:border-[#4B2E2B] dark:hover:border-[#2563EB]'
              }`}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Empty State for Video Edit */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto border-2 border-dashed border-[#D8C7B3] dark:border-[#1E293B] rounded-2xl">
            <span className="text-5xl mb-4">🎥</span>
            <h3 className="text-xl font-bold text-[#241714] dark:text-[#FFFFFF] mb-2">No Current Projects Here</h3>
            <p className="text-[#5C4845] dark:text-[#94A3B8] px-4">
              I am currently working on some exciting new video editing and visual projects. Check back soon to see the updates!
            </p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentProjects.map((project) => (
              <a 
                href={project.liveUrl}
                key={project.id} 
                onClick={(e) => handleProjectClick(e, project)} 
                className="group flex flex-col bg-[#FFFFFF] dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[#2563EB]/10 h-full"
              >
                {/* Image Wrapper with Hover Zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  {project.badge && (
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
                      {project.badge}
                    </span>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold tracking-tight text-[#241714] dark:text-[#FFFFFF] group-hover:text-[#4B2E2B] dark:group-hover:text-[#2563EB] transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-[#5C4845] dark:text-[#94A3B8] text-sm leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-dashed border-[#D8C7B3] dark:border-[#1E293B]">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[10px] font-semibold uppercase tracking-wider bg-[#E8DCCB] dark:bg-[#0B0F19] text-[#241714] dark:text-[#94A3B8] border border-[#D8C7B3] dark:border-[#1E293B] px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16" suppressHydrationWarning>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                suppressHydrationWarning
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 border ${
                  currentPage === page
                    ? 'bg-[#4B2E2B] text-white border-[#4B2E2B] dark:bg-[#2563EB] dark:text-[#FFFFFF] dark:border-[#2563EB] shadow-md'
                    : 'bg-transparent text-[#241714] border-[#D8C7B3] dark:text-[#94A3B8] dark:border-[#1E293B] hover:bg-[#E8DCCB] dark:hover:bg-[#111827]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Popup */}
      {alertInfo.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#111827] border border-[#D8C7B3] dark:border-[#1E293B] rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-[#241714] dark:text-[#FFFFFF] mb-2 flex items-center gap-2">
              <span className="text-amber-500 text-2xl">⚠️</span> Under Maintenance
            </h3>
            <p className="text-[#5C4845] dark:text-[#94A3B8] mb-6">
              The project <strong className="text-[#241714] dark:text-[#FFFFFF]">"{alertInfo.title}"</strong> is currently undergoing scheduled maintenance and updates. Please check back later.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAlertInfo({ show: false, title: '' })}
                suppressHydrationWarning
                className="px-5 py-2 rounded-full bg-[#E8DCCB] dark:bg-[#1E293B] text-[#241714] dark:text-[#FFFFFF] font-medium hover:bg-[#D8C7B3] dark:hover:bg-[#374151] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}