'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import InfiniteMenu from '@/components/InfiniteMenu';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/portfolio';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);
const menuItems = projects.map(project => ({ image: project.cover, title: project.title, description: project.description, link: `/works/${project.slug}` }));

export function WorksGallery() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const previous = useRef(0);
  const [direction, setDirection] = useState(1);
  const project = projects[active];
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current!.querySelector('.works-orbit-stage'), {
        opacity: 0, scale: 0.72, rotation: -8, duration: 1.15, delay: 0.05, ease: 'power3.out', clearProps: 'all',
      });
      gsap.from(root.current!.querySelector('.works-inspector'), { opacity:0, x:24, delay:0.35, duration:0.7, ease:'power3.out', clearProps:'all' });
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="works-directory">
    <h1 className="sr-only">我的作品</h1>
    <div className="works-orbit-stage">
      <InfiniteMenu items={menuItems} scale={1.15}
        onChange={(index: number) => {
          setDirection(index >= previous.current ? 1 : -1);
          previous.current = index;
          setActive(index);
        }}
      />
    </div>
    <section className="works-inspector" aria-label="当前作品简介">
      <div className="works-inspector-top"><span>作品预览</span><span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
      <div className="works-image-stage" data-direction={direction}>
        {projects.map((item, index) => <img key={item.slug} src={item.cover}
          alt={active === index ? `${item.title}完整封面` : ''}
          aria-hidden={active !== index} data-active={active === index} />)}
      </div>
      <div className="works-inspector-copy" key={project.slug} data-direction={direction}>
        <p className="works-inspector-category">{project.category}{project.sample ? ' · 示例作品' : ''}</p>
        <h2>{project.title}</h2>
        <p className="works-inspector-description">{project.description}</p>
      </div>
      <Link className="works-detail-link" href={`/works/${project.slug}`} aria-label={`查看${project.title}详情`}>
        查看详情 <ArrowUpRight size={20} aria-hidden="true" />
      </Link>
    </section>
  </div>;
}
