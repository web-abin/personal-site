import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomeScrollScenes } from '@/components/home-scroll-scenes';
import { Header, Footer } from '@/components/site-shell';
import { HeroScrollTitle } from '@/components/hero-scroll-title';
import { HomeGallery } from '@/components/home-gallery';
import SplashCursor from '@/components/splash-cursor';
import './home.css';

export default function Home() {
  return (
    <div className="home-redesign">
      <Header />
      <SplashCursor />
      <HomeScrollScenes>
        <section className="new-hero wrap" aria-labelledby="home-title">
          <div className="home-hero-meta">
            <span>王俊彬的个人空间</span>
            <span>经历 · 作品 · 探索</span>
          </div>
          <HomeGallery />
          <HeroScrollTitle>
            {/* <h1 id="home-title">
              学如逆水行舟<span></span>不进则退<span>。</span>
            </h1> */}
            <div className="hero-signature greeting-artwork">
              <img src="/images/hello-wang-junbin.png" alt="你好，我是王俊彬" width={2172} height={724} draggable={false} />
            </div>
          </HeroScrollTitle>
        </section>
        <section id="做事方式" className="home-method wrap">
          <div className="home-section-meta">
            <span>01 / 做事方式</span>
            <span>从想法到实现</span>
          </div>
          <h2>
            好的作品，
            <br />
            从认真对待<span>每一步</span>开始。
          </h2>
          <div className="method-progress" aria-hidden="true">
            <span />
          </div>
          <div className="method-rows">
            {[
              [
                '01',
                '理解问题',
                '先问为什么，再想怎么做。',
                '了解需求、梳理背景，让每一次实现有明确的方向。',
              ],
              [
                '02',
                '动手构建',
                '让想法，先成为可以使用的东西。',
                '从一个可运行的版本出发，在实际体验中发现问题。',
              ],
              [
                '03',
                '持续打磨',
                '细节里，藏着对体验的在意。',
                '逐步优化交互、结构与表达，让作品更加清晰、可靠。',
              ],
              [
                '04',
                '回看与成长',
                '留下过程，也留下新的问题。',
                '记录选择、验证结果，把每次实践变成下一次的经验。',
              ],
            ].map(([n, title, sub, description]) => (
              <article className="method-row" key={n}>
                <span className="method-number">{n}</span>
                <h3>{title}</h3>
                <div>
                  <h4>{sub}</h4>
                  <p>{description}</p>
                </div>
                <ArrowUpRight className="method-arrow" size={28} />
              </article>
            ))}
          </div>
        </section>
        <section className="home-story wrap" id="个人经历">
          <div className="home-section-meta">
            <span>02 / 我的经历</span>
            <Link href="/about">完整个人介绍 ↗</Link>
          </div>
          <div className="home-story-grid">
            <div className="story-heading">
              <h2>
                一路走来，
                <br />
                一直<span>向前。</span>
              </h2>
              <p>
                经历构成背景，作品留下足迹。
                <br />
                这里会逐步补齐我的个人故事。
              </p>
            </div>
            <div className="story-timeline">
              {[
                [
                  '现在',
                  '搭建自己的个人空间',
                  '整理经历、收集作品，也让下一次探索有地方安放。',
                ],
                [
                  '待补充',
                  '工作与项目经历',
                  '工作时间、岗位职责与个人贡献待补充。',
                ],
                [
                  '待补充',
                  '教育与学习经历',
                  '院校、专业、学习方向与相关经历待补充。',
                ],
              ].map(([date, title, desc]) => (
                <article key={title}>
                  <span>{date}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="home-about-panel wrap">
          <div className="about-placeholder" aria-label="个人照片占位区域">
            <span>个人影像 / 待补充</span>
            <strong>
              我<span>，</span>
              <br />
              不止一面<span>。</span>
            </strong>
            <div>未来在这里，放一张喜欢的照片。</div>
          </div>
          <div className="home-about-text">
            <span className="home-section-meta">03 / 作品之外</span>
            <h2>
              关于我，
              <br />
              也关于<span>好奇心。</span>
            </h2>
            <p>
              我希望你通过这里的作品，了解我的思考方式，也看到工作之外的我。
            </p>
            <div className="about-info-lines">
              <div>
                <span>技术栈</span>
                <span>语言、框架与工具待补充</span>
              </div>
              <div>
                <span>兴趣爱好</span>
                <span>喜欢的事物与日常待补充</span>
              </div>
              <div>
                <span>个人优势</span>
                <span>结合真实项目逐步完善</span>
              </div>
            </div>
            <Link href="/about" className="home-outline-link">
              进一步认识我 <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
        <section className="home-last-word wrap">
          <span>每一次相遇，都可能是新的开始。</span>
          <Link href="/about#contact">
            一起聊聊
            <ArrowUpRight />
          </Link>
        </section>
      </HomeScrollScenes>
      <Footer />
    </div>
  );
}
