'use client';
import { useId, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';
import { getProjectMarkdownContent, type Project } from '@/lib/portfolio';
import { ProjectMediaCarousel } from '@/components/project-media-carousel';
import { ProjectMarkdown } from '@/components/project-markdown';
import { ProjectMetrics } from '@/components/project-metrics';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);
export type ProjectOrigin = { x: number; y: number; width: number; height: number };
export function captureProjectOrigin(element: HTMLElement): ProjectOrigin {
  const rect = (element.querySelector('img') ?? element).getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

export function ProjectDetailDialog({ project, origin, onClose }: {
  project: Project | null; origin?: ProjectOrigin | null; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const titleId = useId();
  const descriptionId = useId();
  useGSAP(() => {
    const element = dialog.current!;
    if (!project) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    element.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    const rect = element.getBoundingClientRect();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = origin ? Math.max(.08, Math.min(.7, origin.width / rect.width, origin.height / rect.height)) : .94;
    const x = origin ? origin.x + origin.width / 2 - (rect.x + rect.width / 2) : 0;
    const y = origin ? origin.y + origin.height / 2 - (rect.y + rect.height / 2) : 12;
    const timeline = gsap.timeline({ onReverseComplete: () => closeCallback.current() });
    animation.current = timeline;
    timeline.fromTo(element, {
      x: reduced ? 0 : x, y: reduced ? 0 : y, scale: reduced ? 1 : scale,
      opacity: reduced ? 1 : 0, '--backdrop-opacity': 0,
    }, {
      x: 0, y: 0, scale: 1, opacity: 1, '--backdrop-opacity': 1,
      duration: reduced ? 0 : .62, ease: 'power3.inOut',
    });
    if (!reduced) timeline.fromTo(element.querySelector('.project-dialog-content'),
      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: 'power2.out' }, .28);
    return () => {
      animation.current = null;
      if (element.open) element.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, { scope: dialog, dependencies: [project, origin], revertOnUpdate: true });
  const close = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !animation.current || animation.current.progress() === 0) {
      onClose();
    } else animation.current.timeScale(1.5).reverse();
  };
  return (
    <dialog ref={dialog} className="project-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      {project && <article className="project-dialog-sheet">
        <div className="project-dialog-toolbar">
          <span>{project.category}{project.sample ? ' · 示例项目' : ''}</span>
          <button type="button" className="project-dialog-close" onClick={close} aria-label="关闭作品详情" autoFocus><X size={20} /></button>
        </div>
        <ProjectMediaCarousel title={project.title} cover={project.cover} gallery={project.gallery} compact />
        <div className="project-dialog-content">
          <h2 id={titleId}>{project.title}</h2>
          <p className="project-dialog-intro" id={descriptionId}>{project.description}</p>
          <ProjectMetrics metrics={project.metrics} />
          <div className="project-dialog-body">
            <aside><h3>技术栈</h3>
              {project.techStack?.length ? <ul className="project-tech">{project.techStack.map(tech => <li key={tech}>{tech}</li>)}</ul> : <p className="project-detail-muted">待补充</p>}
              {project.role && <><h3>我的角色</h3><p>{project.role}</p></>}
            </aside>
            <div className="project-story">
              <ProjectMarkdown content={getProjectMarkdownContent(project)} />
            </div>
          </div>
        </div>
      </article>}
    </dialog>
  );
}
