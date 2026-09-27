'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeScrollScenes({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const main = root.current;
    if (!main) return;

    const hero = main.querySelector<HTMLElement>('.new-hero');
    const skills = main.querySelector<HTMLElement>('.home-skills');
    const heroIntro = main.querySelector<HTMLElement>('.hero-intro');
    const work = main.querySelector<HTMLElement>('.home-work-influence-stage');
    const workBackground = main.querySelector<HTMLElement>('[data-work-background]');
    const lanes = gsap.utils.toArray<HTMLElement>('.portfolio-flow-lane__scroll', main);
    const media = gsap.matchMedia();

    media.add({
      desktop: '(min-width: 760px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, reduced } = context.conditions!;
      if (!hero || !skills || reduced) return;

      lanes.forEach((lane, index) => {
        gsap.fromTo(lane,
          { xPercent: index % 2 === 0 ? -7 : 7 },
          {
            xPercent: index % 2 === 0 ? 7 : -7,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
      });

      if (heroIntro) {
        gsap.to(heroIntro, {
          yPercent: desktop ? -24 : -12,
          autoAlpha: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 35%', scrub: 0.45 },
        });
      }

      if (work && workBackground) {
        gsap.fromTo(workBackground,
          { autoAlpha: 0, scale: 1.025 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: work,
              start: 'top 92%',
              end: 'top 38%',
              scrub: 0.8,
            },
          });
      }

      gsap.fromTo(skills,
        { clipPath: 'inset(12% 0 0 0 round 34px 34px 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0 round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: skills, start: 'top bottom', end: 'top top', scrub: 0.6 },
        });

      gsap.from('[data-skill-word]', {
        autoAlpha: 0,
        y: 24,
        rotation: () => gsap.utils.random(-4, 4),
        duration: 0.75,
        stagger: { amount: 0.65, from: 'random' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.home-skills__cloud', start: 'top 82%', toggleActions: 'play none none reverse' },
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-item]', main).forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 54,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });
    });
  }, { scope: root });

  return <main id="main" ref={root}>{children}</main>;
}
