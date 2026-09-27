'use client';

import { useEffect, useRef } from 'react';

type Stream = {
  offset: number;
  end: number;
  speed: number;
  phase: number;
  width: number;
  alpha: number;
};

export function EnergyCascade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let streams: Stream[] = [];
    let visible = true;
    let pointerX = 0;
    let scrollProgress = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const createStreams = () => {
      const count = width < 720 ? 92 : 180;
      streams = Array.from({ length: count }, (_, index) => {
        const unit = index / (count - 1);
        const side = unit < 0.5 ? -1 : 1;
        const spread = Math.pow(Math.abs(unit - 0.5) * 2, 0.72);
        return {
          offset: (unit - 0.5) * Math.min(width * 0.44, 620),
          end: width * 0.5 + side * spread * width * 0.64,
          speed: 0.45 + (index % 11) * 0.055,
          phase: (index * 31.7) % 180,
          width: 0.35 + (index % 5) * 0.14,
          alpha: 0.11 + (index % 7) * 0.022,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStreams();
    };

    const drawPath = (stream: Stream) => {
      const center = width * 0.5 + pointerX;
      context.beginPath();
      context.moveTo(center + stream.offset * 0.14, -30);
      context.bezierCurveTo(
        center + stream.offset * 0.34,
        height * 0.54,
        center + (stream.end - center) * 0.07,
        height * 0.84,
        stream.end,
        height * 1.03,
      );
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const center = width * 0.5 + pointerX;
      // The point starts exactly at the top edge of this panel. As the panel
      // enters from below, it visually inherits the ball resting at viewport bottom.
      const beamY = height * Math.min(0.92, scrollProgress * 0.92);

      const backdrop = context.createRadialGradient(center, beamY, 0, center, beamY, width * 0.7);
      backdrop.addColorStop(0, 'rgba(255, 255, 255, .12)');
      backdrop.addColorStop(0.38, 'rgba(150, 150, 150, .06)');
      backdrop.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);

      for (const stream of streams) {
        drawPath(stream);
        context.setLineDash([]);
        context.lineWidth = stream.width;
        context.strokeStyle = `rgba(220, 220, 216, ${stream.alpha})`;
        context.stroke();

        drawPath(stream);
        context.setLineDash([0.8, 9 + (stream.phase % 8)]);
        context.lineDashOffset = reduceMotion ? stream.phase : -(time * 0.035 * stream.speed + stream.phase);
        context.lineWidth = stream.width + 0.35;
        context.strokeStyle = `rgba(255, 255, 252, ${stream.alpha * 2.45})`;
        context.stroke();
      }
      context.setLineDash([]);

      const bloom = context.createRadialGradient(center, beamY, 0, center, beamY, Math.min(width, height) * 0.3);
      bloom.addColorStop(0, 'rgba(255, 255, 255, .98)');
      bloom.addColorStop(0.025, 'rgba(255, 255, 250, .86)');
      bloom.addColorStop(0.12, 'rgba(225, 225, 218, .32)');
      bloom.addColorStop(0.42, 'rgba(150, 150, 145, .1)');
      bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = bloom;
      context.fillRect(0, Math.max(0, beamY - height * 0.34), width, height * 0.68);

      const beam = context.createLinearGradient(0, 0, 0, beamY);
      beam.addColorStop(0, 'rgba(160, 160, 155, .32)');
      beam.addColorStop(0.35, 'rgba(205, 205, 198, .72)');
      beam.addColorStop(0.84, 'rgba(245, 245, 238, .96)');
      beam.addColorStop(1, 'rgba(255, 255, 255, 1)');
      for (const [lineWidth, alpha] of [[64, 0.035], [30, 0.08], [11, 0.24], [3, 0.95]] as const) {
        context.beginPath();
        context.moveTo(center, -10);
        context.lineTo(center, beamY);
        context.lineWidth = lineWidth;
        context.strokeStyle = beam;
        context.globalAlpha = alpha;
        context.stroke();
      }
      context.globalAlpha = 1;

      if (!reduceMotion && visible && scrollProgress > 0) frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(render);
    }, { threshold: 0.02 });
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    };
    const onProgress = (event: Event) => {
      scrollProgress = Math.max(0, Math.min(1, (event as CustomEvent<number>).detail));
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible) frame = requestAnimationFrame(render);
    };

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('energy-progress', onProgress);
    resize();
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('energy-progress', onProgress);
    };
  }, []);

  return <canvas ref={canvasRef} className="energy-cascade" aria-hidden="true" />;
}
