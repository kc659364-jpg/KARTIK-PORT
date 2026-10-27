'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggler({ className = '' }) {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-14 h-8 rounded-full bg-border-subtle/50 dark:bg-neutral-800 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex h-8 w-15 items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        isDark
          ? 'bg-neutral-900 border border-neutral-700/80 shadow-[0_0_12px_rgba(77,107,255,0.25)]'
          : 'bg-caramel/15 border border-caramel/30 shadow-inner'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      suppressHydrationWarning
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-all duration-300 ease-out ${
          isDark
            ? 'translate-x-7 bg-blue-600 text-white shadow-blue-500/40'
            : 'translate-x-0 bg-white text-caramel'
        }`}
      >
        {isDark ? <Moon size={13} className="text-white" /> : <Sun size={13} className="text-caramel" />}
      </span>
    </button>
  );
}
