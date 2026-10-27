'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Ballpit({
  count = 150,
  gravity = 0,
  friction = 0.9975,
  wallBounce = 0.95,
  followCursor = true,
  colors = ['#F6F0E7', '#B9825B', '#77675D', '#E8D8C8'],
  minSize = 0.4,
  maxSize = 1.2,
  shadows = 0.6,
  lightIntensity = 1,
  lightColor = '#F6F0E7',
  exposure = 1,
  material = 'satin',
  depth = 2,
  drift = 0.4,
  bounce = 0.85,
  clickEffect = 'burst',
  intro = true,
  grab = true,
  cursorSize = 1,
  className = '',
}) {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const containerRef = useRef(null);
  const colorsKey = Array.isArray(colors) ? colors.join(',') : '';

  useEffect(() => {
    if (!isMounted) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.75));
    renderer.setSize(container.clientWidth || 300, container.clientHeight || 150);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 300) / (container.clientHeight || 150),
      0.1,
      100
    );
    camera.position.z = 18;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7 * lightIntensity);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(new THREE.Color(lightColor), 1.6 * lightIntensity);
    dirLight.position.set(10, 15, 12);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xb9825b, 0.8 * lightIntensity);
    backLight.position.set(-10, -10, -8);
    scene.add(backLight);

    // Ball Material
    const roughness = material === 'satin' ? 0.28 : 0.45;
    const metalness = material === 'satin' ? 0.12 : 0.05;
    const ballMaterial = new THREE.MeshStandardMaterial({
      roughness,
      metalness,
      envMapIntensity: shadows,
    });

    const sphereGeometry = new THREE.SphereGeometry(1, isMobile ? 14 : 24, isMobile ? 14 : 24);
    const instancedMesh = new THREE.InstancedMesh(sphereGeometry, ballMaterial, count);
    scene.add(instancedMesh);

    // Color conversion
    const threeColors = colors.map((c) => new THREE.Color(c));

    // Bounds calculation helper
    const getBounds = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFov / 2) * camera.position.z;
      const w = h * camera.aspect;
      return {
        x: w * 0.52,
        y: h * 0.52,
        z: Math.max(depth * 1.5, 3.5),
      };
    };

    let bounds = getBounds();

    // Initialize ball physics bodies
    const dummy = new THREE.Object3D();
    const balls = [];

    for (let i = 0; i < count; i += 1) {
      const radius = minSize + Math.random() * (maxSize - minSize);
      const color = threeColors[i % threeColors.length];
      instancedMesh.setColorAt(i, color);

      const spawnDist = intro ? (Math.random() * 2 + 1) : 1;
      balls.push({
        x: (Math.random() - 0.5) * (bounds.x * 1.8) * spawnDist,
        y: (Math.random() - 0.5) * (bounds.y * 1.8) * spawnDist,
        z: (Math.random() - 0.5) * (bounds.z * 1.6),
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vz: (Math.random() - 0.5) * 0.04,
        radius,
      });
    }

    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }

    // Pointer tracking
    const mouseWorld = new THREE.Vector3(9999, 9999, 0);
    const pointer = new THREE.Vector2(9999, 9999);
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const updateMouseWorld = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    };

    let isInView = false;

    const handlePointerMove = (e) => {
      if (!isInView) return;
      updateMouseWorld(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      mouseWorld.set(9999, 9999, 0);
    };

    // Burst click handler
    const handleClick = (e) => {
      if (!isInView || clickEffect !== 'burst') return;
      updateMouseWorld(e.clientX, e.clientY);
      const burstOriginX = mouseWorld.x;
      const burstOriginY = mouseWorld.y;
      const burstRadius = 9;
      const burstForce = 0.55;

      for (let i = 0; i < balls.length; i += 1) {
        const b = balls[i];
        const dx = b.x - burstOriginX;
        const dy = b.y - burstOriginY;
        const dz = b.z;
        const dist = Math.hypot(dx, dy, dz) || 0.001;

        if (dist < burstRadius) {
          const power = (1 - dist / burstRadius) * burstForce;
          b.vx += (dx / dist) * power;
          b.vy += (dy / dist) * power;
          b.vz += (dz / dist) * power * 0.5;
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    container.addEventListener('pointerleave', handlePointerLeave);

    // Animation & Physics Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      for (let i = 0; i < count; i += 1) {
        const b = balls[i];

        // Buoyant drift
        if (drift > 0) {
          b.vx += Math.sin(time * 0.8 + i) * 0.0006 * drift;
          b.vy += Math.cos(time * 0.7 + i * 1.3) * 0.0006 * drift;
          b.vz += Math.sin(time * 0.6 + i * 2.1) * 0.0004 * drift;
        }

        // Gravity & friction
        b.vy -= gravity * delta * 0.2;
        b.vx *= friction;
        b.vy *= friction;
        b.vz *= friction;

        // Cursor shove
        if (followCursor && mouseWorld.x < 9000) {
          const dx = b.x - mouseWorld.x;
          const dy = b.y - mouseWorld.y;
          const dist = Math.hypot(dx, dy);
          const reach = b.radius + cursorSize * 2.2;

          if (dist < reach && dist > 0.001) {
            const force = (1 - dist / reach) * 0.045;
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
          }
        }

        // Update position
        b.x += b.vx;
        b.y += b.vy;
        b.z += b.vz;

        // Container boundary bounce
        if (Math.abs(b.x) + b.radius > bounds.x) {
          b.x = Math.sign(b.x) * (bounds.x - b.radius);
          b.vx = -b.vx * wallBounce;
        }
        if (Math.abs(b.y) + b.radius > bounds.y) {
          b.y = Math.sign(b.y) * (bounds.y - b.radius);
          b.vy = -b.vy * wallBounce;
        }
        if (Math.abs(b.z) + b.radius > bounds.z) {
          b.z = Math.sign(b.z) * (bounds.z - b.radius);
          b.vz = -b.vz * wallBounce;
        }

        // Ball-to-ball soft collision with nearby balls
        for (let j = i + 1; j < Math.min(i + 8, count); j += 1) {
          const other = balls[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const dz = other.z - b.z;
          const dist = Math.hypot(dx, dy, dz);
          const minDist = b.radius + other.radius;

          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;

            b.x -= nx * overlap;
            b.y -= ny * overlap;
            b.z -= nz * overlap;
            other.x += nx * overlap;
            other.y += ny * overlap;
            other.z += nz * overlap;

            const dvx = b.vx - other.vx;
            const dvy = b.vy - other.vy;
            const dvz = b.vz - other.vz;
            const impulse = (dvx * nx + dvy * ny + dvz * nz) * bounce;

            b.vx -= nx * impulse;
            b.vy -= ny * impulse;
            b.vz -= nz * impulse;
            other.vx += nx * impulse;
            other.vy += ny * impulse;
            other.vz += nz * impulse;
          }
        }

        // Update instanced matrix
        dummy.position.set(b.x, b.y, b.z);
        dummy.scale.setScalar(b.radius);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      if (isInView && !document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const wasInView = isInView;
        isInView = entry.isIntersecting;
        if (isInView && !wasInView && !document.hidden) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    const onVisibilityChange = () => {
      if (!document.hidden && isInView) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 150;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      bounds = getBounds();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      ballMaterial.dispose();
      renderer.dispose();
    };
  }, [
    isMounted,
    count,
    gravity,
    friction,
    wallBounce,
    followCursor,
    colorsKey,
    minSize,
    maxSize,
    shadows,
    lightIntensity,
    lightColor,
    exposure,
    material,
    depth,
    drift,
    bounce,
    clickEffect,
    intro,
    grab,
    cursorSize,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${className}`}
      suppressHydrationWarning
    />
  );
}

