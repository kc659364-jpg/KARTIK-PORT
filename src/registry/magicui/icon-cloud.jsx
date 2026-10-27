'use client';

import React, { useEffect, useRef, useState } from 'react';

// Global shared cache for icon image elements to avoid duplicate network downloads
const iconImageCache = new Map();

/**
 * Interactive 3D Icon Cloud component
 * Projects icons onto a rotating 3D sphere using HTML5 Canvas.
 * Supports mouse interaction, auto-rotation, and depth scaling.
 *
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs to render in the cloud
 * @param {number} [props.radius=80] - Radius of the 3D sphere
 * @param {number} [props.size=220] - Canvas width and height
 * @param {boolean} [props.active=true] - Whether to actively run the animation loop
 */
export function IconCloud({ images = [], radius = 75, size = 200, active = true }) {
  const canvasRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);

  // Preload and cache icon images
  useEffect(() => {
    if (!images || images.length === 0) return;

    let isMounted = true;
    const loaded = [];
    let pending = images.length;

    const checkComplete = () => {
      if (pending === 0 && isMounted) {
        setLoadedImages(images.map((src) => iconImageCache.get(src)).filter(Boolean));
      }
    };

    images.forEach((src) => {
      if (iconImageCache.has(src)) {
        pending -= 1;
        checkComplete();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;

      img.onload = () => {
        iconImageCache.set(src, img);
        pending -= 1;
        checkComplete();
      };

      img.onerror = () => {
        const singleSlug = src.replace(/\/([^/]+)\/\1$/, '/$1');
        if (singleSlug !== src) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.src = singleSlug;
          fallbackImg.onload = () => {
            iconImageCache.set(src, fallbackImg);
            pending -= 1;
            checkComplete();
          };
          fallbackImg.onerror = () => {
            pending -= 1;
            checkComplete();
          };
        } else {
          pending -= 1;
          checkComplete();
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, [images]);

  // 3D Sphere animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let rotationX = 0;
    let rotationY = 0;
    let targetSpeedX = 0.006;
    let targetSpeedY = 0.008;
    let isInView = true;

    const activeIcons = loadedImages.filter(Boolean);
    const count = activeIcons.length;
    if (count === 0) return;

    // Distribute points on sphere using Fibonacci spiral
    const points = activeIcons.map((img, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      return {
        img,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      targetSpeedY = mouseX * 0.03;
      targetSpeedX = -mouseY * 0.03;
    };

    const handleMouseLeave = () => {
      targetSpeedX = 0.006;
      targetSpeedY = 0.008;
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rotationX += targetSpeedX;
      rotationY += targetSpeedY;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const focalLength = 300;

      // Transform, sort by depth (z) to render back-to-front
      const projected = points
        .map((p) => {
          let x1 = p.x * cosY - p.z * sinY;
          let z1 = p.z * cosY + p.x * sinY;

          let y2 = p.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + p.y * sinX;

          const scale = focalLength / (focalLength - z2);
          const screenX = centerX + x1 * scale;
          const screenY = centerY + y2 * scale;
          const alpha = Math.max(0.25, Math.min(1, (z2 + radius) / (2 * radius) + 0.2));
          const iconSize = Math.max(18, 32 * scale);

          return {
            img: p.img,
            screenX,
            screenY,
            z: z2,
            iconSize,
            alpha,
          };
        })
        .sort((a, b) => a.z - b.z);

      // Draw icons
      projected.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;

        const half = p.iconSize / 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, half + 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(185, 130, 91, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        try {
          ctx.drawImage(
            p.img,
            p.screenX - half,
            p.screenY - half,
            p.iconSize,
            p.iconSize
          );
        } catch {
          // Ignore occasional draw error
        }

        ctx.restore();
      });

      if (active && isInView && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        const wasInView = isInView;
        isInView = entry.isIntersecting;
        if (isInView && !wasInView && active && !document.hidden) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        } else if (!isInView && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
      observer.observe(canvas);
    }

    const onVisibility = () => {
      if (!document.hidden && active && isInView) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Initial render frame to draw static preview
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loadedImages, radius, active]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'block',
          cursor: 'grab',
        }}
      />
    </div>
  );
}

export default IconCloud;

