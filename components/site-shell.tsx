'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);
// Preserve the pill position across page-level header remounts during navigation.
let pillPosition: { x: number; width: number } | undefined;
export function Header({ minimal = false }: { minimal?: boolean }) {
  const path = usePathname();
  const router = useRouter();
  const leaving = useRef(false);
  const header = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const scrollPosition = () => Math.max(0, Math.min(window.scrollY,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
    let lastY = scrollPosition();
    let accumulated = 0;
    let direction = 0;
    let frame = 0;
    element.dataset.hidden = 'false';
    element.dataset.floating = String(lastY > 32);
    const update = () => {
      frame = 0;
      const y = scrollPosition();
      const delta = y - lastY;
      lastY = y;
      element.dataset.floating = String(y > 32);
      if (y <= element.offsetHeight + 24 || element.querySelector(':focus-visible') || leaving.current) {
        element.dataset.hidden = 'false';
        accumulated = 0;
        direction = 0;
        return;
      }
      if (Math.abs(delta) < 0.5) return;
      const nextDirection = Math.sign(delta);
      if (direction !== nextDirection) accumulated = 0;
      direction = nextDirection;
      accumulated += Math.abs(delta);
      // Small touchpad movements should not make the navigation flicker.
      if (accumulated >= (direction > 0 ? 22 : 10)) {
        element.dataset.hidden = String(direction > 0);
        accumulated = 0;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onFocus = () => { element.dataset.hidden = 'false'; accumulated = 0; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    element.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      element.removeEventListener('focusin', onFocus);
      delete element.dataset.hidden;
      delete element.dataset.floating;
    };
  }, [path]);
  const { contextSafe } = useGSAP(() => {
    leaving.current = false;
    return () => { leaving.current = false; };
  }, { scope: nav, dependencies: [path], revertOnUpdate: true });
  const navigateToWorks = contextSafe((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href !== '/works' || path !== '/' || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const home = document.querySelector<HTMLElement>('.home-redesign');
    const main = home?.querySelector<HTMLElement>('main');
    if (!main) return;
    event.preventDefault();
    if (leaving.current) return;
    leaving.current = true;
    const gallery = main.querySelector<HTMLElement>('.home-gallery');
    // Reverse the wall's actual entrance positions, rather than shrinking the wrapper.
    const exit = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    const viewport = gallery?.querySelector<HTMLElement>('.spatial-viewport');
    const collapse = new Event('gallery-collapse', { cancelable: true });
    viewport?.dispatchEvent(collapse);
    if (!collapse.defaultPrevented && gallery) exit.to(gallery, { scale: 0, opacity: 0, duration: 0.8 }, 0);
    const title = main.querySelector<HTMLElement>('.new-hero-title');
    if (title) exit.to(title, { opacity:0, duration:0.25 }, 0);
    exit.to(main, { opacity: 0, duration: 0.16 }, 0.86);
    const branding = home?.querySelectorAll<HTMLElement>('.logo, .header-contact');
    if (branding?.length) exit.to(branding, { opacity: 0, duration: 0.25 }, 0);
    const footer = home?.querySelector<HTMLElement>('footer');
    if (footer) exit.to(footer, { opacity: 0, duration: 0.25 }, 0.22);
    exit.call(() => router.push('/works'));
    // Restore the current page if navigation fails or stalls; unmount reverts the context.
    gsap.delayedCall(4, () => {
      exit.revert();
      viewport?.dispatchEvent(new Event('gallery-restore'));
      leaving.current = false;
    });
  });
  useGSAP((context, contextSafe) => {
    const element = nav.current!;
    const pill = element.querySelector<HTMLElement>('.nav-active-pill')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = contextSafe!(() => {
      const active = element.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active) return;
      const target = { x: active.offsetLeft, width: active.offsetWidth };
      gsap.killTweensOf(pill);
      gsap.set(pill, {
        x: pillPosition?.x ?? target.x, width: pillPosition?.width ?? target.width,
        top: active.offsetTop, height: active.offsetHeight, autoAlpha: 1,
      });
      element.dataset.indicatorReady = 'true';
      gsap.to(pill, {
        ...target, duration: reduced.matches ? 0 : 0.42, ease: 'power3.out',
        onUpdate: () => {
          pillPosition = { x: Number(gsap.getProperty(pill, 'x')), width: Number(gsap.getProperty(pill, 'width')) };
        },
        onComplete: () => { pillPosition = target; },
      });
    });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    reduced.addEventListener('change', update);
    return () => { observer.disconnect(); reduced.removeEventListener('change', update); delete element.dataset.indicatorReady; };
  }, { scope: nav, dependencies: [path], revertOnUpdate: true });
  return (
    <>
      <a className="skip" href="#main">
        跳到主要内容
      </a>
      <header ref={header} className={`header wrap${minimal ? ' header--minimal' : ''}`}>
        {!minimal && <Link href="/" className="logo" aria-label="王俊彬 首页">
          <img className="brand-signature" src="/images/weioxabin-signature.png" alt="Weioxabin" width={2151} height={731} draggable={false} />
        </Link>}
        <nav ref={nav} className="main-nav" aria-label="主导航">
          <span className="nav-active-pill" aria-hidden="true" />
          {[
            ['/', '首页'],
            ['/works', '我的作品'],
            ['/about', '关于我'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={(event) => navigateToWorks(event, href)}
              className="nav-menu-link"
              aria-current={
                (href === '/' ? path === href : path.startsWith(href))
                  ? 'page'
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        {!minimal && <Link className="header-contact" href="/about#contact">
          <span>联系我</span><ArrowUpRight size={16} />
        </Link>}
      </header>
    </>
  );
}
export function Footer({ compact = false, hideCallout = false }: { compact?: boolean; hideCallout?: boolean }) {
  return (
    <footer className={`wrap footer${hideCallout ? ' footer--quiet' : ''}`}>
      {!compact && !hideCallout && <Link className="footer-title" href="/about#contact">
        好的连接，从一句你好开始。
        <ArrowUpRight />
      </Link>}
      <div className="footer-bottom">
        <span>© 2026 王俊彬</span>
        {!compact && <span>持续探索，持续创造。</span>}
        <span>个人作品集 / 持续更新</span>
      </div>
    </footer>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
