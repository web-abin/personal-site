'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects, type Project } from '@/lib/portfolio';
import { ProjectDetailDialog, captureProjectOrigin, type ProjectOrigin } from '@/components/project-detail-dialog';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

export function WorksGallery() {
  const root = useRef<HTMLDivElement>(null);
  const origin = useRef<ProjectOrigin | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current!.querySelectorAll('.works-list-row'), {
        opacity: 0, y: 32, duration: 0.85, stagger: 0.085,
        delay: 0.12, ease: 'power3.out', clearProps: 'all',
      });
    });
    return () => media.revert();
  }, { scope: root });

  function openProject(project: Project, element: HTMLElement) {
    origin.current = captureProjectOrigin(element);
    setActive(null);
    setSelected(project);
  }

  return <>
    <div ref={root} className="works-directory">
      <h1 className="sr-only">我的作品</h1>
      <ol className="works-list" onMouseLeave={() => setActive(null)}>
        {projects.map((project, index) => <li className="works-list-row" key={project.slug}>
          <button type="button" className="works-list-link"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)} onBlur={() => setActive(null)}
            onClick={(event) => openProject(project, event.currentTarget)}
            aria-label={`查看${project.title}详情`}>
            <span className="works-list-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="works-list-title">{project.title}</span>
            {project.sample && <span className="works-list-sample">示例</span>}
            <ArrowUpRight className="works-list-arrow" aria-hidden="true" />
          </button>
        </li>)}
      </ol>
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
