'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Owns the page's scroll scenes in document order; reverting removes pins and styles. */
export function HomeScrollScenes({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const main = root.current!;
      const query = <T extends HTMLElement>(selector: string) =>
        main.querySelector<T>(selector)!;
      const hero = query('.new-hero');
      const title = query('.new-hero-title');
      const wall = query('.spatial-viewport');
      const method = query('.home-method');
      const rows = gsap.utils.toArray<HTMLElement>('.method-row', main);
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: '(min-width: 900px) and (min-height: 650px)',
          compact: '(max-width: 899px), (max-height: 649px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (context.conditions?.reduced) return;
          const zoom = { progress: 0 };
          const updateWall = () => wall.dispatchEvent(new CustomEvent('gallery-scroll', { detail: zoom.progress }));
          if (!context.conditions?.desktop) {
            gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '65% top',
                scrub: 0.45,
                invalidateOnRefresh: true,
              },
            })
              .fromTo(title, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.7 }, 0)
              .fromTo(zoom, { progress: 0 }, { progress: 1, duration: 1, onUpdate: updateWall }, 0);
            return () => { zoom.progress = 0; updateWall(); };
          }
          method.classList.add('is-sequenced');
          main.classList.add('has-scroll-scenes');

          const intro = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'home-intro',
              trigger: hero,
              start: 'top top',
              end: () => `+=${window.innerHeight * 1.8}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          intro
            .addLabel('作品墙', 0)
            .fromTo(zoom, { progress: 0 }, { progress: 1, duration: 1, onUpdate: updateWall }, 0)
            .fromTo(title, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -38, duration: 0.55 }, 0.1)
            .addLabel('进入下一幕', 1);

          gsap.set(rows, { autoAlpha: 0, y: 65 });
          gsap.set(rows[0], { autoAlpha: 1, y: 0 });
          const narrative = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
              id: 'home-method',
              trigger: method,
              start: 'top top',
              end: () => `+=${window.innerHeight * 3.4}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          rows.forEach((row, index) => {
            const at = index * 1.5;
            narrative.addLabel(`步骤${index + 1}`, at);
            if (index > 0)
              narrative.to(row, { autoAlpha: 1, y: 0, duration: 0.45 }, at);
            if (index < rows.length - 1)
              narrative.to(
                row,
                { autoAlpha: 0, y: -65, duration: 0.4 },
                at + 1.1,
              );
          });
          narrative.to(
            query('.method-progress span'),
            { scaleX: 1, ease: 'none', duration: 6 },
            0,
          );

          const story = query('.home-story');
          const entries = gsap.utils.toArray<HTMLElement>(
            '.story-timeline article',
            main,
          );
          const history = gsap.timeline({
            scrollTrigger: {
              id: 'home-history',
              trigger: story,
              start: 'top top',
              end: () => `+=${window.innerHeight * 0.9}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          history.from(
            entries,
            {
              autoAlpha: 0,
              y: 55,
              stagger: 0.32,
              duration: 0.5,
              ease: 'power2.out',
            },
            0.1,
          );

          const about = query('.home-about-panel');
          gsap
            .timeline({
              scrollTrigger: {
                id: 'home-about',
                trigger: about,
                start: 'top top',
                end: () => `+=${window.innerHeight * 0.75}`,
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
            .from(
              query('.about-placeholder'),
              { scale: 0.86, autoAlpha: 0.15, duration: 1, ease: 'none' },
              0,
            )
            .from(
              query('.home-about-text'),
              { y: 70, autoAlpha: 0, duration: 0.65, ease: 'power2.out' },
              0.2,
            );
          return () => {
            zoom.progress = 0;
            updateWall();
            method.classList.remove('is-sequenced');
            main.classList.remove('has-scroll-scenes');
          };
        },
      );
      // Registering all scenes before refresh prevents later pins from shifting earlier triggers.
      ScrollTrigger.refresh();
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <main id="main" ref={root}>
      {children}
    </main>
  );
}
