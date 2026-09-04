'use client';

import { useRef, useState } from 'react';
import OptionWheel from '@/components/OptionWheel';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects, type Project } from '@/lib/portfolio';
import { ProjectDetailDialog, captureProjectOrigin, type ProjectOrigin } from '@/components/project-detail-dialog';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

const wheelItems = projects.map((project, index) => `${String(index + 1).padStart(2, '0')}  ${project.title}${project.sample ? ' · 示例' : ''}`);

export function WorksGallery() {
  const root = useRef<HTMLDivElement>(null);
  const origin = useRef<ProjectOrigin | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [active, setActive] = useState<number | null>(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current!.querySelectorAll('.works-wheel-stage'), {
        opacity: 0, y: 32, duration: 0.85, stagger: 0.085,
        delay: 0.12, ease: 'power3.out', clearProps: 'all',
      });
    });
    return () => media.revert();
  }, { scope: root });

  function openProject(project: Project, element: HTMLElement) {
    origin.current = captureProjectOrigin(element);
    setSelected(project);
  }

  return <>
    <div ref={root} className="works-directory">
      <h1 className="sr-only">我的作品</h1>
      <div className="works-wheel-stage">
        <OptionWheel items={wheelItems} defaultSelected={0}
          textColor="#92928e" activeColor="#eeeae1" side="left"
          fontSize={2.8} spacing={1.8} curve={1} tilt={8}
          blur={1.2} fade={0.2} minOpacity={0.25} smoothing={180}
          inset={48} loop={false} draggable
          onChange={(index: number) => setActive(index)}
          onActivate={(index: number, element: HTMLElement) => openProject(projects[index], element)}
        />
      </div>
      <div className="works-preview" aria-hidden="true" data-visible={active !== null && !selected}>
        {projects.map((project, index) => <div className="works-preview-slide" data-active={active === index} key={project.slug}>
          <img src={project.cover} alt="" />
          <div className="works-preview-caption"><span>{project.category}</span><span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
        </div>)}
      </div>
    </div>
    <ProjectDetailDialog origin={origin.current} project={selected} onClose={() => setSelected(null)} />
  </>;
}
