import { HomeScrollScenes } from '@/components/home-scroll-scenes';
import { Header } from '@/components/site-shell';
import { HomeGallery } from '@/components/home-gallery';
import { HomeStory } from '@/components/home-story';
import { HomePreloader } from '@/components/home-preloader';
import './home.css';

const loaderBootScript = `window.__homeLoaderFallback=window.setTimeout(function(){document.documentElement.classList.remove('home-loading');var loader=document.querySelector('.home-preloader');if(loader)loader.hidden=true},8000);`;

const loaderCriticalCss = `
html.home-loading{overflow:hidden}
.home-preloader{position:fixed;z-index:10000;inset:0;display:grid;place-items:center;color:#f1f0ec;cursor:wait}
.home-preloader[hidden]{display:none}
.home-preloader__curtain{position:absolute;inset:0;width:100%;height:100%}
.home-preloader__center{position:relative;z-index:1;width:92px;height:92px}
.home-preloader__core{position:absolute;top:50%;left:50%;display:block;width:8px;height:8px;border-radius:50%;background:#b8ff37;box-shadow:0 0 0 7px rgba(184,255,55,.07),0 0 25px rgba(184,255,55,.3);transform:translate(-50%,-50%);animation:home-loader-breathe 1.25s ease-in-out infinite}
.home-preloader__ring{position:absolute;top:50%;left:50%;display:block;border-radius:50%;background:conic-gradient(from 12deg,rgba(184,255,55,.88) 0 21%,transparent 21% 34%,rgba(184,255,55,.28) 34% 68%,transparent 68% 82%,rgba(184,255,55,.65) 82% 100%);transform:translate(-50%,-50%);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 1px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 1px),#000 0)}
.home-preloader__ring--inner{width:30px;height:30px;opacity:.9;animation:home-loader-spin-cw 1.35s linear infinite}
.home-preloader__ring--middle{width:54px;height:54px;opacity:.58;animation:home-loader-spin-ccw 2.05s linear infinite}
.home-preloader__ring--outer{width:82px;height:82px;opacity:.34;animation:home-loader-spin-cw 3.1s linear infinite}
@keyframes home-loader-breathe{50%{transform:translate(-50%,-50%) scale(.72);opacity:.58}}
@keyframes home-loader-spin-cw{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes home-loader-spin-ccw{to{transform:translate(-50%,-50%) rotate(-360deg)}}
@media(prefers-reduced-motion:reduce){.home-preloader__core,.home-preloader__ring{animation:none}}
`;

export default function Home() {
  return (
    <div className="home-redesign">
      <script dangerouslySetInnerHTML={{ __html: loaderBootScript }} />
      <style dangerouslySetInnerHTML={{ __html: loaderCriticalCss }} />
      <HomePreloader />
      <Header />
      <HomeScrollScenes>
        <section id="home" className="new-hero wrap" aria-labelledby="home-title">
          <HomeGallery />
          <div className="hero-intro">
            <p className="hero-kicker">Hi, I am</p>
            <h1 id="home-title">Junbin Wang</h1>
            <p className="hero-role">Creative Developer <span>&amp;</span> Product Builder</p>
            <a className="hero-work-link" href="#work">VIEW MY WORK <span aria-hidden="true">↘</span></a>
          </div>
          <p className="hero-scroll-cue" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></p>
        </section>
        <HomeStory />
      </HomeScrollScenes>
    </div>
  );
}
