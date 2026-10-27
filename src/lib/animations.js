'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fade up animation for elements entering viewport
 * @param {string|Element|Element[]} targets - GSAP target(s)
 * @param {Object} options - Configuration
 * @returns {gsap.core.Tween|null}
 */
export function fadeInUp(targets, options = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }

  const {
    duration = 0.8,
    delay = 0,
    y = 40,
    stagger = 0,
    ease = 'power3.out',
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger,
    }
  );
}

/**
 * Fade in animation
 */
export function fadeIn(targets, options = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1 });
    return null;
  }

  const {
    duration = 0.6,
    delay = 0,
    stagger = 0,
    ease = 'power2.out',
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger,
    }
  );
}

/**
 * Scale in animation
 */
export function scaleIn(targets, options = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, scale: 1 });
    return null;
  }

  const {
    duration = 0.6,
    delay = 0,
    scale = 0.9,
    stagger = 0,
    ease = 'power2.out',
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, scale },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger,
    }
  );
}

/**
 * Create a scroll-triggered animation for a section
 * @param {string} triggerSelector - The trigger element selector
 * @param {Function} animationFn - Function that creates the animation
 * @param {Object} triggerOptions - ScrollTrigger options
 * @returns {ScrollTrigger|null}
 */
export function createScrollAnimation(triggerSelector, animationFn, triggerOptions = {}) {
  if (prefersReducedMotion()) return null;

  const defaults = {
    trigger: triggerSelector,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none none',
    ...triggerOptions,
  };

  return animationFn(defaults);
}

/**
 * Stagger children into view when parent scrolls in
 * @param {string} parentSelector - Parent container selector
 * @param {string} childSelector - Children to stagger
 * @param {Object} options - Animation options
 * @returns {gsap.core.Tween|null}
 */
export function staggerInView(parentSelector, childSelector, options = {}) {
  if (prefersReducedMotion()) {
    gsap.set(childSelector, { opacity: 1, y: 0 });
    return null;
  }

  const {
    y = 30,
    duration = 0.6,
    stagger = 0.1,
    ease = 'power3.out',
    start = 'top 80%',
  } = options;

  return gsap.fromTo(
    childSelector,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: parentSelector,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

/**
 * Cleanup all ScrollTrigger instances for a component
 * Call this in useEffect cleanup
 * @param {ScrollTrigger[]} triggers - Array of ScrollTrigger instances
 */
export function cleanupScrollTriggers(triggers = []) {
  triggers.forEach((trigger) => {
    if (trigger && trigger.kill) {
      trigger.kill();
    }
  });
}

/**
 * Cleanup GSAP tweens
 * @param {gsap.core.Tween[]} tweens - Array of tween instances
 */
export function cleanupTweens(tweens = []) {
  tweens.forEach((tween) => {
    if (tween && tween.kill) {
      tween.kill();
    }
  });
}

/**
 * Kill all ScrollTriggers associated with a specific element
 */
export function killScrollTriggersFor(element) {
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === element || (element && element.contains && element.contains(st.trigger))) {
      st.kill();
    }
  });
}
