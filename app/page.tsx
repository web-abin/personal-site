import { HomeScrollScenes } from '@/components/home-scroll-scenes';
import { Header } from '@/components/site-shell';
import { HomeGallery } from '@/components/home-gallery';
import { HomeStory } from '@/components/home-story';
import './home.css';

export default function Home() {
  return (
    <div className="home-redesign">
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
