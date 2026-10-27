'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Dynamic import with SSR disabled
const IconCloud = dynamic(() => import('@/registry/magicui/icon-cloud'), { ssr: false });

const SKILL_SLUG_MAP = {
  'HTML5': 'html5',
  'CSS3': 'css',
  'JavaScript': 'javascript',
  'React.js': 'react',
  'Bootstrap': 'bootstrap',
  'Tailwind CSS': 'tailwindcss',
  'Responsive Web Design': 'html5',
  'UI Development': 'figma',
  'PHP': 'php',
  'Node.js': 'nodedotjs',
  'Express.js': 'express',
  'REST APIs': 'postman',
  'MySQL': 'mysql',
  'MongoDB': 'mongodb',
  'GSAP': 'greensock',
  'Three.js': 'threedotjs',
  'ScrollTrigger': 'greensock',
  'Interactive UI': 'framer',
  'API Integration': 'fastapi',
  'AI Workflow Automation': 'huggingface',
  'UI/UX Design': 'figma',
  'Canva': 'figma',
  'Video Editing': 'blender',
  'Visual Design': 'figma',
  'Git': 'git',
  'GitHub': 'github',
  'Technical Documentation': 'markdown',
  'Basic Data Analysis': 'python',
  'System Troubleshooting': 'gnubash',
};

const CATEGORY_COMPLEMENTS = {
  frontend: ['nextdotjs', 'typescript', 'sass', 'vite'],
  backend: ['docker', 'postgresql', 'redis', 'json'],
  animation: ['blender', 'webgl', 'css', 'javascript'],
  creative: ['huggingface', 'blender', 'figma'],
  tools: ['npm', 'linux', 'postman'],
};

export default function SkillGroup({ group }) {
  const { id, title, skills = [] } = group;
  const { isDark } = useTheme();
  
  const [isHovered, setIsHovered] = useState(false);
  // 🔥 THE FIX: hasRendered state tracks if the card was EVER hovered
  // This prevents mounting 15 heavy canvases on initial load.
  const [hasRendered, setHasRendered] = useState(false);

  const groupIconUrls = useMemo(() => {
    const slugs = [];

    skills.forEach((skill) => {
      const slug = SKILL_SLUG_MAP[skill];
      if (slug && !slugs.includes(slug)) {
        slugs.push(slug);
      }
    });

    const complements = CATEGORY_COMPLEMENTS[id] || [];
    complements.forEach((slug) => {
      if (!slugs.includes(slug)) {
        slugs.push(slug);
      }
    });

    return slugs.map((slug) => `https://cdn.simpleicons.org/${slug}`);
  }, [id, skills]);

  const handleEnter = () => {
    setIsHovered(true);
    if (!hasRendered) setHasRendered(true); // Mount canvas only when first interacted
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="group relative w-[340px] sm:w-[360px] min-w-[340px] sm:min-w-[360px] h-[310px] bg-[#E8DCCB] dark:bg-[#111827] rounded-xl border border-[#D8C7B3] dark:border-[#1E293B] p-6 mx-3.5 overflow-hidden shadow-card dark:shadow-black/60 cursor-pointer transition-all duration-400 ease-out hover:bg-[#DFD0BD] dark:hover:bg-[#1E293B] hover:border-[#4B2E2B] dark:hover:border-[#2563EB] hover:shadow-xl hover:-translate-y-1"
      role="region"
      aria-label={`${title} skills`}
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {/* FRONT OF THE CARD */}
      <div className="absolute inset-6 flex flex-col justify-between opacity-100 scale-100 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95 group-hover:pointer-events-none">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#D8C7B3] dark:border-[#1E293B] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#4B2E2B] dark:bg-[#2563EB] ring-2 ring-[#4B2E2B]/20 dark:ring-[#2563EB]/20" />
            <h3 className="font-display text-lg font-semibold text-[#241714] dark:text-[#FFFFFF]">{title}</h3>
          </div>

          <div className="flex flex-wrap gap-2 flex-1 content-start">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#0B0F19] px-3 py-1 rounded-full border border-[#D8C7B3] dark:border-[#1E293B] transition-colors hover:bg-[#4B2E2B] dark:hover:bg-[#2563EB] hover:text-[#FFFFFF] dark:hover:text-[#FFFFFF] hover:border-[#4B2E2B] dark:hover:border-[#2563EB]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-[#D8C7B3] dark:border-[#1E293B] mt-auto">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4B2E2B] dark:text-[#2563EB] flex items-center gap-1.5">
            <Sparkles size={12} />
            <span>Hover for 3D Cloud</span>
          </span>
          <span className="text-[11px] text-[#5C4845] dark:text-[#94A3B8]">{skills.length} Technologies</span>
        </div>
      </div>

      {/* BACK OF THE CARD (HOVER STATE) */}
      <div className="absolute inset-3 flex flex-col items-center justify-center opacity-0 scale-95 transition-all duration-300 ease-out pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#241714] dark:text-[#FFFFFF] bg-[#FFFFFF]/90 dark:bg-[#111827]/90 px-3 py-1 rounded-full border border-[#4B2E2B]/30 dark:border-[#2563EB]/40 mb-1 shadow-sm relative z-10">
          {title}
        </span>
        
        {/* LAZY MOUNTING: Render IconCloud ONLY if user has interacted with this specific card */}
        {hasRendered && (
          <IconCloud images={groupIconUrls} radius={65} size={220} active={isHovered} />
        )}
      </div>
    </div>
  );
}