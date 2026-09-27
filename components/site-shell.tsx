'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const homeNavigation = [
  ['home', 'Home'],
  ['skills', 'Skills'],
  ['work', 'Work'],
  ['about', 'About'],
  ['contact', 'Contact'],
] as const;

export function Header({ minimal = false }: { minimal?: boolean }) {
  const path = usePathname();
  const header = useRef<HTMLElement>(null);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let lastY = window.scrollY;
    let frame = 0;
    let hidden = false;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      const beyondHero = y > window.innerHeight * 0.72;
      element.dataset.floating = String(beyondHero);
      if (!beyondHero || element.querySelector(':focus-visible')) {
        hidden = false;
      } else if (delta > 3) {
        hidden = true;
      } else if (delta < -3) {
        hidden = false;
      }
      element.dataset.hidden = String(hidden);

      if (path === '/') {
        const marker = y + window.innerHeight * 0.38;
        const sections = homeNavigation
          .map(([id]) => document.getElementById(id))
          .filter((section): section is HTMLElement => Boolean(section));
        let current = 'home';
        sections.forEach((section) => {
          const top = section.getBoundingClientRect().top + y;
          if (marker >= top) current = section.id;
        });
        setActive(current);
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onFocus = () => { element.dataset.hidden = 'false'; };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    element.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      element.removeEventListener('focusin', onFocus);
    };
  }, [path]);

  const linkFor = (id: string) => path === '/' ? `#${id}` : `/#${id}`;
  const navigateToAnchor = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (path !== '/' || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 20);
    history.replaceState(null, '', `#${id}`);
    requestAnimationFrame(() => window.scrollTo({ top, behavior: 'smooth' }));
    setActive(id);
  };

  return (
    <>
      <a className="skip" href="#main">跳到主要内容</a>
      <header ref={header} className={`header wrap${minimal ? ' header--minimal' : ' header--anchor'}`}>
        <Link href="/#home" className="logo" aria-label="王俊彬首页">
          <img className="brand-signature" src="/images/weioxabin-signature.png" alt="Weioxabin" width={2151} height={731} draggable={false} />
        </Link>
        {minimal ? (
          <Link className="back-home-link" href="/#home"><ArrowLeft size={15} /> Back home</Link>
        ) : (
          <nav className="main-nav" aria-label="页面导航">
            {homeNavigation.map(([id, label]) => (
              <Link key={id} href={linkFor(id)} className="nav-menu-link"
                aria-current={path === '/' && active === id ? 'location' : undefined}
                onClick={(event) => navigateToAnchor(event, id)}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer({ compact = false, hideCallout = false }: { compact?: boolean; hideCallout?: boolean }) {
  return (
    <footer className={`wrap footer${hideCallout ? ' footer--quiet' : ''}`}>
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
