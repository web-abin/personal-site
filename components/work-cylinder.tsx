'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/portfolio';
import { WORK_CYLINDER_CONFIG as CONFIG } from '@/lib/work-cylinder-config';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

const featuredProjects = projects.filter((project) => !project.sample).slice(0, 5);
const letters = ['W', 'O', 'R', 'K'] as const;
type WorkLetter = typeof letters[number];
const makeCharacterIndexes = (count: number) => Array.from(
  { length: count },
  (_, index) => index - Math.floor(count / 2),
);
const characterIndexes = Object.fromEntries(
  letters.map((letter) => [letter, makeCharacterIndexes(CONFIG.letterCounts[letter])]),
) as Record<WorkLetter, number[]>;

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function WorkCylinder() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = root.current;
    const stageElement = stage.current;
    if (!section || !stageElement) return;

    const mask = section.querySelector<SVGSVGElement>('[data-work-mask]');
    const exitCover = section.querySelector<HTMLElement>('[data-work-exit-cover]');
    const dots = section.querySelector<HTMLElement>('[data-work-dots]');
    const cardsLayer = section.querySelector<HTMLElement>('[data-work-cards]');
    const cta = section.querySelector<HTMLElement>('[data-work-cta]');
    const cardElements = gsap.utils.toArray<HTMLElement>('[data-work-card]', section);
    const characterElements = gsap.utils.toArray<HTMLElement>('[data-work-character]', section);
    if (!mask || !exitCover || !dots || !cardsLayer || !cta) return;

    const characterSetters = characterElements.map((element) => ({
      letter: element.dataset.workLetter as WorkLetter,
      charIndex: Number(element.dataset.workIndex),
      transform: (value: string) => { element.style.transform = value; },
    }));
    const cardSetters = cardElements.map((element) => ({
      transform: (value: string) => { element.style.transform = value; },
      opacity: (value: number) => { element.style.opacity = String(value); },
    }));
    const setMaskTransform = (value: string) => { mask.style.transform = value; };
    const setMaskOpacity = gsap.quickSetter(mask, 'opacity') as (value: number) => void;
    const setDotsTransform = (value: string) => { dots.style.transform = value; };
    const state = { progress: 0 };
    stageElement.style.setProperty('--work-row-gap', `${CONFIG.rowGap}px`);

    const getCardMetrics = () => {
      const viewportWidth = window.innerWidth;
      const compact = viewportWidth < 720;
      const cardWidth = Math.max(245, Math.min(compact ? 330 : 510, viewportWidth * (compact ? 0.72 : 0.31)));
      const spacing = CONFIG.cardSpacing * (compact ? 0.72 : 1);
      const offscreenPadding = CONFIG.cardOffscreenPadding * (compact ? 0.55 : 1);
      // Start with the first card fully beyond the right edge and finish with
      // the final card equally far beyond the left edge.
      const start = viewportWidth * 0.5 + cardWidth * 0.5 + offscreenPadding;
      const totalTravel = viewportWidth + cardWidth + offscreenPadding * 2 + spacing * (cardElements.length - 1);
      const centers = cardElements.map((_, index) => (
        0.26 + clamp((start + index * spacing) / totalTravel) * (0.72 - 0.26)
      ));
      return { cardWidth, spacing, start, totalTravel, centers };
    };

    const render = () => {
      const progress = state.progress;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const stageHeight = stageElement.clientHeight;
      const compact = viewportWidth < 720;
      const radius = Math.max(
        compact ? CONFIG.cardCylinderRadius * 0.58 : CONFIG.cardCylinderRadius,
        viewportWidth * 1.82,
      );
      const letterMaxHeight = CONFIG.letterMaxHeight;
      stageElement.style.setProperty('--work-letter-max-height', `${letterMaxHeight}px`);
      const enter = smooth(range(progress, 0, 0.1));
      const open = smooth(range(progress, 0.1, 0.26));
      const cardRun = range(progress, CONFIG.cardTravelRange.start, CONFIG.cardTravelRange.end);
      const collapse = smooth(range(progress, 0.74, 0.89));
      const capsuleExit = smooth(range(
        progress,
        CONFIG.capsuleExitRange.start,
        CONFIG.capsuleExitRange.end,
      ));
      const letterHeight = progress < 0.74
        ? CONFIG.letterMinHeight + (letterMaxHeight - CONFIG.letterMinHeight) * open
        : letterMaxHeight - (letterMaxHeight - CONFIG.letterMinHeight) * collapse;
      const letterScale = letterHeight / letterMaxHeight;
      stageElement.style.setProperty('--work-letter-height', `${letterHeight}px`);
      const maskScale = progress < 0.74 ? 1 + open * 18 : 19 - collapse * 18;
      const maskOpacity = progress < 0.74
        ? 1 - range(open, 0.78, 1)
        : range(collapse, 0, 0.18);

      const maskTravel = stageHeight * 0.425;
      const capsuleHeight = compact
        ? Math.min(stageHeight * 0.58 + 180, 650)
        : Math.min(stageHeight * 0.64 + 150, 760);
      const capsuleExitDistance = stageHeight * 0.5 + capsuleHeight * 0.5 + 48;
      const gridTailHeight = 70 * 5;
      const naturalTailHeight = (stageHeight - capsuleHeight) * 0.5;
      const maskTailExtension = Math.max(0, gridTailHeight - naturalTailHeight);
      stageElement.style.setProperty(
        '--work-mask-height',
        `${stageHeight + maskTravel + maskTailExtension}px`,
      );
      stageElement.style.setProperty('--work-mask-center-y', `${stageHeight * 0.5 + maskTravel}px`);
      // Exit the grid, capsule cutout and capsule outline as one rigid sheet.
      // Keeping them in the same coordinate space prevents the capsule from
      // drifting faster than the grid and lets the sheet's bottom edge reveal About.
      const maskY = -enter * maskTravel;
      const exitY = capsuleExit * capsuleExitDistance;
      setMaskTransform(`translate3d(0, ${maskY - exitY}px, 0) scale(${maskScale})`);
      setMaskOpacity(maskOpacity);
      const sheetBottom = stageHeight + maskTailExtension - exitY;
      const exitCoverTop = capsuleExit > 0 ? clamp(sheetBottom, 0, stageHeight) : stageHeight;
      exitCover.style.transform = `translate3d(0,${exitCoverTop}px,0)`;

      // The directory CTA is rigidly attached to the grid sheet, exactly two
      // 70px grid rows below the capsule. It enters only because the whole
      // sheet moves upward; the CTA itself has no reveal or slide animation.
      const maskCenterY = stageHeight * 0.5 + maskTravel;
      const maskTranslationY = maskY - exitY;
      const capsuleOuterHeight = capsuleHeight + 32;
      const capsuleBottom = maskCenterY
        + maskTranslationY
        + capsuleOuterHeight * maskScale * 0.5;
      const ctaTop = capsuleBottom + 70 * 2;
      cta.style.transform = `translate3d(-50%,${ctaTop}px,0)`;
      cta.style.pointerEvents = ctaTop < stageHeight && ctaTop + cta.offsetHeight > 0
        ? 'auto'
        : 'none';

      const dotTravel = range(progress, 0.1, 0.89) * CONFIG.dotDriftSpeed;
      setDotsTransform(`translate3d(${-dotTravel}px, ${dotTravel * 0.42}px, 0)`);

      const { cardWidth, spacing, start, totalTravel } = getCardMetrics();
      const cardsActive = progress >= CONFIG.cardTravelRange.start
        && progress <= CONFIG.cardTravelRange.end;
      cardsLayer.style.opacity = cardsActive ? '1' : '0';
      cardsLayer.style.pointerEvents = cardsActive ? 'auto' : 'none';

      const shift = start - cardRun * totalTravel;

      cardSetters.forEach((setter, index) => {
        const arcDistance = shift + index * spacing;
        const arcLimit = start + cardWidth * 0.25;
        const onVisibleArc = Math.abs(arcDistance) <= arcLimit;
        const theta = Math.max(-1.12, Math.min(1.12, arcDistance / radius));
        const x = radius * Math.sin(theta);
        const z = radius * (Math.cos(theta) - 1);
        const topTrack = index % 2 === 0;
        const baseY = (compact ? 92 : 142) * (topTrack ? -1 : 1);
        const cylinderDepth = radius * (1 - Math.cos(theta));
        const curveY = cylinderDepth * 0.13 * (topTrack ? -1 : 1);
        const edgeTheta = Math.asin(clamp((viewportWidth * 0.5) / radius, 0, 0.92));
        const edgeStrength = clamp(theta / Math.max(edgeTheta, 0.01), -1, 1);
        const rotationY = -theta * 180 / Math.PI;
        const rotationZ = edgeStrength * (topTrack ? -CONFIG.cardBankMax : CONFIG.cardBankMax);
        const rotationX = Math.abs(edgeStrength) * (topTrack ? CONFIG.cardPitchMax : -CONFIG.cardPitchMax);
        setter.opacity(onVisibleArc ? 1 : 0);
        setter.transform(`translate3d(${x}px, ${baseY + curveY}px, ${z}px) rotateZ(${rotationZ}deg) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`);
      });

      characterSetters.forEach((setter) => {
        const { letter, charIndex } = setter;
        const count = CONFIG.letterCounts[letter];
        const step = CONFIG.letterRowSpan / (count - 1) * (compact ? 0.72 : 1);
        const span = count * step;
        const travel = cardRun * (compact ? 1800 : 3100) * CONFIG.scrollSpeeds[letter];
        let movingX = (charIndex * step - travel + span / 2) % span;
        if (movingX < 0) movingX += span;
        movingX -= span / 2;

        let x = charIndex * step * open;
        if (progress >= 0.26 && progress < 0.74) x = movingX;
        if (progress >= 0.74) {
          const endTravel = (compact ? 1800 : 3100) * CONFIG.scrollSpeeds[letter];
          let endX = (charIndex * step - endTravel + span / 2) % span;
          if (endX < 0) endX += span;
          endX -= span / 2;
          x = endX * (1 - collapse);
        }

        const normalized = x / Math.max(step, 1);
        const y = normalized * normalized * CONFIG.curves[letter] * (compact ? 0.72 : 1);
        const theta = x / radius;
        const z = -radius * (1 - Math.cos(theta));
        const rotationY = theta * 180 / Math.PI * 0.45;
        const inWorkWall = progress >= 0.26 && progress < 0.74;
        const edgeDistance = clamp(Math.abs(x) / Math.max(viewportWidth * 0.55, 1));
        const edgeScale = 0.79 * (1 + (inWorkWall ? edgeDistance * CONFIG.letterEdgeScaleSpeed : 0));
        setter.transform(`translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotationY}deg) scale(${letterScale}) scaleX(${edgeScale})`);
      });

      stageElement.style.setProperty('--work-progress', progress.toFixed(4));
      stageElement.style.setProperty('--work-vh', `${stageHeight}px`);
    };

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      render();
      const workTrigger = ScrollTrigger.create({
        id: 'home-work-cylinder',
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 4.6, 3000)}`,
        pin: stageElement,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          document.documentElement.dataset.workSceneActive = String(self.isActive);
          window.dispatchEvent(new Event('workscenechange'));
        },
        onUpdate: (self) => {
          state.progress = self.progress;
          render();
        },
        onRefresh: (self) => {
          state.progress = self.progress;
          render();
        },
      });
      state.progress = workTrigger.progress;
      document.documentElement.dataset.workSceneActive = String(workTrigger.isActive);
      window.dispatchEvent(new Event('workscenechange'));
      render();
      return () => {
        workTrigger.kill();
        delete document.documentElement.dataset.workSceneActive;
        window.dispatchEvent(new Event('workscenechange'));
      };
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
        <h2 id="work-title" className="sr-only">Work</h2>

        <div className="work-cylinder__world" aria-hidden="true">
          <div className="work-cylinder__dots" data-work-dots />
          <div className="work-cylinder__letters">
            {letters.map((letter) => (
              <div className="work-cylinder__letter-row" key={letter}>
                {characterIndexes[letter].map((index) => (
                  <span
                    data-work-character
                    data-work-letter={letter}
                    data-work-index={index}
                    key={`${letter}-${index}`}
                  >{letter}</span>
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
              <span className="work-cylinder__card-image">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 700px) 72vw, 31vw"
                  priority={index < 2}
                  draggable={false}
                />
              </span>
              <span className="work-cylinder__card-copy">
                <b>{project.title}</b>
                <i>{project.category}</i>
              </span>
            </Link>
          ))}
        </div>

        <div className="work-cylinder__exit-cover" data-work-exit-cover aria-hidden="true" />

        <svg className="work-cylinder__mask" data-work-mask aria-hidden="true">
          <defs>
            <pattern id="work-grid-pattern" width="98" height="70" patternUnits="userSpaceOnUse">
              <rect width="98" height="70" className="work-cylinder__grid-cell" />
              <path d="M98 0H0V70" className="work-cylinder__grid-line" />
            </pattern>
            <mask id="work-capsule-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
              <rect width="100%" height="100%" fill="white" />
              <rect className="work-cylinder__mask-hole" data-work-hole fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#work-grid-pattern)" mask="url(#work-capsule-mask)" />
          <rect className="work-cylinder__capsule-fill" data-work-capsule-part />
          <rect className="work-cylinder__capsule" data-work-capsule data-work-capsule-part />
        </svg>

        <Link className="work-cylinder__view-all" data-work-cta href="/works" aria-label="View all work">
          <span className="work-cylinder__view-all-copy">
            <strong>VIEW ALL WORK</strong>
          </span>
          <span className="work-cylinder__view-all-icon" aria-hidden="true">
            <ArrowUpRight />
          </span>
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
