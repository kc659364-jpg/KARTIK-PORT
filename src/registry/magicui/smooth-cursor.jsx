'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function SmoothCursor() {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!isMounted) return undefined;
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!cursor || !finePointer.matches) return undefined;

    let frameId = 0;
    let visible = false;
    let positionX = 0;
    let positionY = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      const ease = reducedMotion.matches ? 1 : 0.18;
      positionX += (targetX - positionX) * ease;
      positionY += (targetY - positionY) * ease;

      cursor.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`;
      frameId = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        positionX = targetX;
        positionY = targetY;
        cursor.style.opacity = '1';
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerLeave = () => {
      visible = false;
      cursor.style.opacity = '0';
      window.cancelAnimationFrame(frameId);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      suppressHydrationWarning
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,
        marginLeft: -16,
        marginTop: -16,
        pointerEvents: 'none',
        opacity: 0,
        willChange: 'transform',
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <span className="block text-3xl -scale-x-100 drop-shadow-md" suppressHydrationWarning>
        🏃‍♂️
      </span>
    </div>
  );
}
