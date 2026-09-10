import type { Metadata } from 'next';
import { Header } from '@/components/site-shell';
import { WorksGallery } from '@/components/works-gallery';
import { RevealPage } from '@/components/reveal-page';
import './works.css';

export const metadata: Metadata = { title: '我的作品', description: '浏览我的作品、项目与探索。' };
export default function Works() {
  return <div className="works-page"><Header minimal /><RevealPage id="main" className="wrap works-directory-page" aria-label="我的作品"><WorksGallery /></RevealPage></div>;
}
