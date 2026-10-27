'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './PaperCrumple.css';

export function constrain(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function spring(current, target, velocity, tension = 160, friction = 14, dt = 0.016) {
  const force = -tension * (current - target);
  const damping = -friction * velocity;
  const acceleration = force + damping;
  const nextVelocity = velocity + acceleration * dt;
  const nextPosition = current + nextVelocity * dt;
  return [nextPosition, nextVelocity];
}

export function createPaperPath(width, height, cols = 40, rows = 50, seed = 42) {
  const count = (cols + 1) * (rows + 1);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const layers = new Float32Array(count);
  const foldAngles = new Float32Array(count);

  let pseudoRandom = seed;
  const rand = () => {
    pseudoRandom = (pseudoRandom * 9301 + 49297) % 233280;
    return pseudoRandom / 233280;
  };

  let ptr3 = 0;
  let ptr2 = 0;
  let ptr1 = 0;

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y = (0.5 - v) * height;

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = (u - 0.5) * width;

      positions[ptr3] = x;
      positions[ptr3 + 1] = y;
      positions[ptr3 + 2] = 0;

      normals[ptr3] = 0;
      normals[ptr3 + 1] = 0;
      normals[ptr3 + 2] = 1;

      uvs[ptr2] = u;
      uvs[ptr2 + 1] = 1 - v;

      const distFromCenter = Math.hypot(u - 0.5, v - 0.5) * 2;
      layers[ptr1] = Math.floor(distFromCenter * 3) + rand() * 0.4;
      foldAngles[ptr1] = (rand() - 0.5) * Math.PI * 2;

      ptr3 += 3;
      ptr2 += 2;
      ptr1 += 1;
    }
  }

  const indices = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const cIdx = (r + 1) * (cols + 1) + (c + 1);
      const d = r * (cols + 1) + (c + 1);

      indices.push(a, b, d);
      indices.push(b, cIdx, d);
    }
  }

  return {
    positions, normals, uvs, layers, foldAngles,
    indices: new Uint16Array(indices), cols, rows,
  };
}

export function separateLayers(positions, layers, crumpleProgress, maxOffset = 0.18) {
  const count = layers.length;
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const layer = layers[i];
    const layerSeparation = (layer - 1.5) * maxOffset * crumpleProgress;
    positions[idx + 2] += layerSeparation;
  }
}

export function advance(
  currentPositions, originalPositions, layers, foldAngles, grabX, grabY,
  crumpleProgress, crumpleAmount, rotationX, rotationY
) {
  const count = layers.length;
  const ballTargetRadius = 0.85;

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const ox = originalPositions[idx];
    const oy = originalPositions[idx + 1];
    const oz = originalPositions[idx + 2];

    const dx = ox - grabX;
    const dy = oy - grabY;
    const dist = Math.hypot(dx, dy);

    const contractionFactor = 1 - crumpleProgress * (0.75 * crumpleAmount);
    let targetX = grabX + dx * contractionFactor;
    let targetY = grabY + dy * contractionFactor;

    const angle = foldAngles[i] + rotationY * 0.5;
    const ridgeNoise = Math.sin(ox * 14 + angle) * Math.cos(oy * 14 + rotationX * 0.5);
    const sphereDepth = -Math.sqrt(Math.max(0, ballTargetRadius * ballTargetRadius - (dist * 0.4) ** 2));

    const targetZ = oz + (sphereDepth * 0.8 + ridgeNoise * 0.35) * crumpleProgress * crumpleAmount;

    currentPositions[idx] = targetX;
    currentPositions[idx + 1] = targetY;
    currentPositions[idx + 2] = targetZ;
  }
  separateLayers(currentPositions, layers, crumpleProgress);
}

export default function PaperCrumple({
  src,
  alt = 'Paper Description',
  width = 1080,
  height = 1350,
  sceneHeight = '100%',
  imageFit = 'contain',
  releaseBehavior = 'restore',
  paperColor = '#F6F0E7',
  paperTexture = 0.02,
  shadow = false,
  draggable = true,
  crumpleAmount = 0.85,
  crumpleDuration = 0.55,
  releaseDuration = 0.4,
  returnToOrigin = true,
}) {
  const mountRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let disposed = false;
    let animationFrameId;
    let mesh;
    let texture;
    let resizeObserver;

    let isDragging = false;
    let pointerId;
    let pointerStart = { x: 0, y: 0 };
    let grabPoint = { x: 0, y: 0 };

    let crumpleProgress = 0;
    let crumpleVelocity = 0;
    let rotX = 0;
    let rotY = 0;
    let rotVelX = 0;
    let rotVelY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const w = container.clientWidth || width;
    const h = container.clientHeight || height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
    } catch (e) {
      console.error('WebGL init failed:', e);
      requestAnimationFrame(() => {
        if (!disposed) setLoadError(true);
      });
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.className = 'paper-crumple-canvas';
    renderer.domElement.setAttribute('aria-label', alt);
    container.appendChild(renderer.domElement);

    if (shadow) {
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      const directional = new THREE.DirectionalLight(0xffffff, 0.4);
      directional.position.set(5, 5, 5);
      scene.add(ambient, directional);
    }

    const aspect = width / height;
    const planeH = 3.8;
    const planeW = planeH * aspect;
    
    // Performance Fix: Reduced Geometry Grid for lightning-fast parsing
    const cols = 24; 
    const rows = 32; 
    const paperData = createPaperPath(planeW, planeH, cols, rows);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(paperData.positions), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(paperData.normals), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(paperData.uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(paperData.indices, 1));

    const originalPositions = new Float32Array(paperData.positions);

    const resizeRenderer = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      
      const fovRad = (camera.fov * Math.PI) / 180;
      const distH = (planeH / 2) / Math.tan(fovRad / 2);
      const distW = (planeW / 2) / Math.tan(fovRad / 2) / camera.aspect;
      camera.position.z = Math.max(distH, distW) * 1.15;
      
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    resizeRenderer();
    resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);

    const getLocalPointer = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      const nx = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const ny = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      return {
        x: (nx * (planeW / 2)) * 0.85,
        y: (ny * (planeH / 2)) * 0.85,
        screenX: event.clientX,
        screenY: event.clientY,
      };
    };

    const onPointerDown = (e) => {
      if (!draggable) return;
      isDragging = true;
      pointerId = e.pointerId;
      renderer.domElement.setPointerCapture(pointerId);

      const local = getLocalPointer(e);
      grabPoint = { x: local.x, y: local.y };
      pointerStart = { x: local.screenX, y: local.screenY };
    };

    const onPointerMove = (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;
      const dx = (e.clientX - pointerStart.x) * 0.006;
      const dy = (e.clientY - pointerStart.y) * 0.006;

      targetRotY = constrain(dx * 1.5, -0.6, 0.6);
      targetRotX = constrain(-dy * 1.5, -0.6, 0.6);
    };

    const onPointerUp = (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;
      isDragging = false;
      pointerId = undefined;

      if (returnToOrigin && releaseBehavior === 'restore') {
        targetRotX = 0;
        targetRotY = 0;
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointermove', onPointerMove);
    canvasEl.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('pointercancel', onPointerUp);

    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        texture = tex;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Critical Performance Fix: Disable expensive Mipmaps for instant loading
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = shadow
          ? new THREE.MeshStandardMaterial({
              map: texture,
              color: 0xffffff,
              roughness: 0.9,
              metalness: 0.05,
              side: THREE.DoubleSide,
              transparent: true,
            })
          : new THREE.MeshBasicMaterial({
              map: texture,
              color: 0xffffff,
              transparent: true,
              side: THREE.DoubleSide,
            });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        setLoadError(false);
      },
      undefined,
      (err) => {
        if (disposed) return;
        console.error('PaperCrumple texture load error:', err);
        setLoadError(true);
      }
    );

    let lastTime = performance.now();
    let isInView = true;

    const animateLoop = (time) => {
      if (isInView && !document.hidden) {
        animationFrameId = requestAnimationFrame(animateLoop);
      }
      const dt = constrain((time - lastTime) / 1000, 0.001, 0.05);
      lastTime = time;

      const targetCrumple = isDragging ? 1.0 : 0.0;
      const springTension = isDragging ? 1 / crumpleDuration * 160 : 1 / releaseDuration * 180;
      const [nextCrumple, nextVel] = spring(crumpleProgress, targetCrumple, crumpleVelocity, springTension, 14, dt);
      crumpleProgress = constrain(nextCrumple, 0, 1);
      crumpleVelocity = nextVel;

      const [nextRotX, nextRotVelX] = spring(rotX, targetRotX, rotVelX, 120, 12, dt);
      const [nextRotY, nextRotVelY] = spring(rotY, targetRotY, rotVelY, 120, 12, dt);
      rotX = nextRotX;
      rotY = nextRotY;
      rotVelX = nextRotVelX;
      rotVelY = nextRotVelY;

      if (mesh) {
        mesh.rotation.x = rotX;
        mesh.rotation.y = rotY;

        if (crumpleProgress > 0.001 || isDragging) {
          const currentPos = geometry.attributes.position.array;
          advance(
            currentPos, originalPositions, paperData.layers, paperData.foldAngles,
            grabPoint.x, grabPoint.y, crumpleProgress, crumpleAmount, rotX, rotY
          );
          geometry.attributes.position.needsUpdate = true;
          geometry.computeVertexNormals();
        } else if (crumpleProgress <= 0.001 && geometry.attributes.position.array[2] !== 0) {
          geometry.attributes.position.array.set(originalPositions);
          geometry.attributes.position.needsUpdate = true;
          geometry.computeVertexNormals();
        }
      }

      renderer.render(scene, camera);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const wasInView = isInView;
      isInView = entry.isIntersecting;
      if (isInView && !wasInView && !document.hidden) {
        lastTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animateLoop);
      } else if (!isInView && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    });
    visibilityObserver.observe(container);

    const onVisibilityChange = () => {
      if (!document.hidden && isInView) {
        lastTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animateLoop);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    animateLoop(performance.now());

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointercancel', onPointerUp);
      geometry.dispose();
      if (mesh && mesh.material) mesh.material.dispose();
      if (texture) texture.dispose();
      renderer.dispose();
      if (container.contains(canvasEl)) container.removeChild(canvasEl);
    };
  }, [
    alt, crumpleAmount, crumpleDuration, draggable, height, paperColor,
    releaseBehavior, releaseDuration, returnToOrigin, shadow, src, width,
  ]);

  return (
    <div
      ref={mountRef}
      className="paper-crumple-container"
      style={{ height: sceneHeight, '--paper-color': paperColor }}
      aria-label={alt}
      suppressHydrationWarning
    >
      {loadError && (
        <div
          className="paper-crumple-fallback text-muted-brown text-base leading-relaxed space-y-4"
          role="img"
          aria-label={alt}
        >
          <p>
            I&apos;m Kartik Chauhan, a web developer based in Surat, Gujarat, India.
            I focus on crafting responsive websites, interactive frontend experiences,
            and practical, database-driven web applications designed around real business
            needs.
          </p>
          <p>
            My development foundation includes working with React.js, modern JavaScript,
            PHP, and MySQL, alongside UI development with GSAP and Three.js for immersive
            digital presentation.
          </p>
          <p>
            In addition to full-stack development, I explore AI workflow automation,
            visual design, and video editing—bringing a versatile, creative perspective to every project.
          </p>
        </div>
      )}
    </div>
  );
}