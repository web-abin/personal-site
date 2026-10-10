'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

const waitForImage = (image: HTMLImageElement) => {
  if (image.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
};

export function HomePreloader() {
  const root = useRef<HTMLOutputElement>(null);
  const hole = useRef<SVGCircleElement>(null);

  useGSAP((context, contextSafe) => {
    const element = root.current;
    const holeElement = hole.current;
    if (!element || !holeElement) return;

    document.documentElement.classList.add('home-loading');
    const fallbackTimer = (window as typeof window & { __homeLoaderFallback?: number }).__homeLoaderFallback;
    if (fallbackTimer) window.clearTimeout(fallbackTimer);

    let disposed = false;
    const reveal = contextSafe!(() => {
      if (disposed) return;
      const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 48;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set(element, { autoAlpha: 0 });
        element.hidden = true;
        document.documentElement.classList.remove('home-loading');
        return;
      }

      gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          element.hidden = true;
          document.documentElement.classList.remove('home-loading');
        },
      })
        .to('[data-home-loader-mark]', { scale: 1.34, autoAlpha: 0, duration: 0.34, ease: 'power3.out' }, 0)
        .to(holeElement, {
          attr: { r: radius },
          duration: 1.05,
          ease: 'power4.inOut',
        }, 0.12);
    });

    const windowLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
    const fontsLoaded = document.fonts?.ready?.then(() => undefined).catch(() => undefined) ?? Promise.resolve();
    const criticalImages = Array.from(document.querySelectorAll<HTMLImageElement>('.new-hero img'))
      .filter((image) => {
        const bounds = image.getBoundingClientRect();
        return bounds.right > 0 && bounds.left < window.innerWidth && bounds.bottom > 0 && bounds.top < window.innerHeight;
      });
    const resourcesReady = Promise.all([
      windowLoaded,
      fontsLoaded,
      Promise.all(criticalImages.map(waitForImage)),
      new Promise<void>((resolve) => window.setTimeout(resolve, 420)),
    ]);
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 5000));

    void Promise.race([resourcesReady, timeout]).then(reveal);

    return () => {
      disposed = true;
      document.documentElement.classList.remove('home-loading');
    };
  }, { scope: root });

  return (
    <output ref={root} className="home-preloader" aria-label="正在准备首页">
      <svg className="home-preloader__curtain" aria-hidden="true">
        <defs>
          <mask id="home-preloader-reveal">
            <rect width="100%" height="100%" fill="white" />
            <circle ref={hole} cx="50%" cy="50%" r="0" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#070707" mask="url(#home-preloader-reveal)" />
      </svg>
      <div className="home-preloader__center" data-home-loader-mark aria-hidden="true">
        <span className="home-preloader__ring home-preloader__ring--outer" />
        <span className="home-preloader__ring home-preloader__ring--middle" />
        <span className="home-preloader__ring home-preloader__ring--inner" />
        <span className="home-preloader__core" />
      </div>
    </output>
  );
}
