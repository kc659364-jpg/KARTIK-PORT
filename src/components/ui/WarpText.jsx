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

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uWarpStrength;
  uniform float uWarpScale;
  uniform float uPointerStrength;
  uniform float uPointerInfluence;
  uniform float uRefraction;
  uniform float uChromatic;
  uniform float uIdleDrift;
  uniform vec2 uMouse;
  uniform float uIsHovered;
  uniform vec2 uRippleOrigin;
  uniform float uRippleTime;
  uniform float uAspect;
  uniform float uIntroAlpha;

  void main() {
    // Ambient liquid warp distortion
    vec2 ambientWarp = vec2(
      sin(vUv.y * uWarpScale * 14.0 + uTime * uSpeed * 2.8),
      cos(vUv.x * uWarpScale * 14.0 + uTime * uSpeed * 2.8)
    ) * uWarpStrength * 0.08;

    // Idle drifting lens center when not hovering
    vec2 idleCenter = vec2(
      0.5 + sin(uTime * 0.8) * 0.25 * uIdleDrift,
      0.5 + cos(uTime * 1.1) * 0.18 * uIdleDrift
    );
    vec2 center = mix(idleCenter, uMouse, uIsHovered);

    // Lens bulge distortion
    vec2 toCenter = vUv - center;
    toCenter.x *= uAspect;
    float dist = length(toCenter);
    vec2 lensWarp = vec2(0.0);

    if (dist < uPointerInfluence && dist > 1e-4) {
      float factor = 1.0 - (dist / uPointerInfluence);
      float bulge = factor * factor * uPointerStrength * 0.14;
      vec2 dir = normalize(toCenter);
      dir.x /= uAspect;
      lensWarp = -dir * bulge;
    }

    // Click shockwave ripple
    vec2 rippleWarp = vec2(0.0);
    if (uRippleTime > 0.0 && uRippleTime < 1.0) {
      vec2 toRipple = vUv - uRippleOrigin;
      toRipple.x *= uAspect;
      float rDist = length(toRipple);
      float ringPos = uRippleTime * 1.1;
      float ring = sin((rDist - ringPos) * 28.0);
      float ringMask = exp(-abs(rDist - ringPos) * 16.0) * (1.0 - uRippleTime);
      vec2 rDir = (rDist > 1e-4) ? normalize(toRipple) : vec2(0.0);
      rDir.x /= uAspect;
      rippleWarp = rDir * ring * ringMask * 0.06;
    }

    vec2 totalWarp = ambientWarp + lensWarp + rippleWarp;

    // Chromatic aberration & refraction RGB split
    float chr = uChromatic * 0.02 + uRefraction * 0.5;
    vec2 uvR = clamp(vUv + totalWarp * (1.0 + chr * 3.5), 0.0, 1.0);
    vec2 uvG = clamp(vUv + totalWarp, 0.0, 1.0);
    vec2 uvB = clamp(vUv + totalWarp * (1.0 - chr * 3.5), 0.0, 1.0);

    vec4 colR = texture2D(uTexture, uvR);
    vec4 colG = texture2D(uTexture, uvG);
    vec4 colB = texture2D(uTexture, uvB);

    vec3 finalRgb = vec3(colR.r, colG.g, colB.b);
    float finalAlpha = max(colG.a, max(colR.a, colB.a)) * uIntroAlpha;

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`;

export default function WarpText({
  text = 'Kartik Chauhan.',
  fontFamily = 'inherit',
  fontSize = 24,
  fontWeight = 800,
  letterSpacing = '-0.02em',
  lineHeight = 1,
  speed = 0.55,
  warpStrength = 0.08,
  warpScale = 1.7,
  lens = 'bulge',
  refraction = 0.018,
  chromatic = 0.35,
  pointerStrength = 0.38,
  pointerInfluence = 0.42,
  idleDrift = 0.2,
  intro = true,
  ripple = true,
  clickRipple = true,
  className = '',
}) {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isMounted) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 32;

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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Render text to high-res 2D canvas texture
    const textCanvas = document.createElement('canvas');
    const scale = dpr * 2;
    textCanvas.width = Math.max(1, Math.floor(width * scale));
    textCanvas.height = Math.max(1, Math.floor(height * scale));

    const ctx = textCanvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, width, height);

      const resolvedFontFamily =
        fontFamily === 'inherit'
          ? 'var(--font-outfit), "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          : fontFamily;

      ctx.font = `${fontWeight} ${fontSize}px ${resolvedFontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      // Draw brand text in Espresso (#2B1D18)
      ctx.fillStyle = '#2B1D18';

      // Check if text ends with a period, paint the period Caramel (#B9825B)
      if (text.endsWith('.')) {
        const mainText = text.slice(0, -1);
        ctx.fillText(mainText, 2, height / 2);
        const mainWidth = ctx.measureText(mainText).width;
        ctx.fillStyle = '#B9825B';
        ctx.fillText('.', 2 + mainWidth, height / 2);
      } else {
        ctx.fillText(text, 2, height / 2);
      }
    }

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTexture: { value: textTexture },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uWarpStrength: { value: warpStrength },
      uWarpScale: { value: warpScale },
      uPointerStrength: { value: pointerStrength },
      uPointerInfluence: { value: pointerInfluence },
      uRefraction: { value: refraction },
      uChromatic: { value: chromatic },
      uIdleDrift: { value: idleDrift },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIsHovered: { value: 0 },
      uRippleOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uRippleTime: { value: -1 },
      uAspect: { value: width / height },
      uIntroAlpha: { value: intro ? 0 : 1 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId;
    const clock = new THREE.Clock();
    let rippleStartTime = -10;
    let targetHover = 0;
    let currentHover = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // Smooth intro fade
      if (intro && uniforms.uIntroAlpha.value < 1) {
        uniforms.uIntroAlpha.value = Math.min(1, uniforms.uIntroAlpha.value + 0.05);
      }

      // Smooth hover easing
      currentHover += (targetHover - currentHover) * 0.12;
      uniforms.uIsHovered.value = currentHover;

      // Ripple progress
      if (rippleStartTime > 0) {
        const rippleElapsed = elapsed - rippleStartTime;
        if (rippleElapsed < 1.0) {
          uniforms.uRippleTime.value = rippleElapsed;
        } else {
          uniforms.uRippleTime.value = -1;
          rippleStartTime = -10;
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.uMouse.value.set(nx, ny);
      targetHover = 1;
    };

    const handlePointerLeave = () => {
      targetHover = 0;
    };

    const handleClick = (e) => {
      if (!clickRipple) return;
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.uRippleOrigin.value.set(nx, ny);
      rippleStartTime = clock.getElapsedTime();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 220;
      const h = container.clientHeight || 32;
      renderer.setSize(w, h);
      uniforms.uAspect.value = w / h;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      textTexture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    isMounted,
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    speed,
    warpStrength,
    warpScale,
    lens,
    refraction,
    chromatic,
    pointerStrength,
    pointerInfluence,
    idleDrift,
    intro,
    ripple,
    clickRipple,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${className}`}
      suppressHydrationWarning
    >
      {!isMounted && (
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            letterSpacing,
            lineHeight,
            fontFamily: fontFamily === 'inherit' ? 'inherit' : fontFamily,
          }}
          className="text-espresso font-bold block"
        >
          {text}
        </span>
      )}
    </div>
  );
}

