'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);
// Preserve the pill position across page-level header remounts during navigation.
let pillPosition: { x: number; width: number } | undefined;
export function Header({ minimal = false }: { minimal?: boolean }) {
  const path = usePathname();
  const router = useRouter();
  const leaving = useRef(false);
  const nav = useRef<HTMLElement>(null);
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
    // Animate the gallery wrapper, leaving the spatial controller's tile transforms alone.
    const exit = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    if (gallery) exit.to(gallery, { scale: 0.58, rotation: 8, y: 0, opacity: 0, duration: 0.7 }, 0);
    exit.to(main, { opacity: 0, duration: 0.3 }, 0.4);
    const branding = home?.querySelectorAll<HTMLElement>('.logo, .header-contact');
    if (branding?.length) exit.to(branding, { opacity: 0, duration: 0.25 }, 0);
    const footer = home?.querySelector<HTMLElement>('footer');
    if (footer) exit.to(footer, { opacity: 0, duration: 0.25 }, 0.22);
    exit.call(() => router.push('/works'));
    // Restore the current page if navigation fails or stalls; unmount reverts the context.
    gsap.delayedCall(4, () => {
      exit.revert();
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
        ...target, duration: reduced.matches ? 0 : 0.65, ease: 'elastic.out(1, 0.65)',
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
      <header className={`header wrap${minimal ? ' header--minimal' : ''}`}>
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
export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="wrap footer">
      {!compact && <Link className="footer-title" href="/about#contact">
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
