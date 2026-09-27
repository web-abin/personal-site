'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/portfolio';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

const featuredProjects = projects.filter((project) => !project.sample).slice(0, 5);
const letters = ['W', 'O', 'R', 'K'] as const;
const characterIndexes = Array.from({ length: 19 }, (_, index) => index - 9);

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function WorkCylinder() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = root.current;
    const pin = stage.current;
    if (!section || !pin) return;

    const mask = section.querySelector<HTMLElement>('[data-work-mask]');
    const capsule = section.querySelector<HTMLElement>('[data-work-capsule]');
    const cardsLayer = section.querySelector<HTMLElement>('[data-work-cards]');
    const cta = section.querySelector<HTMLElement>('[data-work-cta]');
    const cardElements = gsap.utils.toArray<HTMLElement>('[data-work-card]', section);
    const characterElements = gsap.utils.toArray<HTMLElement>('[data-work-character]', section);
    if (!mask || !capsule || !cardsLayer || !cta) return;

    const characterSetters = characterElements.map((element) => ({
      transform: gsap.quickSetter(element, 'transform') as (value: string) => void,
      opacity: gsap.quickSetter(element, 'opacity') as (value: number) => void,
    }));
    const cardSetters = cardElements.map((element) => ({
      transform: gsap.quickSetter(element, 'transform') as (value: string) => void,
      opacity: gsap.quickSetter(element, 'opacity') as (value: number) => void,
    }));
    const setMaskTransform = gsap.quickSetter(mask, 'transform') as (value: string) => void;
    const setMaskOpacity = gsap.quickSetter(mask, 'opacity') as (value: number) => void;
    const setCapsuleOpacity = gsap.quickSetter(capsule, 'opacity') as (value: number) => void;
    const setCardsOpacity = gsap.quickSetter(cardsLayer, 'opacity') as (value: number) => void;
    const setCtaOpacity = gsap.quickSetter(cta, 'opacity') as (value: number) => void;
    const setCtaTransform = gsap.quickSetter(cta, 'transform') as (value: string) => void;

    const state = { progress: 0 };
    const curves = [-1.5, -0.42, 0.42, 1.5];
    const speeds = [1.65, 0.72, 1.05, 1.72];

    const render = () => {
      const progress = state.progress;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const compact = viewportWidth < 720;
      const radius = compact ? 1050 : 1800;
      const baseStep = compact ? 72 : Math.max(92, Math.min(126, viewportWidth * 0.068));
      const open = smooth(range(progress, 0.1, 0.25));
      const cardRun = range(progress, 0.25, 0.76);
      const collapse = smooth(range(progress, 0.78, 0.92));
      const enterY = (1 - smooth(range(progress, 0, 0.1))) * 105;
      const maskScale = progress < 0.78 ? 1 + open * 18 : 19 - collapse * 18;
      const maskOpacity = progress < 0.78
        ? 1 - range(open, 0.78, 1)
        : range(collapse, 0, 0.18);

      setMaskTransform(`translate3d(0, ${enterY}vh, 0) scale(${maskScale})`);
      setMaskOpacity(maskOpacity);
      setCapsuleOpacity(maskOpacity);

      const cardsOpacity = Math.min(range(progress, 0.235, 0.285), 1 - range(progress, 0.745, 0.81));
      setCardsOpacity(cardsOpacity);
      cardsLayer.style.pointerEvents = cardsOpacity > 0.72 ? 'auto' : 'none';

      const cardWidth = Math.max(245, Math.min(compact ? 330 : 510, viewportWidth * (compact ? 0.72 : 0.31)));
      const spacing = cardWidth * (compact ? 1.08 : 1.22);
      const start = viewportWidth * 0.5 + cardWidth * 0.72;
      const totalTravel = viewportWidth + cardWidth * 1.45 + spacing * (cardElements.length - 1);
      const shift = start - cardRun * totalTravel;

      cardSetters.forEach((setter, index) => {
        const linearX = shift + index * spacing;
        const activeZone = viewportWidth * 0.56;
        const ratio = clamp(Math.abs(linearX) / activeZone);
        const easedX = Math.sign(linearX || 1) * Math.pow(ratio, 1.65) * activeZone;
        const x = Math.abs(linearX) < activeZone ? easedX : linearX;
        const topTrack = index % 2 === 0;
        const baseY = (compact ? 92 : 142) * (topTrack ? -1 : 1);
        const curveY = Math.pow(x / Math.max(cardWidth * 0.72, 1), 2) * (topTrack ? -9 : 9);
        const theta = x / radius;
        const z = -radius * (1 - Math.cos(theta));
        const rotationY = theta * 180 / Math.PI * 0.48;
        const rotationZ = x * (topTrack ? -0.009 : 0.009);
        setter.transform(`translate3d(${x}px, ${baseY + curveY}px, ${z}px) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`);
        setter.opacity(clamp(1 - Math.max(0, Math.abs(x) - viewportWidth * 0.58) / (viewportWidth * 0.36)));
      });

      characterSetters.forEach((setter, flatIndex) => {
        const rowIndex = Math.floor(flatIndex / characterIndexes.length);
        const charIndex = characterIndexes[flatIndex % characterIndexes.length];
        const step = baseStep * [1.08, 0.88, 0.88, 1][rowIndex];
        const span = characterIndexes.length * step;
        const travel = cardRun * (compact ? 1800 : 3100) * speeds[rowIndex];
        let movingX = (charIndex * step - travel + span / 2) % span;
        if (movingX < 0) movingX += span;
        movingX -= span / 2;

        let x = charIndex * step * open;
        if (progress >= 0.25 && progress < 0.78) x = movingX;
        if (progress >= 0.78) {
          const endTravel = (compact ? 1800 : 3100) * speeds[rowIndex];
          let endX = (charIndex * step - endTravel + span / 2) % span;
          if (endX < 0) endX += span;
          endX -= span / 2;
          x = endX * (1 - collapse);
        }

        const normalized = x / Math.max(step, 1);
        const y = normalized * normalized * curves[rowIndex] * (compact ? 0.72 : 1);
        const theta = x / radius;
        const z = -radius * (1 - Math.cos(theta));
        const rotationY = theta * 180 / Math.PI * 0.45;
        const edgeScale = 0.79 + clamp(Math.abs(x) / (viewportWidth * 0.5)) * 0.04;
        setter.transform(`translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotationY}deg) scaleX(${edgeScale}) translate(-50%, -50%)`);
        setter.opacity(Math.abs(x) > viewportWidth * 0.82 ? 0 : 1);
      });

      const ctaProgress = smooth(range(progress, 0.92, 0.965));
      setCtaOpacity(ctaProgress);
      setCtaTransform(`translate3d(-50%, ${(1 - ctaProgress) * 18}px, 0)`);
      pin.style.setProperty('--work-progress', progress.toFixed(4));
      pin.style.setProperty('--work-vh', `${viewportHeight}px`);
    };

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      render();
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          id: 'home-work-cylinder',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 5.6, 3600)}`,
          pin,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      section.dataset.reducedMotion = 'true';
      return () => delete section.dataset.reducedMotion;
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <section id="work" ref={root} className="work-cylinder" aria-labelledby="work-title">
      <div ref={stage} className="work-cylinder__stage">
        <header className="work-cylinder__meta">
          <span>SELECTED WORK · 01—05</span>
          <h2 id="work-title">Work</h2>
          <span>SCROLL TO ORBIT</span>
        </header>

        <div className="work-cylinder__world" aria-hidden="true">
          <div className="work-cylinder__dots" />
          <div className="work-cylinder__letters">
            {letters.map((letter) => (
              <div className="work-cylinder__letter-row" key={letter}>
                {characterIndexes.map((index) => (
                  <span data-work-character key={`${letter}-${index}`}>{letter}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="work-cylinder__cards" data-work-cards>
          {featuredProjects.map((project, index) => (
            <Link
              href={`/works/${project.slug}`}
              className="work-cylinder__card"
              data-work-card
              key={project.slug}
              aria-label={`View ${project.english}`}
            >
              <Image
                src={project.cover}
                alt={project.title}
                fill
                sizes="(max-width: 700px) 72vw, 31vw"
                priority={index < 2}
                draggable={false}
              />
              <span className="work-cylinder__card-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="work-cylinder__card-copy"><b>{project.english}</b><i>{project.category}</i></span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="work-cylinder__mask" data-work-mask aria-hidden="true">
          <i className="work-cylinder__mask-top" />
          <i className="work-cylinder__mask-right" />
          <i className="work-cylinder__mask-bottom" />
          <i className="work-cylinder__mask-left" />
        </div>
        <div className="work-cylinder__capsule" data-work-capsule aria-hidden="true" />

        <Link className="work-cylinder__view-all" href="/works" data-work-cta>
          <span>VIEW ALL WORK</span><ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <div className="work-cylinder__reduced">
        <header><span>SELECTED WORK</span><h2>Work</h2></header>
        <div>
          {featuredProjects.map((project) => (
            <Link href={`/works/${project.slug}`} key={project.slug}>
              <Image src={project.cover} alt={project.title} fill sizes="(max-width: 700px) 100vw, 50vw" />
              <span><b>{project.english}</b><i>{project.category}</i></span>
            </Link>
          ))}
        </div>
        <Link href="/works">VIEW ALL WORK <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
