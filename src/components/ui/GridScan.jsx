'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uLinesColor;
  uniform vec3 uScanColor;
  uniform float uCells;
  uniform float uDepth;
  uniform float uScanDuration;
  uniform float uScanDelay;
  uniform float uLineThickness;
  uniform float uDepthFade;
  uniform float uShading;
  uniform float uReflection;
  uniform bool uPoints;
  uniform float uScanWidth;
  uniform float uTrail;
  uniform float uGlow;
  uniform vec2 uMouse;
  uniform float uParallax;
  uniform bool uAutoScan;

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    // Parallax camera offset
    vec3 ro = vec3(uMouse.x * 0.3 * uParallax, uMouse.y * 0.2 * uParallax, 0.2);
    vec3 rd = normalize(vec3(st * 1.0, -1.0));

    float aspect = uResolution.x / uResolution.y;
    float halfH = 1.0;
    float halfW = aspect;
    float depthZ = max(uDepth * 2.0, 3.0);

    // Plane intersection checks: floor, ceiling, left, right, back
    float t = 1e5;
    int hitFace = 0; // 1: floor, 2: ceiling, 3: left, 4: right, 5: back

    if (rd.y < -1e-4) {
      float tFloor = (-halfH - ro.y) / rd.y;
      if (tFloor > 0.0 && tFloor < t) {
        vec3 p = ro + rd * tFloor;
        if (abs(p.x) <= halfW && p.z <= 0.0 && p.z >= -depthZ) {
          t = tFloor;
          hitFace = 1;
        }
      }
    }

    if (rd.y > 1e-4) {
      float tCeil = (halfH - ro.y) / rd.y;
      if (tCeil > 0.0 && tCeil < t) {
        vec3 p = ro + rd * tCeil;
        if (abs(p.x) <= halfW && p.z <= 0.0 && p.z >= -depthZ) {
          t = tCeil;
          hitFace = 2;
        }
      }
    }

    if (rd.x < -1e-4) {
      float tLeft = (-halfW - ro.x) / rd.x;
      if (tLeft > 0.0 && tLeft < t) {
        vec3 p = ro + rd * tLeft;
        if (abs(p.y) <= halfH && p.z <= 0.0 && p.z >= -depthZ) {
          t = tLeft;
          hitFace = 3;
        }
      }
    }

    if (rd.x > 1e-4) {
      float tRight = (halfW - ro.x) / rd.x;
      if (tRight > 0.0 && tRight < t) {
        vec3 p = ro + rd * tRight;
        if (abs(p.y) <= halfH && p.z <= 0.0 && p.z >= -depthZ) {
          t = tRight;
          hitFace = 4;
        }
      }
    }

    if (rd.z < -1e-4) {
      float tBack = (-depthZ - ro.z) / rd.z;
      if (tBack > 0.0 && tBack < t) {
        vec3 p = ro + rd * tBack;
        if (abs(p.x) <= halfW && abs(p.y) <= halfH) {
          t = tBack;
          hitFace = 5;
        }
      }
    }

    if (hitFace == 0) {
      discard;
    }

    vec3 pos = ro + rd * t;

    // UV coordinates mapped along surface
    vec2 surfaceCoord;
    if (hitFace == 1 || hitFace == 2) {
      surfaceCoord = vec2(pos.x * uCells * 0.5, pos.z * uCells * 0.5);
    } else if (hitFace == 3 || hitFace == 4) {
      surfaceCoord = vec2(pos.y * uCells * 0.5, pos.z * uCells * 0.5);
    } else {
      surfaceCoord = vec2(pos.x * uCells * 0.5, pos.y * uCells * 0.5);
    }

    // Grid lines with anti-aliasing
    vec2 gridDelta = fwidth(surfaceCoord);
    vec2 gridFract = abs(fract(surfaceCoord - 0.5) - 0.5);
    vec2 lineWeight = smoothstep(gridDelta * uLineThickness * 0.8, vec2(0.0), gridFract);
    float line = clamp(max(lineWeight.x, lineWeight.y), 0.0, 1.0);

    // Grid intersection points
    float pt = 0.0;
    if (uPoints) {
      float distToCenter = length(gridFract) / max(max(gridDelta.x, gridDelta.y), 0.001);
      pt = smoothstep(uLineThickness * 2.2, 0.0, distToCenter);
    }

    // Scan cycle calculation
    float cycle = uScanDuration + uScanDelay;
    float phase = mod(uTime, cycle);
    float scanProg = -1.0;
    if (phase < uScanDuration && uAutoScan) {
      scanProg = phase / uScanDuration;
    }

    // Forward scan moves from back (-depthZ) to front (0.0)
    float scanZ = mix(-depthZ, 0.0, scanProg);
    float dz = (pos.z - scanZ);

    float scanWave = 0.0;
    float scanGlow = 0.0;
    if (scanProg >= 0.0) {
      // Glow envelope
      scanGlow = exp(-abs(dz) * (3.5 / max(uScanWidth, 0.1))) * uGlow;

      // Trailing tail behind scan front
      float trailLen = uTrail * depthZ * 0.6;
      if (dz < 0.0 && dz > -trailLen) {
        scanWave = pow(1.0 - (-dz / trailLen), 2.0);
      }
    }

    float scanIntensity = clamp(scanGlow + scanWave * 0.85, 0.0, 2.5);

    // Atmospheric depth fade
    float distNorm = clamp(-pos.z / depthZ, 0.0, 1.0);
    float depthFog = exp(-distNorm * uDepthFade * 3.0);

    // Corner shading / Ambient Occlusion
    float cornerOcc = 1.0;
    if (hitFace == 1 || hitFace == 2) {
      float edgeX = 1.0 - abs(pos.x) / halfW;
      cornerOcc = clamp(edgeX * 3.0, 0.15, 1.0);
    } else if (hitFace == 3 || hitFace == 4) {
      float edgeY = 1.0 - abs(pos.y) / halfH;
      cornerOcc = clamp(edgeY * 3.0, 0.15, 1.0);
    }
    float shadingFactor = mix(1.0, cornerOcc, uShading * 0.65);

    // Surface color composition
    vec3 baseColor = uLinesColor;
    vec3 litColor = mix(baseColor, uScanColor, clamp(scanIntensity * 1.2, 0.0, 1.0));

    vec3 color = litColor * line;
    if (uPoints) {
      color += (uScanColor * 1.5 + baseColor * 0.5) * pt * max(scanIntensity * 1.8, 0.35);
    }

    // Scan beam floor reflection
    if (hitFace == 1 && uReflection > 0.0) {
      color += uScanColor * scanGlow * uReflection * 0.7;
    }

    // Extra scan beam glow
    color += uScanColor * (scanGlow * 0.25);

    // Apply shading & depth fade
    color *= shadingFactor * depthFog;
    float alpha = clamp((line * 0.85 + pt * 0.9 + scanGlow * 0.5) * depthFog, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function GridScan({
  linesColor = '#77675D',
  scanColor = '#B9825B',
  cells = 8,
  depth = 3,
  scanDuration = 2.4,
  scanDelay = 1.6,
  lineThickness = 1,
  depthFade = 0.6,
  shading = 0.7,
  reflection = 0.35,
  points = true,
  scanDirection = 'forward',
  scanWidth = 1,
  trail = 0.5,
  glow = 0.6,
  parallax = 1,
  autoScan = true,
  interactive = false,
  lightMode = false,
  className = '',
}) {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const containerRef = useRef(null);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2));
    renderer.setSize(container.clientWidth || 300, container.clientHeight || 150);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const parseColor = (col, fallback) => {
      try {
        return new THREE.Color(col);
      } catch {
        return new THREE.Color(fallback);
      }
    };

    const uniforms = {
      uResolution: {
        value: new THREE.Vector2(
          container.clientWidth || 300,
          container.clientHeight || 150
        ),
      },
      uTime: { value: 0 },
      uLinesColor: { value: parseColor(linesColor, '#77675D') },
      uScanColor: { value: parseColor(scanColor, '#B9825B') },
      uCells: { value: cells },
      uDepth: { value: depth },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: scanDelay },
      uLineThickness: { value: lineThickness },
      uDepthFade: { value: depthFade },
      uShading: { value: shading },
      uReflection: { value: reflection },
      uPoints: { value: Boolean(points) },
      uScanWidth: { value: scanWidth },
      uTrail: { value: trail },
      uGlow: { value: glow },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uParallax: { value: parallax },
      uAutoScan: { value: autoScan },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId;
    let isInView = true;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      if (isInView && !document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

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
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let handleMouseMove;
    if (interactive || parallax > 0) {
      handleMouseMove = (e) => {
        if (!isInView) return;
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        uniforms.uMouse.value.set(nx, ny);
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (handleMouseMove) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    isMounted,
    linesColor,
    scanColor,
    cells,
    depth,
    scanDuration,
    scanDelay,
    lineThickness,
    depthFade,
    shading,
    reflection,
    points,
    scanDirection,
    scanWidth,
    trail,
    glow,
    parallax,
    autoScan,
    interactive,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none pointer-events-none ${className}`}
      suppressHydrationWarning
    />
  );
}

