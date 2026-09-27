'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  kind: string;
};

export function AboutTimeline({ items }: { items: TimelineItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = root.current!;
    const entries = gsap.utils.toArray<HTMLElement>('[data-timeline-entry]', element);
    gsap.fromTo('[data-timeline-line]', { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top 70%', end: 'bottom 66%', scrub: 0.35 },
    });
    entries.forEach((entry) => {
      gsap.fromTo(entry, { autoAlpha: 0, x: 34 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: { trigger: entry, start: 'top 82%', toggleActions: 'play none none reverse' },
      });
    });
  }, { scope: root });

  return (
    <div className="career-timeline" ref={root}>
      <span className="career-timeline__rail" aria-hidden="true"><i data-timeline-line /></span>
      {items.map((item, index) => (
        <article className="career-entry" data-timeline-entry key={item.date}>
          <span className="career-entry__dot" aria-hidden="true" />
          <div className="career-entry__meta"><b>{String(index + 1).padStart(2, '0')}</b><span>{item.date}</span><em>{item.kind}</em></div>
          <div className="career-entry__body"><h2>{item.title}</h2><p>{item.description}</p></div>
        </article>
      ))}
    </div>
  );
}
