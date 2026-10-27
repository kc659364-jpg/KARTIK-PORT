'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

/**
 * Magic UI InteractiveHoverButton (Dark Mode & Light Mode Tailwind Edition)
 */
export function InteractiveHoverButton({
  children,
  text,
  className = '',
  onClick,
  ...props
}) {
  const label = children || text || 'Button';

  return (
    <button
      type="button"
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#4B2E2B] dark:border-[#2563EB] bg-[#4B2E2B] dark:bg-[#2563EB] px-7 py-3.5 font-body text-sm font-medium text-white dark:text-[#FFFFFF] shadow-sm dark:shadow-lg dark:shadow-[#2563EB]/25 transition-all duration-300 hover:bg-[#38211E] dark:hover:bg-[#1D4ED8] hover:border-[#38211E] dark:hover:border-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${className}`}
      onClick={onClick}
      suppressHydrationWarning
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E8DCCB] dark:bg-white transition-all duration-300 group-hover:scale-150 group-hover:bg-white" />
        <span>{label}</span>
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
}

// Re-export scrollToSection
export { scrollToSection };

export default InteractiveHoverButton;
