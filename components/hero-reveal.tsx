'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { mountReveal } from '@/lib/hero-reveal-controller';
import './hero-reveal.css';

export type HeroRevealProps = {
  baseImage: string;
  revealImage: string;
  alt: string;
  /** Fixed lens diameter in CSS pixels. */
  lensDiameter?: number;
  /** Frame-rate independent equivalent of a 60 Hz lerp factor. */
  follow?: number;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: string;
  className?: string;
  children?: ReactNode;
};

/** Both images share one layout; only the reveal layer is clipped. */
export function HeroReveal({
  baseImage,
  revealImage,
  alt,
  lensDiameter = 260,
  follow = 0.12,
  objectFit = 'contain',
  objectPosition = 'center',
  className = '',
  children,
}: HeroRevealProps) {
  const root = useRef<HTMLElement>(null);
  const base = useRef<HTMLImageElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !base.current || !image.current || !layer.current)
      return;
    // Portal-like DOM ownership keeps the fixed cursor outside clipped/transformed ancestors.
    const lens = document.createElement('div');
    lens.className = 'custom-cursor-lens';
    lens.setAttribute('aria-hidden', 'true');
    document.body.appendChild(lens);
    const dispose = mountReveal({
      root: root.current,
      layer: layer.current,
      lens,
      images: [base.current, image.current],
      diameter: lensDiameter,
      follow,
    });
    return () => {
      dispose();
      lens.remove();
    };
  }, [baseImage, revealImage, lensDiameter, follow]);

  const style = {
    '--reveal-fit': objectFit,
    '--reveal-position': objectPosition,
  } as CSSProperties;

  return (
    <section
      ref={root}
      className={`hero-reveal ${className}`}
      style={style}
      aria-label="个人介绍与交互作品展示"
    >
      <div className="hero-reveal-layer hero-reveal-base">
        <img
          ref={base}
          className="hero-reveal-image"
          src={baseImage}
          alt={alt}
          width={2000}
          height={2074}
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </div>
      <div
        ref={layer}
        className="hero-reveal-layer hero-reveal-overlay"
        aria-hidden="true"
      >
        <img
          ref={image}
          className="hero-reveal-image"
          src={revealImage}
          alt=""
          width={2000}
          height={2074}
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="hero-reveal-content">{children}</div>
    </section>
  );
}
