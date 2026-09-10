import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HomeScrollScenes } from '@/components/home-scroll-scenes';
import { Header, Footer } from '@/components/site-shell';
import { HeroScrollTitle } from '@/components/hero-scroll-title';
import { HomeGallery } from '@/components/home-gallery';
import { CapabilityMap } from '@/components/capability-map';
import './home.css';

export default function Home() {
  return (
    <div className="home-redesign">
      <Header />
      <HomeScrollScenes>
        <section className="new-hero wrap" aria-labelledby="home-title">
          <div className="home-hero-meta">
            <span>王俊彬的个人空间</span>
            <span>经历 · 作品 · 探索</span>
          </div>
          <HomeGallery />
          <HeroScrollTitle>
            <div className="hero-intro">
              <h1 id="home-title" className="hero-greeting-artwork">
                <img src="/images/hello-wang-junbin.png" alt="你好，我是王俊彬" width={2172} height={724} draggable={false} />
              </h1>
              <div className="hero-intro-foot">
                <p>在代码、产品与好奇心之间，持续做点有意思的东西。</p>
                <span aria-hidden="true">下滑浏览&nbsp; ↓
                </span>
              </div>
            </div>
          </HeroScrollTitle>
        </section>
        <section className="home-capabilities wrap" id="能力图谱" data-home-reveal data-home-timeline>
          <div className="home-section-meta">
            <span>01 / 能力图谱</span>
            <span>FULL-STACK × AI</span>
          </div>
          <div className="capability-heading" data-home-reveal-item>
            <h2>我的技术栈<span>。</span></h2>
            <p>FRONTEND / BACKEND / AGENT / DATA / DELIVERY</p>
          </div>
          <CapabilityMap />
        </section>
        <section className="home-strengths wrap" id="我的优势" data-home-reveal data-home-timeline>
          <div className="home-section-meta">
            <span>02 / 我的优势</span>
            <span>用作品和结果说话</span>
          </div>
          <div className="strengths-heading" data-home-reveal-item>
            <h2>我在意的，<br />不只是<span>把代码写完。</span></h2>
          </div>
          <div className="strength-grid">
            {[
              ['01', '从 0 到 1', 'PRODUCT · ARCHITECTURE · SHIP', '0→1'],
              ['02', '复杂系统可控', 'TRACE · VALIDATE · FALLBACK', 'CTRL'],
              ['03', '持续输出', 'OPEN SOURCE · WRITING · SHARE', '150+'],
            ].map(([number, title, proof, mark]) => (
              <article key={number} data-home-reveal-item>
                <span>{number}</span><strong>{mark}</strong><h3>{title}</h3><small>{proof}</small>
              </article>
            ))}
          </div>
        </section>
        <section id="做事方式" className="home-method wrap">
          <div className="home-section-meta">
            <span>03 / 做事方式</span>
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
                'WHY → WHAT',
              ],
              [
                '02',
                '动手构建',
                'MAKE IT WORK',
              ],
              [
                '03',
                '持续打磨',
                'MAKE IT RIGHT',
              ],
              [
                '04',
                '回看与成长',
                'LEARN → ITERATE',
              ],
            ].map(([n, title, sub]) => (
              <article className="method-row" key={n}>
                <span className="method-number">{n}</span>
                <h3>{title}</h3>
                <div>
                  <h4>{sub}</h4>
                </div>
                <ArrowUpRight className="method-arrow" size={28} />
              </article>
            ))}
          </div>
        </section>
        <section className="home-proof wrap" id="实践与写作" data-home-reveal data-home-timeline>
          <div className="home-section-meta">
            <span>04 / 实践与写作</span>
            <span>用时间积累，也用结果校验</span>
          </div>
          <div className="proof-grid">
            {[
              ['6', 'YEARS', '软件开发经验'],
              ['2', 'YEARS', 'AI 应用实践'],
              ['150+', 'ARTICLES', '技术写作'],
              ['2万+', 'USERS', '独立小游戏用户'],
            ].map(([value, unit, label]) => (
              <div key={label} data-home-reveal-item><strong>{value}</strong><span>{unit}</span><p>{label}</p></div>
            ))}
          </div>
          <div className="proof-note" data-home-reveal-item>
            <div>
              <a href="https://juejin.cn/user/994399097982728/posts" target="_blank" rel="noopener noreferrer">阅读我的文章 <ArrowUpRight size={18} /></a>
              <a href="https://github.com/web-abin" target="_blank" rel="noopener noreferrer">查看开源项目 <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </section>
        <section className="home-now wrap" id="最近在关注" data-home-reveal data-home-timeline>
          <div className="home-section-meta"><span>05 / 最近在关注</span><span>NOW / 2026</span></div>
          <div className="now-layout">
            <h2 data-home-reveal-item>保持好奇，<br />也保持<span>具体。</span></h2>
            <div className="now-list">
              {[
                ['01', 'Agent 可控执行'],
                ['02', 'RAG 链路评估'],
                ['03', 'MCP 与工具协议'],
                ['04', 'AI Native 研发'],
              ].map(([number, title]) => (
                <article key={number} data-home-reveal-item><span>{number}</span><h3>{title}</h3><ArrowUpRight size={20} /></article>
              ))}
            </div>
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
