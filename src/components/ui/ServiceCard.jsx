'use client';

import { Globe, AppWindow, Bot, Palette, Video, Box, ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

const ICON_MAP = {
  Globe: Globe,
  AppWindow: AppWindow,
  Bot: Bot,
  Palette: Palette,
  Video: Video,
  Box: Box,
};

export default function ServiceCard({ service }) {
  const { title, description, icon, formValue } = service;
  const IconComponent = ICON_MAP[icon] || Globe;

  const handleClick = () => {
    // Dispatch custom event to notify contact form
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-service', { detail: formValue })
      );
    }
    // Smooth scroll to contact
    scrollToSection('contact', 80);
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-border-subtle p-7 sm:p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-caramel cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Inquire about ${title}`}
      suppressHydrationWarning
    >
      <div className="w-12 h-12 rounded-md bg-caramel/10 text-caramel flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-espresso group-hover:text-cream group-hover:scale-105">
        <IconComponent size={22} />
      </div>

      <h3 className="font-display text-lg font-semibold text-espresso mb-3 leading-snug">{title}</h3>
      <p className="text-sm text-muted-brown leading-relaxed mb-6 flex-1">{description}</p>

      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-caramel mt-auto transition-all group-hover:text-espresso group-hover:gap-3">
        <span>Inquire About This</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}
