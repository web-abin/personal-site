import type { ReactNode } from 'react';

/** Animation is owned by HomeScrollScenes so it shares the page's GSAP timeline. */
export function HeroScrollTitle({ children }: { children: ReactNode }) {
  return <div className="new-hero-title">{children}</div>;
}
