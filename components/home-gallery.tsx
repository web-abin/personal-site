'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects, type Project } from '@/lib/portfolio';
import { ProjectDetailDialog, captureProjectOrigin, type ProjectOrigin } from '@/components/project-detail-dialog';
import { mountSpatialGallery } from '@/lib/spatial-gallery-controller';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

export function HomeGallery() {
  const origin = useRef<ProjectOrigin | null>(null);
  const openProject = (project: Project, element: HTMLElement) => {
    origin.current = captureProjectOrigin(element);
    setSelected(project);
  };
  const [selected, setSelected] = useState<Project | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useGSAP((context, contextSafe) => {
    const viewport = root.current;
    if (!viewport) return;
    const tiles = [...viewport.querySelectorAll<HTMLElement>('.spatial-tile')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const entrance = tiles.map(() => ({ progress: reduced.matches ? 1 : 0 }));
    const controller = mountSpatialGallery(viewport, entrance);
    let disposed = false;
    let departing = false;
    let departure: gsap.core.Tween | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopWaiting: (() => void) | undefined;
    const finish = () => {
      entrance.forEach((item) => { item.progress = 1; });
      controller.renderEntrance();
      delete viewport.dataset.entering;
    };
    const timeline = gsap.timeline({ paused: true, onUpdate: controller.renderEntrance, onComplete: finish });
    if (!reduced.matches) {
      viewport.dataset.entering = 'true';
      timeline.to(entrance, {
        progress: 1,
        duration: 1.4,
        ease: 'power3.out',
        stagger: (index: number) => Math.hypot(
          Number(tiles[index].dataset.column), Number(tiles[index].dataset.row),
        ) * 0.065,
      });
      // Decode before the reveal, with a deadline so slow imagery cannot block the entrance.
      const images = [...new Map([...viewport.querySelectorAll<HTMLImageElement>('img')].map(image => [image.src, image])).values()];
      const deadline = new Promise<void>((resolve) => {
        stopWaiting = resolve;
        timer = setTimeout(resolve, 1100);
      });
      Promise.race([Promise.allSettled(images.map((image) => image.decode())), deadline])
        .then(() => {
          clearTimeout(timer);
          if (!disposed && !departing && !reduced.matches) timeline.play(0);
        });
    }
    const collapse = contextSafe!((event: Event) => {
      event.preventDefault();
      departing = true;
      clearTimeout(timer);
      stopWaiting?.();
      timeline.pause();
      departure?.kill();
      controller.beginDeparture();
      viewport.dataset.departing = 'true';
      departure = gsap.to(entrance, {
        progress: 0, duration: 0.68, ease: 'power3.inOut',
        stagger: { amount: 0.18, from: 'edges' },
        onUpdate: controller.renderEntrance,
      });
    });
    const restore = contextSafe!(() => {
      departure?.kill();
      departing = false;
      delete viewport.dataset.departing;
      controller.cancelDeparture();
      finish();
    });
    viewport.addEventListener('gallery-collapse', collapse);
    viewport.addEventListener('gallery-restore', restore);
    const preferences = () => {
      if (reduced.matches) { timeline.kill(); finish(); }
    };
    reduced.addEventListener('change', preferences);
    return () => {
      disposed = true;
      clearTimeout(timer);
      stopWaiting?.();
      timeline.kill();
      departure?.kill();
      viewport.removeEventListener('gallery-collapse', collapse);
      viewport.removeEventListener('gallery-restore', restore);
      delete viewport.dataset.departing;
      reduced.removeEventListener('change', preferences);
      delete viewport.dataset.entering;
      controller.dispose();
    };
  }, { scope: root });
  return (
    <div className="home-gallery spatial-gallery" id="首页作品">
      <div ref={root} className="spatial-viewport" role="region"
        aria-label="三维作品墙，按住鼠标自由拖动；聚焦后方向键移动，Home 键复位"
        tabIndex={0}>
        <div className="spatial-world" aria-hidden="true">
          {Array.from({ length: 63 }, (_, slot) => {
            const column = slot % 9;
            const row = Math.floor(slot / 9);
            const project = projects[(column + row * 3) % projects.length];
            return (
              <div className="spatial-tile" data-column={column - 4}
                data-row={row - 3} key={slot}>
                <button type="button" onClick={(event) => openProject(project, event.currentTarget)} tabIndex={-1}
                  className="wall-image-link" draggable={false}
                  aria-label={`查看${project.title}详情`}>
                  <img src={project.cover} alt="" width={640} height={640}
                    draggable={false} decoding="async" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="spatial-zoom-plane" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => <div className="spatial-zoom-crop" key={index} />)}
        </div>
      </div>
      <div className="spatial-accessible-links">
        {projects.map((p) => (
          <button type="button" onClick={(event) => openProject(p, event.currentTarget)} key={p.slug}>{p.title}</button>
        ))}
      </div>
      <ProjectDetailDialog origin={origin.current} project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
