'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const WALL_THICKNESS = 200;

export default function FallingText({
  text,
  trigger = 'hover',
  restoreDelay = 1,
  gravity = 1,
  scatter = 0.4,
  accentColor = '#B9825B',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const elements = Array.from(container.querySelectorAll('[data-falling-piece]'));
    let engine = null;
    let bodies = [];
    let frameId = 0;
    let lastFrame = 0;
    let restoreTimer = 0;
    let settleStart = 0;
    let pointerInside = false;
    let phase = 'idle';
    let disposed = false;

    const clearPieceStyles = () => {
      elements.forEach((element) => {
        element.getAnimations().forEach((animation) => animation.cancel());
      });
      elements.forEach((element) => {
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.width = '';
        element.style.height = '';
        element.style.margin = '';
        element.style.transform = '';
        element.style.color = '';
      });
      container.style.width = '';
    };

    const destroyEngine = () => {
      if (!engine) return;
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engine = null;
      bodies = [];
    };

    const reset = () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(restoreTimer);
      destroyEngine();
      clearPieceStyles();
      phase = 'idle';
      delete container.dataset.phase;
    };

    const restore = () => {
      if (phase !== 'falling') return;
      phase = 'restoring';
      container.dataset.phase = phase;
      window.cancelAnimationFrame(frameId);
      destroyEngine();

      const animations = elements.map((element) => {
        const currentTransform = element.style.transform;
        element.style.color = '';
        return element.animate(
          [
            { transform: currentTransform },
            { transform: element.dataset.originTransform },
          ],
          { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );
      });

      Promise.all(animations.map((animation) => animation.finished.catch(() => null))).then(() => {
        if (!disposed && phase === 'restoring') reset();
      });
    };

    const startFall = () => {
      if (phase !== 'idle' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const initialPieces = elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const x = rect.left - bounds.left;
        const y = rect.top - bounds.top;
        const width = rect.width;
        const height = rect.height;
        element.dataset.originTransform = `translate3d(${x}px, ${y}px, 0)`;
        return { element, x, y, width, height };
      });

      container.style.width = `${bounds.width}px`;
      initialPieces.forEach(({ element, x, y, width, height }) => {
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.style.margin = '0';
        element.style.transform = element.dataset.originTransform;
      });

      engine = Matter.Engine.create({ enableSleeping: true });
      engine.gravity.y = Math.max(-3, Math.min(4, gravity)) * 1.4;

      const floor = Matter.Bodies.rectangle(
        bounds.width / 2,
        bounds.height + WALL_THICKNESS / 2,
        bounds.width + WALL_THICKNESS * 2,
        WALL_THICKNESS,
        { isStatic: true, friction: 0.8 }
      );
      const leftWall = Matter.Bodies.rectangle(
        -WALL_THICKNESS / 2,
        bounds.height / 2,
        WALL_THICKNESS,
        bounds.height + WALL_THICKNESS * 2,
        { isStatic: true }
      );
      const rightWall = Matter.Bodies.rectangle(
        bounds.width + WALL_THICKNESS / 2,
        bounds.height / 2,
        WALL_THICKNESS,
        bounds.height + WALL_THICKNESS * 2,
        { isStatic: true }
      );

      bodies = initialPieces
        .filter(({ element }) => element.textContent.trim())
        .map((piece, index) => {
          const body = Matter.Bodies.rectangle(
            piece.x + piece.width / 2,
            piece.y + piece.height / 2,
            Math.max(2, piece.width - 1),
            Math.max(2, piece.height - 1),
            {
              isStatic: true,
              restitution: 0.2,
              friction: 0.5,
              frictionAir: 0.015,
            }
          );
          return {
            ...piece,
            body,
            releaseAt: index * 0.025,
            released: false,
            previous: { x: body.position.x, y: body.position.y, angle: body.angle },
          };
        });

      Matter.Composite.add(engine.world, [
        floor,
        leftWall,
        rightWall,
        ...bodies.map(({ body }) => body),
      ]);

      phase = 'falling';
      container.dataset.phase = phase;
      let elapsed = 0;

      const animate = (timestamp) => {
        frameId = 0;
        if (!engine || phase !== 'falling') return;

        const delta = Math.min(32, lastFrame ? timestamp - lastFrame : 16.67);
        lastFrame = timestamp;
        elapsed += delta / 1000;

        bodies.forEach((piece) => {
          if (!piece.released && elapsed >= piece.releaseAt) {
            piece.released = true;
            Matter.Body.setStatic(piece.body, false);
            Matter.Body.setVelocity(piece.body, {
              x: (Math.random() - 0.5) * 4 * scatter,
              y: -Math.random() * scatter,
            });
            Matter.Body.setAngularVelocity(
              piece.body,
              (Math.random() - 0.5) * 0.12 * scatter
            );
          }
          piece.previous = {
            x: piece.body.position.x,
            y: piece.body.position.y,
            angle: piece.body.angle,
          };
        });

        Matter.Engine.update(engine, delta);

        bodies.forEach((piece) => {
          const { x, y } = piece.body.position;
          piece.element.style.transform =
            `translate3d(${(x - piece.width / 2).toFixed(2)}px, ` +
            `${(y - piece.height / 2).toFixed(2)}px, 0) ` +
            `rotate(${piece.body.angle.toFixed(3)}rad)`;
        });

        const settled = bodies.every(
          ({ released, body }) => released && (body.isSleeping || body.speed < 0.08)
        );
        if (settled) {
          settleStart ||= timestamp;
          if (!pointerInside && timestamp - settleStart > restoreDelay * 1000) {
            restore();
            return;
          }
        } else {
          settleStart = 0;
        }

        frameId = window.requestAnimationFrame(animate);
      };

      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerEnter = () => {
      pointerInside = true;
      if (trigger === 'hover') startFall();
    };
    const handlePointerLeave = () => {
      pointerInside = false;
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      disposed = true;
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      reset();
      elements.forEach((element) => {
        delete element.dataset.originTransform;
      });
    };
  }, [gravity, restoreDelay, scatter, text, trigger]);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex h-full items-center justify-center overflow-hidden whitespace-nowrap align-middle"
      aria-label={text}
      style={{ color: accentColor }}
    >
      {[...text].map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-falling-piece=""
          className="inline-block whitespace-pre"
          aria-hidden="true"
        >
          {character}
        </span>
      ))}
    </span>
  );
}
