'use client';

import { useEffect, useRef } from 'react';

/**
 * Floating3DParticles - Magic UI
 * A pseudo-3D particle background that stays behind content with
 * continuous rotation, perspective projection, and buoyant upward drift.
 */
export function Floating3DParticles({
  color = '#b9825b',
  quantity = 120,
  size = 4,
  opacity = 0.45,
  drift = 0.6,
  depth = 0.7,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const actualQuantity = isMobile ? Math.round(quantity * 0.4) : quantity;

    // Parse hex or color string to RGB
    const hexToRgb = (hex) => {
      let clean = hex.replace('#', '').trim();
      if (clean.length === 3) {
        clean = clean
          .split('')
          .map((c) => c + c)
          .join('');
      }
      const num = parseInt(clean, 16);
      if (Number.isNaN(num)) return { r: 185, g: 130, b: 91 };
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    };

    const rgb = hexToRgb(color);

    const fov = 400;
    const zRange = 600 * Math.max(0.2, depth);

    // Generate 3D particle positions
    const particles = Array.from({ length: actualQuantity }, () => {
      return {
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * zRange - zRange * 0.3,
        baseRadius: Math.max(1, (Math.random() * 0.8 + 0.6) * size),
        baseOpacity: Math.max(0.1, (Math.random() * 0.6 + 0.4) * opacity),
        speedY: (Math.random() * 0.5 + 0.75) * drift,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    });

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    });
    resizeObserver.observe(canvas);

    let angle = 0;
    const rotSpeed = 0.0015;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angle += rotSpeed;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Buoyant upward drift with subtle organic float
        p.y -= p.speedY;
        p.x += Math.sin(angle * 2 + p.wobbleOffset) * 0.25;

        // Wrap boundaries
        const boundY = height * 0.75;
        const boundX = width * 0.75;

        if (p.y < -boundY) p.y = boundY;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;

        // Rotate in 3D around Y axis
        const rotX = p.x * cosA - p.z * sinA;
        const rotZ = p.x * sinA + p.z * cosA;

        // Perspective projection
        const perspective = fov / (fov + rotZ + 150);
        const screenX = centerX + rotX * perspective;
        const screenY = centerY + p.y * perspective;
        const currentRadius = Math.max(0.8, p.baseRadius * perspective);

        // Depth-based opacity fading
        const depthRatio = Math.max(0.05, Math.min(1, (rotZ + zRange * 0.5) / zRange));
        const finalOpacity = Math.max(0.05, Math.min(0.9, p.baseOpacity * depthRatio));

        ctx.beginPath();
        ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalOpacity})`;
        ctx.fill();

        // Soft ambient glow for closer particles
        if (currentRadius > 3.5) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, currentRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalOpacity * 0.2})`;
          ctx.fill();
        }
      }

      if (isInView && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let isInView = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const wasInView = isInView;
      isInView = entry.isIntersecting;
      if (isInView && !wasInView && !document.hidden) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    });
    visibilityObserver.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && isInView) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      resizeObserver.disconnect();
    };
  }, [color, quantity, size, opacity, drift, depth]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}

export default Floating3DParticles;
