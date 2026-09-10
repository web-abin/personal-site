'use client';

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealPageProps = ComponentPropsWithoutRef<'main'> & { children: ReactNode };

/** A shared, deliberately quiet reveal language for content-led pages. */
export function RevealPage({ children, ...props }: RevealPageProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const sections = gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current);
        sections.forEach((section) => {
          const items = section.querySelectorAll<HTMLElement>('[data-reveal-item]');
          const targets = items.length ? [...items] : [section];
          const reveal = {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          };
          // Above-the-fold content should never wait for the first wheel event.
          if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
            gsap.from(targets, reveal);
          } else {
            gsap.from(targets, {
              ...reveal,
              scrollTrigger: { trigger: section, start: 'top 86%', once: true },
            });
          }
        });
        ScrollTrigger.refresh();
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return <main ref={root} {...props}>{children}</main>;
}
