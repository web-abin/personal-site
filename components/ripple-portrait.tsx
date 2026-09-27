'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

type Ripple = {
  x: number;
  y: number;
  radius: number;
  life: number;
  strength: number;
};

export function RipplePortrait() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const figure = root.current;
    const target = canvas.current;
    if (!figure || !target) return;

    const context = target.getContext('2d');
    const source = document.createElement('canvas');
    const sourceContext = source.getContext('2d');
    if (!context || !sourceContext) return;

    const image = new window.Image();
    const ripples: Ripple[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1;
    let height = 1;
    let dpr = 1;
    let ready = false;
    let lastRippleAt = 0;
    let lastX = -100;
    let lastY = -100;

    const drawCover = () => {
      if (!ready) return;
      source.width = Math.round(width * dpr);
      source.height = Math.round(height * dpr);
      const scale = Math.max(source.width / image.naturalWidth, source.height / image.naturalHeight);
      const cropWidth = source.width / scale;
      const cropHeight = source.height / scale;
      const cropX = (image.naturalWidth - cropWidth) / 2;
      const cropY = (image.naturalHeight - cropHeight) / 2;
      sourceContext.clearRect(0, 0, source.width, source.height);
      sourceContext.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, source.width, source.height);
    };

    const resize = () => {
      const bounds = figure.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      target.width = Math.round(width * dpr);
      target.height = Math.round(height * dpr);
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      drawCover();
    };

    const render = () => {
      if (!ready) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      if (reducedMotion.matches || ripples.length === 0) {
        context.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
        return;
      }

      const tile = 10;
      for (let y = 0; y < height; y += tile) {
        for (let x = 0; x < width; x += tile) {
          const centreX = x + tile / 2;
          const centreY = y + tile / 2;
          let offsetX = 0;
          let offsetY = 0;

          for (const ripple of ripples) {
            const deltaX = centreX - ripple.x;
            const deltaY = centreY - ripple.y;
            const distance = Math.max(1, Math.hypot(deltaX, deltaY));
            const ring = Math.exp(-Math.pow(distance - ripple.radius, 2) / 1900);
            const wave = Math.sin((distance - ripple.radius) * 0.12) * ripple.strength * ripple.life * ring;
            offsetX += (deltaX / distance) * wave;
            offsetY += (deltaY / distance) * wave;
          }

          const drawWidth = Math.min(tile + 1, width - x);
          const drawHeight = Math.min(tile + 1, height - y);
          context.drawImage(
            source,
            x * dpr,
            y * dpr,
            drawWidth * dpr,
            drawHeight * dpr,
            x + offsetX,
            y + offsetY,
            drawWidth + 0.75,
            drawHeight + 0.75,
          );
        }
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        ripples[index].radius += 3.4;
        ripples[index].life *= 0.965;
        if (ripples[index].life < 0.035) ripples.splice(index, 1);
      }
    };

    const addRipple = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      const bounds = figure.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const now = performance.now();
      const distance = Math.hypot(x - lastX, y - lastY);
      if (now - lastRippleAt < 65 || distance < 12) return;
      lastRippleAt = now;
      lastX = x;
      lastY = y;
      ripples.push({ x, y, radius: 0, life: 1, strength: Math.min(15, 8 + distance * 0.09) });
      if (ripples.length > 5) ripples.shift();
    };

    image.onload = () => {
      ready = true;
      figure.dataset.ready = 'true';
      resize();
    };
    image.src = '/images/wang-junbin-seaside.jpg';

    const observer = new ResizeObserver(resize);
    observer.observe(figure);
    figure.addEventListener('pointerenter', addRipple);
    figure.addEventListener('pointermove', addRipple);
    gsap.ticker.add(render);

    return () => {
      observer.disconnect();
      figure.removeEventListener('pointerenter', addRipple);
      figure.removeEventListener('pointermove', addRipple);
      gsap.ticker.remove(render);
      image.onload = null;
    };
  }, { scope: root });

  return (
    <figure ref={root} className="ripple-portrait">
      <img src="/images/wang-junbin-seaside.jpg" alt="王俊彬在海边夕阳下的剪影" draggable={false} />
      <canvas ref={canvas} aria-hidden="true" />
      <figcaption>MOVE ACROSS THE PORTRAIT</figcaption>
    </figure>
  );
}
