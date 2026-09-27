'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './acid-squares.css';

type AcidSquaresProps = {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  detail?: 'low' | 'medium' | 'high';
  speed?: number;
  waveDepth?: number;
  zoom?: number;
  density?: number;
  glow?: number;
  exposure?: number;
  spread?: number;
  stepSize?: number;
  colorShift?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  grain?: boolean;
  grainIntensity?: number;
};

const DETAIL_STEPS = { low: 20, medium: 32, high: 48 };

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uWaveDepth;
uniform float uZoom;
uniform float uDensity;
uniform float uSpread;
uniform float uStepSize;
uniform float uGlow;
uniform float uExposure;
uniform float uColorShift;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform float uSteps;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uEnableMouse;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;
  float zoom = max(uZoom, 0.05);
  float aspect = iResolution.x / iResolution.y;
  vec2 ndc = (2.0 * frag - iResolution.xy) / iResolution.y;
  vec2 dir = ndc * (0.5 / zoom);
  vec2 mouseNdc = vec2(uMouse.x * aspect, uMouse.y);
  float mr = max(uMouseRadius, 0.01);
  vec2 md = ndc - mouseNdc;
  float dent = exp(-dot(md, md) / (mr * mr)) * (3.0 * uMouseStrength * uEnableMouse * uMouseActive);
  float travel = sin(iTime * uSpeed) * uWaveDepth;
  float density = max(uDensity, 1.0);
  float spread = clamp(uSpread, 0.05, 0.6);
  float stepSize = max(uStepSize, 0.0005);
  float glowGain = max(uGlow, 0.0);
  vec3 tOffset = vec3(0.0, dent, travel);
  vec3 p = vec3(0.0);
  float s = 0.0;
  float glow = 0.0;

  for (int i = 0; i < 64; i++) {
    if (float(i) >= uSteps) break;
    p += vec3(dir * s, s);
    vec3 q = p + tOffset;
    s += density - length(q.xz) + length(ceil(q).xy);
    s = stepSize + abs(s) * spread;
    glow += glowGain / s;
  }

  float e = glow / max(uExposure, 1.0);
  float shimmer = 0.5 + 0.5 * dot(cos(iTime * uColorShift + p), vec3(0.3333));
  float v = tanh(e * uBrightness * mix(0.7, 1.05, shimmer));
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);
  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.55, v));
  col = mix(col, uColor3, smoothstep(0.55, 1.0, v));
  col *= v;
  float a = clamp(v, 0.0, 1.0) * uOpacity;
  vec3 outRgb = col * a;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    a = clamp(a + gv, 0.0, 1.0);
  }
  fragColor = vec4(outRgb, a);
}
`;

export function AcidSquares({
  className = '',
  color1 = '#5227FF',
  color2 = '#A855F7',
  color3 = '#FFFFFF',
  detail = 'medium',
  speed = 0.7,
  waveDepth = 1,
  zoom = 1.3,
  density = 10,
  glow = 1,
  exposure = 2700,
  spread = 0.3,
  stepSize = 0.002,
  colorShift = 0,
  contrast = 1,
  brightness = 1,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.1,
  mouseRadius = 0.35,
  grain = true,
  grainIntensity = 0.05,
}: AcidSquaresProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.75),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(canvas);

    const colors = [hexToRgb(color1), hexToRgb(color2), hexToRgb(color3)];
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uSpeed: { value: speed }, uWaveDepth: { value: waveDepth }, uZoom: { value: zoom },
      uDensity: { value: density }, uSpread: { value: spread }, uStepSize: { value: stepSize },
      uGlow: { value: glow }, uExposure: { value: exposure }, uColorShift: { value: colorShift },
      uContrast: { value: contrast }, uBrightness: { value: brightness }, uOpacity: { value: opacity },
      uSteps: { value: DETAIL_STEPS[detail] },
      uColor1: { value: new Float32Array(colors[0]) },
      uColor2: { value: new Float32Array(colors[1]) },
      uColor3: { value: new Float32Array(colors[2]) },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseStrength: { value: mouseStrength }, uMouseRadius: { value: mouseRadius },
      uEnableMouse: { value: mouseInteraction ? 1 : 0 }, uMouseActive: { value: 0 },
      uGrain: { value: grain ? 1 : 0 }, uGrainIntensity: { value: grainIntensity },
    };
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex, fragment, uniforms });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const mouseTarget = [0, 0];
    const mouseCurrent = [0, 0];
    let mouseActiveTarget = 0;
    let mouseActive = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) {
        mouseActiveTarget = 0;
        return;
      }
      mouseTarget[0] = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTarget[1] = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseActiveTarget = 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = true;
    const start = performance.now();
    const loop = (time: number) => {
      if (!visible) return;
      uniforms.iTime.value = (time - start) * 0.001;
      mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * 0.05;
      mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * 0.05;
      uniforms.uMouse.value[0] = mouseCurrent[0];
      uniforms.uMouse.value[1] = mouseCurrent[1];
      mouseActive += (mouseActiveTarget - mouseActive) * 0.05;
      uniforms.uMouseActive.value = mouseActive;
      renderer.render({ scene: mesh });
      if (!reduceMotion) frame = window.requestAnimationFrame(loop);
    };
    renderer.render({ scene: mesh });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion && !frame) frame = window.requestAnimationFrame(loop);
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(container);
    if (!reduceMotion) frame = window.requestAnimationFrame(loop);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [brightness, color1, color2, color3, colorShift, contrast, density, detail, exposure, glow, grain, grainIntensity, mouseInteraction, mouseRadius, mouseStrength, opacity, speed, spread, stepSize, waveDepth, zoom]);

  return <div ref={containerRef} aria-hidden="true" className={`acid-squares-container ${className}`.trim()} />;
}
