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
      const gallery = query('.home-gallery');
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
          if (!context.conditions?.desktop) {
            gsap.timeline({
              defaults: { ease: 'power2.out' },
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '55% top',
                scrub: 0.35,
                invalidateOnRefresh: true,
              },
            })
              .fromTo(title, { autoAlpha: 1 }, { autoAlpha: 0, y: -24, duration: 0.75 }, 0)
              .fromTo(gallery, { scale: 1 }, { scale: 1.035, autoAlpha: 0.45, duration: 1 }, 0);
            gsap.utils.toArray<HTMLElement>('[data-home-reveal]', main).forEach((section) => {
              const items = section.querySelectorAll<HTMLElement>('[data-home-reveal-item]');
              gsap.from(items.length ? [...items] : section, {
                autoAlpha: 0, y: 26, duration: 0.7, stagger: 0.07, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 86%', once: true },
              });
            });
            gsap.utils.toArray<HTMLElement>('[data-home-timeline]', main).forEach((section) => {
              gsap.fromTo(section, { '--chapter-progress': 0 }, {
                '--chapter-progress': 1, ease: 'none',
                scrollTrigger: { trigger: section, start: 'top 78%', end: 'bottom 55%', scrub: 0.35 },
              });
            });
            return;
          }
          method.classList.add('is-sequenced');
          main.classList.add('has-scroll-scenes');

          const intro = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'home-intro',
              trigger: hero,
              start: 'top top',
              end: () => `+=${window.innerHeight * 0.9}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          intro
            .addLabel('作品墙', 0)
            .fromTo(gallery, { scale: 1, autoAlpha: 1 }, { scale: 1.055, autoAlpha: 0.28, duration: 1 }, 0)
            .fromTo(title, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -34, duration: 0.7 }, 0.08)
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

          gsap.utils.toArray<HTMLElement>('[data-home-reveal]', main).forEach((section) => {
            const items = section.querySelectorAll<HTMLElement>('[data-home-reveal-item]');
            gsap.from(items.length ? [...items] : section, {
              autoAlpha: 0, y: 30, duration: 0.78, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 82%', once: true },
            });
          });
          gsap.utils.toArray<HTMLElement>('[data-home-timeline]', main).forEach((section) => {
            gsap.fromTo(section, { '--chapter-progress': 0 }, {
              '--chapter-progress': 1, ease: 'none',
              scrollTrigger: { trigger: section, start: 'top 72%', end: 'bottom 48%', scrub: 0.45 },
            });
          });
          return () => {
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
