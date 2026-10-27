'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import TextType from '@/components/ui/TextType';

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const {
    title,
    role,
    description,
    category,
    technologies = [],
    features = [],
    image = '/images/project-restopos-placeholder.svg',
    liveUrl,
    githubUrl,
    status = 'Completed',
  } = project;

  // Subtle 3D tilt on desktop
  const handleMouseMove = (e) => {
    if (!cardRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -5;
    const rY = ((x - centerX) / centerX) * 5;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const isCompleted = status.toLowerCase() === 'completed';

  return (
    <div
      ref={cardRef}
      className="perspective-1000 h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="group relative bg-[#E8DCCB] dark:bg-[#111827] rounded-lg border border-[#D8C7B3] dark:border-[#1E293B] overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover dark:hover:shadow-black/70 hover:border-[#4B2E2B]/50 dark:hover:border-[#2563EB]/50"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-[16/10] bg-[#1a110e] dark:bg-[#0B0F19] overflow-hidden">
          <Image
            src={image || '/images/project-restopos-placeholder.svg'}
            alt={`${title} preview`}
            width={600}
            height={375}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
            priority={false}
          />
          <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center pointer-events-none z-10">
            <span className="bg-[#4B2E2B]/85 dark:bg-[#0B0F19]/85 backdrop-blur-md text-white dark:text-[#FFFFFF] text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase border border-white/10 dark:border-[#1E293B]">
              {category}
            </span>
            <span
              className={`text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase ${
                isCompleted ? 'bg-emerald-700/90 text-white' : 'bg-amber-700/90 text-white'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          {role && (
            <span className="text-xs text-[#4B2E2B] dark:text-[#2563EB] font-semibold tracking-wider uppercase mb-1.5">
              {role}
            </span>
          )}
          <h3 className="font-display text-xl font-semibold text-[#241714] dark:text-[#FFFFFF] mb-3 leading-snug">
            {title}
          </h3>
          <div className="mt-1 mb-4 text-sm leading-relaxed text-[#5C4845] dark:text-[#94A3B8] min-h-[60px] flex-1">
            <TextType
              text={[description]}
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

          {/* Key Features */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-[#D8C7B3] dark:border-[#1E293B]">
              {features.map((feature, i) => (
                <span
                  key={i}
                  className="text-[11px] text-[#241714] dark:text-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#0B0F19] px-2 py-0.5 rounded border border-[#D8C7B3] dark:border-[#1E293B]"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {technologies.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-[#4B2E2B]/10 text-[#4B2E2B] dark:bg-[#2563EB]/15 dark:text-[#60A5FA] px-2.5 py-1 rounded-full border border-[#4B2E2B]/20 dark:border-[#2563EB]/30"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex gap-2.5 items-center mt-auto">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#4B2E2B] text-white dark:bg-[#2563EB] dark:text-[#FFFFFF] hover:bg-[#38211E] dark:hover:bg-[#1D4ED8] transition-all duration-200 hover:-translate-y-0.5 shadow-sm dark:shadow-[#2563EB]/25"
              >
                <span>Live Project</span>
                <ExternalLink size={13} />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-transparent text-[#241714] dark:text-[#94A3B8] border border-[#4B2E2B]/40 dark:border-[#1E293B] hover:border-[#4B2E2B] dark:hover:border-[#2563EB] hover:text-[#4B2E2B] dark:hover:text-[#FFFFFF] transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Source Code</span>
                <GithubIcon size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
