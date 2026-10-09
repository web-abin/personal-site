import type { Metadata } from 'next';
import { Header } from '@/components/site-shell';
import { WorksGallery } from '@/components/works-gallery';
import { RevealPage } from '@/components/reveal-page';
import { Ferrofluid } from '@/components/ferrofluid';
import './works.css';

export const metadata: Metadata = { title: '我的作品', description: '浏览我的作品、项目与探索。' };
export default function Works() {
  return <div className="works-page">
    <div className="works-fluid-background" aria-hidden="true">
      <Ferrofluid
        className="works-fluid-canvas"
        colors={['#11160d', '#354c22', '#8fc552', '#caff58']}
        speed={0.28}
        scale={1.18}
        turbulence={1.5}
        fluidity={0.16}
        rimWidth={0.25}
        sharpness={2.7}
        shimmer={1.3}
        glow={1.8}
        opacity={0.62}
        mouseStrength={1.55}
        mouseRadius={0.28}
        mouseDampening={0.1}
      />
    </div>
    <Header minimal />
    <RevealPage id="main" className="wrap works-directory-page" aria-label="我的作品"><WorksGallery /></RevealPage>
  </div>;
}
