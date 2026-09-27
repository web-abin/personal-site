'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';

const WORD = 'HACK';
const INK = '#050505';

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uDisplacement;
uniform vec2 uGrid;
uniform float uStrength;
varying vec2 vUv;
void main() {
  vec2 cell = (floor(vUv * uGrid) + 0.5) / uGrid;
  vec2 flow = texture2D(uDisplacement, cell).rg - 0.5;
  float activity = smoothstep(0.004, 0.24, length(flow));
  vec2 displacedUv = clamp(vUv - flow * vec2(0.34, 0.2) * uStrength, 0.0, 1.0);
  vec4 color = texture2D(uSource, displacedUv);
  vec4 echo = texture2D(uSource, clamp(vUv + flow * 0.055, 0.0, 1.0));
  color.rgb = mix(color.rgb, min(color.rgb, echo.rgb), activity * 0.2);
  gl_FragColor = color;
}
`;

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.max(minimum, Math.min(maximum, value));

const hash = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

export function InteractiveWordmark() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const gridWidth = coarsePointer ? 22 : 34;
    const gridHeight = coarsePointer ? 14 : 20;
    const pixelCount = gridWidth * gridHeight;
    const flowX = new Float32Array(pixelCount);
    const flowY = new Float32Array(pixelCount);
    const displacementData = new Uint8Array(pixelCount * 4);
    const source = document.createElement('canvas');
    const sourceContext = source.getContext('2d');
    if (!sourceContext) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
        alpha: false,
        antialias: false,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.setAttribute('aria-hidden', 'true');
    section.appendChild(canvas);
    section.dataset.ready = 'true';

    for (let index = 0; index < pixelCount; index += 1) {
      const offset = index * 4;
      displacementData[offset] = 128;
      displacementData[offset + 1] = 128;
      displacementData[offset + 2] = 0;
      displacementData[offset + 3] = 255;
    }

    const sourceTexture = new Texture(gl, {
      image: source,
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      flipY: true,
    });
    const displacementTexture = new Texture(gl, {
      image: displacementData,
      width: gridWidth,
      height: gridHeight,
      type: gl.UNSIGNED_BYTE,
      format: gl.RGBA,
      internalFormat: gl.RGBA,
      generateMipmaps: false,
      minFilter: gl.NEAREST,
      magFilter: gl.NEAREST,
      flipY: false,
    });
    const uniforms = {
      uSource: { value: sourceTexture },
      uDisplacement: { value: displacementTexture },
      uGrid: { value: new Float32Array([gridWidth, gridHeight]) },
      uStrength: { value: reducedMotion.matches ? 0 : 1 },
    };
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex, fragment, uniforms });
    const mesh = new Mesh(gl, { geometry, program });

    const pointer = { x: 0.5, y: 0.5, lastTime: 0, inside: false };
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = false;
    let lastFrameTime = 0;
    let seed = 0;

    const buildSource = () => {
      const textureDpr = Math.min(window.devicePixelRatio || 1, 2);
      source.width = Math.max(1, Math.round(width * textureDpr));
      source.height = Math.max(1, Math.round(height * textureDpr));
      sourceContext.setTransform(textureDpr, 0, 0, textureDpr, 0, 0);
      sourceContext.fillStyle = getComputedStyle(section).backgroundColor || '#b8ff37';
      sourceContext.fillRect(0, 0, width, height);
      sourceContext.fillStyle = INK;
      sourceContext.textAlign = 'center';
      sourceContext.textBaseline = 'alphabetic';

      sourceContext.font = `900 ${height}px "Arial Black", Arial, sans-serif`;
      const initial = sourceContext.measureText(WORD);
      const initialInkHeight = initial.actualBoundingBoxAscent + initial.actualBoundingBoxDescent || height;
      const fontSize = height * 0.94 / (initialInkHeight / height);
      sourceContext.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
      const metrics = sourceContext.measureText(WORD);
      const inkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baseline = (height - inkHeight) / 2 + metrics.actualBoundingBoxAscent;
      const horizontalScale = Math.min(1.08, width * 0.9 / metrics.width);
      sourceContext.save();
      sourceContext.translate(width / 2, 0);
      sourceContext.scale(horizontalScale, 1);
      sourceContext.fillText(WORD, 0, baseline);
      sourceContext.restore();
      sourceTexture.needsUpdate = true;
    };

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      renderer.setSize(width, height);
      buildSource();
      renderer.render({ scene: mesh });
    };

    const stamp = (x: number, y: number, velocityX: number, velocityY: number, impulse: number) => {
      const radius = coarsePointer ? 0.25 : 0.2;
      const speed = Math.hypot(velocityX, velocityY) || 1;
      const directionX = velocityX / speed;
      const directionY = velocityY / speed;
      for (let row = 0; row < gridHeight; row += 1) {
        for (let column = 0; column < gridWidth; column += 1) {
          const cellX = (column + 0.5) / gridWidth;
          const cellY = (row + 0.5) / gridHeight;
          const deltaX = (cellX - x) * (width / Math.max(height, 1));
          const deltaY = cellY - y;
          const distance = Math.hypot(deltaX, deltaY);
          if (distance >= radius) continue;
          const falloff = Math.pow(1 - distance / radius, 2.2);
          const noise = hash(column, row, seed) * 2 - 1;
          const cut = Math.abs(noise) > 0.24 ? noise : 0;
          const index = row * gridWidth + column;
          const directional = 46 + impulse * 86;
          const lateral = cut * (28 + impulse * 62);
          flowX[index] = clamp(-126, 126, flowX[index] + (directionX * directional + lateral) * falloff);
          flowY[index] = clamp(-108, 108, flowY[index] + (directionY * directional * 0.42 + cut * 34) * falloff);
        }
      }
    };

    const stampTrail = (fromX: number, fromY: number, toX: number, toY: number, velocityX: number, velocityY: number, impulse: number) => {
      const distanceInCells = Math.hypot((toX - fromX) * gridWidth, (toY - fromY) * gridHeight);
      const steps = clamp(1, 10, Math.ceil(distanceInCells * 0.8));
      seed += 1;
      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        stamp(fromX + (toX - fromX) * progress, fromY + (toY - fromY) * progress, velocityX, velocityY, impulse);
      }
    };

    function startRendering() {
      if (visible && !document.hidden && !reducedMotion.matches && !frame) {
        frame = window.requestAnimationFrame(render);
      }
    }

    const updatePointer = (event: PointerEvent, entering = false) => {
      if (reducedMotion.matches) return;
      const bounds = section.getBoundingClientRect();
      const nextX = clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
      const nextY = clamp(0, 1, 1 - (event.clientY - bounds.top) / bounds.height);
      const now = performance.now();
      if (entering || !pointer.lastTime) {
        pointer.x = nextX;
        pointer.y = nextY;
        pointer.lastTime = now;
        pointer.inside = true;
        stamp(nextX, nextY, 1, 0, 0.16);
        startRendering();
        return;
      }
      const elapsed = Math.max(8, now - pointer.lastTime);
      const velocityX = (nextX - pointer.x) * width / elapsed;
      const velocityY = (nextY - pointer.y) * height / elapsed;
      const impulse = clamp(0.12, 1, Math.hypot(velocityX, velocityY) / 1.25);
      stampTrail(pointer.x, pointer.y, nextX, nextY, velocityX, -velocityY, impulse);
      pointer.x = nextX;
      pointer.y = nextY;
      pointer.lastTime = now;
      pointer.inside = true;
      startRendering();
    };

    const render = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const deltaFrames = lastFrameTime ? clamp(0.5, 3, (time - lastFrameTime) / (1000 / 60)) : 1;
      lastFrameTime = time;
      const relaxation = Math.pow(pointer.inside ? 0.905 : 0.875, deltaFrames);
      let peak = 0;
      for (let index = 0; index < pixelCount; index += 1) {
        flowX[index] *= relaxation;
        flowY[index] *= relaxation;
        if (Math.abs(flowX[index]) < 0.08) flowX[index] = 0;
        if (Math.abs(flowY[index]) < 0.08) flowY[index] = 0;
        peak = Math.max(peak, Math.abs(flowX[index]), Math.abs(flowY[index]));
        const offset = index * 4;
        displacementData[offset] = Math.round(clamp(2, 254, 128 + flowX[index]));
        displacementData[offset + 1] = Math.round(clamp(2, 254, 128 + flowY[index]));
      }
      displacementTexture.needsUpdate = true;
      renderer.render({ scene: mesh });
      if (peak > 0.12) frame = window.requestAnimationFrame(render);
    };

    const stopRendering = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = 0;
    };
    const onEnter = (event: PointerEvent) => updatePointer(event, true);
    const onMove = (event: PointerEvent) => updatePointer(event);
    const onLeave = () => {
      pointer.inside = false;
      pointer.lastTime = 0;
      startRendering();
    };
    const onReducedMotionChange = () => {
      uniforms.uStrength.value = reducedMotion.matches ? 0 : 1;
      if (reducedMotion.matches) {
        flowX.fill(0);
        flowY.fill(0);
        stopRendering();
        renderer.render({ scene: mesh });
      }
    };
    const onVisibilityChange = () => document.hidden ? stopRendering() : startRendering();
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) renderer.render({ scene: mesh });
      else stopRendering();
    }, { rootMargin: '15% 0px' });

    resizeObserver.observe(section);
    intersectionObserver.observe(section);
    section.addEventListener('pointerenter', onEnter);
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    reducedMotion.addEventListener('change', onReducedMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();

    return () => {
      stopRendering();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      section.removeEventListener('pointerenter', onEnter);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      reducedMotion.removeEventListener('change', onReducedMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      delete section.dataset.ready;
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <section ref={root} className="interactive-wordmark" aria-labelledby="interactive-wordmark-title">
      <h2 id="interactive-wordmark-title">{WORD}</h2>
      <span className="interactive-wordmark__hint" aria-hidden="true">MOVE TO CUT PIXELS</span>
    </section>
  );
}
