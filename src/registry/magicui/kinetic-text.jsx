'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * KineticText
 * Magic UI Kinetic Typography component.
 * Dynamically modulates font weight and optical scale per character based on pointer proximity.
 */
export function KineticText({
  text,
  as: Component = 'h2',
  className = '',
  baseWeight = 500,
  maxWeight = 900,
  proximityRadius = 120,
}) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const [weights, setWeights] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  // Parse words and characters for clean multi-line wrapping
  const words = useMemo(() => {
    return text.split(' ').map((word, wordIndex) => ({
      word,
      wordIndex,
      letters: word.split(''),
    }));
  }, [text]);

  // Total character count to ensure stable ref index
  let charCounter = 0;
  const wordData = useMemo(() => {
    let globalIdx = 0;
    return text.split(' ').map((word) => {
      const letters = word.split('').map((char) => {
        const item = { char, index: globalIdx };
        globalIdx++;
        return item;
      });
      return { word, letters };
    });
  }, [text]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const newWeights = {};

      letterRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(mouseX - centerX, mouseY - centerY);

        if (distance < proximityRadius) {
          // Smooth cosine falloff for organic wave
          const factor = Math.cos((distance / proximityRadius) * (Math.PI / 2));
          const weight = Math.round(baseWeight + (maxWeight - baseWeight) * factor);
          newWeights[index] = weight;
        } else {
          newWeights[index] = baseWeight;
        }
      });

      setWeights(newWeights);
    },
    [baseWeight, maxWeight, proximityRadius]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setWeights({});
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <Component
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block cursor-pointer select-none [font-optical-sizing:auto] ${className}`}
      aria-label={text}
    >
      {wordData.map((wordObj, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {wordObj.letters.map(({ char, index }) => {
            const currentWeight = weights[index] || baseWeight;
            return (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                className="inline-block transition-[font-weight,transform] duration-200 ease-out will-change-[font-weight,transform]"
                style={{
                  fontWeight: currentWeight,
                  fontVariationSettings: `'wght' ${currentWeight}`,
                  transform:
                    isHovered && weights[index] && weights[index] > baseWeight + 50
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                }}
                aria-hidden="true"
              >
                {char}
              </span>
            );
          })}
          {wordIndex < wordData.length - 1 && (
            <span className="inline-block" aria-hidden="true">
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </Component>
  );
}

export default KineticText;
