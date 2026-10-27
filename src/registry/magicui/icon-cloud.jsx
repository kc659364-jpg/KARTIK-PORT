'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Interactive 3D Icon Cloud component
 * Projects icons onto a rotating 3D sphere using HTML5 Canvas.
 * Supports mouse interaction, auto-rotation, and depth scaling.
 *
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs to render in the cloud
 * @param {number} [props.radius=80] - Radius of the 3D sphere
 * @param {number} [props.size=220] - Canvas width and height
 */
export function IconCloud({ images = [], radius = 75, size = 200 }) {
  const canvasRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);

  // Preload all icon images
  useEffect(() => {
    if (!images || images.length === 0) return;

    let isMounted = true;
    const loaded = [];

    images.forEach((src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;

      img.onload = () => {
        if (!isMounted) return;
        loaded.push(img);
        if (loaded.length === images.length) {
          setLoadedImages([...loaded]);
        }
      };

      img.onerror = () => {
        // Fallback: try without double slug if simpleicons
        const singleSlug = src.replace(/\/([^/]+)\/\1$/, '/$1');
        if (singleSlug !== src) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.src = singleSlug;
          fallbackImg.onload = () => {
            if (!isMounted) return;
            loaded.push(fallbackImg);
            if (loaded.length === images.length) {
              setLoadedImages([...loaded]);
            }
          };
          fallbackImg.onerror = () => {
            if (!isMounted) return;
            // Still register so cloud draws available icons
            loaded.push(null);
            if (loaded.length === images.length) {
              setLoadedImages([...loaded]);
            }
          };
        } else {
          if (!isMounted) return;
          loaded.push(null);
          if (loaded.length === images.length) {
            setLoadedImages([...loaded]);
          }
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

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
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
          // Rotate around Y
          let x1 = p.x * cosY - p.z * sinY;
          let z1 = p.z * cosY + p.x * sinY;

          // Rotate around X
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
        // Draw soft circular background pill behind icon for contrast
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
        } catch (e) {
          // Ignore occasional draw error
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loadedImages, radius]);

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

