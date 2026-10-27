'use client';

import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollVelocityContainer
 * Wrapper container for scroll-based velocity rows
 */
export function ScrollVelocityContainer({ children, className = '', ...props }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ScrollVelocityRow
 * A marquee row that animates continuously and accelerates with user scroll velocity.
 * Pauses on hover so interactive cards (like 3D Icon Clouds) can be explored easily.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.baseVelocity=5] - Base speed
 * @param {number} [props.direction=1] - 1 for left/forward, -1 for right/reverse
 * @param {string} [props.className='']
 * @param {number} [props.numCopies=4] - Number of duplicate sets for seamless loop
 * @param {boolean} [props.pauseOnHover=true] - Whether to pause scrolling when hovering
 */
export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className = '',
  numCopies = 4,
  pauseOnHover = true,
  ...props
}) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    let animId;
    let isInView = true;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentX = 0;
    let lastTime = performance.now();

    const onScroll = () => {
      if (!isInView) return;
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      // Boost velocity proportional to scroll speed
      scrollVelocity = deltaY * 0.15;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const animate = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Dampen scroll velocity towards zero
      scrollVelocity *= 0.92;

      // If paused on hover, don't advance position
      if (!isHoveredRef.current) {
        const effectiveSpeed = (baseVelocity * 20 + scrollVelocity * 50) * direction;
        currentX += effectiveSpeed * deltaTime;
      }

      if (scrollerRef.current) {
        const setWidth = scrollerRef.current.scrollWidth / numCopies;
        if (setWidth > 0) {
          if (direction > 0) {
            if (currentX >= setWidth) {
              currentX -= setWidth;
            } else if (currentX < 0) {
              currentX += setWidth;
            }
          } else {
            if (currentX <= -setWidth) {
              currentX += setWidth;
            } else if (currentX > 0) {
              currentX -= setWidth;
            }
          }

          scrollerRef.current.style.transform = `translate3d(${-currentX}px, 0, 0)`;
        }
      }

      if (isInView && !document.hidden) {
        animId = requestAnimationFrame(animate);
      }
    };

    const container = containerRef.current;
    let observer;
    if (container && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const wasInView = isInView;
          isInView = entry.isIntersecting;
          if (isInView && !wasInView && !document.hidden) {
            lastTime = performance.now();
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const onVisibilityChange = () => {
      if (!document.hidden && isInView) {
        lastTime = performance.now();
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, [baseVelocity, direction, numCopies]);

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => {
        if (pauseOnHover) isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) isHoveredRef.current = false;
      }}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'flex',
        width: '100%',
        willChange: 'transform',
      }}
      {...props}
    >
      <div
        ref={scrollerRef}
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {Array.from({ length: numCopies }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            aria-hidden={copyIndex > 0 ? 'true' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollVelocityContainer;
