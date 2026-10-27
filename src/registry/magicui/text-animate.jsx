'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * TextAnimate - MagicUI Typography Animation Component
 * Smoothly animates characters, words, or lines into view with staggered blur, fade, and translation.
 */
export function TextAnimate({
  children,
  animation = 'blurInUp',
  by = 'character',
  once = true,
  as: Component = 'p',
  className = '',
  delay = 0,
  duration = 0.5,
  stagger = 0.015,
  ...props
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    // Skip observer if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const textContent = typeof children === 'string' ? children : String(children || '');

  // Parse words and characters preserving word-boundary line wrapping
  const words = useMemo(() => {
    return textContent.split(' ').map((word) => ({
      word,
      chars: Array.from(word),
    }));
  }, [textContent]);

  // Animation variants mapping
  const getInitialStyle = () => {
    switch (animation) {
      case 'blurInUp':
        return {
          opacity: 0,
          filter: 'blur(10px)',
          transform: 'translate3d(0, 18px, 0)',
        };
      case 'blurIn':
        return {
          opacity: 0,
          filter: 'blur(10px)',
          transform: 'translate3d(0, 0, 0)',
        };
      case 'slideUp':
        return {
          opacity: 0,
          filter: 'blur(0px)',
          transform: 'translate3d(0, 20px, 0)',
        };
      case 'fadeIn':
      default:
        return {
          opacity: 0,
          filter: 'blur(0px)',
          transform: 'translate3d(0, 0, 0)',
        };
    }
  };

  const activeStyle = {
    opacity: 1,
    filter: 'blur(0px)',
    transform: 'translate3d(0, 0, 0)',
  };

  let globalCharIndex = 0;

  return (
    <Component
      ref={containerRef}
      className={`inline-block leading-relaxed ${className}`}
      {...props}
    >
      {by === 'character' ? (
        words.map((wordObj, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {wordObj.chars.map((char) => {
              const charIdx = globalCharIndex;
              globalCharIndex += 1;
              const charDelay = delay + charIdx * stagger;

              return (
                <span
                  key={charIdx}
                  className="inline-block will-change-[transform,opacity,filter]"
                  style={{
                    transitionProperty: 'opacity, filter, transform',
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: 'cubic-bezier(0.2, 0.65, 0.3, 0.9)',
                    transitionDelay: `${charDelay}s`,
                    ...(isInView ? activeStyle : getInitialStyle()),
                  }}
                >
                  {char}
                </span>
              );
            })}
            {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))
      ) : by === 'word' ? (
        words.map((wordObj, wordIdx) => {
          const wordDelay = delay + wordIdx * (stagger * 3);
          return (
            <span key={wordIdx} className="inline-block">
              <span
                className="inline-block will-change-[transform,opacity,filter]"
                style={{
                  transitionProperty: 'opacity, filter, transform',
                  transitionDuration: `${duration}s`,
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.65, 0.3, 0.9)',
                  transitionDelay: `${wordDelay}s`,
                  ...(isInView ? activeStyle : getInitialStyle()),
                }}
              >
                {wordObj.word}
              </span>
              {wordIdx < words.length - 1 && <span>&nbsp;</span>}
            </span>
          );
        })
      ) : (
        <span
          className="inline-block will-change-[transform,opacity,filter]"
          style={{
            transitionProperty: 'opacity, filter, transform',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'cubic-bezier(0.2, 0.65, 0.3, 0.9)',
            transitionDelay: `${delay}s`,
            ...(isInView ? activeStyle : getInitialStyle()),
          }}
        >
          {textContent}
        </span>
      )}
    </Component>
  );
}

export default TextAnimate;
